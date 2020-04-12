import { user } from '@/defaults/user'
import { mappedGuilds } from '@/defaults/guilds'
import { state } from '@/defaults/app-state'

export const bot = {
  webToken: '',
  user: user,
  guilds: mappedGuilds,
  stats: state
}
