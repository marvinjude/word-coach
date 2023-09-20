import { AIQuestions } from '@/lib/ai-questions'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  success: boolean
  data: any
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Data>
) {
  const API_KEY = process.env.OPENAI_API_KEY as string
  const questionCount = 10

  const aiQuestions = new AIQuestions(API_KEY)

  const questionsStream = await aiQuestions.getQuestionsStream({
    description: 'cars',
    length: questionCount,
  })

  AIQuestions.StreamResponse(questionsStream, response, {
    dataLength: questionCount,
  })
}
