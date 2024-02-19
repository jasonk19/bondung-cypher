import {
  Button,
  Center,
  HStack,
  Heading,
  Icon,
  Image,
  Text,
  VStack
} from "@chakra-ui/react";
import { IoMdGrid } from "react-icons/io";
import { RiKey2Fill } from "react-icons/ri";
import { PiBracketsCurlyBold } from "react-icons/pi";
import { ImKey } from "react-icons/im";
import { TbVectorTriangle } from "react-icons/tb";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

export default function Home() {
  const pages1 = [
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
      icon: IoMdGrid,
      name: "Playfair Cipher",
      path: "/playfair",
      active: location.pathname === "/playfair"
    }
  ];

  const pages2 = [
    {
      icon: ImKey,
      name: "Extended Vigen\u00E9re Cipher & Super Encryption",
      path: "/extended-vigenere",
      active: location.pathname === "/extended-vigenere"
    },
    {
      icon: TbVectorTriangle,
      name: "Hill Cipher",
      path: "/hill",
      active: location.pathname === "/hill"
    }
  ];

  return (
    <Layout>
      <Center h={"full"} flexGrow={1}>
        <VStack spacing={5}>
          <Image src="/logo.webp" boxSize={64} />
          <Heading>Welcome to Bondung Cipher</Heading>
          <Heading size="md">Bogor-Bandung Cipher</Heading>
          <HStack>
            {pages1.map((page) => (
              <Link to={page.path}>
                <Button>
                  <HStack>
                    <Icon as={page.icon} boxSize={6} />
                    <Text>{page.name}</Text>
                  </HStack>
                </Button>
              </Link>
            ))}
          </HStack>
          <HStack>
            {pages2.map((page) => (
              <Link to={page.path}>
                <Button>
                  <HStack>
                    <Icon as={page.icon} boxSize={6} />
                    <Text>{page.name}</Text>
                  </HStack>
                </Button>
              </Link>
            ))}
          </HStack>
        </VStack>
      </Center>
    </Layout>
  );
}
