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
  subscriptionStatusBadge.style.backgroundColor = "#ec008c";

  var select = document.getElementById('subscriptionsFreqDropdown');

  response.data.frequency.forEach((element, index) => {
    let option_elem = document.createElement('option');

    let option_value;
    if (element.billingIntervalDays == 30) {
      option_value = "30 Days";
    } else if (element.billingIntervalDays == 60) {
      option_value = "60 Days";
    } if (element.billingIntervalDays == 90) {
      option_value = "90 Days";
    }
    if (response.data.billingIntervalDays == element.billingIntervalDays) {
      option_elem.setAttribute('selected', true);
      select.setAttribute('product_id', element.product_id);
    }
    // Add index to option_elem
    option_elem.value = element.product_id;

    // Add element HTML
    option_elem.textContent = option_value;


    // Append option_elem to select_elem
    select.appendChild(option_elem);
  });

  select.addEventListener('change', function () {

    // Loop through all the options and remove the selected attribute
    for (let i = 0; i < select.options.length; i++) {
      select.options[i].removeAttribute("selected");
    }

    // Set the selected attribute to the current option
    select.setAttribute('product_id', this.value);
    select.options[select.selectedIndex].setAttribute('selected', true);

  });

  const subscriptionProductImage = document.getElementsByClassName('product-image')[0];
  subscriptionProductImage.src = response.data.productImg;
  subscriptionProductImage.srcset = response.data.productImg;
  subscriptionProductImage.addEventListener("error", function (event) {
    event.target.src = "https://uploads-ssl.webflow.com/63a18f4b54dbb2f24a2ae326/63f5eadcde5015ee6c1476ab_placeholder.jpg";
    event.target.srcset = "https://uploads-ssl.webflow.com/63a18f4b54dbb2f24a2ae326/63f5eadcde5015ee6c1476ab_placeholder.jpg";
    event.onerror = null;
  })

  const productQty = document.querySelector('.quantity-number');
  productQty.setAttribute("data-initial-qty", response.data.productQty);
  productQty.setAttribute("data-quantiyy", response.data.productQty);
  productQty.value = `${response.data.productQty}`;
  productQty.min = 1;
  let nextBillDate;
  let nextBillDateFormatted;

  if (response.data.nextBillDate !== null) {

    const subscriptionStatusBadge = document.getElementsByClassName('subscription-badge')[0];
    subscriptionStatusBadge.textContent = "Active";
    subscriptionStatusBadge.style.backgroundColor = "#ec008c";

    nextBillDate = new Date(response.data.nextBillDate);
    nextBillDateFormatted = (nextBillDate.getUTCMonth() + 1).toString() + "/" + nextBillDate.getUTCDate() + "/" + nextBillDate.getUTCFullYear().toString();
  } else {

    const subscriptionStatusBadge = document.getElementsByClassName('subscription-badge')[0];
    subscriptionStatusBadge.textContent = "Cancelled";
    subscriptionStatusBadge.style.backgroundColor = "#404168";

    nextBillDate = new Date();
    nextBillDateFormatted = (nextBillDate.getUTCMonth() + 1).toString() + "/" + nextBillDate.getUTCDate() + "/" + nextBillDate.getUTCFullYear().toString();
  }

  const nextBillDateStorage = sessionStorage.setItem("next-bill-date", nextBillDateFormatted)
  const nextBillDateStorageForm = sessionStorage.setItem("next-bill-date-form", nextBillDateFormatted)

  let minDate = new Date();
  let maxDate = new Date(nextBillDate);
  maxDate.setDate(maxDate.getDate() + 30)
  const fp = flatpickr(".date", {
    defaultDate: nextBillDateFormatted,
    dateFormat: "m-d-Y",
    minDate: minDate,
    maxDate: maxDate
  });

  fp.config.onChange.push(function (dateStr) {
    let date = new Date(dateStr);
    const dateFormatted = (date.getUTCMonth() + 1).toString() + "/" + date.getUTCDate() + "/" + date.getUTCFullYear().toString();
    const nextBillDateStorageForm = sessionStorage.setItem("next-bill-date-form", dateFormatted)

  });

  // Hide elements based on subscription status 
  if (response.data.nextBillDate == null && response.data.status == "CANCELLED") {
    const subscriptionCancel = document.getElementById('cancelSubscription').style.display = "none";
    const nextBillDateDiv = document.getElementById('nextBillDateDiv').style.display = "none";
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

const cancelSubscriptionFlow = document.getElementById("cancelSubscriptionFlow");

const closeModal = document.getElementById('modalClose');
const modalAgree = document.getElementById("subscriptionModalAgree");
const modalCancel = document.getElementById("subscriptionModalCancel");
const modalTitle = document.getElementById("subscriptionModalTitle");

var subscriptionCancel = document.getElementById('cancelSubscription');

subscriptionCancel.addEventListener("click", async function (e) {
  const cancelFlowModalClose = document.getElementById("cancelFlowModalCancel");
  const modalClose = document.getElementById('closeModal');
  const cancellationReasonsDiv = document.getElementById("cancellationReasons");
  const areYouSure = document.getElementById("areYouSure");
  const otherReasonCancel = document.getElementById("otherReasonCancel");
  var changeBillDateModal = document.getElementById('changeBillDateModal');
  cancellationReasonsDiv.style.display = "block";
  otherReasonCancel.style.display = "none";
  changeBillDateModal.style.display = "none";

  modal.style.display = 'flex';
  cancelSubscriptionFlow.style.display = "flex";
  var cancelFlow = document.querySelectorAll('[data-cancel-sub-form]');
  cancelFlow.forEach(function (el) {

    el.addEventListener('submit', async function (e) {
      e.preventDefault();
      e.stopPropagation();
      const active_radio = document.querySelector('.w--redirected-checked');
      const wrapper = active_radio.parentElement;
      let reason = wrapper.querySelector('span.w-form-label').innerHTML;
      if (reason == "Other") {
        cancellationReasonsDiv.style.display = "none";
        otherReasonCancel.style.display = "block";

        var cancelFlow = document.getElementById('otherReasonCancel');

        var otherReasonSubmit = document.getElementById('otherReasonBtn');
        otherReasonSubmit.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const otherTextField = document.getElementById("otherTextField");
          const request = {
            purchaseId: purchaseId,
            reason: otherTextField.value
          }
          const sendRequest = cancelFlowRequest(request);
        });

      } else if (reason == "Already have enough stock") {
        cancellationReasonsDiv.style.display = "none";
        otherReasonCancel.style.display = "none";
        changeBillDateModal.style.display = "block";

        let minDate = new Date();
        const nextBillDateStorage = sessionStorage.getItem("next-bill-date")

        const fp = flatpickr(".modal-date", {
          defaultDate: nextBillDateStorage,
          dateFormat: "m-d-Y",
          minDate: minDate,
          inline: true

        });

        fp.config.onChange.push(function (dateStr) {
          let date = new Date(dateStr);
          const dateFormatted = (date.getUTCMonth() + 1).toString() + "/" + date.getUTCDate() + "/" + date.getUTCFullYear().toString();
          const nextBillDateStorage = sessionStorage.setItem("next-bill-date-changed", dateFormatted);
        });

        var updateBillDateModal = document.getElementById('updateBillDateModal');
        updateBillDateModal.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const nextBillDateStorage = sessionStorage.getItem("next-bill-date-changed");
          axios.post(`${url}webflow/subscriptions/update`, {
            nextBillDate: nextBillDateStorage,
          })
            .then((response) => {
              if (response.status = 200) {
                modal.style.display = 'none';
                cancellationReasonsDiv.style.display = "none";
                otherReasonCancel.style.display = "none";
                changeBillDateModal.style.display = "none";
                const successBanner = document.getElementById('successBanner').style.display = 'block';
                const successBannerMessage = document.getElementById('successBannerMessage');
                successBannerMessage.textContent = "Subscription Updated";
                const myTimeout = setTimeout(refreshPage, 5000);
              }
            })
            .catch((error) => {
              modal.style.display = 'none';
              cancellationReasonsDiv.style.display = "none";
              otherReasonCancel.style.display = "none";
              changeBillDateModal.style.display = "none";
              const errorBanner = document.getElementById('errorBanner').style.display = 'block';
              const errorMessageBanner = document.getElementById('errorBannerMessage');
              errorMessageBanner.textContent = error.response.data
            });

        });

        var noBillDataChange = document.getElementById('noBillDataChange');
        noBillDataChange.addEventListener('click', function (e) {
          modal.style.display = 'none';
          areYouSure.style.display = "none";
          cancellationReasonsDiv.style.display = "none";
          otherReasonCancel.style.display = "none";
          changeBillDateModal.style.display = "none";
          e.preventDefault();
          e.stopPropagation();
          const request = {
            purchaseId: purchaseId,
            reason: reason
          }
          const sendRequest = cancelFlowRequest(request);
        });

      } else {
        cancellationReasonsDiv.style.display = "none";
        areYouSure.style.display = "block";

        var cancel = document.getElementById('yesCancelBtn');
        cancel.addEventListener('click', function (e) {
          cancellationReasonsDiv.style.display = "none";
          otherReasonCancel.style.display = "none";
          areYouSure.style.display = "none";
          changeBillDateModal.style.display = "none";
          e.preventDefault();
          e.stopPropagation();
          const request = {
            purchaseId: purchaseId,
            reason: reason
          }
          const sendRequest = cancelFlowRequest(request);
        });

        var closeModal = document.getElementById('noCancelBtn');
        closeModal.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          modal.style.display = 'none';
          cancellationReasonsDiv.style.display = "none";
          otherReasonCancel.style.display = "none";
          areYouSure.style.display = "none";
          changeBillDateModal.style.display = "none";
        });
      }
    });

    const cancelFlowGoBack = document.getElementById("cancelFlowGoBack");

    cancelFlowGoBack.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      otherReasonCancel.style.display = "none";
      changeBillDateModal.style.display = "none";
      areYouSure.style.display = "none";
      cancellationReasonsDiv.style.display = "block";
    });

    const cancelFlowBillDateGoBack = document.getElementById("cancelFlowBillDateGoBack");

    cancelFlowBillDateGoBack.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      changeBillDateModal.style.display = "none";
      otherReasonCancel.style.display = "none";
      areYouSure.style.display = "none";
      cancellationReasonsDiv.style.display = "block";
    });

    modalClose.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      cancelSubscriptionFlow.style.display = "none";
      areYouSure.style.display = "none";
      modal.style.display = 'none';
    });

    cancelFlowModalClose.addEventListener("click", function (e) {
      e.preventDefault();
      modal.style.display = 'none';
      cancelSubscriptionFlow.style.display = "none";
      areYouSure.style.display = "none";
    });
  });
});

