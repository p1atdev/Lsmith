import { Divider, NativeSelect, Stack } from '@mantine/core'
import { useAtom } from 'jotai'

import ImageParameter from './parameters/imageParameter'
import ImageSizeParameter from './parameters/imageSizeParameter'
import ModelParameter from './parameters/modelParameter'
import SeedParameter from './parameters/seedParameter'

import { generationParametersAtom } from '~/atoms/generationParameters'
import NumberSliderInput from '~/components/ui/numberSliderInput'
import { schedulerNames } from '~/types/generate'

const Parameters = () => {
  const [parameters, setParameters] = useAtom(generationParametersAtom)

  return (
    <Stack w={'100%'} p={'md'} spacing={'md'}>
      <ModelParameter />

      <ImageSizeParameter />

      <NativeSelect
        label={'Sampler'}
        data={schedulerNames}
        defaultValue={parameters.scheduler_id}
      />

      <SeedParameter />

      <NumberSliderInput
        label={'Steps'}
        defaultValue={parameters.steps}
        placeholder={'50'}
        min={1}
        max={150}
        step={1}
        onChange={(e) => {
          if (e) {
            setParameters((p) => ({ ...p, steps: e }))
          }
        }}
      />

      <NumberSliderInput
        label={'CFG Scale'}
        defaultValue={parameters.scale}
        placeholder={'7.0'}
        min={1.0}
        max={100}
        step={0.5}
        precision={1}
        onChange={(e) => {
          if (e) {
            setParameters((p) => ({ ...p, scale: e }))
          }
        }}
      />

      <NumberSliderInput
        label={'Batch Count'}
        defaultValue={parameters.batch_count}
        placeholder={'1'}
        min={1}
        max={100}
        step={1}
        onChange={(e) => {
          if (e) {
            setParameters((p) => ({ ...p, batch_count: e }))
          }
        }}
      />

      <Divider />

      <ImageParameter />
    </Stack>
  )
}

export default Parameters
