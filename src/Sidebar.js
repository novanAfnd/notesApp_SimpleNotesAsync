import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import { useNavigation } from "@react-navigation/native";

// Style
import { Ionicons } from "@expo/vector-icons";

const Sidebar = (props) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.sideBarContainer}>
        <View style={styles.bannerContainer}>
          <View style={styles.bannerInner}>
            <Text style={styles.bannerText}>Banner</Text>
          </View>
        </View>

        <View style={styles.drawerItem}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Home");
              props.navigation.toggleDrawer();
            }}
          >
            <View style={styles.drawerItemInner}>
              <Ionicons name="home-outline" size={22} color={"black"} />
              <Text style={styles.drawerItemInnerText}>Home</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.drawerItem}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Settings");
              props.navigation.toggleDrawer();
            }}
          >
            <View style={styles.drawerItemInner}>
              <Ionicons name="settings-outline" size={22} color={"black"} />
              <Text style={styles.drawerItemInnerText}>Settings</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.drawerItem}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SyncBackup");
              props.navigation.toggleDrawer();
            }}
          >
            <View style={styles.drawerItemInner}>
              <Ionicons name="sync-outline" size={22} color={"black"} />
              <Text style={styles.drawerItemInnerText}>Sync and Backup</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.drawerItem}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("About");
              props.navigation.toggleDrawer();
            }}
          >
            <View style={styles.drawerItemInner}>
              <Ionicons name="information-circle-outline" size={22} color={"black"} />
              <Text style={styles.drawerItemInnerText}>About</Text>
            </View>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sideBarContainer: {
    backgroundColor: "white",
  },
  // Banner
  bannerContainer: {
    backgroundColor: "white",
    margin: 10,
    height: 100,
    width: "90%",
    borderRadius: 20,
    borderColor: "gray", // atur warna border
    borderWidth: 2, // atur lebar border
  },
  bannerInner: {
    margin: 10,
  },
  bannerText: {
    fontSize: 40,
    fontWeight: 900,
  },

  // Drawer Item
  drawerContainer: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 10,
  },

  // Random Item
  drawerItem: {
    margin: 10,
    paddingLeft: 10,
  },
  drawerItemInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  drawerItemInnerText: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Roboto",
    marginLeft: 10,
  },
});

export default Sidebar;
