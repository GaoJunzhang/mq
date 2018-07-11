// pages/info/info.js
const app = getApp()
let id='';
const Util = require('../../utils/util.js');
var Session = require('../../lib/session');
var logins = require('../../lib/login');
let session = Session.get();
let isApply = '1';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    like:'0',
    count:'0',
    total:'3',
    bgColor:'',
    bgImg:'',
    totalPage:'1',
    isApply:'1',
    siGnSuccess:'',
    animationData: 3,
    startdate:'',
    enddate:'',
    boolDate:true,
    rows: [
      /*{
        "id": 1,
        "activityId": 24,//密圈主题id
        "createTime": "2018-02-07 15:19:40",//发表密一下时间
        "imgUrls": '',//图片        
        "music": "",//声音
        "content": "圈子里内容的标题放到前面，并用符号隔开，让大家看到里面一些内容,圈子里内容的标题放到前面，并用符号隔开，让大家看到里面一些内容",
        "isHide": "1",//是否匿名0是，1否    
        "userId": "",
        "nickName": "喜旧之人", 
        "wxUrl": "../../images/image/user.jpg",
        "signGreatSum": "1",//点赞总数
        "signCommentSum": "3",//评论总数
   		  "isGreat": "1"//是否点赞0是1否
      },
      {
        "id":2,
        "activityId": 1,//密圈主题id
        "createTime": "2018-02-07 15:19:40",//发表密一下时间
        "imgUrls": [
          {
            id: "01",
            imgUrl: "../../images/image/banner.jpg"
          },
          {
            id: "02",
            imgUrl: "../../images/image/banner1.jpg"
          },
          {
            id: "03",
            imgUrl: "../../images/image/banner.jpg"
          },
          {
            id: "04",
            imgUrl: "../../images/image/banner1.jpg"
          }
        ],//图片        
        "music": "",//声音
        "content": "",
        "isHide": "1",//是否匿名0是，1否    
        "userId": "",
        "nickName": "喜旧之人",
        "wxUrl": "../../images/image/user.jpg",
        "signGreatSum": "1",//点赞总数
        "signCommentSum": "3",//评论总数
        "isGreat": "0"//是否点赞0是1否
      },
      {
        "id": 3,
        "activityId": 1,//密圈主题id
        "createTime": "2018-02-07 15:19:40",//发表密一下时间
        "imgUrls": '',//图片        
        "music": "111",//声音
        "content": "",
        "isHide": "1",//是否匿名0是，1否    
        "userId": "",
        "nickName": "喜旧之人",
        "wxUrl": "../../images/image/user.jpg",
        "signGreatSum": "1",//点赞总数
        "signCommentSum": "3",//评论总数
        "isGreat": "1"//是否点赞0是1否
      }*/
    ]   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that=this;
    id = options.id;
    if (options.startdate<0){
      that.setData({
        boolDate:false
      });
    }
    that.setData({
      startdate: Util.getTime1(options.startdate / 1000),
      enddate: Util.getTime2(options.enddate / 1000),
    });
    //startdate = options.startdate;
    //enddate = options.enddate;
    // xx = options.startdate;   
    // yy = options.enddate;   
    console.log("startdate::::" + Util.getTime(options.startdate/1000));
    console.log("enddate::::" + Util.getTime(options.enddate/1000));

    if(options.isApply){
      isApply = options.isApply; 
    }
    that.setData({
      name: options.name,
      like: options.like,
      count: options.count,
      bgColor: options.color,
      isApply: isApply,
      bgImg: options.bgImg
    })
    let params={
      // sessionId: session.token,
      activityId: options.id,
      page:'0',
      size:'10'
    }
    app.fetchApis(that, '/signs', params, 'GET', function (res) {
      let list;
    
      /*if (page == '0') {
        list = [];
      } else {
        list = that.data.rows;
      }*/
      if (that.data.siGnSuccess){
        list = [];
      }else{
        list = that.data.rows;
      }
      if (res.data.rows) {
        for (var i = 0; i < res.data.rows.length; i++) {
          list.push(res.data.rows[i]);
      
          var description = "";
          for (var k = 0; k < list.length; k++) {
            for (var j in list[k]) {
              description += j + " ++ " + list[k][j] + "\n";
              console.log(description);
            }
          }

        }
        that.setData({
          total:list.length,
          rows: list
        });
      }
    });
  }, onShow: function () {
    // console.log(this.data.siGnSuccess)
    if (this.data.siGnSuccess){
      this.onLoad(this.options);
    }
  },
  navigateBack: function () {
    // wx.navigateBack()
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
      let _this = this;
      console.log(_this.data.bgImg)
      let shareObj = {
        title: _this.data.name,
        path: '/pages/info/info?id=' + id + '&name=' + this.data.name + '&like=' + this.data.like + '&count=' + this.data.count + '&color=' + this.data.bgColor+'&isApply=0',
        // path: '/pages/info/info?id=33&name=几节课就觉得&like=10&count=5&color=4',
        imageUrl: _this.data.bgImg,
        success: function (res) {
          console.log("转发成功！");
          // console.log(res);
        }
      }
      return shareObj;

    }
    return {
      title: '自定义转发标题',
      path: '/page/info/info?id='+id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },  
  acceptBtn:function(){
    let self = this;
    if(self.data.isApply=='1'){
      wx.navigateTo({
        url: '../comment/comment?orderId=' + id
      })
    }else{
      
      let params={
        activityId: id
      }
     
      app.fetchApis(self, '/saveActivityUsers', params, 'POST', function (res) {
        self.setData({
          isApply: '1'
        });
      })    
    }
  
  },
  onGotUserInfo: function (e) {
    let that = this;
    console.log(e)
    if (Session.get()) {
      let params = {
        activityId: id
      }

      app.fetchApis(that, '/saveActivityUsers', params, 'POST', function (res) {
        that.setData({
          isApply: '1'
        });
      })
    } else {
      logins.buttonLogin(e, function (res) {

      }); 
      console.log(id)
      setTimeout(function () {
        let params = {
          activityId: id
        }

        app.fetchApis(that, '/saveActivityUsers', params, 'POST', function (res) {
          that.setData({
            isApply: '1'
          });
        })
      }, 1800) //延迟时间 这里是1秒  
    }
     
  },
  //点击播放录音 
  gotoPlay: function (e) {
    var that = this;
    var filePath = e.currentTarget.dataset.key;
    // console.log(filePath)
    const innerAudioContext = wx.createInnerAudioContext()
    var dongxiao = setInterval(function () {
      var animation = parseInt(that.data.animationData);
      if (animation == 3) {
        animation = 1;
      } else {
        animation++;
      }
      that.setData({
        animationData: animation
      });
    }, 500)
    innerAudioContext.autoplay = true
    innerAudioContext.src = filePath
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onEnded(()=>{
      console.log('播放结束')
      // console.log(dongxiao)
      clearInterval(dongxiao)
      that.setData({
        animationData: 3
      });
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    // var filePath = e.currentTarget.dataset.key;
    // console.log(filePath)
    
    // //点击开始播放 
    // wx.showToast({
    //   title: '开始播放',
    //   icon: 'success',
    //   duration: 1000
    // })
    // wx.playVoice({
    //   filePath: filePath,
    //   success: function () {
    //     wx.showToast({
    //       title: '播放结束',
    //       icon: 'success',
    //       duration: 1000
    //     })
    //   }, fail: function (res) {
    //     wx.showToast({
    //       title: '播放失败',
    //       icon: 'success',
    //       duration: 1000
    //     })
    //   }
    // })
  },
  //图片点击事件
  biggerImg: function (e) {
      //获取当前图片的下表
      //数据源
      var img = e.currentTarget.dataset.src;
      var imgs = [];
      for(var i=0;i<img.length;i++){
        imgs.push(img[i].imgUrl)
      }
    wx.previewImage({
      //当前显示下表
      // current: pictures[index],
      //数据源
      urls: imgs
    })
  },
  commentUser: function (event){
    let that=this;
    let id = event.currentTarget.dataset.val;
    let isGreat = event.currentTarget.dataset.great;
    let index = event.currentTarget.dataset.index;
    let like = that.data.like;
    if (isGreat=='1'){
      let params = {signId: id};
      app.fetchApis(that, '/saveGreat', params, 'POST', function (res) {
        if (res.data.data.flag=='2'){
          that.data.rows[index].isGreat='0'
          that.data.rows[index].signGreatSum ++
          like++;
          that.setData({
            like: like,
            rows: that.data.rows
          });
          wx.showToast({
            title: '点赞成功',
            duration: 1000,
          })
        }
      })
    }else{
      wx.navigateTo({
        url: '../info/commentUser/commentUser?id=' + id
      })  
    }   
  },
  commentList: function (event) {  
    let id = event.currentTarget.dataset.val;
    wx.navigateTo({
      url: '../info/commentList/commentList?id=' + id
    })
  },
})
