import { sql } from "@databases/websql-core";
import { Button, FormControl, Heading, HStack, Stack, Text } from "native-base";
import * as React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Input from "../components/input";
import Layout from "../components/layout";
import db from "../database";

async function getPlayersWeight(playerId: number) {
  const today = new Date();
  const unix = today.setHours(0, 0, 0, 0);
  const players = await db.query(sql`
        SELECT weight_before, weight_after, date, player_id 
        FROM player_weight 
        JOIN players ON players.id = player_weight.player_id 
        WHERE players.id = ${playerId} AND date = ${unix} ORDER BY date DESC LIMIT 1;
    `);
  const [player] = players;
  return player;
}

function editPlayersWeight(playerId: number, isUpdate: boolean) {
  const today = new Date();
  const unix = today.setHours(0, 0, 0, 0);
  return async (data: FieldValues) => {
    const before = Number(data.weight_before.replace(/[^0-9,]/g, ""));
    const after = Number(data.weight_after.replace(/[^0-9,]/g, ""));
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

function deletePlayer(id: number) {
  return async () => {
    db.query(sql`
      DELETE FROM players WHERE id = ${id}
    `);
  };
}

export default function EditPlayer({
  route,
  navigation,
}: {
  navigation: any;
  route: {
    params: {
      player: {
        id: number;
        name: string;
      };
    };
  };
}) {
  const queryClient = useQueryClient();
  const { handleSubmit, control, setValue } = useForm();
  const {
    data: weights,
    refetch,
    isLoading: dataLoading,
  } = useQuery(
    ["PLAYER_WEIGHT"],
    () => getPlayersWeight(route.params.player.id),
    {
      onSuccess: (fetched) => {
        setValue("weight_before", `${fetched?.weight_before || ""}`);
        setValue("weight_after", `${fetched?.weight_after || ""}`);
      },
    }
  );

  const { mutate, isLoading } = useMutation(
    editPlayersWeight(route.params.player.id, !!weights?.player_id),
    {
      onSuccess: () => refetch(),
    }
  );

  const { mutate: deleteMutation, isLoading: deleteLoading } = useMutation(
    deletePlayer(route.params.player.id),
    {
      onSuccess: () => {
        queryClient.refetchQueries("PLAYERS");
        navigation.pop();
      },
    }
  );

  function submit(data: FieldValues) {
    mutate(data);
  }

  function handleDelete() {
    deleteMutation();
  }

  return (
    <Layout>
      <HStack w="100%" alignItems="center" justifyContent="space-between">
        <Heading>{route.params.player.name}</Heading>
        <Button
          onPress={handleDelete}
          colorScheme="pink"
          variant="outline"
          isLoading={deleteLoading}
          mt="2"
          size="sm"
        >
          Eliminar
        </Button>
      </HStack>

      <FormControl>
        <Stack my={2}>
          <FormControl.Label>Peso antes del partido</FormControl.Label>
          <Input control={control} name="weight_before" placeholder="80" />
        </Stack>
      </FormControl>
      <FormControl>
        <Stack my={2}>
          <FormControl.Label>Peso después del partido</FormControl.Label>
          <Input control={control} name="weight_after" placeholder="79" />
        </Stack>
      </FormControl>
      <Button
        onPress={handleSubmit(submit)}
        colorScheme="pink"
        isLoading={isLoading || dataLoading}
        mt="2"
      >
        Enviar
      </Button>

      {weights?.weight_before && weights?.weight_after ? (
        <Rehydrate weights={weights} />
      ) : null}
    </Layout>
  );
}

function Rehydrate({
  weights,
}: {
  weights: {
    weight_before: number;
    weight_after: number;
  };
}) {
  const diff = weights.weight_before - weights.weight_after;
  return (
    <Stack my={2}>
      <Heading my="2">Diferencia: -{diff}</Heading>
      <Heading my="2">
        Deshidratación: {((diff * 100) / weights.weight_before).toFixed(2)}
      </Heading>
      <Heading my="2">Rehidratación: {diff * 1.5}L</Heading>
    </Stack>
  );
}
