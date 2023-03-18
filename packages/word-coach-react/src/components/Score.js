import { AnimatePresence, motion } from "framer-motion"
import React from "react"
import styles from "word-coach-common/styles/styles.css"

function Score({ score }) {
  return (
    <div className={styles.score}>
      Score<span className={styles.dot}>•</span>
      <AnimatePresence key={score}>
        <motion.span
          className={styles.score_value}
          initial={{ translateY: -20 }}
          animate={{ translateY: 0 }}
          transition={{ duration: 0.5 }}
        >
          {score}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

export default React.memo(Score)
