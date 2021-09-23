﻿const productsEndpoint = '../api/products';
const ordersEndpoint = '../api/orders';
const orderItemsEndpoint = '../api/orderitems';
const searchItemsEndpoint = '../api/orderitems/searchorders?orderId=';

async function getProduct(itemId) {
    let getProduct = productsEndpoint + '/' + itemId;
    try {
        let response = await fetch(getProduct);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Unable to get item ' + itemId);
    }
}

async function getOrders() {
    try {
        let response = await fetch(ordersEndpoint);
        const data = await response.json();
        renderOrdersDropdown(data);
    } catch (error) {
        console.error("Unable to fetch order history");
    }
}

async function getOrder(orderId) {
    console.log("getOrderEndpoint: " + ordersEndpoint + `/${orderId}`);
    let data;
    try {
        let response = await fetch(ordersEndpoint + `/${orderId}`);
        data = await response.json();
        console.log("Some data: " + data.orderID);

    } catch {
        console.error("Could not retrieve order");
    } finally {
        displayOrderTableInfo(data);
        searchOrders(data.orderID);
    }
}

/* May not need this function */
async function getOrderItem(orderItemId) {
    let data;
    try {
        let response = await fetch(orderItemsEndpoint + `/${orderItemId}`);
        data = await response.json();
    } catch { console.error('Could not retrieve order item') }
}

async function searchOrders(orderId) {
    let data;
    try {
        console.log("Search items endpoint: " + searchItemsEndpoint + orderId);
        let response = await fetch(searchItemsEndpoint + orderId);
        data = await response.json();
        console.log(`Data: orderID = ${data[0].orderID}\n ${data[0].productID}\n ${data[0].quantity}`);
    } catch {
        console.error("Could not load the order items - does this order have items?");
        alert("No order items associated with this order!");
    } finally {
        console.log("in finally block: " + data[0].quantity);
        displayOrderItemsTable(data);
    }
}

function renderOrdersDropdown(data) {
    console.log("Adding dropdown options...");
    let dropdownOption;
    const dropdownMenu = document.getElementById('orders-search');
    data.forEach((item) => {
        dropdownOption = document.createElement('option');
        dropdownOption.id = `${item.orderID}-option`;
        dropdownOption.value = item.orderID;
        dropdownOption.innerText = 'Option ' + item.orderID;
        dropdownMenu.appendChild(dropdownOption);
    })
}

function displayOrderTableInfo(data) {
    const orderInfo = document.createElement('div');
    orderInfo.id = 'order-info-inner';
    orderInfo.innerHTML = (`
        <h1>ORDER DATA</h1>
        <h2>Order ID: ${data.orderID}</h2>
        <p><b>Date of order: </b>${data.date}</p>
    `);
    document.getElementById('order-info-container')
        .appendChild(orderInfo);
}

function displayOrderItemsTable(data) {
    const orderItemsTableInner = document.getElementById('order-items-table-inner');
    let product;
    let productPrice;
    let productId;
    let productName;
    let productCost;
    let orderItemRow;
    let totalCost = 0;
    console.log("in displayOrderItemsTable: " + data[0].quantity);

    orderItemsTableInner.innerHTML = '';
    let orderItemsTable = document.createElement('table');
    orderItemsTable.id = 'order-items-table';
    orderItemsTable.innerHTML = '<tr><th>Product</th><th>Quantity</th><th>Total price</th></tr >';
    orderItemsTableInner.appendChild(orderItemsTable);

    data.forEach((item) => {
        productId = item.productID;
        product = getProduct(productId);
        product
            .then((data) => {
                productPrice = data.price;
                productName = data.name;
                console.log(`PN, PP, ${productPrice}, ${productName}`);
                productCost = productPrice * item.quantity;
                productCost = productPrice * item.quantity;
                totalCost = productCost;
                orderItemRow = document.createElement('tr');
                orderItemRow.innerHTML = (`
                    <tr>
                        <td>${productName}</td>
                        <td>${data.quantity}</td>
                        <td>${productCost}</td>
                    </tr>
                `);
                orderItemsTable.appendChild(orderItemRow);
            })
    });
    console.log("totalCost: " + totalCost);
}

document.getElementById('button-getOrder')
    .addEventListener('click', () => {
        let selectedOrder = document.getElementById('orders-search').value;
        getOrder(selectedOrder);
    });

getOrders();

console.log("Hello");