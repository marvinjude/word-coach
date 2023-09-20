import React from "react"
import { motion, AnimatePresence } from "framer-motion"

import styles from "../styles/styles.module.scss"

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
    <div className={styles.accordion_item}>
      <div
        role="button"
        onClick={() => setIsOpen(open => !open)}
        className={styles.accordion_item_button}
      >
        <div className={styles.accordion_item_button_left}>
          <div className={styles.accordion_item_button_left_icon}>{icon()}</div>
          <div className={styles.accordion_item_button_left_title}>{title}</div>
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
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: "0px", opacity: 0 }}
            className={styles.accordion_item_container}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AccordionItem
