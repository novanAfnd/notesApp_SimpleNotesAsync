import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Header } from "@react-navigation/stack";

const About = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.header}>App Description</Text>
        <Text style={styles.text}>
          Simple Notes is a simple note-taking application that can be used to record
          everything from minor details to important tasks, assisting users with their
          daily activities.
        </Text>
        <Text style={styles.header}>Development Status</Text>
        <Text style={styles.text}>
          The application is still under development; some features may contain bugs.
        </Text>
        <Text style={styles.header}>Developer</Text>
        <Text style={styles.text}>
          This application was developed by Novan Afandi, an enthusiastic beginner
          programmer.
        </Text>
        <Text style={styles.header}>App Version</Text>
        <Text style={styles.text}>Version 1.0.0</Text>
        <Text style={styles.header}>Contact</Text>
        <Text style={styles.text}>nevlest72@gmail.com</Text>
        <Text style={styles.header}>Thank You!</Text>
        <Text style={styles.text}>Thank you for using my application.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0", // Warna bingkai abu
    justifyContent: "center",
    padding: 20,
  },
  contentContainer: {
    backgroundColor: "#FFFFFF", // Warna latar belakang putih
    borderRadius: 10, // Membuat sudut bingkai melengkung
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
  },
});

export default About;
