import { useEffect, useState, useRef } from "react"
import { IQuestions, WordCoachProps } from "../types"
import { shuffleArray as shuffle } from "word-coach-common"
import callbackCaller from "../utils/callbackCaller"

export interface GameEngineProps {
  mode: WordCoachProps["mode"]
  streamEndPoint?: string | undefined
  staticQuestions?: IQuestions
  enableShuffle?: boolean | undefined
  onChunk?: any
}

export interface GameEngineReturnType {
  questions: IQuestions
  isStreamingQuestions: boolean
  questionsCount: number
  /**
   * In stream mode, this function will refetch questions from the `streamEndPoint`
   */
  refetch: (() => Promise<void>) | undefined
}

interface GameEngineType {
  (props: GameEngineProps): GameEngineReturnType
}

/**
 * Ochestrate the dictotomy between stream and static questions
 */

const useGameEngine: GameEngineType = ({
  streamEndPoint,
  staticQuestions,
  enableShuffle,
  onChunk,
  mode,
}) => {
  const [questionsCount, setQuestionsCount] = useState(0)
  const [isStreamingQuestions, setIstreamingQuestions] = useState(
    streamEndPoint ? true : false
  )
  const hasReceivedFirstChunk = useRef(false)
  const [questions, setQuestions] = useState<IQuestions>([])

  const fetchStream = async () => {
    console.log("useGameEngine", {})
    if (mode !== "stream" || !streamEndPoint) return

    setQuestions([])

    const result = await fetch(streamEndPoint)
    const reader = result.body?.getReader()

    hasReceivedFirstChunk.current = false

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

        callbackCaller(onChunk, data)

        if (hasReceivedFirstChunk.current === true) {
          setQuestions((prev: any) => [...prev, data.question])
        } else {
          hasReceivedFirstChunk.current = true
          setQuestions([data.question])
        }

        if (questions.length === 0) setQuestionsCount(data.dataLength)
      } catch (error) {
        console.log("Couldn't parse JSON", error)
      }
    }
  }

  useEffect(() => {
    if (!streamEndPoint) return

    fetchStream()
  }, [streamEndPoint])

  return {
    questions: staticQuestions
      ? enableShuffle
        ? shuffle(staticQuestions)
        : staticQuestions
      : questions,
    isStreamingQuestions,
    questionsCount: staticQuestions ? staticQuestions.length : questionsCount,
    refetch: mode === "stream" ? fetchStream : undefined,
  }
}

export default useGameEngine
