import React, { useLayoutEffect, useState, useMemo } from "react"
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

export type UserAnswers = {
  [key: string]: number
}

type QuestionType = "IMAGE" | "TEXT"

export interface TextOption {
  text: string
}

export interface ImageOption {
  url: string
}

export type Option = TextOption | ImageOption

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
}

interface WordCoachProps {
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
   * Theme to be used, defaults to "nigeria", CSS variables for corresponding them is injected into the DOM
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

const MAX_NUMBER_OF_OPTION = 2
const DELAY_BEFORE_NEXT_QUESTION = 1200

const WordCoach: React.FC<WordCoachProps> = ({
  theme,
  defaultScore,
  onEnd,
  enableShuffle = false,
  onSelectAnswer,
  isLoading = false,
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
  const [revealRightAndWrongAnswer, setRevealRightAndWrongAnswer] =
    useState(false)

  const {
    options,
    question,
    type: questionType,
  } = data.questions[currentQuestionIndex]
  const questionsLength = data.questions.length - 1
  const isLastQuestion = currentQuestionIndex === questionsLength
  const currentQuestionIsAnswered = String(currentQuestionIndex) in userAnswers
  const isLastQuestionAnswered = questionsLength in userAnswers

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

  const nextQuestion = () => {
    if (!isLastQuestion) {
      const timeout = setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1)

        setRevealRightAndWrongAnswer(false)

        clearTimeout(timeout)
      }, DELAY_BEFORE_NEXT_QUESTION)
    }
  }

  const skipQuestion = () => {
    setRevealRightAndWrongAnswer(true)
    nextQuestion()
  }

  const chooseAnswer = (index: number) => {
    if (currentQuestionIsAnswered) return

    const answerIsCorrect =
      data.questions[currentQuestionIndex].answer.includes(index)

    const scoreForQuestion =
      data.questions[currentQuestionIndex].score || defaultScore || 1
    const newScore = answerIsCorrect
      ? scoreList[0].value + scoreForQuestion
      : scoreList[0].value

    if (newScore != scoreList[0].value)
      setScoreList([{ value: newScore, id: Date.now() }])

    callbackCaller(onSelectAnswer, {
      answerIndex: index,
      questionIndex: currentQuestionIndex,
      currentScore: newScore,
    })

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: index,
    }))

    nextQuestion()
  }

  if (isLastQuestionAnswered) {
    callbackCaller(onEnd, { answers: userAnswers, score: scoreList[0] })
  }

  const dots = data.questions.map((_, questionIndex) => {
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
   * This lets us inject theme variable into the DOM based on the selected theme
   */
  useLayoutEffect(() => {
    injectStyleTagWithThemeVars(theme)

    return () => {
      removeStyleTagWithThemeVars()
    }
  }, [])

  return (
    <div className={styles.card}>
      {isLoading && (
        <div className={styles.loading}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="38"
            height="38"
            viewBox="0 0 38 38"
          >
            <defs>
              <linearGradient
                id="a"
                x1="8.042%"
                x2="65.682%"
                y1="0%"
                y2="23.865%"
              >
                <stop offset="0%" stopColor="currentColor" stopOpacity="0"></stop>
                <stop
                  offset="63.146%"
                  stopColor="currentColor"
                  stopOpacity="0.631"
                ></stop>
                <stop offset="100%" stopColor="currentColor"></stop>
              </linearGradient>
            </defs>
            <g fill="none" fillRule="evenodd" transform="translate(1 1)">
              <path
                stroke="url(#a)"
                strokeWidth="2"
                d="M36 18c0-9.94-8.06-18-18-18"
              >
                <animateTransform
                  attributeName="transform"
                  dur="0.9s"
                  from="0 18 18"
                  repeatCount="indefinite"
                  to="360 18 18"
                  type="rotate"
                ></animateTransform>
              </path>
              <circle cx="36" cy="18" r="1" fill="currentColor">
                <animateTransform
                  attributeName="transform"
                  dur="0.9s"
                  from="0 18 18"
                  repeatCount="indefinite"
                  to="360 18 18"
                  type="rotate"
                ></animateTransform>
              </circle>
            </g>
          </svg>
        </div>
      )}
      {!isLoading && (
        <>
          <div className={styles.card_upper}>
            <div className={styles.header}>
              <span className={styles.icon}>WORD COACH</span>
              <Score scoreList={scoreList} />
            </div>
            <motion.div
              key={currentQuestionIndex}
              transition={{ duration: 1, type: "tween" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: -20 }}
            >
              <p className={styles.question}>{question}</p>
              {questionType === "IMAGE" && (
                <ImageOptions
                  currentQuestionIndex={currentQuestionIndex}
                  chooseAnswer={chooseAnswer}
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
                  chooseAnswer={chooseAnswer}
                  userAnswers={userAnswers}
                  revealRightAndWrongAnswer={revealRightAndWrongAnswer}
                  currentQuestionIsAnswered={currentQuestionIsAnswered}
                  options={options}
                  question={data.questions[currentQuestionIndex]}
                />
              )}
            </motion.div>
          </div>
          <div className={styles.footer}>
            <div>
              <PhoneLink />
            </div>
            <div>
              <Highlights dots={dots} selectedDotIndex={currentQuestionIndex} />
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
