import React, { useLayoutEffect, useState } from "react"

import {
  injectStyleTagWithThemeVars,
  removeStyleTagWithThemeVars,
} from "word-coach-common"

import type { WordCoachProps, UserAnswers, Screen } from "./types"

import styles from "word-coach-common/styles/styles.css"
import Spinner from "word-coach-common/icons/spinner.svg"
import { AppContext } from "./context"

import GameScreen from "./screens/GameScreen"
import EndScreen from "./screens/EndScreen"

const WordCoach: React.FC<WordCoachProps> = ({
  theme,
  defaultScore,
  onEnd,
  enableShuffle = false,
  onSelectAnswer,
  isLoading = false,
  hasNextRound = false,
  onClickNextRound,
  questions,
}) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({})
  const [screen, setScreen] = useState<Screen>("game")

  /**
   * Inject theme variable into the DOM based on the selected theme
   */
  useLayoutEffect(() => {
    injectStyleTagWithThemeVars(theme)

    return () => {
      removeStyleTagWithThemeVars()
    }
  }, [])

  const appContextValue = {
    questions,
    defaultScore,
    onEnd,
    enableShuffle,
    onSelectAnswer,
    userAnswers,
    setUserAnswers,
    hasNextRound,
    onClickNextRound,
    setScreen,
  }

  return (
    <AppContext.Provider value={appContextValue}>
      {isLoading && (
        <div className={styles.card}>
          <div className={styles.loading}>
            <Spinner />
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          {screen === "game" && <GameScreen />}
          {screen === "end" && (
            <div className={styles.card}>
              <div className={styles.header}>
                <span className={styles.icon}>WORD COACH</span>
              </div>
              <EndScreen />
            </div>
          )}
        </>
      )}
    </AppContext.Provider>
  )
}

export { WordCoach }
