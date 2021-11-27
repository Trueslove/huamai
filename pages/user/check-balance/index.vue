<template>
  <view>
    <mo-custom bgColor="bg-white" :isBack="true">
      <block slot="content">转到余额</block>
    </mo-custom>
    <!-- 输入提现金额 start -->
    <view class="tx_cont margin-top-sm padding" :style="[{ top: CustomBar + 'px' }]">
      <text class="text-333 text-lg text-bold">输入转换金额</text>
      <view class="tx_box padding-tb solid-bottom flex align-center justify-between">
        <view class="flex-sub flex align-center">
          <text class="f56 text-333">¥</text>
          <input class="margin-left-sm" type="number" placeholder="请输入转换金额" v-model="change_money" placeholder-style="font-size: 32rpx; color: #999999;" />
        </view>
        <view class="withAll" @click="total_tx">全部</view>
      </view>
      <view class="tx_yue margin-top-sm">
        注：转换比例1:1
      </view>
    </view>
    <!-- 输入提现金额 end -->


    <!-- 立即体现按钮 -->
    <view class="tx_btn" @click="handleSubmit">确定</view>
    <!-- 输入支付密码 -->
    <!-- 断网检测 -->
    <mo-notwork></mo-notwork>
  </view>
</template>

<script>
export default {
  data() {
    return {
      CustomBar: this.CustomBar,
      moeny: '', // {String} 账户余额
      change_money: '', // {String} 用户输入的提现金额
    };
  },
  
  onLoad(options) {
     this.getData();
  },

  methods: {
       getData() {
      this.$api
        .get(global.apiUrls.get_user_info, {})
        .then((result) => {
          result = result.data;
          console.log("后台返回登录信息", result);
           this.moeny = result.data[0].wallet
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
    /**
     * @event
     * @description 全部提现
     */
    total_tx() {
      if (parseFloat(this.moeny) <= 0) {
        this.$message.info('没有可提现的金额');
      } else {
        this.change_money = this.moeny;
      }
    },
    
     handleSubmit() {
       if (!this.change_money) {
        this.$message.info('请输入转换金额');
        return false;
      }
     
      if (Number(this.change_money) > Number(this.moeny)) {
        this.$message.info('可转换余额不足');
        return false;
      }
    //   post_jbcz
    this.$api
        .post(global.apiUrls.post_jbcz, {mn:Number(this.change_money)})
        .then((result) => {
          result = result.data;
          console.log("后台返回登录信息", result);
          if (result.code == 0) {
               this.$message.info(result.msg);
          } else {
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          console.log("ERROR", err);
          this.$message.info("服务器错误");
        });
    },
  }
};
</script>

<style lang="scss">
.uni-input-placeholder {
  color: #999;
}
.text-title{
  font-size: 36rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
}
// 体现按钮 start
.tx_btn {
  width: calc(100% - 60upx);
  height: 88upx;
  background: $bgtheme;
  border-radius: 44upx;
  font-size: 32upx;
  color: white;
  line-height: 88upx;
  text-align: center;
  position: fixed;
  bottom: 60upx;
  left: 30upx;
}

// 提现按钮 end

// 选择提现方式 start
.tx_main {
  width: 100%;
  height: auto;
  overflow: hidden;
  background: white;
  margin-top: 20upx;

  .tx_choose {
    font-size: 32rpx;
  }

  .ali-img {
    width: 52rpx;
    height: 52rpx;
  }

  .check-img {
    width: 36rpx;
    height: 36rpx;
  }

  .payMain {
    margin: 16px 0;
    display: flex;
    justify-content: space-between;
  }

  .tx_mainBox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46%;
    height: auto;
    overflow: hidden;
    border-radius: 10rpx;
    border: 1px solid #999;

    .tx_name {
      display: block;
      line-height: 100upx;
      font-size: 30upx;
      color: #333;
      text-align: center;
    }

    &.act {
      border: 1px solid $theme;
    }

    image {
      width: 50upx;
      height: 50upx;
      margin-right: 20upx;
    }
  }

  .act .icon-yuanquan:before {
    content: '\E655';
    color: $theme;
  }
}

.tx_final {
  width: 100%;
  height: auto;
  overflow: hidden;
  padding: 0 30upx;

  text {
    display: block;
    margin-top: 24upx;
    font-size: 24upx;
    color: #999999;

    text {
      color: $theme;
      display: inline-block;
      margin-left: 6upx;
    }
  }
}

// 选择提现方式 end

// 输入体现金额 start
.tx_cont {
  width: 100%;
  height: auto;
  overflow: hidden;
  background: white;

  .tx_box {
    width: 100%;
    height: auto;
    overflow: hidden;
    position: relative;

    .f56 {
      font-size: 56rpx;
      font-weight: Regular;
    }

    .withAll {
      font-size: 32rpx;
      color: #ff6464;
      font-weight: Medium;
    }

    input {
      display: block;
      width: auto;
      height: 70upx;
      font-size: 50upx;
      line-height: 70upx;
    }
  }

  .tx_yue {
    font-size: 24upx;
    color: #999999;

    .tips {
      font-size: 26rpx;
    }
  }
}

// 输入体现金额 end
// 规则弹窗 start
.pop-content {
  width: 540rpx;
  height: 472rpx;
  border-radius: 24rpx;
  background: #ffffff;
}

.close-btn {
  width: 54rpx;
  height: 54rpx;
  background-color: rgba(255, 255, 255, 0.6);
}

// 规则弹窗 end
</style>
