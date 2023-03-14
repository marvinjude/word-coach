import styled, { css } from "styled-components"
import React from "react"
import { motion } from "framer-motion"

const StyledHighlight = styled.span`
  height: 6px;
  width: 6px;
  display: inline-block;
  margin-left: 0.5rem;
  border-radius: 9999px;
  margin-right: 0.25rem;
  margin-left: 0.25rem;
  background-color: ${props => props.theme.colors.primary};
  transition: all 0.3s ease-in-out;
  flex-shrink: 0;
  flex-grow: 0;
  ${props =>
    !props.right &&
    !props.wrong &&
    css`
      background: ${props.theme.colors.highlighter.unanswered};
    `}

  ${props =>
    props.scale &&
    css`
      transform: scale(1.5);
    `}

  ${props =>
    props.right &&
    css`
      background-color: ${props.theme.colors.highlighter.right};
    `}

  ${props =>
    props.wrong &&
    css`
      background-color: ${props.theme.colors.highlighter.wrong};
    `}
`

const StyledHighLightsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

export default function HighLights({ dots, selectedDotIndex }) {
  return (
    <StyledHighLightsWrapper>
      {dots.map((dot, index) => {
        const scale = selectedDotIndex === index ? 2 : 1

        return (
          <StyledHighlight
            key={index}
            as={motion.span}
            wrong={dot.wrong}
            right={dot.right}
            animate={{ scale }}
          ></StyledHighlight>
        )
      })}
    </StyledHighLightsWrapper>
  )
}
