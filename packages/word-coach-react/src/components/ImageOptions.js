import React, { Fragment } from "react"
import styled from "styled-components"
import ImageCover from "./ImageCover"
import useOptionsHelper from "../hooks/useOptions"
import { StyledOr } from "./ButtonOptions"
import Image from "./Image"
import { CorrectIcon, WrongIcon } from "./Icons"

export const Wrapper = styled.div`
  display: flex;
  gap: 0.7rem;
  align-items: center;
  color: #fff;
`

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
    <Wrapper>
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
            {optionIndex === 0 && <StyledOr>or</StyledOr>}
          </Fragment>
        )
      )}
    </Wrapper>
  )
}
