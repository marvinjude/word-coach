export { WordCoach } from "./WordCoach"
export type { WordCoachProps } from "./types"

export default function () {
  console.warn(
    `import { WordCoach } from 'word-coach-react' instead of import WordCoach from '@word-coach/react'`
  )
}
