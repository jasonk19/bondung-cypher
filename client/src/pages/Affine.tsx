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
  useToast,
} from "@chakra-ui/react";
import Layout from "../components/Layout";
import CustomFileInput from "../components/CustomFileInput";
import { FaLock } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import { useState } from "react";
import axios, { AxiosError } from "axios";

export default function Affine() {
  const toast = useToast()

  const [plainText, setPlainText] = useState("")
  const [cipherText, setCipherText] = useState("")
  const [slope, setSlope] = useState(0)
  const [intercept, setIntercept] = useState(0)
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [plainTextFile, setPlainTextFile] = useState<File>();
  const [cipherTextFile, setCipherTextFile] = useState<File>();

  const executeEncrypt = async () => {
    try {
      if (plainTextFile !== undefined) {
        const data = new FormData();
        data.append("mode", "encrypt");
        data.append("slope", JSON.stringify(slope))
        data.append("intercept", JSON.stringify(intercept));
        data.append("file", plainTextFile, plainTextFile.name);

        const response = await axios.post(
          "http://localhost:3000/api/cipher/affine",
          data
        );
        setResult(response.data.result);
        setIsLoading(false);
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/cipher/affine",
          {
            slope,
            intercept,
            mode: "encrypt",
            text: plainText
          }
        );
        setResult(response.data.result);
        setIsLoading(false);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Encryption error",
          status: "error",
          description: error.response?.data.message,
          position: "top-right"
        });
      }
      setIsLoading(false);
    }
  }

  const executeDecrypt = async () => {
    setIsLoading(true);
    try {
      if (cipherTextFile !== undefined) {
        const data = new FormData();
        data.append("mode", "decrypt");
        data.append("slope", JSON.stringify(slope))
        data.append("intercept", JSON.stringify(intercept));
        data.append("file", cipherTextFile, cipherTextFile.name);

        const response = await axios.post(
          "http://localhost:3000/api/cipher/affine",
          data
        );
        setResult(response.data.result);
        setIsLoading(false);
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/cipher/affine",
          {
            slope,
            intercept,
            mode: "decrypt",
            text: cipherText
          }
        );
        setResult(response.data.result);
        setIsLoading(false);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Decryption error",
          status: "error",
          description: error.response?.data.message,
          position: "top-right"
        });
      }
      setIsLoading(false);
    }
  }

  const download = () => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(result)
    );
    element.setAttribute("download", "result.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePlainTextFileChange = (file: File | undefined) => {
    setPlainTextFile(file);
  };

  const handleCipherTextFileChange = (file: File | undefined) => {
    setCipherTextFile(file);
  };

  return (
    <Layout>
      <HStack py={8} px={32} justifyContent={"space-around"} align={"start"} gap="8">
        <Stack spacing={3} width={"50%"}>
          <Heading color="navbar" size="md">Affine Cipher</Heading>
          <Divider border={"1px solid black"} />
          <Stack>
            <FormControl>
              <FormLabel>Slope</FormLabel>
              <Input placeholder="slope" onChange={(e) => setSlope(Number(e.target.value))} type="number" />
            </FormControl>
            <FormControl>
              <FormLabel>Intercept</FormLabel>
              <Input placeholder="intercept" onChange={(e) => setIntercept(Number(e.target.value))} type="number" />
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
                onChange={(e) => setPlainText(e.target.value)}
              />
              <Box position="relative" py={2}>
                <Divider border={"1px solid black"} />
                <AbsoluteCenter bg={"main"} px="4">
                  or
                </AbsoluteCenter>
              </Box>
              <CustomFileInput onFileChange={handlePlainTextFileChange} />
              <Button
                w={"full"}
                onClick={executeEncrypt}
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                <HStack>
                  <Icon as={FaLock} />
                  <Text>
                    {plainTextFile !== undefined
                      ? "Encrypt file content"
                      : "Encrypt"}
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
                onChange={(e) => setCipherText(e.target.value)}
              />
              <Box position="relative" py={2}>
                <Divider border={"1px solid black"} />
                <AbsoluteCenter bg={"main"} px="4">
                  or
                </AbsoluteCenter>
              </Box>
              <CustomFileInput onFileChange={handleCipherTextFileChange} />
              <Button
                w={"full"}
                onClick={executeDecrypt}
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                <HStack>
                  <Icon as={FaLock} />
                  <Text>
                    {cipherTextFile !== undefined
                      ? "Decrypt file content"
                      : "Decrypt"}
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
              <Button onClick={download} isDisabled={result.length === 0}>
                <HStack>
                  <Icon as={MdFileDownload} boxSize={6} />
                  <Text>Download as txt</Text>
                </HStack>
              </Button>
            </HStack>
            <Text>Result</Text>
            {result.length > 0 ? (
              <Text>{result}</Text>
            ) : (
              <Text color={"gray"} fontStyle={"italic"}>
                Results will be displayed here
              </Text>
            )}
          </Stack>
        </Stack>
      </HStack>
    </Layout>
  );
}
