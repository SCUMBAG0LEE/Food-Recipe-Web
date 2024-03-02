// Mengambil elemen HTML
let search_box = document.getElementById("search_box");
let main = document.getElementById("main");
let container = document.getElementById("container");
let favourite_btn = document.getElementById("favourite_btn");
let fav_exit = document.getElementById("exit");
let fav_body = document.getElementById("fav_body");
let heart = []; // Menyimpan referensi data dari ikon favorit
let view = 0; // Total tampilan resep
let btn_array = []; // Menyimpan array id dari resep yang diklik

// memeriksa apakah tidak ada nilai yang disimpan di local storage dengan kunci "meals_id_array".
if (localStorage.getItem("meals_id_array") === null) {
    let meals_id = [];
    // Baris ini menyimpan array meals_id di local storage dengan kunci "meals_id_array" setelah dikonversi ke dalam bentuk string JSON.
    localStorage.setItem("meals_id_array", JSON.stringify(meals_id));
}

// Membuat Array
let object_array = []; // Untuk menyimpan data dari API

function show_alert(text) {
    alert(text);
}


// event listener kotak pencarian
search_box.addEventListener("keyup", find_Recipes);

// Mengambil data dari API tergantung dari pencarian
function find_Recipes() {
    let search_value = search_box.value;

    // Permintaan ke API untuk mencari resep
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + search_value)
        .then(function(response) {
            return response.json(); // Mengembalikan dalam bentuk JSON
        })
        .then(function(data) {
            // Data disimpan dalam array
            object_array = data;
            render_cards(object_array);
        })
        .catch(function() {
            main.innerHTML = `<div id="error1">
                <p>Tidak ada resep yang cocok dengan pencarian Anda</p>
            </div>`;
        })
}

// Fungsi untuk mengiterasi object_array untuk dimasukkan dalam kartu resep
function render_cards(object_array) {
    // membersihkan kartu-kartu pada setiap karakter pencarian berikutnya
    main.innerHTML = "";
    let length = object_array.meals.length;

    // Untuk setiap elemen, memanggil fungsi append_cards() untuk membuat dan menyisipkan kartu resep ke elemen utama.
    for (let i = 0; i < length; i++) {
        append_cards(object_array.meals[i]);
    }
}

let card_btn_array = []; // Array untuk menyimpan referensi kartu resep
let index = 0;

// Fungsi append_cards() membuat dan menyisipkan kartu resep ke elemen utama berdasarkan objek yang diberikan
function append_cards(object) {

    let mealCard = document.createElement("div"); // berfungsi sebagai kartu resep
    mealCard.classList.add("food_card"); // menambahkan kelas CSS
    mealCard.innerHTML = `
        <div class="card_img_div">
            <img class="card_img" src="${object.strMealThumb}"/>
        </div>
        <p class="card_text_para">${object.strMeal}</p>
        <div class="card_lower_div">
            <button id="${object.idMeal}" class="btn">View</button>
            <span id="${object.idMeal}1" class="material-symbols-sharp"> favorite </span> 
        </div>`;
    // menambahkan 1 dalam id = ${object.idMeal}1 untuk membuat semua id unik untuk ikon hati

    // Elemen mealCard disisipkan ke elemen utama.
    main.append(mealCard);

    // Untuk memeriksa apakah resep sudah ada di dalam penyimpanan lokal favorit
    let mls_id = JSON.parse(localStorage.getItem("meals_id_array"));
    for (let i = 0; i < mls_id.length; i++) {
        // Memeriksa apakah mls_id cocok dengan idMeal
        // Memeriksa apakah sudah ada di dalam daftar favorit
        if (mls_id[i].idMeal === object.idMeal) {
            let heart_id = `${object.idMeal}1`; // mengambil elemen dengan ikon hati yang sesuai
            let element = document.getElementById(heart_id);
            element.style.color = "red";
        }
    } // Daftar favorit diperbarui, dan ikon hati diatur menjadi merah.

    // tombol tampilan kartu
    card_btn_array[index] = document.getElementById(`${object.idMeal}`);
    // menambahkan event listener ketika tombol "Lihat Resep" pada kartu diklik.
    card_btn_array[index].addEventListener("click", Recipe_container);

    // Ini menyimpan referensi ke elemen ikon hati yang terkait dengan resep.
    heart[index] = document.getElementById(`${object.idMeal}1`);
    // Fungsi ini menangani menambahkan resep ke daftar favorit.
    heart[index].addEventListener("click", add_to_fav);
    index++; // variabel diinkremen untuk memastikan bahwa elemen kartu dan hati berikutnya disimpan dalam array yang sesuai.
}


