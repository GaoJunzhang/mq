//index.js
//获取应用实例
let int,id;
const app = getApp();
let imgall=[];
let musicall = [];
// var Session = require('../../lib/session');
// let session = Session.get();
//录音功能start
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var tempFilePath;
// end
Page({
  data: {
    tempFilePath:'',
    activityId:id,
    content:'',    
    isHide:'0',
    callUser:'',
    isSpeaking: false,//是否正在说话 
    music: [],//音频数组 
    tempFilePaths:[],
    isShow: true,
    isShowImg:false,
    isShowVoices:false,
    animationData: 3,
    timeCount:'',
    callUser:[],
    img:[],
    isTa:'1',
    display:'',
    info: [
    //   {
    //   value: '0',
    //   logo: "../../../images/image/user.jpg",
    //   name: '喜旧之人'
    // }, {
    //   value: '1',
    //   logo: "../../../images/image/user.jpg",
    //   name: '喜旧之人'
    // },
    // {
    //   value: '2',
    //   logo: "../../../images/image/user.jpg",
    //   name: '喜旧之人'
    // },
    // {
    //   value: '3',
    //   logo: "../../../images/image/user.jpg",
    //   name: '喜旧之人',
    // }
    ],
    hasLocation: false,
    location: {
      longitude: '',
      latitude: '',
      name: ''
    }
  },
  onLoad: function (options) {
    let that = this;
    id = options.orderId; 
    musicall = [];
    imgall = []

  }, 
  navigateBack: function () {
    wx.navigateBack()
  },
  ta: function () {
    let that = this;
    that.setData({
      isTa:'0',
      display:'none'
    });   
    app.fetchApis(that, '/loadUserByActivitys', { activityId: id}, 'GET', function (res) {
    
      if (res.data.errorCode == 0) {
        console.log(res.data.data);
        that.setData({
          info: res.data.data
        });
      }
    })
  }, 
  checkChange: function (e) {
    let that = this
    that.setData({
      callUser: e.detail.value
    });    
  
  }, 
  cancel: function () {
    let self = this;
    self.setData({
      isTa: '1',
      callUser: '',
      display: 'block'
    });
  },
  ok: function () {
    let self = this;
    self.setData({
      isTa: '1',
      display: 'block'
    });
  },


  //保存图片
  chooseimage: function (e){   
    let self=this;  
    let voices = self.data.music;   
    let tempFilePaths = self.data.tempFilePaths;   
    if (voices == null || voices.length == 0) { 
      wx.chooseImage({
        count: 9, // 默认9  
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          for (var i in res.tempFilePaths) {
            let imgsrc = { tempFilePaths: res.tempFilePaths[i]};
            upload_file("upload", res.tempFilePaths[i], {}, image_upload, upload_fail, self.data.img);
            tempFilePaths = tempFilePaths.concat(imgsrc);

          }
          self.setData({
            tempFilePaths: tempFilePaths,
            isShow:false,
            isShowImg:true
          })
         // upload_file("", self.data.tempFilePaths, {}, success, fail);
        //   let tempFilePath = res.tempFilePaths[0];
        //   new AV.File('file-name', {
        //     blob: {
        //       uri: tempFilePath,
        //     },
        //   }).save().then(
        //     file => console.log(file.url())
        //     ).catch(console.error);
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '照片和录音只能选择一种',
        success: function (res) {}       
      }) 
    }    
  },
  addimage:function(){
    this.chooseimage();
  },
  countDown: function (that, count, time){
    that.setData({
      timeCount: time
    })   
    int =setTimeout(function () {
      count++;
      if (count>600){
        that.setData({
          isSpeaking: false,
        })
        clearInterval(int);
        wx.stopRecord(); 
      }else{
        if (count < 10) {
          time = '00:0' + count;
        } else if (count < 60 && count > 10) {
          time = '00:' + count;
        } else {
          time ='0'+ parseInt(count / 60)+':' + parseInt(count % 60);
        }
      }
      if (that.data.isSpeaking){

        that.countDown(that, count , time);
      }     
    }, 1000);
  },
  // 录音功能new-start
  touchdown: function () {
    let self = this;
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    self.setData({
      isSpeaking: true,
    })
    self.countDown(self, 1, '00:01'); 
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
      wx.showToast({
        title: '正在录音',
        icon: 'success',
        duration: 1000
      }) 
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },//停止录音
  touchup: function () {
    let self = this;
    recorderManager.stop();
    self.setData({
      isSpeaking: true,
    })
    
    recorderManager.onStop((res) => {
        console.log('停止录音', res.tempFilePath)
        upload_file("", res.tempFilePath, {}, music_success, upload_fail,self.data.music);
        wx.showToast({
              title: '恭喜!录音成功',
              icon: 'success',
              duration: 1000
        })
        self.setData({
          tempFilePath: res.tempFilePath,
          // music: voices,
          isShow: false,
          isShowVoices: true,
          isSpeaking: false
        }) 
    })
  },//播放声音
  gotoPlay: function (e) {
    var that = this;
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
    innerAudioContext.src = that.data.tempFilePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onEnded(() => {
      console.log('播放结束')
      console.log(dongxiao)
      clearInterval(dongxiao)
      that.setData({
        animationData: 3
      });
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  }, 
  delPlay: function (e) {
    let self = this;
    musicall = [];
    self.setData({
      isShow: true
    })
    
  },
  // new=end
  chooseLocation: function (e) {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude,
            name: res.name
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  contentInput:function(e){
    let that = this;
    that.setData({
      content:e.detail.value
    })
  },
  checkboxChange:function(e){
    let that = this;
    if (e.detail.value==0){
      that.setData({
        isHide:1
      })
    }else{
      that.setData({
        isHide: 0
      })
    }
  },
  bindSubmit:function(){
    let that=this;    
    let params={
      activityId:id,
      content:that.data.content,
      isHide: that.data.isHide,
      position:that.data.location.name,
      inviters: that.data.callUser,
      music: musicall,
      img:imgall,
    };
  
    app.fetchApis(that, '/saveSign', params, 'POST', function (res) {
      console.log(res)
      // wx.navigateBack({ changed: true });
      let pages = getCurrentPages();//当前页面
      let prevPage = pages[pages.length - 2];//上一页面
      prevPage.setData({//直接给上移页面赋值
        siGnSuccess: 'yes'
      });
      wx.navigateBack({//返回
        delta: 1,
        position: that.data.location.name,
      })
    });
  }
})

function upload_file(url, filePath, formData, success, fail,uploadvalue) {
  wx.uploadFile({
    url: app.globalData.API_URL + '/upload',
    filePath: filePath,
    name:"file",
    header: {
      'content-type': 'multipart/form-data'
    }, // 设置请求的 header
    formData: formData, // HTTP 请求中其他额外的 form data
    success: function (res) {
      if (res.statusCode == 200) {
        typeof success == "function" && success(uploadvalue,res.data);
      } else {
        typeof fail == "function" && fail(res);
      }
    },
    fail: function (res) {
      typeof fail == "function" && fail(res);
    }
  })
}
function image_upload(imgvalue,data){
  console.log(imgvalue, data)
  imgall=imgvalue;
  imgall.push(data);
}
function music_success(musicValue,data){
  musicall = musicValue;
  musicall.push(data);
}
function upload_fail(){
  wx.showToast("当前服务器已满，请稍后发表")
}