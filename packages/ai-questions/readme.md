## @wordcoach/ai-questions

Package to generate questions for your WordCoach Component using OpenAI's completions API. see [demo](https://wordcoasch.xyz).

### How it works

Based on some predefined question format, this package streams questions from OpenAI Completions API and replaace image description using Google Image

### Installation

```bash
npm i @word-coach/ai-questions
```

### Usage

**Basic Usage**

```ts
import { AIQuestions } from "@word-coach/ai-questions"

const aiQuestions = new AIQuestions(OPENAI_API_KEY)

const stream = await aiQuestions.getQuestions({
  category: "ReactJS",
  length: 5,
})

...
```
> We recommend using the `getQuestionsStream` as responses may take a while


**_Streaming to Client / WordCoach Component_**

```ts
import { AIQuestions } from "@word-coach/ai-questions"

const aiQuestions = new AIQuestions(OPENAI_API_KEY)

const stream = await aiQuestions
  .getQuestionsStream({
    category: "ReactJS",
    length: 5,
  })

  // Stream Response to Client
  .AIQuestions.StreamResponse(stream, response, {
    dataLength: 5,
  })
```

### License

MIT c Jude Agboola 2023
