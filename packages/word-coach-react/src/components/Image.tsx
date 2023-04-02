import React from "react"
import styles from "word-coach-common/styles/styles.css"

interface ImageProps {
  url: string
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

/**
 * An Clickable Image with wrapper and optional children
 */
const Image: React.FC<ImageProps> = ({
  children,
  url,
  onClick,
  ...props
}: ImageProps) => {
  return (
    <div className={styles.image_wrapper} onClick={onClick} {...props}>
      <img className={styles.image} src={url} />
      {children && <div className={styles.image_inner}>{children}</div>}
    </div>
  )
}

export default Image
