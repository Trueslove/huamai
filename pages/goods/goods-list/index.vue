<template>
  <view>
    <mo-custom isBack="true" :isBottom="true" bgColor="bg-white">
      <view slot="content">商品列表</view>
    </mo-custom>
    <view class="goods-list">
      <view class="goods-list-search-wap">
        <view class="goods-list-search">
          <text class="cuIcon-search goods-search-icon"></text>
          <input class="goods-list-input" v-model="search" type="text" />
          <text class="goods-search-btn" @click="handlSearch">搜索</text>
        </view>
      </view>
      <view class="goods-list-content">
        <view
          class="goods-item"
          v-for="(item, index) in goodsList"
          :key="index"
          @click.stop="goDetail(item)"
        >
          <image class="goods-item-img" :src="baseImgUrl + item.img"></image>
          <view class="goods-item-info">
            <view class="goods-item-title">{{ item.goods_name }}</view>
            <view style="font-size: 24rpx"
              ><span>价值: </span>¥{{ item.price }}</view
            >
            <view
              class="margin-top-sm flex align-center marginTop-10"
              style="flex-wrap: wrap"
            >
              <view class="text-sm text-999" style="width: 100%">
                <!-- 进度条 -->
                <view
                  class="flex margin-top-xs align-center"
                  style="width: 100%"
                >
                  <view class="cu-progress round xs">
                    <view
                      class="mo-bgcred"
                      :style="[{ width: item.jjjx * 100 + '%' }]"
                    ></view>
                  </view>
                </view>
              </view>
              <view class="goods-num-wap">
                <span style="color: #f18104">{{ item.zjje }}</span>
                <span style="color: #999999">{{ item.price }}</span>
                <span style="color: #d93025">{{ item.price - item.zjje }}</span>
              </view>
              <view class="goods-num-wap">
                <span>已参与</span>
                <span>总需人数</span>
                <span>剩余</span>
              </view>
            </view>
          </view>
          <image
            class="goods-item-cart"
            @click.stop="handleAddCart(item)"
            src="../../../static/home/cart.png"
          ></image>
        </view>
      </view>
    </view>
        <view class="text-center text-999" v-if='goodsList.length ==0'>没有数据哦</view>
  </view>
</template>

      <script>
export default {
  props: {
    info: {
      type: Object,
    },
  },
  data() {
    return {
      baseImgUrl: global.IMG_BASE_URL,
      pageNum: 1, // 当前页
      total: 0, // 总条数
      search: "",
      goods_class: 1,
      type_sort: 1,
      goodsList: [],
    };
  },
  onLoad(options) {
    //   this.type_sort = options.type_sort;
    //   this.goods_class = options.goods_class;
  },
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
      this.getData();
    }
    // this.$refs.guess && this.$refs.guess.loadData();
  },
  methods: {
     handleAddCart(item) {
    this.$util.actionAuth(() => {
        this.$api
          .post(global.apiUrls.add_goods_shop, {
            goods_id: item.id,
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
    handlSearch() {
      this.getData();
    },
    goDetail(info) {
      this.$urouter.navigateTo({
          url: '/pages/goods/goods-detail/index',
          params: {
            goods_id: info.goods_db_key_id,
            goods_class: this.goods_class,
            id: info.id,
            qs: info.qishu
          }
        });
    },
    getData() {
      this.isShowLoading = true;
      let params = {};
      if (this.goods_class) {
        params = {
          pageNum: this.pageNum,
          type_sort: this.type_sort + 1,
          goods_class: this.goods_class,
          search: this.search,
        };
      } else {
        params = {
          pageNum: this.pageNum,
          type_sort: this.type_sort + 1,
          search: this.search,
        };
      }
      this.$api
        .get(global.apiUrls.get_goods_list, params)
        .then((result) => {
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
        .catch((err) => {
          this.isShowLoading = false;
          this.isInit = true;
          console.log("ERROR", err);
          this.$message.info("服务器错误");
        });
    },
  },
};
</script>
      
<style lang="scss" scoped>
.goods-list-content {
  margin-top: 20rpx;
  background: #fff;
  .goods-item {
    display: flex;
    justify-content: space-between;
    padding: 20rpx;
    border-bottom: 2rpx solid #cecece;
  }
  .goods-item:last-child {
    border-bottom: none;
  }
  .goods-item-title {
    width: 450rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .goods-item-img {
    width: 160rpx;
    height: 160rpx;
  }
  .goods-item-info {
    flex: 1;
    padding: 0 20rpx;
  }
  .goods-item-cart {
    margin-top: 100rpx;
    width: 60rpx;
    height: 60rpx;
  }
  .goods-num-wap {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 9rpx;
  }
  .margin-top-sm {
    margin-top: 0;
  }
}
.goods-list-search-wap {
  z-index: 100;
  position: fixed;
  top: 80rpx;
  left: 0;
  width: 100%;
  padding: 15rpx 25rpx;
  background: #fff;
  .goods-list-search {
    display: flex;
    justify-content: center;
    position: relative;
    .goods-search-icon {
      position: absolute;
      left: 13rpx;
      top: 13rpx;
    }
    .goods-list-input {
      flex: 1;
      height: 50rpx;
      padding: 0 50rpx;
      border: 2rpx solid #cecece;
      border-radius: 8rpx;
    }
    .goods-search-btn {
      margin-left: 10rpx;
      height: 50rpx;
      line-height: 50rpx;
      padding: 0 10rpx;
      background-color: rgb(218, 50, 40);
      border-radius: 5rpx;
      text-align: center;
      color: #fff;
    }
  }
}
</style>