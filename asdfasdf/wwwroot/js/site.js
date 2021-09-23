const productsEndpoint = 'api/products';
const ordersEndpoint = 'api/orders';
const orderItemsEndpoint = 'api/orderitems';

function getItems() {
    fetch(productsEndpoint)
        .then(response => response.json())
        .then(data => { displayItems(data); console.log(data); })
        .catch(error => console.error('Unable to get items.', error));
}
getItems();


async function getItem(itemId) {
    let getProduct = productsEndpoint + '/' + itemId;
    try {
        let response = await fetch(getProduct);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Unable to get item ' + itemId);
    }
}

async function addOrder() {
    const curDate = new Date();
    const requestBody = {
        Date: curDate.getFullYear() + '-' + (curDate.getMonth() + 1).toString().padStart(2, '0') + '-' + curDate.getDate()
    }
    console.log("requestBody: " + requestBody.Date);
    console.log("JSON'd body :" + JSON.stringify(requestBody));

    try {
        let response = await fetch(ordersEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        console.log(`Order stored in system with ID ${data.orderID} on date ${data.date}\n Response: ${data}`);
        addOrderItems(data.orderID);
    } catch (error) {
        console.log('Unable to add order');
    }
}

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
    alert(`New order added! OrderID: ${body.OrderID}`);
}

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
        let data = await response.json()
        console.log(`Added order item for ${data.orderID}, product: ${data.productID} and quantity: ${data.quantity}`);
    } catch {
        console.error("Failed to add order item");
    } finally {
        console.log("remove checkout section");
        document.getElementById('checkout-table').remove();
        document.getElementById('checkout-button').remove();
    }
}

function updateProductInventoryCount(body) {
    let newQuantity = await getItem(body.productID);
}

async function fullCreateOrder(products) {
    console.log("Creating full order...");
    const orderId = await addOrder();
    products.forEach(product => {
        addOrderItem(product, orderId);
    })
}

function displayItems(data) {
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

function displayCheckoutItem() {
    const checkoutTable = document.getElementById('checkout-table');
    checkoutTable.innerHTML = "<tr><th>Product</th><th>Quantity</th><th>Total price</th></tr >";
    let selectedItems = [];
    let selectedItem = [];
    let insertOrderQuery;
    let products = [];
    let product = {};
    let productId;
    let productName;
    let itemCounts = document.getElementsByClassName('product-count');
    Array.from(itemCounts).forEach(item => {
        if (item.value > 0) {
            productId = item.id.split('-')[0];
            product = getItem(productId);
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

function renderCheckoutButton() {
    const checkoutButton = document.createElement('div');
    checkoutButton.innerHTML = `<button type="button" id="checkout-button" onclick="addOrder()">Checkout</button>`;
    document.body.appendChild(checkoutButton);
}



function insertOrderQuery(totalPrice) {
    let curDate = new Date();
    return `insert into Orders values (${curDate.getFullYear()}-${curDate.getMonth()}-${curDate.getDate()}, ${totalPrice}`
}


function addCount(productInputBox, itemQuantity) {
    let productCount = document.getElementById(productInputBox).value;
    if (productCount == itemQuantity) {
        alert("you have exceeded the max available for this product");
    }
    else {
        document.getElementById(productInputBox).value++;                       
    }                                                                           
                                                                               
}

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