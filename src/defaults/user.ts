import { DiscordGuild } from './guilds'

export interface BotUser {
  _id: string
  userID: string
  username: string
  discriminator: string
  avatar: string
  guilds: Array<DiscordGuild>
  ChastiKey: BotUserServiceChastiKey
}

export interface BotUserService {
  username: string
}

export interface BotUserServiceChastiKey extends BotUserService {
  ticker: {
    date: string
    type: number
    showStarRatingScore: boolean
  }
}

export const user: BotUser = {
  _id: '',
  userID: '',
  username: '',
  discriminator: '',
  avatar: '',
  guilds: [],
  ChastiKey: {
    username: '',
    ticker: {
      date: '',
      type: 2,
      showStarRatingScore: false
    }
  }
}
