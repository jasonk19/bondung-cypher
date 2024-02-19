import React, { useEffect } from "react";
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
  Image,
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
      name: "Extended Vigen\u00E9re Cipher & Super Encryption",
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
    }
  ];

  useEffect(() => {
    let title = "Bondung Cipher";
    switch (location.pathname) {
      case "/affine":
        title = " Affine Cipher";
        break;
      case "/vigenere":
        title = " Vigenere Cipher";
        break;
      case "/extended-vigenere":
        title = " Extended Vigenere Cipher";
        break;
      case "/playfair":
        title = " Playfair Cipher";
        break;
      case "/hill":
        title = " Hill Cipher";
        break;
    }

    document.title = title;
  }, [location.pathname]);
  return (
    <>
      <Stack w={"full"} minH={"100vh"} bg={"#F4F4F4"}>
        <Flex
          w={"full"}
          p={4}
          bgGradient={"linear(to-b, #233140, #2C3E50, #344a60)"}
        >
          <HStack gap={4}>
            <Icon
              as={RxHamburgerMenu}
              boxSize={6}
              _hover={{ cursor: "pointer" }}
              color={"white"}
              onClick={onOpen}
            />
            <Image src="/logo.webp" boxSize={8} />
            <Heading color={"white"} fontSize={"x-large"}>
              {pages.find((item) => item.path === location.pathname)?.name ||
                "Bondung Cipher"}
            </Heading>
          </HStack>
        </Flex>
        {children}
      </Stack>
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Link to="/">
              <HStack>
                <Image src="/logo.webp" boxSize={8} />
                <Heading size="md">Bondung Cipher</Heading>
              </HStack>
            </Link>
          </DrawerHeader>
          <DrawerBody>
            <Stack>
              {pages.map((page) => (
                <Link to={page.path} key={page.name}>
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
