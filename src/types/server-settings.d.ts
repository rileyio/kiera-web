export interface TrackedServerSetting {
  _originalValue: string | boolean | number
  _id: string
  key: string
  serverID: string
  state: boolean
  type: string
  value: string | boolean | number
}