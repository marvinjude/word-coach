import React from 'react'
import { useState } from 'react'
import type { WordCoachProps } from '@word-coach/react';

const CopyCode: React.FC<WordCoachProps> = (props) => {
  const [pressed, setPressed] = useState(false)

  const onMouseDown = () => {
    setPressed(true)
  }

  const onMouseUp = () => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout)
      setPressed(false)
    }, 1000)
  }

  const copyCodeToClipboard = () => {
    let text = "";

    if (props.mode === 'static') {
      const { mode, theme, defaultScore, enableShuffle, isLoading, hasNextRound } = props;

      text = `
      import { WordCoach } from '@wordcoach/react'

      <WordCoach
        mode={${mode}}
        onClickNextRound={(nextRoundData) => console.log(nextRoundData)}
        hasNextRound={${hasNextRound}}
        isLoading={${isLoading}}
        defaultScore={${defaultScore}}
        enableShuffle={${enableShuffle}}
        revealAnswerOnSkip={true}
        theme={${theme}}
        defaulScore={10}
        onEnd={console.log}
        enbleShuffle={true}
        onSelectAnswer={({ answerIndex }) => console.log("onSelectAnswer")}
        questions={questions}
     />`
    }

    if (props.mode === 'stream') {
      const { mode, theme, defaultScore, hasNextRound, revealAnswerOnSkip } = props;

      text = `
      import { WordCoach } from '@wordcoach/react'

      <WordCoach
        mode={"${mode}"}
        onClickNextRound={(nextRoundData) => console.log(nextRoundData)}
        hasNextRound={${hasNextRound}}
        defaultScore={${defaultScore}}
        revealAnswerOnSkip={${revealAnswerOnSkip}}
        theme={"${theme}"}
        defaulScore={10}
        onEnd={console.log}
        enbleShuffle={true}
        onSelectAnswer={({ answerIndex }) => console.log("onSelectAnswer")}
        questions={questions}
     />`
    }

    navigator.clipboard.writeText(text)
  }

  return (
    <button
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      className="flex flex-col items-center text-white"
      onClick={copyCodeToClipboard}
    >
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
      <span className="text-sm w-24">{pressed ? "Copied" : "Copy code"}</span>
    </button>
  )
}


export default CopyCode;