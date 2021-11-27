<template>
  <view>
    <view class="bg">
      <view class="money-wrap">
        <view class="money-text">佣金</view>
        <view class="money">{{ info.wallet }}元</view>
      </view>
      <view class="flex justify-around align-center cz">
        <view class="flex flex-direction justify-center align-center">
          累计收入
          <view>142.00元</view>
        </view>
        <view style="width: 1rpx; height: 40rpx; background: #fff"></view>
        <view class="flex flex-direction justify-center align-center">
          充值/提现
          <view>0.00元</view>
        </view>
      </view>
    </view>
    <view class="share-btn" @click="copy(agency_url)">点这里分享链接好友购买可获得3%佣金</view>
    <view class="cu-list menu">
      <view class="cu-item">
        <view
          class="content flex justify-between align-center"
          @click="handleJump"
          data-url="/pages/user/invite-friends/index"
        >
          <text class="title text-lg text-333">邀请好友列表</text>
          <view class="flex align-center">
            <text class="cuIcon-right"></text>
          </view>
        </view>
      </view>
      <view class="cu-item">
        <view class="content flex justify-between align-center">
          <text class="title text-lg text-333">转换余额</text>
          <view class="flex align-center">
            <text class="cuIcon-right"></text>
          </view>
        </view>
      </view>
      <view class="cu-item">
        <view class="content flex justify-between align-center">
          <text class="title text-lg text-333">佣金提现</text>
          <view class="flex align-center">
            <text class="cuIcon-right"></text>
          </view>
        </view>
      </view>
      <view class="cu-item">
        <view
          class="content flex justify-between align-center"
          @click="handleJump"
          data-url="/pages/user/commission-log/index"
        >
          <text class="title text-lg text-333">佣金明细</text>
          <view class="flex align-center">
            <text class="cuIcon-right"></text>
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
      agency_url:'',
      info: {},
    };
  },
  mounted() {
    this.getData();
    this.getInit();
  },
  methods: {
      copy(data) {
      let url = data;
      let oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      console.log(oInput.value);
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message.info("分享链接已复制成功");
      oInput.remove();
    },
    getInit() {
      this.$api
        .get(global.apiUrls.get_yongjin, { tally_class: "sum" })
        .then((result) => {
          console.log(111);
          this.isShowLoading = false;
          this.isInit = true;
          result = result.data;
          if (result.code == 0) {
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
    getData() {
      this.$api
        .get(global.apiUrls.get_user_info, {})
        .then((result) => {
          result = result.data;
          console.log("后台返回登录信息", result);
          this.info = result.data[0];
          if (result.code == 0) {
            this.agency_url = result.agency_url
          } else {
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          console.log("ERROR", err);
          this.$message.info("服务器错误");
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.bg {
  width: 100%;
  height: 360rpx;
  background: rgb(254, 75, 97);
  color: #fff;
  overflow: hidden;
}
.money-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 30rpx;
  .money {
    font-size: 84rpx;
  }
  .money-text {
    font-size: 32rpx;
  }
}
.cz {
  margin: 30rpx 0;
  .cuIcon-icon {
    font-size: 64rpx;
  }
}
.share-btn {
  height: 88rpx;
  width: 580rpx;
  background: rgba(254, 75, 97, 0.2);
  border-radius: 50rpx;
  color: #fe4b61;
  margin: 30rpx auto;
  line-height: 88rpx;
  text-align: center;
}
</style>