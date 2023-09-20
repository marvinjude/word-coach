import { WordCoach, IQuestions, WordCoachProps } from "@word-coach/react"
import React, { useEffect, useState } from "react"
import Field from "@/components/Field"
import CopyCode from "@/components/CopyCode"
import type { IControlsState, IPropDefinitions } from "@/types"
import { questions } from "@/data"

const propsDefinition: IPropDefinitions = {
  mode: {
    type: "string",
    description: "Specifies wether to strem question or use static questions",
    required: true,
    control: "radio",
    options: ["stream", "static"],
    showControl: true,
  },
  questions: {
    type: "WordCoachQuestion[]",
    description: "Questions generated using @wordcoach/ai-questions Learn more",
    required: true,
    showControl: ({ mode }) => mode === "static",
    control: "fetchQ",
  },
  defaultScore: {
    type: "number",
    description: "The default score for each question",
    default: 10,
    required: false,
    control: "text",
    showControl: true,
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
    showControl: true,
  },
  enableShuffle: {
    type: "boolean",
    description: "Enable shuffling of questions",
    default: true,
    required: false,
    control: "switch",
    showControl: ({ mode }) => mode === "static",
  },
  revealAnswerOnSkip: {
    type: "boolean",
    description: "Reveal answer when user skips a question",
    default: true,
    required: false,
    control: "switch",
    showControl: true,
  },
  isLoading: {
    type: "boolean",
    description: "Show loading state",
    default: false,
    required: false,
    control: "switch",
    showControl: ({ mode }) => mode === "static",
  },
  hasNextRound: {
    type: "boolean",
    description: "Show next round button",
    default: false,
    required: false,
    control: "switch",
    showControl: true,
  },
  onEnd: {
    type: "function",
    signature: "(measure, event) => void",
    description: "Callback when the game ends",
    default: false,
    required: false,
    showControl: true,
    control: "function",
  },
  onSelectAnswer: {
    type: "function",
    signature: "(measure, event) => void",
    description: "Callback when the user selects an answer",
    default: false,
    required: false,
    showControl: true,
    control: "function",
  },
  onClickNextRound: {
    type: "function",
    signature: "(measure, event) => void",
    description: "Callback when the user clicks the next round button",
    default: false,
    required: false,
    showControl: true,
    control: "function",
  },
  onChunk: {
    type: "function",
    signature: "(measure, event) => void",
    description: "Callback when the user clicks the next round button",
    default: false,
    required: false,
    showControl: true,
    control: "function",
  },
  streamEndpoint: {
    type: "string",
    description: "The endpoint to fetch questions from",
    default: false,
    required: false,
    showControl: ({ mode }) => mode === "stream",
    control: "text",
  },
}

