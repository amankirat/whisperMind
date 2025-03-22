import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Input,
  IconButton,
  Text,
  VStack,
  HStack,
  useToast,
  Button,
  Heading,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, EditIcon } from '@chakra-ui/icons';
import { BsThreeDots } from 'react-icons/bs';
import { FiPlus, FiSearch, FiShare, FiExternalLink, FiMenu } from 'react-icons/fi';
import { BiMicrophone, BiStop } from 'react-icons/bi';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();
  const recognitionRef = useRef(null);
  const [transcriptBuffer, setTranscriptBuffer] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const sidebarWidth = useBreakpointValue({ base: 'full', md: '260px' });
  const containerMaxW = useBreakpointValue({ base: 'full', md: 'container.md', lg: 'container.lg' });
  const messagePadding = useBreakpointValue({ base: 4, md: 6 });
  const inputPadding = useBreakpointValue({ base: 3, md: 4 });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 2000,
      isClosable: true,
      position: 'top-right',
      containerStyle: {
        marginTop: '60px'
      }
    });
  };

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      let finalTranscriptBuffer = '';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            finalTranscriptBuffer += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        // Show interim results in input field
        setInputMessage(finalTranscriptBuffer.trim() + ' ' + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        showToast(
          'Speech Recognition Error',
          'Failed to recognize speech. Please try again.',
          'error'
        );
      };

      recognition.onend = () => {
        setIsListening(false);
        
        // If we have a final transcript, send it
        if (finalTranscriptBuffer.trim()) {
          const messageToSend = finalTranscriptBuffer.trim();
          setInputMessage(messageToSend);
          handleSend(messageToSend);
          finalTranscriptBuffer = ''; // Reset the buffer
        }

        // Show toast when recording stops
        showToast(
          'Recording stopped',
          'Processing your message...',
          'info'
        );
      };

      recognition.onspeechend = () => {
        // Automatically stop recording after speech ends
        recognition.stop();
      };

      recognitionRef.current = recognition;
    } else {
      showToast(
        'Speech Recognition Not Supported',
        'Your browser does not support speech recognition.',
        'warning'
      );
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const handleSend = async (overrideMessage = null) => {
    const messageToSend = overrideMessage || inputMessage;
    if (messageToSend.trim()) {
      const userMessage = {
        role: 'user',
        content: messageToSend
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsLoading(true);
      
      try {
        const response = await fetch('http://localhost:80/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            model: 'llama-3.2-3b-instruct',
            temperature: 0.7,
            max_tokens: 800,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: data.choices[0].message.content,
            },
          ]);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: 'Failed to get response from LLaMA model',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      showToast(
        'Speech Recognition Not Available',
        'Your browser does not support speech recognition.',
        'error'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInputMessage('');
      recognitionRef.current.start();
      setIsListening(true);
      showToast(
        'Listening...',
        'Speak now. Speech will be sent automatically when you pause.',
        'info'
      );
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const SidebarContent = () => (
    <VStack spacing={4} align="stretch" h="full">
      <Button
        leftIcon={<FiPlus />}
        variant="outline"
        colorScheme="whiteAlpha"
        w="full"
        justifyContent="flex-start"
        borderColor="whiteAlpha.200"
        onClick={handleNewChat}
        _hover={{ bg: 'whiteAlpha.100' }}
        h="44px"
      >
        New chat
      </Button>
      
      <VStack spacing={2} align="stretch" flex={1} overflowY="auto">
        {['Previous Chat 1', 'Previous Chat 2', 'Previous Chat 3'].map((chat, index) => (
          <Button
            key={index}
            variant="ghost"
            colorScheme="whiteAlpha"
            justifyContent="flex-start"
            px={4}
            py={2}
            _hover={{ bg: 'whiteAlpha.100' }}
            color="white"
          >
            {chat}
          </Button>
        ))}
      </VStack>

      <Box p={4} borderTop="1px" borderColor="whiteAlpha.200">
        <Button
          leftIcon={<EditIcon />}
          variant="outline"
          colorScheme="whiteAlpha"
          width="full"
          borderColor="whiteAlpha.200"
          _hover={{ bg: 'whiteAlpha.100' }}
          color="white"
        >
          Upgrade plan
        </Button>
      </Box>
    </VStack>
  );

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      {isMobile ? (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg="#202123">
            <DrawerCloseButton color="white" />
            <DrawerHeader color="white">Chat History</DrawerHeader>
            <DrawerBody p={0}>
              <SidebarContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : (
        <Box w={sidebarWidth} bg="#202123" p={4} borderRight="1px solid" borderColor="whiteAlpha.200">
          <SidebarContent />
        </Box>
      )}

      {/* Main Chat Area */}
      <Flex flex={1} direction="column" bg="#343541" position="relative">
        {/* Top Bar */}
        <Flex 
          w="full" 
          h="44px" 
          borderBottom="1px solid" 
          borderColor="whiteAlpha.200" 
          align="center" 
          px={4}
          justify="space-between"
          bg="#343541"
        >
          {isMobile && (
            <IconButton
              icon={<FiMenu />}
              variant="ghost"
              colorScheme="whiteAlpha"
              onClick={onOpen}
              mr={2}
              _hover={{ bg: 'whiteAlpha.100' }}
            />
          )}
          <Text color="white" fontSize="16px">WhisperMind</Text>
          <IconButton
            icon={<EditIcon />}
            variant="ghost"
            colorScheme="whiteAlpha"
            aria-label="Edit chat"
            _hover={{ bg: 'whiteAlpha.100' }}
          />
        </Flex>

        {/* Messages Area */}
        <Box flex={1} overflowY="auto">
          {messages.length === 0 ? (
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
          ) : (
            messages.map((msg, idx) => (
              <Flex
                key={idx}
                bg={msg.role === 'assistant' ? '#444654' : '#343541'}
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
                      bg={msg.role === 'assistant' ? 'brand.500' : 'white'}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="sm"
                      fontWeight="bold"
                      color={msg.role === 'assistant' ? 'white' : 'black'}
                    >
                      {msg.role === 'assistant' ? 'L' : 'U'}
                    </Box>
                    <Box flex={1}>
                      <Text color="white" whiteSpace="pre-wrap">
                        {msg.content}
                      </Text>
                      {msg.role === 'assistant' && (
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
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
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
                  size="sm"
                  onClick={toggleListening}
                  _hover={{ bg: 'whiteAlpha.100' }}
                  aria-label={isListening ? "Stop recording" : "Start recording"}
                  disabled={isLoading}
                />
                <IconButton
                  icon={<FiSearch />}
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  size="sm"
                  isLoading={isLoading}
                  onClick={handleSend}
                  _hover={{ bg: 'whiteAlpha.100' }}
                  aria-label="Send message"
                  disabled={!inputMessage.trim() && !isListening}
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
      </Flex>
    </Flex>
  );
};

export default Chat; 