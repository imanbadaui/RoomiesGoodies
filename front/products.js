const logo = document.getElementById("logo");
const profilePhoto = document.getElementById("profilePhoto");
const logoutButton = document.getElementById("logoutButton");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
let tbody = document.querySelector('tbody');
const AddButton = document.getElementById("AddButton");
const crudMesssage = document.getElementById("crudMesssage");
const saveChangesButton = document.getElementById("saveChangesButton");
const updateButton = document.getElementById("updateButton");
const deleteButton = document.getElementById("deleteButton");
const updatedCodeInput = document.getElementById("updatedCodeInput");
const findButton = document.getElementById("findButton");
const mainContainer = document.getElementById("mainContainer");
let searchMessage = document.getElementById("searchMessage");
//don't reload unless login or admin button is pressed.
//mainContainer is hidden unless user logs in.
window.onload = function () {
    const loggedIn = localStorage.getItem("isUserLoggedIn");

    if (loggedIn != "true") {
        window.location.href = "homepage.html";
    } else {
        mainContainer.style.display = "block";
    }
};

let xhrRead = new XMLHttpRequest();
//sends a request to read all products in DB 
function send_read_request() {
    xhrRead.open("POST", "http://127.0.0.1:5000/readProducts", true);
    xhrRead.setRequestHeader("Content-Type", "application/json");
    xhrRead.send();
}

function populateAllProducts() {
    send_read_request();
    //check if data sent or not.
    xhrRead.onload = function () {
        if (xhrRead.status === 200) {
            let response = JSON.parse(xhrRead.response);
            //result array structure:: access: 1, code: "54", name: "tomato" , owner: "Immz", price: 23.5, quantity: 5, type: "fruit", unit: "pieces"
            products = response;
            if (tbody.innerHTML != "") {
                deleteAll();
            }
            populate(products);
        }
    }
}

populateAllProducts();


let searchTypeRadios = document.querySelectorAll('input[name="searchType"]');
let searchType = "";
//loop over radio buttons to get the checked value.
searchTypeRadios.forEach(radio => {
    radio.addEventListener("change", function () {
        //when changed, get me the changed value. It returns string "product" or "owner"
        searchType = document.querySelector('input[name="searchType"]:checked').value;
    });
});

let xhrQueryAuth = new XMLHttpRequest();
//sends a search request to backend to find a product.
function send_search_query() {
    const searchValue = searchInput.value;
    //to get first default value.
    searchType = document.querySelector('input[name="searchType"]:checked').value;
    xhrQueryAuth.open("POST", "http://127.0.0.1:5000/query", true);
    xhrQueryAuth.setRequestHeader("Content-Type", "application/json");

    // Send the user authentication data as JSON
    xhrQueryAuth.send(JSON.stringify({ check_type: searchType, query_value: searchValue }));
}

//function to populate table with new records.
function populate(products) {
    // code, owner, name, type, price, quantity, unit, access
    accessToString = "";

    products.forEach(product => {
        //converts access fr;om an indicator number to a meaningful string.
        if (product.access == 1) {
            accessToString = "personal"
        } else if (product.access == 2) {
            accessToString = "shared"
        }

        let row = `<tr>
                    <td>${product.code}</td>
                    <td>${product.name}</td>
                    <td>${product.owner}</td>
                    <td>${product.price}</td>
                    <td>${product.type}</td>
                    <td>${product.quantity}</td>
                    <td>${accessToString}</td>
                    <td>${product.unit}</td>
                   </tr>`;
        tbody.innerHTML += row;
    });
}

//function to delete all records
function deleteAll() {
    tbody.innerHTML = "";
}


resultProducts = []

searchButton.addEventListener("click", function () {
    if (searchInput.value.trim() == "") {
        searchMessage.style.display = "inline-block";
        searchMessage.innerHTML = "<p> Please enter a search term. </p>";
    } else {

        send_search_query();
        console.log(searchType + " " + searchInput.value);
        //check if data sent or not.
        xhrQueryAuth.onload = function () {
            if (xhrQueryAuth.status === 200) {
                let response = JSON.parse(xhrQueryAuth.response);
                //response is array of Object of this structure {access: 1, code: "54", name: "tomato" , owner: "Immz", price: 23.5, quantity: 5, type: "fruit", unit: "pieces"}
                products = response;
                console.log(products.length);
                if (products.length != 0) {
                    if (searchInput.value != "") {
                        deleteAll();
                        populate(products);
                    }
                } else {
                    //Current approach: when no result from search exists in DB, delete all and leave it empty.
                    //Alternative approach: when no result from search exists in DB, delete all and repopulate the table with all products in DB
                    deleteAll();
                    //populateAllProducts();
                    searchMessage.style.display = "inline-block";
                    searchMessage.innerHTML = "<p> Please enter a valid search term. </p>";
                }
            }
        }
        searchMessage.style.display = "none";
    }
});



