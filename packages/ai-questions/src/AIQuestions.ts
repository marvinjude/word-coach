import { Configuration, OpenAIApi } from "openai-edge"
import csv from "csvtojson"
import { queryToImageURLs } from "./utils/queryToImageURLs"

//Todo: move type to common package
export enum QuestionTypes {
  TEXT = "TEXT",
  TEXT_WITH_IMAGE = "TEXT_WITH_IMAGE",
  IMAGE = "IMAGE",
}

const TRAINING_DATA_CSV_HEADER = `questionIndex,type,question,image,score,options,answer`

const SYSEM_INSTRUCTIONS = `
You are a question generator for an app, You're required to generate a CSV like the below:

${TRAINING_DATA_CSV_HEADER}
0,${QuestionTypes.TEXT},"How many days make up a week",NULL,30,"7, 11","0"
1,${QuestionTypes.TEXT_WITH_IMAGE},"Who invented this device?","A Radio",30,"Reginald A. Fessenden, Bill Gates","0"
3,${QuestionTypes.TEXT_WITH_IMAGE},"Who is this spoon called?","A Tea spoon",30,"Table Spoon, Tea Spoon","1"
4,${QuestionTypes.IMAGE},"Which of these is the Facebook logo?",NULL,30,"Facebook logo, Google logo","0"

These are the instructions to follow:
- For questions of ${QuestionTypes.TEXT_WITH_IMAGE} type questions, make sure the question is about the image
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

    const processQuestion = async (question: any) => {
      const hasImageDescription =
        question.type === QuestionTypes.IMAGE ||
        question.type === QuestionTypes.TEXT_WITH_IMAGE

      return hasImageDescription
        ? await AIQuestions.replaceImageDescriptionWithUrl(question)
        : question
    }

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          const [question] = await csv().fromString(
            `${TRAINING_DATA_CSV_HEADER}\n${csvLine.replace(/\n$/, "")}`
          )

          response.end({
            done: true,
            data: {
              dataLength,
              question: await processQuestion(question),
            },
          })
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
                  question: await processQuestion(question),
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
                    question: await processQuestion(question),
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

  getUserInstructions({
    category,
    length,
    types,
    optionsLength,
  }: {
    category: string
    length: number
    types: string[]
    optionsLength: number
  }) {
    return `Based on the format specified above, Generate ${length} questions of type: ${types?.join(
      ","
    )} about ${category}.Each question should have ${optionsLength} comma separated options`
  }

  /**
   *  Some of the generated questions have an image descriptions and not actual image URL
   *  so we need to fetch images URL for them on Google Images and replace the image description with the URL
   */
  static async replaceImageDescriptionWithUrl(question: any): Promise<any> {
    if (question.type === QuestionTypes.TEXT_WITH_IMAGE) {
      const [imageURL] = await queryToImageURLs(question.image)
      return { ...question, image: imageURL.original }
    }

    if (question.type === QuestionTypes.IMAGE) {
      const imageURLsPromises = question.options
        .split(",")
        .map((option: any) => queryToImageURLs(option))

      const results = await Promise.allSettled(imageURLsPromises)

      return {
        ...question,
        options: results
          .map((result: any) => result.value[0].original)
          .join(","),
      }
    }
  }

  /**
   * @param category what the questions should be about, e.g. "Nigeria", "Software Engineering", "Learning to Code"
   * @param length the number of questions to generate
   * @returns
   */
  async getQuestionsStream({
    category,
    length,
    types = [
      QuestionTypes.IMAGE,
      QuestionTypes.TEXT,
      QuestionTypes.TEXT_WITH_IMAGE,
    ],
    optionsLength = 2,
  }: {
    category: string
    length: number
    types?: string[]
    optionsLength?: number
  }): Promise<ReadableStream<Uint8Array> | null> {
    const allQuestionTypes = Object.values(QuestionTypes)
    const typesString = types || allQuestionTypes

    const completion = await this.openAI.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSEM_INSTRUCTIONS,
        },
        {
          role: "user",
          content: this.getUserInstructions({
            category,
            length,
            types: typesString,
            optionsLength,
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
