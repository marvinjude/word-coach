import React from "react"
import { motion } from "framer-motion"
import styles from "word-coach-common/styles/styles.css"

interface CircularProgressProps {
  percentage: number
  children: React.ReactNode
}
const FULL_CYCLE = 200

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  children,
}) => {
  const strokeDashoffset = FULL_CYCLE - (FULL_CYCLE * percentage) / 100

  return (
    <div className={styles.circular_progress}>
      <div className={styles.circular_progress_inner}>{children}</div>
      <svg
        className={styles.circular_progress_circle_group}
        height="72"
        width="72"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <circle
            cx="36"
            cy="36"
            r="31"
            fill="none"
            className={styles.circular_progress_outer_cirlce}
          ></circle>
          <motion.circle
            cx="36"
            cy="36"
            r="31"
            fill="none"
            transition={{ duration: "1.4" }}
            initial={{
              strokeWidth: "5",
              stroke: "#0f9d58",
              strokeDasharray: "200",
              strokeDashoffset: 200,
            }}
            animate={{
              strokeDashoffset,
            }}
          ></motion.circle>
        </g>
      </svg>
    </div>
  )
}

export default CircularProgress
