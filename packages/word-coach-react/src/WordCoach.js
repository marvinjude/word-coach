import React, { useState, useRef, useMemo } from "react"
import shuffle from "lodash.shuffle"
import { ThemeProvider } from "styled-components"
import { AnimatePresence, motion } from "framer-motion"

import { themes } from "./theme"
import { Wrapper, StyledHeader, StyledQuestion, StyledFooter } from "./styles"

import Highlights from "./components/Highlights"
import ButtonOptions from "./components/ButtonOptions"
import ImageOptions from "./components/ImageOptions"
import Score from "./components/Score"

import callbackCaller from "./utils/callbackCaller"
import { DEFAULT_THEME } from "./constants"
import { isDev } from "./utils/isDev"

import { header } from "word-coach-common/styles"

console.log({ container, mulipleStyles })

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
  const [score, setScore] = useState(0)
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
  const selectedTheme = themes[theme] || theme[DEFAULT_THEME]

  /**
   * House heeping stuff to make sure you're doing things right
   */

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

  const skipQuestion = () => {
    if (!isLastQuestion) {
      setRevealRightAndWrongAnswer(true)
      nextQuestion()
    }
  }

  const nextQuestion = () => {
    if (!isLastQuestion) {
      const timeout = setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1)

        setRevealRightAndWrongAnswer(false)

        clearTimeout(timeout)
      }, 1200)
    }
  }

  const chooseAnswer = index => {
    const answerIsCorrect =
      data.questions[currentQuestionIndex].answer.includes(index)

    const scoreForQuestion =
      data.questions[currentQuestionIndex].score || defaultScore || 1
    const newScore = answerIsCorrect ? score + scoreForQuestion : score

    setScore(newScore)

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
    callbackCaller(onEnd, { answers: userAnswers, score })
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

  return (
    <ThemeProvider theme={selectedTheme}>
      <Wrapper ref={container}>
        <AnimatePresence key={String(currentQuestionIndex)}>
          <motion.div
            transition={{ duration: 1, type: "tween" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ padding: "1.2rem" }}
          >
            <StyledHeader className={header}>
              <span>WORD COACH </span>
              <Score score={score} />
            </StyledHeader>
            <div>
              <StyledQuestion>{question} </StyledQuestion>
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
            </div>
          </motion.div>
          <StyledFooter>
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
            <div className="skip-button-wrapper">
              <button
                className="skip-button"
                onClick={() => {
                  const isLast = currentQuestionIndex === questionsLength
                  if (!isLast) {
                    setCurrentQuestionIndex(prev => prev + 1)
                    setRevealRightAndWrongAnswer(false)
                  }
                }}
              >
                SKIP
              </button>
            </div>
          </StyledFooter>
        </AnimatePresence>
      </Wrapper>
    </ThemeProvider>
  )
}

export { WordCoach }
