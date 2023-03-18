import React from "react"
import styles from "word-coach-common/styles/styles.css"

const Image = ({ url, children, ...props }) => {
  return (
    <div
      className={styles.image}
      style={{
        backgroundImage: `url(${url})`,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export default Image
