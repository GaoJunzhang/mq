var constants = require('./constants');
var utils = require('./utils');
var Session = require('./session');
var loginLib = require('./login');

var noop = function noop() { };

var buildSessionHeader = function buildSessionHeader() {
  var session = Session.get();
  var header = {};

  if (session && session.token) {
    header[constants.WX_HEADER_TOKEN] = session.token;
  }

  return header;
};

/***
 * @class
 * 表示请求过程中发生的异常
 */
var RequestError = (function () {
  function RequestError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.message = message;
  }

  RequestError.prototype = new Error();
  RequestError.prototype.constructor = RequestError;

  return RequestError;
})();

function request(options) {
  if (typeof options !== 'object') {
    var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
    throw new RequestError(constants.ERR_INVALID_PARAMS, message);
  }

  var requireLogin = options.login;
  var success = options.success || noop;
  var fail = options.fail || noop;
  var complete = options.complete || noop;
  var originHeader = options.header || {};

  // 成功回调
  var callSuccess = function () {
    success.apply(null, arguments);
    complete.apply(null, arguments);
  };

  // 失败回调
  var callFail = function (error) {
    fail.call(null, error);
    complete.call(null, error);
  };

  // 是否已经进行过重试
  var hasRetried = false;

  if (requireLogin) {
    doRequestWithLogin();
  } else {
    doRequest();
  }

  // 登录后再请求
  function doRequestWithLogin() {
    loginLib.login({ success: doRequest, fail: callFail });
  }

  // 实际进行请求的方法
  function doRequest() {
    var authHeader = buildSessionHeader();

    var data = utils.extend({},options.data,authHeader);
    options.data = data;

    wx.request(utils.extend({}, options, {
      success: function (response) {
        var data = response.data;
        var error, message;
        if (data) {
          console.log(data.errorCode)
          if (!data.errorCode || data.errorCode==0) {
            callSuccess.apply(null, arguments);
            return;
          } else if (data.errorCode == constants.CODE_USER_TOKEN_FAIL) {
            // 清除登录态
            Session.clear();

            if (!hasRetried) {
              hasRetried = true;
              doRequestWithLogin();
              return;
            }

            message = data.msg;
            error = new RequestError(data.errorCode, message);
          } else {
            message = data.msg;
            error = new RequestError(data.errorCode, message);
          }

        } else {
          message = '未知错误';
          error = new RequestError(-999, message);
        }
        callFail(error);
      },
      fail: callFail,
      complete: noop,
    }));
  };

};


function upload(options) {
  if (typeof options !== 'object') {
    var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
    throw new RequestError(constants.ERR_INVALID_PARAMS, message);
  }

  var requireLogin = options.login;
  var success = options.success || noop;
  var fail = options.fail || noop;
  var complete = options.complete || noop;
  var originHeader = options.header || {};

  // 成功回调
  var callSuccess = function () {
    success.apply(null, arguments);
    complete.apply(null, arguments);
  };

  // 失败回调
  var callFail = function (error) {
    fail.call(null, error);
    complete.call(null, error);
  };

  // 是否已经进行过重试
  var hasRetried = false;

  if (requireLogin) {
    doRequestWithLogins();
  } else {
    doRequests();
  }

  // 登录后再请求
  function doRequestWithLogins() {
    loginLib.login({ success: doRequest, fail: callFail });
  }

  // 实际进行请求的方法
  function doRequests() {
    var authHeader = buildSessionHeader();

    var data = utils.extend({}, options.data, authHeader);
    options.data = data;

    wx.uploadFile(utils.extend({}, options, {
      success: function (response) {
        var data = response.data;
        var error, message;
        if (data) {
          if (!data.errorCode || data.errorCode == 0) {
            callSuccess.apply(null, arguments);
            return;
          } else if (data.errorCode == constants.CODE_USER_TOKEN_FAIL) {
            // 清除登录态
            Session.clear();

            if (!hasRetried) {
              hasRetried = true;
              doRequestWithLogin();
              return;
            }

            message = data.msg;
            error = new RequestError(data.errorCode, message);
          } else {
            message = data.msg;
            error = new RequestError(data.errorCode, message);
          }

        } else {
          message = '未知错误';
          error = new RequestError(-999, message);
        }
        callFail(error);
      },

      fail: callFail,
      complete: noop,
    }));
  };

};

module.exports = {
  RequestError: RequestError,
  request: request,
  upload: upload,
  buildSessionHeader: buildSessionHeader
};