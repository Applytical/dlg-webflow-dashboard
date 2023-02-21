const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const purchaseId = urlParams.get('id')
if (purchaseId == undefined) { window.location.replace("/account/subscriptions") };
axios.post(`${url}webflow/subscriptions`, {
  purchaseId: purchaseId
})
  .then((response) => {
    ShowSubscription(response);
  });

async function ShowSubscription(response) {
  const mainDashboardLoading = document.getElementById('mainDashboardLoading').style.display = 'none';
  const mainDashboardLoaded = document.getElementById('mainDashboardLoaded').style.display = 'flex';
  document.title = response.data.productName;
  const subscriptionName = document.getElementById('subscriptionName')
  subscriptionName.textContent = response.data.productName;

  const price = document.getElementById('subscriptionPrice');
  price.textContent = `$${response.data.price}`
  price.setAttribute("data-price", response.data.price);
  price.setAttribute("data-intitalprice", response.data.intitalPrice);
  price.setAttribute("data-updated-price", response.data.price);

  const subscriptionFreq = document.getElementById('subscriptionFreq');
  subscriptionFreq.textContent = `${response.data.billingIntervalDays} Days`;

  // Shipping Address
  const subscriptionShippingAddressName = document.getElementById('subscriptionShippingAddressName');
  subscriptionShippingAddressName.textContent = response.data.shipFirstName + " " + response.data.shipLastName;

  const subscriptionShippingAddressLine1 = document.getElementById('subscriptionShippingAddressLine1');
  subscriptionShippingAddressLine1.textContent = response.data.shipAddress1;

  const subscriptionShippingAddressMisc = document.getElementById('subscriptionShippingAddressMisc');
  subscriptionShippingAddressMisc.textContent = `${response.data.shipCity}, ${response.data.shipPostalCode}, ${response.data.shipState} , ${response.data.shipCountry}`;

  // Billing Address
  const subscriptionBillingAddressName = document.getElementById('subscriptionBillingAddressName');
  subscriptionBillingAddressName.textContent = response.data.firstName + " " + response.data.lastName;

  const subscriptionBillingAddressLine1 = document.getElementById('subscriptionBillingAddressLine1');
  subscriptionBillingAddressLine1.textContent = response.data.address1;

  const subscriptionBillingAddressMisc = document.getElementById('subscriptionBillingAddressMisc');
  subscriptionBillingAddressMisc.textContent = `${response.data.city}, ${response.data.postalCode}, ${response.data.state}, ${response.data.country}`;

  const subscriptionLast4 = document.getElementById('subscriptionCardLast4');
  subscriptionLast4.textContent = `••••${response.data.last4}`;
  const subscriptionStatusBadge = document.getElementsByClassName('subscription-badge')[0];
  subscriptionStatusBadge.textContent = "Active";
  subscriptionStatusBadge.style.backgroundColor = "#EC008B";


  const subscriptionProductImage = document.getElementsByClassName('product-image')[0];
  subscriptionProductImage.src = response.data.productImg;
  subscriptionProductImage.srcset = response.data.productImg;
  subscriptionProductImage.addEventListener("error", function (event) {
    event.target.src = "https://cdn.shopify.com/s/files/1/0005/0947/6927/files/dashboard.jpg?v=1676298620";
    event.target.srcset = "https://cdn.shopify.com/s/files/1/0005/0947/6927/files/dashboard.jpg?v=1676298620";
    event.onerror = null;
  })


  const productQty = document.querySelector('.quantity-number');
  productQty.setAttribute("data-initial-qty", response.data.productQty);
  productQty.value = `${response.data.productQty}`;
  productQty.min = 1;
  let nextBillDate;
  let nextBillDateFormatted;

  if (response.data.nextBillDate !== null) {

    const subscriptionStatusBadge = document.getElementsByClassName('subscription-badge')[0];
    subscriptionStatusBadge.textContent = "Active";
    subscriptionStatusBadge.style.backgroundColor = "#EC008B";

    nextBillDate = new Date(response.data.nextBillDate);
    nextBillDateFormatted = (nextBillDate.getUTCMonth() + 1).toString() + "/" + nextBillDate.getUTCDate() + "/" + nextBillDate.getUTCFullYear().toString();
  } else {

    const subscriptionStatusBadge = document.getElementsByClassName('subscription-badge')[0];
    subscriptionStatusBadge.textContent = "Cancelled";
    subscriptionStatusBadge.style.backgroundColor = "#404168";

    nextBillDate = new Date();
    nextBillDateFormatted = (nextBillDate.getUTCMonth() + 1).toString() + "/" + nextBillDate.getUTCDate() + "/" + nextBillDate.getUTCFullYear().toString();
  }
  let minDate = new Date();
  let maxDate = new Date(nextBillDate);
  maxDate.setDate(maxDate.getDate() + 30)
  const subscriptionDate = document.getElementById('next-bill-date').setAttribute("data-subscription-original-bill-date", nextBillDateFormatted);
  const fp = flatpickr(".date", {
    defaultDate: nextBillDateFormatted,
    dateFormat: "m-d-Y",
    minDate: minDate,
    maxDate: maxDate
  });

  fp.config.onChange.push(function (dateStr) {
    let date = new Date(dateStr);
    const dateFormatted = (date.getUTCMonth() + 1).toString() + "/" + date.getUTCDate() + "/" + date.getUTCFullYear().toString();
    const subscriptionDate = document.getElementById('next-bill-date').setAttribute("data-subscription-next-bill-date", dateFormatted);
  });
  // Hide elements based on subscription status 
  if (response.data.nextBillDate == null && response.data.status == "CANCELLED") {
    const subscriptionCancel = document.getElementById('cancelSubscription').style.display = "none";
    const hidenextBillDateDiv = document.getElementById('nextBillDateDiv').style.display = "none";
    const hideUpdateSubButton = document.getElementById('updateSubButton').style.display = "none";

    const subscriptionStatusUpdate = document.getElementById('reactivateSubscription').style.display = "block";
  } else if (response.data.nextBillDate != null && response.data.status == "ACTIVE") {
    const subscriptionStatusUpdate = document.getElementById('reactivateSubscription').style.display = "none";
    var subscriptionCancel = document.getElementById('cancelSubscription').style.display = "block";
  }
  let hideContainer = document.getElementById("subscriptionLoading").style.display = "none";
  let updateContainer = document.getElementById("subscriptionLoaded").style.display = "block";
};


