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

  setSessionToken(value: any) {
    Cookies.set('kiera-sessionToken', value, { expires: 7 })
  },

  getID() {
    return Cookies.get('kiera-discord-id')
  },

  getSessionToken() {
    return Cookies.get('kiera-sessionToken')
  },

  get() {
    const session = {
      userID: this.getID(),
      session: this.getSessionToken()
    }

    if (session.session && session.userID) return session
    return null
  },

  removeID() {
    Cookies.remove('kiera-discord-id')
  },

  removeSessionToken() {
    Cookies.remove('kiera-sessionToken')
  },

  remove() {
    Cookies.remove('kiera-discord-id')
    Cookies.remove('kiera-sessionToken')
  },

  isSession() {
    return this.getID() !== undefined && this.getSessionToken() !== undefined
  }
}
