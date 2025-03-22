import React from 'react';
import {
  Box,
  VStack,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

const SidebarContent = ({ onNewChat }) => (
  <VStack spacing={4} align="stretch" h="full">
    <Button
      leftIcon={<FiPlus />}
      variant="outline"
      colorScheme="whiteAlpha"
      w="full"
      justifyContent="flex-start"
      borderColor="whiteAlpha.200"
      onClick={onNewChat}
      _hover={{ bg: 'whiteAlpha.100' }}
      h="44px"
    >
      New chat
    </Button>
  </VStack>
);

const Sidebar = ({ isMobile, isOpen, onClose, onNewChat }) => {
  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="#202123">
          <DrawerCloseButton color="white" />
          <DrawerHeader color="white">Chat History</DrawerHeader>
          <DrawerBody p={0}>
            <SidebarContent onNewChat={onNewChat} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Box w="260px" bg="#202123" p={4} borderRight="1px solid" borderColor="whiteAlpha.200">
      <SidebarContent onNewChat={onNewChat} />
    </Box>
  );
};

export default Sidebar; 