<template>
	<view class="page">
           <mo-custom isBack="true" :isBottom="true" bgColor="bg-white">
      <view slot="content">兑换商品</view>
    </mo-custom>
		<!-- 地址 -->
		<view class="address address_1" @click="chooseAddress" :class="addressData ? 'bg' : ''">
			<block v-if="addressData">
				<image class="head" v-if="addressData" src="../static/address.png" mode="widthFix"></image>
				<!-- 没有头像时 做占位符 -->
				<view class="head" v-else></view>
				<!-- 配送地址 -->
				<view class="address-box" >
					<view class="p1">
						<view class="label" v-if="addressData.label_name">{{ addressData.label_name }}</view>
						<view class="text1 text-cut">
						{{ addressData.name }} 
						</view>
						<view class="text2 text22">{{ addressData && addressData.phone  }}</view>
					</view>
					<view class="p2">{{ addressData.province }}{{ addressData.city }}{{ addressData.county }}{{ addressData.addr }}</view>
				</view>
					<image class="to-icon" src="../static/right.png" mode=""></image>
			</block>
			<block v-else>
				<view class="flex justify-center align-center address-empty">
				<image class="address-img" src="../static/address.png" mode="widthFix"></image>
				<view class="no-address">添加收货地址</view>
				</view>
			</block>
			
		</view>
        <view class="goods-list">
				<view class="goods-info">
					<view class="goods-box">
        <view class="good-item" >
							<view class="img-box">
								<image :src="baseImgUrl + img" mode="widthFix"></image>
							</view>
							<view class="right-info">
								<view>
									<view class="title">{{ goods_name }}</view>
								</view>
								<view class="price-box">
									<view class="price">
										<text class="small">￥</text>
										{{price  }}
									</view>
								</view>
							</view>
						</view>
                        	</view>
							</view>
						</view>
		<!-- 地址 end -->
        <view class="bottom-action">
			<view class="btn2" @click="beforeSubmit">确定</view>
		</view>
		<!-- 底部总计和按钮
		<view class="footer-bottom">
			<view class="footer-box">
				<view class="right" @click="beforeSubmit">确定</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
                baseImgUrl: global.IMG_BASE_URL,
			img:'',
            goods_name:'',
            price:'',
            id:'',
				addressData: null, //地址信息
				
			};
		},
		filters: {
			/**
			 * @description 手机号过滤中间四位用*代替
			 * @param {Number,String} val 手机号
			 */
			// filterMobile(val) {
            //     console.log(val)
			// 	if (!val) return '';
			// 	return val.substr(0, 3) + '****' + val.substr(-4);
			// }
		},
		/**
		 * @description onload接收参数
		 * @param {Object} options 入参
		 */
		onLoad(options) {
            this.goods_name =options.goods_name
            this.img = options.img
            this.price =options.price
            this.id =options.id
			console.log('create order options', options);
			// 地址id
			if (options.address_id) {
				this.addressData = {
					address_id: options.address_id
				};
			}
			// 监听地址页重新选择地址后，更新地址id

			// 接收选择地址信息
			uni.$on('select_address', data => {
				console.log('select_address', data);
				this.addressData = data;
			
			});
		
		},
		onUnload() {
		
		},
		computed: {
		},
		methods: {
			
			/**
			 * @description 选择地址
			 */
			chooseAddress() {
				this.$urouter.navigateTo({
					url: '/pages/user/address-list/index',
					params: {
						type: 1,
						id: (this.addressData && this.addressData.address_id) || 0
					}
				});
			},
			/**
			 * @description 提交订单之前验证
			 */
			beforeSubmit() {
				// 地址是否存在
				if (!this.addressData) return this.$message.info('请选择可用收货地址');
					this.$util.throttle(this.handleSubmit, 200, true);
			},
			/**
			 * @description 确认订单 下单
			 */
			handleSubmit() {
				console.log(this.addressData.id,this.id)
                let data = {
                    goodsdb_id:this.id,
                    addr_id:this.addressData.id
                }
                this.$api.post(global.apiUrls.get_splq, data)
					.then(res => {
						if (res.statusCode == 200 && res.data.code == 0) {
								this.$message.info('操作成功')
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
		},
	
	};
</script>

<style lang="scss" scoped>
	.page {
		padding-bottom: 10rpx;
	}

	// 地址
	.address {
  .head {
    margin-left: 48rpx;
    display: block;
    width: 60rpx;
    height: 60rpx;
    flex-shrink: 0;
    border-radius: 50%;
  }

  .address-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 497rpx;
    flex-shrink: 0;

    .p1 {
      display: flex;
      align-items: center;

      .label {
        /* width: 56rpx; */
        padding: 0 10rpx;
        // height: 32rpx;
        background: rgba(105, 139, 255, 0.08);
        border: 1px solid #698bff;
        opacity: 1;
        border-radius: 8rpx;
        text-align: center;
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 32rpx;
        color: #698bff;
        opacity: 1;
        flex-shrink: 0;
      }

      .text1 {
        margin-left: 16rpx;
        font-size: 32rpx;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 34rpx;
        color: #333333;
        opacity: 1;
      }

      .text2 {
        margin-left: 32rpx;
        font-size: 32rpx;
        font-family: Lato;
        font-weight: 500;
        line-height: 34rpx;
        color: #333333;
        opacity: 1;
        flex-shrink: 0;
      }
    }

    .p2 {
      margin-top: 16rpx;
      font-size: 28rpx;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 40rpx;
      color: #666666;
      opacity: 1;
      //两行溢出隐藏
      white-space: normal;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .no-address {
      color: #999;
      font-size: 24rpx;
    }
  }

  .to-icon {
    margin-right: 64rpx;
    display: block;
    width: 12rpx;
    height: 22rpx;
    flex-shrink: 0;
  }
}

	.order-info {
		margin: 24rpx 0 0;
		margin-bottom: 122rpx;
		// width: 702rpx;
		overflow: hidden;
		background: #ffffff;
		opacity: 1;
		border-radius: 24rpx;

		.info-box {
			width: 654rpx;
			margin: 0 auto;
			overflow: hidden;
			margin-bottom: 40rpx;

			.info-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 40rpx;

				.item-left-ipt {
					width: 100%;
				}

				.item-left {
					display: flex;
					align-items: center;

					// 商品总额 优惠券 运费
					.text {
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 500;
						line-height: 42rpx;
						color: #333333;
						opacity: 1;
					}

					// 全场满88免运费
					.text2 {
						margin-left: 32rpx;
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 400;
						line-height: 42rpx;
						color: #bfbfbf;
						opacity: 1;
					}

					.ipt {
						padding-left: 32rpx;
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 400;
						line-height: 42rpx;
						color: #bfbfbf;
						opacity: 1;
						width: 90%;
					}
				}

				.item-right {
					display: flex;
					align-items: center;

					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					line-height: 42rpx;
					color: #333333;
					opacity: 1;

					.coupon-text {
						margin-right: 16rpx;
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 400;
						line-height: 42rpx;
						color: #bfbfbf;
						opacity: 1;
					}


					.icon {
						display: block;
						width: 12rpx;
						height: 24rpx;
						flex-shrink: 0;
					}
				}
			}
		}
	}

	.goods-info {
		margin: 24rpx 0 0;

		// width: 702rpx;
		overflow: hidden;
		background: #ffffff;
		opacity: 1;
		border-radius: 16rpx;

		.goods-box {
			position: relative;
			width: 686rpx;
			margin: 0 auto;
			overflow: hidden;
			border-bottom: 1px solid #eeeeee;
			opacity: 1;
			padding-bottom: 32rpx;
			height: auto;

			.good-item {
				width: 686rpx;
				height: 200rpx;
				margin: 0 auto;
				display: flex;
				align-items: center;
				margin-top: 32rpx;

				.img-box {
					width: 150rpx;
					height: 150rpx;
					flex-shrink: 0;
					position: relative;
					border-radius: 16rpx;
					overflow: hidden;

					.img {
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translateX(-50%) translateY(-50%);
						width: 200rpx;
					}
				}

				.right-info {
					width: 462rpx;
					height: 150rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
                    margin-left: 30rpx;
					.title {
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 500;
						line-height: 42rpx;
						color: #333333;
						opacity: 1;
						//两行溢出隐藏
						white-space: normal;
						word-break: break-all;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}

					.sku {
						margin-top: 8rpx;
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 400;
						line-height: 33rpx;
						color: #999999;
						opacity: 1;
						//单行溢出隐藏
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						word-break: break-all;
					}

					.price-box {
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;

						.price {
							font-size: 32rpx;
							font-family: Oswald;
							font-weight: 500;
							line-height: 36rpx;

							.small {
								font-size: 22rpx;
							}
						}

						.num {
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 400;
							line-height: 33rpx;
							color: #999999;
							opacity: 1;
						}
					}
				}
			}
		}

		.info-box {
			width: 654rpx;
			margin: 0 auto;
			overflow: hidden;

			.info-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 32rpx;

				.item-left-ipt {
					width: 100%;
				}

				.item-left {
					display: flex;
					align-items: center;

					// 商品总额 优惠券 运费
					.text {
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 500;
						line-height: 42rpx;
						color: #333333;
						opacity: 1;
					}

					// 全场满88免运费
					.text2 {
						margin-left: 32rpx;
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 400;
						line-height: 42rpx;
						color: #bfbfbf;
						opacity: 1;
					}

					.ipt {
						padding-left: 32rpx;
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 400;
						line-height: 42rpx;
						color: #bfbfbf;
						opacity: 1;
						width: 90%;
					}
				}

				.item-right {
					display: flex;
					align-items: center;

					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					line-height: 42rpx;
					color: #333333;
					opacity: 1;

					

					.icon {
						display: block;
						width: 12rpx;
						height: 24rpx;
						flex-shrink: 0;
					}
				}
			}
		}

		.info-footer {
			width: 654rpx;
			margin: 45rpx auto 32rpx;
			overflow: hidden;
			display: flex;
			justify-content: flex-end;

			.text1 {
				margin-right: 8rpx;
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				line-height: 42rpx;
				color: #666666;
				opacity: 1;
			}

			.text2 {
				font-size: 32rpx;
				font-family: Oswald;
				font-weight: 500;
				line-height: 36rpx;
				color: #fa2033;
				opacity: 1;

				.small {
					font-size: 22rpx;
				}
			}
		}
	}

	// 底部总计和按钮
	.footer-bottom {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #FFFFFF;
		box-shadow: 0 0 10rpx 10rpx #EEEEEE;
		z-index: 99;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.footer-box {
		height: 90rpx;
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.left {
			display: flex;
			align-items: center;
			margin-left: 32rpx;

			.text1 {
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 400;
				line-height: 32rpx;
				color: #1a1a1a;
				opacity: 1;
			}

			.text2 {
				font-size: 32rpx;
				font-family: Oswald;
				font-weight: 500;
				line-height: 36rpx;
				color: #fa2033;
				opacity: 1;

				.small {
					font-size: 22rpx;
				}
			}
		}

		.right {
			width: 280rpx;
			// height: 90rpx;
			background: linear-gradient(126deg, #fa2033 0%, #ff6530 100%);
			opacity: 1;
			text-align: center;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: 500;
			line-height: 90rpx;
			color: #ffffff;
			opacity: 1;
		}
	}



	.coupon-popup-content {
  z-index: 100;
  background: linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%);
  .coupon-wrap {
    padding: 0 24rpx;
    box-sizing: border-box;
    .coupon {
      margin-bottom: 24rpx;
      border-radius: 16rpx;
      overflow: hidden;
      height: 200rpx;
      .left {
        width: 196rpx;
        flex-shrink: 0;
        background: #ff6464;
        color: #ffffff;
        .money {
          font-size: 56rpx;
          font-weight: 800;
          line-height: 78rpx;
        }
      }
      .center {
        padding: 0 32rpx;
        box-sizing: border-box;
        background: #ffffff;
        width: calc(100% - 196rpx - 52rpx);
      }
      ._right {
        width: 52rpx;
        line-height: 52rpx;
        background: #ff6464;
        font-size: 24rpx;
        font-weight: 400;
        color: #ffffff;
        text-align: center;
        writing-mode: tb-rl;
        letter-spacing: 10rpx;
      }
    }
  }
}

	/* 店铺 */
	.merchant-title {
		margin-top: 30rpx;
	}

	.merchant-icon {
		width: 30rpx;
		height: 28rpx;
		// margin-left: 11rpx;
		margin-right: 8rpx;
		top: 2rpx;
	}

	.merchant-icon-left {
		margin-left: 16rpx;
		font-size: 24rpx;
	}

	// 积分弹框 start
	.model-notice-box {
		width: 550rpx;

		.header {
			padding: 40rpx;
			height: 50rpx;
			line-height: 50rpx;
			text-align: center;
		}

		.content {
			margin-top: 20rpx;
			width: 90%;
			margin-left: 5%;

			.height-100 {
				line-height: 40rpx;
			}
		}

		.bottom_content {
			margin: 30rpx 0;
			text-align: center;
			width: 200rpx;
			background: linear-gradient(270deg, rgba(249, 34, 19, 1) 0%, rgba(255, 70, 14, 0.8) 100%);
		}
	}

	// 积分弹框 end
	/deep/ uni-switch.checked-green .uni-switch-input {
		background-color: #39b54a !important;
		border-color: #39b54a !important;
		color: #ffffff !important;
	}


	.footer-yy {
		margin: 30rpx 0;
		width: 100%;

		button {
			width: 90%;
			background-color: $mo-main-color !important;
		}
	}


	.width-name{
		width: 400rpx;
	}
	.address-empty {
  width: 100%;
  .address-img {
    width: 60rpx;
    height: 60rpx;
    margin-right: 24rpx;
  }
  .no-address {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
  }
}
.address_1 {
  margin: 20rpx 0 0;
//   width: 702rpx;
	padding: 36rpx 0; 
  opacity: 1;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  &.bg {
	 padding: 44rpx 0 30rpx;
    background: #fff
      url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAKBAMAAACOO0tGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURf///4u16Oxtbezz/J3B7NDh9vSmprjS8vGNjfjDw/vd3f7w8O57e0EOI68AAABSSURBVCjPY2CAAE4l7GACVJ4hUBArEIXJL8KuXw0mz4xdv2ABVJ77EHYDGmAGmGDXLwKT58CuX2cDTIEjdgOcYfJJ2A3Qgsmz4/CBwWgQUiMIAXzCOFELLk/nAAAAAElFTkSuQmCC) -7px
      bottom repeat-x;
    background-size: 90rpx 6rpx;
  }
}
.freight-text{
	margin-right: 16rpx;
	color:#333;
	font-size: 28rpx;
	font-family: PingFang SC;
}
.invoice-text{
	margin-right: 16rpx;
	color:#bfbfbf;
	font-size: 28rpx;
	font-family: PingFang SC;
	font-weight: 400;
}
.couponTitle {
  .image {
    width: 32rpx;
    height: 10rpx;
  }
}
.coupon-item {
  height: 45rpx;
  font-size: 32rpx;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 42rpx;
  color: #333333;
  padding: 0 32rpx;
  box-sizing: border-box;
  margin-bottom: 40rpx;
  &:last-child {
    margin-bottom: 96rpx;
  }
}
.coupon-wrap-scroll {
  max-height: 520rpx;
  overflow: auto;
}
.max-520 {
  max-height: 520rpx;
}
.freight-popup-content {
  position: relative;
  padding-bottom: 156rpx;
  padding-bottom: calc(156rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(156rpx + env(safe-area-inset-bottom));
  .freight-title {
    padding-left: 32rpx;
    // width: 128px;
    // height: 45px;
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
  }
  .freight-text-title{
    padding: 0 32rpx;
    box-sizing: border-box;
  }
  .freight-text {
    padding: 16rpx 32rpx 0rpx 32rpx;
    // width: 686px;
    // height: 209px;
    font-size: 28rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #666666;
  }

  .freight-btn {
    width: 750rpx;
    height: 100rpx;
    background: $bgtheme;
    text-align: center;
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 100rpx;
    color: #ffffff;
  }

  .top-box {
    position: relative;
    padding-top: 40rpx;

    .icon-title {
      width: 32rpx;
      height: 10rpx;
    }

    .title {
      font-size: 36rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #333333;
      margin-left: 24rpx;
      margin-right: 24rpx;
    }

    .icon-close {
      position: absolute;
      right: 32rpx;
      top: 50rpx;
      height: 28rpx;
      width: 28rpx;
    }
  }
  .freight-submit-btn{
    width: 100%;
    height: 100rpx;
    background: #F8F8F8;
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 100rpx;
    color: #333333;
    text-align: center;
    position: absolute;
    bottom: 0;
    bottom: calc(0rpx + constant(safe-area-inset-bottom));
    bottom: calc(0rpx + env(safe-area-inset-bottom));
    left: 0;
  }
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

</style>
