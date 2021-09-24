const productsEndpoint = 'api/products';
const ordersEndpoint = 'api/orders';
const orderItemsEndpoint = 'api/orderitems';

/* FUNCTIONS CALLING ENDPOINTS IN CONTROLLERS DIRECTORY */

/**************** ProductsController APIs ***************/
// get all products */

function getProducts() {
    fetch(productsEndpoint)
        .then(response => response.json())
        .then(data => { displayProducts(data); console.log(data); })
        .catch(error => console.error('Unable to get items.', error));
}
getProducts();

// get a product
/* */
async function getProduct(itemId) {
    const getProduct = productsEndpoint + '/' + itemId;
    try {
        let response = await fetch(getProduct);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Unable to get item ' + itemId);
    }
}

// update a product
/* */
async function updateProduct(item, quantity) {
    const updateProduct = productsEndpoint + '/' + item.productID;
    let requestBody = {
        ProductID: item.productID,
        Name: item.name,
        Quantity: quantity,
        Price: item.price,
        image: item.image
    }
    console.log("requestBody: " + JSON.stringify(requestBody));
    try {
        let response = await fetch(updateProduct, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        console.log("TEST2");
        //let data = await response.json();
        console.log("Data in updateProduct: " + data);
    } catch {
        console.error("Failed to update product quantity");
    }
}

/**************** OrdersController APIs ***************/
// add an order
/* */
async function addOrder() {
    let data;
    const curDate = new Date();
    const requestBody = {
        Date: curDate.getFullYear() + '-' + (curDate.getMonth() + 1).toString().padStart(2, '0') + '-' + curDate.getDate()
    }
    console.log("requestBody_addOrder: " + requestBody.Date);
    console.log("JSON'd body_addOrder :" + JSON.stringify(requestBody));

    try {
        let response = await fetch(ordersEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        data = await response.json();
        console.log(`Order stored in system with ID ${data.orderID} on date ${data.date}\n Response: ${data}`);

    } catch (error) {
        console.log('Unable to add order in addOrder() function');
    } finally {
        addOrderItems(data.orderID);
        alert(`New order added! OrderID: ${data.orderID}`);
    }
}


/**************** OrderItemsController APIs ***************/

// add order item to an order step 1
// creates an array of items to add to an order */
/* */
function addOrderItems(orderId) {
    let quantities = document.getElementsByClassName('product-quantity');
    let quantity;
    let productId;
    let requestBody = {};
    let requestBodies = [];

    Array.from(quantities).forEach((item) => {
        productId = item.id.split('-')[0];
        quantity = Number(item.innerText);
        requestBody = {
            OrderID: orderId,
            ProductID: productId,
            Quantity: quantity
        };
        requestBodies.push(requestBody);
    });
    requestBodies.forEach(body => {
        addOrderItemsInner(body);
    });
    //alert(`New order added! OrderID: ${body.OrderID}`);*
}

// add order item to an order step 2
// calls API to add each item from the
// array created in step 1 to the order
/* */
async function addOrderItemsInner(body) {
    try {
        console.log("attempting to add order");
        let response = await fetch(orderItemsEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        console.log("BODY: " + body.ProductID);
        let data = await response.json()
        console.log(`Added order item for ${data.orderID}, product: ${data.productID} and quantity: ${data.quantity}`);
        updateProductInventoryCount(body);
    } catch {
        console.error("Failed to add order item");
    } finally {
        console.log("remove checkout section");
        document.getElementById('checkout-table').remove();
        document.getElementById('checkout-button').remove();
    }
}

function updateProductInventoryCount(body) {
    console.log("IN updateProductInventoryCount and body is " + body.ProductID);
    let product = getProduct(body.ProductID);
    let quantityPurchased = body.Quantity;

    product
        .then((data) => {
            newQuantity = data.quantity - quantityPurchased;
            console.log("DQ: " + data.quantity);
            console.log("QP: " + quantityPurchased);
            console.log("NQ: " + newQuantity);
            updateProduct(data, newQuantity);
        });
}

/***************** RENDER HTML ELEMENTS ******************/
// displays all products in a grid layout
// each grid cell has product image, name, price and quantity
function displayProducts(data) {
    const gridContainer = document.getElementById("grid-container")
    gridContainer.innerHTML = '';

    data.forEach(item => {
        let productItem = document.createElement('div');
        productItem.className = 'grid-item';

        let imageContainer = document.createElement('img');
        imageContainer.src = "https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673-960x960.png";
        console.log(item.Image);

        let productDetails = document.createElement('div');
        productDetails.innerHTML = `<b>Name: </b>${item.name}<br><b>Quantity: </b>${item.quantity}<br><b>Price: </b>${item.price}`;

        let productToggle = document.createElement('div');
        productToggle.className = "product-toggle";
        productToggle.innerHTML = `<button type="button" id="button-${item.productID}-subtract" onclick="subtractCount('${item.productID}-count')">-</button><input id="${item.productID}-count" class="product-count" type="text" value="0"><button type="button" id="button-${item.productID}-add" onclick="addCount('${item.productID}-count', ${item.quantity})">+</button>`

        gridContainer.appendChild(productItem);
        productItem.appendChild(imageContainer);
        productItem.appendChild(productDetails);
        productItem.appendChild(productToggle);
        
    });
}

// renders table and table headers of selected products
// gets all selected products and adds them to array
function displayCheckoutItem() {
    const checkoutTable = document.getElementById('checkout-table');
    checkoutTable.innerHTML = "<tr><th>Product</th><th>Quantity</th><th>Total price</th></tr >";
    let selectedItems = [];
    let selectedItem = [];
    let products = [];
    let product = {};
    let productId;
    let productName;
    let itemCounts = document.getElementsByClassName('product-count');
    Array.from(itemCounts).forEach(item => {
        if (item.value > 0) {
            productId = item.id.split('-')[0];
            product = getProduct(productId);
            products.push(product);
        }
    });
    Promise.all(products)
        .then((values) => {
            console.log('values: ' + values);
            values.forEach((value) => {
                renderCheckoutTable(value);
            });
        })
        .then((values) => {
            
        })
    renderCheckoutButton();
}

// takes array of selected products from displayCheckoutItem
// and adds them as table rows to checkout table
function renderCheckoutTable(product) {
    const checkoutTable = document.getElementById('checkout-table');
    console.log("Creating checkout table...");

    let itemRow = document.createElement('tr');
    let productCell = document.createElement('td');
    productCell.id = `${product.productID}-name`;
    productCell.className = 'product-name';
    let quantityCell = document.createElement('td');
    quantityCell.id = `${product.productID}-quantity`;
    quantityCell.className = 'product-quantity';
    let priceCell = document.createElement('td');
    priceCell.id = `${product.productID}-price`;
    priceCell.className = 'product-price';

    productCell.innerText = product.name;
    quantityCell.innerText = document.getElementById(`${product.productID}-count`).value;
    priceCell.innerText = product.price * quantityCell.innerText;

    checkoutTable.appendChild(itemRow);
    itemRow.appendChild(productCell);
    itemRow.appendChild(quantityCell);
    itemRow.appendChild(priceCell);

}

// displays checkout button under checkout table
// this function is called within the displayCheckoutItem() function*/
function renderCheckoutButton() {
    const checkoutButton = document.createElement('div');
    checkoutButton.innerHTML = `<button type="button" id="checkout-button" onclick="addOrder()">Checkout</button>`;
    document.body.appendChild(checkoutButton);
}


/***************** TOGGLE PRODUCT QUANTITIES ******************/
// add *
function addCount(productInputBox, itemQuantity) {
    let productCount = document.getElementById(productInputBox).value;
    if (productCount == itemQuantity) {
        alert("you have exceeded the max available for this product");
    }
    else {
        document.getElementById(productInputBox).value++;                       
    }                                                                           
                                                                               
}

// subtract
/* */
function subtractCount(productInputBox) {
    let productCount = document.getElementById(productInputBox).value;
    console.log(productCount);
    if (productCount <= 0) {
        alert("This product is not in your bag");
    }
    else {
        document.getElementById(productInputBox).value--;
        console.log(productCount);
    }
    
}