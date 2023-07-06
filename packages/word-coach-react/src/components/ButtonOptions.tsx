import React, { Fragment } from "react"
import Image from "./Image"
import Button from "./Button"
import styles from "word-coach-common/styles/styles.css"
import { QuestionTypes, type OptionsUI } from "../types"
import { classNames } from "word-coach-common"

const ButtonOptions: React.FC<OptionsUI> = ({
  currentQuestionIndex,
  onChooseAnswer,
  userAnswers,
  revealRightAndWrongAnswer,
  currentQuestionIsAnswered,
  options,
  question,
}) => {
  const buttonOptionsWrapperRightClassNames = classNames(
    styles.button_options_wrapper_right,
    {
      [styles.button_options_wrapper_right_full]:
        question.type === QuestionTypes.TEXT,
      [styles.button_options_wrapper_right_half]:
        question.type === QuestionTypes.TEXT_WITH_IMAGE,
    }
  )

  return (
    <div className={styles.button_options_wrapper}>
      {question.type === QuestionTypes.TEXT_WITH_IMAGE && (
        <div className={styles.button_options_wrapper_left}>
          <Image url={question.image} />
        </div>
      )}
      <div className={buttonOptionsWrapperRightClassNames}>
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

          let state: "right" | "wrong" | "default" = right
            ? "right"
            : wrong
            ? "wrong"
            : "default"

          return (
            <Fragment key={index}>
              <Button
                full
                showIcon
                state={state}
                onClick={() => onChooseAnswer(index)}
              >
                {option}
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
