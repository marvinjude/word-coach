function useOptions({
  options,
  currentQuestionIndex,
  chooseAnswer,
  userAnswers,
  currentQuestionIsAnswered,
  question,
}) {
  const optionHelpers = options.map((option, index) => {
    const chooseAnswerHandler = !currentQuestionIsAnswered
      ? () => chooseAnswer(index)
      : null

    const thisOptionWasSelected = userAnswers[currentQuestionIndex] === index

    const thisOptionIsCorrectAnswer = question.answer.includes(index)

    return {
      chooseAnswerHandler,
      thisOptionWasSelected,
      thisOptionIsCorrectAnswer,
      option,
      index,
    }
  })

  return optionHelpers
}

export default useOptions
