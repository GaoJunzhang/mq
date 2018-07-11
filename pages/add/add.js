var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var start = year + '-' + month + '-' + day;
Page({  
  data: {
    name:'',
    isTime: 0,
    startDate: '',
    endDate:'',
    isLimit: 0,
    disabled: true,
    hidden: "hidden"
  },
  name: function (e) {   //获取input输入的值
    var that = this;
    that.setData({
      name: e.detail.value
    })
  },
  radioChange: function (e) {
    if (e.detail.value == "radio2") {
      this.setData({
        isTime: 1,
        hidden: ""
      })
    } else {
      this.setData({
        isTime: 0,
        hidden: "hidden",
        startDate:'',
        endDate:''
      })
    }
  },
  bindStartDateChange: function (e) {
    this.setData({
      startDate: e.detail.value,
      disabled: false,
    })
  },
  bindEndDateChange: function (e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  navigateBack: function () {
    wx.navigateBack()
  },
  listenerSwitch: function (e) {
    var that = this;
    if (e.detail.value){      
      that.setData({
        isLimit: 0
      })
    }else{
      that.setData({
        isLimit: 1
      })
    }
  },
  linkNav: function (e) {
    var that=this;  
    var name=that.data.name;
    var isTime = that.data.isTime;
    var startDate = that.data.startDate;
    var endDate = that.data.endDate;
    var isLimit = that.data.isLimit;
    if(name==''){
      wx.showToast({
        title: '请输入密圈名称',
        icon: 'loading',
        duration: 1000
      })
    }else{
      wx.navigateTo({
        url: '../add/des/des?name=' + name + '&isTime=' + isTime + '&startDate=' + startDate + '&endDate=' + endDate + '&isLimit=' + isLimit
      })
    }        
  }
  
});
