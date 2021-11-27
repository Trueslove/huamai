<template>
  <view class="container">
    <!-- 头部 -->
    <view class="cu-custom" :style="[{ height: CustomBar + 'px', backgroundColor: bgColor }]"
      :animation="animationData">
      <view class="cu-bar fixed" :style="{
          height: CustomBar + 'px',
          paddingTop: StatusBar + 'px',
          backgroundColor: bgColor,
        }" :animation="animationData">
        <view class="action text-white flex align-center" style="width: 100%;font-size: 36rpx;margin-left: 0rpx;">
          <text style="text-align: center;">
            众乐
          </text>
        </view>
      </view>
    </view>
    <!-- 轮播图 -->
    <view class="swiper-wrap">
      <view class="swiper-bg" :style="[{ backgroundColor: bgColor }]" :animation="animationData"></view>
      <mo-swiper :lists="banners"></mo-swiper>
    </view>
    <!-- 九宫格 -->
    <mo-grid ref="gridSan" ></mo-grid>
    <!-- 滚动列表 -->
    <view class="lamp">
      <view class="lamp-ad-wrap title text-red flex align-center">
        <view class='lamp-ad'>
          <image src='../../../../static/home/ad.png'></image>
        </view>
        <view class='text-sm'>公告</view>
      </view>
      <view class="uni-padding-wrap lamp-right padding-lr">
        <view class="">
          <swiper class="swiper " style='height:48rpx;' :vertical="true" :circular="true" :indicator-dots="false"
            :autoplay="true" :interval="3000" :duration="800">
            <swiper-item v-for="(item,index) in srollList" :key="index">
              <view class="sroll-box">
                <view class="shoping padding-left-xs text-sm text-cut">
                  已更新APP下载地址已更新APP下载地址已更新APP下载地址已更新APP下载地址已更新APP下载地址
                </view>
              </view>
            </swiper-item>
          </swiper>
        </view>

      </view>
    </view>
    <!-- 滚动列表end -->
        <view class="section-uncover " v-if='uncoverList.length>0'>
          <view class="section-uncover-title flex justify-between">
            <view class="title text-lg">即将揭晓</view>
            <view class="_right"> <image class="list-arrow" src="/static/common/right-arrow.png" mode="aspectFit"></image></view>
          </view>
          <view class="section-uncover-list ">
            <mo-grid-four ref="grid" :list='uncoverList'></mo-grid-four>
          </view>
        </view>
        <view class="goods">
            <mo-filter :classData="classData" @changeCurFilter="changeCurFilter"></mo-filter>
            <!-- <mo-loading v-if="isShowLoading"></mo-loading>
            <block v-else> -->
            <view class="flex flex-wrap good-list">
              <block v-for="(item, index) in goodsList" :key="index">
                <mo-good-block :goods_class="goods_class" :info="item"></mo-good-block>
              </block>
            </view>
          <!-- </block> -->
          <mo-empty-ui v-if="goodsList.length == 0 && isInit"></mo-empty-ui>
        </view>
            <!-- 未登录 -->
            <!-- <mo-nologin v-if="!isLogin"></mo-nologin> -->
            <!-- 网络监测 -->
            <mo-notwork></mo-notwork>
          </view>
