import { useEffect, useState, useRef } from 'react'
import { IQuestions, WordCoachProps, QuestionTypes } from '../types'
import { shuffleArray as shuffle } from '../utils'
import callbackCaller from '../utils/callbackCaller'

function preloadAssets(links: Array<string>) {
  for (const link of links) {
    const linkElement = document.createElement('link')
    linkElement.setAttribute('rel', 'preload')
    linkElement.setAttribute('data-wordcoah', 'true')
    linkElement.setAttribute('as', 'image')
    linkElement.setAttribute('href', link)
    document.head.appendChild(linkElement)
  }
}

export interface GameEngineProps {
  mode: WordCoachProps['mode']
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
    if (mode !== 'stream' || !streamEndPoint) return

    setQuestions([])

    const result = await fetch(streamEndPoint)
    const reader = result.body?.getReader()

    hasReceivedFirstChunk.current = false

    let shouldContinue = true
    while (shouldContinue) {
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

        /**
         * For a better UX, Let's preload images from index 1...x
         */
        if (hasReceivedFirstChunk.current) {
          if (data.question.type === QuestionTypes.IMAGE) {
            preloadAssets(data.question.options)
          }

          if (data.question.type === QuestionTypes.TEXT_WITH_IMAGE) {
            preloadAssets([data.question.image])
          }
        }

        callbackCaller(onChunk, data)

        /*
         * Decide wether to merge question state or start afresh depending on
         * if any data chunk has been received previously
         */
        if (hasReceivedFirstChunk.current) {
          setQuestions((prev: any) => [...prev, data.question])
        } else {
          hasReceivedFirstChunk.current = true
          setQuestions([data.question])
        }

        if (questions.length === 0) setQuestionsCount(data.dataLength)
      } catch (error) {
        console.log("Couldn't parse chunk:", chunk, error)
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
    refetch: mode === 'stream' ? fetchStream : undefined,
  }
}

export default useGameEngine
