<template>
  <view class="warp" :style="[{ paddingTop: StatusBar + 'px' }]">
 <mo-custom bgColor="" :isBack="true">
      <block slot="content"><text class="top_title">注册</text></block>
    </mo-custom>
    <!-- 验证码login start -->
    <view class="form-wapper">
      <view class="block-box">
        <view class="title">
          用户名
          <!-- <image
                class="image"
                src="../static/yzm.png"
                mode="aspectFit"
            ></image> -->
        </view>
        <input   v-model="username" maxlength="11" placeholder-class="placeholderClass"
          placeholder="请输入用户名" name="input" />
      </view>
      <view class="block-box" style="margin-top: 56rpx">
        <view class="title">
          手机号
          <!-- <image
            class="image"
            src="../static/phone.png"
            mode="aspectFit"
          ></image> -->
        </view>
        <input type="number"  v-model="phone" maxlength="11" placeholder-class="placeholderClass"
          placeholder="请输入手机号" name="input" />
      </view>

      <view class="block-box" style="margin-top: 56rpx">
        <view class="title">
          验证码
          <!--  <image class="image" src="../static/yzm.png" mode="aspectFit"></image> -->
        </view>
        <input type="number" v-model="codes" placeholder-class="placeholderClass" placeholder="请输入验证码" name="input" />
        <!-- 	<text class="code"  @click="handleSendcodes">
					{{ beginning ? time + "s后重新获取" : "获取验证码" }}
				</text> -->

        <button class="code" :loading="codesBtnLoading" @click="handleSendcodes">
          {{ beginning ? time + "s后重新获取" : "获取验证码" }}
        </button>
      </view>
<view class="block-box margin_top_56" style="margin-top: 56rpx">
        <view class="title">
          邀请码
        </view>
        <input type="number"  v-model="agency_code" maxlength="30" placeholder-class="placeholderClass"
            placeholder="选填，邀请人的用户名" name="input" />
        </view>

      <view class="block-box margin_top_56" style="margin-top: 56rpx">
        <view class="title">
          密码
          <!-- <image class="image" src="../static/yzm.png" mode="aspectFit"></image> -->
        </view>
        <view class="pwd">
          <input placeholder-class="placeholderClass" v-if="type == 'password'" type="password" v-model="password"
            placeholder="请输入密码(6-12位)" minlength="6" maxlength="12" />
          <input placeholder-class="placeholderClass" v-if="type == 'text'" type="text" v-model="password"
            placeholder="请输入密码(6-12位)" minlength="6" maxlength="12" />
          <view class="pwd-right" :style="{ height: type == 'password' ? '15rpx' : '22rpx' }">
            <image src="../static/open.png" :data-type="type" @click.stop="is_kejian" v-if="type == 'text'"
              mode="aspectFill"></image>
            <image src="../static/close.png" class="close" :data-type="type" @click.stop="is_kejian"
              v-if="type == 'password'" mode="aspectFill"></image>
          </view>
        </view>
      </view>
      <view class="block-box margin_top_56" style="margin-top: 56rpx">
        <view class="title">
          确认密码
          <!-- <image class="image" src="../static/yzm.png" mode="aspectFit"></image> -->
        </view>
        <view class="pwd">
          <input placeholder-class="placeholderClass" v-if="type == 'password'" type="password" v-model="qpassword"
            placeholder="确认密码" minlength="6" maxlength="12" />
          <input placeholder-class="placeholderClass" v-if="type == 'text'" type="text" v-model="qpassword"
            placeholder="确认密码" minlength="6" maxlength="12" />
          <view class="pwd-right" :style="{ height: type == 'password' ? '15rpx' : '22rpx' }">
            <image src="../static/open.png" :data-type="type" @click.stop="is_kejian" v-if="type == 'text'"
              mode="aspectFill"></image>
            <image src="../static/close.png" class="close" :data-type="type" @click.stop="is_kejian"
              v-if="type == 'password'" mode="aspectFill"></image>
          </view>
        </view>
      </view>
      <view class="paw flex justify-between" style="padding: 0 56rpx">
        <!-- <view @click="forgetPassword" class="wj_mh">忘记密码</view> -->
        <view class=""> </view>
        <view @click="handleJump" data-type="REDIRECT"
          :data-url="PAGE_BASE_URL + 'login-password/index?phone=' + phone">
          去登录</view>
      </view>
    </view>

    <!-- 验证码login end -->

    <!-- 立即登录按钮 start -->
    <button type="warn" :loading="is_click" class="login-btn" shape="circle" @click="handleLogin">
      立即注册
    </button>
    <!-- 立即登录按钮 end -->

    <!-- 快捷登陆 start -->
    <!--    <view class="quick">
      <view class="quick-title"><text class="line"></text>
        <text class="txt">快捷登录</text><text class="line"></text></view>
      <view class="sanfang">
        <image @click="wxLogin" src="../static/login-quick-001.png" mode=""></image>
        <image @click="emailLogin" src="../static/login-email.png" mode=""></image>
      </view>
    </view> -->
    <!-- 快捷登陆 end -->
    <!-- 断网监测 start -->
    <mo-notwork></mo-notwork>
    <!-- 断网监测 end -->
  </view>
