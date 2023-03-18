import React from "react"
import styles from "word-coach-common/styles/styles.css"

const Image = ({ url, children, ...props }) => {
  return (
    <div
      className={styles.image}
      {...props}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <img
        src={url}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "0",
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default Image
