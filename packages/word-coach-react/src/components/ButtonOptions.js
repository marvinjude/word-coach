import React, { Fragment } from "react"
import { motion } from "framer-motion"
import useOptionsHelper from "../hooks/useOptions"
import Image from "./Image"
import { CorrectIcon, WrongIcon } from "./Icons"
import styles from "word-coach-common/styles/styles.css"
import { classNames } from "word-coach-common/magic"

function ButtonHint({ icon }) {
  return (
    <motion.span
      role="img"
      animate={{ marginRight: "10px" }}
      aria-label="right"
    >
      {icon()}
    </motion.span>
  )
}

export default function ButtonOptions({
  currentQuestionIndex,
  chooseAnswer,
  userAnswers,
  revealRightAndWrongAnswer,
  currentQuestionIsAnswered,
  options,
  question,
}) {
  const optionsWithHelpers = useOptionsHelper({
    options,
    currentQuestionIndex,
    chooseAnswer,
    userAnswers,
    currentQuestionIsAnswered,
    question,
  })

  return (
    <div className={styles.button_group}>
      {question.image && <Image url={question.image} />}
      <div className={styles.button_group_wrapper}>
        {optionsWithHelpers.map(
          (
            {
              chooseAnswerHandler,
              thisOptionIsCorrectAnswer,
              thisOptionWasSelected,
              option: { text },
              index,
            },
            optionIndex
          ) => (
            <Fragment key={index}>
              <button
                autoFocus
                className={classNames(styles.button, {
                  [styles["button--right"]]:
                    thisOptionIsCorrectAnswer &&
                    (revealRightAndWrongAnswer ||
                      (currentQuestionIsAnswered && thisOptionWasSelected)),
                  [styles["button--wrong"]]:
                    !thisOptionIsCorrectAnswer &&
                    (revealRightAndWrongAnswer ||
                      (currentQuestionIsAnswered && thisOptionWasSelected)),
                  [styles["button--unanswered"]]: !currentQuestionIsAnswered,
                })}
                onClick={chooseAnswerHandler}
              >
                {currentQuestionIsAnswered && thisOptionWasSelected && (
                  <ButtonHint
                    icon={
                      thisOptionIsCorrectAnswer
                        ? () => <CorrectIcon />
                        : () => <WrongIcon />
                    }
                  />
                )}

                {revealRightAndWrongAnswer && (
                  <ButtonHint
                    icon={
                      thisOptionIsCorrectAnswer
                        ? () => <CorrectIcon />
                        : () => <WrongIcon />
                    }
                  />
                )}
                {text}
              </button>
              {optionIndex === 0 && (
                <span className={styles.or_divider}>or</span>
              )}
            </Fragment>
          )
        )}
      </div>
    </div>
  )
}
