## 项目目录结构
+ common
  + api
    + index.js `http请求入口`
    + request.js `http请求封装`
    + url.js `api统一管理文件`
  + filter
    + index.js `全局过滤器`
      + assembleImgSrc `图片路径补全`
      + formatDate `日期格式转换`
      + formatNumber `格式化数字,大于10000时转为1.0w`
      + formatTagNumber `格式化角标数字,大于99时显示99+`
  + monction
    + debounce `防抖函数`
    + deepClone `深度克隆`
    + throttle `节流函数`
    + timeFormat `日期格式化`
    + timeFrom `计算多久以前`
  + mixin
    + index `全局混入`
    + paging_list `上拉加载,下拉刷新,有需要的地方单独混入`
  + utils
    + index.js `公共方法入口文件`
    + message.js `toast弹窗封装`
    + richText.js `富文本解析`
    + router.js `路由跳转方法封装`
    + upload-file-to-oss.js `上传文件到阿里云OSS`
    + upload-file-to-qiniu.js `上传文件到七牛云`
    + upload-image.js `上传图片到服务器`
    + utils.js `常用工具函数`
    + validate.js `常用正则验证`
  + config.js `APP配置文件`
+ components
  + app-update `升级弹窗组件,内置升级逻辑`
  + mo-advert `广告位组件,接受 typeid 参数,与后台配置的广告位对应,支持接受一,二,三张广告图,高度自适应`
  + mo-button `框架内置组件 按钮`
  + mo-custom `自定义头部组件(用法同colorUI自定义头部)`
  + mo-empty `框架内置组件 空布局 需搭配全局混淆的下拉刷新插件使用`
  + mo-empty-ui `空布局组件 纯UI样式`
  + mo-evaluate `商品评价组件 UI样式`
  + mo-filter-dropdown `商品列表 仿京东搜索组件,移到了 goods 分包 内`
  + mo-goods-address `商品详情地址选择组件`
  + mo-goods-block `商品列表双排排布局组件`
  + mo-goods-inline `商品列表单排布局组件`
  + mo-goods-label `商品标签`
  + mo-grid `首页金刚区组件 滑动布局`
  + mo-grid-2 `首页金刚区组件 双排布局`
  + mo-mall-list `积分商城列表 移入了 integral 分包内`
  + mo-loading `loading组件`
  + mo-mask `框架内置组件 遮罩`
  + mo-nologin `首页未登录提示组件`
  + mo-notwork `框架内置组件 断网检测`
  + mo-parse `富文本解析组件 不太好用`
  + mo-pay-keyboard `余额支付输入密码组件`
  + mo-payment-password `密码输入组件`
  + mo-pop-unfinished `返回顶部组件`
  + mo-popup `框架内置组件 弹窗`
  + mo-seckill-count-down `秒杀倒计时组件`
  + mo-share `分享组件`
  + mo-specs-popup `商品详情规格弹窗组件`
  + mo-star `五星好评`
  + mo-swiper `首页轮播图组件`
  + mo-tab `很赞的tab组件`
  + mo-tab-nav `首页分类导航组件`
  + mo-upload `多图上传组件`
  + mo-upload-video `视频上传组件`
  + mo-waterflow `商品推荐组件`
  + jyf-parser `富文本解析组件`
  + keyboard `支付密码组件`
  + uni-badge `数字角标`
  + uni-countdown `倒计时组件`
  + uni-icons `字体图标组件`
  + uni-load-more `加载更多状态组件`
  + uni-number-box `数字输入框`
  + uni-popup `弹窗组件`
  + uni-steps `步骤条`
  + w-picker `地址,时间,日期,选择器`
+ libs `依赖项`
  + day.js `时间格式化插件`
+ nativeplugins `原生插件`
  + BenBen-AliLogin ``
  + BenBen-AliLoginPush ``
  + BenBen-FaceRecognition ``
  + DCloud-RichAlert `快捷方式 当前版本会引起APP闪退,不建议使用`
  + DcloudFaceRecognition ``
+ static `静态资源`
  + empty `空布局组件用到的图片`
  + goods
    + goodsdetail `商品详情页用到的图片`
  + share `分享组件用到的图片`
  + tab `底部Tabbar用到的图片`
  + user `个人中心用到的图片`
+ store
  + index.js ``
+ style
  + animation.css `colorUI的动画样式`
  + common.scss `自定义样式`
  + icon.css `colorUI的图标`
  + iconfont.css `自定义图标`
  + main.css `colorUI的主样式文件`
+ .editorconfig `编辑器配置文件`
+ .gitignore `git忽略文件`
+ App.vue `项目入口文件`
+ main.js `项目启动文件`
+ manifest.json `项目配置文件`
+ pages.json `页面配置文件`
+ uni.scss `内置样式`



## 页面开发规范
+ 页面统一放入`pages`文件夹下
+ 页面路径与命名要和中台系统中工作台展示的的分类路径保持一致
  + 例如: 用户模块(一级分类(user)) -> 登录模块(二级分类(loin)) -> 手机号密码登录(login-password)
  + /pages/user/login/login-password.vue
+ 一级分类下的页面,用到的私有组件(非公共组件),统一放入页面所属一级分类下的components文件夹下
  + 例如: 手机号密码登录页面用到的第三方登录组件
  + /pages/user/components/wx-auth.vue
+ 一级分类下的页面,用到的静态资源(非通用资源),统一放入页面所属一级分类下的static文件夹下,同样static内的目录结构需要和分类下的路径一一对应
  + 例如: 手机号密码登录页用到的logo图标,属于通用资源,其他页面也会用到,所以放入项目根目录下的 static/images 文件下,而背景图是私有的,其他页面用不到,就需要放在 pages/user/static/login/login-password文件夹下
  + 页面内的data定义的变量,props传递的参数,methods内的方法需要写明注释
  + 开发完页面至少要保证APP端和小程序端的兼容性
    + 小程序胶囊按钮适配
    + iphoneX底部适配
    + ...

## 组件开发规范
+ 公共组件统一放入`components`文件夹下
+ 组件中使用的静态资源统一放入`static`文件夹下
+ 组件中一定要写说明文档,包含作者,说明,接收参数,使用示例等,具体参考`mo-button`组件

## 编码规范
+ 变量
	+ 使用驼峰命名法
	+ 所有变量都应有注释,多态变量要有详细说明
	+ example
```js
data(){
  return {
    id: '896', // 商品ID,数据从哪来,数据类型
    type: 0, // 0: 普通商品 1: 秒杀商品 2: 拼团商品
  }
}
```
+ 常量
	+ 全部大写
	+ 使用下划线链接
+ 方法
	+ 使用驼峰命名
	+ 每个方法都应有注释,使用文档注释类型,复杂函数内部须有逻辑判断注释,详细说明处理步骤
	+ example
```js
methods: {
	/**
	 * @description 测试函数,演示代码注释规范
	 * @param {string} type = 测试类型
	 * @param {string} id = 测试ID
   *
	 * */
	test(type,id){
    /**
     * @description 根据类型做不同操作
     * @param {string} type = 测试类型
     * */
    switch(type){
      case 0:
        // 未付款状态
        // 允许 取消订单操作
        // 允许 去支付操作
        // 修改支付按钮显示状态
        this.showBtn = true;
      break;
      case 1:
        // 已付款状态
        // 允许 申请售后操作
        // 允许 提醒发货操作
      break;
      case 2:
        // 已发货状态
        // 允许 申请售后操作
        // 允许 确认售后操作
      break;
    }
	},
}
```