// Tambahkan kartu resep ke bagian fav saat ikon hati diklik
function add_to_fav(event) {
    // mencari di local storage apakah kartu ada di bagian fav atau tidak
    let mls_id = JSON.parse(localStorage.getItem("meals_id_array"));
    for (let i = 0; i < mls_id.length; i++) {
        // Mengecek apakah meals_id_array menyertakan id yang diberikan 
        // jika hadir, tampilkan peringatan
        if ((event.target.id).slice(0, -1) === mls_id[i].idMeal) {
            show_alert("Your Meal Recipe already exists in your favourites list");
            return;
            // tidak ingin menjalankan kode di bawah jika telah kembali
        }
    }
    // mencari kartu yang harus ditambahkan di bagian fav
    mls_id = mls_id.concat(object_array.meals.filter(function (object) {
        return object.idMeal === (event.target.id).slice(0, -1);
    }));
    // mengonversinya kembali menjadi string JSON menggunakan JSON.stringify(), dan menyimpannya di local storage
    localStorage.setItem("meals_id_array", JSON.stringify(mls_id));
    localStorage_fetch();
    show_alert("Your Meal Recipe has been added to your favourites list");

    // Tambahkan warna merah ke hati
    (event.target).style.color = "red";
}

// fungsi yang dipanggil ketika tombol "View Recipe" diklik
function Recipe_container(event) {
    if (btn_array.includes(event.target.id) === true) {
        show_alert("Your Meal Recipe is already open");
    }
    else {
        btn_array.push(event.target.id);
        view++;
        // kemudian menyembunyikan elemen utama, menyiapkan struktur HTML untuk detail resep
        // dan menambahkannya ke elemen kontainer.
        main.style.visibility = "hidden"; 
        // filter_array memiliki 1 objek yang idMeal-nya cocok dengan id tombol target
        let filter_array = object_array.meals.filter(function (object) {
            return object.idMeal === event.target.id;
        });

        let Recipe_div = document.createElement("div");
        Recipe_div.classList.add("Recipe_card");
        Recipe_div.innerHTML = `    
        <div id="left">
            <div id="left_upper">
                <img id="left_upper_img"src="${filter_array[0].strMealThumb}" alt="error">
                <p id="left_upper_p1">${filter_array[0].strMeal}</p>  
                <p id="left_upper_p2">Cuisine : ${filter_array[0].strArea}</p>
            </div>
            <div id="left_lower">
                <a href="${filter_array[0].strYoutube}" target="_blank"><button id="left_lower_btn">Watch Video</button></a>
            </div>
        </div>

        <div id="right">
            <span id="${(event.target.id)}5" class="cross material-symbols-outlined">cancel</span>
            <h3 id="right_inst">INSTRUCTION</h3>
            <p id="right_p">${filter_array[0].strInstructions}</p>
        </div>`;

        container.append(Recipe_div);
        //menambahkan event listener klik ke ikon silang
        let cross = document.getElementsByClassName("cross");
        cross[0].addEventListener("click", exit_page);
    }
}
// fungsi ini dipanggil ketika ikon silang di detail resep diklik
function exit_page(event) {
    //hapus div saat ikon silang diklik
    const index = btn_array.indexOf(event.target.id.slice(0, -1));
    //menghapus elemen pada indeks dari btn_array
    btn_array.splice(index, 1);
    view--;
    let recipes_container_div = document.getElementsByClassName("Recipe_card");
    recipes_container_div[recipes_container_div.length - 1].remove();

    if (view === 0) {
        main.style.visibility = "visible";
    }
}

// fungsi dipicu ketika tombol favourite_btn diklik
favourite_btn.addEventListener("click", fav_page);

//fungsi ini dipicu ketika tombol favourite_btn diklik
function fav_page() {
    container.style.filter = "brightness(50%)";
    let favourite_container = document.getElementById("favourite_container");
    favourite_container.style.right = "0vw";
    fav_exit.addEventListener("click", exit);

    function exit() {
        favourite_container.style.right = "-360px";
        container.style.filter = "brightness(100%)";
    }
    localStorage_fetch();
}


