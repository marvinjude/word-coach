import * as React from "react"
import { motion } from "framer-motion"

import { classNames } from "word-coach-common"
import Cross from "word-coach-common/icons/cross.svg"
import Check from "word-coach-common/icons/check.svg"
import styles from "word-coach-common/styles/styles.css"

interface ButtonProps {
  onClick: () => void
  children?: React.ReactNode
  state: "right" | "wrong" | "default"
  showIcon?: boolean
  full?: boolean
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { onClick, children, state, showIcon = false, full = false } = props

  const buttonClassNames = classNames(styles.button, {
    [styles["button--right"]]: state === "right",
    [styles["button--wrong"]]: state === "wrong",
    [styles["button--full"]]: full,
  })

  return (
    <button
      className={buttonClassNames}
      type="button"
      onClick={onClick}
      autoFocus
    >
      {showIcon && (state === "right" || state === "wrong") ? (
        <motion.span
          role="img"
          animate={{ marginRight: "10px" }}
          aria-label="right"
        >
          {state == "right" && <Check /> }
          {state == "wrong" && <Cross /> }
        </motion.span>
      ) : null}

      {children}
    </button>
  )
}

export default Button
