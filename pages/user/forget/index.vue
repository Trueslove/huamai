<template>
  <view class="warp">
    <!-- header start -->
    <mo-custom bgColor="" :isBack="true">
      <block slot="content"><text class="top_title">忘记密码</text></block>
    </mo-custom>
    <!-- 忘记密码 start -->
    <view class="login-phone form-wapper">
      <view class="login-tit">账号</view>
      <view class="phone input-wapper">
        <view class="mobile rside"><input focus placeholder-class="input-placeholder" type="number" v-model="phone" placeholder="请输入手机号" maxlength="11"  /></view>
      </view>
      <view class="login-tit">验证码</view>
      <view class="code input-wapper ">
        <view class="rside flex align-center">
          <input placeholder-class="input-placeholder" type="number" maxlength="4" v-model="vercode" placeholder="请输入验证码" />
          <button class="yanZhengMa" :loading="verCodeBtnLoading" @tap="handleSendVerCode">{{ beginning ? time + 's后重新获取' : '获取验证码'}}</button>
        </view>
      </view>
      <view class="login-tit">密码</view>
      <view class="phone input-wapper">
        <view class="mobile rside flex justify-between" >
          <input
            style="width: 80%;"
            placeholder-style="color:#bfbfbf;"
            placeholder-class="input-placeholder"
            v-if="type == 'password'"
            type="password"
            v-model="password"
            placeholder="请输入字母加数字(6-12位)"
            minlength="6"
            maxlength="12"
          />
          <input
            style="width: 80%;"
            placeholder-style="color:#bfbfbf;"
            placeholder-class="input-placeholder"
            v-if="type == 'text'"
            type="text"
            v-model="password"
            placeholder="请输入字母加数字(6-12位)"
            minlength="6"
            maxlength="12"
          />
          <view class="pws">
            <!-- <text class="iconfont mo-iconfont" :data-type="type" @click.stop="is_kejian" v-if="type == 'text'">&#xe7e6;</text>
            <text class="iconfont mo-iconfont" :data-type="type" @click.stop="is_kejian" v-if="type == 'password'">&#xe7e9;</text> -->
            <image src="../static/open.png" :data-type="type" @click.stop="is_kejian" v-if="type == 'text'" mode="aspectFill"></image>
            <image src="../static/close.png" class="close" :data-type="type" @click.stop="is_kejian" v-if="type == 'password'"
              mode="aspectFill"></image>
          </view>
        </view>
      </view>
    </view>
    <!-- 忘记密码 end -->
    <!-- 立即登录 start -->
    <button type="warn" :loading="is_click" class="login-btn" @tap="reg" style="margin-top: 24upx;">重置密码</button>
    <!-- 立即登录 end -->
    <!-- 网络错误 start -->
    <mo-notwork></mo-notwork>
    <!-- 网络错误 end -->
  </view>
</template>
<script>
// 引入验证规则文件
import { validate } from '@/common/utils/index';
export default {
  data() {
    return {
      phone: '', //手机号
      vercode: '', //验证码
      password: '', //密码
      is_click: false, // 登录按钮加载动画
      verCodeBtnLoading: false, //发送验证码button按钮动画
      time: 60, //倒计时60S
      beginning: false, //显示倒计时
      is_used: false, // 手机号是否存在
      type: 'password', //密码类型
      is_agree: false, // 协议
      StatusBar: this.StatusBar, //标题栏高度
      CustomBar: this.CustomBar //标题栏状态栏的高度
    };
  },
  onLoad() {
    // if(this.$store.state.phone) this.phone = this.$store.state.phone;
  },
	
  methods: {

    /**
     * @description 密码是否可见
     * @param {Object} e 事件传参接收参数
     * @param {type} e type 事件定义参数 text 可见 password 不可见
     */
    is_kejian(e) {
      let type = e.currentTarget.dataset.type;
      if (type == 'password') {
        this.type = 'text';
      } else {
        this.type = 'password';
      }
    },
    /**
     * @description 返回上一页
     */
    BackPage() {
      uni.navigateBack({
        delta: 1
      });
    },
    /**
     * @description 登录
     */
    reg() {
      // 登录加载动画未完成不往下执行
      if (this.is_click) {
        return;
      }
      // 从data取值 phone手机号 vercode验证码 password密码
      let { phone, vercode, password } = this;
      // 手机号不存在
      if (!phone) {
        this.$message.info('请输入手机号');
        return false;
      }
      // 输入手机号错误
      if (!validate(phone, 'phone')) {
        this.$message.info('请输入正确的手机号');
        return false;
      }
      // 验证码不存在
      if (!vercode) {
        this.$message.info('请输入验证码');
        return false;
      }
      // 验证码错误
      if (!validate(password, 'password')) {
        this.$message.info('请输入字母加数字6-12位密码');
        return false;
      }
      // 加载动画完成
      this.is_click = true;
      // 调用重置密码接口
      this.$api
        .post(global.apiUrls.postForgetPassword, {
          password: password,
          mobile: phone,
          code: vercode
        })
        .then(res => {
          this.is_click = false;
          // 重置密码成功跳转密码登录页面进行登录
          if (res.data.code == 1 && res.data.data) {
            // 重置密码成功提示
            this.$message.info(res.data.msg);
            setTimeout(() => {
              // uni.redirectTo({
              //   url: '/pages/user/login/login-password/index'
              // });
             uni.navigateBack({
                delta: 1
             });
            }, 500);
          } else {
            // 重置密码失败提示
            this.$message.info(res.data.msg);
          }
        });
    },
    /**
     * @description 发送验证码
     */
    handleSendVerCode() {
      // 从data取值 phone手机号
      let { phone } = this;
      // 手机号不存在
      if (!phone) {
        this.$message.info('请输入手机号');
        return false;
      }
      // 输入手机号错误
      if (!validate(phone, 'phone')) {
        this.$message.info('请输入正确的手机号');
        return false;
      }
      // 倒计时正在进行时，不能再次点击
      if (this.beginning) return false;
      // 发送验证码button按钮动画
      this.verCodeBtnLoading = true;
      // 调用发送验证码接口
      this.$api
        .post(global.apiUrls.GetVerifyCode, {
          is_test: global.IS_DEV,
          mobile: phone,
          type: '2'
        })
        .then(res => {
          // 发送验证码button按钮动画
          this.verCodeBtnLoading = false;
          if (res.data.code == 1) {
            // 发送成功时，先清之前的定时器
            clearInterval(this.timer);
            // 重置倒计时是否可点击状态
            this.beginning = true;
            // this.$message.info('发送成功')
            // 发送验证码成功提示验证码为多少，方便开发使用，正式版注释掉
            this.$message.info('验证码为已发送成功，请注意查收');
            //显示倒计时
            //开始倒计时
            this.timer = setInterval(() => {
              if (this.time == 1) {
                //倒计时结束
                clearInterval(this.timer);
                // 重置倒计时时间
                this.time = 60;
                // 重置倒计时开始状态
                this.beginning = false;
                return;
              }
              this.time--;
            }, 1000);
          } else {
            // 接口调用失败提示
            this.$message.info(res.data.msg);
          }
        });
    }
  }
};
</script>
<style lang="scss">
// header start
.cu-bar {
  position: relative;
  z-index: 9;
}
// header end

