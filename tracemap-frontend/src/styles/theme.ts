import { createTheme } from '@mui/material'
import { pink, red } from '@mui/material/colors'

export const theme = createTheme({
  palette: {
    primary: {
      50: '#ffebee',
      100: '#8E9299',
      200: '#7F25E6',
      300: '#7F25E6',
      400: '#7F25E6',
      500: '#7F25E6',
      600: '#7F25E6',
      700: '#7F25E6',
      800: '#7F25E6',
      900: '#7F25E6',
      A100: '#737680',
      A200: '#737680',
      A400: '#737680',
      A700: '#737680',
    },
    warning: red,
    secondary: pink,
  },
  components: {
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: 0,
          height: '22px',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 0,
          height: '22px',
        },
      },
    },
  },
})
