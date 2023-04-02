import React, { Fragment } from "react"
import Image from "./Image"
import Button from "./Button"
import styles from "word-coach-common/styles/styles.css"
import type { TextOption, OptionsUI } from "../types"

const ButtonOptions: React.FC<OptionsUI> = ({
  currentQuestionIndex,
  onChooseAnswer,
  userAnswers,
  revealRightAndWrongAnswer,
  currentQuestionIsAnswered,
  options,
  question,
}) => {
  return (
    <div className={styles.button_options_wrapper}>
      {question.image && (
        <div style={{ flex: "0 0 45%" }}>
          <Image url={question.image} />
        </div>
      )}
      <div style={{ flex: "1" }}>
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
          let state: "right" | "wrong" | "default" = "default"

          if (right) {
            state = "right"
          }
          if (wrong) {
            state = "wrong"
          }

          return (
            <Fragment key={index}>
              <Button
                full
                showIcon
                state={state}
                onClick={() => onChooseAnswer(index)}
              >
                {(option as TextOption).text}
              </Button>
              {index === 0 && <div className={styles.or_divider}>or</div>}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default ButtonOptions
