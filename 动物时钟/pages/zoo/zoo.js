const util = require('../../utils/util.js')

Page({
  data: {
    zoos: [],
    modalHidden: true,
    toastHidden: true
  },
  
  onShow: function() {
    wx.setNavigationBarTitle({
      title: '任务记录'
    })
    let user = wx.getStorageSync("user")
    if(user != null){
      this.getLogs()
    }
    
  },

  getLogs: function() {
    let zoos = wx.getStorageSync('zoos')
    zoos.forEach(function(item, index, arry) {
        item.startTime = util.toDate(item.startTime)
        item.keepTime = parseInt(item.keepTime/(1000*60))
        item.endTime  = util.toDate(item.endTime)
    })
    this.setData({
      zoos: zoos
    })
  },

  onLoad: function() {},

  switchModal: function() {
    this.setData({
      modalHidden: !this.data.modalHidden
    })
  },

  hideToast: function() {
    this.setData({
      toastHidden: true
    })
  },
  clearLog: function(e) {
    wx.setStorageSync('zoos', [])
    this.switchModal()
    this.setData({
      toastHidden: false
    })
    this.getLogs()
  }
})
