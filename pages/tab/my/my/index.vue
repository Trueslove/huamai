<template>
  <view class="my">
    <!-- 自定义头部 start -->
    <view class="cu-custom" :style="[{ height: CustomBar + 'px' }]">
      <view
        class="cu-bar fixed"
        :style="{
          height: CustomBar + 'px',
          paddingTop: StatusBar + 'px',
          overflow: 'hidden',
        }"
      >
        <view
          class="img-height"
          src=""
          mode="widthFix"
          style="position: absolute; top: 0; width: 100%; background: #fe4b61"
        />
        <view class="action"></view>
        <view
          v-if="showBarTitle"
          class="content text-white"
          :style="[{ top: StatusBar + 'px' }]"
          >个人中心</view
        >
      </view>
    </view>
    <!-- 自定义头部 end -->

    <!-- 背景图 start -->
    <view class="mo-my-background" style="background: #fe4b61">
      <!--背景图 end -->

      <!-- 用户信息 - 已登录 start -->
      <view class="userInfo" v-if="userInfo">
        <view class="tui-msg-box">
          <view class="flex flex-sub align-center">
            <image
              :src="baseImgUrl + info.img"
              class="block-108 round"
              mode="aspectFill"
            ></image>
            <view class="margin-left" >
             
                <view class="text-lg text-white"
                >昵称：{{ info.username }}</view
              >
               <view class="text-lg text-white"
                >账号：{{ info.mobile | filterMobile }}  ID:{{info.id}}</view
              >
              <view class="text-lg text-white">余额：{{ info.jinbi }}金币</view>
              <view class="text-lg text-white"
                >钱包：¥{{ info.wallet ? info.wallet.toFixed(2) : 0 }}</view
              >
            </view>
          </view>
          <view class="tui-msg-right">
            <!-- <image class="list-arrow" src="/static/my/right-arrow.png" mode="aspectFit"></image> -->
          </view>
        </view>
      </view>
      <!-- 用户信息 - 已登录 end -->

      <!-- 用户信息 - 未登录 start -->
      <view class="userInfo" v-else>
        <view class="tui-msg-box">
          <view
            class="flex flex-sub align-center"
            @click="handleJump"
            data-url="/pages/user/login-password/index"
          >
            <image
              src="/static/logo.png"
              class="block-108 round"
              mode="aspectFill"
            ></image>
            <view class="margin-left">
              <view class="text-lg text-white">请登录</view>
            </view>
          </view>
          <view class="tui-msg-right">
            <image
              class="list-arrow"
              src="/static/my/right-arrow.png"
              mode="aspectFit"
            ></image>
          </view>
        </view>
      </view>
    </view>
    <view class="reg-paw">
      <text @tap="handleJumpLogin" data-url="/pages/user/wallet/index"
        >钱包</text
      >
      <text
        @click="handleJumpLogin"
        data-url="/pages/user/recharge/index"
        class="wj_mh"
        >充值</text
      >
    </view>
    <view class="flex justify-center" style="background: #fff" v-if="userInfo">
      官网：
      <view class="link text-cut"> {{ agency_url }}</view>
      <view class="btn-copy" @click="copy(agency_url)">复制</view>
    </view>
    <view class="list text-lg" >
      <view class="item" @click="handleJumpLogin"
        data-url="/pages/user/share-part/index">
        <image src="../../../../static/my/list-1.png"></image>
        <view>分享赚钱</view>
      </view>
      <view
        class="item"
        @click="handleJumpLogin"
        data-url="/pages/user/fav/index"
      >
        <image src="../../../../static/my/list-1.png"></image>
        <view>我的收藏</view>
      </view>
      <view
        class="item"
        @click="handleJumpLogin"
        data-url="/pages/user/win-log/index"
      >
        <image src="../../../../static/my/list-1.png"></image>
        <view>获得商品</view>
      </view>
      <view
        class="item"
        @click="handleJumpLogin"
        data-url="/pages/user/join-log/index"
      >
        <image src="../../../../static/my/list-2.png"></image>
        <view>参与记录</view>
      </view>
      <view
        class="item"
        @click="handleJumpLogin"
        data-url="/pages/user/account-log/index"
      >
        <image src="../../../../static/my/list-3.png"></image>
        <view>账户明细</view>
      </view>
      <view class="item" @click="kfClick()">
        <image src="../../../../static/my/list-6.png"></image>
        <view>客服帮助</view>
      </view>
      <view
        class="item"
        @click="handleJumpLogin"
        data-url="/pages/user/info/index"
      >
        <image src="../../../../static/my/list-5.png"></image>
        <view>账户设置</view>
      </view>
      <view class="item" @tap="handleJump" data-url="/pages/user/help/index">
        <image src="../../../../static/my/list-4.png"></image>
        <view>新手帮助</view>
      </view>
      <view class="item2">
        <view>客服时间 （9:00 - 19:00）</view>
      </view>
      <button
        v-if="userInfo"
        class="bottom-action cu-btn round text-white"
        @click="logout()"
      >
        退出登录
      </button>
    </view>
    <!-- 用户信息 - 未登录 end -->
    <!-- 列表导航 start -->

    <!-- 列表导航 end -->
    <view class="back-success-wrap" v-if="backSuccessShow">
      <view class="mask" @click="backSuccessShow = false"> </view>
      <view class="back-content">
        <view class="text-center margin-tb text-lg text-bold">在线客服</view>
        <view class="flex justify-center align-center padding-top">
          <image
            mode="scaleToFill"
            style="width: 360rpx; height: 360rpx"
            src="../../../../static/my/qr.jpg"
          ></image>
        </view>
      </view>
    </view>
    <!-- 断网检测 -->
    <mo-notwork></mo-notwork>
  </view>
