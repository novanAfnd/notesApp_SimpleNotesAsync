import AsyncStorage from "@react-native-async-storage/async-storage";

// Array of category
const arrayOfCategories = ["All"];
const jsonCategories = JSON.stringify(arrayOfCategories);
AsyncStorage.setItem("arrayOfCategories", jsonCategories);

// Array of notes
const arrayOfNotes = [];
const jsonValue = JSON.stringify(arrayOfNotes);
AsyncStorage.setItem("arrayOfNotes", jsonValue);

// coba pindah array of notes pada home dan lihat apakah masih bekerja
// ... saat dicoba ditaruh pada Home.js muncul masalah lama,
// ... yaitu note yang ditampilkan hanya satu meskipun berkali-kali ditambahkan
// Apakah mungkin jika kita mendelkarasikan array atau object kosong pada file js manapun,
// ... jika kode dijalankan berulang kali hanya akan membuat Asyncstorage membaca array yang sama
// ... dan membuat item yang ditambahkan tetap satu
// ... sehingga yang paling benar mungkin kita tidak perlu mendeklarasikan array kosong,
// ... namun langsung setItem dan getItem
// ... maka dari itu pada website dokumentasi ada if(jsonValue != null) dan else {null}
// ... dan seperti if(jsonValue != null){parse...} dan else {[]}
// ... ini seolah-olah jika belum ada apa-apa pada Asyncstorage maka dibuatkan array kosong

// Masalah AsyncStorage: *SOLVED*
// Mungkin json value terimport dengan benar pada Home namun tidak benar pada NoteAdd
// ... sejak awal mungkin aku tidak sadar
// ... jika menyimpan Asyncstorage pada file JS yang tidak bersangkutan tidak akan bekerja
// ... yang kemarin bekerja karena mungkin sudah berulang kali dicoba pada file Home.js dan Storage.js diulang-ulang
// ... sehingga mungkin cache di belakang layar mengambil yang dari Home.js
// Penyelesaian dari masalah penyimpanan Async adalah:
// ... saat kali pertama meyimpan kita tahu kita tidak memiliki Array atau Object atau apapun di dalam Async
// ... sehingga kita tidak bisa menggunakan AsyncStorage.getItem
// ... maka dari itu kita buat "condition if" jika (jsonValue !== null) maka kita AsyncStorage.getItem
// ... dan else untuk saat kita jsonValue == null atau benar-benar null(kosong) maka kita buat array atau object baru
// ... dan kita AsyncStorage.setItem sekaligus
// ... Jadi saat kita belum menyimpan apa-apa pada Asyncstorage maka else akan dijalankan
// ... dan saat kita panggil fungsi keseluruhan pada kali kedua
// ... maka sudah pasti kita memiliki array yang sudah tersimpan pada Asynstorage
// ... dan bagian else tidak akan terpanggil lagi
// ... dan kita tidak perlu mendeclare arrayOfNotes pada file js terpisah lagi

// Progress ___________________________________________________________________________
/*
Main Features:
- Asyncstorage ... SUDAH
- Add, Edit, Delete note ... SUDAH
- Category ... SUDAH
- Add, Edit, Delete category ... SUDAH
- Sortir note sesuai category pada Home ... SUDAH
- Date pada note ... SUDAH
- Favorite, dengan cara favorite(true) atau (false) ... SUDAH
- Sortir note sesuai abjad, date, favorite dll. pada Home ... SUDAH
- Sidebar Menu (kita buat header Home menjadi tombol untuk membuka menu)
- Sidabar - Setting (kita buat stack screen menuju screen setting utuh)
- Sidabar - Sync & Backup (kita buat stack screen menuju screen sync & backup utuh)
- Sidebar - Menu About (kita buat stack screen menuju screen about utuh)

Optional Features (menyusul):
- Setting - Theme ( Light dan Dark, kemudian warna box notenya bisa diubah sesuka hati)
- Setting - Language
 */

