import { Configuration, OpenAIApi } from "openai"

/**
 * - Is there a way we can inteligently stream the questions to the user?
 * - We need to fetch images as well
 */

const SYSEM_INSTRUCTIONS = `
   [
	{
		type: "TEXT",
		question: "How many days make up a week",
		score: 30,
		options: [{ text: "7" }, { text: "11" }],
		answer: [1],
	},
	{
		type: "TEXT-WITH-IMAGE",
		question: "Who invented this device?",
		image: "A Radio",
		score: 30,
		options: [{ text: "Reginald A. Fessenden" }, { text: "Bill Gates" }],
		answer: [0],
	},
	{
		type: "TEXT-WITH-IMAGE",
		question: "Who is this spoon called?",
		image: "A Tea spoon",
		score: 30,
		options: [{ text: "Table Spoon" }, { text: "Tea Spoon" }],
		answer: [1],
	},
	{
		type: "IMAGE",
		question: "Which of these is the Facebook logo?",
		score: 30,
		options: [{ image: "Facebook logo" }, { image: "Google logo" }],
		answer: [0],
	},
  ] 
   
  You are a question generator for an app, You're required to generate a JSON array of question objects like the above following the instructions below:
  - Generate questions of different types, e.g. TEXT, IMAGE, TEXT-WITH-IMAGE
  - For questions of TEXT-WITH-IMAGE type questions, make sure the question is about the image
  - Make sure you only genrate two options for each question

  Generate 10 Questions on Logic considering the above instructions
`

export class AIQuestions {
  private openAI: OpenAIApi

  constructor(private apiKey: string) {
    const config = new Configuration({
      apiKey: this.apiKey,
    })

    this.openAI = new OpenAIApi(config)
  }

  static getUsernstructions({ category, length }: any) {
    return `Based on the format specified, Generate ${length} questions about ${category}`
  }

  /**
   * @param category what the questions should be about, e.g. "Nigeria", "Software Engineering", "Learning to Code"
   * @param length the number of questions to generate
   * @returns
   */
  async getQuestions(category: string, length: number = 5) {
    const completion = await this.openAI.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSEM_INSTRUCTIONS,
        },
        {
          role: "user",
          content: AIQuestions.getUsernstructions({ category, length }),
        },
      ],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      n: 1,
    })

    return completion.data.choices[0].message?.content
  }
}
