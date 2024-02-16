import {
  Button,
  Grid,
  GridItem,
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
import { BaseSyntheticEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

export default function Playfair() {
  const toast = useToast();
  const [grid, setGrid] = useState<string[][]>(
    Array(5)
      .fill([])
      .map(() => Array(5).fill(""))
  );
  const [key, setKey] = useState("");
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGridChange = (
    event: BaseSyntheticEvent,
    row: number,
    col: number
  ) => {
    const newGrid = grid.map((rowArr, rowIndex) =>
      rowArr.map((item, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return event.target.value.toUpperCase();
        }
        return item;
      })
    );

    setGrid(newGrid);
  };

  const randomizeGrid = () => {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ".split("");
    const shuffledAlphabet = alphabet.sort(() => Math.random() - 0.5);
    const grid = [];
    while (shuffledAlphabet.length) grid.push(shuffledAlphabet.splice(0, 5));

    setGrid(grid);
  };

  const clearGrid = () => {
    setGrid(
      Array(5)
        .fill([])
        .map(() => Array(5).fill(""))
    );
  };

  const populateGridWithKey = () => {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ".split("");

    // Remove non-alphabet characters, change 'J' to 'I'
    const formattedKey = key
      .toUpperCase()
      .split("")
      .filter(
        (item, pos, self) =>
          self.indexOf(item) === pos && alphabet.includes(item)
      )
      .map((letter) => (letter === "J" ? "I" : letter));

    // Create a set to hold the remaining letters, excluding those already in the key
    const remainingLetters = alphabet.filter(
      (letter) => !formattedKey.includes(letter) && letter !== "J"
    );

    // Combine the key with the remaining letters
    const fullSet = formattedKey.concat(remainingLetters);

    const grid = [];
    while (fullSet.length) grid.push(fullSet.splice(0, 5));

    setGrid(grid);
    setKey("");
  };

  const executeEncrypt = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/cipher/playfair",
        {
          matrix: grid,
          mode: "encrypt",
          text: plainText
        }
      );

      setResult(response.data.result);
      setIsLoading(false);
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
      const response = await axios.post(
        "http://localhost:3000/api/cipher/playfair",
        {
          matrix: grid,
          mode: "decrypt",
          text: cipherText
        }
      );

      setResult(response.data.result);
      setIsLoading(false);
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

  return (
    <Layout>
      <HStack py={8} px={32} align={"center"} justifyContent={"space-around"}>
        <Stack gap={8}>
          <Text>Playfair Grid (Without J)</Text>
          <Grid
            templateColumns={"repeat(5, 1fr)"}
            templateRows={"repeat(5, 1fr)"}
            gap={2}
            w={"fit-content"}
            placeSelf={"center"}
          >
            {grid.map((row, rowIndex) =>
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
                    onChange={(event) =>
                      handleGridChange(event, rowIndex, colIndex)
                    }
                  />
                </GridItem>
              ))
            )}
          </Grid>
          <HStack w={"full"}>
            <Button w={"50%"} onClick={randomizeGrid}>
              Randomize Grid
            </Button>
            <Button w={"50%"} onClick={clearGrid}>
              Clear Grid
            </Button>
          </HStack>
          <Stack>
            <Text>Custom key</Text>
            <HStack>
              <Input
                placeholder="Enter key here"
                value={key}
                onChange={(event) => setKey(event.target.value)}
              />
              <Button onClick={populateGridWithKey}>Set Key</Button>
            </HStack>
          </Stack>
        </Stack>
        <VStack w={"60%"} align={"center"} justifyContent={"center"} gap={8}>
          <HStack w={"full"} gap={8}>
            <Stack w={"full"}>
              <Text>Playfair Plain Text</Text>
              <Textarea
                value={plainText}
                onChange={(event) => setPlainText(event.target.value)}
                resize={"none"}
                placeholder="Plain text"
                rows={5}
              />
              <Button
                w={"full"}
                onClick={executeEncrypt}
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                <HStack>
                  <Icon as={FaLock} />
                  <Text>Encrypt</Text>
                </HStack>
              </Button>
            </Stack>
            <Stack w={"full"}>
              <Text>Playfair Cipher Text</Text>
              <Textarea
                value={cipherText}
                onChange={(event) => setCipherText(event.target.value)}
                resize={"none"}
                placeholder="Cipher text"
                rows={5}
              />
              <Button
                w={"full"}
                onClick={executeDecrypt}
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                <HStack>
                  <Icon as={FaLockOpen} />
                  <Text>Decrypt</Text>
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
            <Text>{result}</Text>
          </Stack>
        </VStack>
      </HStack>
    </Layout>
  );
}
