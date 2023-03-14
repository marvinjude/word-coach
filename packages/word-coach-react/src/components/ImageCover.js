import React from "react"
import { motion } from "framer-motion"
import styled from "styled-components"

export const StyledImageCover = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  overflow: hidden;

  .wrapper {
    border-radius: 9999px;
    position: absolute;
    width: 10px;
    height: 10px;
    background: #000000b0;
  }

  & span {
    display: block;
    font-size: 2.25rem;
    z-index: 10;
  }
`

function ImageCover({ icon }) {
  return (
    <StyledImageCover>
      <motion.div
        className="wrapper"
        transition={{
          type: "spring",
          stiffness: 100,
        }}
        animate={{ height: 200, width: 200 }}
      ></motion.div>
      <motion.span
        initial={{ translateY: "50%" }}
        animate={{ translateY: "0%" }}
        role="img"
        aria-label="right"
      >
        {icon && icon()}
      </motion.span>
    </StyledImageCover>
  )
}

export default ImageCover
