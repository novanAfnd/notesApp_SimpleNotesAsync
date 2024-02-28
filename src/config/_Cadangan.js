// Home ___________________________________________________________

useEffect(() => {
  getDocs(collection(db, "notes")).then((querySnapshot) => {
    const newNotes = [];
    querySnapshot.forEach((doc) => {
      const { note, title } = doc.data();
      newNotes.push({ note, title, id: doc.id });
    });
    setNotes(newNotes);
  });
}, []);

// NoteAdd ___________________________________________________________

const handleAdds = () => {
  addDoc(collection(db, "notes"), {
    // Add the data
    title: title,
    note: note,
  })
    .then(() => {
      // data added succesfully!
      setTitle(" ");
      setNote(" ");
      Keyboard.dismiss();
      navigation.navigate("Home"); // Move to Home screen
    })
    .catch((error) => {
      // data added error!
      console.log(error);
    });
};

// Detail ___________________________________________________________

// Update the data
const handleUpdates = () => {
  if (noteTitle && noteText.length > 0) {
    updateDoc(doc(db, "notes", route.params.item.id), {
      // Update old data with new data
      title: noteTitle,
      note: noteText,
    })
      .then(() => {
        // Data updated succesfully!
        navigation.navigate("Home"); // Move to Home screen
        console.log("Data updated");
        console.log(noteTitle);
        console.log(noteText);
      })
      .catch((error) => {
        // Data update error!
        console.log(error);
      });
  }
};

// Delete the data
const handleDeletes = () => {
  deleteDoc(doc(db, "notes", route.params.item.id))
    .then(() => {
      navigation.navigate("Home"); // Move to Home screen
    })
    .catch((error) => {
      console.log(error);
    });
};

// Asyncstorage without async await ___________________________________________________________________________________
// Home ___________________________________________________________

// Fetch Categories
const fetchCategory = () => {
  console.log("fetchCategory called");
  AsyncStorage.getItem("arrayOfCategories")
    .then((jsonCategories) => {
      if (jsonCategories !== null) {
        // Mengubah string JSON kembali ke array
        const retrievedCategories = JSON.parse(jsonCategories);

        console.log("retrievedCategories: ");
        console.log(retrievedCategories);

        //setCategories(retrievedCategories);
      } else {
        const retrievedCategories = ["from else"];

        console.log("retrievedCategories: ");
        console.log(retrievedCategories);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

/* 
  // Fetch Categories from Local Storage
  const fetchCategory = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("arrayOfCategories");
      if (jsonValue !== null) {
        // Mengubah string JSON kembali ke array
        const retrievedCategories = JSON.parse(jsonValue);

        console.log("retrieved Categories: ");
        console.log(retrievedCategories);

        // Agar bisa ditampilkan pada picker
        setCategories(retrievedCategories);
      } else {
        console.log(
          "Categories are not yet saved in Asyncstorage and will be created soon"
        );
        const retrievedCategories = [];

        const jsonValue = JSON.stringify(retrievedCategories);
        await AsyncStorage.setItem("arrayOfCategories", jsonValue);

        console.log("retrieved Categories: ");
        console.log(retrievedCategories);

        // Agar bisa ditampilkan pada picker
        setCategories(retrievedCategories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Add New Category
  const addCategory = async () => {
    if (newCategory) {
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      setNewCategory("");
      setIsModalVisible(false);

      try {
        const jsonValue = JSON.stringify(updatedCategories);
        await AsyncStorage.setItem("arrayOfCategories", jsonValue);
      } catch (error) {
        console.log(error);
      }
    }
  };
   */

// Fetch Notes
const fetchNote = () => {
  console.log("fetchNote called");
  AsyncStorage.getItem("arrayOfNotes")
    .then((jsonValue) => {
      if (jsonValue !== null) {
        // Mengubah string JSON ke array
        const retrievedNotes = JSON.parse(jsonValue);

        console.log("retrievedNotes: ");
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
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

// NoteAdd ___________________________________________________________

// Add New Note
const handleAdd = () => {
  AsyncStorage.getItem("arrayOfNotes")
    .then((jsonValue) => {
      if (jsonValue !== null) {
        // Mengubah string JSON kembali ke array
        const arrayOfNotes = JSON.parse(jsonValue);

        // Membuat array baru dengan arrayOfNotes yang lama
        const latestArrayOfNotes = [...arrayOfNotes];

        const notes = {
          category: selectedCategory,
          title: title,
          note: note,
          date: generateSimpleDate(),
          id: Math.random().toString(16).slice(2), // Menambahkan random id
          favorite: isFavorite,
        };

        latestArrayOfNotes.push(notes);

        console.log("arrayOfNotes added new notes: ");
        console.log(latestArrayOfNotes);
        console.log(
          "___________________________________________________________"
        );

        const updatedJsonValue = JSON.stringify(latestArrayOfNotes);

        // Menyimpan kembali JSON string ke dalam AsyncStorage
        AsyncStorage.setItem("arrayOfNotes", updatedJsonValue);
      }
    })
    .then(() => {
      // Data added succesfully!
      setTitle(" "); // Mengosongkan judul setelah ditambahkan
      setNote(" "); // Mengosongkan catatan setelah ditambahkan
      setIsFavorite(false); // Mengembalikan status favorite ke false setelah ditambahkan
      Keyboard.dismiss();
      navigation.navigate("Home");
    })
    .catch((error) => {
      // Data added error!
      console.error(error);
    });
};

// Detail ___________________________________________________________

// Update the data
const handleUpdate = () => {
  AsyncStorage.getItem("arrayOfNotes")
    .then((jsonValue) => {
      if (jsonValue !== null) {
        // Mengubah string JSON kembali ke array
        const arrayOfNotes = JSON.parse(jsonValue);

        // Mencari index catatan yang akan diperbarui
        const indexToUpdate = arrayOfNotes.findIndex(
          (item) =>
            item.title === route.params.item.title &&
            item.note === route.params.item.note &&
            item.id === route.params.item.id
        );

        // Memperbarui data catatan jika ditemukan
        if (indexToUpdate !== -1) {
          arrayOfNotes[indexToUpdate] = {
            title: noteTitle,
            note: noteText,
            id: route.params.item.id,
          };

          // Menyimpan data yang diperbarui kembali ke AsyncStorage
          AsyncStorage.setItem("arrayOfNotes", JSON.stringify(arrayOfNotes));
        }
      }
    })
    .then(() => {
      // Data updated succesfully!
      // Move to Home screen
      navigation.navigate("Home");
      console.log("Data updated");
      console.log(noteTitle);
      console.log(noteText);
    })
    .catch((error) => {
      // Data update error!
      console.log(error);
    });
};

// Delete the data
const handleDelete = () => {
  AsyncStorage.getItem("arrayOfNotes")
    .then((jsonValue) => {
      if (jsonValue !== null) {
        // Mengubah string JSON kembali ke array
        const arrayOfNotes = JSON.parse(jsonValue);

        // Mencari index catatan yang akan dihapus
        const indexToDelete = arrayOfNotes.findIndex(
          (item) =>
            item.title === route.params.item.title &&
            item.note === route.params.item.note &&
            item.id === route.params.item.id
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
