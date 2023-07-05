import { WordCoach, WordCoachProps } from "word-coach-react"
import React, { useEffect, useState } from "react"
import { Select, Switch, Input } from "@chakra-ui/react"

const questionsDB: WordCoachProps["questions"] = [
  {
    type: "TEXT_WITH_IMAGE",
    image:
      "https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",

    question: "What's the full meaning of 'UK'?",
    score: 30,
    options: [
      { text: "United Kingdom of UK edehdjhejhd" },
      { text: "Ultra Kingdom of UKE dhjedjedeg" },
    ],
    answer: [0],
    whyAnswer: [
      {
        heading: "Why the UK Flag differnt",
        text: "The flag of the United Kingdom is a defaced version of the flag of England.",
      },
      {
        heading: "What does the UK have in common",
        text: "The flag of the United Kingdom is a defaced version of the flag of England.",
      },
    ],
  },
  {
    type: "TEXT_WITH_IMAGE",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/510px-Flag_of_the_United_Kingdom_%281-2%29.svg.png",

    question: "This is the flag of which country?",
    score: 30,
    options: [{ text: "UK" }, { text: "USA" }],
    answer: [0],
    whyAnswer: [
      {
        heading: "Why the UK Flag differnt",
        text: "The flag of the United Kingdom is a defaced version of the flag of England.",
      },
      {
        heading: "What does the UK have in common",
        text: "The flag of the United Kingdom is a defaced version of the flag of England.",
      },
    ],
  },
  {
    type: "TEXT_WITH_IMAGE",
    image:
      "https://img.freepik.com/free-vector/cute-squirrel-standing-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium_138676-6545.jpg?w=2000",

    question: "What animal is this?",
    score: 30,
    options: [{ text: "Squirell" }, { text: "Rabbit" }],
    answer: [0],
    whyAnswer: [
      {
        heading: "Why the UK Flag differnt",
        text: "The flag of the United Kingdom is a defaced version of the flag of England.",
      },
      {
        heading: "What does the UK have in common",
        text: "The flag of the United Kingdom is a defaced version of the flag of England.",
      },
    ],
  },
  {
    type: "TEXT",
    question: "Which of these is the flag of Nigeria?",
    score: 30,
    options: [{ text: "🇳🇬🇳🇬🇳🇬" }, { text: "🇬🇭🇬🇭🇬🇭" }],
    answer: [0],
    whyAnswer: [
      {
        heading: "Why the UK Flag differnt",
        text: "The flag of the United Kingdom is a defaced version of the flag of England.",
      },
      {
        heading: "What does the UK have in common",
        text: "The flag of the United Kingdom is a defaced version of the flag of England.",
      },
    ],
  },
  {
    type: "TEXT",
    question: "What does this emoji mean '😎'?",
    score: 30,
    options: [{ text: "Crazy" }, { text: "Cool" }],
    answer: [1],
    whyAnswer: [
      {
        heading: "Why the UK Flag differnt",
        text: "The flag of the United Kingdom is a defaced version of the flag of England.",
      },
      {
        heading: "What does the UK have in common",
        text: "The flag of the United Kingdom is a defaced version of the flag of England.",
      },
    ],
  },
  {
    type: "IMAGE",
    question: "Which picture was taken in Ecuardor",
    score: 30,
    options: [
      {
        url: "https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      },
      {
        url: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      },
    ],
    answer: [1],
    whyAnswer: [
      {
        heading: "Why the UK Flag differnt",
        text: "The flag of the United Kingdom is a defaced version of the flag of England.",
      },
      {
        heading: "What does the UK have in common",
        text: "The flag of the United Kingdom is a defaced version of the flag of England.",
      },
    ],
  },
]

const propsDefination = {
  questions: {
    type: "WordCoachQuestion[]",
    description: "The questions to be asked",
    required: true,
  },
  defaultScore: {
    type: "number",
    description: "The default score for each question",
    default: 10,
    required: false,
  },
  theme: {
    type: "WordCoachTheme",
    linkToTypeDef:
      "https://github.com/plouc/nivo/blob/2250a31e23c05d6a223e632adb87ef5e74abafe2/website/src/lib/componentProperties.ts#L5",
    control: "select",
    description: "The color theme to be used",
    default: "nigeria",
    required: false,
    options: ["nigeria", "cobalt", "dark", "blacknwhite", "blue", "palenight"],
  },
  enableShuffle: {
    type: "boolean",
    description: "Enable shuffling of questions",
    default: true,
    required: false,
    control: "switch",
  },
  revealAnswerOnSkip: {
    type: "boolean",
    description: "Reveal answer when user skips a question",
    default: true,
    required: false,
    control: "switch",
  },

  isLoading: {
    type: "boolean",
    description: "Show loading state",
    default: false,
    required: false,
    control: "switch",
  },

  hasNextRound: {
    type: "boolean",
    description: "Show next round button",
    default: false,
    required: false,
    control: "switch",
  },
  onEnd: {
    type: "function",
    signature: "(measure, event) => void",
    description: "Callback when the game ends",
    default: false,
    required: false,
  },
  onSelectAnswer: {
    type: "function",
    signature: "(measure, event) => void",
    description: "Callback when the user selects an answer",
    default: false,
    required: false,
  },
  onClickNextRound: {
    type: "function",
    signature: "(measure, event) => void",
    description: "Callback when the user clicks the next round button",
    default: false,
    required: false,
  },
}

function Field({
  name,
  type,
  description,
  control,
  options,
  required,
  signature,
  onChange,
  value,
}: any) {
  if (control === "switch") {
    return (
      <div className="py-5 border-b px-5">
        <div className="flex gap-2">
          <span className="font-bold">{name}</span>
          <span className="text-gray-500">{type}</span>
          <span className="italic">{required ? "required" : "optional"}</span>
        </div>
        <div className="py-5">
          <Switch
            isChecked={value}
            size="lg"
            onChange={({ target }) => onChange(target.checked)}
          />
        </div>
        <div className="text-sm text-gray-600">The theme to be used</div>
      </div>
    )
  }
  if (control === "select") {
    return (
      <div className="py-5 border-b px-5">
        <div className="flex gap-2">
          <span className="font-bold">{name}</span>
          <span className="text-gray-500">{type}</span>
          <span className="">{required ? "required" : "optional"}</span>
        </div>
        <div className="py-5">
          <Select
            value={value}
            onChange={({ target }) => onChange(target.value)}
            placeholder="Select option"
          >
            {options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <div className="text-sm text-gray-600">The theme to be used</div>
      </div>
    )
  }
  if (type === "function") {
    return (
      <div className="py-5 border-b px-5">
        <div className="flex gap-2">
          <span className="font-bold">{name}</span>
          <span className="text-gray-500">{signature}</span>
          <span className="">{required ? "required" : "optional"}</span>
        </div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    )
  }
}

function Home() {
  const [wordCoachProps, setWordCoachProps] = useState({
    questions: [] as WordCoachProps["questions"],
    isLoading: true,
    enableShuffle: true,
    revealAnswerOnSkip: true,
    theme: "nigeria",
    defaultScore: 10,
    hasNextRound: true,
  })

  const fetchQuestions = async () => {
    await new Promise(resolve => setTimeout(() => resolve(true), 2000))

    setWordCoachProps(prev => ({
      ...prev,
      questions: questionsDB,
      isLoading: false,
    }))
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  return (
    <main className="h-screen bg-white flex flex-col font-sans">
      <div className="w-full h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-2/3 h-1/2 lg:h-full flex flex-col p-2 lg:p-0">
          <header className="pt-2 flex w-full lg:ml-10">
            <a
              role="button"
              href="https://github.com/marvinjude/word-coach"
              className="flex items-center hover:bg-gray-100 p-2 cursor-pointer rounded-full"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="20" fill="#006DFF" />
                <path
                  d="M6.976 15.12L7.024 15.072H7.232C8.18133 15.1253 9.38667 15.1307 10.848 15.088C11.2 15.0773 11.3973 15.1093 11.44 15.184C11.4507 15.216 11.4293 15.3387 11.376 15.552C11.3333 15.7547 11.2907 15.8773 11.248 15.92L11.2 15.968H10.976C10.4747 15.968 10.128 16.0107 9.936 16.096L9.872 16.128V16.24C9.88267 16.2827 9.968 17.5093 10.128 19.92L10.352 23.52L13.92 17.232L13.824 16.08V16.064C13.824 16.0533 13.7973 16.0373 13.744 16.016C13.6267 15.984 13.36 15.968 12.944 15.968C12.7093 15.968 12.576 15.9307 12.544 15.856C12.5227 15.824 12.5387 15.7013 12.592 15.488C12.656 15.264 12.6987 15.1413 12.72 15.12L12.768 15.072H12.976C13.9147 15.1253 15.12 15.1307 16.592 15.088C16.944 15.0773 17.1413 15.1093 17.184 15.184C17.1947 15.216 17.1787 15.3387 17.136 15.552C17.0827 15.7547 17.0347 15.8773 16.992 15.92L16.944 15.968H16.72C16.2293 15.968 15.888 16.0107 15.696 16.096L15.616 16.128V16.224C15.6267 16.2667 15.712 17.4933 15.872 19.904C16.0213 22.1973 16.096 23.4027 16.096 23.52C16.1173 23.5627 17.2853 21.5093 19.6 17.36C19.8987 16.8053 20.0533 16.5173 20.064 16.496C20.1067 16.4 20.0853 16.3093 20 16.224C19.808 16.0533 19.504 15.968 19.088 15.968C18.9813 15.968 18.912 15.9307 18.88 15.856C18.8587 15.824 18.8747 15.7013 18.928 15.488C18.992 15.264 19.0347 15.1413 19.056 15.12L19.104 15.072H19.312L20.368 15.104C20.944 15.1147 21.4347 15.1147 21.84 15.104L22.56 15.072C22.624 15.072 22.672 15.088 22.704 15.12C22.7467 15.1627 22.768 15.2 22.768 15.232L22.608 15.856V15.872C22.576 15.936 22.5013 15.968 22.384 15.968C22.0107 15.968 21.6853 16.032 21.408 16.16C21.184 16.2667 20.9973 16.432 20.848 16.656C20.8053 16.72 19.904 18.3093 18.144 21.424C16.384 24.5387 15.4827 26.128 15.44 26.192C15.3973 26.256 15.3547 26.2933 15.312 26.304C15.2587 26.336 15.136 26.352 14.944 26.352C14.7413 26.352 14.624 26.3413 14.592 26.32L14.528 26.256C14.5173 26.2453 14.4267 24.9707 14.256 22.432C14.096 19.8293 14.016 18.5547 14.016 18.608C14.016 18.5973 13.8667 18.848 13.568 19.36C13.2587 19.904 12.688 20.912 11.856 22.384C10.3947 24.944 9.65333 26.2347 9.632 26.256C9.568 26.32 9.408 26.352 9.152 26.352L8.864 26.336L8.816 26.288C8.784 26.256 8.768 26.2133 8.768 26.16C8.75733 26.1387 8.64533 24.4533 8.432 21.104C8.22933 17.7867 8.11733 16.112 8.096 16.08C8.08533 16.0587 8.05333 16.0373 8 16.016C7.808 15.984 7.54133 15.968 7.2 15.968C6.96533 15.968 6.82667 15.9307 6.784 15.856L6.768 15.808L6.848 15.488C6.89067 15.2853 6.93333 15.1627 6.976 15.12ZM28.7254 14.736H29.4294C30.304 14.8213 30.992 15.2 31.4934 15.872C31.5467 15.936 31.5787 15.9733 31.5894 15.984C31.5787 15.984 31.7547 15.8133 32.1174 15.472C32.576 15.0347 32.7947 14.8267 32.7734 14.848L32.9014 14.72H33.0294C33.168 14.72 33.248 14.752 33.2694 14.816C33.28 14.8373 33.104 15.5947 32.7414 17.088C32.3574 18.624 32.1654 19.376 32.1654 19.344C32.144 19.408 31.9947 19.44 31.7174 19.44H31.3814L31.3334 19.392C31.2907 19.3493 31.28 19.2533 31.3014 19.104C31.3014 19.0933 31.3067 19.04 31.3174 18.944C31.424 18.176 31.36 17.4933 31.1254 16.896C30.8694 16.192 30.4107 15.776 29.7494 15.648C29.5574 15.6053 29.264 15.6 28.8694 15.632C28.8374 15.6427 28.8107 15.648 28.7894 15.648C27.84 15.7867 26.9707 16.16 26.1814 16.768C25.1147 17.6427 24.3787 19.0133 23.9734 20.88C23.8347 21.4453 23.7654 21.9893 23.7654 22.512C23.7654 23.0027 23.8294 23.4133 23.9574 23.744C24 23.8827 24.0854 24.048 24.2134 24.24C24.6827 24.944 25.4347 25.344 26.4694 25.44C27.0774 25.504 27.664 25.392 28.2294 25.104C29.136 24.6667 29.84 23.9467 30.3414 22.944C30.4694 22.6773 30.576 22.4053 30.6614 22.128C30.7147 21.9573 30.768 21.8667 30.8214 21.856C30.8534 21.8453 30.944 21.84 31.0934 21.84C31.3387 21.84 31.472 21.872 31.4934 21.936C31.504 21.9787 31.4934 22.0533 31.4614 22.16C31.28 22.7893 30.9974 23.3707 30.6134 23.904C30.3147 24.3307 29.984 24.6933 29.6214 24.992C28.7147 25.792 27.7067 26.24 26.5974 26.336C26.2774 26.3787 25.9467 26.368 25.6054 26.304C24.56 26.176 23.7174 25.7653 23.0774 25.072C22.4587 24.4213 22.0854 23.6107 21.9574 22.64C21.8934 22.2027 21.8987 21.7067 21.9734 21.152C22.1654 19.776 22.7627 18.5067 23.7654 17.344C24.1387 16.9387 24.448 16.64 24.6934 16.448C25.76 15.5627 26.9067 15.0133 28.1334 14.8C28.1867 14.7893 28.384 14.768 28.7254 14.736Z"
                  fill="white"
                />
              </svg>
            </a>
          </header>
          <div className="flex-grow flex justify-center items-center">
            <WordCoach
              // streamEndPoint="/api/ai-questions"
              onClickNextRound={fetchQuestions}
              hasNextRound={wordCoachProps.hasNextRound}
              isLoading={wordCoachProps.isLoading}
              defaultScore={wordCoachProps.defaultScore}
              enableShuffle={false}
              revealAnswerOnSkip={wordCoachProps.revealAnswerOnSkip}
              theme={wordCoachProps.theme}
              onEnd={console.log}
              onSelectAnswer={console.log}
              questions={wordCoachProps.questions}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/3 h-screen text-black lg:border-l shadow flex flex-col">
          <header className="bg-gradient-to-r from-blue-700 to-blue-900 p-5 flex">
            <div>
              <h1 className="text-xl font-medium text-white">
                Configure Properties
              </h1>
              <p className="text-slate-300 text-sm">
                Configure your word coach component
              </p>
            </div>
            <div className="ml-auto">
              <button className="flex flex-col items-center text-white">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </span>
                <span className="text-sm">copy code</span>
              </button>
            </div>
          </header>

          <div className="overflow-scroll overflow-x-hidden h-full flex-1">
            <div className="py-5 border-b px-5">
              <div className="flex gap-2">
                <span className="font-bold">questions</span>
                <span className="text-gray-500">WordCoachQuestion[]</span>
                <span className="">required</span>
              </div>
              {/* Question Prop */}
              <div className="py-5">
                <div className="relative">
                  <div className="backdrop-blur-xs bg-white/30 absolute h-full w-full flex items-center justify-center z-1">
                    <button className="btn">
                      <span className="btn__text">Generate with AI</span>
                      <span className="btn__icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M9.5 2.672a.5.5 0 1 0 1 0V.843a.5.5 0 0 0-1 0v1.829Zm4.5.035A.5.5 0 0 0 13.293 2L12 3.293a.5.5 0 1 0 .707.707L14 2.707ZM7.293 4A.5.5 0 1 0 8 3.293L6.707 2A.5.5 0 0 0 6 2.707L7.293 4Zm-.621 2.5a.5.5 0 1 0 0-1H4.843a.5.5 0 1 0 0 1h1.829Zm8.485 0a.5.5 0 1 0 0-1h-1.829a.5.5 0 0 0 0 1h1.829ZM13.293 10A.5.5 0 1 0 14 9.293L12.707 8a.5.5 0 1 0-.707.707L13.293 10ZM9.5 11.157a.5.5 0 0 0 1 0V9.328a.5.5 0 0 0-1 0v1.829Zm1.854-5.097a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L8.646 5.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0l1.293-1.293Zm-3 3a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L.646 13.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0L8.354 9.06Z" />
                        </svg>
                      </span>
                      <span className="btn__border"></span>
                    </button>
                  </div>
                  <pre className="bg-gray-100 rounded text-sm p-4 max-h-40 monospace overflow-hidden">
                    {JSON.stringify(
                      [
                        {
                          type: "TEXT",
                          question: "What does this emoji mean '😎'?",
                          score: 30,
                          options: [{ text: "Crazy" }, { text: "Cool" }],
                          answer: [1],
                          whyAnswer: [
                            {
                              heading: "Why the UK Flag differnt",
                              text: "The flag of the United Kingdom is a defaced version of the flag of England.",
                            },
                            {
                              heading: "What does the UK have in common",
                              text: "The flag of the United Kingdom is a defaced version of the flag of England.",
                            },
                          ],
                        },
                      ],
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
              <div className="text-sm inline">
                Questions generated using{" "}
                <a
                  href="https://www.npmjs.com/package/@wordcoach/ai-questions"
                  target="_blank"
                >
                  <code className="rounded-md bg-stone-200 px-1.5 py-1 monospace font-medium text-black">
                    @wordcoach/ai-questions
                  </code>
                </a>{" "}
                <a
                  className="text-blue-500 hover:underline"
                  href="https://www.npmjs.com/package/@wordcoach/ai-questions"
                  target="_blank"
                >
                  Learn more
                </a>
              </div>
            </div>
            {/* Other Props */}
            {Object.keys(propsDefination).map(key => (
              <Field
                key={key}
                value={wordCoachProps[key]}
                name={key}
                {...propsDefination[key]}
                onChange={newValue => {
                  console.log(newValue)
                  setWordCoachProps({ ...wordCoachProps, [key]: newValue })
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
