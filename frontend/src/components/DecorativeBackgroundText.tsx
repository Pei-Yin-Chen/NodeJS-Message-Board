import { Box, Typography } from '@mui/material'
import { decorativeTextGlass, decorativeTextGlassOutline } from '../styles/glass'

type WordPlacement = {
  text: string
  top: string
  left: string
  rotate: number
  size: string
  variant?: 'fill' | 'outline'
}

const WORDS: WordPlacement[] = [
  {
    text: 'message',
    top: '42%',
    left: '-4%',
    rotate: -6,
    size: 'clamp(4.5rem, 18vw, 11rem)',
  },
  {
    text: 'board',
    top: '10%',
    left: '58%',
    rotate: 8,
    size: 'clamp(2.5rem, 8vw, 5rem)',
    variant: 'outline',
  },
  {
    text: 'share',
    top: '22%',
    left: '4%',
    rotate: -12,
    size: 'clamp(2rem, 5vw, 3.5rem)',
    variant: 'outline',
  },
  {
    text: 'notes',
    top: '58%',
    left: '72%',
    rotate: 10,
    size: 'clamp(2.25rem, 6vw, 4.5rem)',
  },
  {
    text: 'hello',
    top: '72%',
    left: '8%',
    rotate: -8,
    size: 'clamp(2rem, 5vw, 3.75rem)',
    variant: 'outline',
  },
]

const DecorativeBackgroundText = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      {WORDS.map((word) => (
        <Typography
          key={word.text}
          component="span"
          sx={{
            position: 'absolute',
            top: word.top,
            left: word.left,
            fontSize: word.size,
            whiteSpace: 'nowrap',
            transform: `rotate(${word.rotate}deg)`,
            ...(word.variant === 'outline'
              ? decorativeTextGlassOutline
              : decorativeTextGlass),
          }}
        >
          {word.text}
        </Typography>
      ))}
    </Box>
  )
}

export default DecorativeBackgroundText
