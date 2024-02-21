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
  IconButton,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import Layout from "../components/Layout";
import CustomFileInput from "../components/CustomFileInput";
import { FaLock, FaMinus, FaPlus } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

const MatrixInput = ({matrix, handleMatrixChange}: {
  matrix: number[][];
  handleMatrixChange: (event: BaseSyntheticEvent, row: number, col: number) => void;
}) => {
  return (
    <FormControl>
      <FormLabel>Matrix</FormLabel>
      <Grid
        templateColumns={`repeat(${matrix.length}, 1fr)`}
        templateRows={`repeat(${matrix.length}, 1fr)`}
        gap={2}
        w={"fit-content"}
        placeSelf={"center"}
      >
        {matrix.map((row, rowIndex) => 
          row.map((item, colIndex) => (
            <GridItem width={"40px"} height={"40px"}>
              <Input
                key={`${rowIndex}-${colIndex}`}
                value={item}
                maxLength={1}
                border={"1px solid black"}
                textAlign={"center"}
                fontSize={"1em"}
                padding={0}
                type="number"
                onChange={(event) =>
                  handleMatrixChange(event, rowIndex, colIndex)
                }
              />
            </GridItem>
          ))
        )}
      </Grid>
    </FormControl>
  )
}

export default function Hill() {
  const toast = useToast()

  const [plainText, setPlainText] = useState("")
  const [cipherText, setCipherText] = useState("")
  const [matrixSize, setMatrixSize] = useState(3)
  const [matrix, setMatrix] = useState<number[][]>(
    Array(matrixSize)
    .fill([])
    .map(() => Array(matrixSize).fill(""))
  )
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [plainTextFile, setPlainTextFile] = useState<File>();
  const [cipherTextFile, setCipherTextFile] = useState<File>();

  useEffect(() => {
    setMatrix(
      Array(matrixSize)
      .fill([])
      .map(() => Array(matrixSize).fill(""))
    )
  }, [matrixSize])

  const executeEncrypt = async () => {
    try {
      if (plainTextFile !== undefined) {
        const data = new FormData();
        data.append("mode", "encrypt");
        data.append("text", plainText)
        data.append("matrix", JSON.stringify(matrix))
        data.append("file", plainTextFile, plainTextFile.name);

        const response = await axios.post(
          "http://localhost:3000/api/cipher/hill",
          data
        );
        setResult(response.data.result);
        setIsLoading(false);
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/cipher/hill",
          {
            mode: "encrypt",
            text: plainText,
            matrix
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
        data.append("text", cipherText)
        data.append("matrix", JSON.stringify(matrix))
        data.append("file", cipherTextFile, cipherTextFile.name);

        const response = await axios.post(
          "http://localhost:3000/api/cipher/hill",
          data
        );
        setResult(response.data.result);
        setIsLoading(false);
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/cipher/hill",
          {
            mode: "decrypt",
            text: cipherText,
            matrix
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

  const handleIncrementMatrixSize = () => {
    setMatrixSize((prev) => prev + 1)
  }

  const handleDecrementMatrixSize = () => {
    if (matrixSize > 1) {
      setMatrixSize((prev) => prev - 1)
    }
  }

  const handleMatrixChange = (
    event: BaseSyntheticEvent,
    row: number,
    col: number
  ) => {
    const newMatrix = matrix.map((rowArr, rowIndex) =>
      rowArr.map((item, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return Number(event.target.value)
        }
        return item;
      })
    );

    setMatrix(newMatrix);
  };

  console.log(matrix)

  return (
    <Layout>
      <HStack py={8} px={32} justifyContent={"space-around"} align={"start"} gap="8">
        <Stack spacing={3} width={"50%"}>
          <Heading color="navbar" size="md">Hill Cipher</Heading>
          <Divider border={"1px solid black"} />
          <Stack>
            <FormControl>
              <FormLabel>Matrix Size</FormLabel>
              <HStack>
                <Input placeholder="Matrix size" value={matrixSize} onChange={(e) => setMatrixSize(Number(e.target.value))} type="number" />
                <IconButton icon={<FaPlus />} aria-label="Increment" onClick={handleIncrementMatrixSize} />
                <IconButton icon={<FaMinus />} aria-label="Decrement" onClick={handleDecrementMatrixSize} />
              </HStack>
            </FormControl>
            <MatrixInput matrix={matrix} handleMatrixChange={handleMatrixChange} />
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
