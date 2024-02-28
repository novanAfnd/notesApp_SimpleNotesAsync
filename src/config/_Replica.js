import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Style
import { FlashList } from "@shopify/flash-list";
import { AntDesign } from "@expo/vector-icons";

const Home = () => {
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]); // render all notes

  // Fetch Notes from Local Storage
  const fetchNotes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("arrayOfNotes");
      if (jsonValue !== null) {
        // Mengubah string JSON ke array
        const retrievedNotes = JSON.parse(jsonValue);

        console.log("retrieved Notes: ");
        console.log(retrievedNotes);

        // newNotes diisi item dari retrievedNotes
        const newNotes = [];

        retrievedNotes.forEach((item) => {
          const { category, title, note, id } = item;
          newNotes.push({
            category,
            title,
            note,
            id,
          });
        });

        setNotes(newNotes);
      } else {
        console.log(
          "Notes are not yet saved in Asyncstorage and will be created soon"
        );
        const retrievedNotes = [];

        const jsonValue = JSON.stringify(retrievedNotes);
        await AsyncStorage.setItem("arrayOfNotes", jsonValue);

        console.log("retrieved Notes: ");
        console.log(retrievedNotes);

        setNotes(retrievedNotes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect for re-render
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCategory();
      fetchNotes();

      console.log("console.log(notes);");
      console.log(notes.title);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Notes ___________________________________________________________*/}
      <FlashList
        data={notes}
        numColumns={2}
        estimatedItemSize={100}
        renderItem={({ item }) => (
          <View style={styles.noteView}>
            <Pressable onPress={() => navigation.navigate("Detail", { item })}>
              <Text style={styles.noteTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.noteDescription} numberOfLines={3}>
                {item.note}
              </Text>
            </Pressable>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("NoteAdd")}
      >
        <AntDesign name="plus" size={45} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  // Notes ___________________________________________________________
  noteView: {
    flex: 1,
    backgroundColor: "white",
    height: 120,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 7,
    alignItems: "center",
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: "bold",
    width: 120,
  },
  noteDescription: {
    fontSize: 16,
    width: 120,
    marginTop: 5,
  },
  button: {
    position: "absolute",
    bottom: 60,
    right: 30,
    backgroundColor: "aqua",
    borderRadius: 50,
    padding: 10,
    elevation: 7,
  },
});

export default Home;
