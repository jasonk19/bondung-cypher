import { ComponentStyleConfig, SystemStyleFunction } from "@chakra-ui/react";

const defaultSelect: SystemStyleFunction = () => {
  return {
    field: {
      border: "1px black solid"
    }
  };
};

export const Select: ComponentStyleConfig = {
  variants: {
    default: defaultSelect
  },
  defaultProps: {
    variant: "default"
  }
};
