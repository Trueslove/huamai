import Vue from 'vue';
import Vuex from 'vuex';
import { http } from '../common/api/index';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userInfo: null, // 用户信息

  },
  mutations: {
    // 初始化APP,获取缓存的token,用户信息等其他缓存内容
    initApp(state) {
      const _userInfo = uni.getStorageSync('USER_INFO');
      if (_userInfo) {
        state.userInfo = _userInfo;
        global.userInfo = _userInfo;
        console.log(_userInfo)
        global.token = _userInfo.token;
      }
    },
    // 更新用户信息
    updateUserInfo(state, data) {
      if (state.userInfo) {
        state.userInfo = {
          ...state.userInfo,
          ...data,
        };
      } else {
        state.userInfo = data;
      }
      uni.setStorageSync('USER_INFO', state.userInfo);
      console.log(state.userInfo,11111)
      global.userInfo = state.userInfo;
      if (state.userInfo.token) {
        global.token = state.userInfo.token;
      }
    },

    // 退出登录
    logout(state) {
      state.userInfo = null;
      state.cartList = [];
      global.userInfo = null;
      global.token = null;
      state.verifyAgain = false; // 用户退出时二次验证为false，感觉没必要
      uni.removeStorageSync('USER_INFO');
    },
    // 用户信息
    userInfo(state) {
      if (state.userInfo) {
        return state.userInfo;
      } else {
        return null;
      }
    },
  },
   // 从基本数据(state)派生的数据，相当于state的计算属性
    getters: {
      isLogin(state){
          if (state.userInfo == null) {
              return false;
            } else {
              return true;
            }
          },
          userInfo(state){
            return state.userInfo
          }
    },
  // 和mutation的功能大致相同，不同之处在于 ==》1. Action 提交的是 mutation，而不是直接变更状态。 2. Action 可以包含任意异步操作。
  actions: {
  },
})
export default store;
