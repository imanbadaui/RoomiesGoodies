const logo = document.getElementById("logo");
const profilePhoto = document.getElementById("profilePhoto");
const logoutButton = document.getElementById("logoutButton");
const searchTypeRadios = document.querySelectorAll('input[name="searchType"]');
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
let tbody = document.querySelector('tbody');
let searchType = document.querySelector('input[name="searchType"]:checked').value;

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
            console.log(products);
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
        //converts access from an indicator number to a meaningful string.
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

//function to add a new record to the existing table.
function add(products) {
    // code, owner, name, type, price, quantity, unit, access
    //Autogenerate a random code that doesn't repeat in DB
    accessToString = "";

    products.forEach(product => {
        //converts access from an indicator number to a meaningful string.
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
//function to update a record in existing table.

//function to delete a record from an existing table.


resultProducts = []
searchButton.addEventListener("click", function () {
    send_search_query();
    //check if data sent or not.
    xhrQueryAuth.onload = function () {
        if (xhrQueryAuth.status === 200) {
            let response = JSON.parse(xhrQueryAuth.response);
            //result array structure:: access: 1, code: "54", name: "tomato" , owner: "Immz", price: 23.5, quantity: 5, type: "fruit", unit: "pieces"
            products = response;
            if (tbody.innerHTML != "") {
                deleteAll();
                populate(products);
            }

        }
    }
});


logo.addEventListener("click", function () {
    window.location.href = "products.html";
});

profilePhoto.addEventListener("click", function () {
    window.location.href = "profile.html";
});

logoutButton.addEventListener("click", function () {
    window.location.href = "homepage.html";
});