async function cancelFlowRequest(cancelPayload) {

  axios.post(`${url}webflow/subscriptions/cancel`, {
    purchaseId: cancelPayload.purchaseId,
    cancelReason: cancelPayload.reason
  })
    .then((response) => {
      if (response.status = 200) {
        modal.style.display = 'none';
        cancelSubscriptionFlow.style.display = "none";
        const successBanner = document.getElementById('successBanner').style.display = 'block';
        const successBannerMessage = document.getElementById('successBannerMessage');
        successBannerMessage.textContent = "Subscription Cancelled";;
        const subscriptionStatusBadge = document.getElementsByClassName('subscription-badge')[0];
        subscriptionStatusBadge.textContent = "Cancelled";
        subscriptionStatusBadge.style.backgroundColor = "#404168";
        var subscriptionCancel = document.getElementById('cancelSubscription').style.display = "none";
        const subscriptionStatusUpdate = document.getElementById('reactivateSubscription').style.display = "block";

        const myTimeout = setTimeout(refreshPage, 5000);

      }
    }).catch((error) => {
      const errorBanner = document.getElementById('errorBanner').style.display = 'block';
      const errorMessageBanner = document.getElementById('errorBannerMessage');
      errorMessageBanner.textContent = error.response.data
    });
}

var subscriptionReactivate = document.getElementById('reactivateSubscription');
const updateSubscriptions = document.getElementById("updateSubscriptions");

