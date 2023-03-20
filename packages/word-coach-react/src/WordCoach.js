import React, { useLayoutEffect, useState, useRef, useMemo } from "react"
import shuffle from "lodash.shuffle"
import { motion } from "framer-motion"

import Highlights from "./components/Highlights"
import ButtonOptions from "./components/ButtonOptions"
import ImageOptions from "./components/ImageOptions"
import Score from "./components/Score"

import callbackCaller from "./utils/callbackCaller"
import { isDev } from "./utils/isDev"

import { injectThemeElement, removeThemeElement } from "word-coach-common"
import styles from "word-coach-common/styles/styles.css"

function WordCoach({
  theme,
  defaultScore,
  onEnd,
  enableShuffle,
  onSelectAnswer,
  ...props
}) {
  const data = useMemo(
    () => ({
      ...props.data,
      questions: enableShuffle
        ? shuffle(props.data.questions)
        : props.data.questions,
    }),
    [props.data, enableShuffle]
  )
  const container = useRef()
  const [score, setScore] = useState([{ value: 0, id: Date.now() }])
  const [userAnswers, setUserAnswers] = useState({})
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

  /** Warnings: Just making sure your data shape is correct */
  const MAX_NUMBER_OF_OPTION = 2
  let controlledOptions = options

  if (options.length > MAX_NUMBER_OF_OPTION) {
    controlledOptions = options.slice(0, MAX_NUMBER_OF_OPTION)

    if (isDev) {
      console.warn(`WordCoach: The maximum number of options is 2.`)
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

  /****************************************************************/
  const nextQuestion = () => {
    if (!isLastQuestion) {
      const timeout = setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1)

        setRevealRightAndWrongAnswer(false)

        clearTimeout(timeout)
      }, 1200)
    }
  }

  const skipQuestion = () => {
    setRevealRightAndWrongAnswer(true)
    nextQuestion()
  }

  const chooseAnswer = index => {
    const answerIsCorrect =
      data.questions[currentQuestionIndex].answer.includes(index)

    const scoreForQuestion =
      data.questions[currentQuestionIndex].score || defaultScore || 1
    const newScore = answerIsCorrect
      ? score[0].value + scoreForQuestion
      : score[0].value

    if (newScore != score[0].value)
      setScore([{ value: newScore, id: Date.now() }])

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
    callbackCaller(onEnd, { answers: userAnswers, score: score[0] })
  }

  const dots = Array.from({ length: data.questions.length }).map((_, index) => {
    const hasSelectedAnswer = String(index) in userAnswers
    const selectedAnswerIsCorrect = data.questions[index].answer.includes(
      userAnswers[index]
    )

    return {
      wrong: hasSelectedAnswer && !selectedAnswerIsCorrect,
      right: hasSelectedAnswer && selectedAnswerIsCorrect,
    }
  })

  /**
   * This lets us inject theme variable into the DOM based on the selected theme
   */
  useLayoutEffect(() => {
    injectThemeElement(theme)

    return () => {
      removeThemeElement()
    }
  }, [])

  return (
    <div className={styles.card} ref={container}>
      <div className={styles.card_upper}>
        <div className={styles.header}>
          <span className={styles.icon}>WORD COACH</span>
          <Score score={score} />
        </div>
        <motion.div
          key={currentQuestionIndex}
          transition={{ duration: 1, type: "tween" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: -20, opacity: 0 }}
        >
          <p className={styles.question}>{question}</p>
          {questionType === "IMAGE" && (
            <ImageOptions
              currentQuestionIndex={currentQuestionIndex}
              chooseAnswer={chooseAnswer}
              userAnswers={userAnswers}
              revealRightAndWrongAnswer={revealRightAndWrongAnswer}
              currentQuestionIsAnswered={currentQuestionIsAnswered}
              options={controlledOptions}
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
              options={controlledOptions}
              question={data.questions[currentQuestionIndex]}
            />
          )}
        </motion.div>
      </div>
      <div className={styles.footer}>
        <div>
          <svg
            height="20px"
            viewBox="0 0 24 24"
            width="20px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0V0z" fill="none"></path>
            <path
              fill="#868b90"
              d="M18 1.01L8 1c-1.1 0-2 .9-2 2v3h2V5h10v14H8v-1H6v3c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM10 15h2V8H5v2h3.59L3 15.59 4.41 17 10 11.41z"
            ></path>
            <path d="M0 0h24v24H0V0z" fill="none"></path>
          </svg>
        </div>
        <div>
          <Highlights dots={dots} selectedDotIndex={currentQuestionIndex} />
        </div>
        <div className={styles.skip_button_wrapper}>
          <button className={styles.skip_button} onClick={skipQuestion}>
            SKIP
          </button>
        </div>
      </div>
    </div>
  )
}

export { WordCoach }
