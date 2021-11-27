<template>
  <view class="">
    <mo-custom bgColor="bg-white" :isBack="true" :isBottom="true">
      <block slot="content">充值</block>
    </mo-custom>
    <!-- 选择金额 start -->
    <view class="cz_cont">
      <text class="tx_money">充值金额</text>
      <view class="item_main">
        <view
          class="list"
          :class="act_type == index ? 'act' : ''"
          @click="get_money(item, index)"
          :data-index="index"
          v-for="(item, index) in moneyData"
          :key="index"
        >
          <text class="add_money">{{ item.add_money }}金币</text>
        </view>
      </view>
    </view>
    <!-- 选择金额 end -->

    <!-- 充值信息 start -->
    <view class="tx_cont">
      <text class="tx_money">自定输入金额 </text>
      <view class="tx_box">
        <text>¥</text>
        <input
          type="number"
          value=""
          placeholder-class="placeholderClass"
          @input="handleChange"
          placeholder="0.00"
          v-model="change_money"
        />
      </view>
    </view>
    <!-- 充值信息 end -->

    <!-- 充值方式 start -->
    <view>
      <view class="model_content">
        <view class="pay">选择支付方式</view>
      </view>
      <view class="cu-list menu">
        <radio-group class="block" @change="RadioChange">
          <view class="cu-item cu-form-group" @click="handleSelect(2)">
            <view class="title wxpay">微信</view>
            <view
              class="content"
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <image
                class="image"
                v-if="acc_type == '2'"
                src="../static/checked.png"
                mode="aspectFill"
              ></image>
              <image
                class="image"
                v-else
                src="../static/unchecked.png"
                mode="aspectFill"
              ></image>
              <!-- <radio color="#FF5737" :class="acc_type == '1' ? 'checked' : ''" :checked="acc_type == '1' ? true : false" value="1"></radio> -->
            </view>
          </view>
          <view class="cu-item cu-form-group" @click="handleSelect(1)">
            <view class="title alipay"> 支付宝</view>
            <view
              class="content"
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <image
                class="image"
                v-if="acc_type == '1'"
                src="../static/checked.png"
                mode="aspectFill"
              ></image>
              <image
                class="image"
                v-else
                src="../static/unchecked.png"
                mode="aspectFill"
              ></image>
              <!-- <radio color="#FF5737" :class="acc_type == '2' ? 'checked' : ''" :checked="acc_type == '2' ? true : false" value="2"></radio> -->
            </view>
          </view>
        </radio-group>
      </view>
    </view>
    <!-- 充值方式 end -->
    <view class="back-success-wrap" v-if="backSuccessShow">
      <view class="mask" @click="backSuccessShow = false"> </view>
      <view class="back-content">
        <view v-if="url">
          <view class="text-center margin-tb">
            请保存后，使用{{ acc_type == 1 ? "支付宝" : "微信" }}扫一扫付款</view
          >
          <!-- <ayQrcode ref="qrcode4" qrcode_id="qrcode4" :modal="modal_qr" :url="url" @hideQrcode="hideQrcode" :height="300" :width="300"
			 themeColor="#ddd890" 
			 :is_themeImg="true"
			  themeImg="https://cdn.pixabay.com/photo/2016/11/29/13/24/balloons-1869816__340.jpg"
			  :h_w_img="40" 
			  /> -->
          <view
            class="flex justify-center align-center"
            style="width:180rpx:height:180rpx"
            @click="payFn"
          >
            <ayQrcode
              ref="qrcode4"
              qrcode_id="qrcode4"
              :modal="modal_qr"
              :url="url"
              @hideQrcode="hideQrcode"
              :height="300"
              :width="300"
              themeColor="#ddd890"
              :h_w_img="40"
            />
          </view>
        </view>

        <view class="text-center" v-else>二维码加载中</view>
      </view>
    </view>
    <!-- 立即充值按钮 -->
    <view class="tx_btn" @click="payFn"> 充值 </view>
    <!-- 断网检测 -->
    <mo-notwork></mo-notwork>
  </view>
</template>

<script>
import ayQrcode from "../components/ay-qrcode/ay-qrcode.vue";
/**
 * @author
 */
