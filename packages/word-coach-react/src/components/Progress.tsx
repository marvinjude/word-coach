import React from "react"
import { motion } from "framer-motion"

interface ProgressProps {
  percentage: number
  children: React.ReactNode
}
const FULL_CYCLE = 200

const Progress: React.FC<ProgressProps> = ({ percentage, children }) => {
  const strokeDashoffset = FULL_CYCLE - (FULL_CYCLE * percentage) / 100

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          fontSize: "1.5rem",
          position: "absolute",
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
      <svg
        style={{ transform: `rotate(90deg)` }}
        height="72"
        width="72"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <circle
            style={{
              stroke: "#f3f3f3",
              strokeWidth: "5",
            }}
            cx="36"
            cy="36"
            r="31"
            fill="none"
          ></circle>
          <motion.circle
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
            cx="36"
            cy="36"
            r="31"
            fill="none"
          ></motion.circle>
        </g>
      </svg>
    </div>
  )
}

export default Progress