// Masing-masing file JS _______________________________________________________________
// Home berfungsi untuk merender note yang disimpan
// ...sehingga entah itu disimpan pada array baru seperti newNotes tidak masalah
// ...karena cara kerja aplikasi ini adalah mengisi note baru pada array utama
// ...kemudian dirender dengan array newNotes
// NoteAdd berfungsi untuk menambahkan object note ke dalam arrayOfNotes
// ...sehingga mau tidak mau harus mengupdate isi dari arrayOfNotes
// Detail berfungsi untuk meng-update dan men-delete

// Category ___________________________________________________________________________
// Terdapat object property untuk category,
// ... value object property tersebut mula-mula adalah All
// ... All ini untuk menyimpan note yang tidak ditetapkan categorynya oleh user
// ... saat user sudah menetapkan category baru maka ditambahkan
// Pada Home, NoteAdd dan Edit terdapat menu drop down untuk memilih atau membuat category baru
// ... menu drop down ini nanti akan menggunakan useEffect yang menampilkan semua property category

/* 
Category:
- Mengatur property category pada Home, NoteAdd dan EditNote

- Untuk menambahkan category baru pada menu dropdown add category 
... maka secara tidak langsung kita harus membuat array yang isinya hanya category
... kemudian array category tersebut akan menentukan property category pada object notes
... misal jika array category yang dipilih adalah "Home" 
... maka nanti property category pada object notes harusnya juga "Home"
... dengan kata lain kita harus mensingkronkan antara array category dengan property category
... mungkin seperti di bawah ini

const notes = {
title: title,
note: note,
category: arrayOfCategory.value,
 }; 

- Mengenai "All Note" Category
... karena category untuk All tidak boleh sampai bisa di delete
... bagaimana jika pikirkan agar All tidak masuk ke dalam Array
... jadi All hanyalah sebuah Value atau String yang hanya bisa dipilih untuk menyortir
... mungkin jika user tidak menetapkan category maka otomatis menjadi All, sebut saja default value = All
... namun juga buatlah agar All masih bisa dipilih
... karena pada dasarnya adalah category= arrayOfCategory.value

- Agar "All" tidak terhapus, mungkin bisa ikuti cara chatGPT yaitu:
... saat categories sudah kita simpan pada Asyncstorage
... lalu kita ambil, dan setelah kita ambil tapi sebelum ditampilkan 
... kita buat array baru "khusus" untuk ambil dan simpan Asyncstorage tanpa "All" (Async)
... dan kita buat array baru lagi "khusus" dengan tambahan item "All" (Display)
... jadi kita punya array sendiri untuk urusan ambil dan simpan categories dari Asyncstorage (Async)
... dan kita punya array sendiri untuk urusan tampilan categories pada dropdown picker (Display)

... dan saat kita ingin menambah atau menghapus salah satu item pada categories 
... kita gunakan array urusan ambil dan simpan categories dari Asyncstorage (Async)
... lalu untuk urusan display kita hapus semua item pada array urusan display (Display)
... lalu tambahkan semua item dari array urusan Async yang terbaru dan tambahkan sekaligus item "All"
... lalu gunakan code agar picker bisa terender ulang
... secara kasarnya

const arrayAsync = ["abc"]
const arrayDisplay = [...arrayAsync]
arrayDisplay.unshift("All");
arrayDisplay.sort();

- Pada Home, menampilkan property category dari setiap object
... dengan membuat array baru untuk menyimpan category saja 
... kemudian mensinkronkan masing-masing property category pada object notes
... agar yang ditampilkan object note dengan property category sesuai dengan array category 
*/

// Sync, Restore and Backup ___________________________________________________________________________
// Mengatur backup maupun restore penyimpanan notes dari google drive user

const notes = [
  { category: "All", title: "abc", note: "abc", id: "8db8c3b111ed" },
  { category: "abc", title: "ABC", note: "ABC tes", id: "ae6cd528a1aa" },
  { category: "tes", title: "tes", note: "tes", id: "fe0f04c25383" },
];