subscriptionReactivate.addEventListener("click", function (e) {
  e.preventDefault()

  modalAgree.textContent = 'Reactivate'
  modalTitle.textContent = 'Are you sure you want to reactivate the subscription!'

  updateSubscriptions.style.display = "flex";
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
          updateSubscriptions.style.dispaly = "none";

          modal.style.display = 'none';
          const successBanner = document.getElementById('successBanner').style.display = 'block';
          const successBannerMessage = document.getElementById('successBannerMessage');
          successBannerMessage.textContent = "Subscription Reactivated";;
          const subscriptionStatusBadge = document.getElementsByClassName('subscription-badge')[0];
          subscriptionStatusBadge.textContent = "Active";
          subscriptionStatusBadge.style.backgroundColor = "#ec008c";
          const subscriptionStatusUpdate = document.getElementById('reactivateSubscription').style.display = "none";
          var subscriptionCancel = document.getElementById('cancelSubscription').style.display = "block";
          const myTimeout = setTimeout(refreshPage, 5000);


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
    updateSubscriptions.style.dispaly = "none";
    modal.style.display = 'none';

  });

});
function refreshPage() {
  window.location.reload();
}

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
    modalTitle.textContent = 'Are you sure you want to update your subscription?'

    updateSubscriptions.style.display = "flex";
    modal.style.display = 'flex';

    const nextBillDate = sessionStorage.getItem("next-bill-date-form")
    const subscriptionQuantity = el.querySelector("[name=quantity]").value
    const price = document.getElementById('subscriptionPrice').textContent
    const product_id = document.getElementById('subscriptionsFreqDropdown').getAttribute("product_id");

    modalAgree.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      modalAgree.innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'

      axios.post(`${url}webflow/subscriptions/update`, {
        nextBillDate: nextBillDate,
        productQty: subscriptionQuantity,
        product_id: product_id,
        purchaseId: purchaseId,
        price: price
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
        });
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

    priceElement.textContent = `$${price.toFixed(2)}`
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
  cancelSubscriptionFlow.style.display = "none";
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