import { AnimatePresence, motion } from "framer-motion"
import React from "react"
import styles from "word-coach-common/styles/styles.css"

interface ScoreProps {
  scoreList: Array<{ value: number; id: number }>
}

/**
 *
 * @param scoreList - An array that usually contain 1 or 2 elements. The array is used to apply some entry/exit animation to each score.
 * @returns
 */
const Score: React.FC<ScoreProps> = ({ scoreList }) => {
  return (
    <div className={styles.score}>
      Score<span className={styles.dot}>•</span>
      {/* Ideally, score should be a number but because we're trying to apply some entry/exit animation to each score, we're using an array here */}
      <AnimatePresence initial={false} mode="wait">
        {scoreList.map(score => (
          <motion.span
            key={score.id}
            className={styles.score_value}
            initial={{ translateY: 15 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: -15, opacity: 0 }}
          >
            {score.value}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default React.memo(Score)
