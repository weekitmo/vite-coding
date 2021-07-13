export interface InitOption {
  id: string
  canvasWidth?: number
  canvasHeight?: number
  scaleRatio?: number
  scaleRadius?: number
  imageURL?: string
  sightRadius?: number
  gridSpace?: number
  innerPadding?: number
  callback?: (hex: string) => void | null
  readImageStrategy?: {
    value: "internal" | "link" | "custom"
    // eslint-disable-next-line @typescript-eslint/ban-types
    strategy: () => string | null | undefined
  }
  [prop: string]: any
}

type Required<T> = {
  [P in keyof T]-?: T[P]
}

export type BaseOption = Required<InitOption>