export default {
  components: {
    ayQrcode,
  },
  data() {
    return {
      backSuccessShow: false,
      change_money: "", // {String} 充值金额
      acc_type: 2, // {Number} 充值方式 1:支付宝；2：微信；
      act_type: -1, // {Number} 选择充值的金额
      wxChannel: "", // {String} 获取微信服务供应商
      aliChannel: "", // {String} 获取阿里服务供应商
      moneyData: [
        { add_money: 52 },
        { add_money: 101 },
        { add_money: 198 },
        { add_money: 501 },
        { add_money: 999 },
      ], // {Array.<Object>} 选择充值那些金额
      showPopup: false, // {Boolean} 弹窗是否显示
      is_show: true, // {Boolean}
      product_id: 0, // {Number} 选择充值金额的产品id，0：自定义；
      money: "", // {String} 充值金额
      url: "",
      //二维码相关参数
      modal_qr: false,
    };
  },
  /**
   * @function
   * @description 获取系统信息，获取包支持的服务商信息
   */
  onLoad(options) {
    // that.showQrcode();//一加载生成二维码
  },
  onNavigationBarButtonTap(e) {
    this.showPopup = true;
  },
  methods: {
    // 展示二维码
    showQrcode() {
      let _this = this;
      this.modal_qr = true;
      // uni.showLoading()
      setTimeout(function () {
        // uni.hideLoading()
        _this.$refs.qrcode4.crtQrCode();
      }, 100);
    },
    //传入组件的方法
    hideQrcode() {
      this.modal_qr = false;
    },
    handleSelect(value) {
      this.acc_type = value;
    },
    /**
     * @event 手动输入
     * @description 手动输入充值金额
     */
    handleChange() {
      this.act_type = -1;
      this.product_id = 0;
      console.log(this.change_money);
    },
    /**
     * @description
     */
    confirm: async function () {
      let _self = this;
      if (_self.checked) {
        //下单
        if (_self.payType == "wxpay") {
          _self.requestPayment("wxpay", _self.order_sn);
          uni.showLoading({
            title: "请稍等，正在发起支付",
          });
        } else if (_self.payType == "alipay") {
          _self.requestPayment("alipay", _self.order_sn);
          uni.showLoading({
            title: "请稍等，正在发起支付",
          });
        }
      }
    },
    /**
     * @function
     * @description 支付成功
     * @param {Object} sn - 支付成功
     */
    paySuccess(sn) {
      this.$message.success("支付成功");
      setTimeout(() => {
        uni.navigateBack({
          delta: 1,
        });
      }, 800);
    },
    /**
     * @event
     * @description 点击选择充值金额
     * @param {Obejct} item - 点击的哪一项的详细信息
     * @param {Number} index - 点击的哪一项的序号
     */
    get_money(item, index) {
      this.act_type = index;
      this.change_money = item.add_money;
      this.money = item.add_money;
      this.product_id = item.id || 0;
    },
    /**
     * @event
     * @description 切换充值方式
     */
    RadioChange(e) {
      this.acc_type = e.detail.value;
    },
    // get_type(e) {
    //   this.acc_type = e.currentTarget.dataset.index;
    // },
    /**
     * @event
     * @description 点击立即充值按钮
     * @property {Obejct} arr - 请求接口携带的参数
     * @property {Number} arr.order_type - 【订单类型。类型：int(11) unsigned】1 ：'现金充值'，2：'虚拟币充值'，3 ：'商城交易'
     * @property {String} arr.pay_type - 【支付渠道。类型：varchar(256)】wxpay:微信，alipay:支付宝，appleiap:苹果内购
     * @property {String} arr.payable_money - 【应付金额。类型：decimal(10,2)】选填，也可以服务器计算
     * @property {String} arr.order_info - 【商品订单等订单的附加信息。类型：字符串object】
     * @property {String} arr.coupon_id - 【我使用的优惠券id。类型：int(10) unsigned】
     */
    payFn() {
      console.log(this.change_money);
      let { acc_type, change_money, money } = this;
      if (this.product_id == 0) {
        if (!change_money) return this.$message.info("请输入充值金额");
        if (change_money < 1)
          return this.$message.info("输入金额不能小于1金币");
      }
      let data = {
        way: acc_type == 1 ? "zfb" : "wx",
      };

      // product_id 为0 自定义商品金额
      if (data.product_id != 0) {
        data.orderAmount = money;
      } else {
        data.orderAmount = change_money;
      }
      console.log(data);
      this.$api
        .post(global.apiUrls.post_yuecz, data)
        .then((res) => {
          console.log(res);
          if (res.data.code == 0) {
            this.backSuccessShow = true;
            this.url = res.data.data[0];
            this.showQrcode(); //一加载生成二维码
          } else {
            this.$message.info(res.data.msg);
          }
        })
        .catch((e) => {
          console.log(e);
          this.$message.info("网络繁忙,请稍后重试");
        });
    },
  },
};
</script>

