import React, { useContext } from "react"
import Button from "../components/Button"
import Score from "../components/Score"
import AccordionItem from "../components/Accordion"
import Progress from "../components/Progress"

import Cross from "word-coach-common/icons/cross.svg"
import Check from "word-coach-common/icons/check.svg"
import QuestionMark from "word-coach-common/icons/question-mark.svg"

import styles from "word-coach-common/styles/styles.css"

import callbackCaller from "../utils/callbackCaller"
import { AppContext } from "../context"

import type { AppContextType, ImageOption, TextOption } from "../types"

const ImageWithHint: React.FC<{
  url: string
  hint?: () => React.ReactNode
}> = ({ url, hint }) => {
  return (
    <div style={{ display: "flex", position: "relative" }}>
      <img
        src={url}
        style={{
          height: "96px",
          width: "127px",
          objectFit: "cover",
        }}
      />
      {hint && (
        <div
          style={{
            background: "white",
            marginLeft: "auto",
            marginRight: "auto",
            position: "absolute",
            left: "0",
            right: "0",
            top: "0",
            bottom: "0",
            borderRadius: "5000px",
            height: "45px",
            width: "45px",
            marginTop: "60%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hint()}
        </div>
      )}
    </div>
  )
}

const EndScreen = () => {
  const {
    questions,
    hasNextRound,
    onClickNextRound,
    userAnswers,
    setUserAnswers,
    setScreen,
  } = useContext(AppContext) as AppContextType

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
  }

  return (
    <div style={{ padding: "1rem" }} className="EndScreen">
      <div style={{ display: "flex", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Progress percentage={percentageCorrect}>
            {correctAnswerCount}/{questions.length}
          </Progress>
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

      <div
        style={{
          border: "1px solid black",
          borderTop: "none",
          borderRadius: "10px",
          overflow: "hidden",
          fontSize: "0.9rem",
        }}
        className={styles.accordion_group}
      >
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
            <div style={{ height: "100%" }} className="explainer">
              {/* Upper */}
              {/* Text type */}
              {question.type === "TEXT" && (
                <div>
                  {question.image && <ImageWithHint url={question.image} />}
                  <div
                    style={{
                      borderTop: question.image ? "none" : "1px solid",
                      borderBottom: "1px solid",
                      paddingTop: "0.8rem",
                      paddingBottom: "0.8rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.8rem",
                    }}
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
                        {(option as TextOption).text}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Image type */}
              {question.type === "IMAGE" && (
                <div style={{ display: "flex", gap: "1rem" }}>
                  {question.options.map((option, optionIndex) => (
                    <ImageWithHint
                      key={optionIndex}
                      url={(option as ImageOption).url}
                      hint={() =>
                        question.answer.includes(optionIndex) ? (
                          <Check />
                        ) : (
                          <Cross />
                        )
                      }
                    />
                  ))}
                </div>
              )}

              {/* Lower part */}
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
                      <div
                        style={{ padding: "0.5rem 0 1rem 0", color: "gray" }}
                      >
                        {text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AccordionItem>
        ))}
      </div>
    </div>
  )
}

export default EndScreen