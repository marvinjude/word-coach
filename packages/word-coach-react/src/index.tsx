export { WordCoach } from "./WordCoach"
export * from "./types"

export default function () {
  console.warn(
    `import { WordCoach } from 'word-coach-react' instead of import WordCoach from '@word-coach/react'`
  )
}
