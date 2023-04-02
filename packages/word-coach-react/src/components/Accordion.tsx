import React from "react"
import { motion, AnimatePresence } from "framer-motion"

import styles from "word-coach-common/styles/styles.css"

interface AccordionItemProps {
  icon: () => React.ReactNode
  title: string
  children: React.ReactNode
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  icon,
  title,
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={styles.accordion}>
      <div
        onClick={() => setIsOpen(open => !open)}
        className={styles.accordion_button}
        style={{
          cursor: "pointer",
          padding: "0.8rem",
          borderTop: "1px solid black",
          display: "flex",
        }}
      >
        <div style={{ flex: "1", display: "flex" }}>
          <div style={{ marginRight: "0.5rem" }}>{icon()}</div>
          <div style={{ textAlign: "left" }}>{title}</div>
        </div>
        <div>
          <motion.div
            animate={{
              transform: `${isOpen ? `rotate(180deg)` : `rotate(0deg)`}`,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={{
              paddingLeft: "1rem",
              paddingRight: "1rem",
              height: "0px",
            }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: "0px", opacity: 0 }}
            className={styles.accorion_inner}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AccordionItem
