<template>
  <view>
    <mo-custom :isBottom="true" bgColor="bg-white">
      <view slot="content">商品</view>
    </mo-custom>
    <view style="position: relative;">
      <view class="godds-header">
        <view class="godds-header-type" @click="handleChangeType(0)">{{
          activeTypeLeft
        }}</view>
        <view class="godds-header-type" @click="handleChangeType(1)">{{
          activeTypeRight
        }}</view>
      </view>
      <!-- 左分类 -->
      <view class="mo-filter-class" v-if="showClass">
        <view
          class="mo-clas-item"
          v-for="item in classData"
          :key="item.id"
          @click="handleClickClass(item)"
          :style="goods_class == item.id ? 'color:red;' : ''"
          >{{ item.value }}</view
        >
      </view>
      <!-- 右分类 -->
      <view class="mo-filter-class mo-filter-class-right" v-if="showRightClass">
        <view
          class="mo-clas-item-cell"
          v-for="item in classRightData"
          :key="item.id"
          @click="handleClickClass(item, 1)"
          :style="type_sort == item.id ? 'color:red;' : ''"
          >{{ item.value }}</view
        >
      </view>
    </view>

    <view class="goods-content" v-if="goodsList.length > 0">
      <view
        class="goods-c-item"
        v-for="(item, index) in goodsList"
        :key="index"
        @click="goDetail(item)"
      >
        <view class="goods-c-i-left">
          <image
            class="goods-c-i-l-img"
            :src="baseImgUrl + item.img"
          ></image>
        </view>
        <view class="goods-c-i-center">
          <view class="content">
            <view class="text-lg text-333 text-cut-2 goods-c-i-name">
              {{ item.goods_name || "000" }}
            </view>
            <view class="goods-c-i-price">
              价值: <text style="margin-left: 30rpx">¥{{item.price}}</text>
            </view>
            <view
              class="margin-top-sm flex align-center marginTop-10 margin-top-sm-goods"
              style="flex-wrap: wrap"
            >
              <view class="text-sm text-999" style="width: 100%">
                <!-- 进度条 -->
                <view
                  class="flex margin-top-xs align-center"
                  style="width: 100%"
                >
                  <view class="cu-progress round xs">
                    <view
                      class="mo-bgcred"
                      :style="[{ width: item.jjjx * 100 + '%' }]"
                    ></view>
                  </view>
                </view>
              </view>
              <view class="goods-num-wap">
                <span style="color: #f18104">{{ item.zjje }}</span>
                <span style="color: #999999">{{ item.price }}</span>
                <span style="color: #d93025">{{ item.price - item.zjje }}</span>
              </view>
              <view class="goods-num-wap" style="color:#999">
                <span>已参与</span>
                <span>总需人数</span>
                <span>剩余</span>
              </view>
            </view>
          </view>
        </view>
        <view class="goods-c-i-right" @click.stop="goCartGoods(item)">
          <image
            class="goods-c-i-cart"
            src="../../../static/home/cart.png"
            alt=""
          />
        </view>
      </view>
    </view>
    <view class="goods-none" v-else>暂无商品</view>
  </view>
