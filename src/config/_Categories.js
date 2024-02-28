/* Category
******************************************************************************************
KONSEP:
- Terdapat object property untuk category,
... value object property tersebut mula-mula adalah All
... All ini untuk menyimpan note yang tidak ditetapkan categorynya oleh user
... saat user sudah menetapkan category baru maka ditambahkan
- Pada Home, NoteAdd dan Edit terdapat menu drop down untuk memilih atau membuat category baru
... menu drop down ini nanti akan menggunakan useEffect yang menampilkan semua property category

- Untuk menambahkan category baru pada menu dropdown add category,
... secara tidak langsung kita harus membuat array yang isinya hanya category
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
... category "All" tidak boleh sampai bisa di delete
... category "All" hanyalah Value atau String yang fungsinya hanya untuk dipilih dan untuk menyortir
... jika user tidak menetapkan category maka otomatis menjadi All, sebut saja default value = All
... namun buatlah agar All masih bisa dipilih lagi, karena pada dasarnya "category = arrayOfCategory.value"

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

- Cara kerja untuk menu Delete dan Rename:
... if (CategoryDisplay == All) {maka tombol delete dan rename tidak muncul}
... atau if (categoryDisplay != All {maka tombol delete dan rename muncul})

- Cara kerja Delete
categoriesAsync.filter((category) => category !== selectedCategory): 
... Ini menggunakan metode filter pada array categoriesAsync. 
... Metode ini membuat array baru yang hanya berisi elemen-elemen yang memenuhi kondisi tertentu.
(category) => category !== selectedCategory: 
... Ini adalah fungsi callback yang diberikan kepada filter. 
... Dalam setiap iterasi, fungsi ini memeriksa apakah nilai category (elemen saat ini dari array) tidak sama dengan selectedCategory. 
... Jika tidak sama, elemen tersebut akan tetap ada dalam array baru (updatedCategoriesAsync), dan jika sama, elemen tersebut akan dihapus dari array baru.

- Cara kerja Rename
if (renameCategory): 
... Ini adalah kondisi yang memeriksa apakah renameCategory memiliki nilai yang dianggap truthy (tidak kosong, bukan null, bukan undefined, dan sebagainya). 
... Kondisi ini digunakan untuk memastikan bahwa kita hanya melanjutkan proses rename jika renameCategory tidak kosong atau tidak valid.
const updatedCategoriesAsync = categoriesAsync.map((category) => ...: 
... Ini adalah langkah utama dalam proses rename. Kode ini menggunakan metode map untuk membuat array baru yang disebut updatedCategoriesAsync. 
... Dalam setiap iterasi, kita memeriksa setiap elemen (category) dari array categoriesAsync.
category === selectedCategory ? renameCategory : category: 
... Dalam setiap iterasi, kita memeriksa apakah category saat ini adalah kategori yang dipilih (selectedCategory). 
... Jika ya, kita menggantinya dengan nilai dari renameCategory, yang merupakan nama baru yang diinputkan oleh pengguna. 
... Jika tidak, kita mempertahankan nilai category tersebut tanpa perubahan.
Dengan kata lain, langkah ini memproses seluruh array categoriesAsync dan mengganti nilai kategori yang sesuai dengan selectedCategory dengan nilai renameCategory. 
... Ini menciptakan array baru (updatedCategoriesAsync) yang mencerminkan perubahan nama kategori.


******************************************************************************************
MASALAH:
Pada HOME:
- Saat melakukan Add, Rename, Delete berulangkali kadang terjadi bug
- Delete -- FIXED
... saat ingin menghapus dua category
... category yang pertama dihapus akan muncul lagi setelah category kedua dihapus
... dan saat category pertama yang muncul lagi dihapus lagi lalu category kedua yang dihapus muncul lagi pula
... sehingga terjadi semacam loop
... **solusi:
... masukkan kode-kode mulai dari "const jsonValue = ..." hingga "setShowDeleteRename(false);"
... ke dalam try, 
... dan setelah await tambahkan kode ini "setCategoriesAsync(updatedCategoriesAsync);"
... ini bertujuan agar yang terupdate bukan hanya pada picker saja, melainkan asyncstorage juga
- Rename -- FIXED
... masalahnya hampir mirip dengan Delete
... saat ingin merename dua category
... category yang pertama di rename akan kembali seperti semula setelah category lain di rename
... dan saat category lain yang di rename itu akan kembali seperti semula setelah categary lain dari lainnya di rename
... sehingga terjadi semacam gali lubang tutup lubang
... **solusi (sama seperti delete):
... masukkan kode-kode mulai dari "const jsonValue = ..." hingga "setShowDeleteRename(false);"
... ke dalam try, 
... dan setelah await tambahkan kode ini "setCategoriesAsync(updatedCategoriesAsync);"
... ini bertujuan agar yang terupdate bukan hanya pada picker saja, melainkan asyncstorage juga
- Rename -- FIXED
... Modal selalu menampilkan hasil dari rename category sebelumnya
... misal kita ingin merename category yang pertama dengan nama "A1"
... maka saat kita ingin me-rename category lain, placeholder pada modal rename adalah "A1"
... **solusi sementara mungkin bisa buat kondise placeholder reset saat modal tidak ada (!isModal)
... Dengan menambahkan setRenameCategory("") pada handleRenameCancel, 
... nilai renameCategory akan diatur kembali ke string kosong setiap kali modal ditutup.

Pada NoteAdd:
note yang tidak ada isinya baik title maupun notenya bisa di save,
... dan hasil save ini tidak bisa di delete maupun di update
... maka dari itu buat agar jika tidak ada title maupun note maka tidak bisa di save

Pada DETAIL:
- Delete:
... saat category dari note yang dipilih (yang akan diedit) di delete, misal category "123"
... namun setelah picker melakukan reset ke category "All"
... tapi alih-alih user menyimpannya malah menekan tombol kembali ke Home
... maka category dari note tersebut masih category yang lama, yaitu yang dihapus
... dan saat ingin menggantinya kita tidak bisa langsung memilih note tesrsebut lagi
... kemudian menekan save saat category di picker menunjukkan "All" 
... karena category note tersebut sudah terhapus, 
... melainkan kita harus memilih manual di picker (selain "All")
... agar category dari note tersebut bisa diganti dengan category lain
... namun sebenarnya masalah ini tidak terlalu serius karena pada menu Home
... category yang tidak ada sekalipun akan tetap nampak untuk sortiran category "All"
- Rename:
... untuk rename yaitu serupa dengan "Delete"
... namun sebenarnya masalah ini tidak terlalu serius karena pada menu Home
... category yang tidak ada sekalipun akan tetap nampak untuk sortiran category "All"
- Delete: -- FIXED
... delete memiliki masalah lagi, saat aku menambahkan date
... delete bermasalah ketika digunakan kondisi "item.date === route.params.item.date &&"
... masalah selesai saat aku menghapus "item.date === route.params.item.date &&"" dari findIndex
... **masalah selesai 
... dengan menambahkan date pada retrievedNotes.forEach di dalam const fetchNotes = async () => pada HOME
- Update: -- FIXED
... update memiliki masalah lagi, saat aku menambahkan date
... update bermasalah ketika digunakan kondisi "item.date === route.params.item.date &&""
... masalah selesai saat aku menghapus "item.date === route.params.item.date &&"" dari findIndex
... **masalah selesai 
... dengan menambahkan date pada retrievedNotes.forEach di dalam const fetchNotes = async () => pada HOME
- Date: -- FIXED
... date nampak undefined saat di fetch padahal saat di console.log Home date nampak
... **masalah selesai 
... dengan menambahkan date pada retrievedNotes.forEach di dalam const fetchNotes = async () => pada HOME
*/
