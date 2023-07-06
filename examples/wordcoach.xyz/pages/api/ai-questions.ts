import type { NextApiRequest, NextApiResponse } from "next"
import { AIQuestions } from "@word-coach/ai-questions"

type Data = {
  success: boolean
  data: any
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Data>
) {
  const API_KEY = process.env.OPENAI_SECRET as string
  const questionCount = 7

  const aiQuestions = new AIQuestions(API_KEY)

  const questionsStream = await aiQuestions.getQuestionsStream({
    description: "the bible",
    length: questionCount,
  })

  AIQuestions.StreamResponse(questionsStream, response, {
    dataLength: questionCount,
  })
}
