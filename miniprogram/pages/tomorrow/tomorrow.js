// pages/ceshi/ceshi.js
var util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todaytime:'',
    todaylength:0,
    tomorrowtime: '',
    tijiaolist: [],
    resdatalength:'',
    huoqulist:[],
    isshow: 3,
    _openid:'',
    counterId:''
  },
  //获取修改的时间
  bindDateChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      todaytime: e.detail.value,
      tomorrowtime:e.detail.value
    })
  },
  //添加事件数
  tianjia: function () {
    this.setData({
      isshow: this.data.isshow + 1
    })
  },

  //获取input中的值放到tijiaolist中
  huoqu: function (e) {
    var linshi={count:0,message:e.detail.value}
    if(e.detail.value.length>0){
      this.data.tijiaolist.push(linshi)
    }
  },

  //提交整体
  tijiao: function () {
    const db = wx.cloud.database()
    var list = this.data.tijiaolist
    var cuntime = this.data.todaytime
    if(this.data.todaylength==0){
      cuntime = this.data.todaytime
    }else{
      cuntime = this.data.tomorrowtime
    }

    //判断数据库中是否有今天的记录，没有则创建，有则修改
    if (this.data.tijiaolist.length>0){
      console.log('因为此时数据库中数据记录为0，所以创建记录并添加记录');
      db.collection('counters').add({
        data: {
          list,
          time: cuntime,
          changshu:1
        },
        success: res => {
          console.log('创建一条新纪录', this.data.resdatalength)
          this.setData({
            counterId: res._id,
            count: 1
          })
          wx.showToast({
            title: '添加成功',
          })
        }
      })
      //创建成功后修改这条数据
      const huoqulist = this.data.tijiaolist
      db.collection('counters').doc(this.data.counterId).update({
        data: {
          list: huoqulist
        },
        success: res => {
          console.log('数据已经被修改',this.data.resdatalength)
          this.setData({
            count: newCount
          })
        },
        fail: err => {
          icon: 'none',
            console.error('[数据库] [更新记录] 失败：', err)
        }
      })
    }
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var TIME = util.formatTime(new Date())
    this.setData({
      todaytime: TIME,
    })
    var TIME = util.tomoTime(new Date())
    this.setData({
      tomorrowtime: TIME,
    })
    if (this.data.tomorrowtime == "2019-02-29") {
      this.setData({
        tomorrowtime: '2019-03-01'
      })
    }
    //获取openid
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }

    //获取今天事件的长度
    const db = wx.cloud.database()
    const that = this
    //查询当前用户所有的 counters
    db.collection('counters').where({
      _openid: this.data.openid,
      time: this.data.todaytime
    }).get({
      success: res => {
        console.log('此时数据库中有数据',res.data.length);
        that.setData({
          //今天事件的长度
          resdatalength: res.data.length,
          todaylength: res.data[0].list.length
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