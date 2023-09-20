import React from "react"
import Button from "../components/Button"
import Score from "../components/Score"
import AccordionItem from "../components/Accordion"
import CircularProgress from "../components/CircularProgress"

import Cross from "../icons/cross"
import Check from "../icons/check"
import QuestionMark from "../icons/question-mark"

import styles from "../styles/styles.module.scss"

import callbackCaller from "../utils/callbackCaller"

import { QuestionTypes } from "../types"

import { classNames } from "../utils"
import { EndScreenProps } from "../WordCoach"

const ImageWithHint: React.FC<{
  url: string
  hint?: () => React.ReactNode
}> = ({ url, hint }) => {
  return (
    <div className={styles.image_w_hint}>
      <img className={styles.image_w_hint__image} src={url} />
      {hint && <div className={styles.image_w_hint__hint}>{hint()}</div>}
    </div>
  )
}

const Explainer = ({ question }) => {
  return (
    <div className={styles.explainer}>
      {question.type === "TEXT" && (
        <div>
          {question.image && <ImageWithHint url={question.image} />}
          <div
            className={classNames(styles.explainer__image_group, {
              [styles.explainer__image_group_with_image]: question.image,
              [styles.explainer__image_group_without_image]: !question.image,
            })}
          >
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: question.answer.includes(optionIndex)
                    ? "green"
                    : "red",
                }}
              >
                <span>
                  {question.answer.includes(optionIndex) ? (
                    <Check />
                  ) : (
                    <Cross />
                  )}
                </span>
                {option}
              </div>
            ))}
          </div>
        </div>
      )}

      {question.type === QuestionTypes.IMAGE && (
        <div style={{ display: "flex", gap: "1rem" }}>
          {question.options.map((option, optionIndex) => (
            <ImageWithHint
              key={optionIndex}
              url={option}
              hint={() =>
                question.answer.includes(optionIndex) ? <Check /> : <Cross />
              }
            />
          ))}
        </div>
      )}

      {question.whyAnswer && (
        <div
          style={{
            textAlign: "left",
            padding: "1rem 1rem 1rem 0rem",
          }}
        >
          <div style={{ fontWeight: "bold", paddingBottom: "1rem" }}>
            LEARN WHY
          </div>
          {question.whyAnswer.map(({ heading, text }, index) => (
            <div key={index}>
              <div>{heading}</div>
              <div style={{ padding: "0.5rem 0 1rem 0", color: "gray" }}>
                {text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const ScoreArea = ({
  percentageCorrect,
  correctAnswerCount,
  questionsCount,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <CircularProgress percentage={percentageCorrect}>
        {correctAnswerCount}/{questionsCount}
      </CircularProgress>
      <div
        style={{
          marginLeft: "0.8rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "baseline",
        }}
      >
        <Score
          scoreList={[
            {
              id: new Date().getTime(),
              value: 7800,
            },
          ]}
        />
        <p style={{ margin: 0, textAlign: "left", fontSize: "1.8rem" }}>
          Well done
        </p>
      </div>
    </div>
  )
}

const EndScreen = ({
  mode,
  questions,
  hasNextRound,
  onClickNextRound,
  userAnswers,
  setUserAnswers,
  setScreen,
  refetch,
}: EndScreenProps) => {
  const correctAnswerCount = questions.reduce((prev, cur, index) => {
    const answerForQuestionIsCorrrect = cur.answer.includes(userAnswers[index])
    if (answerForQuestionIsCorrrect) {
      return prev + 1
    }
    return prev
  }, 0)

  const percentageCorrect = (correctAnswerCount / questions.length) * 100

  const handleClickNextRound = () => {
    callbackCaller(onClickNextRound)

    setScreen("game")
    setUserAnswers({})

    if (mode === "stream") {
      if (refetch) refetch()
    }
  }

  return (
    <div style={{ padding: "1rem" }} className="EndScreen">
      <div style={{ width: "100%", marginBottom: "1.5rem" }}>
        <ScoreArea
          percentageCorrect={percentageCorrect}
          correctAnswerCount={correctAnswerCount}
          questionsCount={questions.length}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <p style={{ margin: 0 }}>Explanations</p>
        {hasNextRound && (
          <Button onClick={handleClickNextRound} state="right">
            Next Round
          </Button>
        )}
      </div>
      <div className={styles.accordion_group}>
        {questions.map((question, questionIndex) => (
          <AccordionItem
            key={questionIndex}
            title={question.question}
            icon={() =>
              userAnswers[questionIndex] === undefined ? (
                <QuestionMark />
              ) : question.answer.includes(userAnswers[questionIndex]) ? (
                <span>
                  <Check style={{ color: "green" }} />
                </span>
              ) : (
                <span style={{ color: "red" }}>
                  <Cross />
                </span>
              )
            }
          >
            <Explainer question={question} />
          </AccordionItem>
        ))}
      </div>
    </div>
  )
}

export default EndScreen
