import { ComponentStyleConfig, SystemStyleFunction } from "@chakra-ui/react";

const defaultInput: SystemStyleFunction = () => {
  return {
    field: {
      border: "1px black solid"
    }
  };
};

export const Input: ComponentStyleConfig = {
  variants: {
    default: defaultInput
  },
  defaultProps: {
    variant: "default"
  }
};
