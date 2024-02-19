import { extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Select } from "./select";
import { NumberInput } from "./number-input";

const theme = extendTheme({
  fonts: {
    heading: "Roboto",
    body: "Roboto"
  },
  colors,
  components: {
    Button,
    Input,
    Textarea,
    Select,
    NumberInput
  }
});

export default theme;