</template>
<script>
  // 引入验证方法
  import {
    validate
  } from "@/common/utils/index";
  export default {
    data() {
      return {
        StatusBar: this.StatusBar,
        is_select_agree: true,
        phone: "", // 手机号,@String
        codes: "", // 验证码,@String
        is_click: false, // 立即登录按钮是否点击,@Boolean
        codesBtnLoading: false, // 是否显示加载图标,@Boolean
        time: 60, // 倒计时60S,@Number
        beginning: false, // 显示倒计时,@Boolean
        PAGE_BASE_URL: "/pages/user/", // 页面基础路径,@String
        timer: null, // 计时器,@Function
        type: "password",
        password: "",
        qpassword: "",
        username: "",
        agency_code:'',
      };
    },
    onLoad(options) {
      let {
        phone,
        agency_url
      } = options;
      this.phone = phone || "";
      this.agency_code = agency_url || "";
    },
    onUnload() {
      // 页面关闭时清除计时器，优化性能
      clearInterval(this.timer);
    },
    methods: {
      //密码是否可见
      is_kejian(e) {
        let type = e.currentTarget.dataset.type;
        if (type == "password") {
          this.type = "text";
        } else {
          this.type = "password";
        }
      },
      /**
       * @event 跳转到忘记支付密码页面
       */
      forgetPassword() {
        this.$urouter.redirectTo(`${this.PAGE_BASE_URL}forget/index`);
      },
      /**
       * @param 是否选择同意协议
       */
      handle_select() {
        this.is_select_agree = !this.is_select_agree;
      },

      //密码是否可见
      is_kejian(e) {
        let type = e.currentTarget.dataset.type;
        if (type == "password") {
          this.type = "text";
        } else {
          this.type = "password";
        }
      },
      /**
       * @event 立即注册按钮点击事件
       */
      handleLogin() {
        // 保存this
        let _this = this;
        // #ifdef APP-PLUS
        // @desc 隐藏安全键盘
        plus.key.hideSoftKeybord();
        // #endif
        // 如果按钮状态是加载中，直接return，防止用户多次点击
        if (_this.is_click) return;
        // 结构出来phone手机号，codes验证码
        let {
          phone,
          codes,
          password,
          qpassword,
          username,
          agency_code
        } = this;
        // 如果用户名为空就提示用户
        if (!username) {
          _this.$message.info("请输入用户名");
          return false;
        }
        // 如果手机号为空就提示用户
        if (!phone) {
          _this.$message.info("请输入手机号");
          return false;
        }
        // 选择用户协议
        if (!this.is_select_agree) {
          this.$message.info("请勾选用户协议");
          return false;
        }
        // 如果手机号不正确就提示用户
        if (!validate(phone, "phone")) {
          _this.$message.info("请输入正确的手机号");
          return false;
        }
        // 如果验证码为空就提示用户
        if (!codes) {
          _this.$message.info("验证码不能为空");
          return false;
        }
        // 判断用户密码是否存在
        if (!password) {
          _this.$message.info("密码不能为空");
          return false;
        }
        // 密码不符合正则验证
        if (!validate(password, "password")) {
          this.$message.info("请输入字母加数字6-12位密码");
          return false;
        }
        // 判断用户密码是否一致
        if (password != qpassword) {
          _this.$message.info("两次密码不一致");
          return false;
        }

        // 上述验证都通过，将按钮的点击状态改为true
        _this.is_click = true;
        /**
         * @desc 请求验证码登录接口
         * @param {String} global.apiUrls.postUserMobileLogin - 请求的接口,v1/5c78dca45ebc1,
         * @param {Object} {} - 携带参数
         * @param {String} {}.mobile - 手机号
         * @param {String} {}.code - 验证码
         */
        _this.$api
          .post("/users/register/", {
            mobile: phone,
            codes: codes,
            password: password,
            username: username,
            agency_code:agency_code,
          })
          .then((res) => {
            if (res.data.code == 0) {
              uni.navigateBack()
              return false
            } else {
              // 错误的情况下向用户发送后台返回来的长度
              _this.$message.info(res.data.msg);
            }
            // 把按钮的状态改为false
            this.is_click = false;
          });
      },
      /**
       * @event 返回上一页
       */
      BackPage() {
        uni.navigateBack({
          delta: 1,
        });
      },
      /**
       * @event 发送验证码
       */
      handleSendcodes() {
        // 保存this
        let _this = this;
        // 从this里结构出来phone
        let {
          phone
        } = this;

        // 验证手机号strat
        if (!phone) {
          this.$message.info("请输入手机号");
          return false;
        }
        if (!validate(phone, "phone")) {
          this.$message.info("请正确输入手机号");
          return false;
        }
        // 验证手机号 end

        // 如果有倒计时，return false
        if (this.beginning) return false;

        this.codesBtnLoading = true; // 显示加载状态

        /**
         * @desc 请求验证码接口
         * @param {Object} {} - 参数
         * @param {Boolean} {}.is_test - 是否是测试环境
         * @param {String} {}.mobile - 手机号
         * @param {String} {}.type - 类型
         */

        // 改加载状态为false
        _this.codesBtnLoading = false;

        _this.beginning = true; // 显示倒计时
        // 清除倒计时,防抖作用
        clearInterval(_this.timer);
        _this.timer = setInterval(() => {
          if (_this.time == 1) {
            //倒计时结束就清楚这个倒计时
            clearInterval(_this.timer);
            _this.time = 60; // 倒计时60s
            _this.beginning = false; // 是否显示倒计时改为false
            return;
          }
          _this.time--;
        }, 1000);
        // 向用户发送提示
        _this.$api
          .post("/users/code/", {
            mobile: phone,
          })
          .then((res) => {
            this.$message.info("验证码发生成功，请注意查收");
          });
      },
      /**
       * @event 跳转到邮箱登录页面
       */
      emailLogin() {
        uni.redirectTo({
          url: "/pages/user/login/login-email-code/index",
        });
      },
      /**
       * @event 微信登陆
       */
      wxLogin() {
        let _this = this;
        // #ifdef APP-PLUS
        // 如果是app环境打开微信
        if (
          plus.runtime.isApplicationExist({
            pname: "com.tencent.mm",
            action: "weixin://",
          })
        ) {
          uni.getProvider({
            service: "oauth",
            success: function(res) {
              console.log(res);
              // 如果支持微信等，就执行 wx_login_fn 方法
              if (~res.provider.indexOf("weixin")) {
                _this.wx_login_fn();
              }
            },
            fail: function(err) {
              // api错误是打印错误
              console.log(err);
            },
          });
        } else {
          // 调起失败时提醒用户
          this.$message.info("请安装微信后再使用此功能");
        }
        // #endif
      },
      /**
       * @function 微信授权登录
       */
      wx_login_fn() {
        let _this = this;
        /**
         * @desc uniapp的登陆api
         * @param {String} provider - 登录服务提供商
         * @param {login~success} loginRes - 接口调用成功时的回调函数
         */
        uni.login({
          provider: "weixin",
          /**
           * @callback login~success
           * @param {Object} loginRes - api返回来的信息
           */
          success: function(loginRes) {
            /**
             * @desc 获取用户信息
             * @param {String} provider - 登录服务提供商
             * @param {Funtion} success - 接口调用成功时的回调函数
             */
            uni.getUserInfo({
              provider: "weixin",
              /**
               * @callback success
               * @param {Object} infoRes - api返回来的信息
               */
              success: function(infoRes) {
                // 显示加载状态
                uni.showLoading({
                  title: "加载中",
                });
                /**
                 * @let {String} nickName - 结构出来的变量昵称
                 * @let {String} avatarUrl - 解构出来的头像链接
                 * @let {String} gender - 结构出来的性别
                 */
                let {
                  nickName,
                  avatarUrl,
                  gender
                } = infoRes.userInfo;
                // #ifdef APP-PLUS
                let clientId = plus.push.getClientInfo().clientid || "";
                console.log("clientId", clientId);
                //  @const {Number} appSystem - 判断设备类型 1：ios；2：安卓；
                let appSystem = uni.getSystemInfoSync().platform == "ios" ? 1 : 2;
                // #endif
                console.log(infoRes.userInfo.unionId, "app微信登录");
                /**
                 * @description 第三方登录请求接口
                 */
                uni.hideLoading();
              },
            });
          },
          error: function(err) {
            uni.hideLoading();
            console.log(err);
          },
        });
      },
    },
  };
