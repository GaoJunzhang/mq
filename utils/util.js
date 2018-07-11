function formatTime(date) {
  var date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [month, day].map(formatNumber).join('/')
}


//*月*日 hh:mm
function formatTimes(date) {
  var date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [month, day].map(formatNumber).join('月') + '日' + [hour, minute].map(formatNumber).join(':');
}
//yyyy-MM-dd hh:mm:ss
function formatTimeAll(date) {
  var date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + " " + [hour, minute, second].map(formatNumber).join(':');
}
//MM-dd hh:mm:ss
function formatTimeMonth(date) {
  var date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [month, day].map(formatNumber).join('-') + " " + [hour, minute, second].map(formatNumber).join(':');
}
// 类8/12原则
function formatMon(date) {
  var date = new Date(date)
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [month, day].map(formatNumber).join('/');
}
// 类2017/8/12原则
function formatYear(date) {
  var date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('/');
}


function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 验证是否为手机
function isMobile(str) {
  console.log(str);
  var reg = /^1[0-9]{10}$/
  return reg.test(str);
}
// 去除前后空格
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
// 格式化时间戳
function getTime(timestamp) {
  var time = arguments[0] || 0;
  var t, y, m, d, h, i, s;
  t = time ? new Date(time * 1000) : new Date();
  y = t.getFullYear();    // 年
  m = t.getMonth() + 1;   // 月
  d = t.getDate();        // 日

  h = t.getHours();       // 时
  i = t.getMinutes();     // 分
  s = t.getSeconds();     // 秒

  return [y, m, d].map(formatNumber).join('.');

}

// 格式化时间戳
function getTime1(timestamp) {
  var time = arguments[0] || 0;
  var t, y, m, d, h, i, s;
  t = time ? new Date(time * 1000) : new Date();
  y = t.getFullYear();    // 年
  m = t.getMonth() + 1;   // 月
  d = t.getDate();        // 日



  return y+"."+m+"."+d;

}

// 格式化时间戳
function getTime2(timestamp) {
  var time = arguments[0] || 0;
  var t, y, m, d, h, i, s;
  t = time ? new Date(time * 1000) : new Date();
  y = t.getFullYear();    // 年
  m = t.getMonth() + 1;   // 月
  d = t.getDate();        // 日

 

  return m+'.'+d;

}

// 显示自定义警告
function showSelfModal(self, msg, t = 2000) {
  self.setData({
    showSelfModal: true,
    errorMsg: msg
  });
  var expressTime = setTimeout(function () {
    clearTimeout(expressTime);
    self.setData({
      showSelfModal: false
    });
  }, t);
}
// 显示自定义通知
function showSelfNotice(self, msg, t = 2000) {
  self.setData({
    showSelfNotice: true,
    noticeMsg: msg
  });
  var expressTime = setTimeout(function () {
    clearTimeout(expressTime);
    self.setData({
      showSelfNotice: false
    });
  }, t);
}
function selfLoading() {
  let available = wx.canIUse('showLoading');
  if (available) {
    wx.showLoading({
      title: '加载中',
    })
  } else {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  }
}
function selfHideLoading() {
  let available = wx.canIUse('showLoading');
  if (available) {
    wx.hideLoading();

  } else {
    wx.hideToast();
  }
}


/** 
 * 毫秒数转换成YY/MM/DD HH:MM:SS格式 
 */
function getNowFormatDate(millsTime) {
  var day = new Date(millsTime);
  return day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate() ;
 
}  

module.exports = {
  formatTime: formatTime,
  formatTimes: formatTimes,
  isMobile: isMobile,
  trim: trim,
  showSelfModal: showSelfModal,
  showSelfNotice: showSelfNotice,
  selfLoading: selfLoading,
  selfHideLoading: selfHideLoading,
  getTime: getTime,
  getTime1: getTime1,
  getTime2: getTime2,
  formatMon: formatMon,
  formatTimeAll: formatTimeAll,
  formatYear: formatYear,
  formatTimeMonth: formatTimeMonth,
  getNowFormatDate: getNowFormatDate
}
