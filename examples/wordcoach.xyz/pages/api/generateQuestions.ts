// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { AIQuestions } from "@word-coach/ai-questions"

type Data = {
  success: boolean
  data: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const API_KEY = process.env.OPENAI_SECRET as string

  const wordCoachQuestions = new AIQuestions(API_KEY)

  const questions = await wordCoachQuestions.getQuestions("Nigeria", 10)

  console.log(questions)

  res.status(200).json({ success: true, data: "John Doe" })
}
