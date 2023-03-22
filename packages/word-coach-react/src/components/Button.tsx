import * as React from "react"
import styles from "word-coach-common/styles/styles.css"
import { classNames } from "word-coach-common"
import Cross from "word-coach-common/icons/cross.svg"
import Check from "word-coach-common/icons/check.svg"
import { motion } from "framer-motion"

interface ButtonProps {
  onClick: () => void
  children?: React.ReactNode
  state: "right" | "wrong" | "default"
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { onClick, children, state } = props

  const buttonClassNames = classNames(styles.button, {
    [styles["button--right"]]: state === "right",
    [styles["button--wrong"]]: state === "wrong",
  })

  return (
    <button
      className={buttonClassNames}
      type="button"
      onClick={onClick}
      autoFocus
    >
      {state === "right" || state === "wrong" ? (
        <motion.span
          role="img"
          animate={{ marginRight: "10px" }}
          aria-label="right"
        >
          {state == "right" ? <Check /> : null}
          {state == "wrong" ? <Cross /> : null}
        </motion.span>
      ) : null}

      {children}
    </button>
  )
}

export default Button
