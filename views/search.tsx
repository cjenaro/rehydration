import {
  Box,
  Pressable,
  Center,
  ChevronRightIcon,
  Flex,
  Heading,
  HStack,
  IconButton,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import * as React from "react";
import { useQuery } from "react-query";
import Layout from "../components/layout";
import db, { sql } from "../database";

async function getPlayers() {
  const players = (await db.query(sql`SELECT * FROM players`)) || [];
  return players;
}

export default function Search({ navigation }: { navigation: any }) {
  const { data: players, isLoading } = useQuery(["PLAYERS"], getPlayers);

  const navigate = (somewhere: string, player: object) => () =>
    navigation.navigate(somewhere, {
      player,
    });

  return (
    <Layout>
      <Heading size="md">Buscar un jugador.</Heading>
      <ScrollView mt="4">
        <VStack>
          {players?.map((player) => (
            <Pressable key={player.id} onPress={navigate("EditPlayer", player)} mb="1">
              <Flex
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                w="100%"
                py="1"
                borderRadius="md"
                position="relative"
                bg="gray.700"
              >
                <Text pl="3">{player.name}</Text>
                <ChevronRightIcon position="relative" bottom="-3px" />
              </Flex>
            </Pressable>
          ))}
        </VStack>
      </ScrollView>
    </Layout>
  );
}
