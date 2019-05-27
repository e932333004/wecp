// pages/tea/tea.js
var app = getApp()
// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx.js');
var wxMarkerData = [];	//定位成功回调对象
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:app.globalData.baseUrl,
    canvas:"",
    list: "",
    MainCur: 0,
    TabCur: 0,
    VerticalNavTop: 0,
    load: true,
    show: "",
    tem: ["加热", "少冰", "去冰"],
    ckd: 0,
    size: ["芝士", "轻芝士"],
    cks: 0,
    //商品信息
    total: 1,
    sname: "",
    p: '',
    pic:"",
    ak: "zudlPZOcblQf7pPIGvLwBU8aOC0NXdYv",	//填写申请到的ak
    markers: [],
    // longitude: '',	//经度
    // latitude: '',	//纬度
    address: '',		//地址
    // cityInfo: {}		//城市信息
  },
  // 左边导航栏
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  // 右边滚动选中
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    // 遍历每个id中元素的高度
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().in(this).select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },
  // 选择规格
  showchange(e) {
    this.setData({
      show: true,
      sname: e.target.dataset.item.name,
      pic: e.target.dataset.item.pic,
      p: e.target.dataset.item.price
    })
  },
  // 关闭详情页
  close() {
    this.setData({
      show: false,
      total: 1
    })
  },
  // 添加购物车
  shopcart() {
    var sname = this.data.sname;
    var p = this.data.p;
    var f = this.data.tem[this.data.ckd];
    var m = this.data.size[this.data.cks];
    var total = this.data.total;
    var pic = this.data.pic;
    var list = {
      sname: sname,
      price: p,
      total: total,
      fell: f,
      size: m,
      pic:pic
    }
    app.globalData.carlist.push(list);
    this.setData({
      show: false,
      total: 1,
      ckd: 0,
      cks: 0
    })
  },
  // 增加数量
  add() {
    var total = this.data.total
    total++
    this.setData({
      total: total
    })
  },
  // 减少数量
  sub() {
    if (this.data.total > 1) {
      var total = this.data.total
      total--
      this.setData({
        total: total
      })
    }
  },
  // 选择温度
  cked(e) {
    // console.log(e.target.dataset.t)
    this.setData({
      ckd: e.target.dataset.t
    })
  },
  // 选择大小
  cs(e) {
    this.setData({
      cks: e.target.dataset.s
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 定位
    var that = this;
    /* 获取定位地理位置 */
    // 新建bmap对象 
    var BMap = new bmap.BMapWX({
      ak: that.data.ak
    });
    var fail = function (data) {
      // console.log(data);
    };
    var success = function (data) {
      //返回数据内，已经包含经纬度
      // console.log(data);
      //使用wxMarkerData获取数据
      wxMarkerData = data.wxMarkerData;
      //把所有数据放在初始化data内
      that.setData({
        markers: wxMarkerData,
        // latitude: wxMarkerData[0].latitude,
        // longitude: wxMarkerData[0].longitude,
        address: wxMarkerData[0].address,
        // cityInfo: data.originalData.result.addressComponent
      });
    }
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success
    });
   // 轮播图
    var url = app.globalData.baseUrl
    wx.request({
      url: url+"canvas",
      method:"GET",
      success:(res) =>{
        let canvas = res.data.data;
        // console.log(canvas)
        this.setData({
          canvas:canvas
        })
      }
    })
    //遍历商品 
    wx.request({
      url:url+"list",
      method: "GET",
      success: (res) => {
        var info = res.data.item;
        for (var i = 0; i < info.length; i++) {
          info[i].id = i;
        }
        var shop = res.data.list;
        // 对比插入对应的家族中
        for (var i = 0; i < info.length; i++) {
          info[i].data = []
          for (var j = 0; j < shop.length; j++) {
            if (shop[j].familyId == info[i].family) {
              info[i].data.push(shop[j]);
            }
          }
        }
       if(info){
         this.setData({
           list: info,
         })
       }
      }
    })
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