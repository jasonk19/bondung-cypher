import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Heading,
  Icon,
  Stack,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdGrid } from "react-icons/io";
import { RiKey2Fill } from "react-icons/ri";
import { PiBracketsCurlyBold } from "react-icons/pi";
import { ImKey } from "react-icons/im";
import { TbVectorTriangle } from "react-icons/tb";
import { MdOutlineLock } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const pages = [
    {
      icon: PiBracketsCurlyBold,
      name: "Affine Cipher",
      path: "/affine",
      active: location.pathname === "/affine"
    },
    {
      icon: RiKey2Fill,
      name: `Vigen\u00E9re Cipher`,
      path: "/vigenere",
      active: location.pathname === "/vigenere"
    },
    {
      icon: ImKey,
      name: "Extended Vigen\u00E9re Cipher",
      path: "/extended-vigenere",
      active: location.pathname === "/extended-vigenere"
    },
    {
      icon: IoMdGrid,
      name: "Playfair Cipher",
      path: "/playfair",
      active: location.pathname === "/playfair"
    },
    {
      icon: TbVectorTriangle,
      name: "Hill Cipher",
      path: "/hill",
      active: location.pathname === "/hill"
    },
    {
      icon: MdOutlineLock,
      name: "Super Encryption",
      path: "/super-encryption",
      active: location.pathname === "/super-encryption"
    }
  ];
  return (
    <>
      <Stack w={"full"} minH={"100vh"} bg={"main"}>
        <Flex w={"full"} bg={"navbar"} p={4}>
          <HStack gap={4}>
            <Icon
              as={RxHamburgerMenu}
              boxSize={6}
              _hover={{ cursor: "pointer" }}
              color={"white"}
              onClick={onOpen}
            />
            <Heading color={"white"} fontSize={"x-large"}>
              {pages.find((item) => item.path === location.pathname)?.name}
            </Heading>
          </HStack>
        </Flex>
        {children}
      </Stack>
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Bondung Cypher</DrawerHeader>
          <DrawerBody>
            <Stack>
              {pages.map((page) => (
                <Link to={page.path}>
                  <HStack
                    p={2}
                    bg={page.active ? "navbar" : undefined}
                    color={page.active ? "white" : undefined}
                    _hover={{ bg: "navbar", color: "white" }}
                    gap={3}
                    rounded={"md"}
                  >
                    <Icon as={page.icon} boxSize={6} />
                    <Text>{page.name}</Text>
                  </HStack>
                </Link>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
