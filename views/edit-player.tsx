import { sql } from "@databases/websql-core";
import {
  Button,
  FormControl,
  Heading,
  Stack,
  Input as NInput,
  Text,
} from "native-base";
import * as React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { TextInput } from "react-native";
import { useMutation, useQuery } from "react-query";
import Input from "../components/input";
import Layout from "../components/layout";
import db from "../database";

async function getPlayersWeight(playerId: number) {
  const today = new Date();
  const unix = today.setHours(0, 0, 0, 0);
  const [player] = await db.query(sql`
        SELECT weight_before, weight_after, date, player_id 
        FROM player_weight 
        JOIN players ON players.id = player_weight.player_id 
        WHERE players.id = ${playerId} AND date = ${unix} ORDER BY date DESC LIMIT 1;
    `);

  return player;
}

function editPlayersWeight(playerId: number, isUpdate: boolean) {
  const today = new Date();
  const unix = today.setHours(0, 0, 0, 0);
  return async (data: FieldValues) => {
    const before = data.weight_before.replace(/[^0-9,]/g, "");
    const after = data.weight_after.replace(/[^0-9,]/g, "");
    return isUpdate
      ? await db.query(sql`
        UPDATE player_weight
        SET weight_before = ${before},
            weight_after = ${after},
            date = ${unix} 
        WHERE player_weight.player_id = ${playerId} AND date = ${unix};
    `)
      : await db.query(sql`
        INSERT INTO player_weight (weight_before, weight_after, date, player_id) 
        VALUES (${before}, ${after}, ${unix}, ${playerId})
    `);
  };
}

export default function EditPlayer({
  route,
}: {
  route: {
    params: {
      player: {
        id: number;
        name: string;
      };
    };
  };
}) {
  const { data: weights, refetch } = useQuery(["PLAYER_WEIGHT"], () =>
    getPlayersWeight(route.params.player.id)
  );
  const { mutate, isLoading, isError, isSuccess } = useMutation(
    editPlayersWeight(route.params.player.id, !!weights?.player_id),
    {
      onSuccess: () => refetch(),
    }
  );
  const { handleSubmit, control } = useForm();

  function submit(data: FieldValues) {
    mutate(data);
  }

  return (
    <Layout>
      <Heading>{route.params.player.name}</Heading>

      <FormControl>
        <Stack my={2}>
          <FormControl.Label>Peso antes del partido</FormControl.Label>
          <Input
            control={control}
            defaultValue={`${weights?.weight_before}`}
            name="weight_before"
            placeholder="80"
          />
        </Stack>
      </FormControl>
      <FormControl>
        <Stack my={2}>
          <FormControl.Label>Peso después del partido</FormControl.Label>
          <Input
            control={control}
            defaultValue={`${weights?.weight_after}`}
            name="weight_after"
            placeholder="79"
          />
        </Stack>
      </FormControl>
      <Button onPress={handleSubmit(submit)}>Enviar</Button>

      {isLoading && <Text my={2}>Cargando...</Text>}
      {isError && <Text my={2}>Error...</Text>}
      {isSuccess && <Text my={2}>Success...</Text>}
    </Layout>
  );
}
