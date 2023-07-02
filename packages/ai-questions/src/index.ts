import { Configuration, OpenAIApi } from "openai-edge"
import csv from "csvtojson"

type QuestionType = "TEXT" | "TEXT-WITH-IMAGE" | "IMAGE"

const TRAINING_DATA_CSV_HEADER = `questionIndex,type,question,image,score,options,answer`

const SYSEM_INSTRUCTIONS = `
You are a question generator for an app, You're required to generate a CSV like the below:

${TRAINING_DATA_CSV_HEADER}
0,TEXT,"How many days make up a week",NULL,30,"7, 11","0"
1,TEXT-WITH-IMAGE,"Who invented this device?","A Radio",30,"Reginald A. Fessenden, Bill Gates","0"
3,TEXT-WITH-IMAGE,"Who is this spoon called?","A Tea spoon",30,"Table Spoon, Tea Spoon","1"
4,IMAGE,"Which of these is the Facebook logo?",NULL,30,"Facebook logo, Google logo","0"

These are the instructions to follow:
- For questions of TEXT-WITH-IMAGE type questions, make sure the question is about the image
- Only generate two options per question
- Don't inlcude the CSV header
- Make sure you only respond with the CSV requested and nothing more
`

export class AIQuestions {
  private openAI: OpenAIApi

  constructor(private apiKey: string) {
    const config = new Configuration({
      apiKey: this.apiKey,
    })

    this.openAI = new OpenAIApi(config)
  }

  static async StreamResponse(
    stream: ReadableStream<Uint8Array> | null,
    response: any,
    { dataLength }: { dataLength: number }
  ) {
    let csvLine = ""

    const reader = stream?.getReader()

    if (!reader) {
      throw new Error("Failed to get the reader")
    }

    response.writeHead(200, { "Content-Type": "text/plain" })

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          response.end()
        }

        const lines = new TextDecoder()
          .decode(value)
          .split("\n")
          .filter(line => line.trim() !== "")

        if (lines.length === 0) {
          throw new Error("No lines found")
        }

        for (const line of lines) {
          const message = line.replace(/^data: /, "")

          if (message === "[DONE]") {
            const [question] = await csv().fromString(
              `${TRAINING_DATA_CSV_HEADER}\n${csvLine.replace(/\n$/, "")}`
            )
            return response.end(
              JSON.stringify({
                done: true,
                data: {
                  dataLength,
                  question,
                },
              })
            )
          }

          try {
            const { choices } = JSON.parse(message)

            if (choices[0]?.delta?.content) {
              csvLine += choices[0].delta.content
            }

            if (csvLine.endsWith("\n")) {
              const [question] = await csv().fromString(
                `${TRAINING_DATA_CSV_HEADER}\n${csvLine.replace(/\n$/, "")}`
              )
              response.write(
                JSON.stringify({
                  done: false,
                  data: {
                    dataLength,
                    question,
                  },
                })
              )
              csvLine = ""
            }
          } catch (error) {
            console.error(
              "Could not JSON parse stream message:",
              message,
              error
            )
          }
        }
      }
    } catch (error) {
      console.error("An error occurred while reading the stream:", error)
    } finally {
      reader.releaseLock()
    }
  }

  static getUserInstructions({
    category,
    length,
    types,
  }: {
    category: string
    length: number
    types?: QuestionType[]
  }) {
    const allQuestionTypes: QuestionType[] = [
      "TEXT",
      "TEXT-WITH-IMAGE",
      "IMAGE",
    ]
    const typesString = types?.join(",") || allQuestionTypes.join(",")

    return `Based on the format specified above, Generate ${length} questions of type: ${typesString} about ${category}`
  }

  /**
   * Fetch potential images from Google Images
   */
  async getImageURL(imageDescriptions: Array<any>) {
    return []
  }

  /**
   *  Some of the generated questions have an image descriptions and not actual image URL
   *  so we need to fetch images URL for them on Google Images and replace the image description with the URL
   */
  async replaceImageDescriptionWithUrl(questions: any): Promise<any> {
    const newQuestions: any = questions.filter((question: any) => {
      return question.type !== "TEXT"
    })

    for (const question of questions.filter) {
      if (question.type === "TEXT-WITH-IMAGE") {
        const [imageURL] = await this.getImageURL([question.image])
        newQuestions.push({ ...question, image: imageURL })
      }

      if (question.type === "IMAGE") {
        const imageURLs = await this.getImageURL(
          question.options.map((option: any) => option.image)
        )

        newQuestions.push({
          ...question,
          options: question.options.map((option: any, index: number) => ({
            ...option,
            url: imageURLs[index],
          })),
        })
      }
    }

    return newQuestions
  }

  /**
   * @param category what the questions should be about, e.g. "Nigeria", "Software Engineering", "Learning to Code"
   * @param length the number of questions to generate
   * @returns
   */
  async getQuestionsStream(
    category: string,
    length: number = 5,
    types?: QuestionType[]
  ): Promise<ReadableStream<Uint8Array> | null> {
    const completion = await this.openAI.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSEM_INSTRUCTIONS,
        },
        {
          role: "user",
          content: AIQuestions.getUserInstructions({
            category,
            length,
            types,
          }),
        },
      ],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      n: 1,
    })

    return completion.body
  }
}