// Fungsi ini mengambil resep favorit dari penyimpanan lokal dan merendernya di halaman resep favorit.
function localStorage_fetch() {
    let localStorage_length = JSON.parse(localStorage.getItem("meals_id_array")).length;
    let meals_id_array = JSON.parse(localStorage.getItem("meals_id_array"));
    if (localStorage_length === 0) {
        fav_body.innerHTML = "<h2>No recipes added in your favourites list.</h2>";
    }
    else {
        fav_body.innerHTML = "";
        for (let i = 0; i < localStorage_length; i++) {
            // set card di div favorit
            let mealCard = document.createElement("div");
            mealCard.classList.add("food_card");
            mealCard.innerHTML = `
            <div class="card_img_div">
                <img class="card_img" src = "${meals_id_array[i].strMealThumb}"/>
            </div>

            <p class="card_text_para">${meals_id_array[i].strMeal}</p>
            <div class="card_lower_div_fav">
                <button id="${meals_id_array[i].idMeal}2" class="btn1">View</button>
                <button id="${meals_id_array[i].idMeal}3" class="btn1">Remove</button>
            </div>`;

            // tambahkan 1 di id = ${object.idMeal} karena ingin membuat semua id menjadi unik untuk ikon hati
            fav_body.append(mealCard);

            // untuk tombol lihat kartu
            card_btn_array[index] = document.getElementById(`${meals_id_array[i].idMeal}2`);
            // tambahkan event listener untuk setiap tombol kartu
            card_btn_array[index].addEventListener("click", Recipe_container1);

            // untuk tombol hapus kartu
            heart[index] = document.getElementById(`${meals_id_array[i].idMeal}3`);
            // tambahkan event listener untuk setiap tombol hapus
            heart[index].addEventListener("click", remove_from_fav);
            index++;
        }
    }
}

// fungsi untuk menampilkan resep tetapi spesifik untuk halaman resep favorit.
function Recipe_container1(event) {

    // Periksa apakah ID tombol sudah ada di dalam btn_array
    if (btn_array.includes((event.target.id).slice(0, -1)) === true) {
        show_alert("Your Meal Recipe is already open");
    }
    else {
        // ID ditambahkan ke btn_array, dan detail resep dipersiapkan dan ditambahkan ke elemen container
        btn_array.push((event.target.id).slice(0, -1));
        view++;
        // main.innerHTML = ""; // opsi 1
        main.style.visibility = "hidden"; // opsi alternatif 2
        // filter_array memiliki 1 objek yang idMeal-nya cocok dengan id target tombol
        let filter_array = JSON.parse(localStorage.getItem("meals_id_array")).filter(function (object) {
            return object.idMeal === (event.target.id).slice(0, -1);
        });

        let Recipe_div = document.createElement("div");
        Recipe_div.classList.add("Recipe_card");
        Recipe_div.innerHTML = `    
        <div id="left">
            <div id="left_upper">
                <img id="left_upper_img"src="${filter_array[0].strMealThumb}" alt="error">
                <p id="left_upper_p1">${filter_array[0].strMeal}</p>
                <p id="left_upper_p2">Masakan : ${filter_array[0].strArea}</p>
            </div>
            <div id="left_lower">
                <a href="${filter_array[0].strYoutube}" target="_blank"><button id="left_lower_btn">Watch Video</button></a>
            </div>
        </div>

        <div id="right">
            <span id="${(event.target.id).slice(0, -1)}4" class="cross material-symbols-outlined">cancel</span>
            <h3 id="right_inst">INSTRUKSI</h3>
            <p id="right_p">${filter_array[0].strInstructions}</p>
        </div>`;

        // Fungsi ini juga melampirkan event listener klik ke ikon silang (dengan kelas "cross") di detail resep
        container.append(Recipe_div);
        let cross = document.getElementsByClassName("cross");
        for (let i = cross.length - 1; i >= 0; i--) {
            cross[i].addEventListener("click", exit_page);
        }
    }
}

// menghapus kartu resep dari bagian_fav.

function remove_from_fav(event) {
    // mencari di penyimpanan lokal apakah kartu ada di bagian fav atau tidak
    let mls_id = JSON.parse(localStorage.getItem("meals_id_array"));

    // mengiterasi array untuk menemukan resep yang cocok
    for (let i = 0; i < mls_id.length; i++) {
        if (mls_id[i].idMeal === event.target.id.slice(0, -1)) {
            mls_id.splice(i, 1);  // metode digunakan untuk menghapus objek tersebut dari array mls_id.
        }
    }
    localStorage.setItem("meals_id_array", JSON.stringify(mls_id));  // mengubah array menjadi string 
    localStorage_fetch();
    show_alert("Your Meal Recipe has been removed from your favourites list");

    // Menghapus warna merah dari ikon hati
    // mengambil atau menemukan elemen hati berdasarkan id mereka
    let heart_id = event.target.id.slice(0, -1) + 1; // menghasilkan ID elemen ikon hati
    let element = document.getElementById(heart_id);
    
    // kondisi ini memeriksa apakah elemen ikon hati ada dalam DOM.
    if (element !== null) {
        element.style.color = "black";
    }
}
