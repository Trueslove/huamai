<template>
  <view>
    <mo-custom isBack="true" :isBottom="true" bgColor="bg-white">
      <view slot="content">佣金明细</view>
    </mo-custom>
    <view class="info_list_wrap">
      <view class="info_list"  v-for="(item,index) in lists" :key="index">
      <view class="info_box">
        <view class="info_pa" >获得佣金</view>
        <text class="info_pb">{{item.add_time | formatDate}}</text>
      </view>
      <!-- <text class="info_pc" :class="item.t==1?'modes':'jianfu'">{{item.money}}元</text> -->
      <text class="info_pc add" >{{item.fenhong}}元</text>
    </view>
 
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
    getData() {
      this.$api
        .get(global.apiUrls.get_yongjin, { pageNum:this.pageNum,pageSize:10,tally_class:'all'})
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