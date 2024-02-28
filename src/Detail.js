import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Style
import { AntDesign } from "@expo/vector-icons";

const Detail = ({ route }) => {
  const navigation = useNavigation();

  // Categories ___________________________________________________________
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoriesAsync, setCategoriesAsync] = useState([]); // Untuk AsyncStorage
  const [categoriesDisplay, setCategoriesDisplay] = useState([]); // Untuk Picker
  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState(""); // Add new category
  const [showDeleteRename, setShowDeleteRename] = useState(false); // Delete dan Rename (ditampilkan atau tidak)
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [renameCategory, setRenameCategory] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Category menu (kondisi awal false/tidak nampak)

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible); // Category menu (untuk membuka menu)
  };

  const handleCloseMenu = () => {
    setIsMenuVisible(false); // Category menu (untuk menutup menu)
  };

  // Fetch Categories from Local Storage
  const fetchCategory = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("arrayOfCategories");
      if (jsonValue !== null) {
        // Mengubah string JSON kembali ke array
        const retrievedCategories = JSON.parse(jsonValue);

        setCategoriesAsync(retrievedCategories); // Category pada Async
        setCategoriesDisplay(["All", ...retrievedCategories]); // Category pada Picker
        setSelectedCategory(route.params.item.category); // agar category pada picker sesuai note yang dipilih
        // agar tombol delete dan rename tetap ada saat note dengan category selain "All" yang dipilih
        if (route.params.item.category === "All") {
          setShowDeleteRename(false);
          console.log("selected category is All");
        } else {
          setShowDeleteRename(true);
          console.log("selected category is not All");
        }
      } else {
        console.log(
          "Categories are not yet saved in AsyncStorage and will be created soon"
        );
        const retrievedCategories = [];
        const jsonValue = JSON.stringify(retrievedCategories);
        await AsyncStorage.setItem("arrayOfCategories", jsonValue);

        setCategoriesAsync(retrievedCategories); // Category pada Async
        setCategoriesDisplay(["All", ...retrievedCategories]); // Category pada Picker
        setSelectedCategory("All");
        setShowDeleteRename(false); // Reset status tombol delete dan rename
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Add New Category
  const handleNewCategory = () => {
    setIsNewModalVisible(true);
    handleCloseMenu(); // Category menu (untuk menutup menu)
  };

  const addCategory = async () => {
    if (newCategory) {
      const updatedCategoriesAsync = [...categoriesAsync, newCategory];
      setCategoriesAsync(updatedCategoriesAsync);
      setNewCategory("");
      setIsNewModalVisible(false);

      try {
        const jsonValue = JSON.stringify(updatedCategoriesAsync);
        await AsyncStorage.setItem("arrayOfCategories", jsonValue);
      } catch (error) {
        console.log(error);
      }

      // Update array untuk tampilan di Picker
      setCategoriesDisplay(["All", ...updatedCategoriesAsync]);
      setSelectedCategory("All");
      setShowDeleteRename(false); // Reset status tombol delete dan rename
    }
  };

  // Delete Category
  const handleDelete = async () => {
    // Menggunakan method filter untuk membuat array baru "updatedCategoriesAsync"
    // ... dengan melakukan iterasi mengecek satu-persatu item pada category
    // ... untuk tidak menyertakan kategori yang akan dihapus (selectedCategory).
    const updatedCategoriesAsync = categoriesAsync.filter(
      (category) => category !== selectedCategory // return category selain yang dipilih (selectedCategory)
    );

    try {
      const jsonValue = JSON.stringify(updatedCategoriesAsync);
      await AsyncStorage.setItem("arrayOfCategories", jsonValue);

      // Update array untuk Async
      setCategoriesAsync(updatedCategoriesAsync);
      // Update array untuk tampilan di Picker
      setCategoriesDisplay(["All", ...updatedCategoriesAsync]);
      setSelectedCategory("All");
      setShowDeleteRename(false); // Reset status tombol delete dan rename
      handleCloseMenu(); // Category menu
    } catch (error) {
      console.log(error);
    }
  };

  // Rename Category
  const handleRename = () => {
    setIsRenameModalVisible(true);
    setRenameCategory(selectedCategory); // Menetapkan nilai awal nama kategori ke input rename
    handleCloseMenu(); // Category menu (untuk menutup menu)
  };

  const handleRenameSave = async () => {
    if (renameCategory) {
      const updatedCategoriesAsync = categoriesAsync.map((category) =>
        category === selectedCategory ? renameCategory : category
      );

      try {
        const jsonValue = JSON.stringify(updatedCategoriesAsync);
        await AsyncStorage.setItem("arrayOfCategories", jsonValue);

        // Update array untuk Async
        setCategoriesAsync(updatedCategoriesAsync);
        // Update array untuk tampilan di Picker
        setCategoriesDisplay(["All", ...updatedCategoriesAsync]);
        setSelectedCategory(renameCategory);
        setIsRenameModalVisible(false);
        // setShowDeleteRename(false); ... kode ini aku hapus agar delete&rename tetap ada setelah category di rename,
        // ... karena setelah category di rename, setSelectedCategory adalah category yang di rename tersebut, bukan kembali "All"
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRenameCancel = () => {
    setIsRenameModalVisible(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCategory();
      console.log(route.params.item);
    });

    return unsubscribe;
  }, [navigation]);

  // Notes ___________________________________________________________
  const [noteTitle, setNoteTitle] = useState(route.params.item.title);
  const [noteText, setNoteText] = useState(route.params.item.note);
  const [isFavorite, setIsFavorite] = useState(route.params.item.favorite);

  // Favorite Status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Update the data
  const handeUpdateNote = () => {
    AsyncStorage.getItem("arrayOfNotes")
      .then((jsonValue) => {
        if (jsonValue !== null) {
          // Mengubah string JSON kembali ke array
          const arrayOfNotes = JSON.parse(jsonValue);

          // Mencari index catatan yang akan diperbarui
          const indexToUpdate = arrayOfNotes.findIndex(
            (item) =>
              item.category === route.params.item.category &&
              item.title === route.params.item.title &&
              item.note === route.params.item.note &&
              item.date === route.params.item.date &&
              item.id === route.params.item.id &&
              item.favorite === route.params.item.favorite
          );

          // Memperbarui data catatan jika ditemukan
          if (indexToUpdate !== -1) {
            arrayOfNotes[indexToUpdate] = {
              category: selectedCategory,
              title: noteTitle,
              note: noteText,
              date: route.params.item.date,
              id: route.params.item.id,
              favorite: isFavorite,
            };

            // Menyimpan data yang diperbarui kembali ke AsyncStorage
            AsyncStorage.setItem("arrayOfNotes", JSON.stringify(arrayOfNotes));
          }
        }
      })
      .then(() => {
        // Data updated succesfully!, move to Home screen
        console.log("Data updated");
        navigation.navigate("Home");
      })
      .catch((error) => {
        // Data update error!
        console.log(error);
      });
  };

  // Delete the data
  const handleDeleteNote = () => {
    AsyncStorage.getItem("arrayOfNotes")
      .then((jsonValue) => {
        if (jsonValue !== null) {
          // Mengubah string JSON kembali ke array
          const arrayOfNotes = JSON.parse(jsonValue);

          // Mencari index catatan yang akan dihapus
          const indexToDelete = arrayOfNotes.findIndex(
            (item) =>
              item.category === route.params.item.category &&
              item.title === route.params.item.title &&
              item.note === route.params.item.note &&
              item.date === route.params.item.date &&
              item.id === route.params.item.id &&
              item.favorite === route.params.item.favorite
          );

          // Menghapus data catatan jika ditemukan
          if (indexToDelete !== -1) {
            arrayOfNotes.splice(indexToDelete, 1);

            // Menyimpan data yang diperbarui kembali ke AsyncStorage
            AsyncStorage.setItem("arrayOfNotes", JSON.stringify(arrayOfNotes));
          }
        }
      })
      .then(() => {
        // Move to Home screen
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      {/* Category ___________________________________________________________*/}
      <View style={styles.category}>
        <Text>Categories </Text>

        <TouchableOpacity onPress={toggleMenu}>
          <Text>Menu</Text>
        </TouchableOpacity>

        <TouchableWithoutFeedback onPress={handleCloseMenu}>
          <Modal visible={isMenuVisible} transparent={true} animationType="fade">
            <View style={styles.menuContainer}>
              <TouchableOpacity onPress={handleNewCategory} style={styles.menuItem}>
                <Text>+ New Category</Text>
              </TouchableOpacity>

              {showDeleteRename && (
                <>
                  <TouchableOpacity onPress={handleDelete} style={styles.menuItem}>
                    <Text>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleRename} style={styles.menuItem}>
                    <Text>Rename</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </Modal>
        </TouchableWithoutFeedback>
      </View>

      <Modal visible={isNewModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalInner}>
            <TextInput
              style={styles.modalInput}
              placeholder="New Category Name"
              value={newCategory}
              onChangeText={(text) => setNewCategory(text)}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={addCategory}>
                <Text>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsNewModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isRenameModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsRenameModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalInner}>
            <TextInput
              style={styles.modalInput}
              placeholder="New Category Name"
              value={renameCategory}
              onChangeText={(text) => setRenameCategory(text)}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleRenameSave}>
                <Text>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleRenameCancel}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.dropDown}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedCategory(itemValue);
            setShowDeleteRename(itemValue !== "All");
          }}
        >
          {categoriesDisplay.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>
      </View>

      {/* Notes ___________________________________________________________*/}
      <TextInput
        placeholder="Title"
        value={noteTitle}
        onChangeText={(text) => setNoteTitle(text)}
        style={styles.inputTitle}
      />
      <TextInput
        placeholder="Note"
        value={noteText}
        onChangeText={(text) => setNoteText(text)}
        style={styles.inputNote}
        multiline={true}
      />

      <View style={styles.buttonView}>
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <AntDesign name={isFavorite ? "star" : "staro"} size={45} color="yellow" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteNote}>
          <AntDesign name="delete" size={45} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.updateButton} onPress={handeUpdateNote}>
          <AntDesign name="save" size={45} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  // Categories ___________________________________________________________
  category: {
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 2,
    width: "97%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuContainer: {
    backgroundColor: "white",
    position: "absolute",
    top: 50,
    right: 0,
    width: 150,
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  dropDown: {
    marginVertical: 5,
    marginHorizontal: 5,
    width: "97%",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalInner: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    marginBottom: 8,
    width: 200,
    borderRadius: 8,
  },
  modalButtonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  modalButton: {
    backgroundColor: "lightblue",
    margin: 4,
    padding: 8,
    borderRadius: 8,
    flex: 1, // Menggunakan properti flex agar tombol sejajar dan sama besar
    alignItems: "center", // Agar teks di tengah
    marginHorizontal: 4, // Jarak antara tombol
  },

  // Notes ___________________________________________________________
  inputTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 5,
    height: 50,
    width: "97%",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  inputNote: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5,
    height: 200,
    width: "97%",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  buttonView: {
    position: "absolute",
    bottom: 50,
    right: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "97%",
  },
  favoriteButton: {
    borderRadius: 50,
    margin: 10,
    padding: 10,
    elevation: 7,
  },
  deleteButton: {
    backgroundColor: "#FF3333",
    borderRadius: 50,
    margin: 10,
    padding: 10,
    elevation: 7,
  },
  updateButton: {
    backgroundColor: "#29FF83",
    borderRadius: 50,
    margin: 10,
    padding: 10,
    elevation: 7,
  },
});

export default Detail;
