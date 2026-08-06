import { Box } from '@mui/material'
import { pageFixedBackground } from '../styles/glass'
import DecorativeBackgroundText from './DecorativeBackgroundText'

type PageBackgroundProps = {
  children: React.ReactNode
}

const PageBackground = ({ children }: PageBackgroundProps) => {
  return (
    <>
      <Box aria-hidden="true" sx={pageFixedBackground}>
        <DecorativeBackgroundText />
      </Box>
      <Box sx={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        {children}
      </Box>
    </>
  )
}

export default PageBackground
