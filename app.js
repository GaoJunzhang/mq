//app.js
const Util = require('./utils/util.js');
var qcloud = require('./index.js');
var constants = require('./lib/constants');
var utils = require('./lib/utils');
var Session = require('./lib/session');
let session = Session.get();
var loginLib = require('./lib/login');

App({
  globalData: {
    hasLogin: false,
    tag:1,
    name:'',
    isTime: 0,
    startDate: '',
    endDate: '',
    isLimit: 0
  },
  onLaunch: function () {
    
  },
  
  fetchApis(pageSelf = '', url, params, POST, success = (res) => { }, actionError = (res) => { }, fail = (res) => { }) {
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中',
    })
    let self = this;
    // qcloud.setLoginUrl(`${self.globalData.API_URL}/getSession`);
    // qcloud.setDataUrl(`${self.globalData.API_URL}/decodeUserInfo`);
    qcloud.setLoginUrl(this.globalData.API_URL + '/getSession');
    qcloud.setDataUrl(this.globalData.API_URL + '/decodeUserInfo');
    console.log(params);
    qcloud.request({
      login: true,
      url: `${self.globalData.API_URL}${url}`,
      method: POST,
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: params,
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.hideLoading();
        success(res);
      },
      fail: function (err) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.hideLoading()
        Util.showSelfModal(pageSelf, err.message);
        fail(err);
      }
    });
  },
  globalData: {
    userInfo: null,
    API_URL: 'https://xiao.qingheshe.com'
  }
})