import React, { useLayoutEffect, useRef, useState, useMemo } from "react"
import { motion } from "framer-motion"

import Highlights from "./components/Highlights"
import ButtonOptions from "./components/ButtonOptions"
import ImageOptions from "./components/ImageOptions"
import Score from "./components/Score"

import callbackCaller from "./utils/callbackCaller"
import { isDev } from "./utils/isDev"

import {
  injectStyleTagWithThemeVars,
  removeStyleTagWithThemeVars,
  shuffleArray as shuffle,
} from "word-coach-common"

import type { Themes } from "word-coach-common"
import styles from "word-coach-common/styles/styles.css"
import PhoneLink from "word-coach-common/icons/phone-link.svg"
import Spinner from "word-coach-common/icons/spinner.svg"
import EndScreen from "./components/EndScreen"

export type UserAnswers = {
  [key: string]: number
}

type QuestionType = "IMAGE" | "TEXT"

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
   * @note If the type is "IMAGE", the url is required, if the type is "TEXT", the text is required
   * @example
   * const type: QuestionType = "TEXT"
   * const type: QuestionType = "IMAGE"
   */
  type: QuestionType

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
   * Whether to show a "Next Round" button at the end of the quiz
   * @default false
   */
  hasNextRound: boolean

  /**
   * Fired when user clicks the "Next Round" button.
   * Here, you can fetch more quiz data and probably put the UI in loading state with the `isLoading` prop while you're at it
   */
  onClickNextRound?: () => void

  /**
   * Whether to show a loading state, useful when fetching data from an API
   * @default false
   */
  isLoading?: boolean

  /**
   * Whether to reveal the right and wrong answers when the user skips the question
   * @default false
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
   * The data to be used for the quiz
   * @example
      const data = {
        questions: [
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
        ],
      }
   */
  data: {
    questions: Array<IQuestion>
  }
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

const MAX_NUMBER_OF_OPTION = 2
const DELAY_BEFORE_NEXT = 1200

const delay = (f: () => any) => {
  const timeout = setTimeout(() => {
    clearTimeout(timeout)
    f()
  }, DELAY_BEFORE_NEXT)
}