</script>
<style lang="scss">
  // 头部返回键 start
  .cu-bar .action {
    position: relative;
    z-index: 5;
  }

  .block-box {
    // margin: 0 26rpx;
    height: 88rpx;
    background: #FFFFFF;
    border-bottom: 1rpx solid #eee;
    // border-radius: 44rpx;
    display: flex;
    align-items: center;

    .title {
   margin-right: 26rpx;
   width: 120rpx!important;
   text-align: right;

      .image {
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0);
      }
    }

    .pwd {
      display: flex;
      justify-content: space-between;
      align-items: center;
flex: 1;
      .pwd-right {
        position: relative;
        right: 32rpx;
        width: 32rpx;

        .close {
          position: relative;
          top: -6rpx;
        }

        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  // 头部返回键 end
  // 主体 start
  .warp {
    background: #fff;
    min-height: 100vh;
    overflow: hidden;

    // background pic start
    .bg {
      height: 480rpx;
      width: 100%;

      .bg_img {
        height: 480rpx;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;
      }
    }

    .logo-contnt {
      width: 100%;
      height: 480rpx;
      overflow: hidden;

      .logo {
        margin-top: 100rpx;
        display: flex;
        justify-content: center;
        align-items: center;

        .image {
          width: 250rpx;
          height: 250rpx;
          // border-radius: 50%;
          // border: 3rpx solid #FFA133;
        }
      }

      .desc {
        width: 100%;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        margin-top: 0rpx;
        font-size: 40rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
      }
    }

    // background pic end

    // 验证码login start
    .margin_top_56 {
      margin-top: 56rpx;
    }

    .form-wapper {
      position: relative;
      // top: -12rpx;
      z-index: 99;

      .block-box {
        margin: 0 26rpx;
        height: 88rpx;
        background: #FFFFFF;
        // border: 1rpx solid #CCCCCC;
        // border-radius: 44rpx;
        display: flex;
        align-items: center;


        .title {
          .image {
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0);
          }
        }
      }

      // 发送验证码 start
      .code {
        min-width: 250rpx;
        text-align: right;
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #e64340;

        padding-right: 32rpx;
        background: none;

        &:after {
          border: none;
        }
      }

      // 发送验证码 end
      .paw {
        width: 140px;
        height: 40rpx;
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 200;
        line-height: 34rpx;
        color: #333333;
        width: 100%;
        text-align: right;
        padding-right: 64rpx;
        margin: 24rpx 64rpx 24rpx 0;
      }
    }

    // 验证码login end

    // 立即登录按钮 start
    .login-btn {
      position: relative;
      // top: -14rpx;
      height: 88rpx;
      // background: linear-gradient(90deg, #ffa133 0%, #ff5307 100%);
      background: #e64340;
      opacity: 1;
      border-radius: 44px;
      margin: 0 56rpx;
      font-size: 32rpx;
      font-family: PingFang SC;
      font-weight: 500;
      margin-bottom: 30rpx;
    }

    // 立即登录end

    .reg-paw {
      margin: 32rpx 56rpx;
      // text-align: center;

      text {
        font-family: PingFangSC-Regular;
        font-weight: Regular;
        font-size: 28rpx;
        display: inline-block;
        // min-width: 25%;
        position: relative;

        &:last-child {
          color: #ff7f00;
        }
      }

      // .wj_mh:before {
      //   position: absolute;
      //   height: 26rpx;
      //   width: 1px;
      //   background: #999;
      //   content: '';
      //   left: 0rpx;
      //   top: 8rpx;
      // }
    }

    // 快捷登录 start
    .quick {
      text-align: center;
      position: absolute;
      width: 100%;
      bottom: 39rpx;

      .quick-title {
        margin: 100rpx 0 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .txt {
          padding: 0 20rpx;
          font-size: 24rpx;
          font-family: PingFang-SC-Regular;
          color: #999999;
        }

        .line {
          display: block;
          width: 160rpx;
          position: relative;

          &:after {
            content: "";
            position: absolute;
            z-index: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            border-bottom: 1px solid #eeeeee;
            transform: scaleY(0.5);
            transform-origin: 0 0;
          }
        }
      }

      image {
        width: 81rpx;
        height: 81rpx;
        margin: 0 35rpx;
      }
    }

    // 快捷登录 end
  }

  .box-bottom {
    position: absolute;
    bottom: 60rpx;
    width: 100%;

    .agreement {
      display: flex;
      width: 100%;
      font-family: PingFangSC-Regular;
      font-size: 22rpx;
      color: #666666;
      align-items: center;
      justify-content: center;

      .image {
        height: 24rpx;
        width: 24rpx;
        margin-right: 12rpx;
      }

      text {
        color: #4177dd;
      }
    }
  }

  .placeholderClass {
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
  }

  // 主体 end
</style>
