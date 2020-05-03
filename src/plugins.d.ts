import Vue from 'vue'
import SessionPlugin from '@/plugins/session'

declare module 'vue/types/vue' {
  interface Vue {
    $session: typeof SessionPlugin
  }

  interface VueConstructor {
    $session: typeof SessionPlugin
  }
}