let xhrWrite = new XMLHttpRequest();
//sends request to backend to write a new product or updating an existing product.
function send_write_request(code, name, owner, price, type, quantity, access, unit) {
    xhrWrite.open("POST", "http://127.0.0.1:5000/writeProduct", true);
    xhrWrite.setRequestHeader("Content-Type", "application/json");
    //sends new product as a string.
    xhrWrite.send(JSON.stringify({ "code": code, "name": name, "owner": owner, "price": price, "type": type, "quantity": quantity, "access": access, "unit": unit }));
}

//function to add a record to existing table.
//generates a random code for the new product that is unique.
//check username in local storage = owner, if not you can't add product that's not yours.
function addRecord() {
    //that makes max number of products in db is 1000. generates codes of 3 numbers only.
    let randomCode = Math.floor(Math.random() * 1000) + 1;
    let username = localStorage.getItem("username");
    let row = `<tr>
                      <td id="productCode">${randomCode} </td>
                      <td id="productName" contenteditable="true" style="background-color: #ffdd6a;" > </td>
                      <td id="productOwner"> ${username} </td>
                      <td id="productPrice" contenteditable="true" style="background-color: #ffdd6a;" > </td>
                      <td id="productType" contenteditable="true" style="background-color: #ffdd6a;" > </td>
                      <td id="productQuantity" contenteditable="true" style="background-color: #ffdd6a;" > </td>
                      <td id="productAccess" contenteditable="true" style="background-color: #ffdd6a;" > </td>
                      <td id="productUnit" contenteditable="true" style="background-color: #ffdd6a;" > </td>
                   </tr>`;

    tbody.insertAdjacentHTML('afterbegin', row);

    let newRow;
    let cells;

    saveChangesButton.style.display = "block";
    saveChangesButton.addEventListener("click", function () {
        newRow = tbody.firstElementChild;

        //selects columns. assumes user will add all right values in right places 
        cells = newRow.getElementsByTagName('td');

        let dataNotComplete = false;
        let wrongType = false;
        let wrongAccess = false;
        let wrongUnit = false;
        let currentCell = "";
        let newProduct = [];

        //loops over cells of record and pushes them to an array
        for (let i = 0; i < cells.length; i++) {
            currentCell = cells[i].innerText.trim();
            if (currentCell == "") {
                dataNotComplete = true;
                break;
            } else {
                if (cells[i].getAttribute("id") == "productType") {
                    if (currentCell !== "vege" && currentCell != "fruit" && currentCell != "clean"
                        && currentCell != "bakery" && currentCell != "dairy") {
                        wrongType = true;
                        break;
                    }
                } else if (cells[i].getAttribute("id") == "productAccess") {
                    if (currentCell != "shared" && currentCell != "personal") {
                        wrongAccess = true;
                        break;
                    }
                } else if (cells[i].getAttribute("id") == "productUnit") {
                    if (currentCell != "piece" && currentCell != "pack" &&
                        currentCell != "kilo" && currentCell != "gram") {
                        wrongUnit = true;
                        break;
                    }
                }
                newProduct.push(currentCell);
            }
        }


        if (dataNotComplete) {
            crudMesssage.innerHTML = "<p> Please fill all fields. </p>";
        }
        else if (wrongAccess) {
            crudMesssage.innerHTML = "<p> Please fill product access with \"shared\" or \"personal\". </p>";
        } else if (wrongType) {
            crudMesssage.innerHTML = "<p> Please fill product type with \"vege\" or \"fruit\" or \"clean\" or \"bakery\" or \"dairy\". </p>";
        } else if (wrongUnit) {
            crudMesssage.innerHTML = "<p> Please fill product type with \"piece\" or \"pack\" or \"kilo\" or \"gram\". </p>";
        }
        else {
            send_write_request(newProduct[0], newProduct[1], newProduct[2], newProduct[3], newProduct[4], newProduct[5], newProduct[6], newProduct[7]);

            newRow.remove();

            row = `<tr>
                          <td >${randomCode} </td>
                          <td >${newProduct[1]} </td>
                          <td >${newProduct[2]} </td>
                          <td>${newProduct[3]} </td>
                          <td >${newProduct[4]} </td>
                          <td >${newProduct[5]} </td>
                          <td >${newProduct[6]} </td>
                          <td >${newProduct[7]} </td>
                       </tr>`;

            tbody.insertAdjacentHTML('afterbegin', row);
            saveChangesButton.style.display = "none";
            crudMesssage.style.display = "none";
            AddButton.style.backgroundColor = '#f4c524';
        }

    });
}

AddButton.addEventListener("click", function () {
    AddButton.style.backgroundColor = 'lightblue';
    addRecord();
});


