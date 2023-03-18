import React from "react"
import { motion } from "framer-motion"
import styles from "word-coach-common/styles/styles.css"

function ImageCover({ icon }) {
  return (
    <div className={styles.image_cover}>
      <motion.div
        className={styles.image_cover__wrapper}
        transition={{
          type: "spring",
          stiffness: 100,
        }}
        animate={{ height: 200, width: 200 }}
      ></motion.div>
      <motion.span
        initial={{ translateY: "50%" }}
        animate={{ translateY: "0%" }}
        role="img"
        aria-label="right"
      >
        {icon && icon()}
      </motion.span>
    </div>
  )
}

export default ImageCover
