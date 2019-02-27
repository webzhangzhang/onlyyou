// pages/xiugai/xiugai.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tomorrowtime:'',
    tomorrowshowlist:[],
    newlist:[]
  },
  //获取修改后的数据
  huoqu: function (e) {
    this.data.newlist.push(e.detail.value)
    console.log(this.data.newlist);
  },
  handle:function(){
    console.log(this.data.tomorrowshowlist[0])
    var a = this.data.tomorrowshowlist
    var b=a.splice(1,1)
    console.log(b);
    console.log(this.data.tomorrowshowlist)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var tmtime = util.tomoTime(new Date())
    this.setData({
      tomorrowtime: tmtime
    })
    //获取今天事件
    const db = wx.cloud.database()
    const that = this
    //获取明天事件
    db.collection('counters').where({
      _openid: this.data.openid,
      time: this.data.tomorrowtime
    }).get({
      success: res => {
        that.setData({
          tomorrowshowlist: res.data[0].list
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