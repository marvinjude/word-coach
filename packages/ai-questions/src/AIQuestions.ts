import { Configuration, OpenAIApi } from 'openai-edge';
import csv from 'csvtojson';
import { queryToImageURLs } from './utils/queryToImageURLs';

export enum QuestionTypes {
  TEXT = 'TEXT',
  TEXT_WITH_IMAGE = 'TEXT_WITH_IMAGE',
  IMAGE = 'IMAGE',
}

const TRAINING_DATA_CSV_HEADER = `type,question,image,score,options.0,options.1,answer.0`;

const SYSEM_INSTRUCTIONS = `
You are a question generator for an app, You're required to generate a CSV like the below without the header:

${TRAINING_DATA_CSV_HEADER}
${QuestionTypes.TEXT},"How many days make up a week","-",30,"11","7",1
${QuestionTypes.TEXT_WITH_IMAGE},"Who invented this device?","A Radio image",30,"Reginald A. Fessenden","Bill Gates",0
${QuestionTypes.TEXT_WITH_IMAGE},"Who is this spoon called?","A Tea spoon image",30,"Table Spoon","Tea Spoon",1
${QuestionTypes.IMAGE},"Which of these is the Facebook logo?","-",30,"Facebook logo image","Google logo image",0
${QuestionTypes.TEXT_WITH_IMAGE},"Who is the name of this famous landmark","effiel tower image",30,"Standing Tower","Eiffel Tower",1
${QuestionTypes.IMAGE},"Which of this is stones is diamond?","-",30,"Topaz image","Diamond image",1
${QuestionTypes.IMAGE},"Which of these is the iPhone 14?","-",30,"iPhone 14 image","iphone X image",0

These are the instructions to follow:
- For questions of ${QuestionTypes.TEXT_WITH_IMAGE} type, make sure the question is about the image
- Don't include the CSV header in your result
- Make sure you only respond with the CSV requested and nothing more
- Each question should have 2 options
- questionIndex should be ordered from 0 to the number of questions requested
- For questions of type ${QuestionTypes.TEXT} and ${QuestionTypes.IMAGE} the "image" field will always be a "-"
`;

export class AIQuestions {
  private openAI: OpenAIApi;

  constructor(private openAIAPIKey: string) {
    const config = new Configuration({
      apiKey: this.openAIAPIKey,
    });

    this.openAI = new OpenAIApi(config);
  }

  static async StreamResponse(
    stream: ReadableStream<Uint8Array> | null,
    response: any,
    { dataLength }: { dataLength: number }
  ) {
    let csvLine = '';
    let counter = 0;

    const reader = stream?.getReader();

    if (!reader) {
      throw new Error('Failed to get the reader');
    }

    response.writeHead(200, { 'Content-Type': 'text/plain' });

    const processQuestion = async (question: any) => {
      const hasImageDescription =
        question.type === QuestionTypes.IMAGE ||
        question.type === QuestionTypes.TEXT_WITH_IMAGE;

      return hasImageDescription
        ? await AIQuestions.replaceImageDescriptionWithUrl(question)
        : question;
    };

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          const [question] = await csv().fromString(
            `${TRAINING_DATA_CSV_HEADER}\n${csvLine.replace(/\n$/, '')}`
          );

          response.end({
            done: true,
            data: {
              dataLength,
              question: await processQuestion({
                ...question,
                questionIndex: counter++,
              }),
            },
          });
        }

        const lines = new TextDecoder()
          .decode(value)
          .split('\n')
          .filter((line) => line.trim() !== '');

        if (lines.length === 0) {
          throw new Error('No lines found');
        }

        for (const line of lines) {
          const message = line.replace(/^data: /, '');

          if (message === '[DONE]') {
            console.log('csvLine', csvLine);
            const [question] = await csv().fromString(
              `${TRAINING_DATA_CSV_HEADER}\n${csvLine.replace(/\n$/, '')}`
            );
            return response.end(
              JSON.stringify({
                done: true,
                data: {
                  dataLength,
                  question: await processQuestion({
                    ...question,
                    questionIndex: counter++,
                  }),
                },
              })
            );
          }

          try {
            const { choices } = JSON.parse(message);

            if (choices[0]?.delta?.content) {
              csvLine += choices[0].delta.content;
            }

            if (csvLine.endsWith('\n')) {
              console.log('csvLine', csvLine);
              const [question] = await csv().fromString(
                `${TRAINING_DATA_CSV_HEADER}\n${csvLine.replace(/\n$/, '')}`
              );

              response.write(
                JSON.stringify({
                  done: false,
                  data: {
                    dataLength,
                    question: await processQuestion({
                      ...question,
                      questionIndex: counter++,
                    }),
                  },
                })
              );
              csvLine = '';
            }
          } catch (error) {
            console.error(
              'Could not JSON parse stream message:',
              message,
              error
            );
          }
        }
      }
    } catch (error) {
      console.error('An error occurred while reading the stream:', error);
    } finally {
      reader.releaseLock();
    }
  }

  getUserInstructions({
    description,
    length,
    types,
  }: {
    description: string;
    length: number;
    types: string[];
  }) {
    return `Based on the format specified above, Generate ${length} questions of type: ${types?.join(
      ','
    )}. To generate the questions, think about 10 non common topics in your head,  about ${description} and pick one of the topics randomly
    All questions should be about the topic you picked.
   `;
  }

  /**
   *  Some of the generated questions have an image descriptions and not actual image URL
   *  so we need to fetch images URL for them on Google Images and replace the image description with the URL
   */
  static async replaceImageDescriptionWithUrl(question: any): Promise<any> {
    if (question.type === QuestionTypes.TEXT_WITH_IMAGE) {
      const imageURLs = await queryToImageURLs(question.image);
      return { ...question, image: imageURLs[1].original };
    }

    if (question.type === QuestionTypes.IMAGE) {
      const imageURLsPromises = question.options.map((option: any) =>
        queryToImageURLs(option)
      );

      const results = await Promise.allSettled(imageURLsPromises);

      return {
        ...question,
        options: results.map((result: any) => result.value[1].original),
      };
    }
  }

  /**
   * @param {string} category - The author of the book.
   * @param category what the questions should be about, e.g. "Software Engineering", "Learning to Code"
   * @param length the number of questions to generate
   * @returns a response stream

   */
  async getQuestionsStream({
    description,
    length,
    types = [
      QuestionTypes.IMAGE,
      QuestionTypes.TEXT,
      QuestionTypes.TEXT_WITH_IMAGE,
    ],
  }: {
    description: string;
    length: number;
    types?: string[];
  }): Promise<ReadableStream<Uint8Array> | null> {
    const allQuestionTypes = Object.values(QuestionTypes);
    const typesString = types || allQuestionTypes;

    const completion = await this.openAI.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: SYSEM_INSTRUCTIONS,
        },
        {
          role: 'user',
          content: this.getUserInstructions({
            description,
            length,
            types: typesString,
          }),
        },
      ],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      n: 1,
    });

    return completion.body;
  }
}
