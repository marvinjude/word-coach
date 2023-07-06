import { WordCoach } from "word-coach-react"
import React, { useEffect } from "react"

import "./styles.css"

const questionsDB = [
  {
    type: "TEXT",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/510px-Flag_of_the_United_Kingdom_%281-2%29.svg.png",

    question: "This is the flag of which country?",
    score: 30,
    options: ["UK", "USA"],
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
    image:
      "https://img.freepik.com/free-vector/cute-squirrel-standing-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium_138676-6545.jpg?w=2000",

    question: "What animal is this?",
    score: 30,
    options: ["Squirell", "Rabbit"],
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
    options: ["🇳🇬🇳🇬🇳🇬", "🇬🇭🇬🇭🇬🇭"],
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
    options: ["Crazy", "Cool"],
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
    type: "TEXT",
    image:
      "https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",

    question: "What's the full meaning of 'UK'?",
    score: 30,
    options: ["United Kingdom", "Ultra Kingdom"],
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
    type: "IMAGE",
    question: "Which picture was taken in Ecuardor",
    score: 30,
    options: [
      "https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
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

function App() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [questions, setQuestions] = React.useState([])

  const fetchQuestions = async () => {
    await new Promise(resolve => setTimeout(() => resolve(true), 2000))

    setIsLoading(false)
    setQuestions(questionsDB)
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  return (
    <div
      style={{
        background: "green",
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Manrope",
      }}
    >
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          padding: "5rem",
        }}
      >
        <WordCoach
          mode="static"
          onClickNextRound={fetchQuestions}
          hasNextRound={true}
          isLoading={isLoading}
          defaultScore={10}
          enableShuffle
          title={"GraphQL Test"}
          revealAnswerOnSkip={true}
          theme="nigeria"
          defaulScore={10}
          onEnd={console.log}
          enbleShuffle={true}
          onSelectAnswer={({ answerIndex }) => console.log("onSelectAnswer")}
          questions={questions}
        />
      </div>
    </div>
  )
}

export default App
