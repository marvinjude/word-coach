import React from "react"
import { motion } from "framer-motion"
import { classNames } from "word-coach-common"
import styles from "word-coach-common/styles/styles.css"

export default function HighLights({ dots, selectedDotIndex }) {
  return (
    <div className={styles.highlights}>
      {dots.map((dot, index) => {
        const scale = selectedDotIndex === index ? 2 : 1

        return (
          <motion.span
            className={classNames(styles.highlight, {
              [styles["highlight--wrong"]]: dot.wrong,
              [styles["highlight--right"]]: dot.right,
            })}
            key={index}
            animate={{ scale }}
          ></motion.span>
        )
      })}
    </div>
  )
}
