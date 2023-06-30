import { Configuration, OpenAIApi } from "openai"
import { writeFileSync } from "fs"

const openAPI = new OpenAIApi(
  new Configuration({
    apiKey: "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",
  })
)

;(async () => {
  const response = await openAPI.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        content: `
            {
                type: "TEXT",
                question: "Which of these is the flag of Nigeria?",
                score: 30,
                options: [{ text: "🇳🇬🇳🇬🇳🇬" }, { text: "🇬🇭🇬🇭🇬🇭" }],
                answer: [0],
            },

            You a question generator for an app, You're required to generate a JSON with 5 question objects like the above on geography that can be used by an app.
            1. Make sure your response is a valid JSON text that I can pass into JSON.parse()
            2. Each question should only have only two options
            3. the "type" field can only be "TEXT"
            `,
        role: "user",
        name: "Dustin",
      },
    ],
  })

  writeFileSync(
    "output.json",
    JSON.stringify(
      JSON.parse(response.data.choices[0].message.content),
      null,
      2
    )
  )
})()

import  WordCoach from "word-coach-react"

console.log(WordCoach)
