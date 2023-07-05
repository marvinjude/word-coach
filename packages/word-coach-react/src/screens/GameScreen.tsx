import React, { useRef, useState, useMemo, useContext, useEffect } from "react"
import { motion } from "framer-motion"

import Highlights from "../components/Highlights"
import ButtonOptions from "../components/ButtonOptions"
import ImageOptions from "../components/ImageOptions"
import Score from "../components/Score"

import callbackCaller from "../utils/callbackCaller"
import { isDev } from "../utils/isDev"

import styles from "word-coach-common/styles/styles.css"
import PhoneLink from "word-coach-common/icons/phone-link.svg"
import Spinner from "word-coach-common/icons/spinner.svg"

import { type AppContextType, QuestionTypes } from "../types"

import { AppContext } from "../context"
import useGameEngine from "../hooks/useGameEngine"

// Move to utils and constants / common
const MAX_NUMBER_OF_OPTION = 2
const TRANSITION_DELAY = 1200

const delay = (f: () => any, timeDelay = TRANSITION_DELAY) => {
  const timeout = setTimeout(() => {
    clearTimeout(timeout)
    f()
  }, timeDelay)
}

const GameScreen = () => {
  const {
    enableShuffle,
    questions: staticQuestions,
    defaultScore,
    onEnd,
    onSelectAnswer,
    userAnswers,
    setScreen,
    setUserAnswers,
    revealAnswerOnSkip,
    streamEndPoint,
    isLoading,
  } = useContext(AppContext) as AppContextType

  if (isLoading && streamEndPoint) {
    console.warn(
      `You are using a stream endpoint and isLoading is set to true
      This may not be the correct prop configuration.`
    )
  }

  if (staticQuestions && streamEndPoint)
    throw new Error(
      "You can't have both static questions and a stream endpoint"
    )

  if (!staticQuestions && !streamEndPoint) {
    throw new Error(
      "You must provide either static questions or a stream endpoint"
    )
  }

  const { questions, hasReceivedFirstChunk, questionsCount } = useGameEngine({
    staticQuestions,
    streamEndPoint,
    enableShuffle,
  })

  const [scoreList, setScoreList] = useState([{ value: 0, id: Date.now() }])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const skippedQuestionsIndex = useRef<string[]>([])
  const [revealRightAndWrongAnswer, setRevealRightAndWrongAnswer] =
    useState(false)

  if (isLoading || (streamEndPoint && !hasReceivedFirstChunk)) {
    return (
      <div className={styles.card}>
        <div className={styles.loading}>
          <Spinner />
        </div>
      </div>
    )
  }

  if (!isLoading && !questions.length) {
    return (
      <div className={styles.card}>
        <div className={styles.loading}>
          <p>There are no questions</p>
        </div>
      </div>
    )
  }

  const {
    options,
    question,
    type: questionType,
  } = questions[currentQuestionIndex]

  const isLastQuestion = currentQuestionIndex === questions.length - 1
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

  questions.forEach((question, questionIndex) => {
    question.answer.forEach(answer => {
      if (answer > MAX_NUMBER_OF_OPTION) {
        const errorText = `WordCoach: ${answer} is an incorrect answer in Question ${questionIndex}: ${question.question}.`
        throw new Error(errorText)
      }
    })
  })

  const gotoNextQuestion = (shouldDelay: boolean = true) => {
    delay(
      () => {
        setCurrentQuestionIndex(prev => prev + 1)
        setRevealRightAndWrongAnswer(false)
      },
      shouldDelay ? TRANSITION_DELAY : 0
    )
  }

  const gotoGameEndScreen = () => {
    delay(() => {
      setScreen("end")
    })
  }

  const skipQuestion = () => {
    if (currentQuestionIsAnswered || currendQuestionIsSkipped) return

    skippedQuestionsIndex.current.push(currentQuestionIndex.toString())

    setRevealRightAndWrongAnswer(revealAnswerOnSkip as boolean)

    if (isLastQuestion) {
      callbackCaller(onEnd, { answers: userAnswers, score: scoreList[0] })
      gotoGameEndScreen()
    } else {
      if (revealAnswerOnSkip) gotoNextQuestion(true)
      else gotoNextQuestion(false)
    }
  }

  const onChooseAnswer = (optionIndex: number) => {
    if (currentQuestionIsAnswered || currendQuestionIsSkipped) return

    const answerIsCorrect =
      questions[currentQuestionIndex].answer.includes(optionIndex)

    const scoreForQuestion =
      questions[currentQuestionIndex].score || defaultScore || 1

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

  const highlightDots = Array.from(Array(questionsCount)).map(
    (_, questionIndex) => {
      const hasSelectedAnswer = String(questionIndex) in userAnswers

      const answerIndexSelected = userAnswers[questionIndex.toString()]

      const selectedAnswerIsCorrect =
        questions[questionIndex]?.answer?.includes(answerIndexSelected)

      return {
        wrong: hasSelectedAnswer && !selectedAnswerIsCorrect,
        right: hasSelectedAnswer && selectedAnswerIsCorrect,
      }
    }
  )

  return (
    <div className={styles.card}>
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
        {questionType === QuestionTypes.IMAGE && (
          <ImageOptions
            currentQuestionIndex={currentQuestionIndex}
            onChooseAnswer={onChooseAnswer}
            userAnswers={userAnswers}
            revealRightAndWrongAnswer={revealRightAndWrongAnswer}
            currentQuestionIsAnswered={currentQuestionIsAnswered}
            options={options}
            question={questions[currentQuestionIndex]}
          />
        )}

        {(questionType === QuestionTypes.TEXT ||
          questionType === QuestionTypes.TEXT_WITH_IMAGE) && (
          <ButtonOptions
            currentQuestionIndex={currentQuestionIndex}
            onChooseAnswer={onChooseAnswer}
            userAnswers={userAnswers}
            revealRightAndWrongAnswer={revealRightAndWrongAnswer}
            currentQuestionIsAnswered={currentQuestionIsAnswered}
            options={options}
            question={questions[currentQuestionIndex]}
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
            disabled={currentQuestionIsAnswered || currendQuestionIsSkipped}
            aria-label="Skip"
            className={styles.skip_button}
            onClick={skipQuestion}
          >
            SKIP
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameScreen
