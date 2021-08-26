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
  Input,
  Spinner,
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
  const { data: players, isLoading } = useQuery(["PLAYERS"], getPlayers, {
    onSuccess: () => {
      setFilteredPlayers(players);
    },
  });
  const [filteredPlayers, setFilteredPlayers] = React.useState<
    any[] | undefined
  >([]);

  const navigate = (somewhere: string, player: object) => () =>
    navigation.navigate(somewhere, {
      player,
    });

  function handleFilter(query: string) {
    if (!players) return;
    const filtered = players.filter(
      (player) => player.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );

    setFilteredPlayers(filtered);
  }

  return (
    <Layout>
      <Heading size="md">Buscar un jugador.</Heading>
      <Input mt="4" onChangeText={handleFilter} placeholder="Buscar..." />
      {!isLoading ? (
        <ScrollView mt="4" mb="70px">
          <VStack>
            {filteredPlayers?.map((player) => (
              <Pressable
                key={player.id}
                onPress={navigate("Jugador", player)}
                mb="1"
              >
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
      ) : (
        <Spinner />
      )}
    </Layout>
  );
}
