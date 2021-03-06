import * as React from "react";
import { Button, FormControl, Heading, Stack, Text } from "native-base";
import { FieldValues, useForm } from "react-hook-form";
import { View } from "react-native";
import Input from "./input";
import { useMutation, useQueryClient } from "react-query";
import db, { sql } from "../database";
import { useNavigation } from "@react-navigation/core";

async function addPlayer(data: FieldValues) {
  await db.query(
    sql`
          INSERT INTO players (name)
          VALUES (${data.name});
        `
  );
  const [{ id }] = await db.query(
    sql`
          SELECT last_insert_rowid() as id;
        `
  );

  return id;
}

export default function Player() {
  const queryClient = useQueryClient();
  const navigation: any = useNavigation();
  const { control, handleSubmit } = useForm();
  const { mutate, isLoading } = useMutation(addPlayer, {
    onSuccess: (data, variables) => {
      queryClient.refetchQueries("PLAYERS");
      const player = { name: variables.name, id: data };
      navigation.navigate("Jugador", {
        player,
      });
    },
  });

  async function submit(data: FieldValues) {
    mutate(data);
  }

  return (
    <View>
      <Heading size="md">Ingresar un nuevo jugador</Heading>

      <FormControl isRequired>
        <Stack my={2}>
          <FormControl.Label>Nombre</FormControl.Label>
          <Input control={control} name="name" placeholder="Forki" />
        </Stack>
      </FormControl>
      <Button
        isLoading={isLoading}
        onPress={handleSubmit(submit)}
        colorScheme="pink"
        mt="4"
      >
        Agregar
      </Button>
    </View>
  );
}
