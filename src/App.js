import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Chat from './components/Chat';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Chat />
    </ChakraProvider>
  );
}

export default App;