</template>
<script>
export default {
  data() {
    return {
       baseImgUrl: global.IMG_BASE_URL,
      typeItem: ["全部商品", "即将揭晓"],
      activeTypeLeft: "全部商品",
      activeTypeRight: "即将揭晓",
      showClass: false, // 是否显示分类
      showRightClass: false, // 右面分类
      classData: [],
      classRightData: [
        { id: "4", value: "即将揭晓" },
        { id: "1", value: "人气" },
        { id: "2", value: "最新" },
        { id: "3", value: "价格" },
      ],
      goods_class: '',
      type_sort: "4",
      info: {},
      goodsList: [],
      pageNum: 1, // 当前页
      total: 0, // 总条数
    };
  },
  onShow() {
    this.getClassData();
    this.getData();
  },
  onReachBottom(e) {
    if(this.goodsList.length < this.total) {
      this.pageNum = this.pageNum + 1;
      this.getData();
    }
  },
  onPullDownRefresh() {
      setTimeout(() => {
        uni.stopPullDownRefresh();
      }, 1000);
    },
  methods: {
    goCartGoods(item){
this.$util.actionAuth(() => {
        this.$api
          .post(global.apiUrls.add_goods_shop, {
            goods_id: item.id,
            option:1,
            nums:1,
          })
          .then((result) => {
            this.isShowLoading = false;
            this.isInit = true;
            result = result.data;
            console.log("后台返回登录信息", result);
            if (result.code == 0) {
              this.$message.info("加入成功");
            } else {
              this.$message.info(result.msg);
            }
          })
          .catch((err) => {
            this.isShowLoading = false;
            this.isInit = true;
            console.log("ERROR", err);
            this.$message.info("服务器错误");
          });
      });
    },
    goDetail(info) {
        this.$urouter.navigateTo({
          url: '/pages/goods/goods-detail/index',
          params: {
            goods_id: info.goods_db_key_id,
            goods_class: this.goods_class,
            id: info.id,
            qs: info.qishu
          }
        });
      },
    getData() {
      this.isShowLoading = true;
      let params = { pageNum: this.pageNum, type_sort: this.type_sort };
      if(!!this.goods_class) {
        Object.assign(params, {goods_class: this.goods_class})
      }
      this.$api
        .get(global.apiUrls.get_goods_list, params)
        .then((result) => {
          this.isShowLoading = false;
          this.isInit = true;
          result = result.data;
          if (result.code == 0) {
            this.goodsList = this.goodsList.concat(result.data);
            this.total = result.total;
          } else {
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          this.isShowLoading = false;
          this.isInit = true;
          this.$message.info("服务器错误");
        });
    },
    getClassData() {
      // 商品分类
      this.$api
        .get(global.apiUrls.get_goods_class)
        .then((result) => {
          result = result.data;
          if (result.code == 0) {
            this.classData = result.data;
            this.classData.unshift({
              id: "",
              value: "全部商品",
            });
          } else {
            this.$message.info(result.msg);
          }
        })
        .catch((err) => {
          this.$message.info("服务器错误");
        });
    },
    handleClickClass(item, type) {
      if (type == 1) {
        this.type_sort = item.id;
        this.activeTypeRight = item.value;
        this.showRightClass = !this.showRightClass;
        this.showClass = false;
      } else {
        this.goods_class = item.id;
        this.activeTypeLeft = item.value;
        this.showClass = !this.showClass;
        this.showRightClass = false;
      }
      this.goodsList =[]
      this.getData();
    },
    handleChangeType(index) {
      if (index == 0) {
        this.showClass = !this.showClass;
        this.showRightClass = false;
      } else {
        this.showRightClass = !this.showRightClass;
        this.showClass = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.goods-none {
  width: 100%;
  padding: 50rpx 0;
  text-align: center;
}
.goods-c-i-name {
  font-size: 28rpx;
}
.goods-c-i-price {
  font-size: 28rpx;
  color: #999;
}
.margin-top-sm-goods {
  margin-top: 0 !important;
}
.goods-num-wap {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 24rpx;
}
.goods-content {
  .goods-c-item {
    padding: 30rpx 16rpx;
    display: flex;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid #eee;
    .goods-c-i-left {
      .goods-c-i-l-img {
        width: 160rpx;
        height: 160rpx;
      }
    }
    .goods-c-i-cart {
      height: 70rpx;
      width: 70rpx;
    }
    .goods-c-i-center {
      flex: 1;
      padding: 0 20rpx
    }

  }
}
.godds-header {
  display: flex;
  justify-content: space-around;
  text-align: center;
  background: #fff;
  .godds-header-type:first-child {
    border-right: 1rpx solid #eee;
    border-bottom: 4rpx solid rgb(218, 50, 40);
    color: rgb(218, 50, 40);
  }
  .godds-header-type {
    width: 50%;
    height: 80rpx;
    line-height: 80rpx;
    border-bottom: 4rpx solid #eee;
  }
}
.mo-filter-class {
  position: absolute;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  background: #fff;
  box-shadow: 2rpx 2rpx 10rpx #ccc;
  z-index: 100;
  .mo-clas-item {
    width: 33.33%;
    text-align: center;
    line-height: 64rpx;
    border-bottom: 1px solid #f5f5f5;
    border-right: 1px solid #f5f5f5;
  }
}
.mo-clas-item-cell {
  width: 100%;
  line-height: 64rpx;
  text-align: left;
  padding: 0 40rpx;
  border-bottom: 1px solid #f5f5f5;
}
.mo-filter-class-right {
  width: 100%;
}
</style>
