var app = getApp()
var Session = require('../../../lib/session');
var bgImg='';

Page({
  data: {
    tempFilePaths: ''
  
  },
  navigateBack: function () {
    console.log("中国大爷...sss");
    // wx.navigateTo({
    //   url: '../des/des?tempFilePaths=' + this.data.tempFilePaths 
    // });
  }, 
  test:function()
  {
    console.log("test...");
  }
})  