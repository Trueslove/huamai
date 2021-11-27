<template>
  <view class="page">
    <mo-custom isBack="true" :isBottom="true" bgColor="bg-white">
      <view slot="content">账号设置</view>
    </mo-custom>
    <!-- 顶部头像模块 end -->
    <view class="cu-list menu">
          <view class="cu-item">
        <view class="content flex justify-between align-center">
          <text class="title text-lg text-333">ID</text>
          <view class="flex align-center">
            <text class="text-999">{{ info.id }}</text>
          </view>
        </view>
      </view>
      <view class="cu-item">
        <view class="content flex justify-between align-center">
          <text class="title text-lg text-333">账号</text>
          <view class="flex align-center">
            <text class="text-999">{{ info.username | filterMobile}}</text>
          </view>
        </view>
      </view>
    <view class="cu-item">
        <view class="content flex justify-between align-center">
          <text class="title text-lg text-333">修改密码</text>
          <view class="flex align-center">
              <text class="cuIcon-right"></text>
          </view>
        </view>
      </view>
    </view>
    <!-- 底部占位 start -->
    <!-- <view class="bottom-status"></view> -->
    <!-- 底部占位 end -->
    <!-- 提交按钮 start -->
    <!-- <view class="bottom-action">
      <view class="btn1" @click="layout">退出登录</view>
    </view> -->

    <w-picker
      :visible.sync="visible"
      mode="selector"
      :value="is_activateName"
      default-type="name"
      :default-props="defaultProps"
      :options="options"
      @confirm="onConfirm($event, 'selector')"
      ref="selector"
    ></w-picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          name: "男",
          id: 1,
        },
        {
          name: "女",
          id: 2,
        },
      ], // {Array} 性别数组
      defaultProps: {
        label: "name",
        value: "id",
      },
      visible: true, //性别组件
      selectindex: "",
      info: {
      
      },
    };
  },
  onLoad(option) {
    // this.getData();
    this.getUserInfo()
  },
  onPullDownRefresh() {},
  computed: {
    is_activateName() {
      let name = "";
      if (this.selectindex) {
        name = this.options[this.selectindex - 1].name;
      }
      console.log("this.selectindex", name);
      return name;
    },
    // 用户信息
    userInfo() {
      return this.$store.getters.userInfo || {};
    },
  },
  onReachBottom(e) {},
  onShow() {},

  methods: {
      getUserInfo(){
 this.$api
        .get(global.apiUrls.get_user_info, {})
        .then((result) => {
          result = result.data;
          console.log("后台返回登录信息", result);
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
    layout() {
      this.$util.showModal({
        title: "提示",
        content: "确认退出登录吗？",
        cancelText: "取消",
        confirmText: "确定",
        success: (res) => {
          if (res.confirm) {
            this.$store.commit("logout");
            setTimeout(() => {
              uni.navigateBack();
            }, 500);
            // 确认
          }
        },
      });
    },
    onConfirm(val) {
      console.log(val);
      this.selectindex = val.value;
      this.info.sex = val.value;
    },
    validateCard(arg) {
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(arg);
    },
    validatePhone(arg) {
      return /^1[2-9]\d{9}$/.test(arg);
    },
    pop(ref) {
      console.log(1111);
      this.$refs[ref].show();
    },
    sub() {
      if (!this.info.name) {
        this.$message.info("请输入姓名");
        return false;
      }
      if (!this.info.sex) {
        this.$message.info("请选择性别");
        return false;
      }
      if (!this.info.phone) {
        this.$message.info("请输入电话");
        return false;
      }
      if (!this.validatePhone(this.info.phone)) {
        this.$message.info("联系方式输入错误");
        return false;
      }
      if (!this.info.id_card) {
        this.$message.info("请输入身份证号");
        return false;
      }
      if (!this.validateCard(this.info.id_card)) {
        this.$message.info("身份证号输入错误");
        return false;
      }
      let data = {
        name: this.info.name,
        phone: this.info.phone,
        sex: this.info.sex,
        id_card: this.info.id_card,
        workplace: this.info.workplace,
      };
      // 请求接口
      this.$api
        .post(global.apiUrls.update_user_info, data)
        .then((result) => {
          result = result.data;
          console.log("后台返回信息", result);
          if (result.code == 20000) {
            this.$message.info("修改成功");
            setTimeout(() => {
              uni.navigateBack();
            }, 500);
          } else {
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          console.log("ERROR", err);
          this.$message.info(err.msg);
        });
    },
    getData() {
      // 请求接口
      this.$api
        .get(global.apiUrls.bacic_info, {})
        .then((result) => {
          result = result.data;
          console.log("后台返回信息", result);
          if (result.code == 20000) {
            this.info = result.data;
            this.selectindex = this.info.sex;
          } else {
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          console.log("ERROR", err);
          this.$message.info(err.msg);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.demo text {
  margin: 10upx;
}

.demo-face {
  width: 100rpx;
  height: 100rpx;
}

.demo-face image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 60rpx;
}

.head_list {
  background: #fff;
  padding: 20rpx 0;
  margin: 20rpx 26rpx;
  height: 152rpx;
  position: relative;
}
.head_list .cu-item {
  margin-left: 0 !important;
}
.other {
  width: 500rpx;
  text-align: right;
}

.address {
  display: inline-block;
  width: 110rpx;
}

.cu-item.arrow::before {
  color: #bfbfbf !important;
}

.cu-list.menu > .cu-item {
  height: 110rpx;
}

.content .title {
  display: inline-block;
  width: 160rpx;
  min-width: 160rpx;
}

.radius-10 {
  border-radius: 10rpx;
}
.bottom-action {
  position: fixed;
  right: 145rpx;
  left: 145rpx;
  bottom: 88rpx;
  bottom: calc(88rpx + constant(safe-area-inset-bottom));
  bottom: calc(88rpx + env(safe-area-inset-bottom));
  display: flex;

  view {
    height: 88rpx;
    flex: 1;
    line-height: 88rpx;
    text-align: center;
    border-radius: 8rpx;
    color: #ffffff;
  }
  .btn1 {
    background: #999;
    margin-right: 30rpx;
  }
  .btn2 {
    background: #4e8df6;
  }
}
.bottom-status {
  height: 188rpx;
  height: calc(188rpx + constant(safe-area-inset-bottom));
  height: calc(188rpx + env(safe-area-inset-bottom));
}
.list-arrow {
  width: 14rpx;
  height: 30rpx;
}
</style>
