import _Vue from 'vue'
import Cookies from 'js-cookie'

export default {
  install(Vue: typeof _Vue, options?: any) {
    Vue.prototype.$session = this
    Vue.$session = this
  },

  setID(value: any) {
    Cookies.set('kiera-discord-id', value, { expires: 7 })
  },

  setWebToken(value: any) {
    Cookies.set('kiera-webToken', value, { expires: 7 })
  },

  getID() {
    return Cookies.get('kiera-discord-id')
  },

  getWebToken() {
    return Cookies.get('kiera-webToken')
  },

  get() {
    return {
      id: this.getID(),
      webToken: this.getWebToken()
    }
  },

  removeID() {
    Cookies.remove('kiera-discord-id')
  },

  removeWebToken() {
    Cookies.remove('kiera-webToken')
  },

  remove() {
    Cookies.remove('kiera-discord-id')
    Cookies.remove('kiera-webToken')
  },

  isSession() {
    return this.getID() && this.getWebToken()
  }
}
