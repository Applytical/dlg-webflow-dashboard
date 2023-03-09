const customerEmail = sessionStorage.getItem("email");
const customerId = sessionStorage.getItem("customerId");
axios.post(`${url}/webflow/customer/`, {
  email: customerEmail
})
  .then((response) => {
    shippingAddress(response.data);
    billingAddress(response.data);
    card(response.data);
  });

async function shippingAddress(customer) {

  const shipFirstName = document.getElementById('shipFirstName');
  shipFirstName.value = customer.shipFirstName;

  const shipLastName = document.getElementById('shipLastName');
  shipLastName.value = customer.shipLastName;

  const shipAddress1 = document.getElementById('shipAddress1');
  shipAddress1.value = customer.shipAddress1;

  if (customer.shipAddress2 !== null) {
    const shipAddress2 = document.getElementById('shipAddress2');
    shipAddress2.value = customer.shipAddress2;
  }
  const shipCity = document.getElementById('shipCity');
  shipCity.value = customer.shipCity;

  const shipPostalCode = document.getElementById('shipPostalCode');
  shipPostalCode.value = customer.shipPostalCode;

  const shipState = document.getElementById('shipState');
  shipState.value = customer.shipState;

  const shipCountry = document.getElementById('shipCountry');
  shipCountry.value = customer.shipCountry;
  shipCountry.readOnly = true

}

async function billingAddress(customer) {

  const billFirstName = document.getElementById('billFirstName');
  billFirstName.value = customer.firstName;

  const billLastName = document.getElementById('billLastName');
  billLastName.value = customer.lastName;

  const billAddress1 = document.getElementById('billAddress1');
  billAddress1.value = customer.address1;

  if (customer.shipAddress2 !== null) {
    const billAddress2 = document.getElementById('billAddress2');
    billAddress2.value = customer.address2;
  }
  const billCity = document.getElementById('billCity');
  billCity.value = customer.city;

  const billPostalCode = document.getElementById('billPostalCode');
  billPostalCode.value = customer.postalCode;

  const billState = document.getElementById('billState');
  billState.value = customer.state;

  const billCountry = document.getElementById('billCountry');
  billCountry.value = customer.country;
  billCountry.readOnly = true

}
async function card(customer) {

  const last4 = document.getElementById('cardLast4');
  last4.textContent = `Card Ending in: ••••${customer.cardLast4}`;

  const cardExpiry = document.getElementById('cardExpiry');
  let date = new Date(customer.cardExpiryDate);
  const dateFormatted = (date.getUTCMonth() + 1).toString() + "/" + date.getUTCFullYear().toString();
  cardExpiry.textContent = `Card Expiry: ${dateFormatted}`;


}



const modal = document.getElementById("subscriptionModalSettings");
const modalContent = document.getElementById("subscriptionModalContent");
const subscriptionModelMessage = document.getElementById("subscriptionModelMessage");
const closeModal = document.getElementById('modalClose');
const modalAgree = document.getElementById("subscriptionModalAgree");
const modalCancel = document.getElementById("subscriptionModalCancel");
const modalTitle = document.getElementById("subscriptionModalTitle");


const billingAddressForm = document.querySelectorAll('[data-billing-address-form]');
const billingAddressErrors = document.querySelectorAll('[data-billing-address-error]');


billingAddressForm.forEach(function (el) {
  const billingFirstName = el.querySelector('[data-billing-firstName]');
  const billingLastName = el.querySelector('[data-billing-lastName]');
  const billingAddress1 = el.querySelector('[data-billing-address1]');
  const billingAddress2 = el.querySelector('[data-billing-address2]');
  const billingCity = el.querySelector('[data-billing-city]');
  const billingState = el.querySelector('[data-billing-state]');
  const billingZipCode = el.querySelector('[data-billing-zip]');
  const billingCountry = el.querySelector('[data-billing-country]');

  el.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    billingAddressErrors.forEach(function (el) { el.style.display = 'none'; });
    modalAgree.textContent = 'Update'
    modalTitle.textContent = 'Are you sure you want to update billing address?'
    subscriptionModelMessage.textContent = "Updating this billing address will update the billing address of all active subscriptions.";

    modal.style.display = 'flex';
    modalAgree.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      modalAgree.innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'

      axios.post(`${url}/webflow/customer/update`, {
        billingFirstName: billingFirstName.value,
        billingLastName: billingLastName.value,
        billingAddress1: billingAddress1.value,
        billingAddress2: billingAddress2.value,
        billingCity: billingCity.value,
        billingState: billingState.value,
        billingZipCode: billingZipCode.value,
        billingCountry: billingCountry.value,
        customerId: customerId
      })
        .then((response) => {
          if (response.status == 200) {
            const successBanner = document.getElementById('successBanner').style.display = 'block';
            const successBannerMessage = document.getElementById('successBannerMessage');
            successBannerMessage.textContent = "Billing Address Updated";
            modal.style.display = "none";
            setTimeout(() => {
              const successBanner = document.getElementById('successBanner');
              successBanner.style.display = 'none';
            }, 3000);
          } else {
            const errorBanner = document.getElementById('errorBanner').style.display = 'block';
            const errorMessageBanner = document.getElementById('errorBannerMessage');
            errorMessageBanner.textContent = "Something Went Wrong"
            modal.style.display = "none";
            setTimeout(() => {
              const errorBanner = document.getElementById('errorBanner');
              errorBanner.style.display = 'none';
            }, 3000);
          }

        }).catch((error) => {
          const errorBanner = document.getElementById('errorBanner').style.display = 'block';
          const errorMessageBanner = document.getElementById('errorBannerMessage');
          errorMessageBanner.textContent = error.response.data
          modal.style.display = "none";
          setTimeout(() => {
            const errorBanner = document.getElementById('errorBanner');
            errorBanner.style.display = 'none';
          }, 3000);
        });
    });

    modalCancel.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      modal.style.display = 'none';

    });
  });
})



