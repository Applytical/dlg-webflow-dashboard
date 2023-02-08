
let customerEmail = sessionStorage.getItem("email");

axios.post(`${url}/webflow/subscriptions/all`, {
  email: customerEmail
})
  .then((response) => {
    getSubscriptions(response.data)
  })
  .catch((error) => {
    console.log(error.response.data);
    if (error.response.data == "Could Not Find Customer") {
      const NoSubscriptions = document.getElementById('noSubscriptions').style.display = 'flex';
      const hideSideBar = document.getElementById('navSideBar').style.display = 'none';
      const hideTopBar = document.getElementById('navTopBar').style.display = 'none';
      const footer = document.getElementById('footer').style.display = 'none';
      const lifestyleBtn = document.getElementById('joinLifeStyle');

      lifestyleBtn.addEventListener('click', function (e) {
        const refreshPage = document.getElementById('refreshPage');
        const refreshPageDiv = document.getElementById('refreshPageDiv').style.display = "block";
        refreshPage.addEventListener('click', function (e) {

          window.location.reload();

        });
      });



    } else {
      const errorSubscription = document.getElementById('errorSubscriptions').style.display = 'flex';

    }

  });

function getSubscriptions(subscriptions) {
  const allSubscriptions = document.getElementById("allSubscriptions").style.display = 'block';
  const cardContainer = document.getElementById("Cards-Container")

  subscriptions.forEach(subscription => {
    if (subscription.nextBillDate !== null && subscription.status == "ACTIVE") {

      const style = document.getElementById('cardstyle');
      // Copy the card and it's style
      const card = style.cloneNode(true)

      card.setAttribute('id', '');
      card.style.display = 'block';

      const subscriptionName = card.getElementsByClassName('subscription-name')[0];
      subscriptionName.textContent = subscription.productName;

      const subscriptionId = card.getElementsByClassName('subscription_id')[0];
      subscriptionId.textContent = subscription.purchaseId;

      const subscriptionQty = card.getElementsByClassName('subscription-qty')[0];
      subscriptionQty.textContent = subscription.productQty

      const subscriptionPrice = card.getElementsByClassName('subscription-price')[0];
      subscriptionPrice.textContent = `$${subscription.price}`;

      const subscriptionNextBilldate = card.getElementsByClassName('subscription-nextbilldate')[0];
      subscriptionNextBilldate.textContent = subscription.nextBillDate

      const subscriptionFrequency = card.getElementsByClassName('subscription-frequency')[0];
      subscriptionFrequency.textContent = subscription.billingIntervalDays + " Days"


      const subscriptionStatusBadge = card.getElementsByClassName('subscription-badge')[0];
      subscriptionStatusBadge.textContent = "Active";
      subscriptionStatusBadge.style.backgroundColor = "#EC008B";


      const subscriptionProductImage = card.getElementsByClassName('product-image')[0];
      subscriptionProductImage.src = subscription.productImg;
      subscriptionProductImage.addEventListener("error", function (event) {
        event.target.src = subscription.productImg;
        event.onerror = "https://cdn.shopify.com/s/files/1/0005/0947/6927/files/Livingood_Daily_Logo_Triangle.png?v=1613689543"
      })



      const subscriptionLink = card.getElementsByClassName('subscription-link')[0].addEventListener('click', function (e) {
        document.location.href = "/account/subscription?id=" + subscription.purchaseId;
      });

      // Place the card into the div "Cards-Container"
      cardContainer.appendChild(card);

    } else {
      const style = document.getElementById('cardstyle');
      // Copy the card and it's style
      const card = style.cloneNode(true)

      card.setAttribute('id', '');
      card.style.display = 'block';

      const subscriptionName = card.getElementsByClassName('subscription-name')[0];
      subscriptionName.textContent = subscription.productName;

      const subscriptionId = card.getElementsByClassName('subscription_id')[0];
      subscriptionId.textContent = subscription.purchaseId;

      const subscriptionQty = card.getElementsByClassName('subscription-qty')[0];
      subscriptionQty.textContent = subscription.productQty

      const subscriptionPrice = card.getElementsByClassName('subscription-price')[0];
      subscriptionPrice.textContent = `$${subscription.price}`;

      const subscriptionNextBilldate = card.getElementsByClassName('nextbilldate')[0];
      subscriptionNextBilldate.style.display = "none"

      const subscriptionFrequency = card.getElementsByClassName('subscription-frequency')[0];
      subscriptionFrequency.textContent = subscription.billingIntervalDays + " Days"

      const subscriptionStatusBadge = card.getElementsByClassName('subscription-badge')[0];
      subscriptionStatusBadge.textContent = "Cancelled";
      subscriptionStatusBadge.style.backgroundColor = "#404168";

      const subscriptionProductImage = card.getElementsByClassName('product-image')[0];
      subscriptionProductImage.src = subscription.productImg;

      const subscriptionLink = card.getElementsByClassName('subscription-link')[0].addEventListener('click', function (e) {
        document.location.href = "/account/subscription?id=" + subscription.purchaseId;
      });

      // Place the card into the div "Cards-Container"
      cardContainer.appendChild(card);
    }
  })
}
