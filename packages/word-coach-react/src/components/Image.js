import React from "react"
import styled from "styled-components"

const StyledImageWrapper = styled.div`
  flex: 1;
  height: 7rem;
  border-radius: 10px;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
  &:focus {
    outline: none;
  }
`

const Image = ({ url, children, ...props }) => {
  return (
    <StyledImageWrapper
      style={{
        backgroundImage: `url(${url})`,
      }}
      {...props}
    >
      {children}
    </StyledImageWrapper>
  )
}

export default Image
