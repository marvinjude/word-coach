import type { IQuestions } from "word-coach-react"

export interface IControlsState {
  questions: IQuestions
  isLoading: boolean
  enableShuffle: boolean
  revealAnswerOnSkip: boolean
  theme: string
  defaultScore: number
  hasNextRound: boolean
  mode: "stream" | "static"
  streamEndpoint: string
}

export interface IProDefinition {
  type: string
  description: string
  required: boolean
  control?: "text" | "switch" | "radio" | "select" | "fetchQ" | "function"
  options?: string[]
  showControl: boolean | ((props: IControlsState) => boolean)
  default?: any
  linkToTypeDef?: string
  signature?: string
}

export interface IPropDefinitions {
  [key: string]: IProDefinition
}
