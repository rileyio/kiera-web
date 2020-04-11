import { DiscordGuild } from './guilds'

export const backgrounds: Array<string> = ['abstract-art-590697', 'abstract-art-1252890', 'abstract-art-1629236']

export const focusedGuild: DiscordGuild = {
  icon: '',
  id: '',
  name: '',
  owner: false,
  permissions: 0
}

export const state = {
  // Connectivity
  isConnected: false,
  isConnecting: true,
  isLoggedIn: false,
  // Panel in focus
  focusedPanel: 'WelcomePanel',
  focusedView: '',
  // Server in focus
  focusedGuildId: '',
  focusedGuild: focusedGuild,
  isGuildOwner: false,
  // Style related
  randomBG: backgrounds[Math.floor(Math.random() * backgrounds.length)]
}
