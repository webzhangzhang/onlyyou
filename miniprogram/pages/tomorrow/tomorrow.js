// pages/ceshi/ceshi.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '',
    list: [[]],
    isshow: 3
  },

  //添加事件数
  tianjia: function () {
    this.setData({
      isshow: this.data.isshow + 1
    })
  },

  //获取input中的值
  huoqu: function (e) {
    // const db = wx.cloud.database()
    // db.collection('counters').add({
    // })
    console.log(e.detail.value);
    this.data.list[0].push(e.detail.value)
    console.log(this.data.list[0]);
  },

  //提交整体
  tijiao: function () {
    console.log(this.data.list);
    let db = wx.cloud.database()
    let data = { name: 'zhang', mes: '' }
    data.mes = this.data.list
    db.collection('counters').add({
      //这里写什么可以提交全局data中的mesage
      data,
      success: res => {
        wx.showToast({
          title: '提交成功',
          success: res => {
            wx.navigateTo({
              url: '/pages/index/index',
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var TIME = util.tomoTime(new Date());
    this.setData({
      time: TIME,
    });
    this.data.list.push(this.data.time)
    console.log(this.data.list[0]);
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