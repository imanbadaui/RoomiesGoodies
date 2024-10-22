const logo = document.getElementById("logo");
const profilePhoto = document.getElementById("profilePhoto");
const logoutButton = document.getElementById("logoutButton");
const searchTypeRadios = document.querySelectorAll('input[name="searchType"]');
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
let tbody = document.querySelector('tbody');
let searchType = document.querySelector('input[name="searchType"]:checked').value;
const AddButton = document.getElementById("AddButton");
const crudMesssage = document.getElementById("crudMesssage");
const saveChangesButton = document.getElementById("saveChangesButton");


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

//loop over radio buttons to get the checked value.
searchTypeRadios.forEach(radio => {
    radio.addEventListener("change", function () {
        //when changed, get me the changed value. It returns string "product" or "owner"
        searchType = document.querySelector('input[name="searchType"]:checked').value;
    });
});

let xhrQueryAuth = new XMLHttpRequest();
function send_search_query() {

    const searchValue = searchInput.value;
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
    send_search_query();
    //check if data sent or not.
    xhrQueryAuth.onload = function () {
        if (xhrQueryAuth.status === 200) {
            let response = JSON.parse(xhrQueryAuth.response);
            //response is array of Object of this structure {access: 1, code: "54", name: "tomato" , owner: "Immz", price: 23.5, quantity: 5, type: "fruit", unit: "pieces"}
            products = response;
            if (searchInput.value != "" && tbody.innerHTML != "") {
                deleteAll();
                populate(products);
            }
        }
    }
});



let xhrWrite = new XMLHttpRequest();
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
    let row = `<tr>
                      <td >${randomCode} </td>
                      <td contenteditable="true"> </td>
                      <td contenteditable="true"> </td>
                      <td contenteditable="true"> </td>
                      <td contenteditable="true"> </td>
                      <td contenteditable="true"> </td>
                      <td contenteditable="true"> </td>
                      <td contenteditable="true"> </td>
                   </tr>`;

    tbody.insertAdjacentHTML('afterbegin', row);

    let newRow;
    let cells;
    let newProduct = [];
    saveChangesButton.style.display = "inline-block";
    saveChangesButton.addEventListener("click", function () {

        newRow = tbody.firstElementChild;

        //selects columns. assumes user will add all right values in right places 
        cells = newRow.getElementsByTagName('td');

        dataNotComplete = false;

        //loops over cells of record and pushes them to an array
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].innerText.trim() == "") {
                dataNotComplete = true;
                break;
            }else{
                newProduct.push(cells[i].innerText.trim());
            }    
        }
        if (dataNotComplete) {
            crudMesssage.innerHTML= "<p> Please fill all fields. </p>"
        } else {
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
        }

    });
}

AddButton.addEventListener("click", function () {
    addRecord();

});

//function to update a record in existing table.
function updateRecord() {

}

//function to delete a record from an existing table.
function deleteRecord() {

}


logo.addEventListener("click", function () {
    window.location.href = "products.html";
});

profilePhoto.addEventListener("click", function () {
    window.location.href = "profile.html";
});

logoutButton.addEventListener("click", function () {
    window.location.href = "homepage.html";
});