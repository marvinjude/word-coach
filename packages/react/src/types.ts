import type { Themes } from './utils'

//Todo: move type to common package
export const QuestionTypes = {
  TEXT: 'TEXT',
  TEXT_WITH_IMAGE: 'TEXT_WITH_IMAGE',
  IMAGE: 'IMAGE',
} as const

export type QuestionTypesKeys = keyof typeof QuestionTypes

export type UserAnswers = {
  [key: string]: number
}

export interface IQuestionBase {
  /**
   * The question to be asked
   * const question = "What is the capital of Nigeria?"
   */
  question: string

  /**
   * The options to be displayed to the user
   * @default []
   *
   * @example with text
   * const options = ["Lagos", "Abuja"]
   *
   * @example with images
   * const options = ["https://example.com/image.png","https://example.com/image.png"]
   *
   */
  options: Array<string>

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

export interface ImageQuestion extends IQuestionBase {
  type: typeof QuestionTypes.IMAGE
}

export interface TextQuestion extends IQuestionBase {
  type: typeof QuestionTypes.TEXT
}

export interface TextWithImageQuestion extends IQuestionBase {
  type: typeof QuestionTypes.TEXT_WITH_IMAGE

  /**
   * The url of the image to be displayed on the side
   * @example
   * "https://example.com/image.png"
   */
  image: string
}

export type IQuestion = ImageQuestion | TextQuestion | TextWithImageQuestion

export type IQuestions = Array<IQuestion>

export interface BaseWordCoachProps {
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
   * Callback function to be called when the user selects an answer
   */
  onSelectAnswer?: (resut: {
    answerIndex: number
    questionIndex: number
    currentScore: number
  }) => void
}

export interface StreamingWordCoachProps extends BaseWordCoachProps {
  mode: 'stream'
  /**
   *  When in stream mode, this function is called when a new question stream is received
   */
  onChunk?: (chunk: any) => void

  /**
   * When using @word-coach/ai-questions, pass in the endpoint to stream questions from
   * if specified, the `questions` prop will be ignored and the questions will be streamed from the endpoint
   */
  streamEndPoint: string
}

export interface StaticWordCoachProps extends BaseWordCoachProps {
  mode: 'static'
  /**
   * Questions for the quiz
   * @example
      const questions = [
        {
          type: "TEXT",
          question: "What is the capital of Nigeria?",
          options: ["Lagos", "Abuja"],
          answer: [1],
          score: 10,
        },
        {
          type: "IMAGE",
          question: "Which object is bigger?",
          options: [
            "https://picsum.photos/200/300",
            "https://picsum.photos/200/300",
          ],
          answer: [1],
          score: 10,
        },
    ]
  */
  questions: IQuestions

  /**
   * Whether to shuffle the questions
   */
  enableShuffle?: boolean

  /**
   * Whether to show a loading state, useful when fetching questions from an API
   * @default false
   */
  isLoading?: boolean
}

export type WordCoachProps = StreamingWordCoachProps | StaticWordCoachProps

export interface OptionsUI {
  currentQuestionIndex: number
  onChooseAnswer: (index: number) => void
  userAnswers: UserAnswers
  revealRightAndWrongAnswer: boolean
  currentQuestionIsAnswered: boolean
  options: IQuestion['options']
  question: IQuestion
}

export type Screen = 'game' | 'end'