</template>
<script>
  import moGoodBlock from "../../components/mo-good-block/mo-good-block.vue";
  import moFilter from "../../components/mo-filter/mo-filter.vue";
  import moGrid from "../../components/mo-grid-3/mo-grid.vue";
  import moSwiper from "../../components/mo-swiper/mo-swiper.vue";
  import moNologin from "../../components/mo-nologin/mo-nologin.vue";
  import moGridFour from "../../components/mo-grid-4/mo-grid.vue";
  export default {
    name: "shopindex",
    components: {
      moGrid,
      moSwiper,
      moNologin,
      moFilter,
      moGoodBlock,
      moGridFour
    },
    data() {
      return {
        isShowLoading:false,
        baseImgUrl: global.IMG_BASE_URL ,
        goodsList:[],
        uncoverList:[],
        srollList: [{}, {}],
        lists: [{}, {}, {}, {}],
        showBar: true, // 显示悬浮搜索栏
        searchText: "", //搜索框默认值
        banners: [], // 轮播图
        bgColor: '', // 头部默认颜色
        animationData: {}, // 颜色渐变动画
        couponModel: false, // 优惠券弹窗
        couponInfo: null,
        location: {}, //定位信息
        pageNum: 1, // 当前页
        total: 0, // 总条数
        type_sort: 1, // 商品类型
        classData: [], // 商品分类
        goods_class: null, // 分类调用
        isInit:false,
      };
    },
    computed: {
      isLogin() {
        return this.$store.getters.isLogin;
      },
    },
    onLoad(options) {
      uni.setNavigationBarColor({
        frontColor: "#ffffff", //文字颜色
        backgroundColor: "#007AFF", //底部背景色
      });
      uni.startPullDownRefresh();
      this.loadData();
      this.getFindData();
      this.changeColor([254, 75, 97]);
    },
    onReady() {
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select(".img")
          .boundingClientRect((data) => {
            // console.log("得到布局位置信息" , data);
          })
          .exec();
      });
      this.getData();
      this.getClassData();
      this.getNewData();
    },
    onShow() {
      if (this.isLogin) {
        this.$nextTick(()=>{
        console.log(this.$refs.gridSan)
        this.$refs.gridSan.getGridData()
        })
        // this.$store.dispatch("getCartList");
      }
      // let location = this.$store.state.location;
      //  // 定位功能
      //  if(!location  ||  !location.district){
      //    // 初始化高德地图SDK,记得换成自己的key
      //    this.myAmapFun = new amapFile.AMapWX({ key: '8a92b6de6681e34055e175173d28ec83' });
      //    this.autoGetLocation();
      //  }else{
      //    this.location = location;
      //  }
    },
    onPullDownRefresh() {
      this.loadData();
      setTimeout(() => {
        uni.stopPullDownRefresh();
      }, 1000);
    },
    onReachBottom(e) {
      console.log(this.total)
      if(this.goodsList.length < this.total) {
        this.pageNum = this.pageNum + 1;
        this.getData();
      }
    },
    onPageScroll(e) {
      this.showBar = e.scrollTop >= 40 ? false : true;
    },
    methods: {
      resetPageInfo() {
        this.pageNum = 1;
        this.total = 0;
        this.goodsList = [];
        this.getData();
      },
      changeCurFilter(type, id) {
        this.type_sort = type;
        this.goods_class = id;
        this.resetPageInfo();
      },
      getData(){
        this.isShowLoading = true;
        let params = {};
        if(this.goods_class) {
          params = {
            pageNum: this.pageNum,
            type_sort: this.type_sort + 1,
            goods_class: this.goods_class 
          }
        } else {
          params = {
            pageNum: this.pageNum,
            type_sort: this.type_sort + 1
          }
        }
        this.$api
          .get(global.apiUrls.get_goods_list, params)
          .then(result => {
            this.isShowLoading = false;
            this.isInit = true;
            result = result.data;
            if (result.code == 0) {
              this.goodsList = this.goodsList.concat(result.data);
              this.total = result.total;
            } else {
              this.$message.info(result.msg);
            }
          })
          .catch(err => {
            this.isShowLoading = false;
            this.isInit = true;
            console.log('ERROR', err);
            this.$message.info('服务器错误');
          });
      },
      getClassData(){ // 商品分类
        this.$api
          .get(global.apiUrls.get_goods_class)
          .then(result => {
            result = result.data;
            if (result.code == 0) {
              this.classData = result.data;
            } else {
              this.$message.info(result.msg);
            }
          })
          .catch(err => {
            this.$message.info('服务器错误');
          });
      },

      arrTrans(num, arr) {
      // 一维数组转换为二维数组
      const iconsArr = []; // 声明数组
      arr.forEach((item, index) => {
        const page = Math.floor(index / num); // 计算该元素为第几个素组内
        if (!iconsArr[page]) {
          // 判断是否存在
          iconsArr[page] = [];
        }
        iconsArr[page].push(item);
      });
      return iconsArr;
    },
      getNewData(){ // 最新揭晓
        this.$api
          .get(global.apiUrls.get_goods_jjkj)
          .then(result => {
            result = result.data;
            if (result.code == 0) {

              this.uncoverList = this.arrTrans(4,result.data);
            } else {
              this.$message.info(result.msg);
            }
          })
          .catch(err => {
            this.$message.info('服务器错误');
          });
      },
      goDetail() {
        this.$urouter.navigateTo({
          url: '/pages/user/detail/detail',
          params: {
            type: 1,
          }
        });
      },
      /**
       * @description 去选择城市页面
       */
      goLcation() {
        uni.navigateTo({
          url: "/pages/user/address/select-location/index",
        });
      },
      /**
       * @description 自动定位获取地理位置
       * 这个定位只使用app，且不能获取code值，如果想和组件选择城市匹配，可以根据城市去城市js去查找对应code
       * 或者引入三方sdk定位获取code
       */
      /**
       * @func 自动定位
       */
      autoGetLocation() {
        let _this = this;
        console.log("自动定位");
        uni.getLocation({
          geocode: true,
          success: (adr) => {
            this.myAmapFun.getRegeo({
              location: adr.longitude + "," + adr.latitude,
              success: (data) => {
                //成功回调
                console.log("自动定位 SDK回调", data);
                let regeoData = data[0].regeocodeData.addressComponent;
                this.province = regeoData.province;
                this.city =
                  Array.isArray(regeoData.city) && regeoData.city.length == 0 ?
                  regeoData.province :
                  regeoData.city;
                this.district = regeoData.district;
                this.addressDesc = data[0].desc;
                this.provinceCode = regeoData.adcode.substr(0, 2) + "0000";
                this.cityCode = regeoData.adcode.substr(0, 4) + "00";
                this.districtCode = regeoData.adcode + "";
                let latitude = data[0].latitude;
                let longitude = data[0].longitude;

                _this.$store.commit("updataLocation", {
                  province: this.province,
                  city: this.city,
                  district: this.district,
                  addressDesc: this.addressDesc,
                  provinceCode: this.provinceCode,
                  cityCode: this.cityCode,
                  districtCode: this.districtCode,
                  latitude: latitude,
                  longitude: longitude,
                });
                _this.location = {
                  province: this.province,
                  city: this.city,
                  district: this.district,
                  addressDesc: this.addressDesc,
                  provinceCode: this.provinceCode,
                  cityCode: this.cityCode,
                  districtCode: this.districtCode,
                  latitude: latitude,
                  longitude: longitude,
                };
                console.log(_this.location, 444);
              },
              fail: (info) => {
                //失败回调
                console.log(info);
              },
            });
          },
        });
      },

      getFindData() {

      },
      // 首页数据
      loadData() {
        this.getSwiper();
      },
      // 去搜索
      navToSearch() {
        this.$urouter.navigateTo(
          "/pages/index/search/search/index?name=" + this.searchText
        );
      },
      // 轮播图
      getSwiper() {
        this.$api
          .get(global.apiUrls.get_adv_banner)
          .then(result => {
            result = result.data;
            if (result.code == 0) {
              this.banners = result.data;
              let banners = [];
              this.banners.forEach(item => {
                banners.push({
                  thumb: item.img
                })
              })
              this.banners = banners;
            } else {
              this.$message.info(result.msg);
            }
          })
          .catch(err => {
            this.$message.info('服务器错误');
          });
      },
      // 改变颜色
      changeColor(e) {
        const color = `rgb(${e[0]},${e[1]},${e[2]})`;
        this.bgColor = color;
        var animation = uni.createAnimation({
          duration: 700,
          timingFunction: "linear",
        });
        this.animation = animation;
        animation.backgroundColor(this.bgColor).step();
        this.animationData = animation.export();
      },
      // postSearchScanCode
      handleScan() {
        const that = this;
        uni.scanCode({
          scanType: ["barCode"],
          success: function (response) {
            that.$api
              .post(global.apiUrls.postSearchScanCode, {
                sn: response.result,
              })
              .then((res) => {
                if (res.data.code == 1 && res.data.data.list.length > 0) {
                  that.$urouter.navigateTo({
                    url: "/pages/goods/goodsdetail/goods-detail/index",
                    params: {
                      goods_id: res.data.data.list[0].id,
                      sku_id: res.data.data.list[0].sku_id || 0,
                    },
                  });
                } else {
                  this.$message.info({
                    content: 暂无相关数据,
                  });
                }
              })
              .catch((err) => {
                console.log("err: " + JSON.stringify(err));
                this.$message.info({
                  content: 暂无相关数据,
                });
              });
          },
        });
      },
      // 切换弹窗
      beginSwitchModel() {
        let data = this.models[this.showModelIndex];
        console.log(this.models);
        if (this.showModelIndex >= this.models.length) return;
        if (data) {
          switch (this.showModelIndex) {
            case 0:
              this.noticeModel = true;
              break;
            case 1:
              this.couponModel = true;
              break;
            case 2:
              this.activityModel = true;
              break;
          }
        } else {
          this.showModelIndex++;
          this.beginSwitchModel();
        }
      },
      // 弹窗关闭回调
      handleCloseCb() {
        // console.log("关闭回调");
        this.showModelIndex++;
        // setTimeout(() => {
        this.beginSwitchModel();
        // },300);
      },
      // 关闭弹窗
      closeModel(type) {
        this[type] = false;
      },
    },
  };

