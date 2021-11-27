<template>
  <view class=" padding-top-sm tab-1">
    <swiper class="swiper" @change="swiperChange">
      <block v-for="(item, i) in navs" :key="i">
        <swiper-item @touchmove.stop='stopTouchMove'>
			<view class="grid text-center col-4">
			  <block v-for="(ele, j) in item" :key="j">
			    <view class="sub-item flex flex-direction justify-center align-center" @click="navTo(ele.path,j)">
            <view class="block-48">
              <!-- <image src="../../../../static/home/tab3.png" mode="aspectFit" ></image>0 -->
              <mo-image :src="ele.thumb" mode="aspectFit" ></mo-image>
            </view>
			      <!-- <image class="block-48" :src="ele.thumb" mode="aspectFit" lazy-load></image> -->
			      <text class="text-28 text-333 margin-top-xs">{{ ele.name }}</text>
			    </view>
			  </block>
			</view>
        </swiper-item>
      </block>
    </swiper>
  <!--  <view class="padding-tb-xs flex justify-center">
      <view class="bar flex round overflow">
        <block v-for="(item, index) in navs" :key="index"><view class="bar_item bg-gray" :class="{ active: current == index }"></view></block>
      </view>
    </view> -->

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
  </view>
</template>

<script>
/**
 * @author
 * @description 金刚区布局
 * @property {Array.Object} navs - 导航信息
 * @property {Number} current - 当前是那个导航块
 */
export default {
  name: 'mo-grid',
  data() {
    return {
       kfinfo: {},
      backSuccessShow: false,
      agency_url: "",
      baseImgUrl: global.IMG_BASE_URL,
      info: {},
      navs: [],
      current: 0
    };
  },
 
  created() {
    this.getNavs();
  },
  
  methods: {
     getGridData() {
      this.$api
        .get(global.apiUrls.get_user_info, {})
        .then((result) => {
          result = result.data;
          console.log("后台返回登录信息", result);
          if (result.code == 0) {
            this.info = result.data[0];
            this.agency_url = result.agency_url;
            console.log(this.agency_url,1111111)
          } else {
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          console.log("ERROR", err);
          this.$message.info("服务器错误");
        });
    },
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
      if(!data){
         this.$message.info("请先登录再邀请好友");
      }
      let url = data;
      let oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      // console.log(oInput.value);
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message.info("链接已复制成功");
      oInput.remove();
    },
    stopTouchMove(){
      return true
    },
    /**
     * @function
     * @description 获取导航信息
     */
    getNavs() {
      this.navs = [[
        {path:'',name:'新手指南',thumb:require('../../../../static/cate/001.png')},
        // {path:'',name:'商品分类',thumb:require('../../../../static/cate/002.png')},
        // {path:'',name:'收藏网址',thumb:require('../../../../static/cate/003.png')},
        {path:'',name:'APP下载',thumb:require('../../../../static/cate/006.png')},
        {path:'',name:'邀请好友',thumb:require('../../../../static/cate/004.png')},
        {path:'',name:'在线客服',thumb:require('../../../../static/cate/005.png')},
      ]]
    },
    /**
     * @event
     * @description 跳转到导航指向的页面
     * @param {String} path - 页面路径
     */
    navTo(path,index) {
      if(index == 0){
         uni.navigateTo({
          url: '/pages/user/help/index'
        });
        return false
      }
      if(index ==1){
        this.$message.info("该功能暂未上线");
      }
      if(index == 2){
        this.copy(this.agency_url)
        return false
      }
      if(index == 3){
        this.kfClick()
        return false
      }
      console.log(path)
        // uni.navigateTo({
        //   url: path
        // });
    },
    /**
     * @event
     * @description swiper滚动的时候
     * @param {Object} e - 原生事件
     */
    swiperChange(e) {
      this.current = e.detail.current;
    }
  },

};
</script>

<style lang="scss" scoped>
.swiper {
  height: 160rpx;
}
.block-48 {
  width: 80rpx;
  min-width: 80rpx;
  height: 80rpx;
  min-height: 80rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
.tab-1{
  /* background: #fff; */
  margin:0 26rpx 20rpx;
}
.sub-item {
  position: relative;
  margin-bottom:20rpx;
  .jiaobiao {
    position: absolute;
    top: 10rpx;
    right: 20rpx;
    width: 35rpx;
    height: 35rpx;
    color: #fff;
    background: $mo-main-color;
    border-radius: 50% 50% 0 50%;
    font-size: 20rpx;
    text-align: center;
    line-height: 35rpx;
    z-index: 999;
  }
  .scale-up {
    width: 54rpx;
    height: 30rpx;
    line-height: 30rpx;
    right: 0;
    border-radius: 15rpx 15rpx 15rpx 0;
  }
}

.bar {
  .bar_item {
    width: 30rpx;
    height: 6rpx;
    background: #f2f3f5;
    border-radius: 6rpx;
  }
  .bar_item + .bar_item {
    margin-left: 10rpx;
  }
  .bar_item.active {
    background: $theme;
  }
}
.text-333 {
  color: #333333;
}

.fade {
  animation: fade 1.5s infinite;
}
@keyframes fade {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.scale-up {
  animation: scale-up 1.5s infinite;
}
@keyframes scale-up {
  0% {
    transform: scale(0.2);
  }

  100% {
    transform: scale(1);
  }
}
.text-28{
  font-size: 28rpx;
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
