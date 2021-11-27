<template>
  <view>
    <mo-custom isBack="true" :isBottom="true" bgColor="bg-white">
      <view slot="content">我的收藏</view>
    </mo-custom>
    <view class="goods-content" v-if="goodsList.length > 0">
      <view
        class="goods-c-item"
        v-for="(item, index) in goodsList"
        :key="index"
      >
        <view class="goods-c-i-left">
          <image class="goods-c-i-l-img" :src="baseImgUrl + item.img"></image>
        </view>
        <view class="goods-c-i-center">
          <view class="content">
            <view class="text-lg text-333 text-cut-2 goods-c-i-name">
              {{ item.goods_name }}
            </view>

            <view class="flex justify-between margin-top-xs">
              <view> 期数: {{ item.qishu }} </view>
              <view class="delte-icon" @click="delete_shops(item)"
                ><text class="cuIcon-delete text-lg" style="font-size:36rpx"></text
              ></view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view>
      <mo-empty-ui v-if="goodsList.length == 0 && isInit"></mo-empty-ui>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      goodsList: [],
      isInit: false,
      pageNum: 1,
      baseImgUrl: global.IMG_BASE_URL,
    };
  },
  onLoad() {
    this.getData();
  },
  onReachBottom(e) {
    console.log(this.total);
    if (this.goodsList.length < this.total) {
      this.pageNum = this.pageNum + 1;
      this.getData();
    }
  },
  onPullDownRefresh() {
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    getData() {
      this.$api
        .get(global.apiUrls.fav_list, { pageNum: this.pageNum })
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
    delete_shops(item, index) {
      this.$util.showModal({
        title: "提示",
        content: "确定取消收藏吗？",
        confirmColor: this.$store.state.themeColor,
        success: (res) => {
          if (res.confirm) {
            this.$api
              .post(global.apiUrls.get_goods_goods_fav, {
                goods_id: item.id,
                option: 2,
              })
              .then((result) => {
                result = result.data;
                console.log("后台返回登录信息", result);
                this.goodsList.splice(index, 1);
                this.$forceUpdate();
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
          }
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.goods-content {
  margin-bottom: 168rpx;
}
.goods-c-item:first-child {
  border-top: 1px solid #eee;
}
.goods-c-item {
  padding: 30rpx 16rpx;
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #eee;
  .goods-c-i-left {
    .goods-c-i-l-img {
      width: 160rpx;
      height: 160rpx;
    }
  }
  .goods-c-i-cart {
    height: 70rpx;
    width: 70rpx;
  }
  .goods-c-i-center {
    flex: 1;
    padding: 0 20rpx;
  }
}
</style>