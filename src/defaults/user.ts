import { DiscordGuild } from './guilds';

export interface BotUser {
  _id: string,
  username: string,
  discriminator: string,
  avatar: string,
  guilds: Array<DiscordGuild>
}

export const user: BotUser = {
  _id: '',
  username: '',
  discriminator: '',
  avatar: '',
  guilds: []
}