const modal = document.getElementById("subscriptionModal");
const modalContent = document.getElementById("subscriptionModalContent");
const closeModal = document.getElementById('modalClose');
const modalAgree = document.getElementById("subscriptionModalAgree");
const modalCancel = document.getElementById("subscriptionModalCancel");
const modalTitle = document.getElementById("subscriptionModalTitle");



var subscriptionCancel = document.getElementById('cancelSubscription');

subscriptionCancel.addEventListener("click", function (e) {
  e.preventDefault()

  modalAgree.textContent = 'Cancel Subscription'
  modalTitle.textContent = 'Are you sure you want to cancel?'

  modal.style.display = 'flex';

  modalAgree.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    modalAgree.innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'

    axios.post(`${url}webflow/subscriptions/cancel`, {
      purchaseId: purchaseId
    })
      .then((response) => {
        if (response.status = 200) {
          modal.style.display = 'none';
          const successBanner = document.getElementById('successBanner').style.display = 'block';
          const successBannerMessage = document.getElementById('successBannerMessage');
          successBannerMessage.textContent = "Subscription Cancelled";;
          const subscriptionStatusBadge = document.getElementsByClassName('subscription-badge')[0];
          subscriptionStatusBadge.textContent = "Cancelled";
          subscriptionStatusBadge.style.backgroundColor = "#404168";
          var subscriptionCancel = document.getElementById('cancelSubscription').style.display = "none";
          const subscriptionStatusUpdate = document.getElementById('reactivateSubscription').style.display = "block";

        }
      }).catch((error) => {
        const errorBanner = document.getElementById('errorBanner').style.display = 'block';
        const errorMessageBanner = document.getElementById('errorBannerMessage');
        errorMessageBanner.textContent = error.response.data
      });
  });

  modalCancel.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    modal.style.display = 'none';

  });
});


var subscriptionReactivate = document.getElementById('reactivateSubscription');