<style lang="scss">
.money {
  font-size: 24rpx;
  color: #999;
}
// input placeholder 样式 start
.placeholderClass {
  font-size: 32rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: #bfbfbf;
}

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

// 选择金额 start
.cz_cont {
  width: 100%;
  height: auto;
  overflow: hidden;
  background: white;

  .item_main {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 32rpx;
    margin-top: 24rpx;
    width: 100%;
    align-content: space-around;

    .list {
      width: 32%;
      flex: none;
      text-align: center;
      height: 120rpx;
      border: 1rpx solid #cbcbcb;
      border-radius: 8rpx;
      margin-bottom: 36rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-right: 2%;
      font-size: 32rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #1a1a1a;
    }

    .act {
      border: 2rpx solid #ff6464;
      border-radius: 8rpx;
      font-size: 32rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ff6464 !important;
      position: relative;
      .money {
        font-size: 24rpx;
        color: #999;
      }
      &::after {
        width: 34rpx;
        height: 34rpx;
        background: url("../static/g.png");
        background-size: 100% 100%;
        content: " ";
        position: absolute;
        top: 0;
        right: 0;
      }
    }

    .list:nth-child(3n) {
      margin-right: 0;
    }
  }
}
// 选择金额 end

.tx_money {
  font-size: 32upx;
  display: block;
  margin-top: 30upx;
  padding: 0 30upx;
}

// 充值方式 start
.tx_main {
  width: 100%;
  height: auto;
  overflow: hidden;
  padding: 0 30upx 30upx 30upx;
  background: white;
  border-top: 10px solid #f2f2f2;

  .payMain {
    display: flex;
    justify-content: space-between;
  }

  .tx_choose {
    font-size: 30upx;
    color: #333;
    line-height: 90upx;
    display: block;
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

    image {
      width: 50upx;
      height: 50upx;
      margin-right: 20upx;
    }
  }
}
// 充值方式 end

// 充值信息 start
.tx_cont {
  width: 100%;
  height: auto;
  overflow: hidden;
  background: white;
  margin-top: 10rpx;

  .all_out {
    &:after {
      border: none;
    }

    display: inline-block;
    background: none;
    font-size: 24upx;
  }

  .tx_box {
    width: 100%;
    height: auto;
    overflow: hidden;
    padding: 0 30upx 20upx 30upx;
    margin-top: 20upx;
    position: relative;

    &:before {
      content: "";
      position: absolute;
      height: 1px;
      background: #eeeeee;
      left: 30upx;
      right: 0;
      bottom: 0;
      transform: scaleY(0.5);
    }

    text {
      display: block;
      font-size: 40upx;
      color: #333;
      font-weight: bold;
      float: left;
      line-height: 70upx;
    }

    input {
      display: block;
      width: auto;
      height: 70upx;
      font-size: 32upx;
      line-height: 70upx;
      padding: 0 30upx;
    }
  }
}
// 充值信息 end

.mo-flex-center {
  background: $uni-text-color-inverse;
}

.model_content {
  height: auto;
  padding: 0 30upx;
  // margin-top: 20upx;
  background: #ffffff;
}
.pay {
  font-size: 32upx;
  height: 80upx;
  line-height: 80upx;
}
.cu-list.menu > .cu-item {
  padding: 0 !important;
}

.cu-list.menu > .cu-item.arrow:before {
  display: none !important;
}
.wxpay {
  background: url(../static/weixin.png);
  padding-left: 80upx;
  background-size: contain;
  background-repeat: no-repeat;
}

.alipay {
  background: url(../static/zfb.png);
  padding-left: 80upx;
  background-size: contain;
  background-repeat: no-repeat;
}
.image {
  height: 40rpx;
  width: 40rpx;
}
.cu-form-group + .cu-form-group {
  border-top: none;
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
</style>
