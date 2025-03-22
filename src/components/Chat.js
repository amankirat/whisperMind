import React, { useState, useRef, useEffect } from 'react';
import {
  Flex,
  IconButton,
  Text,
  useToast,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, EditIcon } from '@chakra-ui/icons';
import { BsThreeDots } from 'react-icons/bs';
import { FiPlus, FiSend, FiShare, FiExternalLink, FiMenu } from 'react-icons/fi';
import { BiMicrophone, BiStop } from 'react-icons/bi';
import Sidebar from './chat/Sidebar';
import MessageList from './chat/MessageList';
import InputArea from './chat/InputArea';

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

  return (
    <Flex h="100vh">
      <Sidebar
        isMobile={isMobile}
        isOpen={isOpen}
        onClose={onClose}
        onNewChat={handleNewChat}
      />

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

        <MessageList
          messages={messages}
          containerMaxW={containerMaxW}
          messagePadding={messagePadding}
          messagesEndRef={messagesEndRef}
        />

        <InputArea
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSend={handleSend}
          isLoading={isLoading}
          isListening={isListening}
          toggleListening={toggleListening}
          containerMaxW={containerMaxW}
          inputPadding={inputPadding}
        />
      </Flex>
    </Flex>
  );
};

export default Chat; 