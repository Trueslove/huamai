<template>
  <view>
    <mo-custom isBack="true" :isBottom="true" bgColor="bg-white">
      <view slot="content">获得商品</view>
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
              <view> 价值: ¥{{ item.price }} </view>
              <view class="delte-icon"></view>
            </view>
          </view>
          <view>
            <view class="flex" v-if="item.options ==1">
              <view class="btn" @click="handleWanshan(item)" >完善地址</view>
              <view class="btn btn1 margin-left-sm" @click="goConversion(item)">在线兑换</view>
            </view>
            <text v-if="item.options == 2" class="btn btn2" >已领取</text>
            <text v-if="item.options == 3" class="btn btn2" >已折现</text>
          </view>
        </view>
      </view>
    </view>
    <view>
      <mo-empty-ui v-if="goodsList.length == 0 && isInit"></mo-empty-ui>
    </view>

    <view class="back-success-wrap" v-if="backSuccessShow">
      <view class="mask" @click="backSuccessShow = false"> </view>
      <view class="back-content">
        <view class="text-center margin-tb text-lg text-bold">在线兑换</view>
        <view class=" padding text-sm ">
          <view class="text-cut-2">商品：{{goods_name}}</view>
          <view class="padding-tb-sm">卖出价：¥{{hs_price}}</view>
          <view>你可以选择以下操作</view>
          <view class="flex justify-around padding">
            <view class="btn-dh" @click="conversion()">在线兑换</view>
            <view  class="btn-dh" @click="backSuccessShow = false">取消</view>
          </view>
          <view>
            商品在线兑换，将商品按照卖出价，转入你的佣金（佣金可用于提现或充值）
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      backSuccessShow:false,
      goodsList: [],
      isInit: false,
      pageNum: 1,
      baseImgUrl: global.IMG_BASE_URL,
      goodsdb_id:'',
      goods_name:'',
      info:{},
      hs_price:'',
    };
  },
  onShow() {
    this.pageNum =1 
    this.goodsList =[]
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
    handleWanshan(item){
      console.log(item)
this.$urouter.navigateTo({
					url: '/pages/user/confirm-conversion/index',
					params: {
						id: item.goods_detail_key || 0,
            img:item.img,
            goods_name:item.goods_name,
            price:item.price

					}
				});
    },
    conversion(){
 this.$api
        .post(global.apiUrls.get_sphs, { goodsdb_id: this.goodsdb_id,goods_name:this.goods_name})
        .then((result) => {
          result = result.data;
          if (result.code == 0) {
            this.backSuccessShow =false 
               this.$message.info(result.msg);
               this.pageNum =1
               this.goodsList =[]
               this.getData()
          } else {
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          this.$message.info("服务器错误");
        });
    },
    goConversion(item){
      this.goodsdb_id =item.goods_detail_key
      this.goods_name =item.goods_name
      this.info =item
      this.backSuccessShow =true
      // hs_price
      this.$api
        .get(global.apiUrls.get_price_info, { goods_id: item.goods_detail_key})
        .then((result) => {
          result = result.data;
          if (result.code == 0) {
            this.hs_price = result.price;
          } else {
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          this.$message.info("服务器错误");
        });
    },
    getData() {
      this.$api
        .get(global.apiUrls.get_user_cyjl, { zj: 1, pageNum: this.pageNum })
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
.btn {
  padding: 2rpx 10rpx;
  background: rgb(243, 181, 12);
  border-radius: 10rpx;
  color: #fff;
}
.btn1 {
  background: rgb(243, 181, 12);
}
.btn2 {
  background: #bbb8b8;
  margin-top: 5rpx;
  display: inline-block;
}
// 规则弹窗
.back-success-wrap {
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 111111;
    background: rgba(0, 0, 0, 0.3);
  }

  .back-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 111112;
    width: 580rpx;
    background: #fff;
    height: 524rpx;
    border-radius: 20rpx;
    .back-content-info {
      text-indent: 2em;
      border-radius: 25rpx;
      width: 500rpx;
      padding: 56rpx 30rpx;
      .text {
        font-size: 150rpx;
      }
    }
  }
}
.btn-dh{
  background: #f3b50c;
  padding: 6rpx 20rpx;
  color: #fff;
  border-radius: 10rpx;
}
</style>