function Home() {
  /**
   * Defines all possible states and their inital value here
   */
  const [wordCoachProps, setWordCoachProps] = useState<IControlsState>({
    questions: [] as IQuestions,
    isLoading: true,
    enableShuffle: true,
    revealAnswerOnSkip: true,
    theme: "nigeria",
    defaultScore: 10,
    hasNextRound: true,
    mode: "static",
    streamEndpoint: "/api/ai-questions",
  })

  const [streamProgress, setStreamProgress] = useState([0, 0])
  const [isStreamingDone, setIsStreamingDone] = useState(false);

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    await new Promise(resolve => setTimeout(() => resolve(true), 2000))

    setWordCoachProps({
      ...wordCoachProps,
      questions,
      isLoading: false,
    })
  }

  const commonProps = {
    theme: wordCoachProps.theme,
    onClickNextRound: fetchQuestions,
    hasNextRound: wordCoachProps.hasNextRound,
    defaultScore: wordCoachProps.defaultScore,
    revealAnswerOnSkip: wordCoachProps.revealAnswerOnSkip,
    onEnd: console.log,
    onSelectAnswer: console.log,
  }

  const streamModeProps: WordCoachProps = {
    ...commonProps,
    mode: 'stream',
    streamEndPoint: wordCoachProps.streamEndpoint,
    onChunk: (chunk: any) => {
      if (+chunk.question.questionIndex === 0) {
        setIsStreamingDone(false)
      }

      setStreamProgress([chunk.question.questionIndex + 1, chunk.dataLength])

      if ((+chunk.question.questionIndex + 1) === +chunk.dataLength) {
        setIsStreamingDone(true)
      }
    },
  }

  const staticModeProps: WordCoachProps = {
    ...commonProps,
    mode: 'static',
    isLoading: wordCoachProps.isLoading,
    enableShuffle: false,
    questions: wordCoachProps.questions,
  }


  const props = {
    ...(wordCoachProps.mode === "stream" ? streamModeProps : {}),
    ...(wordCoachProps.mode === "static" ? staticModeProps : {}),
  }


  return (
    <main className="h-screen bg-white flex flex-col font-sans">
      <div className="w-full h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-2/3 h-1/2 lg:h-full flex flex-col p-2 lg:p-0">
          <header className="pt-2 flex w-full lg:pl-10">
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
          <div className="flex-grow flex justify-center items-center relative">
            <WordCoach {...(props as WordCoachProps)} />
            {wordCoachProps.mode === "stream" && !isStreamingDone && (
              <div className="absolute bottom-0 right-0 p-4">
                <div className="p-2 flex gap-1 font-medium items-center text-sm text-gray-600">
                  <svg
                    className="ios-spinner scale-75"
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="27"
                    viewBox="0 0 27 27"
                  >
                    <path d="M18.696,10.5c-0.275-0.479-0.113-1.09,0.365-1.367l4.759-2.751c0.482-0.273,1.095-0.11,1.37,0.368 c0.276,0.479,0.115,1.092-0.364,1.364l-4.764,2.751C19.583,11.141,18.973,10.977,18.696,10.5z" />
                    <path d="M16.133,6.938l2.75-4.765c0.276-0.478,0.889-0.643,1.367-0.366c0.479,0.276,0.641,0.886,0.365,1.366l-2.748,4.762 C17.591,8.415,16.979,8.58,16.5,8.303C16.021,8.027,15.856,7.414,16.133,6.938z" />
                    <path d="M13.499,7.5c-0.552,0-1-0.448-1-1.001V1c0-0.554,0.448-1,1-1c0.554,0,1.003,0.447,1.003,1v5.499 C14.5,7.053,14.053,7.5,13.499,7.5z" />
                    <path d="M8.303,10.5c-0.277,0.477-0.888,0.641-1.365,0.365L2.175,8.114C1.697,7.842,1.532,7.229,1.808,6.75 c0.277-0.479,0.89-0.642,1.367-0.368l4.762,2.751C8.416,9.41,8.58,10.021,8.303,10.5z" />
                    <path d="M9.133,7.937l-2.75-4.763c-0.276-0.48-0.111-1.09,0.365-1.366c0.479-0.277,1.09-0.114,1.367,0.366l2.75,4.765 c0.274,0.476,0.112,1.088-0.367,1.364C10.021,8.581,9.409,8.415,9.133,7.937z" />
                    <path d="M6.499,14.5H1c-0.554,0-1-0.448-1-1c0-0.554,0.447-1.001,1-1.001h5.499c0.552,0,1.001,0.448,1.001,1.001 C7.5,14.052,7.052,14.5,6.499,14.5z" />
                    <path d="M8.303,16.502c0.277,0.478,0.113,1.088-0.365,1.366l-4.762,2.749c-0.478,0.273-1.091,0.112-1.368-0.366 c-0.276-0.479-0.111-1.089,0.367-1.368l4.762-2.748C7.415,15.856,8.026,16.021,8.303,16.502z" />
                    <path d="M10.866,20.062l-2.75,4.767c-0.277,0.475-0.89,0.639-1.367,0.362c-0.477-0.277-0.642-0.886-0.365-1.365l2.75-4.764 c0.277-0.477,0.888-0.638,1.366-0.365C10.978,18.974,11.141,19.585,10.866,20.062z" />
                    <path d="M13.499,19.502c0.554,0,1.003,0.448,1.003,1.002v5.498c0,0.55-0.448,0.999-1.003,0.999c-0.552,0-1-0.447-1-0.999v-5.498 C12.499,19.95,12.946,19.502,13.499,19.502z" />
                    <path d="M17.867,19.062l2.748,4.764c0.275,0.479,0.113,1.088-0.365,1.365c-0.479,0.276-1.091,0.112-1.367-0.362l-2.75-4.767 c-0.276-0.477-0.111-1.088,0.367-1.365C16.979,18.424,17.591,18.585,17.867,19.062z" />
                    <path d="M18.696,16.502c0.276-0.48,0.887-0.646,1.365-0.367l4.765,2.748c0.479,0.279,0.64,0.889,0.364,1.368 c-0.275,0.479-0.888,0.64-1.37,0.366l-4.759-2.749C18.583,17.59,18.421,16.979,18.696,16.502z" />
                    <path d="M25.998,12.499h-5.501c-0.552,0-1.001,0.448-1.001,1.001c0,0.552,0.447,1,1.001,1h5.501c0.554,0,1.002-0.448,1.002-1 C27,12.946,26.552,12.499,25.998,12.499z" />
                  </svg>
                  {streamProgress[0]}/{streamProgress[1]} QUESTIONS FETCHED
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-1/3 h-screen text-black lg:border-l shadow flex flex-col">
          <header className="bg-gradient-to-r from-blue-700 to-blue-900 p-5 flex">
            <div className="flex-1">
              <h1 className="text-xl font-medium text-white">
                Configure Properties
              </h1>
              <p className="text-slate-300 text-sm">
                Configure your word coach component
              </p>
            </div>
            <div className="ml-auto">
              <CopyCode {...(props as WordCoachProps)} />
            </div>
          </header>

          <div className="overflow-scroll overflow-x-hidden h-full flex-1">
            {Object.keys(propsDefinition).map(key => {
              return (
                <Field
                  controlsState={wordCoachProps}
                  key={key}
                  value={wordCoachProps[key]}
                  name={key}
                  {...propsDefinition[key]}
                  onChange={newValue => {
                    setWordCoachProps(prev => ({ ...prev, [key]: newValue }))
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