subscriptionReactivate.addEventListener("click", function (e) {
  e.preventDefault()

  modalAgree.textContent = 'Reactivate'
  modalTitle.textContent = 'Are you sure you want to reactivate the subscription!'

  modal.style.display = 'flex';

  modalAgree.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    modalAgree.innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'

    axios.post(`${url}webflow/subscriptions/restart`, {
      purchaseId: purchaseId
    })
      .then((response) => {
        if (response.status = 200) {
          modal.style.display = 'none';
          const successBanner = document.getElementById('successBanner').style.display = 'block';
          const successBannerMessage = document.getElementById('successBannerMessage');
          const subscriptionStatusBadge = document.getElementsByClassName('subscription-badge')[0];
          subscriptionStatusBadge.textContent = "Cancelled";
          subscriptionStatusBadge.style.backgroundColor = "#404168";
          const subscriptionStatusUpdate = document.getElementById('reactivateSubscription').style.display = "none";
          var subscriptionCancel = document.getElementById('cancelSubscription').style.display = "block";

        }
      }).catch((error) => {
        const errorBanner = document.getElementById('errorBanner').style.display = 'block';
        const errorMessageBanner = document.getElementById('errorBannerMessage');
        errorMessageBanner.textContent = error.response.data
      });
  });

  modalCancel.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    modal.style.display = 'none';

  });
});


const updateSubscriptionForm = document.querySelectorAll('[data-subscription-form]');
const updateSubscriptionError = document.querySelectorAll('[data-subscription-update-error]');
const updateSubscriptionLoading = document.querySelectorAll('[data-subscription-update-loading]');
const updateSubscriptionIdle = document.querySelectorAll('[data-subscription-update-idle]');


updateSubscriptionForm.forEach(function (el) {
  const updateSubscriptionNextBillDate = el.querySelector('[data-next-bill-date]');


  el.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    updateSubscriptionError.forEach(function (el) { el.style.display = 'none'; });
    updateSubscriptionLoading.forEach(function (el) { el.style.display = 'block'; });
    updateSubscriptionIdle.forEach(function (el) { el.style.display = 'none'; });
    modalAgree.textContent = 'Update'
    modalTitle.textContent = 'Are you sure you want to update?'

    modal.style.display = 'flex';

    const nextBillDate = updateSubscriptionNextBillDate.getAttribute('data-subscription-next-bill-date');
    let subscriptionQuantity = el.querySelector("[name=quantity]").getAttribute("data-quantity");



    modalAgree.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      modalAgree.innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'

      axios.post(`${url}webflow/subscriptions/update`, {
        nextBillDate: nextBillDate,
        productQty: subscriptionQuantity,
        purchaseId: purchaseId,
      })
        .then((response) => {
          if (response.status = 200) {
            modal.style.display = 'none';
            const successBanner = document.getElementById('successBanner').style.display = 'block';
            const successBannerMessage = document.getElementById('successBannerMessage');
            successBannerMessage.textContent = "Subscription Updated";
          }
        })
        .catch((error) => {
          modal.style.display = 'none';
          const errorBanner = document.getElementById('errorBanner').style.display = 'block';
          const errorMessageBanner = document.getElementById('errorBannerMessage');
          errorMessageBanner.textContent = error.response.data
        });;
    });

    modalCancel.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      modal.style.display = 'none';

    });

  });
});

const quantityControl = document.querySelectorAll("[data-quantity-control]");

quantityControl.forEach(function (el) {
  let quantityElement = el.querySelector("[name=quantity]");
  quantityElement.readOnly = true;
  el.addEventListener("click", function (e) {
    e.preventDefault();

    if (e.target.className.includes("button-plus")) {
      quantityElement.value++;
      el.querySelector(".button-minus").classList.remove("quantityMinusDisabled");
    } else if (e.target.className.includes("button-minus")) {
      if (Number(quantityElement.value) !== 1) {
        quantityElement.value--;
        quantityElement.setAttribute("data-quantity", quantityElement.value);
      }
    }
    quantityElement.setAttribute("data-quantity", quantityElement.value);

    const priceElement = document.getElementById('subscriptionPrice');
    let price = quantityElement.value * Number(priceElement.dataset.intitalprice);
    
    priceElement.value = `$${price.toFixed(2)}`
  });
});

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


closeModal.addEventListener("click", function (e) {
  e.preventDefault();
  modal.style.display = 'none';
});

const closeSucessBanner = document.getElementById('successBanner');

closeSucessBanner.addEventListener("click", function (e) {
  e.preventDefault();
  closeSucessBanner.style.display = 'none';

});
const closeErrorBanner = document.getElementById('errorBanner');

closeErrorBanner.addEventListener("click", function (e) {
  e.preventDefault();
  closeErrorBanner.style.display = 'none';

});

