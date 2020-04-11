import { BotStatistics } from '../types/statistics'

export const defaultStats: BotStatistics = {
  name: '',
  uptime: 0,
  startTimestamp: 0,

  messages: {
    seen: 0,
    sent: 0,
    tracked: 0
  },
  commands: {
    routed: 0,
    completed: 0,
    invalid: 0
  },
  dms: {
    received: 0,
    sent: 0
  },
  users: {
    online: 0,
    total: 0,
    registered: 0
  },
  servers: {
    total: 0
  },
  discordAPICalls: 0
}
