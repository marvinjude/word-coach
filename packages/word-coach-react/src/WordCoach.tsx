"use client"

import React, { useLayoutEffect, useState } from "react"
import {
  injectStyleTagWithThemeVars,
  removeStyleTagWithThemeVars,
} from "word-coach-common"
import type { WordCoachProps, UserAnswers, Screen } from "./types"

import GameScreen from "./screens/GameScreen"
import EndScreen from "./screens/EndScreen"

import styles from "word-coach-common/styles/styles.css"

export type GameScreenProps = WordCoachProps & {
  userAnswers: UserAnswers
  setUserAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>
  setScreen: React.Dispatch<React.SetStateAction<Screen>>
}

export type EndScreenProps = WordCoachProps & {
  userAnswers: UserAnswers
  setUserAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>
  setScreen: React.Dispatch<React.SetStateAction<Screen>>
}

const WordCoach: React.FC<WordCoachProps> = wordCoachProps => {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({})
  const [screen, setScreen] = useState<Screen>("game")

  const { theme } = wordCoachProps

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
  }

  const endScreenProps: EndScreenProps = {
    ...wordCoachProps,
    userAnswers,
    setUserAnswers,
    setScreen,
  }

  if (
    wordCoachProps.mode === "static" &&
    wordCoachProps.questions === undefined
  ) {
    throw new Error("WordCoach: questions must be provided in static mode")
  }

  if (
    wordCoachProps.mode === "stream" &&
    wordCoachProps.streamEndPoint === undefined
  ) {
    throw new Error("WordCoach: streamEndPoint must be provided in stream mode")
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
