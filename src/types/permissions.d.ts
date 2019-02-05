export interface Permission {
  type: string;
  deleted: boolean;
  id: string;
  name: string;
  position: number;
  parentID: null;
  permissionOverwrites: {};
  permissions: Array<any>;
}

interface PermissionScopeTarget {
  /**
   * ID from DB, example: UID, SID, Role ID
   * @type {ObjectID}
   * @memberof PermissionScopeTarget
   */
  public id: any
  /**
   *  Channel, Role, Or specific user to apply rule to
   * @type {('channel' | 'role' | 'user')}
   * @memberof PermissionScopeTarget
   */
  public type: 'channel' | 'role' | 'user'
}