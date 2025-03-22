import React from 'react';
import {
  Box,
  Container,
  HStack,
  Text,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';

const MessageItem = ({ message, containerMaxW, messagePadding }) => {
  const { role, content } = message;

  return (
    <Flex
      bg={role === 'assistant' ? '#444654' : '#343541'}
      w="full"
      py={messagePadding}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Container maxW={containerMaxW}>
        <HStack align="flex-start" spacing={6}>
          <Box
            w="30px"
            h="30px"
            borderRadius="sm"
            bg={role === 'assistant' ? 'brand.500' : 'white'}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="sm"
            fontWeight="bold"
            color={role === 'assistant' ? 'white' : 'black'}
          >
            {role === 'assistant' ? 'L' : 'U'}
          </Box>
          <Box flex={1}>
            <Text color="white" whiteSpace="pre-wrap">
              {content}
            </Text>
            {role === 'assistant' && (
              <HStack spacing={2} mt={4}>
                <IconButton
                  icon={<BsThreeDots />}
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  size="sm"
                  aria-label="More options"
                />
              </HStack>
            )}
          </Box>
        </HStack>
      </Container>
    </Flex>
  );
};

export default MessageItem; 