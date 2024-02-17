import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Icon,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
  useToast
} from "@chakra-ui/react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import Layout from "../components/Layout";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import CustomFileInput from "../components/CustomFileInput";

export default function ExtendedVigenere() {
  const toast = useToast();
  const [key, setKey] = useState("");
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [plainTextFile, setPlainTextFile] = useState<File>();
  const [cipherTextFile, setCipherTextFile] = useState<File>();

  const executeEncrypt = async () => {
    setIsLoading(true);
    try {
      if (plainTextFile !== undefined) {
        const data = new FormData();
        data.append("mode", "encrypt");
        data.append("key", key);
        data.append("file", plainTextFile, plainTextFile.name);

        const response = await axios.post(
          "http://localhost:3000/api/cipher/extended-vigenere",
          data,
          {
            responseType: "blob"
          }
        );

        // Fetch the filename
        const contentDisposition = response.headers[
          "content-disposition"
        ] as string;
        let filename = "encrypted_file";
        if (contentDisposition) {
          const filenameSection = contentDisposition.split(";")[1];
          if (filenameSection) {
            filename = filenameSection
              .trim()
              .split("filename=")[1]
              .replace(new RegExp(`"`, "g"), "");
          }
        }

        // Generate link for download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename); // Set the downloaded file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsLoading(false);
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/cipher/extended-vigenere",
          {
            mode: "encrypt",
            key: key,
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
  };

  const executeDecrypt = async () => {
    setIsLoading(true);
    try {
      if (cipherTextFile !== undefined) {
        const data = new FormData();
        data.append("mode", "decrypt");
        data.append("key", key);
        data.append("file", cipherTextFile, cipherTextFile.name);

        const response = await axios.post(
          "http://localhost:3000/api/cipher/extended-vigenere",
          data,
          {
            responseType: "blob"
          }
        );

        // Fetch the filename
        const contentDisposition = response.headers[
          "content-disposition"
        ] as string;
        let filename = "decrypted_file";
        if (contentDisposition) {
          const filenameSection = contentDisposition.split(";")[1];
          if (filenameSection) {
            filename = filenameSection
              .trim()
              .split("filename=")[1]
              .replace(new RegExp(`"`, "g"), "");
          }
        }

        // Generate link for download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename); // Set the downloaded file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsLoading(false);
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/cipher/extended-vigenere",
          {
            mode: "decrypt",
            key: key,
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
  };

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
      <VStack
        w={"full"}
        py={8}
        px={32}
        align={"center"}
        justifyContent={"space-around"}
        gap={8}
      >
        <HStack w={"50%"} justifyContent={"center"}>
          <Text>Cipher key</Text>
          <Input
            w={"60%"}
            placeholder="Insert cipher key here"
            value={key}
            onChange={(event) => setKey(event.target.value)}
          />
        </HStack>
        <HStack w={"80%"} gap={8}>
          <Stack w={"full"}>
            <Text>Extended Vigenere plain text</Text>
            <Textarea
              value={plainText}
              onChange={(event) => setPlainText(event.target.value)}
              resize={"none"}
              placeholder="Plain text"
              rows={5}
            />
            <Box position="relative" p={4}>
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
          <Stack w={"full"}>
            <Text>Extended Vigenere ciphertext</Text>
            <Textarea
              value={cipherText}
              onChange={(event) => setCipherText(event.target.value)}
              resize={"none"}
              placeholder="Cipher text"
              rows={5}
            />
            <Box position="relative" p={4}>
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
                <Icon as={FaLockOpen} />
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
          {result.length > 0 ? (
            <Text>{result}</Text>
          ) : (
            <Text color={"gray"} fontStyle={"italic"}>
              Results will be displayed here
            </Text>
          )}
        </Stack>
      </VStack>
    </Layout>
  );
}
