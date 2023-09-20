import Radio from '@/components/ui/radio'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import type { IProDefinition, IControlsState } from '@/types'

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
  showControl,
  onChange,
  value,
}: FieldProps) {
  if (
    (typeof showControl === 'boolean' && !showControl) ||
    (typeof showControl === 'function' && !showControl(controlsState))
  )
    return null

  let controlToRender

  if (control === 'text') {
    controlToRender = (
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    )
  }

  if (control === 'fetchQ')
    controlToRender = (
      <div>
        <pre className="bg-gray-100 rounded text-sm p-4 max-h-40 monospace overflow-y-scroll">
          {JSON.stringify(
            [
              {
                type: 'TEXT',
                question: "What does this emoji mean '😎'?",
                score: 30,
                options: [{ text: 'Crazy' }, { text: 'Cool' }],
                answer: [1],
                whyAnswer: [
                  {
                    heading: 'Why the UK Flag differnt',
                    text: 'The flag of the United Kingdom is a defaced version of the flag of England.',
                  },
                  {
                    heading: 'What does the UK have in common',
                    text: 'The flag of the United Kingdom is a defaced version of the flag of England.',
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

  if (control === 'radio') {
    controlToRender = (
      <Radio
        value={value}
        options={options ?? []}
        onChange={({ target }) => onChange(target.value)}
      />
    )
  }

  if (control === 'switch') {
    controlToRender = (
      <Switch
        checked={!!value}
        onCheckedChange={(isChecked) => onChange(isChecked)}
      />
    )
  }

  if (control === 'select') {
    controlToRender = (
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options?.map((text) => (
              <SelectItem key={text} value={text}>
                {text}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  if (control === 'function') {
    controlToRender = null
  }

  return (
    <div className="py-5 border-b px-5">
      <div className="flex gap-2">
        <span className="font-bold">{name}</span>
        <span className="text-gray-500">{type}</span>
        <span className="italic">{required ? 'required' : 'optional'}</span>
      </div>
      {controlToRender && <div className="py-5">{controlToRender}</div>}
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  )
}

export default Field
