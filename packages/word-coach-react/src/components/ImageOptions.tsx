import React, { Fragment } from "react"
import ImageOverlay from "./ImageOverlay"
import Image from "./Image"

import Cross from "word-coach-common/icons/cross.svg"
import Check from "word-coach-common/icons/check.svg"
import styles from "word-coach-common/styles/styles.css"

import type { IQuestion, UserAnswers, ImageOption } from "../WordCoach"

interface ImageOptionsProps {
  currentQuestionIndex: number
  chooseAnswer: (index: number) => void
  userAnswers: UserAnswers
  revealRightAndWrongAnswer: boolean
  currentQuestionIsAnswered: boolean
  options: IQuestion["options"]
  question: IQuestion
}

const ImageOptions: React.FC<ImageOptionsProps> = ({
  currentQuestionIndex,
  chooseAnswer,
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
        const thisOptionIsCorrectAnswer = question.answer.includes(index)

        return (
          <Fragment key={index}>
            <Image
              key={index}
              onClick={() => chooseAnswer(index)}
              url={(option as ImageOption).url}
            >
              {revealRightAndWrongAnswer ||
                (currentQuestionIsAnswered && thisOptionWasSelected && (
                  <ImageOverlay>
                    {thisOptionIsCorrectAnswer ? <Check /> : <Cross />}
                  </ImageOverlay>
                ))}
            </Image>
            {index === 0 && <div className={styles.or_divider}>or</div>}
          </Fragment>
        )
      })}
    </div>
  )
}

export default ImageOptions
