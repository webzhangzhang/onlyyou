// pages/ceshi/ceshi.js
var util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tomorrowtime: '',
    tijiaolist: [],
    huoqulist:[],
    isshow: 3,
    _openid:'oAb7r4tb3B-ErO7e6gVX9Ejftgtk',
    counterId:''
  },

  //添加事件数
  tianjia: function () {
    this.setData({
      isshow: this.data.isshow + 1
    })
  },

  //获取input中的值放到tijiaolist中
  huoqu: function (e) {
    this.data.tijiaolist.push(e.detail.value)
    console.log(this.data.tijiaolist);
  },

  //提交整体
  tijiao: function () {
    const db = wx.cloud.database()
    console.log(this.data.counterId);
    console.log(this.data._openid);
    const huoqulist = this.data.tijiaolist
    db.collection('counters').doc(this.data.counterId).update({
      data: {
        list: huoqulist
      },
      success: res => {
        this.setData({
          count: newCount
        })
      },
      fail: err => {
        icon: 'none',
          console.error('[数据库] [更新记录] 失败：', err)
      }
    })
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var TIME = util.tomoTime(new Date())
    this.setData({
      tomorrowtime: TIME,
    })
    //获取openid
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }

    //页面加载创建数据库信息
    const db = wx.cloud.database()
    var list = this.data.list
    db.collection('counters').add({
      data: {
        list, time: TIME
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })
        // wx.showToast({
        //   title: '新增记录成功',
        // })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})