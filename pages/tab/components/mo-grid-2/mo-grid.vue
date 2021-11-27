<template>
  <view class="padding-lr  tab-1">
    <swiper class="swiper " @change="swiperChange">
      <block v-for="(item, i) in navs" :key="i">
        <swiper-item>
		<view class="grid text-center col-2">
		  <block v-for="(ele, j) in item" :key="j">
		    <view class="sub-item flex flex-direction justify-center align-center" @click="navTo(ele.path)">
		      <view class="block-48">
		        <!-- <image src="../../../../static/home/tab3.png" mode="aspectFit" ></image>0 -->
		        <mo-image radius="10rpx" :src="ele.thumb" mode="aspectFit" ></mo-image>
		      </view>
		      <!-- <image class="block-48" :src="ele.thumb" mode="aspectFit" lazy-load></image> -->
		      <text class="text-28 text-333 margin-top-xs">{{ ele.name }}</text>
		    </view>
		  </block>
		</view>
        </swiper-item>
      </block>
    </swiper>
   <view class="padding-tb-xs flex justify-center">
      <view class="bar flex round overflow">
        <block v-for="(item, index) in navs" :key="index"><view class="bar_item bg-gray" :class="{ active: current == index }"></view></block>
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
  name: 'mo-grid-2',
  data() {
    return {
      navs: [],
      current: 0
    };
  },
  created() {
    this.getNavs();
  },
  methods: {
    /**
     * @function
     * @description 获取导航信息
     */
    getNavs() {
      this.navs = [[
        {path:'/pages/user/detail/detail?type=1',name:'举办地点',thumb:require('../../../../static/home/img-1.png')},
        {path:'/pages/user/detail/detail?type=1',name:'举办地点',thumb:require('../../../../static/home/img-1.png')}],
        [{path:'/pages/user/detail/detail?type=1',name:'举办地点',thumb:require('../../../../static/home/img-1.png')},
        {path:'/pages/user/detail/detail?type=1',name:'举办地点',thumb:require('../../../../static/home/img-1.png')}],
        [{path:'/pages/user/detail/detail?type=1',name:'举办地点',thumb:require('../../../../static/home/img-1.png')},
        {path:'/pages/user/detail/detail?type=1',name:'举办地点',thumb:require('../../../../static/home/img-1.png')}],
        ]
    },
    /**
     * @event
     * @description 跳转到导航指向的页面
     * @param {String} path - 页面路径
     */
    navTo(path) {
      console.log(path)
        uni.navigateTo({
          url: path
        });
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
  height: 216rpx;
  width: 100%;
  padding-bottom: 20rpx;
}
.block-48 {
  width: 260rpx;
  height: 150rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
// .tab-1{
//   background: #fff;
//   margin:0 26rpx 20rpx;
// }
.sub-item {
  position: relative;
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
    background:rgb(50, 88, 156);
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
</style>
