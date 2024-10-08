import React, { Fragment } from "react"
import WobbleChild from "./WobbleChild"
import Image from "./Image"

import Cross from "../icons/cross"
import Check from "../icons/check"
import styles from "../styles/styles.module.scss"

import type { OptionsUI } from "../types"

const ImageOptions: React.FC<OptionsUI> = ({
  currentQuestionIndex,
  onChooseAnswer,
  userAnswers,
  revealRightAndWrongAnswer,
  currentQuestionIsAnswered,
  options,
  question,
}) => {
  return (
    <div className={styles.image_options_wrapper}>
      {options.map((option, index) => {
        const thisOptionWasSelected =
          userAnswers[currentQuestionIndex] === index

        const thisOptionIsCorrectAnswer = question.answer
          .map(answer => Number(answer))
          .includes(index)

        const right =
          thisOptionIsCorrectAnswer &&
          (revealRightAndWrongAnswer ||
            (currentQuestionIsAnswered && thisOptionWasSelected))

        const wrong =
          !thisOptionIsCorrectAnswer &&
          (revealRightAndWrongAnswer ||
            (currentQuestionIsAnswered && thisOptionWasSelected))

        return (
          <Fragment key={index}>
            <Image
              key={index}
              onClick={() => onChooseAnswer(index)}
              url={option}
            >
              {right && (
                <WobbleChild>
                  <Check />
                </WobbleChild>
              )}

              {wrong && (
                <WobbleChild>
                  <Cross />
                </WobbleChild>
              )}
            </Image>
            {index === 0 && <div className={styles.or_divider}>or</div>}
          </Fragment>
        )
      })}
    </div>
  )
}

export default ImageOptions
