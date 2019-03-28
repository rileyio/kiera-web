export type AuditEntryType = '<>'
  | 'discord.message.delete'
  | 'discord.user.join'
  | 'discord.user.leave'
  | 'discord.user.nickname'
  | 'bot.command'
  | 'bot.maintenance'

export type AuditEntryWhere = 'Unknown' | 'Discord' | 'API'

export interface AuditEntry {
  name: string
  details: string
  error: string
  guild: { id: string, name: string, channel?: string }
  owner: string
  runtime: number
  successful: boolean
  timestamp: string
  type: AuditEntryType
  where: AuditEntryWhere
}