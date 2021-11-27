<template>
  <view
    id="wrapper"
    class="wrapper bg-white solid-bottom"
    :style="[{ top: top + 'px' }]"
  >
    <view id="content1" class="padding-lr flex content1" style="height: 108rpx">
      <view
        class="flex-sub flex justify-center align-center text-666"
        :class="[{ active: curFilter == 0 }]"
        @click="filterClick(0)"
      >
        <text class="text-df">人气</text>
      </view>
      <view
        class="flex-sub flex justify-center align-center text-666"
        :class="[{ active: curFilter == 1 }]"
        @click="filterClick(1)"
      >
        <text class="text-df">最新</text>
      </view>
      <view
        class="flex-sub flex justify-center align-center text-666"
        @click="filterClick(2)"
        :class="[{ active: curFilter == 2 }]"
      >
        <text class="text-df">价值</text>
      </view>
      <view
        class="flex-sub flex align-center justify-center"
        @click="filterClick(3)"
        :class="[{ active: curFilter == 3 }]"
      >
        <text class="text-666 text-df">即将揭晓</text>
      </view>
      <view
        class="flex-sub flex align-center justify-center"
        @click="handleClickClass"
        style="color: #da3228"
      >
        <text class="cuIcon-apps margin-right-6"></text>
        <text class="text-df">分类</text>
      </view>
      <view
        class="flex-sub flex align-center justify-end"
        style="color: #da3228"
        @click="handleClickSearch"
      >
        <text class="cuIcon-search margin-right-6"></text>
        <text class="text-df">搜索</text>
      </view>
    </view>
    <view class="mo-filter-class" v-if="showClass">
      <view
        class="mo-clas-item"
        v-for="item in classData"
        :key="item.id"
        @click="handleClickClass(item.id)"
        :style="activeClassId == item.id ? 'color:red;' : ''"
        >{{ item.value }}</view
      >
    </view>
  </view>
</template>

<script>
export default {
  props: {
    top: {
      type: [String, Number],
      default: 0,
    },
    classData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      selects: [
        {
          title: "综合",
          type: "multiple",
        },
      ], // 综合
      curSelected: 0, // 综合排序初始值
      curFilter: -1, // 价格排序方式
      filterType: "multiple", // 排序类型
      order: "asc", // 升序:asc 倒序:desc
      model: "inline", // inline block
      windowWidth: 0, // 页面宽
      windowHeight: 0, // 页面高
      showClass: false, // 是否显示分类
      activeClassId: "", // 当前选中的分类
    };
  },
  watch: {},
  mounted() {},
  methods: {
    handleClickSearch() {
      this.$urouter.navigateTo({
        url: '/pages/goods/goods-list/index'
      });
      //  this.$urouter.navigateTo({
      //     url: '/pages/goods/goods-detail/index',
      //     params: {
      //       id: this.info.goods_db_key_id,
      //       goods_class: this.goods_class
      //     }
      //   });
    },
    filterClick(val) {
      this.curFilter = val;
      this.$emit("changeCurFilter", val,this.activeClassId);
    },
    handleClickClass(id) {
      if (Object.keys(id).length == 0) {
        this.activeClassId = id;
        this.$emit("changeCurFilter", this.curFilter, id);
      }
      this.showClass = !this.showClass;
    },
  },
  created() {
    let info = uni.getSystemInfoSync();
    this.windowWidth = info.windowWidth;
    this.windowHeight = info.windowHeight;
  },
};
</script>

