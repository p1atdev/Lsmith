import {
  Box,
  Button,
  Divider,
  Flex,
  Notification,
  Portal,
  Stack,
  Text,
  Textarea,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useAtom } from 'jotai'
import { useState } from 'react'

import { api, createUrl } from '~/api'
import {
  GenerationParamertersForm,
  GenerationParameters,
  generationParametersAtom,
} from '~/atoms/generationParameters'
import Gallery from '~/components/gallery'
import Parameters from '~/components/parameters'
import { Scheduler } from '~/types/generate'
import { GeneratedImage } from '~/types/generatedImage'

const Generator = () => {
  const [parameters, setParameters] = useAtom(generationParametersAtom)
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [performance, setPerformance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isLargeScreen = useMediaQuery('(min-width: 992px)', true)

  const parseImages = (images: any): GeneratedImage[] => {
    const data: GeneratedImage[] = []

    Object.entries(images).forEach(([key, value]: [string, any]) => {
      data.push({
        url: createUrl(`/api/images/${value.info.img2img ? 'img2img' : 'txt2img'}/${key}`),
        info: value.info,
      })
    })

    return data
  }

  const onSubmit = async (values: GenerationParamertersForm) => {
    try {
      console.log(values)

      const requestBody: GenerationParameters = {
        ...values,
        scheduler_id: Scheduler[values.scheduler_id],
      }

      setIsLoading(true)
      setErrorMessage(null)
      setPerformance(null)

      console.log(requestBody)
      const res = await api.generateImage({
        generateImageRequest: requestBody,
      })
      setIsLoading(false)

      console.log(res.data)

      if (res.status !== 'success') {
        if (res.message) {
          setErrorMessage(res.message)
        } else {
          setErrorMessage('Something went wrong')
        }
      }

      const data = parseImages(res.data.images)
      setImages((imgs) => [...data, ...imgs])

      setPerformance(res.data.performance)
    } catch (e) {
      console.error(e)
      setErrorMessage((e as Error).message)
      setIsLoading(false)
    }
  }

  const onKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if Enter + Ctrl or Enter + Cmd
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      onSubmit(parameters)
    }
  }

  return (
    <Box h={'100%'}>
      <form
        style={{
          height: '100%',
          overflow: isLargeScreen ? 'hidden' : 'scroll',
        }}
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(parameters)
        }}
      >
        <Flex h={'100%'} w={'100%'} direction={isLargeScreen ? 'row' : 'column'}>
          <Stack w={'100%'} p={'md'}>
            <Stack w={'100%'}>
              <Textarea
                label={'Positive'}
                defaultValue={parameters.prompt}
                onChange={(e) => {
                  setParameters((p) => ({
                    ...p,
                    prompt: e.target.value,
                  }))
                }}
                onKeyDown={onKeyPress}
                autosize
              />
              <Textarea
                label={'Negative'}
                defaultValue={parameters.negative_prompt}
                onChange={(e) => setParameters((p) => ({ ...p, negative_prompt: e.target.value }))}
                onKeyDown={onKeyPress}
                autosize
              />
            </Stack>

            <Button
              mih={'36px'}
              type={'submit'}
              disabled={isLoading}
              sx={{
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              <Text>{parameters.img ? 'Generate (img2img mode)' : 'Generate'}</Text>
            </Button>

            {performance && <Text align="end">Time: {performance.toFixed(2)}s</Text>}

            <Box
              h={isLargeScreen ? '80%' : '480px'}
              pos={'relative'}
              sx={{
                overflowY: 'scroll',
              }}
            >
              <Gallery images={images} isLoading={isLoading} />
            </Box>
          </Stack>

          <Divider orientation={isLargeScreen ? 'vertical' : 'horizontal'} />

          <Box
            w={
              isLargeScreen
                ? {
                    md: 640,
                    lg: 720,
                  }
                : '100%'
            }
            sx={{
              overflow: 'scroll',
            }}
          >
            <Parameters />
          </Box>
        </Flex>
      </form>

      {errorMessage && (
        <Portal>
          <Notification
            title={'Error occured'}
            color={'red'}
            m={'md'}
            pos={'absolute'}
            bottom={0}
            right={0}
            onClose={() => {
              setErrorMessage(null)
            }}
          >
            {errorMessage}
          </Notification>
        </Portal>
      )}
    </Box>
  )
}

export default Generator
