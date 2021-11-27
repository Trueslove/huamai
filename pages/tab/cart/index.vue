<template>
  <view>
    <mo-custom :isBottom="true" bgColor="bg-white">
      <view slot="content">购物车</view>
    </mo-custom>
    <!-- 未登录状态  显示空购物车 按钮为去登录 -->
    <template v-if="!isLogin">
      <view class="cart-empty">
        <image
          class="empty-img"
          src="/static/empty/cart.png"
          mode="widthFix"
        ></image>
        <view class="empty-text">您的购物车还没有商品，快去挑选吧</view>
        <view
          class="empty-btn"
          @click="handleJumpLogin"
          data-url="/pages/user/auth-login/index"
          >去登录</view
        >
      </view>
    </template>
    <!-- 未登录状态 end-->
    <view class="" v-else>
      <view class="goods-content" v-if="goodsList.length > 0">
        <view
          class="goods-c-item"
          v-for="(item, index) in goodsList"
          :key="index"
          @click="goDetail(item)"
        >
          <view class="goods-c-i-left">
            <image class="goods-c-i-l-img" :src="baseImgUrl + item.img"></image>
          </view>
          <view class="goods-c-i-center">
            <view class="content">
              <view class="text-lg text-333 text-cut-2 goods-c-i-name">
                {{ item.goods_name }}
              </view>
              <view class="margin-top-xs">
                <view class="text-666"
                  >剩余{{ item.price - item.shop_money }}人次</view
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
                        :style="[
                          { width: (item.shop_money / item.price) * 100 + '%' },
                        ]"
                      ></view>
                    </view>
                  </view>
                </view>
              </view>
              <view class="flex justify-between margin-top-xs">
                <view>
                  <view class="number" @tap.stop="">
                    <cart-number-box
                      :min="1"
                      :max="item.price - item.shop_money"
                      :value="item.shop_nums"
                      @change="numberChange($event, index)"
                    >
                    </cart-number-box>
                  </view>
                </view>
                <view
                  class="delte-icon"
                  @click="delete_shops_all(item.id, index)"
                  ><text class="cuIcon-delete"></text
                ></view>
              </view>
              <view class="list-tag-num flex flex-wrap margin-top-xs">
                <view
                  class="item-tab-num"
                  @click="numberChange(k.shop_nums, index)"
                  :key="i"
                  v-for="(k, i) in item.numbers"
                >
                  {{ k.shop_nums }}
                </view>
                <view
                  class="item-tab-num"
                  @click="numberChange(item.price - item.shop_money, index)"
                >
                  梭哈
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="cart-footer-top">
          <view class=""></view>
          <view class="cart-footer-top_right">
            <view class="add-next" @click="handleGoGoods()">继续添加</view>
            <view class="detele-all" @click="delete_shops_all()">清空</view>
          </view>
        </view>
        <view class="cart-footer">
          <view class="footer-right">
            <view class="all-text">
              <view class="text-sm margin-right-xs"
                >共 {{ goods_nums }}件商品</view
              >
              <view class="text1">合计：</view>
              <view class="text-price-box">
                <text class="small">￥</text>
                {{ totalPrice }}
              </view>
            </view>
            <view class="jiesuan-btn" @click="createOrder">付款 </view>
          </view>
        </view>
      </view>
      <view class="goods-none" v-else>
        购物车为空
        <view class="add_btn" @click="handleGoGoods()"> 去添加 </view>
      </view>
    </view>
  </view>
