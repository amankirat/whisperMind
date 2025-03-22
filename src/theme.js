import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      500: '#10a37f', // ChatGPT green
    },
    gray: {
      750: '#40414f',
    },
    bg: {
      darker: '#202123',  // Sidebar
      dark: '#343541',    // Main background
      message: '#444654', // AI message background
    },
  },
  styles: {
    global: {
      'html, body': {
        backgroundColor: '#343541',
        color: 'white',
        fontSize: '16px',
      },
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(255,255,255,0.2)',
      },
    },
  },
  fonts: {
    body: 'Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif',
    heading: 'Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'normal',
        borderRadius: 'md',
      },
      variants: {
        ghost: {
          _hover: {
            bg: 'whiteAlpha.100',
          },
        },
        outline: {
          borderColor: 'whiteAlpha.200',
          _hover: {
            bg: 'whiteAlpha.100',
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: 'gray.750',
            borderColor: 'whiteAlpha.200',
            _hover: {
              borderColor: 'whiteAlpha.400',
            },
            _focus: {
              borderColor: 'whiteAlpha.400',
              boxShadow: 'none',
            },
          },
        },
      },
      defaultProps: {
        variant: 'outline',
      },
    },
    IconButton: {
      baseStyle: {
        borderRadius: 'md',
      },
      variants: {
        ghost: {
          _hover: {
            bg: 'transparent',
          },
        },
      },
    },
    Container: {
      baseStyle: {
        maxW: '48rem',
      },
    },
    Text: {
      variants: {
        'nav-title': {
          color: 'gray.500',
          fontSize: '13px',
          fontWeight: 'medium',
        },
      },
    },
  },
})

export default theme 