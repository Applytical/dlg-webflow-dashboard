
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

    const subscriptionName = card.querySelector('.subscription-name');
    subscriptionName.textContent = subscription.productName;

    const subscriptionQty = card.querySelector('.subscription-qty');
    subscriptionQty.textContent = subscription.productQty;

    const subscriptionPrice = card.querySelector('.subscription-price');
    subscriptionPrice.textContent = `$${subscription.price}`;

    const subscriptionNextBilldate = card.querySelector('.subscription-nextbilldate');
    const nextbilldate = card.querySelector('.nextbilldate');

    // Reformat the next billing date
    let nextBillDate = new Date(subscription.nextBillDate);
    let nextBillDateFormatted = (nextBillDate.getUTCMonth() + 1).toString() + '/' + nextBillDate.getUTCDate() + '/' + nextBillDate.getUTCFullYear().toString();
    subscriptionNextBilldate.textContent = nextBillDateFormatted;
    if (subscription.status != "ACTIVE") {
      nextbilldate.style.display = "none";
    }

    const subscriptionFrequency = card.querySelector('.subscription-frequency');
    subscriptionFrequency.textContent = subscription.billingIntervalDays + " Days";

    const subscriptionStatusBadge = card.querySelector('.subscription-badge');
    let status = subscription.status.toLowerCase();
    subscriptionStatusBadge.textContent = status;
    if (subscription.status == "ACTIVE") {
      subscriptionStatusBadge.style.backgroundColor = "#ec008c";
    } else {
      subscriptionStatusBadge.style.backgroundColor = "#404168";
    }

    const subscriptionProductImage = card.querySelector('.product-image');
    subscriptionProductImage.src = subscription.productImg;
    subscriptionProductImage.srcset = subscription.productImg;
    subscriptionProductImage.addEventListener("error", function (event) {
      event.target.src = "https://uploads-ssl.webflow.com/63a18f4b54dbb2f24a2ae326/63f5eadcde5015ee6c1476ab_placeholder.jpg";
      event.target.srcset = "https://uploads-ssl.webflow.com/63a18f4b54dbb2f24a2ae326/63f5eadcde5015ee6c1476ab_placeholder.jpg";
      event.onerror = null;
    });

    const subscriptionLink = card.querySelector('.subscription-link').addEventListener('click', function (e) {
      document.location.href = "/membership/edit?id=" + subscription.purchaseId;
    });

    if (subscription.base_product_id == 276 || subscription.base_product_id == 278 || subscription.base_product_id == 355 || subscription.base_product_id == 279) {
      // Place the card into the div "Cards-Container"
      if (subscription.status == "ACTIVE") {
        cardContainer.appendChild(card);
      } else {
        cancelledContainer.appendChild(card);
      }
    }

    // const hideLoading = document.getElementById('subscriptionLoading').style.display = 'none';
    const mainDashboard = document.getElementById('mainDashboard').style.display = 'flex';
    const allSubscriptions = document.getElementById("allSubscriptions").style.display = 'block';
    const subscriptionsTitle = document.getElementById("subscriptionsTitle").style.display = 'block';
  })
}

function showError(error) {
  if (error.response.data == "Could Not Find Customer") {
    window.location.href = "/membership/no-subscription-page"
  } else {
    const errorSubscription = document.getElementById('errorSubscriptions').style.display = 'flex';
  }
}