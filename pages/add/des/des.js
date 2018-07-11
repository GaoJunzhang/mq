// pages/add/des/des.js
var app = getApp()
var Session = require('../../../lib/session');
let session = Session.get();
var content = "";
Page({
  data: {
    name: '',
    isTime: 0,
    startDate: '',
    endDate: '',
    isLimit: 0,
    bgColor: '1',
    bgImg: '',
    content: '输入密圈简介',
    tempFilePaths: '',
    uploudImageShow: false,
    focus: false,
    isTag: '1',

    id: 'cropper',
    width: 750,
    height: 410,
    minScale: 1,
    maxScale: 2.5,
    minRotateAngle: 45, //判断发生旋转的最小角度
    src: '../../../images/image/t3.jpg'
  },
  getDevice() {
    let self = this;
    !self.device && (self.device = wx.getSystemInfoSync());
    return self.device;
  },
  onLoad: function (option) {
    console.log("option:" + option);

    if (typeof option != 'undefined') {
      this.setData({
        name: option.name,
        isTime: option.isTime,
        startDate: option.startDate,
        endDate: option.endDate,
        isLimit: option.isLimit
      });
      app.globalData.name = option.name;
      app.globalData.isTime = option.isTime;
      app.globalData.startDate = option.startDate;
      app.globalData.endDate = option.endDate;
      app.globalData.isLimit = option.isLimit;
    } else {
      console.log("来到这里:" + this.name);
      console.log("全局name:" + app.globalData.name);

      //this.setData({ name: app.globalData.name});
      this.setData({
        name: app.globalData.name,
        isTime: app.globalData.isTime,
        startDate: app.globalData.startDate,
        endDate: app.globalData.endDate,
        isLimit: app.globalData.isLimit
      });
    }
    console.log("加载哈哈.");
    let self = this;
    let { src } = self.data;
    console.log(src);
    self.initCanvas(src);
    GetCoverList(self);
  },
  chooseCover: function (e) {
    var self = this
    self.setData({
      bgImg: e.currentTarget.dataset.imgurl
    });
    self.setData({
      uploudImageShow: false
    });
  },
  //目前在用的上传图片的函数
  chooseImg: function () {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        self.setData({
          src: tempFilePaths[0]
        });
        self.onLoad();


        /*
        //选择图片马上上传
        let { id } = self.data

        wx.canvasToTempFilePath({
          canvasId: id,
          success(res) {
            console.log('地址:' + res.tempFilePath);



            wx.uploadFile({
              url: app.globalData.API_URL + "/upload",
              filePath: res.tempFilePath,
              name: 'file',
              formData: {
                sessionId: 'session.token'
              },
              success: function (res) {
                /*_this.setData({
                  gImg: res.data
                })*/

        /*
          console.log("上传成功");
          console.log(res.data);

          self.setData({
            src: res.data
          });
          self.onLoad();
        },
        fail: function (res) {
          console.log("上传失败");
          console.log(res);
        }
      })
    }
  })*/
      }
    })
  },
  initCanvas(src) {
    let self = this
    wx.getImageInfo({
      src,
      success(res) {
        let { id, width, height } = self.data
        let device = self.getDevice()
        let aspectRatio = res.height / res.width

        self.aspectRatio = aspectRatio
        self.cropperTarget = src
        //裁剪尺寸
        self.cropperWidth = width * device.windowWidth / 750
        self.cropperHeight = height * device.windowWidth / 750

        var minRatio = res.height / self.cropperHeight
        if (minRatio > res.width / self.cropperWidth) {
          minRatio = res.width / self.cropperWidth
        }
        //图片放缩的尺寸
        self.scaleWidth = res.width / minRatio
        self.scaleHeight = res.height / minRatio
        self.initScaleWidth = self.scaleWidth
        self.initScaleHeight = self.scaleHeight
        //canvas绘图起始点（注意原点会被移动到canvas区域的中心）
        if (self.cropperWidth < self.scaleWidth) {
          self.startX = (self.cropperWidth - self.scaleWidth) / 2 - self.cropperWidth / 2
          self.startY = -self.cropperHeight / 2
        } else {
          self.startX = -self.cropperWidth / 2
          self.startY = (self.cropperHeight - self.scaleHeight) / 2 - self.cropperHeight / 2
        }

        self.oldScale = 1
        self.rotate = 0 //单位：°

        //  画布绘制图片
        self.ctx = wx.createCanvasContext(id)
        self.ctx.translate(self.cropperWidth / 2, self.cropperHeight / 2)
        //self.scaleWidth=self.scaleWidth-24
        self.ctx.drawImage(src, self.startX, self.startY, self.scaleWidth, self.scaleHeight)
        self.ctx.draw()
      }
    })
  },
  //  图片手势初始监测
  uploadScaleStart(e) {
    let self = this
    let xMove, yMove
    let [touch0, touch1] = e.touches
    self.touchNum = 0 //初始化，用于控制旋转结束时，旋转动作只执行一次

    //计算第一个触摸点的位置，并参照该点进行缩放
    self.touchX = touch0.x
    self.touchY = touch0.y
    self.imgLeft = self.startX
    self.imgTop = self.startY

    // 单指手势时触发
    e.touches.length === 1 && (self.timeOneFinger = e.timeStamp)

    // 两指手势触发
    if (e.touches.length >= 2) {
      self.initLeft = self.imgLeft / self.oldScale
      self.initTop = self.imgTop / self.oldScale

      //计算两指距离
      xMove = touch1.x - touch0.x
      yMove = touch1.y - touch0.y
      self.oldDistance = Math.sqrt(xMove * xMove + yMove * yMove)
      self.oldSlope = yMove / xMove
    }

    console.log("uploadScaleStart...");
  },
  //图片手势动态缩放
  uploadScaleMove: function (e) {
    var self = this
    fn(self, e)
    // drawOnTouchMove(self, e)

    console.log("uploadScaleMove...");
  },
  uploadScaleEnd(e) {
    let self = this
    self.oldScale = self.newScale || self.oldScale
    self.startX = self.imgLeft || self.startX
    self.startY = self.imgTop || self.startY
    //此处操作目的是防止旋转发生两次
    self.touchNum = self.touchNum + 1
    if (self.touchNum >= 2) {
      console.log('oldSlope:' + self.oldSlope)
      var includedAngle = Math.atan(
        Math.abs(
          (self.newSlope - self.oldSlope) / (1 - self.newSlope * self.oldSlope)
        )
      ) //夹角公式
      if (includedAngle > self.data.minRotateAngle * Math.PI / 180) {
        var direction = self.newSlope > self.oldSlope ? 1 : -1 //旋转方向
        //旋转角度，范围{0,90,180,270}
        self.rotate = ((self.rotate + direction * 90) % 360 + 360) % 360
        console.log('rotate:' + self.rotate)
        self.ctx.translate(self.cropperWidth / 2, self.cropperHeight / 2)
        self.ctx.rotate(self.rotate * Math.PI / 180)
        self.ctx.drawImage(self.cropperTarget, self.imgLeft, self.imgTop, self.scaleWidth, self.scaleHeight + 24)
        self.ctx.draw()
      }

      console.log("uploadScaleEnd...");
    }
  },

  //裁剪并上传
  getCropperImage() {
    let self = this
    let { id } = self.data
    console.log(id)

    wx.canvasToTempFilePath({
      canvasId: id,
      success(res) {
        console.log('地址:' + res.tempFilePath);
        wx.uploadFile({
          url: app.globalData.API_URL + "/upload",
          filePath: res.tempFilePath,
          name: 'file',
          formData: {
            sessionId: 'session.token'
          },
          success: function (res) {
            /*_this.setData({
              gImg: res.data
            })*/


            console.log("上传成功");
            console.log(res.data);

            self.setData({
              bgImg: res.data
            })
            self.setData({
              src: res.data
            });
            self.onLoad();

            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })


          },
          fail: function (res) {
            console.log("上传失败");
            console.log(res);
          }
        })
        self.setData({
          uploudImageShow: false
        });
        /* wx.saveImageToPhotosAlbum({
           filePath: res.tempFilePath,
         })
 
         self.setData({
           src: res.tempFilePath
         })
         */

        // wx.previewImage({
        //   current: '', // 当前显示图片的http链接
        //   urls: [res.tempFilePath], // 需要预览的图片http链接列表
        // })
      }
    })
  },
  getCropperImage2() {
    let self = this
    let { src } = self.data;
    console.log(src);
    wx.uploadFile({
      url: app.globalData.API_URL + "/upload",
      filePath: src,
      name: 'file',
      formData: {
        sessionId: 'session.token'
      },
      success: function (res) {
        /*_this.setData({
          gImg: res.data
        })*/


        console.log("上传成功");
        console.log(res.data);

        self.setData({
          bgImg: res.data
        })
        self.setData({
          src: res.data
        });
        self.onLoad();

        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 1000
        })


      },
      fail: function (res) {
        console.log("上传失败");
        console.log(res);
      }
    })
    self.setData({
      uploudImageShow: false
    });
  },

  themeChange: function (e) {
    var index = e.currentTarget.id;
    this.setData({
      bgColor: index
    })
  },
  addImage: function () {
    this.setData({ isTag: '2' });
    this.setData({
      uploudImageShow: true
    }, function () {
      console.log("回调");
      app.globalData.tag = 2;
      console.log("全局标志:" + app.globalData.tag);
    })
  },
  test: function () {
    console.log("ddd:" + this.uploudImageShow);
  },
  navigateBack: function () {
    console.log(this.uploudImageShow);
    this.setData({
      uploudImageShow: false
    });
    console.log("okiok...");
    console.log("没进去:" + app.globalData.tag);
    if (app.globalData.tag == 2) {
      app.globalData.tag = 1;
    } else if (app.globalData.tag == 1) {
      wx.navigateBack();
    } else {
      wx.navigateBack();
    }

  }, //原来的老选择函数
  chooseimage: function () {
    var _this = this;

    wx.chooseImage({
      count: 9, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        console.log("返回数据:" + res.tempFilePaths);

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        _this.setData({
          src: tempFilePaths[0]
        });
        self.onLoad();

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  

        _this.setData({
          tempFilePaths: res.tempFilePaths
        })
        wx.uploadFile({
          url: app.globalData.API_URL + "/upload",
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            sessionId: 'session.token'
          },
          success: function (res) {
            _this.setData({
              bgImg: res.data
            })
          },
          fail: function (res) {
            console.log("上传失败");
          }
        })
      }
    })
  },
  bindButtonTap: function () {
    this.setData({
      focus: true,
      content: ''
    })
  },
  bindKeyInput: function (e) {
    content += e.detail.value;
    this.setData({
      content: e.detail.value
    })
  },
  bindTextAreaBlur: function (e) {
    var that = this;

    // that.setData({
    //   content: e.detail.value
    // })
  },
  onShareAppMessage: function (ops) {
    let that = this;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      // console.log(ops.target)
    }
    return {
      title: that.data.name,
      path: 'pages/index/index',
      imageUrl: that.data.bgImg,
      success: function (res) {
        withShareTicker: true
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  formSubmit: function () {
    let that = this;
    // let sessionId = session.token
    let params = {
      // sessionId: sessionId,
      name: that.data.name,
      isTime: that.data.isTime,
      startDate: that.data.startDate,
      endDate: that.data.endDate,
      isLimit: that.data.isLimit,
      bgColor: that.data.bgColor,
      bgImg: that.data.bgImg,
      content: that.data.content
    };
    console.log(params)
    app.fetchApis(that, '/saveActivity', params, 'POST', function (res) {
      if (res.errorCode == 40008) {
        wx.showToast({
          title: '用户身份已过期',
          icon: 'loading',
          duration: 1000
        })
      } else {
        wx.navigateTo({
          url: '../../index/index'
        })
      }
    });
  },

})



