<template>
	<view class="page">
		  <!-- topbar -->
		  <mo-custom :isBack="true" bgColor="bg-white">
			<view slot="content">{{adressText}}</view>
		  </mo-custom>
		<!-- 表单信息 start -->
		<view class="addAddr">
			<view class="cell">
				<text class="title">收货人</text>
				<input type="text" maxlength="8" v-model="name" placeholder-class="placeholderClass"
					placeholder="收货人" />
				<view class="flex">
				</view>
			</view>
			<view class="cell">
				<text class="title">手机号</text>
				<input type="number" maxlength="11" v-model="phone" placeholder-class="placeholderClass"
					placeholder="手机号" />
				<text v-if="phone.length > 0" class="margin-right cuIcon-close" @click="clear"
					style="font-size: 36rpx;color:#999;"></text>
			</view>
			<view class="cell">
				<text class="title">所在地区</text>
				<view class="flex flex-sub">
					<input class="flex-sub" type="text" disabled v-model="address" placeholder="请选择省市区县、乡镇"
						@click="showMulLinkageThreePicker" />
				</view>
			</view>
			<view class="cell">
				<textarea class="text-area" type="text" v-model="addressDesc" maxlength="50"
					placeholder="请输入详细地址：如道路、门牌号、小区、楼栋号等" />
			</view>
            <!-- <view class="cell">
				<text class="title">邮政编码</text>
				<input type="text" maxlength="8" v-model="codeName" placeholder-class="placeholderClass"
					placeholder="邮政编码" />
				<view class="flex">
				</view>
			</view> -->
			<!-- <view class="flex justify-between cell margin-top">
				<view class="">设置默认地址</view>
				<switch :class="is_default ? 'theme' : ''" @change="handleSwitch"
					:checked="is_default ? true : false"></switch>
			</view> -->
		</view>
		<!-- 表单信息 end -->
		<!-- 底部占位 start -->
		<view class="bottom-status"></view>
		<!-- 底部占位 end -->
		<!-- 提交按钮 start -->
		<view class="bottom-action">
			<view class="btn2" @click="sub_sure">保存</view>
		</view>
		<!-- 提交按钮 end -->
		<!-- 地址选择插件 start -->
		<w-picker mode="region" default-type="value" @confirm="onConfirm($event)" ref="region"></w-picker>
		<!-- 地址选择插件 end -->
		<!-- 断网监测 start -->
		<mo-notwork></mo-notwork>
		<!-- 断网监测 end -->
	</view>
</template>

