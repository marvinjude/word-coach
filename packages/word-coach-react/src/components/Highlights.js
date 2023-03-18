import React from "react"
import { motion } from "framer-motion"
import { classNames } from "word-coach-common/magic"
import styles from "word-coach-common/styles/styles.css"

export default function HighLights({ dots, selectedDotIndex }) {
  return (
    <div className={styles.highlights}>
      {dots.map((dot, index) => {
        const scale = selectedDotIndex === index ? 2 : 1

        return (
          <motion.span
            wrong={dot.wrong}
            right={dot.right}
            className={classNames(styles.highlight, {
              [styles["highlight--wrong"]]: dot.wrong,
              [styles["highlight--right"]]: dot.right,
              [styles["highlight--unanswered"]]: !dot.right && !dot.wrong,
            })}
            key={index}
            animate={{ scale }}
          ></motion.span>
        )
      })}
    </div>
  )
}
