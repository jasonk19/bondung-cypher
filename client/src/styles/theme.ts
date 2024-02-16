import { extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";

const theme = extendTheme({
  fonts: {
    heading: "Roboto",
    body: "Roboto"
  },
  colors
});

export default theme;
