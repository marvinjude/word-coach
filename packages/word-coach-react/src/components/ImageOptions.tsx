import React, { Fragment } from "react"
import WobbleChild from "./WobbleChild"
import Image from "./Image"

import Cross from "word-coach-common/icons/cross.svg"
import Check from "word-coach-common/icons/check.svg"
import styles from "word-coach-common/styles/styles.css"

import type { ImageOption, OptionsUI } from ".."

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
        //TODO: Move to Util
        const thisOptionWasSelected =
          userAnswers[currentQuestionIndex] === index

        const thisOptionIsCorrectAnswer = question.answer.includes(index)

        const right =
          thisOptionIsCorrectAnswer &&
          (revealRightAndWrongAnswer ||
            (currentQuestionIsAnswered && thisOptionWasSelected))

        const wrong =
          !thisOptionIsCorrectAnswer &&
          (revealRightAndWrongAnswer ||
            (currentQuestionIsAnswered && thisOptionWasSelected))
        //
        return (
          <Fragment key={index}>
            <Image
              key={index}
              onClick={() => onChooseAnswer(index)}
              url={(option as ImageOption).url}
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