<script>
	export default {
		computed: {
			// 合并省市区信息字段
			address() {
				return this.province + this.city + this.district;
			},
		},
		data() {
			return {
				provinceCode: '', // 省 code码
				cityCode: '', //市 code码
				districtCode: '', //区 code码
				adressText:'新增收货地址',   // navbar
				copyInfo: '',   // 复制需要自动识别的地址信息
				keyboardheight: 0, // 键盘高度
				serveKeyword: '', // 服务标签关键字
				serve_show: false, // 服务标签弹框
				serveList: [], // 服务标签
				default_serve: {}, // 默认服务标签
				phone: '', // 手机号
				name: '', // 收货人
				sex: 0, // 性别 0:男 1:女
				is_default: true, // 是否设为默认地址
				edit_id: null, // 是否是修改收货地址
				myAmapFun: null, // 高德地图实例
				province: '', // 省
				city: '', //市
				district: '', //区
				addressDesc: '', // 详细地址
				customStyle: {
					'backgroundColor': '#cccccc',
					'color': '#ffffff',
				},// 自定义按钮样式
                // codeName:'',
			};
		},
		/**
		 * @description 页面入参
		 * @param {object} options = [id]
		 * @param {string} id = 修改的地址ID
		 */
		onLoad(options) {
			//如果是修改地址
			if (options.id) {
				this.edit_id = options.id;
				// 换标题文字
				// uni.setNavigationBarTitle({
				// 	title: '编辑收货地址'
				// });
				this.adressText = '编辑收货地址'
				// 获取要修改的地址信息
				this.get_editAddress();
			} else {
			}
		},
		methods: {
			/**
			 * @func 获取修改地址信息
			 */
			get_editAddress() {
				this.$api.post(global.apiUrls.postUserAddressGetOneAddress, {
					address_id: this.edit_id
				}).then(res => {
					console.log(res, '修改的信息');
					if (res.data.code == 1) {
						let data = res.data.data;
						this.name = data.name; // 收货人
						this.phone = data.mobile; // 收货人电话
						this.province = data.province; // 省
						this.city = data.city; // 市
						this.district = data.district; // 区
						this.addressDesc = data.address; // 详细地址
						this.is_default = data.is_default == '1' ? true : false; // 是否默认
						this.sex = data.sex; // 性别
						// 服务标签
						this.getLabelData(data.label_name)

					} else {
						this.$message.info(res.data.msg);
					}
				}).catch(err => {
					this.$message.info(err.msg);
				})
			},
			/**
			 * @func 显示地址选择弹窗
			 */
			showMulLinkageThreePicker() {
				uni.hideKeyboard();
				this.$refs.region.show();
			},
			/**
			 * @description 地址选择回调
			 * @param {Object} val = 地址信息对象
			 */
			onConfirm(val) {
				this.province = val.obj.province.label;
				this.city = val.obj.city.label;
				this.district = val.obj.area.label;
				this.provinceCode = val.value[0];
				this.cityCode = val.value[1];
				this.districtCode = val.value[2];
			},
			/**
			 * @func 切换是否为默认地址
			 */
			handleSwitch() {
				this.is_default = !this.is_default
			},
			/**
			 * @func 定位地址
			 */
			location() {
				let _this = this;
				//#ifdef MP-WEIXIN
				uni.getSetting({
					success(res) {
						// 获取设置成功
						console.log(res.authSetting);
						if (!res.authSetting.userLocation) {
							// 如果没开启权限提示打开
							uni.openSetting({
								success(res) {
									// 打开成功，提示获取权限
									console.log(res.authSetting);
									uni.authorize({
										scope: 'scope.userLocation',
										success(res) {
											_this.chooseLocation();
										},
										fail(res) {
											console.log(res);
											this.$message.info('打开权限失败');
										}
									});
								}
							});
						} else {
							_this.chooseLocation();
						}
					}
				});
				//#endif
				this.chooseLocation();
			},
			/**
			 * @func 地图选点
			 */
			chooseLocation() {
				uni.chooseLocation({
					success: (res) => {
						console.log(res, '地图');
						this.myAmapFun.getRegeo({
							location: res.longitude + ',' + res.latitude,
							success: (data) => {
								//成功回调
								console.log('sdk回调', data);
								let regeoData = data[0].regeocodeData.addressComponent;
								this.province = regeoData.province;
								this.city = Array.isArray(regeoData.city) && (regeoData.city.length == 0) ? regeoData.province : regeoData.city;
								this.district = regeoData.district;
								this.addressDesc = res.address + res.name;
								let pcd = this.filterAddress(this.province,this.city) + this.district;
								this.addressDesc = this.addressDesc.replace(pcd,'');
								this.provinceCode = regeoData.adcode.substr(0,2)+'0000';
								this.cityCode = regeoData.adcode.substr(0,4)+'00';
								this.districtCode = regeoData.adcode+'';
								console.log('地图选点',this.addressDesc);
							},
							fail: (info) => {
								//失败回调
								console.log(info)
							}
						})
					}
				})
			},
			/**
			 * @author dengdongfang
			 * @date 2021-5-21
			 * @description 过滤直辖市重复问题
			 * @param {String} province-省  city-市
			 */
			filterAddress(province,city){
				let str = province + city;
				if(province == city){
					str = province;
				}
				return str;
			},
			/**
			 * @func 自动定位
			 */
			autoGetLocation() {
				console.log("auto ")
				uni.getLocation({
					geocode: true,
					success: (adr) => {
						console.log(adr)
						// #ifdef APP-PLUS
						let address = adr.address;
						this.province = address.province;
						this.city = Array.isArray(address.city) && (address.city.length == 0) ? address.province : address.city;
						this.district = address.district;
						this.addressDesc = address.street + address.streetNum + address.poiName;
						// #endif
						// #ifndef APP-PLUS
						this.myAmapFun.getRegeo({
							location: adr.longitude + ',' + adr.latitude,
							success: (data) => {
								//成功回调
								console.log('sdk回调', data);
								let regeoData = data[0].regeocodeData.addressComponent;
								this.province = regeoData.province;
								this.city = Array.isArray(regeoData.city) && (regeoData.city.length == 0) ? regeoData.province : regeoData.city;
								this.district = regeoData.district;
								this.addressDesc = data[0].desc;
								this.provinceCode = regeoData.adcode.substr(0,2)+'0000';
								this.cityCode = regeoData.adcode.substr(0,4)+'00';
								this.districtCode = regeoData.adcode+'';
								console.log(this.province + this.city + this.district + this.addressDesc);
							},
							fail: (info) => {
								//失败回调
								console.log(info)
							}
						})
						// #endif
					}
				})
			},
			/**
			 * @func 提交表单
			 */
			sub_sure() {
				// 表单验证
				if (this.name.trim() == '') {
					this.$message.info('请输入收货人');
					this.name = '';
					return false;
				};
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
					let text = !this.phone ? '请输入手机号' : '手机号格式不正确';
					this.$message.info(text);
					return false;
				}
				if (this.address.trim() == '') {
					this.$message.info('地区不能为空');
					return false;
				}
				if (this.addressDesc.trim() == '') {
					this.$message.info('详细地址不能为空');
					this.addressDesc = '';
					return false;
				}
			
				let data = {
					name: this.name, // 收货人姓名
					addphoner: this.phone, // 收货人手机
					addr: this.addressDesc, // 详细地址
					province: this.province, // 省
					city: this.city, // 市
					county: this.district, // 区
				}
				console.log(data)
				// 判断提交的接口
				// 提交请求
				this.$api.post(global.apiUrls.get_add_addr, data)
					.then(res => {
						console.log(res, '添加/编辑成功');
						if (res.statusCode == 200 && res.data.code == 0) {
								this.$message.info('保存成功')
								setTimeout(() => {
									uni.navigateBack()
								}, 800);

						} else {
							this.$message.info(res.data.msg)
						}

					})
					.catch(err => {
						console.log("err: ", err);
					})
			},
			/**
			 * @func 删除地址
			 */
			delAddr() {
				let address_id = this.edit_id;
				this.$util.showModal({
					content: '是否删除该地址',
					success: (res) => {
						if (res.confirm) {
							this.$api.post(global.apiUrls.postUserAddressDelAddress, { address_ids: address_id })
								.then(res => {
									console.log(res);
									if (res.data.code == 1) {
										uni.navigateBack();
									} else {
										this.$message.info(res.msg);
									}
								});
						}
					}

				})
			},
			/**
			 * @func 清除手机号
			 */
			clear() {
				this.phone = '';
			}
		}
	}
