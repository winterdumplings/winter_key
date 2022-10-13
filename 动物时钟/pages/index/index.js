const util = require('../../utils/util.js')
// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    now_state:null,
    rate: 0,
    dates: '2022-1-1',
    times: '00:00',
    index: 0,
    zoo:{},
    keepTime:0,
    clockshow:false,
    remainTime:"00:00:00",
    isRuning:false,
    completed:false,
    okShow:false,
    pauseShow:true,
    continueCancleShow:false
  },

  onLoad:function() {
    let nowTime
    let hh = new Date().getHours()
    let mf = new Date().getMinutes()<10?'0'+new Date().getMinutes():
      new Date().getMinutes()
    let ss = new Date().getSeconds()<10?'0'+new Date().getSeconds():
      new Date().getSeconds()
      nowTime = `${hh}:${mf}:${ss}`;
    this.setData({
      nowTime:nowTime
    })
  },

   // 点击时间组件确定事件
   bindtimechange: function (e) {
    this.setData({
      times:e.detail.value,
      remainTime:e.detail.value+":00"
  })
  },
  
  Popup(e){
    var that = this 
    that.setData({
      now_state:true,
      nowtimeshow:true
    })
 
  },
  //点击黑色背景触发的事件
  hideModal(e){
    //首先创建一个动画对象（让页面不在是一个“死页面”）
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    //animation.translateY(300)中的translate函数是表示在y轴上平移多少px，而后面紧接着的.step表示前面动画的完成，可以开始下一个动画了
    animation.translateY(300).step()
    this.setData({
      /*这里的export函数是导出动画队列，在外米的wxml中会用到该数据，同时export方法在调用完后会清掉前面的动画操作 */
      animationData: animation.export(),
    })
    /*这里的setTimeout是一个延时器，而它在这里延时了200ms，然后在执行动画 */
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        now_state: false,
      })
    }.bind(this), 200)
    var that = this
   
  },

  startTimer: function() {
    let isRuning = this.data.isRuning
    let logName = this.logName || "专注"  
    let startTime = Date.now()
    var aim_times = this.data.times.split(":")
    let keepTime = parseInt(aim_times[0])*60*60*1000+parseInt(aim_times[1])*60*1000
    let endTime = startTime+keepTime
    let first_click = true
    if (!isRuning ) {
        this.timer = setInterval((function() {
          this.updateTimer()
        }).bind(this), 1000)
    } else {
      this.stopTimer()
    }
    this.setData({
      startTime:startTime,
      keepTime:keepTime,
      endTime:endTime,
      clockshow:true,
      taskName:logName
    })
    this.data.zoo={
      name: logName,
      startTime:startTime,
      keepTime:keepTime,
      endTime:endTime,
    }
    var zoos = wx.getStorageSync('zoos') || []
    zoos.unshift(this.data.zoo)
    wx.setStorageSync('zoos', zoos)

  },

  stopTimer: function() {
    // reset circle progress
    this.setData({
        isRuning:false,
        clockshow:false
    })
    // clear timer
    this.times && clearInterval(this.timer)
  },


  // 更新时间
  updateTimer: function() {
    let now = Date.now()
    let remainingTime = Math.round((this.data.endTime-now) / 1000)
    let H = util.formatTime(Math.floor(remainingTime / (60 * 60)) % 24, 'HH')
    let M = util.formatTime(Math.floor(remainingTime / (60)) % 60, 'MM')
    let S = util.formatTime(Math.floor(remainingTime) % 60, 'SS')
    // update text
    if (remainingTime > 0) {
      let remainTime = (H === "00" ? "00:" : (H + ":")) + M + ":" + S
      this.setData({
        remainTime: remainTime
      })
    } else if (remainingTime == 0) {
      this.setData({
        completed: true
      })
      setTimeout(()=>
   {
     this.ok();
   }, 2000)
      return
    }
  },

 
  changeLogName: function(e) {
    this.logName = e.detail.value
  },

  pause:function() {
      clearInterval(this.timer);
      let startTime = Date.now()
      let keepTime = this.data.keepTime-(startTime-this.data.startTime)
      this.setData({
        startTime:startTime,
        keepTime:keepTime,
        endTime:startTime+keepTime, 
        pauseShow: false,
        continueCancleShow: true,
        okShow: false
      }) 
  },

  continue:function() {
      let startTime = Date.now()
      let keepTime = this.data.keepTime
      let endTime = startTime+keepTime
      this.setData({
        startTime:startTime,
        keepTime:keepTime,
        endTime:endTime,
        pauseShow: true,
        continueCancleShow: false,
        okShow: false
      })
      this.timer = setInterval((function() {
        this.updateTimer()
      }).bind(this), 1000)
      this.updateTimer();
  },

  cancle:function() {
      this.stopTimer()
      clearInterval(this.timer);
      this.setData({
          clockshow:false,
          pauseShow: true,          
          continueCancleShow: false,
          okShow: false
      })
  },

  ok:function() {
      clearInterval(this.timer);
      this.setData({
          completed:false,
          clockshow:false,
          pauseShow: true,
          continueCancleShow: false,
          okShow: false
      })
},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})