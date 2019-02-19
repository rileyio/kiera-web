export interface Decision {
  // Props from webapp
  _deleteVisible: boolean
  // Decision props
  _id: string
  name: string
  options: Array<DecisionOption>
  /**
   * TrackedUser object ID
   * @type {ObjectID}
   * @memberof TrackedDecision
   */
  owner: string
  /**
   * Discord Snowflake
   * @type {string}
   * @memberof TrackedDecision
   */
  authorID: string
  /**
   * Discord Server ID
   * @type {ObjectID}
   * @memberof TrackedDecision
   */
  serverID: string
  /**
   * Limit the Decision roller to its serverID
   * @type {boolean}
   * @memberof TrackedDecision
   */
  serverLimited: boolean
}

export interface DecisionOption {
  _isUpdating: boolean
  _isChanged: boolean
  _originalText: string
  _deleteVisible: boolean
  _id: string
  text: string
}