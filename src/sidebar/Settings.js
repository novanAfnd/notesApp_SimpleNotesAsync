import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

// Style
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const Settings = () => {
  return (
    <View style={styles.container}>
      <View style={styles.menuItemContainer}>
        <TouchableOpacity>
          <View style={styles.menuItemInner}>
            <MaterialCommunityIcons name="theme-light-dark" size={24} color="black" />
            <View style={styles.menuItemInnerText}>
              <Text style={styles.menuItemInnerTextHeader}>Theme</Text>
              <Text style={styles.menuItemInnerTextDesc}>Dark</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.menuItemContainer}>
        <TouchableOpacity>
          <View style={styles.menuItemInner}>
            <MaterialCommunityIcons name="theme-light-dark" size={24} color="black" />
            <View style={styles.menuItemInnerText}>
              <Text style={styles.menuItemInnerTextHeader}>Theme</Text>
              <Text style={styles.menuItemInnerTextDesc}>Dark</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Warna latar belakang putih
    padding: 10,
  },
  menuItemContainer: {
    margin: 5,
    marginBottom: 10,
    paddingLeft: 5,
  },
  menuItemInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemInnerText: {
    fontFamily: "Roboto",
    marginLeft: 12,
  },
  menuItemInnerTextHeader: {
    fontSize: 20,
    fontWeight: 600,
  },
  menuItemInnerTextDesc: {
    fontSize: 12,
    fontWeight: 400,
  },
});

export default Settings;
