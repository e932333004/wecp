var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: "",
    total: '',
    url:app.globalData.baseUrl
  },
  // 单独删除商品
  del(e) {
    var id = e.target.dataset.id;
    app.globalData.carlist.splice(id, 1);
    this.setData({
      list: app.globalData.carlist
    })
  },
  // 清除商品列表
  clear() {
    app.globalData.carlist = []
    this.setData({
      list: app.globalData.carlist
    })
  },
  // 修改商品数量
  add(e) {
    var id = e.target.dataset.id;
    var list = app.globalData.carlist;
    list[id].total++;
    var total = 0;
    var car = this.data.list
    for (var i = 0; i < car.length; i++) {
      total += car[i].price * car[i].total;
    }
    this.setData({
      list: list,
      total: total
    })
  },
  sub(e) {
    var id = e.target.dataset.id;
    var list = app.globalData.carlist;
    if (list[id].total > 1) {
      list[id].total--;
      var total = 0;
      var car = this.data.list
      for (var i = 0; i < car.length; i++) {
        total += car[i].price * car[i].total;
      }
      this.setData({
        list: list,
        total: total
      })
    }
  },
  // 提交订单 
  addlist() {
    console.log(app.globalData.carlist);
    var list = app.globalData.carlist;
    var url = app.globalData.baseUrl;
    for (var i = 0; i < list.length; i++) {
      var sname = list[i].sname;
      var price = list[i].price;
      var total = list[i].total;
      var total = list[i].total;
      var fell = list[i].fell;
      var size = list[i].size;
      console.log(sname, price, total, fell, size)

      wx.request({
        url: url + `history?sname=${sname}&price=${price}&total=${total}&fell=${fell}&size=${size}`,
        method: "GET",
        success: (res) => {
          console.log(res.data.msg);
        }
      })
    }
    app.globalData.carlist = [];
    this.setData({
      list:app.globalData.carlist
    })
    console.log(app.globalData.carlist)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 计算总价
    this.setData({
      list: app.globalData.carlist
    })
    console.log(this.data.list)
    var total = 0;
    var car = this.data.list
    for (var i = 0; i < car.length; i++) {
      total += car[i].price * car[i].total;
    }
    this.setData({
      total: total
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})