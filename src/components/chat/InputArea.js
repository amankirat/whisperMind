import React from 'react';
import {
  Box,
  Container,
  Flex,
  Input,
  IconButton,
  Text,
  HStack,
} from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';
import { BiMicrophone, BiStop } from 'react-icons/bi';

const InputArea = ({
  inputMessage,
  setInputMessage,
  handleSend,
  isLoading,
  isListening,
  toggleListening,
  containerMaxW,
  inputPadding,
}) => {
  return (
    <Box p={inputPadding} borderTop="1px solid" borderColor="whiteAlpha.200" bg="#343541" position="sticky" bottom={0}>
      <Container maxW={containerMaxW} position="relative">
        <Flex position="relative">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type or speak..."
            bg="#40414f"
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="xl"
            _focus={{
              boxShadow: 'none',
              borderColor: 'whiteAlpha.400',
            }}
            _hover={{
              borderColor: 'whiteAlpha.400',
            }}
            color="white"
            pr="90px"
            pl="16px"
            minH="44px"
            fontSize="16px"
            disabled={isLoading}
          />
          <HStack 
            position="absolute" 
            right={3} 
            top="50%" 
            transform="translateY(-50%)" 
            spacing={3}
            zIndex={2}
          >
            <IconButton
              icon={isListening ? <BiStop /> : <BiMicrophone />}
              variant="ghost"
              colorScheme={isListening ? "red" : "whiteAlpha"}
              size="md"
              onClick={toggleListening}
              _hover={{ 
                bg: isListening ? "red.500" : "whiteAlpha.200",
                transform: "scale(1.02)",
                transition: "all 0.2s"
              }}
              aria-label={isListening ? "Stop recording" : "Start recording"}
              disabled={isLoading}
              color={isListening ? "red.500" : "whiteAlpha.700"}
            />
            <IconButton
              icon={<FiSend />}
              variant="ghost"
              colorScheme="whiteAlpha"
              size="md"
              isLoading={isLoading}
              onClick={handleSend}
              _hover={{ 
                bg: "whiteAlpha.200",
                transform: "scale(1.02)",
                transition: "all 0.2s"
              }}
              aria-label="Send message"
              disabled={!inputMessage.trim() && !isListening}
              color={inputMessage.trim() || isListening ? "whiteAlpha.900" : "whiteAlpha.400"}
            />
          </HStack>
        </Flex>
        <Text
          position="absolute"
          bottom="-24px"
          left={0}
          right={0}
          textAlign="center"
          color="gray.500"
          fontSize="12px"
        >
          WhisperMind can make mistakes. Check important info.
        </Text>
      </Container>
    </Box>
  );
};

export default InputArea; 