<template>
    <view>
        <mo-custom isBack="true" :isBottom="true" bgColor="bg-white">
      <view slot="content">选择地址</view>
    </mo-custom>
     <block v-for="(item,index) in address_list" :key="index">
        <view class="padding-lr margin-bottom bg-white" >
          <view class="padding-tb-sm" @click="handleClick(item)">
            <view class="flex align-center">
              <view class="">{{item.name}}</view>
              <view class="margin-left">{{item.phone }}</view>
            </view>
            <view class="text-666 margin-top-sm">
              {{ item.province }} {{ item.city }} {{ item.county }} {{ item.addr }}
            </view>
          </view>
          <view class="flex justify-between align-center solid-top height-100">
            <view>
              <!-- <text  class="cuIcon-roundcheckfill active"></text> -->
              <!-- <text v-else class="cuIcon-round"></text> -->
            </view>
            <view class="flex text-666">
              <view @click='delAddr(item)'>
                <text class="cuIcon-delete"></text>
                <text class="margin-left-xs">删除</text>
              </view>
              <!-- <view class="margin-left" @click='edit(item)'>
                <text class="cuIcon-edit"></text>
                <text class="margin-left-xs">编辑</text>
              </view> -->
            </view>
          </view>
        </view>
      </block>
      <!-- 空列表展示 start -->
    <fu-empty-ui pagingListNoListDataText="您未添加任何地址" v-if="address_list.length == 0 && isInit"></fu-empty-ui>
    <!-- 空列表展示 end -->
        <!-- 底部占位 start -->
    <view class="bottom-status"></view>
    <!-- 底部占位 end -->
    <!-- 操作按钮 start -->
    <view class="bottom-action">
      <!-- #ifdef MP-WEIXIN -->
      <!-- #endif -->
      <view class="btn2" @click="add_Addr">新增地址</view>
    </view>
    </view>
</template>

<script>
  export default {
    data() {
      return {
        checkInx: 0, // 选中地址的下标
        address_list: [], // 地址列表
        is_change: 0, // 是否开启选择地址模式
        choose_id: 0, // 已选择的默认地址
        edit_id: 0, // 要编辑的地址ID
        backData: null, // 选择低脂模式下的返回值
        isInit: false, // 是否是初始加载,控制数据为空时空布局组件展示与否
      };
    },
    onShow() {
      // 获取地址列表
      this.getAddressList();
    },
    /**
     * @param {object} options 页面入参
     * @param {string} type = 是否需要选择地址 0:不需要 1:需要
     * @param {string} id = 已有默认选中地址 0:没有 id:下单页已选择地址
     */
    onLoad(options) {
      const { type = 0, id = 0 } = options;
      this.is_change = type;
      this.choose_id = id;
    },
    /**
     * @description 页面出栈
     */
    onUnload() {
      // 如果是选择地址模式
      if (this.is_change == 1) {
        console.log('DDDDDDDDDDDDDD',this.backData)
        // 通知下单页或其他页面当前选择的地址信息
        uni.$emit("select_address", this.backData);
      }
    },
    // 下拉刷新
    onPullDownRefresh() {
      this.getAddressList();
    },
    methods: {
      /**
       * @func 获取地址列表
       */
      getAddressList() {
        this.$api.post(global.apiUrls.get_all_addr,{})
					.then(res => {
						if (res.statusCode == 200 && res.data.code == 0) {
 this.address_list = res.data.data
						} else {
							this.$message.info(res.data.msg)
						}

					})
					.catch(err => {
						console.log("err: ", err);
					})
        // this.address_list = [{name:'张三',mobile:1873897892,province:'河南省',city:'郑州市',district:'二七区',address:'1122小区'}]
      },
      /**
       * @description 切换默认地址
       * @param {object} item = 地址详细信息
       */
      changeStatus(item) {
        if (item.is_default == 0) {
          console.log(item)


          this.$api.post(global.apiUrls.updateDefaultAddress, { address_id: item.address_id })
            .then(res => {
              // 当重新设置默认地址时，之前选择的地址id就不再存在
              this.choose_id = '';
              // 切换默认地址
              this.getAddressList();
            })

        }
      },
      /**
       * @description 地址点击事件
       * @param {object} item = 地址详细信息
       */
      handleClick(item) {
        // 如果是地址选择模式,返回地址对象设为当前选中地址信息,否则不做操作
        if (this.is_change == 1) {
          this.backData = item;
          uni.navigateBack();
        }
      },
      /**
       * @description 去编辑地址
       * @param {object} item = 地址对象
       */
      edit(item) {
        // 记录编辑的地址ID
        this.edit_id = item.id;
        this.add_Addr(item);
      },
      /**
       * @description 删除地址
       * @param {object} item = 地址对象
       * */
      delAddr(item) {
        console.log(item)
        this.$util.showModal({
          title: '提示',
          content: '确定删除该地址?',
          success: (res) => {
            if (res.confirm) {
              this.$api.post(`/users/del_addr/${item.id}`, { })
                .then(res => {
                  console.log(res);
                  if (res.data.code == 0) {
                    this.$message.info(res.data.msg);
                    this.getAddressList()
                  } else {
                    this.$message.info(res.data.msg);
                  }
                });
            }
          }

        })
      },
      /**
       * @description 添加地址
       * @param {object} item = 地址对象
       * */
      add_Addr(item) {
        // 有参数是编辑地址,无参数是新增地址
        uni.navigateTo({
          url: "/pages/user/add-address/index?id=" + ((item && item.address_id) || ""),
        });
      },
      // #ifdef MP-WEIXIN
      /**
       * @description 导入微信地址,只在微信小程序有效
       * */
      importWxAddress() {
        console.log('开始导入微信地址')
        uni.chooseAddress({
          success: res => {
            console.log('微信地址==>', res)
            let data = {
              name: res.userName,
              mobile: res.telNumber,
              is_default: '0',
              address: res.detailInfo,
              province: res.provinceName || res.cityName,
              city: res.cityName,
              district: res.countyName,
            };
            this.addAddress(data);
          },
          fail(err) { }
        });
      },
      addAddress(data) {
        this.$api.post(global.apiUrls.postUserAddressAddAddress, data)
          .then(res => {
            console.log('导入成功', res);
            if (res.statusCode == 200 && res.data.code == 1) {
              this.$message.info('导入成功')
            } else {
              this.$message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log("err: ", err);
          })
      }
      // #endif
    },
  };
</script>

<style lang="scss" scoped>
  .bottom-status {
    height: 156rpx;
    height: calc(156rpx + constant(safe-area-inset-bottom));
    height: calc(156rpx + env(safe-area-inset-bottom));
  }

  .bottom-action {
    position: fixed;
    right: 32rpx;
    left: 32rpx;
    bottom: 56rpx;
    bottom: calc(56rpx + constant(safe-area-inset-bottom));
    bottom: calc(56rpx + env(safe-area-inset-bottom));
    display: flex;

    view {
      height: 88rpx;
      flex: 1;
      line-height: 88rpx;
      text-align: center;
      border-radius: 88rpx;
      color: #FFFFFF;
    }

    .btn1 {
      margin-right: 32rpx;
      background: linear-gradient(126deg, #FA2033 0%, #FF6530 100%);
    }

    .btn2 {
      background: linear-gradient(126deg, #FA2033 0%, #FF6530 100%);
    }
  }

  .active {
    color: #ff6567 !important;
  }
</style>
