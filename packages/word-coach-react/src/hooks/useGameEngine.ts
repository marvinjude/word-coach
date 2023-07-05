import { useEffect, useState } from "react"
import { type WordCoachProps } from "../types"
import { shuffleArray as shuffle } from "word-coach-common"

interface GameEngineProps {
  streamEndPoint: string | undefined
  staticQuestions: WordCoachProps["questions"]
  enableShuffle: boolean | undefined
}

/**
 * Ochestrate the dictotomy between stream and static questions
 */
const useGameEngine = ({
  streamEndPoint,
  staticQuestions,
  enableShuffle,
}: GameEngineProps) => {
  const [questionsCount, setQuestionsCount] = useState(null)
  const [isStreamingQuestions, setIstreamingQuestions] = useState(
    streamEndPoint ? true : false
  )
  const [hasReceivedFirstChunk, setHasReceivedFirstChunk] = useState(false)
  const [questions, setQuestions] = useState<WordCoachProps["questions"]>([])

  useEffect(() => {
    const fetchStream = async () => {
      const fakeQuestion = {
        type: "TEXT_WITH_IMAGE",
        image:
          "https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",

        question: "What's the full meaning of 'UK'?",
        score: 30,
        options: [
          { text: "United Kingdom of UK edehdjhejhd" },
          { text: "Ultra Kingdom of UKE dhjedjedeg" },
        ],
        answer: [0],
        whyAnswer: [
          {
            heading: "Why the UK Flag differnt",
            text: "The flag of the United Kingdom is a defaced version of the flag of England.",
          },
          {
            heading: "What does the UK have in common",
            text: "The flag of the United Kingdom is a defaced version of the flag of England.",
          },
        ],
      }

      if (!streamEndPoint) return

      const result = await fetch(streamEndPoint)
      const reader = result.body?.getReader()

      while (true) {
        if (!reader) return

        const { done, value } = await reader.read()

        if (done) {
          setIstreamingQuestions(false)
          console.log("All chunks received")
          break
        }

        const chunk = new TextDecoder().decode(value)

        try {
          const questionChuck = JSON.parse(chunk)

          const { data } = questionChuck

          setQuestions((prev: any) => [...prev, fakeQuestion])

          if (!hasReceivedFirstChunk) setHasReceivedFirstChunk(true)
          if (questionsCount === null) setQuestionsCount(data.dataLength)
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
    questionsCount: staticQuestions
      ? staticQuestions.length
      : questionsCount,
    hasReceivedFirstChunk,
  }
}

export default useGameEngine
