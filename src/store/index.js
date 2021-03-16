import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    birth: '',
    headImg: '',
    nickname: '',
    password: '',
    sex: '',
    username: '',
    _id: ''
  },
  //以下凡是方法的除了actions里面的以外，剩下的函数第一参数都为state
  mutations: {
    setState(state, obj) {
      state.birth = obj.birth
      state.headImg = obj.headImg
      state.nickname = obj.nickname
      state.password = obj.password
      state.sex = obj.sex
      state.username = obj.username
      state._id = obj._id
    }
  },
})

export default store