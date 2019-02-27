// pages/xiugai/xiugai.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tomorrowtime:'',
    tomorrowshowlist:[],
    linshilist:[],//用来存储修改后的数据准备上传代替原有的数据
    linshiarr:{count:0,message:''},
    index:'',
    newlist:[],
    openid:'oAb7r4tb3B-ErO7e6gVX9Ejftgtk',
    counterId:''
  },
  jiequ:function(e){
    console.log(this.data.counterId);
    //console.log(e.target.dataset.index)
    //获取下标
    this.setData({
      index:e.target.dataset.index
    })
    //console.log(this.data.index)
    //截取下标开始的一个数据
    //console.log(this.data.tomorrowshowlist.slice(this.data.index,this.data.index+1));
  },
  //获取修改后的数据
  huoqu: function (e) {
    this.setData({
      newlist:e.detail.value
    })
    this.data.linshiarr.message=e.detail.value
    this.data.linshilist.splice(this.data.index,1,this.data.linshiarr)
    console.log(this.data.linshilist)
  },
  //上传用
  handle:function(e){
    console.log('上传')
    const db = wx.cloud.database()
    console.log(this.data.linshilist)
    db.collection('counters').doc(this.data.counterId).update({
      data: {
        list: this.data.linshilist
      },
      success: res => {
        console.log(this.data.linshilist)
      }
    })
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var tmtime = util.tomoTime(new Date())
    this.setData({
      tomorrowtime: tmtime
    })
    const db = wx.cloud.database()
    const that = this
    //获取明天事件
    db.collection('counters').where({
      _openid: this.data.openid,
      time: this.data.tomorrowtime
    }).get({
      success: res => {
        that.setData({
          tomorrowshowlist: res.data[0].list,
          linshilist:res.data[0].list,
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