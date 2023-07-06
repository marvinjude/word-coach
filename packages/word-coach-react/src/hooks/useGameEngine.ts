import { useEffect, useState, useRef } from "react"
import { IQuestions } from "../types"
import { shuffleArray as shuffle } from "word-coach-common"
import { useDidUpdate } from "./useDidUpdate"

interface GameEngineProps {
  streamEndPoint?: string | undefined
  staticQuestions?: IQuestions
  enableShuffle?: boolean | undefined
  onChunk?: any
}

/**
 * Ochestrate the dictotomy between stream and static questions
 */
const useGameEngine = ({
  streamEndPoint,
  staticQuestions,
  enableShuffle,
  onChunk,
}: GameEngineProps): {
  questions: IQuestions
  isStreamingQuestions: boolean
  questionsCount: number | null
  hasReceivedFirstChunk: boolean
} => {
  const [questionsCount, setQuestionsCount] = useState(0)
  const [isStreamingQuestions, setIstreamingQuestions] = useState(
    streamEndPoint ? true : false
  )
  const [hasReceivedFirstChunk, setHasReceivedFirstChunk] = useState(false)
  const [questions, setQuestions] = useState<IQuestions>([])

  useDidUpdate(() => {
    if (!hasReceivedFirstChunk) setHasReceivedFirstChunk(true)
  }, [questions])

  useEffect(() => {
    if (!streamEndPoint) return

    const fetchStream = async () => {
      if (!streamEndPoint) return

      const result = await fetch(streamEndPoint)
      const reader = result.body?.getReader()

      while (true) {
        if (!reader) return

        const { done, value } = await reader.read()

        if (done) {
          setIstreamingQuestions(false)
          break
        }

        const chunk = new TextDecoder().decode(value)

        try {
          const questionChuck = JSON.parse(chunk)

          const { data } = questionChuck

          if (typeof onChunk == "function") onChunk(data)

          setQuestions((prev: any) => [...prev, data.question])

          if (questions.length === 0) setQuestionsCount(data.dataLength)
        } catch (error) {
          console.log("Couldn't parse JSON", error)
        }
      }
    }

    fetchStream()
  }, [])

  return {
    questions: staticQuestions
      ? enableShuffle
        ? shuffle(staticQuestions)
        : staticQuestions
      : questions,
    isStreamingQuestions,
    questionsCount: staticQuestions ? staticQuestions.length : questionsCount,
    hasReceivedFirstChunk: hasReceivedFirstChunk,
  }
}

export default useGameEngine
