import { ComponentStyleConfig, SystemStyleFunction } from "@chakra-ui/react";

const defaultNumberInput: SystemStyleFunction = () => {
  return {
    field: {
      border: "1px black solid"
    }
  };
};

export const NumberInput: ComponentStyleConfig = {
  variants: {
    default: defaultNumberInput
  },
  defaultProps: {
    variant: "default"
  }
};