<style lang="scss" scoped>
.mo-filter-class {
  position: absolute;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  background: #fff;
  box-shadow: 2rpx 2rpx 10rpx #ccc;
  z-index: 1;
  .mo-clas-item {
    width: 33.33%;
    text-align: center;
    line-height: 64rpx;
    border-bottom: 1px solid #f5f5f5;
    border-right: 1px solid #f5f5f5;
  }
}
.wrapper {
  position: sticky;
  z-index: 999;

  .content1 {
    .right {
      width: 80rpx;
      position: relative;
      padding-left: 40rpx;
    }

    // .right::after {
    //   content: "";
    //   width: 2rpx;
    //   height: 26rpx;
    //   background-color: #999999;
    //   position: absolute;
    //   top: 50%;
    //   left: 50%;
    //   transform: translateX(-50%) translateY(-50%);
    // }
  }

  .content2 {
    padding: 0 30rpx 20rpx 30rpx;

    .left {
      width: calc(100% - 100rpx);
      white-space: nowrap;
    }

    .right {
      width: 100rpx;
    }
  }

  .masks {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
    display: flex;
    flex-direction: column;

    .top {
      background-color: rgba(0, 0, 0, 0);
    }

    .bot {
      flex: 1;
      background-color: rgba(0, 0, 0, 0.7);

      .container {
        border-radius: 0 0 16rpx 16rpx;
        background-color: #f5f5f5;
        padding: 30rpx;

        .scroll-view {
          max-height: 300rpx;
        }
      }
    }
  }

  .active {
    /* color: $theme !important; */
    color: #333333;
    font-weight: bold;
    position: relative;
  }
  .active::after {
    position: absolute;
    bottom: 20rpx;
    content: " ";
    width: 50%;
    height: 8rpx;
    background: #d93025;
    border-radius: 10rpx;
  }

  .active2 {
    box-shadow: inset 0 0 2rpx 2rpx $theme;
    background-color: rgba(240, 35, 37, 0.1) !important;
    color: $theme;
  }

  .active3 {
    color: $theme !important;
  }

  .masks2 {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: flex-end;

    .container {
      width: 70%;
      height: 100%;
      border-radius: 16rpx 0 0 16rpx;
      background-color: #ffffff;
    }
  }
}

.action-box {
  display: flex;
  margin-top: 30rpx;

  .action {
    flex: 1;
    height: 72rpx;
    line-height: 72rpx;
    border-radius: 62rpx 0px 0px 62rpx;
    font-size: 24rpx;
    text-align: center;
  }

  .action + .action {
    margin-left: 4rpx;
    border-radius: 0px 62px 62px 0px;
  }

  .reset {
    color: #fff;
    background-color: #ffa264;
  }

  .confirm {
    color: #ffffff;
    background: linear-gradient(180deg, #f97676 0%, #ff6464 100%);
  }
}

.block-28 {
  width: 28rpx;
  height: 28rpx;
}

.scale {
  font-size: 32rpx !important;

  &.cuIcon-triangleupfill {
    line-height: 20rpx;
  }

  &.cuIcon-triangledownfill {
    line-height: 20rpx;
  }
}

.translateTop {
  // transform: translateY(5rpx);
  /*  */
}

.translateBot {
  // transform: translateY(-5rpx);
}

.pop-btn {
  position: fixed;
  width: 100%;
  bottom: 0;
  padding: 40rpx 24rpx;
  background: #fff;
  /* border-top: 1rpx solid #f1f1f1; */
  margin-top: 0;
}

.pop-content {
  height: 92%;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.title {
  /* font-weight: 500; */
  color: #333;
  margin-top: 20rpx;
}

.list-item {
  background-color: #f8f8f8;
  display: inline-block;
  margin-bottom: 20rpx;
}

.serviceItem {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;

  text {
    width: 31%;
    margin: 0 0 16rpx 0;
    padding: 20rpx 0;
    text-align: center;
    border-radius: 20rpx;
  }
}

.ml-20 {
  margin-left: 20rpx;
}

.ml-4 {
  margin-left: 4rpx;
}

.service {
  margin-top: 16rpx;
}

.price-round {
  padding: 20rpx 10rpx;

  .round {
    padding: 10rpx 0;
    text-align: center;
    background: #fff;
    border: 1px solid #ccc;
  }
}

.price-round input {
  font-size: 24rpx;
  height: 50rpx;
  padding: 0 60rpx;
}

.border-center {
  /* height: 50rpx;*/
  margin: 0 15rpx;
  width: 30px;
  height: 1px;
  background: #999999;
}

.scale.cuIcon-triangledownfill {
  line-height: 12rpx;
}

.scale.cuIcon-triangleupfill {
  line-height: 12rpx;
}

.float-right {
  float: right;
}
.radius-16 {
  border-radius: 16rpx;
}
.margin-right-6 {
  margin-right: 6rpx;
}
</style>
