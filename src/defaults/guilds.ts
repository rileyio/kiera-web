export interface DiscordGuild {
  icon: string
  id: string
  name: string
  owner: boolean
  permissions: number
}

export const mappedGuilds = [
  {
    label: '⭐️ Owner',
    options: []
  },
  {
    label: 'Member Only',
    options: []
  }
]
