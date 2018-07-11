const app = getApp();
let id='';
let targetUserId;
let signId = '';
Page({
  data: {
    pid: '01',
    releaseName:'',
    hidden:'0',
    tName:'',
    comments: [
      // {
      //   "id": 5,
      //   "logo": "../../../../images/image/user.jpg", 
      //   "ownerUserId": "o0KYl0S9wuV0kH3hmY2m9xF9Zbv8",
      //   "targetUserId": "",
      //   "content": "好厉害",
      //   "createrTime": "2018-02-07 16:14:37",
      //   "parentId": "",
      //   "parentType": "",
      //   "activityId": "",
      //   "ownerUserName": "十七",
      //   "targetUserName": "",
      //   "result": "",
      //   "msg": ""
      // },
      // {
      //   "id": 6,
      //   "ownerUserId": "o0KYl0S9wuV0kH3hmY2m9xF9Zbv9",//发布评论人id
      //   "targetUserId": "o0KYl0S9wuV0kH3hmY2m9xF9Zbv8",//被回复的人id
      //   "content": "好厉害",
      //   "createrTime": "2018-02-07 17:08:16",
      //   "parentId": "",
      //   "parentType": "",
      //   "activityId": "",
      //   "ownerUserName": "grant",//发布评论人
      //   "targetUserName": "十七",//被回复的人
      //   "result": "",
      //   "msg": ""
      // }
    ]
  },
  onLoad: function (options) {
    let that = this;
    signId = options.id;
    let params = {
      signId: signId
    }; 
    app.fetchApis(that, '/comments', params, 'GET', function (res) {
      if (res.data.data.comments){
        that.setData({
          pid: signId,
          comments: res.data.data.comments
        });
        console.log(that.comments)
      }
    })
  },
  navigateBack: function () {
    wx.navigateBack()
  }, 
  bindKeyInput: function (e) {
    this.setData({
      releaseName: e.detail.value
    })
  },
  /**
* 点击回复
*/
  bindReply: function (e) {
    let that = this;
    // id = e.currentTarget.id;
    // targetUserId = e.currentTarget.dataset.val;
    targetUserId = e.currentTarget.id;
    let tname = e.currentTarget.dataset.tname;
    that.setData({
      // pid:id,
      tName:tname,
      releaseName: ''
    });
  },
  bindSubmit:function(){
    let that = this;
    let params = {
      signId: signId,
      targetUserId: targetUserId,
      content: that.data.releaseName,
    };
    app.fetchApis(that, '/saveComment', params, 'POST', function (res) {
      that.setData({
        releaseName: ''
      });
      let pages = getCurrentPages();//当前页面
      let prevPage = pages[pages.length - 2];//上一页面
      prevPage.setData({//直接给上移页面赋值
        siGnSuccess: 'yes'
      });
      wx.navigateBack({//返回
        delta: 1
      })
    })
  }
})