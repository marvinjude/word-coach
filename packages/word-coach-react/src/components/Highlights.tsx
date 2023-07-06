import React from "react"
import { motion } from "framer-motion"
import { classNames } from "word-coach-common"
import styles from "word-coach-common/styles/styles.css"

/**
 * Highlights is a component that shows the correct and wrong answers.
 * @param dots - An array that represents the state all dots in the highlight.
 * @param selectedDotIndex - The index of the dot that is currently selected.
 */
interface HighLightsProps {
  dots: Array<{ wrong: boolean; right: boolean }>
  selectedDotIndex: number
}

const HighLights: React.FC<HighLightsProps> = ({ dots, selectedDotIndex }) => {
  return (
    <motion.div
      animate={{ marginLeft: `-${selectedDotIndex * 12}px` }}
      className={styles.highlights}
    >
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
    </motion.div>
  )
}

export default HighLights
