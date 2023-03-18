import { AnimatePresence, motion } from "framer-motion"
import React from "react"
import styles from "word-coach-common/styles/styles.css"

function Score({ score }) {
  return (
    <div className={styles.score}>
      Score<span className={styles.dot}>•</span>
      <AnimatePresence initial={false} exitBeforeEnter>
        {/* Ideally, score should be a number but because we're trying to apply some entry/exit animating, we're using an array here */}
        {score.map(_score => (
          <motion.span
            key={_score.id}
            className={styles.score_value}
            initial={{ translateY: 15 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: -15, opacity: 0 }}
          >
            {_score.value}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default React.memo(Score)
