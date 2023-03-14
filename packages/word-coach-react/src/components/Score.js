import { AnimatePresence, motion } from "framer-motion"
import React from "react"
import styled from "styled-components"

const StyledScore = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;

  .score-value {
    font-family: "JetBrains Mono";
    color: ${props => props.theme.colors.highlighter.right};
  }

  .dot {
    margin-left: 2px;
    margin-right: 2px;
  }
`

function Score({ score }) {
  return (
    <StyledScore>
      Score<span className="dot">•</span>
      <AnimatePresence key={score}>
        <motion.span
          className="score-value"
          initial={{ translateY: -20 }}
          animate={{ translateY: 0 }}
          transition={{ duration: 0.5 }}
        >
          {score}
        </motion.span>
      </AnimatePresence>
    </StyledScore>
  )
}

export default React.memo(Score)
