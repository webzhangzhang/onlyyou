//index.js
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    todaylength:0,
    tomorrowlength:0,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    todaytime:'',
    tomorrowtime:'',
    count:0,
    todayshowlist:[],
    tomorrowshowlist:[],
    counterId:''
  },
  //过往事件的显示与隐藏
  gotoguowang:function(){
    wx.navigateTo({
      url: '/pages/guowang/guowang',
    })
  },
  gotoweilai: function () {
    wx.navigateTo({
      url: '/pages/weilai/weilai',
    })
  },
  //跳转修改页面
  todaygotoxiugai:function(){
    if(this.data.todaylength>0){
      wx.navigateTo({
        url: '/pages/xiugai/xiugai?time=' + this.data.todaytime
      })
    }
  },
  tomorrowgotoxiugai:function(){
    if(this.data.tomorrowlength>0){
      wx.navigateTo({
        url: '/pages/xiugai/xiugai?time=' + this.data.tomorrowtime
      })
    }
  },
  changecount:function(){
    this.setData({
      count:false
    })
  },
  //点击划掉事件
  clickme:function(e){
    //获取下标,根据下标修改数据
    //修改todayshowlist中的count
    if (this.data.todayshowlist[e.target.dataset.index].count==0){
      this.data.todayshowlist[e.target.dataset.index].count =1
      this.setData({
        todayshowlist:this.data.todayshowlist
      })
    }else{
      this.data.todayshowlist[e.target.dataset.index].count = 0
      this.setData({
        todayshowlist: this.data.todayshowlist
      })
    }
    const db = wx.cloud.database()
    db.collection('counters').doc(this.data.counterId).update({
      data: {
        list: this.data.todayshowlist
      },
      success: res => {
        console.log('上传成功')
      }
    })

  },

  onLoad: function() {
    var TIME = util.formatTime(new Date())
    this.setData({
      todaytime: TIME,
    })
    var tmtime = util.tomoTime(new Date())
    if(tmtime=="2019-02-29"){
      tmtime="2019-03-01"
    }
    this.setData({
      tomorrowtime:tmtime
    })
    //获取今天事件
    const db = wx.cloud.database()
    const that=this
    //查询当前用户所有的 counters
    db.collection('counters').where({
      _openid: this.data.openid,
      time: this.data.todaytime
    }).get({
      success: res => {
        that.setData({
          todayshowlist:res.data[0].list,
          todaylength:res.data[0].list.length,
          counterId:res.data[0]._id
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
      //获取明天事件
    db.collection('counters').where({
      _openid: this.data.openid,
      time: this.data.tomorrowtime
    }).get({
      success: res => {
          that.setData({
            tomorrowshowlist: res.data[0].list,
            tomorrowlength: res.data.length,
            count: res.data[0].list.length
          })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
