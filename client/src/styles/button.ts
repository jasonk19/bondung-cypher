import { ComponentStyleConfig, SystemStyleFunction } from "@chakra-ui/react";

const defaultButton: SystemStyleFunction = () => {
  return {
    color: "white",
    bg: "navbar",
    _hover: {
      bg: "#485C75"
    }
  };
};

export const Button: ComponentStyleConfig = {
  variants: {
    default: defaultButton
  },
  defaultProps: {
    variant: "default"
  }
};
