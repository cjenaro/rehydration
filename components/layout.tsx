import { useNavigation } from "@react-navigation/core";
import { Button, View } from "native-base";
import * as React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();

  function navigate(somewhere: string) {
    //@ts-ignore
    return () => navigation.navigate(somewhere);
  }

  return (
    <View
      _dark={{
        bg: "dark.100",
      }}
      w="100%"
      h="100%"
      p="4"
    >
      <View flexGrow={1}>{children}</View>

      <Button.Group space={4}>
        <Button flexGrow={1} colorScheme="pink" onPress={navigate("Home")}>Agregar jugador</Button>
        <Button flexGrow={1} colorScheme="pink" variant="outline" onPress={navigate("Search")}>Buscar jugador</Button>
      </Button.Group>
    </View>
  );
}
