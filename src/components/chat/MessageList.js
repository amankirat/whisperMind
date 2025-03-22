import React from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import MessageItem from './MessageItem';

const MessageList = ({ messages, containerMaxW, messagePadding, messagesEndRef }) => {
  if (messages.length === 0) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        h="full"
        color="white"
        px={4}
      >
        <Heading size="xl" fontWeight="medium">
          What can I help with?
        </Heading>
      </Flex>
    );
  }

  return (
    <Box flex={1} overflowY="auto">
      {messages.map((message, idx) => (
        <MessageItem
          key={idx}
          message={message}
          containerMaxW={containerMaxW}
          messagePadding={messagePadding}
        />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList; 