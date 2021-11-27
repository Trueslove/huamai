<template>
    <view>
        
        <view class="bg">
            <image src='../static/WechatIMG21.jpeg' />
            <view class="money-wrap text-333">
                <view class="money">{{info.wallet}}</view>
                <view class="money-text">钱包（元）</view>
            </view>
        </view>
        <view class="flex justify-around cz">
             <view class="flex flex-direction justify-center align-center" @click="handleJump"
            data-url="/pages/user/check-balance/index">
                 <view class="cuIcon-recharge cuIcon-icon"></view>
            转到余额
        </view>
         <view class="flex flex-direction justify-center align-center" @click="handleJump"
            data-url="/pages/user/check-card/index">
              <view class="cuIcon-vipcard cuIcon-icon"></view>
            提现
        </view>
        </view>
        <view class="cu-list menu">
        <view class="cu-item" @click="handleJump"
            data-url="/pages/user/dh-log/index" >
        <view class="content flex justify-between align-center">
          <text class="title text-lg text-333">兑换明细</text>
          <view class="flex align-center">
            <text class="cuIcon-right"></text>
          </view>
        </view>
      </view>
      <view class="cu-item" @click="handleJump"
            data-url="/pages/user/tx-log/index">
        <view class="content flex justify-between align-center">
          <text class="title text-lg text-333">提现记录</text>
          <view class="flex align-center">
            <text class="cuIcon-right"></text>
          </view>
        </view>
      </view>
    <view class="cu-item" @click="handleJump"
            data-url="/pages/user/zryy-log/index">
        <view class="content flex justify-between align-center">
          <text class="title text-lg text-333">转入余额记录</text>
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
            info: {},
        }
    },
    mounted() {
          this.getData();
    },
    methods: {
          getData() {
      this.$api
        .get(global.apiUrls.get_user_info, {})
        .then((result) => {
          result = result.data;
          console.log("后台返回登录信息", result);
           result.data[0].wallet = result.data[0].wallet.toFixed(2)
          this.info = result.data[0];
          if (result.code == 0) {
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
}
</script>
<style lang="scss" scoped>
    .bg{
        width: 100%;
        height: 300rpx;
        position: relative;
        image{
            width: 100%;
            height: 100%;
        }
    }
    .money-wrap{
        position: absolute;
        bottom: 50rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        .money{
            font-size: 84rpx;
        }
        .money-text{
            font-size: 32rpx;
        }
    }
    .cz{
        margin: 30rpx 0;
        .cuIcon-icon{
            font-size: 64rpx;
        }
    }
</style>