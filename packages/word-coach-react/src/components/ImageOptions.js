import React, { Fragment } from "react"
import ImageCover from "./ImageCover"
import useOptionsHelper from "../hooks/useOptions"
import Image from "./Image"
import { CorrectIcon, WrongIcon } from "./Icons"
import styles from "word-coach-common/styles/styles.css"

const ImageWithCover = ({ url, showImageCover, imageCoverIcon, onClick }) => {
  return (
    <Image tabIndex="1" onClick={onClick} url={url}>
      {showImageCover && <ImageCover icon={imageCoverIcon} />}
    </Image>
  )
}

export default function ImageOptions({
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
    <div className={styles.image_button}>
      {optionsWithHelpers.map(
        (
          {
            chooseAnswerHandler,
            thisOptionIsCorrectAnswer,
            thisOptionWasSelected,
            option: { url },
            index,
          },
          optionIndex
        ) => (
          <Fragment key={index}>
            <ImageWithCover
              key={index}
              url={url}
              onClick={chooseAnswerHandler}
              imageCoverIcon={
                thisOptionIsCorrectAnswer
                  ? () => <CorrectIcon />
                  : () => <WrongIcon />
              }
              showImageCover={
                revealRightAndWrongAnswer ||
                (currentQuestionIsAnswered && thisOptionWasSelected)
              }
            />
            {optionIndex === 0 && <span className={styles.or_divider}>or</span>}
          </Fragment>
        )
      )}
    </div>
  )
}
