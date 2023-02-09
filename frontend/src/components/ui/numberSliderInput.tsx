import { Flex, Input, InputWrapperBaseProps, Slider } from '@mantine/core'
import { useRef, useState } from 'react'

import BetterNumInput from './betterNumInput'

interface Props extends InputWrapperBaseProps {
  defaultValue?: number
  placeholder?: string
  min?: number
  max?: number
  step?: number
  precision?: number
  onChange?: (value: number) => void
}

const NumberSliderInput = ({
  label,
  defaultValue = 768,
  placeholder,
  min,
  max,
  step,
  precision,
  onChange,
  ...props
}: Props) => {
  const [value, setValue] = useState<number>(defaultValue)

  const sliderRef = useRef<HTMLInputElement>(null)

  return (
    <Input.Wrapper label={label}>
      <Flex align={'center'} gap={'sm'}>
        <Slider
          label={value}
          defaultValue={defaultValue}
          value={value}
          min={min}
          max={max}
          step={step}
          w={'100%'}
          onChange={(e) => {
            setValue(e)
            onChange && onChange(e)
          }}
          ref={sliderRef}
        />
        <BetterNumInput
          value={value}
          min={min}
          max={max}
          step={step}
          defaultValue={defaultValue}
          placeholder={placeholder}
          precision={precision}
          w={'100px'}
          onChange={(e) => {
            if (!e) return

            setValue(e)
            onChange && onChange(e)
          }}
          onWheel={(e) => {
            // blur した際に value が確定され、onChage が発火するため、
            // わざと一度 blur してから focus しなおしている
            e.currentTarget.blur()
            e.currentTarget.focus()
          }}
          {...props}
          allowWheel
        />
      </Flex>
    </Input.Wrapper>
  )
}

export default NumberSliderInput
