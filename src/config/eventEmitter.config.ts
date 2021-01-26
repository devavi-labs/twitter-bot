export type EventEmitterConfigType = {
  wildcard: boolean
  delimiter: string
  newListener: boolean
  removeListener: boolean
  maxListeners: number
  verboseMemoryLeak: boolean
  ignoreErrors: boolean
}

export const eventEmitterConfig: EventEmitterConfigType = {
  wildcard: false,
  delimiter: ".",
  newListener: false,
  removeListener: false,
  maxListeners: 10,
  verboseMemoryLeak: true,
  ignoreErrors: true,
}
