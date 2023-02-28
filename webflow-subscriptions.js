
let customerEmail = sessionStorage.getItem("email");

axios.post(`${url}/webflow/subscriptions/all`, {
  email: customerEmail
})
  .then((response) => {
    getSubscriptions(response.data)
  })
  .catch((error) => {
    showError(error)
  });

function getSubscriptions(subscriptions) {
  const cardContainer = document.getElementById("Cards-Container");
  const cancelledContainer = document.getElementById("Cancelled-Container");

  subscriptions.forEach(subscription => {      
    const style = document.getElementById('cardstyle');
    // Copy the card and it's style
    const card = style.cloneNode(true)

    card.setAttribute('id', '');
    card.style.display = 'block';

    const subscriptionName = card.getElementsByClassName('subscription-name')[0];
    subscriptionName.textContent = subscription.productName;

    const subscriptionQty = card.getElementsByClassName('subscription-qty')[0];
    subscriptionQty.textContent = subscription.productQty;

    const subscriptionPrice = card.getElementsByClassName('subscription-price')[0];
    subscriptionPrice.textContent = `$${subscription.price}`;

    const subscriptionNextBilldate = card.getElementsByClassName('subscription-nextbilldate')[0];
    subscriptionNextBilldate.textContent = subscription.nextBillDate;
    if (subscription.status != "ACTIVE") {
      subscriptionNextBilldate.style.display = "none";
    }
    
    const subscriptionFrequency = card.getElementsByClassName('subscription-frequency')[0];
    subscriptionFrequency.textContent = subscription.billingIntervalDays + " Days";

    const subscriptionStatusBadge = card.getElementsByClassName('subscription-badge')[0];
    subscriptionStatusBadge.textContent = subscription.status;
    if (subscription.status == "ACTIVE") {
      subscriptionStatusBadge.style.backgroundColor = "#ec008c";
    } else {
      subscriptionStatusBadge.style.backgroundColor = "#404168";
    }

    const subscriptionProductImage = card.getElementsByClassName('product-image')[0];
    subscriptionProductImage.src = subscription.productImg;
    subscriptionProductImage.srcset = subscription.productImg;
    subscriptionProductImage.addEventListener("error", function (event) {
      event.target.src = "https://uploads-ssl.webflow.com/63a18f4b54dbb2f24a2ae326/63f5eadcde5015ee6c1476ab_placeholder.jpg";
      event.target.srcset = "https://uploads-ssl.webflow.com/63a18f4b54dbb2f24a2ae326/63f5eadcde5015ee6c1476ab_placeholder.jpg";
      event.onerror = null;
    });

    const subscriptionLink = card.getElementsByClassName('subscription-link')[0].addEventListener('click', function (e) {
      document.location.href = "/account/subscription?id=" + subscription.purchaseId;
    });

    // Place the card into the div "Cards-Container"
    if (subscription.status == "ACTIVE") {
      cardContainer.appendChild(card);
    } else {
      cancelledContainer.appendChild(card);
    }

    // const hideLoading = document.getElementById('subscriptionLoading').style.display = 'none';
    const mainDashboard = document.getElementById('mainDashboard').style.display = 'flex';
    const allSubscriptions = document.getElementById("allSubscriptions").style.display = 'block';
    const subscriptionsTitle = document.getElementById("subscriptionsTitle").style.display = 'block';
  })
}

function showError(error){
  if (error.response.data == "Could Not Find Customer") {
    window.location.href = "/account/no-subscription-page"
  } else {
    const errorSubscription = document.getElementById('errorSubscriptions').style.display = 'flex';
  }
}