/**
 * fn:延时调用函数
 * delay:延迟多长时间
 * mustRun:至少多长时间触发一次
 */
var throttle = function (fn, delay, mustRun) {
  var timer = null,
    previous = null;

  return function () {
    var now = +new Date(),
      context = this,
      args = arguments;
    if (!previous) previous = now;
    var remaining = now - previous;
    if (mustRun && remaining >= mustRun) {
      fn.apply(context, args);
      previous = now;
    } else {
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);

    }
  }
}

function drawOnTouchMove(self, e) {
  console.log('run drawOnTouchMove')
  let { minScale, maxScale } = self.data
  let [touch0, touch1] = e.touches
  let xMove, yMove, newDistance, newSlope

  if (e.timeStamp - self.timeOneFinger < 100) {//touch时长过短，忽略
    return
  }

  // 单指手势时触发
  if (e.touches.length === 1) {
    //计算单指移动的距离
    xMove = touch0.x - self.touchX
    yMove = touch0.y - self.touchY
    //转换移动距离到正确的坐标系下
    var tempX = xMove, tempY = yMove
    if (self.rotate == 90) {
      xMove = tempY
      yMove = -tempX
    } else if (self.rotate == 180) {
      xMove = -tempX
      yMove = -tempY
    } else if (self.rotate == 270) {
      xMove = -tempY
      yMove = tempX
    }

    self.imgLeft = self.startX + xMove
    self.imgTop = self.startY + yMove

    avoidCrossBorder(self)

    self.ctx.translate(self.cropperWidth / 2, self.cropperHeight / 2)
    self.ctx.rotate(self.rotate * Math.PI / 180)
    self.ctx.drawImage(self.cropperTarget, self.imgLeft, self.imgTop, self.scaleWidth, self.scaleHeight)
    self.ctx.draw()
  }
  // 两指手势触发
  if (e.touches.length >= 2) {
    // self.timeMoveTwo = e.timeStamp
    // 计算二指最新距离
    xMove = touch1.x - touch0.x
    yMove = touch1.y - touch0.y
    newDistance = Math.sqrt(xMove * xMove + yMove * yMove)
    self.newSlope = yMove / xMove

    //  使用0.005的缩放倍数具有良好的缩放体验
    self.newScale = self.oldScale + 0.005 * (newDistance - self.oldDistance)

    //  设定缩放范围
    self.newScale <= minScale && (self.newScale = minScale)
    self.newScale >= maxScale && (self.newScale = maxScale)

    self.scaleWidth = self.newScale * self.initScaleWidth
    self.scaleHeight = self.newScale * self.initScaleHeight
    self.imgLeft = self.newScale * self.initLeft
    self.imgTop = self.newScale * self.initTop

    avoidCrossBorder(self)

    self.ctx.translate(self.cropperWidth / 2, self.cropperHeight / 2)
    self.ctx.rotate(self.rotate * Math.PI / 180)
    self.ctx.drawImage(self.cropperTarget, self.imgLeft, self.imgTop, self.scaleWidth, self.scaleHeight)
    self.ctx.draw()
  }
}
//防止图片超出canvas边界
function avoidCrossBorder(self) {
  if (self.imgLeft < -(self.scaleWidth - self.cropperWidth / 2)) {
    self.imgLeft = -(self.scaleWidth - self.cropperWidth / 2)
  } else if (self.imgLeft > -self.cropperWidth / 2) {
    self.imgLeft = -self.cropperWidth / 2
  }
  if (self.imgTop < -(self.scaleHeight - self.cropperHeight / 2)) {
    self.imgTop = -(self.scaleHeight - self.cropperHeight / 2)
  } else if (self.imgTop > -self.cropperHeight / 2) {
    self.imgTop = -self.cropperHeight / 2
  }
}
//为drawOnTouchMove函数节流
const fn = throttle(drawOnTouchMove, 100, 100)

//请求封面图方法
var GetCoverList = function (that) {
  app.fetchApis(that, "/getResourceList", {}, 'GET', function (res) {
    console.log(res.data.data);
    that.setData({
      coverList: res.data.data
    });
  });
}
