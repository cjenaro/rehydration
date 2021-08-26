import {
  Heading,
  HStack,
  IconButton,
  useColorMode,
  SunIcon,
  MoonIcon,
  VStack,
} from "native-base";
import * as React from "react";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const iconProps = {
    size: "sm",
    colorScheme: "red",
  };

  return (
    <VStack>
      <HStack>
        <Heading textAlign="center" my="4">
          Rehidratación
        </Heading>

        <IconButton
          alignSelf="center"
          ml="auto"
          p="2"
          colorScheme="red"
          onPress={toggleColorMode}
          icon={
            colorMode === "dark" ? (
              <SunIcon {...iconProps} />
            ) : (
              <MoonIcon {...iconProps} />
            )
          }
        >
          Toggle color mode {colorMode}
        </IconButton>
      </HStack>
    </VStack>
  );
}
