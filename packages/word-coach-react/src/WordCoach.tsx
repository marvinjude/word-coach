"use client"

import React, { useEffect, useLayoutEffect, useState } from "react"
import {
  injectStyleTagWithThemeVars,
  removeStyleTagWithThemeVars,
} from "word-coach-common"
import type { WordCoachProps, UserAnswers, Screen } from "./types"

import GameScreen from "./screens/GameScreen"
import EndScreen from "./screens/EndScreen"
import Spinner from "word-coach-common/icons/spinner.svg"
import styles from "word-coach-common/styles/styles.css"
import useGameEngine, { GameEngineProps, GameEngineReturnType } from "./hooks/useGameEngine"

export type GameScreenProps = WordCoachProps & {
  userAnswers: UserAnswers
  setUserAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>
  setScreen: React.Dispatch<React.SetStateAction<Screen>>
  questions: any[]
  questionsCount: number
}

export type EndScreenProps = WordCoachProps & {
  userAnswers: UserAnswers
  setUserAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>
  setScreen: React.Dispatch<React.SetStateAction<Screen>>
  questions: any[]
} & Pick<GameEngineReturnType, "refetch">

const validatateProps = (props: WordCoachProps) => {
  if (props.mode === undefined) {
    throw new Error("WordCoach: mode must be provided")
  }

  if (props.mode === "static" && props.questions === undefined) {
    throw new Error("WordCoach: questions must be provided in static mode")
  }

  if (props.mode === "stream" && props.streamEndPoint === undefined) {
    throw new Error("WordCoach: streamEndPoint must be provided in stream mode")
  }

  if (props.mode === "stream" && props.streamEndPoint === undefined) {
    throw new Error("WordCoach: streamEndPoint must be provided in stream mode")
  }

  if (props.mode === "static" && !props.isLoading && !props.questions.length) {
    throw new Error(
      "WordCoach: questions must not be empty, in static mode. Please use isLoading prop to show loading state"
    )
  }
}

const WordCoach: React.FC<WordCoachProps> = wordCoachProps => {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({})
  const [screen, setScreen] = useState<Screen>("game")
  const { theme } = wordCoachProps

  /**
   * Catch prop errors or wrong props combination early in time
   */
  useEffect(() => {
    validatateProps(wordCoachProps)
  }, [])

  let gameEngineProps = {}

  if (wordCoachProps.mode === "stream") {
    gameEngineProps = {
      mode: wordCoachProps.mode,
      streamEndPoint: wordCoachProps.streamEndPoint,
      onChunk: wordCoachProps.onChunk,
    }
  }

  if (wordCoachProps.mode === "static") {
    gameEngineProps = {
      mode: wordCoachProps.mode,
      staticQuestions: wordCoachProps.questions,
    }
  }

  const { questions, questionsCount, refetch } =
    useGameEngine(gameEngineProps as GameEngineProps)

  /**
   * Inject theme variable into the DOM based on the selected theme
   */
  useLayoutEffect(() => {
    injectStyleTagWithThemeVars(theme)

    return () => {
      removeStyleTagWithThemeVars()
    }
  }, [theme])

  const gameScreenProps: GameScreenProps = {
    ...wordCoachProps,
    userAnswers,
    setUserAnswers,
    setScreen,
    questions,
    questionsCount,
  }

  const endScreenProps: EndScreenProps = {
    ...wordCoachProps,
    userAnswers,
    setUserAnswers,
    setScreen,
    questions,
    refetch
  }

  if (
    (gameScreenProps.mode === "static" && gameScreenProps.isLoading) ||
    (gameScreenProps.mode === "stream" &&
      gameScreenProps.streamEndPoint &&
      questions.length === 0)
  ) {
    return (
      <div className={styles.card}>
        <div className={styles.loading}>
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <>
      {screen === "game" && <GameScreen {...gameScreenProps} />}
      {screen === "end" && (
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.icon}>WORD COACH</span>
          </div>
          <EndScreen {...endScreenProps} />
        </div>
      )}
    </>
  )
}

export { WordCoach }
