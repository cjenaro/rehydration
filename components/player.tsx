import * as React from "react";
import { Button, FormControl, Heading, Stack, Text } from "native-base";
import { FieldValues, useForm } from "react-hook-form";
import { View } from "react-native";
import Input from "./input";
import { useMutation } from "react-query";
import db, { sql } from "../database";

async function addPlayer(data: FieldValues) {
  await db.query(
    sql`
          INSERT INTO players (name)
          VALUES (${data.name})
        `
  );
}

export default function Player() {
  const { control, handleSubmit } = useForm();
  const { mutate } = useMutation(addPlayer);

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
      <Button onPress={handleSubmit(submit)} colorScheme="pink" mt="4">
        Agregar
      </Button>
    </View>
  );
}