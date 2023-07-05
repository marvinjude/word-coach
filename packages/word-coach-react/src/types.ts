import { Dispatch, SetStateAction } from "react"
import type { Themes } from "word-coach-common"

export type UserAnswers = {
  [key: string]: number
}

//Todo: move type to common package
export enum QuestionTypes {
  TEXT = "TEXT",
  TEXT_WITH_IMAGE = "TEXT_WITH_IMAGE",
  IMAGE = "IMAGE",
}

export type Option = TextOption | ImageOption

export interface TextOption {
  text: string
}

export interface ImageOption {
  url: string
}

export interface IQuestion {
  /**
   * The question to be asked
   * @example
   * const question = "What is the capital of Nigeria?"
   */
  question: string

  /**
   * The url of the image to be displayed on the side
   * @example
   * "https://example.com/image.png"
   */
  image?: string

  /**
   * The options to be displayed
   * @example type: "TEXT"
   * const options = [
   *   { text: "Lagos"},
   *   { text: "Abuja" },
   * ]
   *
   * @example type: "IMAGE"
   * [
   *  { url: "https://example.com/image.png" },
   *  { url: "https://example.com/image.png" },
   * ]
   *
   * @default []
   * @note If the type is "IMAGE", the url is required, if the type is "TEXT", the text is required
   */
  options: Array<Option>

  /**
   * The indexes of the correct answers
   * @example
   * // For a single answer
   * const answer = [0]
   *
   * @example
   * // For multiple answers
   * const answer = [0, 1]
   */
  answer: Array<number>

  /**
   * The type of question
   */
  type: keyof typeof QuestionTypes

  /**
   * The score to be awarded for this question
   * @default 0
   */
  score: number

  /**
   * List of explanations about why the actual answer is correct
   */
  whyAnswer?: Array<{
    heading: string
    text: string
  }>
}

export interface WordCoachProps {
  /**
   * When using @word-coach/ai-questions, pass in the endpoint to stream questions from
   * if specified, the `questions` prop will be ignored and the questions will be streamed from the endpoint
   */
  streamEndPoint?: string

  /**
   * Whether to show a "Next Round" button at the end of the quiz
   * @default false
   */
  hasNextRound: boolean

  /**
   * Fired when user clicks the "Next Round" button.
   * Here, you can fetch more quiz questions and probably put the UI in loading state with the `isLoading` prop while you're at it
   */
  onClickNextRound?: () => void

  /**
   * Whether to show a loading state, useful when fetching questions from an API
   * @default false
   */
  isLoading?: boolean

  /**
   * Whether to reveal the right and wrong answers when the user skips the question
   * @default true
   */
  revealAnswerOnSkip?: boolean 

  /**
   * Theme to be used, defaults to "nigeria"
   * CSS variables for corresponding theme is injected into the DOM
   * @default "nigeria"
   */
  theme?: Themes

  /**
   * The default score to be used when the score for a question is not specified
   */
  defaultScore?: number

  /**
   * Callback function to be called when the quiz ends
   */
  onEnd?: (result: { answers: Array<number>; score: number }) => void

  /**
   * Whether to shuffle the questions
   */
  enableShuffle?: boolean

  /**
   * Callback function to be called when the user selects an answer
   */
  onSelectAnswer?: (resut: {
    answerIndex: number
    questionIndex: number
    currentScore: number
  }) => void

  /**
   * Questions for the quiz
   * @example
      const questions = [
        {
          type: "TEXT",
          question: "What is the capital of Nigeria?",
          options: [{ text: "Lagos" }, { text: "Abuja" }],
          answer: [1],
          score: 10,
        },
        {
          type: "IMAGE",
          question: "Which object is bigger?",
          options: [
            { url: "https://picsum.photos/200/300" },
            { url: "https://picsum.photos/200/300" },
          ],
          answer: [1],
          score: 10,
        },
    ]
  */
  questions?: Array<IQuestion>
}

export interface OptionsUI {
  currentQuestionIndex: number
  onChooseAnswer: (index: number) => void
  userAnswers: UserAnswers
  revealRightAndWrongAnswer: boolean
  currentQuestionIsAnswered: boolean
  options: IQuestion["options"]
  question: IQuestion
}

type AppContextTypeFromWordCoachProps = Pick<
  WordCoachProps,
  | "questions"
  | "onClickNextRound"
  | "hasNextRound"
  | "enableShuffle"
  | "defaultScore"
  | "onEnd"
  | "onSelectAnswer"
  | "isLoading"
  | "revealAnswerOnSkip"
  | "streamEndPoint"
>

export type Screen = "game" | "end"

export interface AppContextType extends AppContextTypeFromWordCoachProps {
  userAnswers: UserAnswers
  setScreen: React.Dispatch<React.SetStateAction<Screen>>
  setUserAnswers: Dispatch<SetStateAction<UserAnswers>>
}
