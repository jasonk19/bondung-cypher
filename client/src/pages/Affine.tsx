import { 
  AbsoluteCenter,
  Box,
  Button,
  Divider, 
  FormControl, 
  FormLabel, 
  HStack, 
  Heading, 
  Icon, 
  Input, 
  Stack, 
  Textarea,
  Text,
} from "@chakra-ui/react";
import Layout from "../components/Layout";
import CustomFileInput from "../components/CustomFileInput";
import { FaLock } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";

export default function Affine() {
  return (
    <Layout>
      <HStack py={8} px={32} justifyContent={"space-around"} align={"start"} gap="8">
        <Stack spacing={3} width={"50%"}>
          <Heading color="navbar" size="md">Affine Cipher</Heading>
          <Divider border={"1px solid black"} />
          <Stack>
            <FormControl>
              <FormLabel>Slope</FormLabel>
              <Input placeholder="slope" />
            </FormControl>
            <FormControl>
              <FormLabel>Intercept</FormLabel>
              <Input placeholder="intercept" />
            </FormControl>
          </Stack>
        </Stack>
        <Stack width={"full"} spacing={3}>
          <HStack width={"full"} spacing={10}>
            <Stack spacing={3} width="full">
              <Heading color="navbar" size="md">Plaintext</Heading>
              <Divider border={"1px solid black"} />
              <Textarea
                resize="none"
                placeholder="Plain text"
                rows={5}
              />
              <Box position="relative" py={2}>
                <Divider border={"1px solid black"} />
                <AbsoluteCenter bg={"main"} px="4">
                  or
                </AbsoluteCenter>
              </Box>
              <CustomFileInput onFileChange={() => "Hello"} />
              <Button
                w={"full"}
                // onClick={executeEncrypt}
                // isLoading={isLoading}
                // isDisabled={isLoading}
              >
                <HStack>
                  <Icon as={FaLock} />
                  <Text>
                    Encrypt
                    {/* {plainTextFile !== undefined
                      ? "Encrypt file content"
                      : "Encrypt"} */}
                  </Text>
                </HStack>
              </Button>
            </Stack>
            <Stack spacing={3} width="full">
              <Heading color="navbar" size="md">Ciphertext</Heading>
              <Divider border={"1px solid black"} />
              <Textarea
                resize="none"
                placeholder="Cipher text"
                rows={5}
              />
              <Box position="relative" py={2}>
                <Divider border={"1px solid black"} />
                <AbsoluteCenter bg={"main"} px="4">
                  or
                </AbsoluteCenter>
              </Box>
              <CustomFileInput onFileChange={() => "Hello"} />
              <Button
                w={"full"}
                // onClick={executeEncrypt}
                // isLoading={isLoading}
                // isDisabled={isLoading}
              >
                <HStack>
                  <Icon as={FaLock} />
                  <Text>
                    Decrypt
                    {/* {plainTextFile !== undefined
                      ? "Encrypt file content"
                      : "Encrypt"} */}
                  </Text>
                </HStack>
              </Button>
            </Stack>
          </HStack>
          <Stack placeSelf={"start"} w={"full"}>
            <HStack
              borderBottom={"1px solid black"}
              py={2}
              w={"full"}
              justifyContent={"space-between"}
            >
              <Heading fontSize={"x-large"}>Result</Heading>
              <Button>
                <HStack>
                  <Icon as={MdFileDownload} boxSize={6} />
                  <Text>Download as txt</Text>
                </HStack>
              </Button>
            </HStack>
            <Text>Result</Text>
            {/* {result.length > 0 ? (
              <Text>{result}</Text>
            ) : (
              <Text color={"gray"} fontStyle={"italic"}>
                Results will be displayed here
              </Text>
            )} */}
          </Stack>
        </Stack>
      </HStack>
    </Layout>
  );
}
