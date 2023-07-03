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

  const wordCoachQuestions = new AIQuestions(API_KEY)
  const questionCount = 5

  const questionsStream = await wordCoachQuestions.getQuestionsStream({
    category: "Philosophy",
    length: 5,
  })

  AIQuestions.StreamResponse(questionsStream, response, {
    dataLength: questionCount,
  })
}
