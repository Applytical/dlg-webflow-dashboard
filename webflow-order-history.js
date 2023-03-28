// Get the value of the "shopifyCustomerId" item from sessionStorage
const customerId = sessionStorage.getItem("shopifyCustomerId");
// Check if customerId has a value
if (customerId) {
  // Make a POST request to the specified URL with the customerId as data
  axios.post(`${url}/webflow/shopify/history`, {
    customerId: customerId
  })
    .then((response) => {
      // If the response status is 200
      if (response.status == 200) {
        // If the response data is "No Order History"
        if (response.data == "No Order History") {
          // Set the display style of elements with IDs 'orderHistoryLoading', 'allOrdersModule', and 'tableHeader' to "none"
          const orderHistoryLoading = document.getElementById('orderHistoryLoading').style.display = "none";
          const allOrdersModule = document.getElementById('allOrdersModule').style.display = "none";
          const tableHeader = document.getElementById('tableHeader').style.display = "none";

          // Set the display style of the element with ID 'noOrderHistory' to "block"
          const unableToload = document.getElementById("noOrderHistory").style.display = "block";
        } else {
          // If the response data is not "No Order History", call the showAllOrders function with the response data
          showAllOrders(response.data);
        }
      }
    })
    .catch((error) => {
      // If there is an error in the POST request, set the display style of elements with IDs 'orderHistoryLoading', 'allOrdersModule', and 'tableHeader' to "none" and set the display style of the element with ID 'unableToLoad' to "block"
      const orderHistoryLoading = document.getElementById('orderHistoryLoading').style.display = "none";
      const allOrdersModule = document.getElementById('allOrdersModule').style.display = "none";
      const tableHeader = document.getElementById('tableHeader').style.display = "none";

      const unableToload = document.getElementById("unableToLoad").style.display = "block";
    });
} else {
  // If there is no customer id, set the display style of elements with IDs 'orderHistoryLoading', 'allOrdersModule', and 'tableHeader' to "none" and set the display style of the element with ID 'unableToLoad' to "block"
  const orderHistoryLoading = document.getElementById('orderHistoryLoading').style.display = "none";
  const allOrdersModule = document.getElementById('allOrdersModule').style.display = "none";
  const tableHeader = document.getElementById('tableHeader').style.display = "none";

  const unableToload = document.getElementById("noOrderHistory").style.display = "block";
}
// Declare a variable to hold all orders
let allOrders = [];
// Define a function to show all orders
function showAllOrders(orders, currentPage = 1, itemsPerPage = 10) {
  // Set the value of allOrders to the orders passed as an argument
  allOrders = orders;
  // Calculate the total number of pages by dividing the number of orders by the number of items per page and rounding up
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the orders to display on the current page by slicing the orders array
  const ordersToDisplay = orders.slice(startIndex, endIndex);

  // Get the element with ID 'OrdersModule'
  const ordersModule = document.getElementById("OrdersModule");

  // Iterate over each order to display
  ordersToDisplay.forEach(order => {
    // Get the element with ID 'OrdersBase'
    const style = document.getElementById('OrdersBase');

    // Clone the style element and its children
    const card = style.cloneNode(true)

    // Set the ID of the cloned element to the order ID and set its display style to 'grid'
    card.setAttribute('id', order.id);
    card.style.display = 'grid';

    // Select the element with class 'order-name' within the card element and set its text content to the order name
    const orderName = card.querySelector('.order-name');
    orderName.textContent = order.name;

    // Format the order's created_at date as a string
    const created_at = new Date(order.created_at).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" });
    // Select the element with class 'order-date' within the card element and set its text content to the formatted created_at date
    const orderDate = card.querySelector('.order-date');
    orderDate.textContent = created_at;

    // Select the element with class 'order-amount' within the card element and set its text content to the order's total price
    const orderAmount = card.querySelector('.order-amount');
    orderAmount.textContent = order.total_price;

    // Select the element with class 'order-status' within the card element
    const orderStatus = card.querySelector('.order-status');
    let orderStatusText;
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
    orderStatus.textContent = orderStatusText;

    // Add a click event listener to the element with class 'view-order' within the card element
    const orderLink = card.querySelector('.view-order').addEventListener('click', function (e) {
      // When the element is clicked, set the document location to a URL containing the order ID as a query parameter
      document.location.href = "/membership/order?id=" + order.id;
    });

    // Append the card element to the ordersModule element
    ordersModule.appendChild(card);
    // Get the elements with IDs 'showMoreButton' and 'showMoreButtonDiv'
    const showMoreButton = document.getElementById('showMoreButton');
    const showMoreButtonDiv = document.getElementById('showMoreButtonDiv');

    // Update the onclick function of the showMoreButton element to call the showAllOrders function with the current page incremented by 1
    showMoreButton.onclick = function () {
      showAllOrders(allOrders, currentPage + 1, itemsPerPage);
    };

    // If the current page is greater than or equal to the total number of pages, hide the showMoreButton and showMoreButtonDiv elements
    if (currentPage >= totalPages) {
      showMoreButton.style.display = 'none';
      showMoreButtonDiv.style.display = 'none';
    } else {
      // Otherwise, set the display style of the showMoreButtonDiv element to 'flex' and set the display style of the showMoreButton element to 'block'
      showMoreButtonDiv.style.display = 'flex';
      showMoreButton.style.display = 'block';
    }
  });

  // Set the display style of the element with ID 'orderHistoryLoading' to "none"
  const loading = document.getElementById('orderHistoryLoading').style.display = "none";
}