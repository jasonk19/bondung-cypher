import { ComponentStyleConfig, SystemStyleFunction } from "@chakra-ui/react";

const defaultButton: SystemStyleFunction = () => {
  return {
    color: "white",
    bg: "navbar",
    _hover: {
      bg: "#485C75",
      _disabled: {
        bg: "#2B323A"
      }
    },
    _disabled: {
      bg: "#2B323A"
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
