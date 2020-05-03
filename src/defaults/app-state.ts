import { user } from '@/defaults/user'
import { mappedGuilds } from '@/defaults/guilds'
import { defaultStats } from '@/defaults/bot-statistics'
import { DiscordGuild } from './guilds'

// Random Background
export const Backgrounds: Array<string> = ['abstract-art-590697', 'abstract-art-1252890', 'abstract-art-1629236']

// App State
export const AppState = {
  user: user, // User logged in
  guilds: mappedGuilds, // User guilds fetched at login
  stats: defaultStats, // Sets default stats until provided by socket
  state: {
    // Connectivity
    isConnected: false,
    isConnecting: true,
    isLoggedIn: false,
    // Style related
    randomBG: Backgrounds[Math.floor(Math.random() * Backgrounds.length)]
  }
}

export const focusedGuild: DiscordGuild = {
  icon: '',
  id: '',
  name: '',
  owner: false,
  permissions: 0
}