</template>

<script>
export default {
  data() {
    return {
      kfinfo: {},
      backSuccessShow: false,
      agency_url: "",
      baseImgUrl: global.IMG_BASE_URL,
      info: {},
      showBarTitle: false,
      baseUrl: global.API_BASE_URL,
      isNextEnter: false,
    };
  },
  onShow() {
    if (this.isNextEnter && this.userInfo) {
      this.getData();
    }
  },
  computed: {
    // 用户信息
    userInfo() {
      return this.$store.getters.userInfo || "";
    },
  },
  onReachBottom(e) {},
  onLoad() {
    this.kf();
    this.getData();
    setTimeout(() => {
      this.isNextEnter = true;
    }, 100);
  },
  methods: {
    kfClick() {
      this.backSuccessShow = true;
    },
    kf() {
      this.$api
        .get(global.apiUrls.get_ks, {})
        .then((result) => {
          result = result.data;
          console.log("后台返回登录信息", result);
          if (result.code == 0) {
            this.kfinfo = result.data;
          } else {
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          console.log("ERROR", err);
          this.$message.info("服务器错误");
        });
    },
    copy(data) {
      let url = data;
      let oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      console.log(oInput.value);
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message.info("复制成功");
      oInput.remove();
    },
    logout() {
      if (!this.userInfo) {
        return false;
      }
      this.$util.showModal({
        title: "提示",
        content: "确定退出当前账号？",
        confirmColor: this.$store.state.themeColor,
        success: (res) => {
          if (res.confirm) {
            this.$store.commit("logout");
          }
        },
      });
    },
    getData() {
      this.$api
        .get(global.apiUrls.get_user_info, {})
        .then((result) => {
          result = result.data;
          console.log("后台返回登录信息", result);
          if (result.code == 0) {
            this.info = result.data[0];
            this.agency_url = result.agency_url;
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
.my {
  padding-bottom: 32rpx;
  position: relative;
}

.radius-16 {
  border-radius: 16rpx;
  overflow: hidden;
}

.block-50 {
  width: 50rpx;
  min-width: 50rpx;
  height: 50rpx;
  min-height: 50rpx;
}

.block-32 {
  width: 32rpx;
  min-width: 32rpx;
  height: 32rpx;
  min-height: 32rpx;
}

.block-108 {
  width: 88rpx;
  min-width: 88rpx;
  height: 88rpx;
  min-height: 88rpx;
  /* border: 4rpx solid #ffffff; */
}

.userInfo {
  /* #ifdef MP-WEIXIN  */
  margin: 0rpx auto 0;
  /* #endif */
  /* #ifndef MP-WEIXIN  */
  margin: 0rpx auto 0;
  /* #endif */
  position: relative;
  width: 698rpx;
  height: 140rpx;
  z-index: 2;
}

.tui-msg-box {
  width: 100%;
  position: absolute;
  padding: 0 20rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ml-30 {
  margin-right: 20rpx;
  margin-left: 10rpx;
  height: 40rpx;
}

// 头像旁边名字
.mo-headpic-text {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 128rpx;

  .mo-line-height {
    line-height: 34rpx;
  }
}

// 背景图片
.mo-my-background {
  height: 220rpx;
}

// 头像
.mo-top-pic {
  width: 40rpx;
  height: 40rpx;
}

// 复制标签
.mo-copy-invite {
  display: inline-block;
  width: 60rpx;
  height: 34rpx;
  text-align: center;
  line-height: 34rpx;
  border-radius: 6rpx;
  background-color: rgba(255, 255, 255, 0.5);
}

.tui-msg-right {
  margin-right: 24rpx;
  color: #fff;
}

.img-height {
  height: 255rpx !important;
}

.qrcode {
  width: 160rpx;
  height: 58rpx;
}

.margin-top-20 {
  margin-top: 20rpx;
}
.list-arrow {
  width: 48rpx;
  height: 28rpx;
}

.list {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  .item {
    justify-content: center;
    width: 50%;
    display: flex;
    align-items: center;
    padding: 26rpx;
    image {
      margin-right: 20rpx;
      width: 28rpx;
      height: 28rpx;
    }
  }
  .item2 {
    text-align: center;
    padding: 26rpx;
    width: 100%;
  }
}
.reg-paw {
  padding: 32rpx 0;
  text-align: center;
  background: #fff;
  text {
    font-family: PingFangSC-Regular;
    font-weight: 600;
    color: #333333;
    font-size: 32rpx;
    display: inline-block;
    min-width: 50%;
    position: relative;
  }

  .wj_mh:before {
    position: absolute;
    height: 26rpx;
    width: 3px;
    background: #999;
    content: "";
    left: 0rpx;
    top: 8rpx;
  }
}
.link {
  width: 60%;
  color: rgb(254, 75, 97);
}
.btn-copy {
  color: rgb(254, 75, 97);
  border: 1rpx solid rgb(254, 75, 97);
  border-radius: 15rpx;
  padding: 2rpx 10rpx;
}
.bottom-action {
  background: rgb(254, 75, 97);
  width: 400rpx;
  margin: 0 auto;
  position: relative;
  left: 50%;
  margin-left: -200rpx;
  margin-bottom: 50rpx;
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
    height: 624rpx;
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
