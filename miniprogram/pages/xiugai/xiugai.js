// // pages/xiugai/xiugai.js

var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xiugaitime: '',//获取传递过来的时间
    xiugailength: '',//被修改的数据的长度
    showlist:[],//页面上显示的将要被修改的数据
    index: '',//将要被修改的数据的下标
    pinjielist: [],//获取新创建的事件
    isshow: 3,
    newindex: '',//控制添加事件按钮显示
    openid: '',
    counterId: ''
  },
  //获取将要修改数据的下标
  jiequ: function (e) {
    this.setData({
      index: e.target.dataset.index
    })
  },
  //获取修改后的数据
  huoqu: function (e) {
    //如果被修改的数据长度大于0才被存储，否则删除这条
    if (e.detail.value.length > 0) {
      this.data.showlist[this.data.index].message = e.detail.value
      this.setData({
        showlist:this.data.showlist
      })
    } else {
      this.data.showlist.splice(this.data.index, 1)
      this.setData({
        showlist: this.data.showlist
      })
    }
  },
  //添加事件数
  tianjia: function () {
    this.setData({
      isshow: this.data.isshow + 1,
      newindex: this.data.newindex + 1
    })
  },
  //获取新数据
  pinjie: function (e) {
    var linshi = { count: 0, message: e.detail.value }
    if (e.detail.value.length > 0) {
      this.data.pinjielist.push(linshi)
    }
  },
  //上传
  handle: function (e) {
    var all = this.data.showlist.concat(this.data.pinjielist)
    const db = wx.cloud.database()
    db.collection('counters').doc(this.data.counterId).update({
      data: {
        list: all
      },
      success: res => {
        console.log('上传成功')
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
    //获取传递过来的时间
    this.setData({
      xiugaitime: options.time
    })
    //根据时间获取对应的数据
    const db = wx.cloud.database()
    const that = this
    db.collection('counters').where({
      _openid: this.data.openid,
      time: this.data.xiugaitime
    }).get({
      success: res => {
        that.setData({
          showlist:res.data[0].list,
          counterId:res.data[0]._id,
          xiugailength:res.data[0].list.length,
          newindex: res.data[0].list.length

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