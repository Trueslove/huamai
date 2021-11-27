<template>
  <view class="wrapper" @click="goDetail">
    <view class="wrap-box">
      <view class="square-wrap">
        <view class="square-box">
          <image :src="baseImgUrl + info.img" mode='aspectFit'></image>
        </view>
      </view>
      <view class="content">
        <view class="text-lg text-333 text-cut-2">
          {{ info.goods_name }}
        </view>
        <view
          class="margin-top-sm flex align-center marginTop-10"
          style="flex-wrap: wrap"
        >
          <view class="text-sm text-999" style="width: 100%">
            <!-- 进度条 -->
            <view class="flex margin-top-xs align-center" style="width: 100%">
              <view class="cu-progress round xs">
                <view
                  class="mo-bgcred"
                  :style="[{ width: info.jjjx * 100 + '%' }]"
                ></view>
              </view>
            </view>
          </view>
          <view class="goods-num-wap">
            <span style="color: #f18104">{{ info.zjje }}</span>
            <span style="color: #999999">{{ info.price }}</span>
            <span style="color: #d93025">{{ info.price - info.zjje }}</span>
          </view>
        </view>
        <view
          class="margin-top-sm flex align-center marginTop-10 justify-between"
        >
          <view class="icon" @click.stop="handleCollection"
            ><image
              v-if="info.is_fav == 0"
              src="../../../../static/home/unlike.png"
            ></image>
            <image
              v-if='info.is_fav == 1'
              src="../../../../static/home/like.png"
            ></image>
          </view>
          <view class="btn"  @click.stop="handleGoPay">立即参与</view>
          <view class="icon" @click.stop="handleAddCart"
            ><image src="../../../../static/home/cart.png"></image
          ></view>
        </view>
      </view>
    </view>
  </view>
</template>
      <script>
export default {
  props: {
    info: {
      type: Object,
    },
    goods_class: {
      type: [String,Number],
    },
  },
  data() {
    return {
      list:{},
      baseImgUrl: global.IMG_BASE_URL,
    };
  },
  watch:{
    info(val){
      if(val){
        this.list = this
      }
    }
  },
  mounted() {

  },
  methods: {
     handleGoPay() {
      uni.switchTab({
        url: "/pages/tab/cart/index",
      });
    },
    goDetail() {
        this.$urouter.navigateTo({
          url: '/pages/goods/goods-detail/index',
          params: {
            goods_id: this.info.goods_db_key_id,
            // goods_class: this.goods_class,
            id: this.info.id,
            qs: this.info.qishu
          }
        });
      },
    handleCollection() {
      this.$util.actionAuth(() => {
        console.log(this.info.is_fav)
        this.$api
          .post(global.apiUrls.get_goods_goods_fav, {
            goods_id: this.info.id,
            option: this.info.is_fav == 1 ? 2 : 1
          })
          .then((result) => {
            result = result.data;
            console.log("后台返回登录信息", result);
            this.info.is_fav = this.info.is_fav ==1? 0:1
            console.log(this.info.is_fav)
            this.$forceUpdate()
            if (result.code == 0) {
              this.$message.info(result.msg);
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
    handleAddCart() {
      this.isShowLoading = true;
      this.$util.actionAuth(() => {
        this.$api
          .post(global.apiUrls.add_goods_shop, {
            goods_id: this.info.id,
            option:1,
            nums:1,
          })
          .then((result) => {
            this.isShowLoading = false;
            this.isInit = true;
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

  },
};
</script>

      <style lang="scss" scoped>
.goods-num-wap {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 24rpx;
}
.wrapper {
  width: 50%;
  overflow: hidden;
  margin: 0rpx 0 20rpx;
  padding: 0 5rpx;
  .wrap-box {
    background-color: #ffffff;
    border-radius: 10rpx;

    .square-wrap {
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      box-sizing: border-box;
      position: relative;

      .square-box {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        border-radius: 16rpx 16rpx 0 0;
        overflow: hidden;
        image {
          width: 100%;
          height: 100%;
          border-radius: 16rpx 16rpx 0 0;
        }
      }
    }
    .image {
      width: 100%;
      border-radius: 16rpx 16rpx 0 0;
    }
  }

  .content {
    padding: 10rpx;
  }
}

.text-cut-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.text-through {
  text-decoration: line-through;
}

.text-333 {
  color: #333333;
}

.text-999 {
  color: #999999;
}

.name-title {
  position: relative;
}

.name-title-label {
  float: left;
}

.item-goods-label {
  background: #ff6464;
  padding: 2rpx 5rpx;
  color: #ffffff;
  font-size: 24rpx;
  border-radius: 6rpx;
  margin-right: 9rpx;
}
.item-activity-label {
  padding: 0 8rpx;
  height: 32rpx;
  line-height: 30rpx;
  border: 1px solid #fa2033;
  opacity: 1;
  border-radius: 4rpx;
  font-size: 20rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: #fa2033;
  margin-right: 16rpx;
  &:nth-of-type(1) {
    border: 1px solid #0a7ce6;
    color: #0a7ce6;
  }
}
.marginTop-16 {
  margin-top: 16rpx;
}
.marginTop-10 {
  margin-top: 10rpx;
}
.margin-left-16 {
  margin-left: 16rpx;
}
.btn {
  width: 160rpx;
  height: 56rpx;
  border: 2rpx solid #d93025;
  border-radius: 28rpx;
  line-height: 56rpx;
  text-align: center;
  color: #d93025;
}
.icon {
  width: 54rpx;
  height: 54rpx;
  margin: 0 6rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
</style>
