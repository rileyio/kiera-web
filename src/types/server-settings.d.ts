export interface TrackedServerSetting {
  _originalValue: string | boolean | number
  key: string
  serverID: string
  state: boolean
  type: string
  value: string | boolean | number
}