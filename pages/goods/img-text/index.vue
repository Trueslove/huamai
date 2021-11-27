<template>
    <view class="img-text" >
    <!-- v-html="goodsInfo" -->
    <view class="text-center" v-if="!goodsInfo">
 <mo-empty-ui ></mo-empty-ui>
    </view>
    <jyf-parser v-else :html="goodsInfo"></jyf-parser>
    </view>

</template>
<script>
export default {
  name: "shopindex",
  data() {
    return {
      goodsInfo: '', // 商品详情
    };
  },
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
  },
  watch: {

  },
  onLoad(options) {
    this.goodsInfo = options.goods_info;
    console.log(this.goodsInfo)
  },
  onReady() {},
  onShow() {

  },
};
</script>

<style lang="scss">
.img-text {
    width: 100%;
    // background: #fff;
    p {
        font-size: 24rpx;

    }
}
img {
            width: 750rpx;
        }
</style>