</script>
<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background: #FFFFFF;
	}

	.bottom-status {
		height: 156rpx;
		height: calc(156rpx + constant(safe-area-inset-bottom));
		height: calc(156rpx + env(safe-area-inset-bottom));
	}

	.text-area {
		width: 100%;
		height: 160rpx !important;
		background-color: #F6F6F6;
		padding: 20rpx;
		border-radius: 8rpx;
	}

	.addAddr {
		padding: 0 20upx;

		.uni-list-cell {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin: 20upx 0;
			box-sizing: border-box;
			height: 100upx;
			font-size: 30upx;
			background: #fff;
		}

		.addr {
			font-size: 32upx;
			padding: 30upx 0;
			border-bottom: 1px solid #f5f5f7;
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;

			.addr_title {
				display: inline-block;
				width: 180rpx;
			}

			.chose_addr {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				width: 70%;
			}
		}

		.cell {
			font-size: 32upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 32rpx 0;
			border-bottom: 1px solid #f5f5f7;

			.title {
				display: inline-block;
				width: 180rpx;
			}

			input {
				flex: 1;
				color: #999999;
			}

			.text-area {
				flex: 1;
			}
		}

		.address {
			display: flex;
			flex-direction: column;
			font-size: 32upx;

			.title {
				line-height: 110upx;
			}
		}

		.tips {
			padding: 20upx 0;
			font-size: 26upx;
		}
	}

	.placeholderClass {
		font-size: 32rpx;
		color: #BFBFBF;
	}

	.active {
		color: #ff6567 !important;
	}

	switch::before,
	switch::after {
		content: "";
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

		.btn2 {
			background: $bgtheme;
		}
	}

	/deep/ uni-switch.theme .uni-switch-input {
		background-color: $theme !important;
		border-color: $theme !important;
		color: #ffffff !important;
	}

	.serve-pop {
		height: 100rpx;
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #FFFFFF;

		input {
			margin-left: 32rpx;
			width: 528rpx;
			height: 66rpx;
			background: #F6F7F9;
			opacity: 1;
			border-radius: 35rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #99999A;
			text-indent: 1em;
		}

		button {
			width: 140rpx;
			height: 66rpx;
			background: #FF9D00;
			border-radius: 33rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #FFFFFF;
		}
	}

	.left-0 {
		margin-left: 2rpx;
	}

	.radius-left {
		border-top-left-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
	}

	.radius-right {
		border-top-right-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
	}

	.cell2 {
		font-size: 32upx;
		align-items: center;
		padding: 32rpx 0;
		border-bottom: 1px solid #f5f5f7;

		.btn-copy {
			overflow: hidden;

			button {
				width: 130rpx;
				height: 56rpx;
				background: #FF6464;
				border-radius: 28rpx;
				color: #fff;
				font-size: 24rpx;
				float: right;
			}
		}
	}
</style>
