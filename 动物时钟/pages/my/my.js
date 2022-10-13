// pages/my/my.js
var app=getApp();

Page({
    /**
   * 页面的初始数据
   */
  data: {
    userInfo:''
  },
  loginOut(){
    this.setData({
      userInfo: ''
    })
    wx.setStorageSync('user',null)
  },
  login(){
    wx.getUserProfile({
      desc: '必须授权才能使用',
      success:res => {
        let user=res.userInfo
        wx.setStorageSync('user', user)
        this.setData({
          userInfo:user
        })
      },
      fail:res => {
        console.log('授权失败',res)
      }
    })
  },
  gotoabout:function(){
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let user=wx.getStorageSync('user')
    this.setData({
      userInfo:user
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})