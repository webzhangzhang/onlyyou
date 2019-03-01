// pages/guowang/guowang.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guowanglist: [],
    linlist:[],
    todaytime: ''
  },
  //获取下标,通过修改changshu控住显示隐藏
  xiabiao:function(e){
    var a = e.target.dataset.index
    if(this.data.guowanglist[a].changshu==1){
      this.data.linlist[a].changshu = this.data.linlist[a].changshu + 1
      this.setData({
        guowanglist: this.data.linlist,
        changshu:this.data.guowanglist[a].changshu
      })
    }else{
      this.data.linlist[a].changshu = this.data.linlist[a].changshu - 1
      this.setData({
        guowanglist: this.data.linlist,
        changshu: this.data.guowanglist[a].changshu
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var TIME = util.formatTime(new Date())
    this.setData({
      todaytime: TIME,
    })
    //获取过往事件
    const db = wx.cloud.database()
    db.collection('counters').where({
      _openid: this.data.openid,
      time: db.command.lt(this.data.todaytime)
    }).get({
      success: res => {
        this.setData({
          guowanglist: res.data,
          linlist:res.data
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