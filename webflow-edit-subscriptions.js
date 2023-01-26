
  const url = "https://e076-80-6-132-186.ngrok.io/"
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
    document.title = response.data.productName;
    let cardContainer = document.getElementById("Cards-Container");
    const style = document.getElementById('samplestyle');

    const subscriptionName = document.getElementById('subscriptionName')
    subscriptionName.textContent = response.data.productName;

    const price = document.getElementById('subscriptionPrice')
    price.textContent = `$${response.data.price}`
    price.setAttribute("data-price", response.data.price);
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

    const productQty = document.querySelector('.quantity-number');
    productQty.value = `${response.data.productQty}`;
    productQty.min = 1;


    let nextBillDate = new Date(response.data.nextBillDate);
    let nextBillDateFormatted = (nextBillDate.getUTCMonth() + 1).toString() + "/" + nextBillDate.getUTCDate() + "/" + nextBillDate.getUTCFullYear().toString();

    const subscriptionDate = document.getElementById('next-bill-date').setAttribute("data-subscription-original-bill-date", nextBillDateFormatted);
    const fp = flatpickr(".date", {
      defaultDate: nextBillDateFormatted,
      dateFormat: "m-d-Y"
    });

    fp.config.onChange.push(function (dateStr) {
      console.log(dateStr)
      let date = new Date(dateStr);
      const dateFormatted = (date.getUTCMonth() + 1).toString() + "/" + date.getUTCDate() + "/" + date.getUTCFullYear().toString();
      const subscriptionDate = document.getElementById('next-bill-date').setAttribute("data-subscription-next-bill-date", dateFormatted);

    });



    const subscriptionStatusUpdate = document.getElementById('cancelSubscription');

    if (response.data.nextBillDate == null && response.data.status == "CANCELLED") {
      subscriptionStatusUpdate.textContent = "Reactivate subscription.";
      subscriptionStatusUpdate.classList.add("Cancelled");
    } else if (response.data.nextBillDate != null && response.data.status == "ACTIVE") {
      subscriptionStatusUpdate.textContent = "Cancel subscription";
      subscriptionStatusUpdate.classList.add("Active");
    }
    let hideContainer = document.getElementById("subscriptionLoading").style.display = "none";
    let updateContainer = document.getElementById("subscriptionLoaded").style.display = "block";
  };
  var subscriptionStatusUpdate = document.getElementById('cancelSubscription');

  subscriptionStatusUpdate.addEventListener("click", function (e) {
    e.preventDefault()
    if (subscriptionStatusUpdate.classList.contains('Active')) {
      if (confirm("Are you sure you want to cancel!")) {
        axios.post(`${url}webflow/subscriptions/cancel`, {
          purchaseId: purchaseId
        })
          .then((response) => {
            if (response.status = 200) {
              const successBanner = document.getElementById('successBanner').style.display = 'block';
              const successBannerMessage = document.getElementById('successBannerMessage');
              successBannerMessage.textContent = "Subscription Cancelled";
              //location.reload();
            } else {
              const errorBanner = document.getElementById('errorBanner').style.display = 'block';
              const errorMessageBanner = document.getElementById('errorBanner');
              errorMessageBanner.textContent = "Subscription could not be cancelled. Please Contact Support"
            }
          });
      }
    } else if (subscriptionStatusUpdate.classList.contains('Cancelled')) {
      if (confirm("Are you sure you want to reactivate the subscription!")) {
        axios.post(`${url}webflow/subscriptions/restart`, {
          purchaseId: purchaseId
        })
          .then((response) => {
            if (response.status = 200) {
              const successBanner = document.getElementById('successBanner').style.display = 'block';
              const successBannerMessage = document.getElementById('successBannerMessage');
              successBannerMessage.textContent = "Subscription Reactivated";
              //location.reload();
            } else {
              const errorBanner = document.getElementById('errorBanner').style.display = 'block';
              const errorMessageBanner = document.getElementById('errorBanner');
              errorMessageBanner.textContent = "Subscription could not be activated. Please Contact Support"
            }
          });

      }
    }

  });


  var updateSubscriptionForm = document.querySelectorAll('[data-subscription-form]');
  var updateSubscriptionError = document.querySelectorAll('[data-subscription-update-error]');
  var updateSubscriptionLoading = document.querySelectorAll('[data-subscription-update-loading]');
  var updateSubscriptionIdle = document.querySelectorAll('[data-subscription-update-idle]');

  updateSubscriptionForm.forEach(function (el) {
    var updateSubscriptionNextBillDate = el.querySelector('[data-next-bill-date]');

    el.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      updateSubscriptionError.forEach(function (el) { el.style.display = 'none'; });
      updateSubscriptionLoading.forEach(function (el) { el.style.display = 'block'; });
      updateSubscriptionIdle.forEach(function (el) { el.style.display = 'none'; });

      // Get Data from Data Attribute
      const originalBillDate = updateSubscriptionNextBillDate.getAttribute('data-subscription-original-bill-date');
      const nextBillDate = updateSubscriptionNextBillDate.getAttribute('data-subscription-next-bill-date');
      let subscriptionPrice = document.getElementById('subscriptionPrice').getAttribute("data-updated-price");
      let subscriptionQuantity = el.querySelector("[name=quantity]").getAttribute("data-quantity");
      if (confirm(`Are you sure you want to update the subscription`)) {
        axios.post(`${url}webflow/subscriptions/update`, {
          nextBillDate: nextBillDate,
          productQty: subscriptionQuantity,
          price: subscriptionPrice,
          purchaseId: purchaseId,
        })
          .then((response) => {
            if (response.status = 200) {
              const successBanner = document.getElementById('successBanner').style.display = 'block';
              const successBannerMessage = document.getElementById('successBannerMessage');
              successBannerMessage.textContent = "Subscription Updated";
            } else {
              const errorBanner = document.getElementById('errorBanner').style.display = 'block';
              const errorMessageBanner = document.getElementById('errorBanner');
              errorMessageBanner.textContent = "Subscription Not Updated. Please Contact Support"
            }
          });
      }

    });
  });

  const closeBanner = document.querySelector('[data-ms-message-close]');

  closeBanner.addEventListener("click", function (e) {
    e.preventDefault();
    const successBanner = document.querySelector('[data-ms-message]').style.display = 'none';

  });

  const quantityControl = document.querySelectorAll("[data-quantity-control]");

  quantityControl.forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();

      let quantityElement = el.querySelector("[name=quantity]");

      if (e.target.className.includes("button-plus")) {
        quantityElement.value++;
        el.querySelector(".button-minus").classList.remove("quantityMinusDisabled");
      } else if (e.target.className.includes("button-minus")) {
        if (Number(quantityElement.value) == 1) {
          el.querySelector(".button-minus").classList.add("quantityMinusDisabled");
        } else if (Number(quantityElement.value) !== 1) {
          quantityElement.value--;
          quantityElement.setAttribute("data-quantity", quantityElement.value);
        }
      }

      quantityElement.setAttribute("data-quantity", quantityElement.value);

      let price = document.getElementById('subscriptionPrice').getAttribute("data-price");
      let updatedPrice = price * quantityElement.value;
      let updatedDataPrice = document.getElementById('subscriptionPrice').setAttribute("data-updated-price", updatedPrice);
      let updatePrice = document.getElementById('subscriptionPrice').textContent = "$" + updatedPrice;
    });
  });
