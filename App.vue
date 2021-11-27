<script>
import Vue from 'vue';
export default {
  onLaunch: function() {
     this.$store.commit('initApp');
    uni.getSystemInfo({
      success: function(e) {
        // #ifndef MP
        Vue.prototype.StatusBar = e.statusBarHeight;
        if (e.platform == 'android') {
          Vue.prototype.CustomBar = e.statusBarHeight + 50;
        } else {
          Vue.prototype.CustomBar = e.statusBarHeight + 45;
        }
        // #endif
        // #ifdef MP-WEIXIN
        Vue.prototype.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        Vue.prototype.Custom = custom;
        Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        // #endif
        // #ifdef MP-ALIPAY
        Vue.prototype.StatusBar = e.statusBarHeight;
        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
        // #endif
        Vue.mixin({
          data() {
            return {
              StatusBar: Vue.prototype.StatusBar,
              CustomBar: Vue.prototype.CustomBar
            };
          }
        });
      }
    });
  },
  onShow: function() {
    console.log('APP Show');
  },
  onHide: function() {
    console.log('APP Hide');
  },
  methods: {

  }
};
</script>

<style lang="scss">
/* #ifndef APP-PLUS-NVUE */
@import './style/icon.css';
@import './style/main.css'; 
@import './style/animation.css';
@import './style/iconfont.css';
@import './style/common.scss';
/* #endif */
</style>