// 整个页面配置 start
.warp {
  background: #fff;
  min-height: 100vh;
}
// 整个页面配置 end
.login-tit {
  margin-top: 28upx;
  font-size: 30upx;
  color: #333;
  font-weight: 700;
}
// 背景图 start
.bg_img {
  position: relative;
  width: 100%;
  height: 441upx;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  image{
    width: 100%;
    height: 100%;
  }
}
// 背景图 end
// login start
.login-title {
  position: relative;
  z-index: 9;
  // .logo {
  //   padding-top: 128upx;
  //   width: 100%;
  //   padding-left: 75upx;
  //   box-sizing: border-box;
  //   font-size: 56upx;
  //   font-weight: 500;
  // }
  .logo-img{
    margin-top: 20rpx;
    width: 250rpx;
    height:250rpx;
  }
}
// login end
// 忘记密码 start
.form-wapper {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 0upx 75upx 20upx;
  border-radius: 10upx;
  z-index: 99;

  .input-wapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
    color: #333;
    height: 100upx;
    border-bottom: 1px solid #eee;
    .rside {
      flex: 1;
    }
    .iconfont {
      font-size: 40upx;
      color: #bfbfbf;
      line-height: 100rpx;
    }
    input {
      height: 90upx;
      box-sizing: border-box;
      border: none !important;
      width: calc(100% - 80px);
    }
    .input-placeholder {
      color: #bfbfbf;
      font-size: 30upx;
      font-weight: 400;
      line-height: 90rpx;
    }

    .get-code-btn {
      border: 0;
      background: #fff;
      font-size: 24upx;
      color: $theme;
      text-align: right;
      padding-left: 0;
      padding-right: 0;
      &:after {
        border: 0;
      }
    }
  }
  .yanZhengMa {
    // position: absolute;
    padding: 0;
    // right: 0;
    color: #e64340;
    font-size: 28rpx;
    background: none;
    height: 90upx;
    line-height: 90upx;
    // top: 0;
    &:after {
      border: none;
    }
  }
  .paw {
    line-height: 80upx;
    width: 94%;
    height: 80upx;
    margin: 0 3%;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    color: $theme;
    font-size: 24upx;
  }
}
// 忘记密码 end
// 重置密码按钮 start
.login-btn {
  display: block;
  line-height: 90upx;
  text-align: center;
  margin: 0 75upx;
  height: 90upx;
  font-size: 32upx;
  color: #fff;
  background: $bgtheme;
  border-radius: 50upx;
  background-blend-mode: normal, normal;
  &:after {
    border: 0;
  }
}
// 重置密码按钮 end
.pws{
  position: relative;
  right: 32rpx;
  width: 32rpx;
  height: 24rpx;
  top: 42rpx;
  .close {
    position: relative;
    top: -6rpx;
  }
  image {

    width: 100%;
    height: 100%;
  }
}
</style>
