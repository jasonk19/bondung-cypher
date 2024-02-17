import React, { BaseSyntheticEvent, useRef, useState } from "react";
import { Button, Input, HStack, Icon } from "@chakra-ui/react";
import { MdFileUpload } from "react-icons/md";

type Props = {
  onFileChange: (file: File | undefined) => void;
};

const CustomFileInput: React.FC<Props> = ({ onFileChange }) => {
  const [fileState, setFileState] = useState<File>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [inputId] = useState(`file-input-${Math.random()}`);
  const handleChange = (event: BaseSyntheticEvent) => {
    const file = event.target.files[0];
    setFileState(file);
    if (file) {
      onFileChange(file);
    } else {
      onFileChange(undefined);
    }
  };

  const handleClear = () => {
    onFileChange(undefined);
    setFileState(undefined);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <HStack w={"full"}>
      <Input
        ref={fileRef}
        type="file"
        id={inputId}
        display={"none"}
        onChange={handleChange}
      />
      <Button
        as="label"
        htmlFor={inputId}
        w={"full"}
        _hover={{ cursor: "pointer", bg: "#485C75" }}
      >
        {!fileState?.name && <Icon as={MdFileUpload} boxSize={6} />}
        {fileState?.name || "Upload file"}
      </Button>
      {fileState && <Button onClick={handleClear}>Clear</Button>}
    </HStack>
  );
};

export default CustomFileInput;