const shippingAddressForm = document.querySelectorAll('[data-shipping-address-form]');
const shippingAddressErrors = document.querySelectorAll('[data-shipping-address-error]');


shippingAddressForm.forEach(function (el) {
  const shippingFirstName = el.querySelector('[data-shipping-firstName]');
  const shippingLastName = el.querySelector('[data-shipping-lastName]');
  const shippingAddress1 = el.querySelector('[data-shipping-address1]');
  const shippingAddress2 = el.querySelector('[data-shipping-address2]');
  const shippingCity = el.querySelector('[data-shipping-city]');

  const shippingState = el.querySelector('[data-shipping-state]');
  const shippingZipCode = el.querySelector('[data-shipping-zip]');
  const shippingCountry = el.querySelector('[data-shipping-country]');

  el.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    modalAgree.textContent = 'Update'
    modalTitle.textContent = 'Are you sure you want to update shipping address?'
    subscriptionModelMessage.textContent = "Updating this shipping address will update the shipping address of all active subscriptions.";


    modal.style.display = 'flex';

    shippingAddressErrors.forEach(function (el) { el.style.display = 'none'; });
    modalAgree.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();


      axios.post(`${url}webflow/customer/update`, {
        shippingFirstName: shippingFirstName.value,
        shippingLastName: shippingLastName.value,
        shippingAddress1: shippingAddress1.value,
        shippingAddress2: shippingAddress2.value,
        shippingCity: shippingCity.value,
        shippingState: shippingState.value,
        shippingZipCode: shippingZipCode.value,
        shippingCountry: shippingCountry.value,
        customerId: customerId
      })
        .then((response) => {
          if (response.status == 200) {
            const successBanner = document.getElementById('successBanner').style.display = 'block';
            const successBannerMessage = document.getElementById('successBannerMessage');
            successBannerMessage.textContent = "Shipping Address Updated";
            modal.style.display = "none"
            setTimeout(() => {
              const successBanner = document.getElementById('successBanner');
              successBanner.style.display = 'none';
            }, 3000);
          } else {
            const errorBanner = document.getElementById('errorBanner').style.display = 'block';
            const errorMessageBanner = document.getElementById('errorBannerMessage');
            errorMessageBanner.textContent = "Something Went Wrong";
            modal.style.display = "none";
            setTimeout(() => {
              const errorBanner = document.getElementById('errorBanner');
              errorBanner.style.display = 'none';
            }, 3000);
          }

        }).catch((error) => {
          const errorBanner = document.getElementById('errorBanner').style.display = 'block';
          const errorMessageBanner = document.getElementById('errorBannerMessage');
          errorMessageBanner.textContent = error.response.data
          modal.style.display = "none";
          setTimeout(() => {
            const errorBanner = document.getElementById('errorBanner');
            errorBanner.style.display = 'none';
          }, 3000);
        });
    });

    modalCancel.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      modal.style.display = 'none';

    });
  });
})

var changeCardDetails = document.getElementById('changeCardDetails');

changeCardDetails.addEventListener("click", function (e) {
  e.preventDefault()

  const refreshPage = document.getElementById('refreshPage')
  const refreshPageDiv = document.getElementById('refreshPageDiv').style.display = "block";
  refreshPage.addEventListener('click', function (e) {

    window.location.reload();

  });
  const orderId = sessionStorage.getItem("orderId");
  if (!orderId) {
    axios.post(`${url}webflow/customer/getId`, {
      customerId: customerId
    })
      .then((response) => {
        const orderId = sessionStorage.setItem("orderId", response.data);
        window.open(`${cardUrl}?emailAddress=${customerEmail}&orderId=${response.data}`);

      }).catch((error) => {
        const errorBanner = document.getElementById('errorBanner').style.display = 'block';
        const errorMessageBanner = document.getElementById('errorBannerMessage');
        errorMessageBanner.textContent = error.response.data;
        setTimeout(() => {
          const errorBanner = document.getElementById('errorBanner');
          errorBanner.style.display = 'none';
        }, 3000);
      });
  } else {
    window.open(`${cardUrl}?emailAddress=${customerEmail}&orderId=${orderId}`);

  }
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

closeModal.addEventListener("click", function (e) {
  e.preventDefault();
  modal.style.display = 'none';
});
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}