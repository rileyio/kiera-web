import { Request } from 'express'

export interface RequestExtended {
  isAuthenticated: () => boolean
  user: {
    id: string
    webToken: string
  }
}