</template>
<script>
import cartNumberBox from "../components/cart-number-box/cart-number-box.vue";
export default {
  components: {
    cartNumberBox,
  },
  data() {
    return {
      baseImgUrl: global.IMG_BASE_URL,
      goodsList: [],
      pageNum: 1,
    };
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

  computed: {
    // 用户信息
    isLogin() {
      return this.$store.getters.isLogin || "";
    },
    // 选择的商品总价
    totalPrice() {
      let list = this.goodsList;
      let total = 0;
      console.log(list);
      list.forEach((item) => {
        let _price = item.money;
        total += Number(_price) * Number(item.shop_nums);
        console.log(total);
      });
      return Number(total.toFixed(2));
    },
    goods_nums() {
      let list = this.goodsList;
      let total = 0;
      list.forEach((item) => {
        total += Number(item.shop_nums);
        console.log(total);
      });
      return total;
    },
  },
  methods: {
    delete_shops_all(id, index) {
      this.$util.showModal({
        title: "提示",
        content: id? "确定删除商品吗？":'确定清空购物车吗？',
        confirmColor: this.$store.state.themeColor,
        success: (res) => {
          if (res.confirm) {
            let data = {};
            if (id) {
              data.goods_id = id;
            }
            this.$api.post(global.apiUrls.delete_shops, data).then((result) => {
              console.log(result);
              result = result.data;
              if (result.code == 0) {
                this.$message.info(result.msg);
                if (id) {
                  this.goodsList.splice(index, 1);
                  return false;
                }
                this.pageNum = 1;
                this.goodsList = [];
                this.getData();
              } else {
                this.$message.info(result.msg);
              }
            });
          }
        },
      });
    },
    handleGoGoods() {
      uni.switchTab({
        url: "/pages/tab/goods/index",
      });
    },
    createOrder() {
      this.$util.showModal({
        title: "提示",
        content: "确认支付吗？",
        confirmColor: this.$store.state.themeColor,
        success: (res) => {
          if (res.confirm) {
            console.log(this.goodsList);
            uni.showLoading({
              title: "支付中",
            });

            //
            let _this = this;
            async function test() {
              for (let i = 0; i < _this.goodsList.length; i++) {
                console.log(i);

                await _this.xiadan(_this.goodsList[i], i);
              }
              uni.hideLoading();
              _this.$message.info("支付成功");
              _this.pageNum = 1;
              _this.goodsList = [];
              _this.getData();
            }
            test();
          }
        },
      });
    },
    xiadan(item, index) {
      return new Promise((resolve, reject) => {
        this.$api
          .post(global.apiUrls.post_xiadan, {
            goods_id: item.id,
            shops: item.shop_nums,
            shop_money: item.shop_money,
            shops_id: item.shops_id,
          })
          .then((res) => {
            console.log("cart number", res.data);
            if (res.data.code == 0) {
              resolve();
            } else {
              this.$message.info(res.data.msg);
              setTimeout(() => {
                this.pageNum = 1;
                this.goodsList = [];
                this.getData();
              }, 500);
             resolve();
            }
          })
          .catch(() => {
            uni.hideLoading();
            reject();
          });
      });
    },
    /** @description 数量改变
     * @param {Object} e
     * @param {string} index
     */
    numberChange(e, index) {
      let item = this.goodsList[index];
      console.log(item, e, index);
      if (e == this.goodsList[index].shop_nums) {
        return false;
      }
      let ids = [item.id];
      console.log(ids, 11111);

      this.$api
        .post(global.apiUrls.add_goods_shop, {
          goods_id: JSON.stringify(ids),
          option: 3,
          nums: e,
        })
        .then((res) => {
          console.log("cart number", res.data);
          if (res.data.code == 0) {
            this.$set(this.goodsList[index], "shop_nums", e);
          }
        });
    },
    goDetail() {
      console.log(111);
    },
    getData() {
      this.$api
        .get(global.apiUrls.cart_list, { pageNum: this.pageNum })
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
          this.$message.info("服务器错误");
        });
    },
  },
  onShow() {
    if (this.isLogin) {
      this.pageNum = 1;
      this.goodsList = [];
      this.getData();
    }
  },
};
</script>
<style lang="scss" scoped>
.cart-empty {
  width: 750rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;

  .empty-img {
    display: block;
    margin-top: 64rpx;
    width: 440rpx;
    height: 220rpx;
  }

  .empty-text {
    margin-top: 28rpx;
    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 33rpx;
    color: #999999;
    opacity: 1;
  }

  .empty-btn {
    margin-top: 27rpx;
    margin-bottom: 64rpx;
    width: 280rpx;
    // height: 64rpx;
    background: rgb(254, 75, 97);
    opacity: 1;
    border-radius: 36rpx;
    text-align: center;
    font-size: 28rpx;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 64rpx;
    color: #ffffff;
    opacity: 1;
  }
}
.goods-none {
  width: 100%;
  padding: 50rpx 0;
  text-align: center;
}
.goods-c-item:first-child {
  border-top: 1px solid #eee;
}
.goods-c-item {
  padding: 30rpx 16rpx;
  display: flex;
  // align-items: center;
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
// 购物车底部操作栏部分
.cart-footer {
  height: 90rpx;
  width: 750rpx;
  left: 0;
  position: fixed;
  // #ifdef H5
  bottom: 100rpx !important;
  // #endif
  // #ifndef H5
  bottom: 0 !important;
  // #endif
  width: 100%;
  z-index: 999;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .footer-left {
    display: flex;
    align-items: center;

    .check-box {
      margin-left: 32rpx;
      width: 37rpx;
      height: 37rpx;
      flex-shrink: 0;
      position: relative;
      transform: translateY(-23%);
    }

    .text-box {
      margin-left: 16rpx;

      .text1 {
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 40rpx;
        color: #333333;
      }

      .text2 {
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 33rpx;
        color: #999999;
      }
    }
  }
}

.footer-right {
  // 右边 正常状态
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  .all-text {
    display: flex;
    align-items: center;
    margin-right: 24rpx;

    .text1 {
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 32rpx;
      color: #666666;
      opacity: 1;
    }

    .text-price-box {
      font-size: 32rpx;
      font-family: Oswald;
      font-weight: 500;
      line-height: 36rpx;
      color: #fa2033;

      .small {
        font-size: 22rpx;
      }
    }
  }

  .jiesuan-btn {
    width: 230rpx;
    // height: 90rpx;
    background: linear-gradient(126deg, #fa2033 0%, #ff6530 100%);
    opacity: 1;
    text-align: center;
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 90rpx;
    color: #ffffff;
  }

  // 右边 编辑状态
  .footer-btn {
    width: 200rpx;
    background: #f6f6f6;
    opacity: 1;
    border-radius: 44rpx;
    text-align: center;
    font-size: 28rpx;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 72rpx;
    color: #333333;
    opacity: 1;
    margin-right: 24rpx;
    margin-left: -8rpx;
  }
}
.goods-content {
  margin-bottom: 168rpx;
}
.item-tab-num {
  border: 1rpx solid #ddd;
  background: #eee;
  margin-right: 15rpx;
  padding: 2rpx 10rpx;
  border-radius: 10rpx;
}
.delte-icon {
  border: 1rpx solid #ddd;
  border-radius: 10rpx;
  padding: 2rpx 10rpx;
}
.cart-footer-top {
  // #ifdef H5
  bottom: 190rpx !important;
  // #endif
  // #ifndef H5
  bottom: 100rpx !important;
  // #endif
  position: fixed;
  height: 80rpx;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-top: 1rpx solid #f1f1f1;
  border-bottom: 1rpx solid #f1f1f1;
  .cart-footer-top_right {
    display: flex;
    align-items: center;
    margin-right: 26rpx;
    height: 100%;
    .add-next {
      padding: 6rpx 10rpx;
      border-radius: 10rpx;
      border: 1rpx solid rgb(252, 156, 12);
      color: rgb(252, 156, 12);
      margin-right: 10rpx;
    }
    .detele-all {
      padding: 6rpx 10rpx;
      border-radius: 10rpx;
      border: 1rpx solid rgb(223, 61, 11);
      color: rgb(223, 61, 11);
    }
  }
}
.add_btn {
  text-align: center;
  margin: 0 auto;
  margin-top: 100rpx;
  margin-bottom: 64rpx;
  width: 280rpx;
  // height: 64rpx;
  background: rgb(254, 75, 97);
  opacity: 1;
  border-radius: 36rpx;
  text-align: center;
  font-size: 28rpx;
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 64rpx;
  color: #ffffff;
  opacity: 1;
}
</style>
