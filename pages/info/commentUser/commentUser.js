const app = getApp();
Page({
  data: {
    userList: [{
      id: '01',
      num:'1',
      user: [{
        id:'1',
        logo: "../../../../images/image/user.jpg"       
      }, {
        id: '2',
        logo: "../../../../images/image/user.jpg"
        }, {
          id: '2',
          logo: "../../../../images/image/user.jpg"
      }, {
        id: '2',
        logo: "../../../../images/image/user.jpg"
        }, {
          id: '2',
          logo: "../../../../images/image/user.jpg"
      }, {
        id: '2',
        logo: "../../../../images/image/user.jpg"
        }, {
          id: '2',
          logo: "../../../../images/image/user.jpg"
      }, {
        id: '2',
        logo: "../../../../images/image/user.jpg"
        }, {
          id: '2',
          logo: "../../../../images/image/user.jpg"
      }, {
        id: '2',
        logo: "../../../../images/image/user.jpg"
        }, {
          id: '2',
          logo: "../../../../images/image/user.jpg"
      }, {
        id: '2',
        logo: "../../../../images/image/user.jpg"
      }
      ]
    }]
  },
  onLoad: function (options) {
    let that = this;
    let id = options.id; 
    let params={
      signId:id
    };
    console.log(params)
    app.fetchApis(that, "/signHeads", params, 'GET', function (res) {
      console.log(res.data);
      that.setData({
        userList: res.data
      });
    })
  },
  navigateBack: function () {
    wx.navigateBack()
  }
});