//function to update a record in existing table.
function updateRecord() {
    let selected_row;
    let updatedRecordCode = "";
    updateButton.addEventListener("click", function () {
        updateButton.style.backgroundColor = 'lightblue';

        updatedCodeInput.style.display = "block";
        saveChangesButton.style.display = "block";
        findButton.style.display = "block";

        findButton.addEventListener("click", function () {

            updatedRecordCode = updatedCodeInput.value;

            let rows = document.querySelectorAll('tbody tr');
            let username = localStorage.getItem("username");

            rows.forEach(function (row) {
                let row_code = row.cells[0].textContent.trim();
                if (row_code == updatedRecordCode && row.cells[2].textContent.trim() == username) {
                    crudMesssage.style.display = "none";
                    //to get  wider scope to be used outside this event listener.
                    selected_row = row;
                    let tbody = selected_row.parentNode;
                    tbody.insertBefore(selected_row, tbody.firstChild);
                    for (let i = 1; i < selected_row.cells.length; i++) {
                        if (i != 2) {
                            selected_row.cells[i].setAttribute('contenteditable', 'true');
                            selected_row.cells[i].style.backgroundColor = 'lightblue';
                        }
                    }
                } else {
                    crudMesssage.innerHTML = "<p> You can't update a product that's not yours. </p>"
                }
            });
        });

        let dataNotComplete = false;
        let newProduct = [];

        saveChangesButton.addEventListener("click", function () {
            //loops over cells of record and pushes them to an array
            for (let i = 0; i < selected_row.cells.length; i++) {
                if (selected_row.cells[i].innerText.trim() == "") {
                    dataNotComplete = true;
                    break;
                } else {
                    newProduct.push(selected_row.cells[i].innerText.trim());
                }
            }
            if (dataNotComplete) {
                crudMesssage.innerHTML = "<p> Please fill all fields. </p>";
            } else {
                selected_row.remove();
                selected_row = `<tr>
                              <td >${newProduct[0]} </td>
                              <td >${newProduct[1]} </td>
                              <td >${newProduct[2]} </td>
                              <td >${newProduct[3]} </td>
                              <td >${newProduct[4]} </td>
                              <td >${newProduct[5]} </td>
                              <td >${newProduct[6]} </td>
                              <td >${newProduct[7]} </td>
                           </tr>`;

                tbody.insertAdjacentHTML('afterbegin', selected_row);
                send_write_request(newProduct[0], newProduct[1], newProduct[2], newProduct[3], newProduct[4], newProduct[5], newProduct[6], newProduct[7]);
                saveChangesButton.style.display = "none";
                crudMesssage.style.display = "none";
                updatedCodeInput.style.display = "none";
                findButton.style.display = "none";
                updateButton.style.backgroundColor = '#f4c524';
            }
            //get it back to default color after finishing
            for (let i = 1; i < selected_row.cells.length; i++) {
                selected_row.cells[i].style.backgroundColor = '';
            }
        });
    });
}

updateRecord();



let xhrDelete = new XMLHttpRequest();
//send product code to backend to be deleted
function send_delete_request(deletedRecordCode) {
    xhrDelete.open("POST", "http://127.0.0.1:5000//deleteProduct", true);
    xhrDelete.setRequestHeader("Content-Type", "application/json");
    //sends new product as a string.
    xhrDelete.send(JSON.stringify({ "deleted_record_code": deletedRecordCode }));
}



//function to delete a record from an existing table.
function deleteRecord() {
    let selected_row;
    let updatedRecordCode = "";
    let deletedRecordCode = "";
    deleteButton.addEventListener("click", function () {
        deleteButton.style.backgroundColor = 'lightblue';
        updatedCodeInput.style.display = "block";
        saveChangesButton.style.display = "block";
        findButton.style.display = "block";

        findButton.addEventListener("click", function () {
            updatedRecordCode = updatedCodeInput.value;

            let rows = document.querySelectorAll('tbody tr');
            let username = localStorage.getItem("username");

            //searching for deleted row
            rows.forEach(function (row) {
                let row_code = row.cells[0].textContent.trim();
                if (row_code == updatedRecordCode && row.cells[2].textContent.trim() == username) {
                    crudMesssage.style.display = "none";
                    //to get  wider scope to be used outside this event listener.
                    selected_row = row;
                    deletedRecordCode = row_code;
                    let tbody = selected_row.parentNode;
                    tbody.insertBefore(selected_row, tbody.firstChild);
                    for (let i = 1; i < selected_row.cells.length; i++) {
                        selected_row.cells[i].style.backgroundColor = '#ffcccb';
                    }
                }else{
                    crudMesssage.innerHTML = "<p>You can't delete a product that's not yours. </p>";
                }
            });
        });

        saveChangesButton.addEventListener("click", function () {
            //delete it from frontend
            selected_row.remove();
            //delete it from backend
            send_delete_request(deletedRecordCode);
            saveChangesButton.style.display = "none";
            crudMesssage.style.display = "none";
            updatedCodeInput.style.display = "none";
            findButton.style.display = "none";
            deleteButton.style.backgroundColor = '#f4c524';
        });
    });
}

deleteRecord();

logo.addEventListener("click", function () {
    window.location.href = "products.html";
});

profilePhoto.addEventListener("click", function () {
    window.location.href = "profile.html";
});

logoutButton.addEventListener("click", function () {
    localStorage.removeItem("username");
    localStorage.removeItem("isUserLoggedIn");
    window.location.href = "homepage.html";
});