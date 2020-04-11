export interface BotStatistics {
  name: string
  uptime: number
  startTimestamp: number

  messages: {
    seen: number
    sent: number
    tracked: number
  }
  commands: {
    routed: number
    completed: number
    invalid: number
  }
  dms: {
    received: number
    sent: number
  }
  users: {
    online: number
    total: number
    registered: number
  }
  servers: {
    total: number
  }
  discordAPICalls: number
}
