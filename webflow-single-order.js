// Get the query string from the current URL
const queryString = window.location.search;
// Create a new URLSearchParams object from the query string
const urlParams = new URLSearchParams(queryString);
// Get the value of the 'id' parameter from the URLSearchParams object
const orderId = urlParams.get('id');
// If the orderId is undefined, redirect to "/membership/history"
if (orderId == undefined) { window.location.replace("/membership/history") };
// Make a POST request to the specified URL with the orderId as data
axios.post(`${url}/webflow/shopify/order`, {
  orderId: orderId
})
  .then((response) => {
    // If the response status is 200, call the showOrderDetails function with the response data
    if (response.status == 200) {
      showOrderDetails(response.data);
    };
  }).catch((error) => {
    // If there is an error in the POST request, set the display style of elements with IDs 'orderBreadcrumbs' and 'order' to "none" and set the display style of element with ID 'orderError' to "block"
    const orderBreadcrumbs = document.getElementById('orderBreadcrumbs').style.display = "none";
    const order = document.getElementById('order').style.display = "none";
    const orderLoading = document.getElementById('orderLoading').style.display = "none";
    const orderError = document.getElementById('orderError').style.display = "block";
  });

function showOrderDetails(order) {

  // Set the document title to the order name
  document.title = order.name;

  // Select the element with class 'breadcrumb-order-name' and set its text content to the order name
  const breadcrumbOrderName = document.querySelector('.breadcrumb-order-name');
  breadcrumbOrderName.textContent = order.name
  // Select the element with class 'order-module'
  const orderModule = document.querySelector('.order-module');

  // Select the element with class 'order-name' within the orderModule element and set its text content to the order name
  const orderName = orderModule.querySelector('.order-name');
  orderName.textContent = order.name;


  // Check if the order has a shipping address
  if (order.shipping_address) {
    // Select the element with class 'shipping-name' within the orderModule element and set its text content to the shipping address name
    const shippingName = orderModule.querySelector('.shipping-name');
    shippingName.textContent = order.shipping_address.name;

    // Select the element with class 'shipping-information' within the orderModule element and set its text content to a formatted string containing the shipping address information
    const shippingAddress = orderModule.querySelector('.shipping-information');
    shippingAddress.textContent = order.shipping_address.address1 + ', ' + order.shipping_address.province + `(${order.shipping_address.province_code})` + ', ' + order.shipping_address.zip
  } else {
    // If the order does not have a shipping address, set the display style of the element with ID 'shipAddresss' within the orderModule element to "none"
    const shipAddresss = orderModule.querySelector('#shipAddresss').style.display = "none";
  }

  // Check if the order has a billing address
  if (order.billing_address) {
    // Select the element with class 'billing-name' within the orderModule element and set its text content to the billing address name
    const billingName = orderModule.querySelector('.billing-name');
    billingName.textContent = order.billing_address.name;

    // Select the element with class 'billing-information' within the orderModule element and set its text content to a formatted string containing the billing address information
    const billingAddress = orderModule.querySelector('.billing-information');
    billingAddress.textContent = order.billing_address.address1 + ', ' + order.billing_address.province + `(${order.billing_address.province_code})` + ', ' + order.billing_address.zip
  } else {
    // If the order does not have a billing address, set the display style of the element with ID 'billAddresss' within the orderModule element to "none"
    const billAddresss = orderModule.querySelector('#billAddresss').style.display = "none";
  }


  // Select the element with ID 'orderLineItems'
  const orderLineItemsTable = document.getElementById("orderLineItems");

  // Iterate over each line item in the order's line items
  order.line_items.forEach(line_item => {
    // Get the element with ID 'lineItemsStyle'
    const style = document.getElementById('lineItemsStyle');
    // Clone the style element and its children
    const card = style.cloneNode(true)

    // Set the ID of the cloned element to an empty string and set its display style to 'grid'
    card.setAttribute('id', '');
    card.style.display = 'grid';

    // Select the element with class 'line-item-name' within the card element and set its text content to the line item name
    const lineItemName = card.querySelector('.line-item-name');
    lineItemName.textContent = line_item.name;

    // Select the element with class 'line-item-qty' within the card element and set its text content to the line item quantity
    const lineItemQty = card.querySelector('.line-item-qty');
    lineItemQty.textContent = line_item.quantity;

    // Select the element with class 'line-item-price-per-qty' within the card element and set its text content to a formatted string containing the line item price
    const lineItemPricePerQty = card.querySelector('.line-item-price-per-qty');
    lineItemPricePerQty.textContent = "$" + line_item.price;

    // Select the element with class 'line-item-total-price' within the card element
    const lineItemTotalPrice = card.querySelector('.line-item-total-price');

    // Calculate the total price for this line item by multiplying its quantity by its price
    let price = line_item.quantity * Number(line_item.price);

    // Set the text content of the lineItemTotalPrice element to a formatted string containing the total price for this line item
    lineItemTotalPrice.textContent = `$${price.toFixed(2)}`

    // Append the card element to the orderLineItemsTable element
    orderLineItemsTable.appendChild(card);
  });

  // Select the element with class 'total-line-item-price' within the orderModule element and set its text content to the order's total line items price
  const totalLineItemPrice = orderModule.querySelector('.total-line-item-price');
  totalLineItemPrice.textContent = `${order.total_line_items_price}`

  // Select the element with class 'order-discount' and set its text content to a formatted string containing the order's total discounts
  const orderDiscounts = document.querySelector('.order-discount');
  orderDiscounts.textContent = `-$${order.total_discounts}`

  // Select the element with class 'order-shipping' and set its text content to a formatted string containing the order's total shipping
  const orderShipping = document.querySelector('.order-shipping');
  orderShipping.textContent = `$${order.total_shipping}`;

  // Select the element with class 'order-taxes' and set its text content to a formatted string containing the order's total tax
  const orderTax = document.querySelector('.order-taxes');
  orderTax.textContent = `$${order.total_tax}`;

  // Select the element with class 'order-total' and set its text content to a formatted string containing the order's total price
  const orderTotal = document.querySelector('.order-total');
  orderTotal.textContent = `$${order.total_price}`

  // Select the element with class 'order-status'
  const orderStatus = document.querySelector('.order-status');
  let orderStatusText
  // Set the value of orderStatusText based on the value of the order's financial status
  if (order.financial_status == 'paid') {
    orderStatusText = "Paid";
  } else if (order.financial_status == 'refunded') {
    orderStatusText = "Refunded";
    // Remove the "green" class from the orderStatus element and add the "orange" class
    orderStatus.classList.remove("green");
    orderStatus.classList.add("orange");

  } else if (order.financial_status == 'partially_refunded') {
    orderStatusText = "Partially Refunded";
    // Remove the "green" class from the orderStatus element and add the "orange" class
    orderStatus.classList.remove("green");
    orderStatus.classList.add("orange");
  } else {
    // If none of the above conditions are met, set the value of orderStatusText to the value of the order's financial status
    orderStatusText = order.financial_status
  }
  // Set the text content of the orderStatus element to the value of orderStatusText
  orderStatus.textContent = orderStatusText

  // Set the display style of elements with IDs 'orderLoading', 'orderBreadcrumbs', and 'order' to "none", "grid", and "grid", respectively
  const orderLoading = document.getElementById('orderLoading').style.display = "none";
  const orderBreadcrumbs = document.getElementById('orderBreadcrumbs').style.display = "grid";
  const orderLoaded = document.getElementById('order').style.display = "grid";

}