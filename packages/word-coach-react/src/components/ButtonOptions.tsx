import React, { Fragment } from "react"
import Image from "./Image"
import Button from "./Button"
import styles from "word-coach-common/styles/styles.css"
import type { IQuestion, UserAnswers, TextOption } from "../WordCoach"

interface ButtonOptionsProps {
  currentQuestionIndex: number
  chooseAnswer: (index: number) => void
  userAnswers: UserAnswers
  revealRightAndWrongAnswer: boolean
  currentQuestionIsAnswered: boolean
  options: IQuestion["options"]
  question: IQuestion
}

const ButtonOptions: React.FC<ButtonOptionsProps> = ({
  currentQuestionIndex,
  chooseAnswer,
  userAnswers,
  revealRightAndWrongAnswer,
  currentQuestionIsAnswered,
  options,
  question,
}) => {
  return (
    <div className={styles.button_group}>
      {question.image && <Image url={question.image} />}
      <div className={styles.button_group_wrapper}>
        {options.map((option, index) => {
          const thisOptionWasSelected =
            userAnswers[currentQuestionIndex] === index
          const thisOptionIsCorrectAnswer = question.answer.includes(index)

          let state: "right" | "wrong" | "default" = "default"

          const right =
            thisOptionIsCorrectAnswer &&
            (revealRightAndWrongAnswer ||
              (currentQuestionIsAnswered && thisOptionWasSelected))

          const wrong =
            !thisOptionIsCorrectAnswer &&
            (revealRightAndWrongAnswer ||
              (currentQuestionIsAnswered && thisOptionWasSelected))

          if (right) {
            state = "right"
          }
          if (wrong) {
            state = "wrong"
          }

          return (
            <Fragment key={index}>
              <Button state={state} onClick={() => chooseAnswer(index)}>
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
