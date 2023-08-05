import Radio from "@/ui/Radio"
import { Select, Switch, Input } from "@chakra-ui/react"
import type { IProDefinition, IControlsState } from "@/types"

type FieldProps = IProDefinition & {
  onChange: (value: any) => void
  value: string
  name: string
  controlsState: IControlsState
}

function Field({
  controlsState,
  name,
  type,
  description,
  control,
  options,
  required,
  signature,
  showControl,
  onChange,
  value,
}: FieldProps) {
  if (
    (typeof showControl === "boolean" && !showControl) ||
    (typeof showControl === "function" && !showControl(controlsState))
  )
    return null

  let controlToRender

  if (control === "text") {
    controlToRender = (
      <Input value={value} onChange={e => onChange(e.target.value)} />
    )
  }

  if (control === "fetchQ")
    controlToRender = (
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
    )

  if (control === "radio") {
    controlToRender = (
      <Radio
        value={value}
        options={options}
        onChange={({ target }) => onChange(target.value)}
      />
    )
  }

  if (control === "switch") {
    controlToRender = (
      <Switch
        isChecked={!!value}
        size="lg"
        onChange={({ target }) => onChange(target.checked)}
      />
    )
  }

  if (control === "select") {
    controlToRender = (
      <Select
        value={value}
        onChange={({ target }) => onChange(target.value)}
        placeholder="Select option"
      >
        {options?.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    )
  }

  if (control === "function") {
    controlToRender = null
  }

  return (
    <div className="py-5 border-b px-5">
      <div className="flex gap-2">
        <span className="font-bold">{name}</span>
        <span className="text-gray-500">{type}</span>
        <span className="italic">{required ? "required" : "optional"}</span>
      </div>
      {controlToRender && <div className="py-5">{controlToRender}</div>}
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  )
}

export default Field
