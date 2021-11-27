<template>
  <view>
    <mo-custom isBack="true" :isBottom="true" bgColor="bg-white">
      <view slot="content">商品详情</view>
    </mo-custom>
    <view class="container">
      <!---------------------- 头部导航 ---------------------->
      <view
        class="detail-header"
        :style="{ top: CustomBar + 'px', paddingTop: StatusBar + 'px' }"
      >
        <view class="detail-header-item-wap">
          <view
            :class="item.qishu == activeIndex ? 'active' : ''"
            class="detail-header-item"
            v-for="item in qishuData"
            @click="handleChange(item.qishu)"
            :key="item.qishu"
            >第{{ item.qishu }}期</view
          >
        </view>
      </view>
      <!---------------------- 幸运码 ---------------------->
      <view class="detail-xym-wap" v-if="dbDetail.db_zt == 2">
        <view class="detail-xym-info flex">
          <view class="detail-xym-item detail-xym-img-wap">
            <image class="detail-xym-img" src="../static/jiang.png" mode="widthFix"></image>
            <span class="detail-xym-phone">{{dbDetail.username}}</span>
          </view>
          <view class="detail-xym-item">
            <view>总共购买</view>
            <view style="color: #f51111">{{dbDetail.shops}}</view>
            <view>人次</view>
          </view>
          <view class="detail-xym-item">
            <view>参与时间</view>
            <view class="detail-xym-time">{{dbDetail.add_time}}</view>
          </view>
          <view class="detail-xym-item">
            <view>揭晓时间</view>
            <view class="detail-xym-time">{{dbDetail.kj_time}}</view>
          </view>
        </view>
        <view class="detail-xym-btm">
          <view>
            <span style="margin-right: 10rpx; color: #999">幸运码:</span>
            <span style="color: #333">{{dbDetail.xu_no}}</span>
          </view>
          <view class="detail-xym-btm-btn">查看计算结果</view>
        </view>
      </view>
      <!---------------------- 倒计时 ---------------------->
      <view class="detail-djs-wap" v-if="dbDetail.kj == 2">
        <view
          class="detail-djs-item"
          style="
            font-size: 28rpx;
            line-height: 38rpx;
            background: #efefef;
            color: #999999;
          "
        >
          <view class="detail-djs-info">
            <span style="margin-top: 50rpx">揭晓</span>
            <span>倒计时</span>
          </view>
          <image class="detail-djs-img" src="../static/biao.png"></image>
        </view>
        <view class="detail-djs-item">
          <view>{{minute}}</view>
          <image class="detail-djs-img" src="../static/fen.png"></image>
        </view>
        <view class="detail-djs-item">
          <view>{{second}}</view>
          <image class="detail-djs-img" src="../static/m.png"></image>
        </view>
        <view class="detail-djs-item">
          <view>{{millisecond}}</view>
          <image class="detail-djs-img" src="../static/hm.png"></image>
        </view>
      </view>
      <!---------------------- 轮播图 ---------------------->
      <view class="swiper-wrap">
        <view
          class="swiper-bg"
          :style="[{ backgroundColor: bgColor }]"
          :animation="animationData"
        ></view>
        <mo-swiper :lists="banners"></mo-swiper>
      </view>
      <!---------------------- 商品信息 ---------------------->
      <view class="detail-info">
        <view class="detail-info-title">{{ goodsInfo.goods_name }}</view>
        <view class="detail-info-price"
          ><span style="color: #999999; margin-right: 20rpx">价值: </span> ¥{{
            goodsInfo.price
          }}</view
        >

        <!---------------------- 夺宝已结束 ---------------------->
        <view class="detail-bq-wap" v-if="dbDetail.kj == 3">
          <view class="detail-bq-jg" v-if="dbDetail.kj_time">本期已揭晓</view>
          <!-- <view class="detail-bq-jg detail-bq-item" v-else>
            <span style="margin-left: 20rpx">正在进行</span>
            <span class="detail-bq-btn">查看详情</span>
          </view> -->
        </view>
        <!---------------------- 夺宝进行中 ---------------------->
        <view
          class="margin-top-sm flex align-center marginTop-10"
          style="flex-wrap: wrap"
          v-if="dbDetail.db_zt == 1"
        >
          <view class="text-sm text-999" style="width: 100%">
            <!------------------ 进行中进度条 -------------------->
            <view class="flex margin-top-xs align-center" style="width: 100%">
              <view class="cu-progress round xs">
                <view
                  class="mo-bgcred"
                  :style="[{ width: dbDetail.jjjx + '%' }]"
                ></view>
              </view>
            </view>
          </view>
          <view class="goods-num-wap">
            <span style="color: #f18104">{{ dbDetail.zjje }}</span>
            <span style="color: #999999">{{ dbDetail.price }}</span>
            <span style="color: #d93025">{{
              dbDetail.price - dbDetail.zjje
            }}</span>
          </view>
          <view class="goods-num-wap">
            <span style="color: #f18104">已参与</span>
            <span style="color: #999999">总需人数</span>
            <span style="color: #d93025">剩余</span>
          </view>
          <view class="goods-num-wap" style="margin-top: 20rpx">
            <span style="background: #d93025; width: 260rpx" class="detail-btn" @click="handleClick('cy')"
              >立即参与</span
            >
            <span style="background: #ffb320; width: 260rpx" class="detail-btn" @click="handleClick('cart')"
              >加入购物车</span
            >
            <span style="background: #22aaff; width: 160rpx" class="detail-btn" @click="handleClick('sc')"
              >收藏</span
            >
          </view>
        </view>
      </view>
      <!---------------------- 走势图,图文详情 ---------------------->
      <view class="detail-cell-wap">
       <view class="detail-cell-item" @click="handleToPage('/trend/index')">
        <span>走势图</span>
        <view class="detail-cell-item" > <image  class="detail-cell-arrow"
            src="../static/arrowRight.png"></image>
        </view>
        </view>
        <view class="detail-cell-item" @click="handleToPage('/img-text/index')">
          <span>图文详情</span>
          <image
            class="detail-cell-arrow"
            src="../static/arrowRight.png"
          ></image>
        </view>
      </view>
      <!---------------------- 上期获奖者 ---------------------->
      <view class="detail-cell-wap" v-if="dbDetail.db_zt == 1">
        <view class="detail-cell-item" v-for="item in 1" :key="item">
          <view class="detail-cell-info">
            <image class="detail-xym-img" src="../static/jiang.png"></image>
            <view>
              <view style="color: #22aaff">{{dbDetail.username}}</view>
              <view>总共参与: <span style="color: #d93025"> {{dbDetail.shops}}</span>人次</view>
              <view
                >幸运参与码:
                <span style="color: #d93025">{{dbDetail.xu_no}}</span></view
              >
              <view>揭晓时间: {{dbDetail.kj_time}}</view>
              <view>参与时间: {{dbDetail.add_time}}</view>
            </view>
          </view>
          <image
            class="detail-cell-arrow"
            src="../static/arrowRight.png"
          ></image>
        </view>
      </view>
      <!---------------------- 参与人次 ---------------------->
      <view class="detail-cell-wap" >
        <view
          class="detail-cell-item detail-cell-item-cy"
          v-for="(item, index) in yhcyInfo"
          :key="index"
        >
          <view class="detail-cell-info detail-cell-cy">
            <image class="detail-xym-img" src="../static/jiang.png"></image>
            <view>
              <view style="color: #22aaff">{{item.username}}</view>
              <view>
                <span>参与了</span>
                <span style="color: #d93025">{{ item.shops }}</span>
                <span>人次</span>
                <span style="color: #999999; margin-left: 20rpx"
                  >{{item.add_time}}</span
                >
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="footer-action">
      <view class="btn1" @click="handleGoPay">立即参与</view>
      <view class="btn2" @click="handleAddCart">加入购物车</view>
    </view>
  </view>
