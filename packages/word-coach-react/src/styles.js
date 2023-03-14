import styled from "styled-components"

export const Wrapper = styled.div`
  /* Oh yeah! Default Fonts */
  @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap");

  /* Oh yeah! Default Monospace Fonts */
  @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap");

  background-color: ${props => props.theme.colors.container.background};
  color: ${props => props.theme.colors.container.foreground};
  border: 1px solid ${props => props.theme.colors.container.border};
  text-align: center;

  box-shadow: -2px -4px 2.2px rgb(0 0 0 / 3%), 0 6.7px 5.3px rgb(0 0 0 / 5%),
    0 12.5px 10px rgb(0 0 0 / 6%), 0 22.3px 17.9px rgb(0 0 0 / 7%),
    0 41.8px 33.4px rgb(0 0 0 / 9%), 0 100px 80px rgb(0 0 0 / 12%);

  border-radius: 10px;
  overflow: hidden;
  width: 390px;
  min-height: 220px;
  position: relative;

  & * {
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e2e8f0;
  }

  & button {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    text-transform: none;
    cursor: pointer;

    padding: 0;
    line-height: inherit;
  }

  & button:focus {
    outline: none;
  }

  & p {
    text-align: left;
  }

  & svg {
    display: block;
    line-height: 1.2rem;
  }
`

export const StyledQuestion = styled.h1`
  margin-bottom: 1.25rem;
  font-size: 1.125rem;
  font-weight: 400;
`

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  align-items: center;

  & .icon {
    font-weight: bold;
    user-select: none;
  }
`

export const StyledFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & div {
    flex: 1 1 0;
    padding: 0.5rem;
  }

  .skip-button-wrapper {
    display: flex;
    justify-content: flex-end;
    padding-right: 1rem;
  }

  .skip-button {
    padding: 0.2rem;
    font-weight: 600;
    background: none;
    font-size: 0.875rem;
    color: ${props => props.theme.colors.container.foreground};
  }
`
