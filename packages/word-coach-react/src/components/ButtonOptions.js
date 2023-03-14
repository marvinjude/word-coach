import React, { Fragment } from "react"
import { motion } from "framer-motion"
import styled, { css } from "styled-components"
import useOptionsHelper from "../hooks/useOptions"
import Image from "./Image"
import { CorrectIcon, WrongIcon } from "./Icons"

const StyledOptionButton = styled.button`
  ${props =>
    css`
      border: 1px solid ${props.theme.colors.option.button[props.state].border};
      background: ${props.theme.colors.option.button[props.state].background};
      color: ${props.theme.colors.option.button[props.state].text};
    `}

  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  width: 100%;
  transition: all 0.3s ease-in-out;
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  padding: 0.6rem;
  border-radius: 0.5rem;
  line-height: 1.5rem;
  cursor: pointer;
  height: 2.7rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(128, 93, 249, 0.3);
  }
`

export const StyledOr = styled.span`
  color: gray;
  font-size: 0.9rem;
`

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
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      {/**Show image if image is passed */}
      {question.image && <Image url={question.image} />}
      <div style={{ flex: "1 1 0" }}>
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
              <StyledOptionButton
                autoFocus
                onClick={chooseAnswerHandler}
                state={
                  thisOptionIsCorrectAnswer &&
                  (revealRightAndWrongAnswer ||
                    (currentQuestionIsAnswered && thisOptionWasSelected))
                    ? "right"
                    : !thisOptionIsCorrectAnswer &&
                      (revealRightAndWrongAnswer ||
                        (currentQuestionIsAnswered && thisOptionWasSelected))
                    ? "wrong"
                    : "unanswered"
                }
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
              </StyledOptionButton>
              {optionIndex === 0 && <StyledOr>or</StyledOr>}
            </Fragment>
          )
        )}
      </div>
    </div>
  )
}