</template>
<script>
import moSwiper from "../components/mo-swiper/mo-swiper.vue";
export default {
  name: "shopindex",
  data() {
    return {
      goodsList: [],
      activeIndex: 1, // 当前选中期数
      bgColor: "", // 头部默认颜色
      animationData: {}, // 颜色渐变动画
      banners: [],
      goods_class: "",
      id: "",
      goods_id: "",
      goodsInfo: {}, // 商品详情
      dbDetail: {}, // 夺宝详情
      qishuData: [], // 期数
      yhcyInfo: [], // 用户参与
      isOne: true, // 是否第一次进入
      minute: null, // 分
      second: null, // 秒
      millisecond: null, // 毫秒
      timeInterval: null, // 定时器
    };
  },
  components: {
    moSwiper,
  },
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
  },
  watch: {},
  onLoad(options) {
    this.id = options.id;
    // this.goods_class = options.goods_class;
    this.goods_id = options.goods_id;
    uni.startPullDownRefresh();
    this.loadData();
    this.getDetail();
    this.getLszj();
    this.getDbDetail();
    this.timeInterval = setInterval(() => {
      this.time();
    }, 1);
  },
  onReady() {},
  onShow() {},
  onPullDownRefresh() {
    this.loadData();
    this.$refs.guess && this.$refs.guess.refresh();
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  onReachBottom(e) {
    if (this.goodsList.length < this.total) {
      this.pageNum = this.pageNum + 1;
    }
  },
  onPageScroll(e) {},
  methods: {
    handleGoPay() {
      uni.switchTab({
        url: "/pages/tab/cart/index",
      });
    },
    handleAddCart() {
      this.$util.actionAuth(() => {
        this.$api
          .post(global.apiUrls.add_goods_shop, {
            goods_id: this.id,
            option: 1,
            nums: 1,
          })
          .then((result) => {
            result = result.data;
            console.log("后台返回登录信息", result);
            if (result.code == 0) {
              this.$message.info("加入成功");
            } else {
              this.$message.info(result.msg);
            }
          })
          .catch((err) => {
            this.isShowLoading = false;
            this.isInit = true;
            console.log("ERROR", err);
            this.$message.info("服务器错误");
          });
      });
    },
    time() {
      let endTime = new Date("2021-09-29 08:27:00"); //结束时间
      let curTime = new Date(); //当前时间
      let leftTime = parseInt((endTime.getTime() - curTime.getTime()) / 1000); //获得时间差
      if (leftTime <= 0) {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
        this.minute = "00";
        this.second = "00";
        this.millisecond = "00";
        return false;
      }
      //小时、分、秒需要取模运算
      // let d = parseInt(leftTime/(60*60*24));
      // let h = parseInt(leftTime/(60*60)%24);
      this.minute =
        parseInt((leftTime / 60) % 60) < 10
          ? "0" + parseInt((leftTime / 60) % 60)
          : parseInt((leftTime / 60) % 60);
      this.second =
        parseInt(leftTime % 60) < 10
          ? "0" + parseInt(leftTime % 60)
          : parseInt(leftTime % 60);
      this.millisecond = parseInt(
        (endTime.getTime() - curTime.getTime()) / 100
      );
      this.millisecond = String(this.millisecond);
      this.millisecond = this.millisecond.substring(
        this.millisecond.length - 2
      );
      console.log(this.minute, this.second, this.millisecond);
    },
    handleClick(type) {
      switch (type) {
        case "cy": // 立即参与
          this.postApi(global.apiUrls.options_xiadan, {
            goods_id: this.goods_id,
            shops: "",
            shop_money: "",
          });
          break;
        case "cart": // 加入购物车
          this.postApi(global.apiUrls.add_goods_shop, {
            goods_id: this.goods_id,
          });
          break;
        case "sc": // 收藏
          this.postApi(global.apiUrls.get_goods_goods_fav, {
            goods_id: this.goods_id,
            option: this.goodsInfo.isCollection == 0 ? 1 : 0,
          });
          break;
      }
    },
    postApi(url, parms) {
      this.$util.actionAuth(() => {
        this.$api
          .post(url, parms)
          .then((result) => {
            result = result.data;
            console.log("后台返回登录信息", result);
            if (result.code == 0) {
              this.$message.info("添加成功");
            } else {
              this.$message.info(result.msg);
            }
          })
          .catch((err) => {
            this.isShowLoading = false;
            this.isInit = true;
            console.log("ERROR", err);
            this.$message.info("服务器错误");
          });
      });
    },
    handleToPage(url) {
      this.$urouter.navigateTo({
        url: "/pages/goods" + url,
        params: {
          goods_info: this.goodsInfo.goods_info,
        },
      });
    },
    getDetail() {
      // 获取商品详情
      this.$api
        .get(global.apiUrls.get_goods_detail, { goods_id: this.goods_id })
        .then((result) => {
          this.isShowLoading = false;
          this.isInit = true;
          result = result.data;
          if (result.code == 0) {
            this.goodsInfo = result.data;
            let banners = [];
            if (!!result.data.img) {
              result.data.img.forEach((item) => {
                banners.push({
                  thumb: global.IMG_BASE_URL + item,
                });
              });
              this.banners = banners;
            }
          } else {
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          this.isShowLoading = false;
          this.isInit = true;
          console.log("ERROR", err);
          this.$message.info("服务器错误");
        });
    },
    getLszj() {
      // 获取历史中奖记录
      this.$api
        .get(global.apiUrls.get_goods_lszj, {
          goods_id: this.goods_id,
          qishu: this.activeIndex,
        })
        .then((result) => {
          this.isShowLoading = false;
          this.isInit = true;
          result = result.data;
          if (result.code == 0) {
            this.lszjData = result.data;
          } else {
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          this.isShowLoading = false;
          this.isInit = true;
          console.log("ERROR", err);
          this.$message.info("服务器错误");
        });
    },
    getDbDetail() {
      // 获取历史中奖记录
      this.$api
        .get(global.apiUrls.get_db_detail, {
          goods_qs_id: this.goods_id,
          qishu: this.activeIndex,
        })
        .then((result) => {
          this.isShowLoading = false;
          this.isInit = true;
          result = result.data;
          if (result.code == 0) {
            this.dbDetail = result.data;
            this.qishuData = result.qishu;
            if (this.isOne) {
              this.activeIndex = this.qishuData[0].qishu;
              this.isOne = false;
            }
            this.getYhcy();
          } else {
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          this.isShowLoading = false;
          this.isInit = true;
          console.log("ERROR", err);
          this.$message.info("服务器错误");
        });
    },
    getYhcy() {
      // 用户参与
      this.$api
        .get(global.apiUrls.get_cyjl, { goods_id: this.id })
        .then((result) => {
          this.isShowLoading = false;
          this.isInit = true;
          result = result.data;
          if (result.code == 0) {
            this.yhcyInfo = result.data;
            console.log(this.yhcyInfo, "000000");
          } else {
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          this.isShowLoading = false;
          this.isInit = true;
          console.log("ERROR", err);
          this.$message.info("服务器错误");
        });
    },
    handleChange(index) {
      this.activeIndex = index;
      this.getDbDetail();
    },
    resetPageInfo() {
      this.pageNum = 1;
      this.total = 0;
      this.goodsList = [];
    },
    // 首页数据
    loadData() {},
  },
};
</script>
<style lang="scss" scoped>
.container {
  margin-top: -30rpx;
  padding-bottom: 88rpx;
}
.detail-djs-wap {
  margin-top: 10rpx;
  padding: 20rpx 25rpx;
  background: #fff;
  display: flex;
  justify-content: space-between;
  .detail-djs-item {
    width: 160rpx;
    height: 160rpx;
    border-radius: 10rpx;
    padding: 0 34rpx;
    background: #22aaff;
    font-size: 72rpx;
    position: relative;
    color: #fff;
    line-height: 160rpx;
    text-align: center;
    .detail-djs-img {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 39rpx;
      height: 34rpx;
    }
  }
  .detail-djs-info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    > span {
      display: inline-block;
    }
  }
}
.detail-cell-wap {
  margin-top: 10rpx;
  padding: 0 25rpx;
  background: #fff;
  .detail-cell-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 0;
    border-bottom: 2rpx solid #eeeeee;
  }
  .detail-cell-item-cy {
    padding: 20rpx 0;
  }
  .detail-cell-item:last-child {
    border-bottom: none;
  }
  .detail-cell-info {
    display: flex;
    font-size: 24rpx;
    color: #333;
  }
  .detail-cell-cy {
    align-items: center;
    .detail-xym-img {
      width: 70rpx;
      height: 70rpx;
      background: #d93025;
      border-radius: 50%;
    }
  }
  .detail-xym-img {
    width: 180rpx;
    height: 180rpx;
    margin-right: 10rpx;
  }
  .detail-cell-arrow {
    width: 10rpx;
    height: 18rpx;
  }
}
.detail-bq-wap {
  margin-top: 10rpx;
  .detail-bq-jg {
    border: 2rpx solid #ccc;
    height: 72rpx;
    line-height: 72rpx;
    text-align: center;
    border-radius: 36rpx;
    font-size: 32rpx;
    font-weight: bold;
    background: #eeeeee;
    color: #333333;
  }
  .detail-bq-item {
    display: flex;
    justify-content: space-between;
    color: #d93025;
    font-weight: 500;
    font-size: 28rpx;
    margin-top: 10rpx;
  }
  .detail-bq-btn {
    width: 160rpx;
    height: 52rpx;
    background: #d93025;
    border-radius: 26rpx;
    margin: 8rpx 10rpx 0 0;
    color: #fff;
    line-height: 52rpx;
    font-size: 24rpx;
  }
}
.detail-xym-wap {
  background: #ffffff;
  margin: 10rpx 0;
  .detail-xym-img-wap {
    position: relative;
    .detail-xym-phone {
      width: 126rpx;
      position: absolute;
      bottom: 20rpx;
      left: 32rpx;
      height: 30rpx;
      line-height: 30rpx;
      background: rgba($color: #000000, $alpha: 0.4);
      border-radius: 0 0 10rpx 10rpx;
      color: #fff;
    }
  }
  .detail-xym-btm {
    display: flex;
    justify-content: space-between;
    height: 66rpx;
    line-height: 66rpx;
    padding: 0 25rpx;
    font-size: 28rpx;
    .detail-xym-btm-btn {
      width: 200rpx;
      background: #d93025;
      color: #fff;
      height: 46rpx;
      line-height: 46rpx;
      border-radius: 23rpx;
      text-align: center;
      font-size: 24rpx;
      margin-top: 10rpx;
    }
  }
  .detail-xym-info {
    display: flex;
    justify-content: space-around;
    border-bottom: 2rpx solid #eeeeee;
    .detail-xym-item {
      max-width: 25%;
      min-width: 25%;
      padding: 26rpx;
      height: 180rpx;
      text-align: center;
      border-right: 2rpx solid #eeeeee;
      font-size: 24rpx;
      color: #999;
      .detail-xym-img {
        margin-top: -10rpx;
        width: 140rpx;
        height: 140rpx;
      }
    }
    .detail-xym-time {
      color: #333;
    }
    .detail-xym-item:last-child {
      border-right: none;
    }
  }
}
.margin-top-sm {
  margin-top: 10rpx;
}
.detail-info-title {
  font-weight: bold;
  font-size: 32rpx;
  color: #333333;
}
.detail-info-price {
  font-size: 22rpx;
  color: #333333;
}
.detail-info {
  padding: 20rpx;
  background: #fff;
  .detail-btn {
    height: 60rpx;
    line-height: 60rpx;
    border-radius: 30rpx;
    color: #fff;
    text-align: center;
    font-size: 28rpx;
    font-weight: bold;
  }
}
.goods-num-wap {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 22rpx;
}
.swiper-wrap {
  position: relative;
  overflow: hidden;
  width: 750rpx;
  height: 320rpx;
  padding: 20rpx 26rpx;
  box-sizing: border-box;
  background: #fff;

  .swiper-bg {
    height: 200rpx;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 0 0 50% 50%;
  }
}

.detail-header {
  position: fixed;
  top: -2rpx;
  z-index: 999;
  height: 66rpx;
  background: #eeeeee;
  width: 100%;
  .detail-header-item-wap {
    overflow-x: scroll;
    white-space: nowrap;
    height: 66rpx;
  }
  .detail-header-item {
    display: inline-block;
    text-align: center;
    line-height: 66rpx;
    width: 200rpx;
    color: #333333;
    font-size: 28rpx;
  }
  .active {
    background: #f8f8f8;
    color: #d93025;
  }
}
.footer-action {
  height: 88rpx;
  position: fixed;
  bottom: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  .btn2 {
    width: 50%;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: #d93025;
    color: #fff;
  }
  .btn1 {
    width: 50%;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: rgb(66, 64, 64);
    color: #fff;
  }
}
</style>
