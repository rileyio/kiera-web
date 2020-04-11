export function buildRequestHeaders() {
  return {
    webToken: (<any>document.cookie).match('(^|;)\\s*kiera-webToken\\s*=\\s*([^;]+)').pop(),
    id: (<any>document.cookie).match('(^|;)\\s*kiera-discord-id\\s*=\\s*([^;]+)').pop()
  }
}

export function getUserID() {
  return (<any>document.cookie).match('(^|;)\\s*kiera-discord-id\\s*=\\s*([^;]+)').pop()
}
