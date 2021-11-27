<template>
  <view>
    <mo-custom bgColor="bg-white" :isBack="true">
      <block slot="content">提现</block>
    </mo-custom>
    <!-- 输入提现金额 start -->
    <view class="tx_cont margin-top-sm padding">
      <text class="text-333 text-lg text-bold">输入提现金额</text>
      <view
        class="tx_box padding-tb solid-bottom flex align-center justify-between"
      >
        <view class="flex-sub flex align-center">
          <text class="f56 text-333">¥</text>
          <input
            class="margin-left-sm"
            type="number"
            placeholder="请输入提现金额"
            v-model="change_money"
            placeholder-style="font-size: 32rpx; color: #999999;"
          />
        </view>
        <view class="withAll" @click="total_tx">全部</view>
      </view>
    </view>
    <!-- 输入提现金额 end -->
    <view class="tx_cont margin-top-sm padding">
      <view class="flex justify-between">
        <text class="text-333 text-lg text-bold">收款信息</text>
        <text class="skr" @click="selectClickPop()">收款人</text>
      </view>
      <view class="margin-top cu-list menu">
        <view class="cu-item">
          <view class="content flex  align-center">
            <text class="title text-lg">收款姓名</text>
            <view class="flex align-center margin-left">
              <input
                type="text"
                 v-model="form.card_name"
                class="input text-666 text-lg"
                placeholder="请输入收款姓名"
              />
            </view>
          </view>
        </view>
          <view class="cu-item">
          <view class="content flex  align-center">
            <text class="title text-lg">收款卡号</text>
            <view class="flex align-center margin-left">
              <input
                type="text"
                v-model="form.card_no"
                class="input text-666 text-lg"
                placeholder="请输入收款卡号"
              />
            </view>
          </view>
        </view>
          <view class="cu-item">
          <view class="content flex  align-center">
            <text class="title text-lg">收款银行</text>
            <view class="flex align-center margin-left">
              <input
                type="text"
                v-model="form.card_bank"
                class="input text-666 text-lg"
                placeholder="请输入收款银行"
              />
            </view>
          </view>
        </view>
          <view class="cu-item">
          <view class="content margin-top-sm">
            <text class="title text-lg ">备注</text>
            <view class="flex align-center margin-left margin-top-sm" 
              style="border:1rpx solid #f1f1f1;padding:20rpx"
             >
              <textarea
                class="input text-666 text-lg"
                v-model="form.beizhu"
                placeholder="请输入备注(选填)"
              />
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 立即体现按钮 -->
    <view class="tx_btn" @click="handleSubmit">确定</view>
    <!-- 断网检测 -->
    <!-- 弹窗  -->
  <view class="back-success-wrap" v-if="backSuccessShow">
        <view class="mask" @click="backSuccessShow = false">
        </view>
        <view class="back-content flex  justify-between ">
        <view class="flex justify-between padding" style="width:100%;height:140rpx;background:#f1f1f1;margin:20rpx;border-radius:20rpx" v-if='info'>
            <view class="" >
                <view>{{info.card_bank}}</view>
                <view class="text-sm">{{info.card_name}} {{info.card_no}}</view>
            </view>
            <view class="mask-btn" @click="select()">选择</view>
        </view>
        <view class="text-center padding" style="margin 0 auto" v-else>没有最近提现记录</view>
        </view>
 <view class="round close-btn flex align-center justify-center" @click="backSuccessShow = false" style="background:#fff;color:#fff;position: relative;z-index: 11111111;left:50%;margin-left:-27rpx"><text class="cuIcon-close text-lg" style="color: #838383;margin-top:4rpx;"></text></view>

      </view>
    <mo-notwork></mo-notwork>
  </view>
</template>

<script>
export default {
  data() {
    return {
        backSuccessShow:false,
      CustomBar: this.CustomBar,
      moeny: "", // {String} 账户余额
      change_money: "", // {String} 用户输入的提现金额
      form:{
          beizhu:'',
          card_name:'',
          card_no:'',
          card_bank:'',
      }
    };
  },

  onLoad(options) {
    this.getData();
    this.getInfo()
  },

  methods: {
      select(){
          this.backSuccessShow =false ;
             this.form.card_name = this.info.card_name
             this.form.card_no = this.info.card_no
             this.form.card_bank = this.info.card_bank
      },
      getInfo(){
  this.$api
        .post(global.apiUrls.get_card, {})
        .then((result) => {
          result = result.data;
          console.log("后台返回登录信息", result);
          if (result.code == 0) {
              this.info= result.data
          } else {
              this.info =null ;
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          console.log("ERROR", err);
          this.$message.info("服务器错误");
        });
      },
       closePop() {
      this.backSuccessShow = false;
    },
    selectClickPop() {
        this.backSuccessShow = true;
    },
    getData() {
      this.$api
        .get(global.apiUrls.get_user_info, {})
        .then((result) => {
          result = result.data;
          console.log("后台返回登录信息", result);
          this.moeny = result.data[0].wallet;
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
        this.$message.info("没有可提现的金额");
      } else {
        this.change_money = this.moeny;
      }
    },

    handleSubmit() {
      if (!this.change_money) {
        this.$message.info("请输入提现金额");
        return false;
      }

      if (Number(this.change_money) > Number(this.moeny)) {
        this.$message.info("可提现余额不足");
        return false;
      }
      if(!this.form.card_no){
        this.$message.info("请输入收款账户");
        return false;
      }
       if(!this.form.card_name){
        this.$message.info("请输入收款人姓名");
        return false;
      }
       if(!this.form.card_bank){
        this.$message.info("请输入收款银行");
        return false;
      }
      console.log()
      //   post_jbcz
      this.$api
        .post(global.apiUrls.get_usertx, { wallet: Number(this.change_money) ,...this.form})
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
  },
};
</script>

<style lang="scss">
.uni-input-placeholder {
  color: #999;
}
.text-title {
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
    content: "\E655";
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
.skr {
  padding: 2rpx 10rpx;
  display: inline-block;
  background: #fa2033;
  color: #fff;
  font-size: 24rpx;
  border-radius: 20rpx;
}
.cu-item {
  border-bottom: 1rpx solid #f1f1f1;
}
.mask-btn{
      background: #fa2033;
      border-radius: 10rpx;
      height: 50rpx;
      padding: 4rpx 10rpx;
      color: #fff;
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
      width: 540rpx;
    background: #fff;
      height: 424rpx;
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
</style>
