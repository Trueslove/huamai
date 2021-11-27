<template>
  <view>
    <mo-custom isBack="true" :isBottom="true" bgColor="bg-white">
      <view slot="content">账户明细</view>
    </mo-custom>
    <view class="nav-list flex justify-around">
      <view class="nav-itm" :class="activeIndex == 1?'active':''" @click="changeNav(1)">消费明细</view>
      <view class="nav-itm" :class="activeIndex == 2?'active':''" @click="changeNav(2)">充值明细</view>
    </view>
    <view class="info_list_wrap">
      <block v-if='activeIndex == 1'>
      <view class="info_list"  v-for="(item,index) in lists" :key="index">
      <view class="info_box">
        <view class="info_pa" >商品消费</view>
        <text class="info_pb">{{item.add_time | formatDate}}</text>
      </view>
      <!-- <text class="info_pc" :class="item.t==1?'modes':'jianfu'">{{item.money}}元</text> -->
      <text class="info_pc jianfu" >-{{item.shop_money}}元</text>
    </view>
    </block>
      <block v-if='activeIndex == 2'>
      <view class="info_list"  v-for="(item,index) in lists" :key="index">
      <view class="info_box">
        <view class="info_pa" >{{item.way=='wx' ?'微信':'支付宝'}}充值</view>
        <text class="info_pb">{{item.add_time | formatDate}}</text>
      </view>
      <!-- <text class="info_pc" :class="item.t==1?'modes':'jianfu'">{{item.money}}元</text> -->
      <text class="info_pc add" >+{{item.money}}元</text>
    </view>
    </block>
    </view>
    <view>
      <mo-empty-ui v-if="lists.length == 0 && isInit"></mo-empty-ui>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      activeIndex:1,
      lists: [],
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
    if (this.lists.length < this.total) {
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
    changeNav(item){
      this.activeIndex =item
       this.pageNum =  1;
       this.lists =[]
      this.getData();
    },
    getData() {
      this.$api
        .get(global.apiUrls.get_user_zdmx, { pageNum:this.pageNum,pageSize:10,order_class:this.activeIndex})
        .then((result) => {
          console.log(111)
          this.isShowLoading = false;
           this.isInit = true;
          result = result.data;
          if (result.code == 0) {
            this.lists = this.lists.concat(result.data);
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
.info_list_wrap{
    margin-top: 88rpx;

}
  .info_list {
    width: 100%;
    height: auto;
    overflow: hidden;
    border-bottom: 1px #EEEEEE solid;
    padding: 30upx;

    .info_box {
      width: calc(100% - 300upx);
      height: auto;
      float: left;
      overflow: hidden;

      .info_pa {
        font-size: 30upx;
        color: #333;
        line-height: 45upx;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .info_pb {
        font-size: 24upx;
        color: #999999;
        display: block;
        margin-top: 16upx;
      }
    }

    .info_pc {
      font-size: 32upx;
      color: #333333;
      line-height: 88upx;
      display: block;
      float: right;
    }
  }
  .jianfu{
    color: rgb(224, 89, 26)!important;
  }
  .add{
    color: #333 !important;;
  }
  .nav-list{
    height: 88rpx;
    line-height: 88rpx;
    background: #fff;
    position: fixed;
    width: 100%;
    .nav-item{
      position: relative;
      width: 50%;
    }
    .active{
      color: rgb(224, 89, 26);
    }
    .active::after{
      content: ' ';
      position: absolute;
      width: 110rpx;
      height: 3rpx;
      background: rgb(224, 89, 26);
      bottom: 0;
      margin-left:-110rpx;
    }
  }
</style>