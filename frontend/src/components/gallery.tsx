import { Box, Center, Portal, SimpleGrid, Skeleton, useMantineTheme } from '@mantine/core'
import { IconPhoto } from '@tabler/icons-react'
import { useState } from 'react'

import GalleryImage from './galleryImage'
import OverlayPreview from './overlayPreview'

import { GeneratedImage } from '~/types/generatedImage'

interface Props {
  images: GeneratedImage[]
  isLoading: boolean
}

const Gallery = ({ images, isLoading }: Props) => {
  const [showOverlay, setShowOverlay] = useState(false)
  const [initialIndex, setInitialIndex] = useState(0)

  const theme = useMantineTheme()

  return (
    <>
      <Box h={'100%'}>
        {isLoading && (
          <Skeleton
            h={{
              xs: 300,
              sm: 400,
              md: 300,
            }}
            py={'sm'}
          />
        )}

        {images.length === 0 && !isLoading && (
          <Center
            w={'90%'}
            h={'90%'}
            m={'auto'}
            color={theme.colorScheme === 'dark' ? 'dark.1' : 'gray.2'}
            bg={theme.colorScheme === 'dark' ? 'dark.9' : 'gray.1'}
            opacity={0.3}
          >
            <IconPhoto size={48} />
          </Center>
        )}

        <SimpleGrid
          cols={3}
          breakpoints={[
            { maxWidth: 'xs', cols: 2 },
            { maxWidth: 'sm', cols: 2 },
            { minWidth: 'sm', cols: 2 },
            { minWidth: 'md', cols: 2 },
            { minWidth: 'lg', cols: 3 },
            { minWidth: 'xl', cols: 4 },
          ]}
        >
          {images.map((image, i) => {
            return (
              <GalleryImage
                key={image.url}
                image={image}
                onClick={() => {
                  setInitialIndex(i)
                  setShowOverlay(true)
                }}
              />
            )
          })}
        </SimpleGrid>
      </Box>

      {showOverlay && (
        <Portal>
          <OverlayPreview
            images={images}
            initialIndex={initialIndex}
            onClose={() => {
              setShowOverlay(false)
            }}
          />
        </Portal>
      )}
    </>
  )
}

export default Gallery