</script>
<style lang="scss" scoped>
.section-uncover-item  {
  margin: 0 40rpx 0 10rpx;
  display: flex;
  justify-items: center;
  flex-wrap: wrap;
  .margin-left-sm {
    margin-left: 0;
  }
}
  .container {
    background-color: #f8f8f9;
  }
  .cu-custom .cu-bar{
    z-index: 998;
  }
  .life_type {
    padding: 0 30rpx;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    .life_title {
      font-size: 24rpx;
      text-align: center;
      color: #ffffff;
      padding-right: 10rpx;
    }

    .life_item {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      flex-wrap: nowrap;

      .items {
        width: 140rpx;
        height: 40rpx;
        border-radius: 20rpx;
        background: rgba(221, 221, 221, 0.5);
        font-size: 24rpx;
        text-align: center;
        color: #ffffff;
        line-height: 40rpx;
      }
    }
  }

  .cu-custom {
    .search-form {
      width: 100%;
      line-height: 52upx;
      height: 52upx;
    }
  }

  .cu-bar.search {
    .search-form {
      height: 56rpx;
      line-height: 56rpx;
    }
  }

  .header {
    height: 100rpx;
    padding: 0 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;

    .header-search {
      width: 690rpx;
      height: 64rpx;
      background-color: rgba(246, 246, 246, 1);
      padding: 0 24rpx;
      display: flex;
      align-items: center;
      font-family: "PingFang SC";
      border-radius: 34rpx;
      color: #bfbfbf;
    }

    .header-message {
      display: flex;
      align-items: center;

      image {
        width: 48rpx;
        height: 48rpx;
      }
    }
  }

  .swiper-wrap {
    position: relative;
    overflow: hidden;
    width: 750rpx;
    height: 320rpx;
    padding: 20rpx 26rpx;
    box-sizing: border-box;

    .swiper-bg {
      height: 200rpx;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      border-radius: 0 0 50% 50%;
    }
  }

  .banner-wrap {
    position: relative;
    overflow: hidden;
  }

  .banner-box {
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .banner-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      margin-left: 154rpx;

      .banner-info-title {
        font-size: 30rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #f2d7bd;
      }

      .banner-info-sub {
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #eae8e7;
        margin-top: 10rpx;
      }
    }

    .banner-action {
      width: 155rpx;
      height: 56rpx;
      background: linear-gradient(63deg,
          rgba(247, 226, 191, 1) 0%,
          rgba(227, 186, 153, 1) 100%);
      opacity: 1;
      border-radius: 28rpx;
      margin-right: 34rpx;
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(21, 33, 43, 1);
      line-height: 56rpx;
      text-align: center;
    }
  }

  .model-notice-box {
    width: 500rpx;

    .title {
      height: 100rpx;
      text-align: center;
      line-height: 100rpx;
      font-size: 32rpx;
    }

    .content {
      padding: 0 32rpx 50rpx;
      color: #666666;
      font-size: 28rpx;
    }

    .bottom {
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
      color: $theme;
      font-size: 28rpx;
    }
  }

  .banner-floor {
    height: 240rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .notice-wrap {
    background-color: #f8f8f8;
    display: flex;
    height: 64rpx;
    align-items: center;
    padding: 0 16rpx;

    .swiper-box {
      height: 64rpx;
      width: 100%;

      .swiper-item {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        // .swiper-item-text{
        // 	width: 100%;
        // }
      }
    }
  }

  .block-38 {
    width: 38rpx;
    height: 38rpx;
  }

  .block-30 {
    width: 30rpx;
    height: 30rpx;
  }

  .block-250 {
    width: 224rpx;
    min-width: 224rpx;
    height: 224rpx;
    min-height: 224rpx;
  }

  .className {
    margin: 0;
    font-size: 22rpx;
  }

  .block-7828 {
    width: 78rpx;
    height: 28rpx;
  }

  image {
    width: 100%;
    height: 100%;
  }

  .buy-notice {
    position: fixed;
    left: 50rpx;
    z-index: 999;
  }

  .info {
    height: 30rpx;

    .info-title {
      width: 80rpx;
      line-height: 30rpx;
      text-align: center;
    }

    .info-number {
      width: 70rpx;
      line-height: 22rpx;
      text-align: center;
      border: 4rpx solid $mo-main-color;
      border-left: none;
    }
  }

  .titles {
    padding: 20rpx 32rpx;

    .name {
      font-size: 40rpx;
      line-height: 48rpx;
      color: #333333;
      font-weight: bold;

      image {
        width: 34rpx;
        height: 34rpx;
        margin-right: 18rpx;
      }
    }

    .desc {
      width: 120rpx;
      height: 46rpx;
      background: $bgtheme;
      font-size: 24rpx;
      color: #ffffff;
      line-height: 46rpx;
      text-align: center;
      border-radius: 23rpx;
    }
  }

  .top-tab {
    width: 100%;
    height: 100upx;
    background-color: #ffffff;

    .title {
      font-style: italic;
    }

    .tab-item {
      .time {
        color: #373737;
        font-size: 30rpx;
        line-height: 34rpx;

        &.active {
          color: $theme;
          font-size: 40rpx;
        }
      }

      .state {
        color: #999999;
        font-size: 20rpx;
        line-height: 32rpx;
        margin-top: 10rpx;

        &.active {
          width: 120rpx;
          height: 32rpx;
          background: $bgtheme;
          text-align: center;
          border-radius: 20rpx;
          color: #ffffff;
        }
      }
    }

  }

  .sckill-list {
    height: 876rpx;
  }

  .guess {
    width: 100%;
    text-align: center;
    font-size: 40rpx;
  }

  .guesstitles {
    background: #fafafa;
  }

  .block-24 {
    width: 24rpx;
    min-width: 24rpx;
    height: 24rpx;
    min-height: 24rpx;
  }

  ben-search-swiper {
    width: 100%;
  }

  .float-banner {
    width: 240rpx;
    height: 235rpx;
    position: fixed;
    bottom: 240rpx;
    z-index: 996;
    transition: all 0.35s ease-in-out;

    image {
      width: 100%;
      height: 100%;
    }

    .close-btn {
      width: 36rpx;
      height: 36rpx;
      line-height: 36rpx;
      background-color: rgba(200, 200, 200, 0.8);
      text-align: center;
      position: absolute;
      display: flex;
      align-items: center;
      border-radius: 50%;
      font-size: 24rpx;
      justify-content: center;
      color: #ffffff;
      top: 20rpx;
      right: 46rpx;
      z-index: 996;
    }
  }

  .live-box {
    width: 686rpx;
    height: 199rpx;
    position: relative;

    .live-item {
      position: absolute;
      width: 145rpx;
      height: 145rpx;
      top: 28rpx;
      left: 38rpx;
      background-color: rgba(255, 255, 255, 0.5);
      z-index: 99;
      border-radius: 28rpx;
      overflow: hidden;

      .swiper {
        width: 100%;
        height: 100%;
      }
    }
  }

  .placeholderStyle {
    font-size: 26rpx;
    color: grey;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .search-form {
    width: 80% !important;
  }

  .model-activity-box {
    width: 600rpx;

    image {
      width: 100%;
    }

    .model-activity-box-close {
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 50rpx;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .title-icon {
    font-size: 36rpx;
    padding: 40rpx 0 28rpx;
    align-items: center;
    font-weight: bold;

    image {
      width: 28rpx;
      height: 28rpx;
      margin: 0 20rpx;
    }
  }

  .line {
    background: #fff;
    margin: 0 26rpx;
  }

  .list-1 {
    margin: 20rpx 26rpx;
  }

  .list-2 {
    margin-bottom: 20rpx;
  }

  .list {
    .item {
      padding: 20rpx;

      image {
        width: 305rpx;
        height: 196rpx;
        border-radius: 16rpx;
      }
    }
  }

  .action {
    position: absolute;
  }

  /* .cu-bar .action:first-child {
    margin-left: 0rpx!important;
} */

  .lamp-ad {
    width: 22rpx;
    height: 22rpx;
    margin-right: 10rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .lamp-right {
    margin-left: 100rpx;
  }

  .lamp {
    position: relative;

    .lamp-ad-wrap {
      position: absolute;
      left: 26rpx;
    }
  }


.list-arrow {
    width: 14rpx;
    height: 30rpx;
  }
 .section-uncover {
   margin: 26rpx;
   background: #fff;
   padding: 20rpx;
   .section-uncover-list{
     margin-top: 30rpx;
     overflow: auto;
    .section-uncover-item{
      display: flex;
      flex-direction: column;
   align-items: center;
    }
     .good-img{
       width: 120rpx;
       height: 120rpx;
       image{
         width: 100%;
         height: 100%;
         border-radius: 10rpx;
       }
     }
   }
 }
 .good-list{
   margin: 20rpx 26rpx 0;
 }
</style>
