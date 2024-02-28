import "react-native-gesture-handler";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Style
import { FlashList } from "@shopify/flash-list";
import { AntDesign } from "@expo/vector-icons";

const Home = () => {
  const navigation = useNavigation();

  // Categories ________________________________________________________________________________________________
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

        console.log("retrieved Categories: (fetchCategory function - Home) ");
        console.log(retrievedCategories);

        setCategoriesAsync(retrievedCategories); // Category pada Async
        setCategoriesDisplay(["All", ...retrievedCategories]); // Category pada Picker
        setSelectedCategory("All");
        setShowDeleteRename(false); // Reset status tombol delete dan rename
      } else {
        console.log(
          "Categories are not yet saved in AsyncStorage and will be created soon"
        );
        const retrievedCategories = [];
        const jsonValue = JSON.stringify(retrievedCategories);
        await AsyncStorage.setItem("arrayOfCategories", jsonValue);

        console.log("retrieved Categories: ");
        console.log(retrievedCategories);

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
        // ... karena setelah category di rename, setSelectedCategory harusnya category yang di rename tersebut, bukan kembali ke "All"
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRenameCancel = () => {
    setIsRenameModalVisible(false);
  };

  // Notes _____________________________________________________________________________________________________
  const [notes, setNotes] = useState([]); // render all notes

  // Fetch Notes from Local Storage
  const fetchNotes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("arrayOfNotes");
      if (jsonValue !== null) {
        // Mengubah string JSON ke array
        const retrievedNotes = JSON.parse(jsonValue);

        console.log("retrieved Notes: (fetchNotes function - Home) ");
        console.log(retrievedNotes);

        // newNotes diisi item dari retrievedNotes
        const newNotes = [];

        retrievedNotes.forEach((item) => {
          const { category, title, note, date, id, favorite } = item;
          newNotes.push({
            category,
            title,
            note,
            date, // ditambahkan date agar date tidak undefined
            id,
            favorite,
          });
        });

        setNotes(newNotes);
      } else {
        console.log("Notes are not yet saved in Asyncstorage and will be created soon");
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
    });

    return unsubscribe;
  }, [navigation]);

  // Short Menu _________________________________________________________________________________________________
  const [sortType, setSortType] = useState("title");
  const [isShortMenuModalVisible, setIsShortMenuModalVisible] = useState(false); // Short menu (kondisi awal false/tidak nampak)

  const toggleShortMenu = () => {
    setIsShortMenuModalVisible(!isShortMenuModalVisible); // Short menu (untuk membuka menu)
  };

  const handleCloseShortMenu = () => {
    setIsShortMenuModalVisible(false); // Short menu (untuk menutup menu)
  };

  // Sortir note berdasarkan Kategori, Jenis Pengurutan, dan Filter Category
  const sortedNotes =
    selectedCategory === "All"
      ? [...notes]
      : notes.filter((note) => note.category === selectedCategory);

  const sortFunction = (a, b) => {
    switch (sortType) {
      case "title":
        return a.title.localeCompare(b.title);
      case "date":
        return new Date(a.date) - new Date(b.date);
      case "favorite":
        return a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1;
      default:
        return 0;
    }
  };

  const filteredNotes = sortedNotes.sort(sortFunction); // Hasil akhir sortir

  // Short
  const handleSortBy = (type) => {
    setSortType(type);
    handleCloseShortMenu();
  };

  return (
    <View style={styles.container}>
      {/* Short Menu ____________________________________________________________________________________________*/}
      <View style={styles.headerMenuContainer}>
        <TouchableOpacity>
          <Text>Short by:</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleShortMenu}>
          <Text>Menu</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isShortMenuModalVisible}
        onRequestClose={() => {
          handleCloseShortMenu();
        }}
        transparent={true}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => handleCloseShortMenu()}
        >
          <View style={styles.menuContainerShortBy}>
            <TouchableOpacity
              onPress={() => handleSortBy("title")}
              style={styles.menuItem}
            >
              <Text>Title</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSortBy("date")}
              style={styles.menuItem}
            >
              <Text>Date</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSortBy("favorite")}
              style={styles.menuItem}
            >
              <Text>Favorite</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Category ____________________________________________________________________________________________*/}
      <View style={styles.category}>
        <Text>Categories </Text>

        <TouchableOpacity onPress={toggleMenu}>
          <Text>Menu</Text>
        </TouchableOpacity>

        <Modal
          visible={isMenuVisible}
          onRequestClose={() => {
            handleCloseMenu();
          }}
          transparent={true}
          animationType="fade"
        >
          <TouchableOpacity
            style={styles.modalContainer}
            onPress={() => handleCloseMenu()}
          >
            <View style={styles.menuContainerCategory}>
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
          </TouchableOpacity>
        </Modal>
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

      {/* Notes _______________________________________________________________________________________________*/}
      <FlashList
        data={filteredNotes}
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
              {item.favorite && (
                <View style={styles.favoriteIcon}>
                  <AntDesign name="star" size={16} color="gold" />
                </View>
              )}
            </Pressable>
          </View>
        )}
      />

      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("NoteAdd")}
        >
          <AntDesign name="plus" size={45} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  // Short Menu _______________________________________________________________________________________________
  headerMenuContainer: {
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 2,
    width: "97%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainerShortBy: {
    backgroundColor: "white",
    borderColor: "gray", // atur warna border
    borderWidth: 2, // atur lebar border
    position: "absolute",
    top: 50,
    right: 0,
    width: 150,
  },

  // Categories _______________________________________________________________________________________________
  category: {
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 2,
    width: "97%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuContainerCategory: {
    backgroundColor: "white",
    borderColor: "gray", // atur warna border
    borderWidth: 2, // atur lebar border
    position: "absolute",
    top: 90,
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

  // Notes _____________________________________________________________________________________________________
  noteView: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
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
    height: 50, // agar bintang berada tepat di baris paling bawah
    width: 120,
    marginTop: 5,
  },
  favoriteIcon: {
    position: "absolute",
    bottom: -20,
    right: -6,
  },
  buttonView: {
    position: "absolute",
    bottom: 50,
    right: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "97%",
  },
  addButton: {
    backgroundColor: "aqua",
    borderRadius: 50,
    margin: 10,
    padding: 10,
    elevation: 7,
  },
});

export default Home;
