<template>
  <view>
    <mo-custom :isBottom="true" bgColor="bg-white">
      <view slot="content">揭秘</view>
    </mo-custom>
    <view class="uncover">
      <template>
        <view
          class="uncover-item"
          v-for="(item, index) in goodsList"
          :key="index"
          @click="goDetail(item)"
        >
          <view class="uncover-item-left">
            <img class="uncover-item-img" :src="baseImgUrl + item.img" alt="" />
            <view class="uncover-item-l-qs"> 第{{ item.qishu }}期 </view>
          </view>
          <view class="uncover-item-right">
            <view class="uncover-item-r-top">
              <!-- <img
                class="uncover-item-r-img"
                src="http://m.jiangyan6.cn/statics/uploads/photo/tou/default_tou.png"
                alt=""
              /> -->
              <view class="">
                <view class="uncover-item-text" style="font-size: 28rpx"
                  >获奖者:
                  <text style="color: #2af">{{ item.username }}</text></view
                >
                <view class="uncover-item-text" style="font-size: 28rpx"
                  >本期: <text style="color: #ff53a5"> {{ item.rc }}</text
                  >人次</view
                >
              </view>
            </view>
            <view class="uncover-item-r-btm">
              <view class="uncover-item-text" style="color: #bbb"
                >幸运码:
                <text style="color: #ff53a5">{{ item.xu_no }}</text></view
              >
              <view class="uncover-item-text" style="color: #bbb"
                >揭晓时间:
                <text style="color: #2c3036">{{ item.end_time }}</text></view
              >
            </view>
          </view>
          <img
            class="uncover-item-arrow"
            src="../../../static/home/arrowRight.png"
            alt=""
          />
        </view>
      </template>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      baseImgUrl: global.IMG_BASE_URL,
      pageNum: 1, // 当前页
      total: 0, // 总条数
      goodsList: [],
    };
  },
  onReachBottom(e) {
    if (this.goodsList.length < this.total) {
      this.pageNum = this.pageNum + 1;
      this.getData();
    }
  },
  onShow() {
    this.getData();
  },
  onPullDownRefresh() {
      setTimeout(() => {
        uni.stopPullDownRefresh();
      }, 1000);
    },
  onload() {},
  methods: {
    goDetail(info) {
      this.$urouter.navigateTo({
        url: "/pages/goods/goods-detail/index",
        params: {
          goods_id: info.goods_id,
          qs: info.qishu,
          id: info.goods_id,
        },
      });
    },
    getData() {
      this.isShowLoading = true;
      let params = {
        pageNum: this.pageNum,
      };
      this.$api
        .get(global.apiUrls.get_goods_zxjx, params)
        .then((result) => {
          this.isShowLoading = false;
          this.isInit = true;
          result = result.data;
          if (result.code == 0) {
            this.goodsList = this.goodsList.concat(result.data);
            this.total = result.nums;
          } else {
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          this.isShowLoading = false;
          this.isInit = true;
          this.$message.info("服务器错误");
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.uncover-item {
  display: flex;
  align-items: center;
  padding: 30rpx 16rpx;
  background: #fff;
  border-bottom: 1px solid #eee;
  .uncover-item-text {
    font-size: 24rpx;
    > text {
      margin-left: 10rpx;
    }
  }
  .uncover-item-left {
    position: relative;
    .uncover-item-img {
      width: 160rpx;
      height: 160rpx;
    }
    .uncover-item-l-qs {
      width: 160rpx;
      height: 34rpx;
      background: rgba(0, 0, 0, 0.4);
      font-size: 24rpx;
      color: white;
      border-radius: 0 0 3px 3px;
      text-align: center;
      position: absolute;
      bottom: 0;
    }
  }
  .uncover-item-right {
    flex: 1;
    margin-left: 20rpx;
    .uncover-item-r-top {
      display: flex;
      align-items: center;
      .uncover-item-r-img {
        width: 80rpx;
        height: 80rpx;
      }
    }
    .uncover-item-r-btm {
      margin-top: 10rpx;
    }
  }
  .uncover-item-arrow {
    width: 14rpx;
    height: 20rpx;
  }
}
</style>