const WordCoach: React.FC<WordCoachProps> = ({
  theme,
  defaultScore,
  onEnd,
  enableShuffle = false,
  onSelectAnswer,
  isLoading = false,
  hasNextRound = false,
  onClickNextRound,
  ...props
}) => {
  // Memoise the shuffled question so we don't reshuffle on rerender
  const data: WordCoachProps["data"] = useMemo(() => {
    return {
      questions: enableShuffle
        ? shuffle(props.data.questions)
        : props.data.questions,
    }
  }, [props.data.questions, enableShuffle])

  const [scoreList, setScoreList] = useState([{ value: 0, id: Date.now() }])
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)
  const [revealRightAndWrongAnswer, setRevealRightAndWrongAnswer] =
    useState(false)
  const skippedQuestionsIndex = useRef<string[]>([])

  const {
    options,
    question,
    type: questionType,
  } = data.questions[currentQuestionIndex]

  // Compute value
  const isLastQuestion = currentQuestionIndex === data.questions.length - 1
  const currentQuestionIsAnswered = String(currentQuestionIndex) in userAnswers
  const currendQuestionIsSkipped = skippedQuestionsIndex.current.includes(
    currentQuestionIndex.toString()
  )

  /** Warnings: Just making sure your data shape is correct
   *  TODO: Replace with PropTypes
   */
  if (options.length > MAX_NUMBER_OF_OPTION) {
    if (isDev) {
      throw new Error(`WordCoach: The maximum number of options is 2.`)
    }
  }

  data.questions.forEach((question, questionIndex) => {
    question.answer.forEach(answer => {
      if (answer > MAX_NUMBER_OF_OPTION) {
        const errorText = `WordCoach: ${answer} is an incorrect answer in Question ${questionIndex}: ${question.question}.`
        throw new Error(errorText)
      }
    })
  })
  // End of warnings

  const gotoNextQuestion = () => {
    delay(() => {
      setCurrentQuestionIndex(prev => prev + 1)
      setRevealRightAndWrongAnswer(false)
    })
  }

  const gotoGameEndScreen = () => {
    delay(() => {
      setGameEnded(true)
    })
  }

  const skipQuestion = () => {
    // Prevent skipping when current question is already skipped / answered
    if (currentQuestionIsAnswered || currendQuestionIsSkipped) return

    skippedQuestionsIndex.current.push(currentQuestionIndex.toString())

    setRevealRightAndWrongAnswer(true)

    if (isLastQuestion) {
      callbackCaller(onEnd, { answers: userAnswers, score: scoreList[0] })
      gotoGameEndScreen()
    } else {
      gotoNextQuestion()
    }
  }

  const onChooseAnswer = (optionIndex: number) => {
    // Prevent skipping when current question is already skipped / answered
    if (currentQuestionIsAnswered || currendQuestionIsSkipped) return

    const answerIsCorrect =
      data.questions[currentQuestionIndex].answer.includes(optionIndex)

    const scoreForQuestion =
      data.questions[currentQuestionIndex].score || defaultScore || 1

    const newScore = answerIsCorrect
      ? scoreList[0].value + scoreForQuestion
      : scoreList[0].value

    if (newScore != scoreList[0].value)
      setScoreList([{ value: newScore, id: Date.now() }])

    callbackCaller(onSelectAnswer, {
      answerIndex: optionIndex,
      questionIndex: currentQuestionIndex,
      currentScore: newScore,
    })

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }))

    if (!isLastQuestion) {
      gotoNextQuestion()
    } else {
      gotoGameEndScreen()
      callbackCaller(onEnd, { answers: userAnswers, score: scoreList[0] })
    }
  }

  const highlightDots = data.questions.map((_, questionIndex) => {
    const hasSelectedAnswer = String(questionIndex) in userAnswers
    const answerIndexSelected = userAnswers[questionIndex.toString()]
    const selectedAnswerIsCorrect =
      data.questions[questionIndex].answer.includes(answerIndexSelected)

    return {
      wrong: hasSelectedAnswer && !selectedAnswerIsCorrect,
      right: hasSelectedAnswer && selectedAnswerIsCorrect,
    }
  })

  /**
   * Inject theme variable into the DOM based on the selected theme
   */
  useLayoutEffect(() => {
    injectStyleTagWithThemeVars(theme)

    return () => {
      removeStyleTagWithThemeVars()
    }
  }, [])

  if (gameEnded)
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>WORD COACH</span>
         
        </div>
        {gameEnded && !isLoading && (
          <EndScreen
            data={props.data}
            userAnswers={userAnswers}
            hasNextRound={hasNextRound}
            onClickNextRound={onClickNextRound}
          />
        )}
      </div>
    )

  return (
    <div className={styles.card}>
      {isLoading && (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}

      {!isLoading && !gameEnded && (
        <>
          <div className={styles.header}>
            <span className={styles.icon}>WORD COACH</span>
            <Score scoreList={scoreList} />
          </div>
          <motion.div
            className={styles.card_middle}
            key={currentQuestionIndex}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            initial={{ opacity: -200 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: -200 }}
          >
            <p className={styles.question}>{question}</p>
            {questionType === "IMAGE" && (
              <ImageOptions
                currentQuestionIndex={currentQuestionIndex}
                onChooseAnswer={onChooseAnswer}
                userAnswers={userAnswers}
                revealRightAndWrongAnswer={revealRightAndWrongAnswer}
                currentQuestionIsAnswered={currentQuestionIsAnswered}
                options={options}
                question={data.questions[currentQuestionIndex]}
              />
            )}

            {questionType === "TEXT" && (
              <ButtonOptions
                currentQuestionIndex={currentQuestionIndex}
                onChooseAnswer={onChooseAnswer}
                userAnswers={userAnswers}
                revealRightAndWrongAnswer={revealRightAndWrongAnswer}
                currentQuestionIsAnswered={currentQuestionIsAnswered}
                options={options}
                question={data.questions[currentQuestionIndex]}
              />
            )}
          </motion.div>
          <div className={styles.footer}>
            <div>
              <PhoneLink />
            </div>
            <div>
              <Highlights
                dots={highlightDots}
                selectedDotIndex={currentQuestionIndex}
              />
            </div>
            <div className={styles.skip_button_wrapper}>
              <button
                aria-label="Skip"
                className={styles.skip_button}
                onClick={skipQuestion}
              >
                SKIP
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export { WordCoach }
