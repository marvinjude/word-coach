import classNames from "classnames"

interface RadioProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  options: string[]
}

const Radio: React.FC<RadioProps> = ({ value, onChange, options }) => {
  return (
    <div className="border grid max-w-[13rem] grid-cols-2 rounded overflow-hidden text-sm">
      {options.map((option, optionIndex) => (
        <label
          className={classNames("p-2 text-center select-none cursor-pointer", {
            "bg-gray-100": value === option,
            "border-r": optionIndex === 0 || optionIndex % 2 === 0,
          })}
          key={option}
        >
          <input
            name="option"
            className="hidden"
            type="radio"
            value={option}
            onChange={onChange}
          />
          {option}
        </label>
      ))}
    </div>
  )
}

export default Radio
