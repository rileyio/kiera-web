import { DiscordGuild } from './guilds';

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
  isGuildOwner: false
}

