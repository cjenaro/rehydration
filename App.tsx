import React from "react";
import {
  NativeBaseProvider,
  Container,
  Heading,
  Stack,
  Text,
  Button,
  StorageManager as ColorModeManager,
  extendTheme,
  ColorMode,
  useColorMode,
  View,
  ITheme,
  useColorModeValue,
} from "native-base";
import db, { sql } from "./database";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import { useForm } from "react-hook-form";
import Input from "./components/input";
import { backgroundColor } from "styled-system";
import Header from "./components/header";
import Player from "./components/player";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./views/home";
import Search from "./views/search";
import EditPlayer from "./views/edit-player";

const queryClient = new QueryClient();

db.tx(function* (tx) {
  yield tx.query(sql`
  CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT);
  `);
  yield tx.query(sql`
  CREATE TABLE IF NOT EXISTS color_mode (id INTEGER PRIMARY KEY, mode TEXT);
  `);
  yield tx.query(sql`
  CREATE TABLE IF NOT EXISTS players (id INTEGER PRIMARY KEY, name TEXT);
  `);
  yield tx.query(sql`
  CREATE TABLE IF NOT EXISTS player_weight (
    id INTEGER PRIMARY KEY, 
    date DATE,
    weight_before INTEGER, 
    weight_after INTEGER, 
    player_id INTEGER NOT NULL,
    FOREIGN KEY(player_id) REFERENCES players(id)
    );
  `);
});

const config = {
  useSystemColorMode: true,
  initialColorMode: "dark",
};

const customTheme = extendTheme({ config });

const colorModeManager: ColorModeManager = {
  get: async () => {
    try {
      const [{ mode }] = await db.query(
        sql`SELECT mode FROM color_mode WHERE id = 1`
      );
      return mode;
    } catch (e) {
      return "dark";
    }
  },
  set: async (value: ColorMode) => {
    try {
      await db.query(
        sql`INSERT OR REPLACE INTO color_mode (id, mode) VALUES (1, ${value})`
      );
    } catch (e) {
      console.log(e);
    }
  },
};

const NavStack = createNativeStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider theme={customTheme} colorModeManager={colorModeManager}>
      <NavigationContainer>
        <QueryClientProvider client={queryClient}>
          <NavStack.Navigator initialRouteName="Home">
            <NavStack.Screen name="Home" component={Home} />
            <NavStack.Screen name="Jugadores" component={Search} />
            <NavStack.Screen name="Jugador" component={EditPlayer} />
          </NavStack.Navigator>
        </QueryClientProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
