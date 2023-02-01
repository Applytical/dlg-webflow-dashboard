const customerEmail = sessionStorage.getItem("email");
axios.post(`${url}webflow/customer/`, {
  email: customerEmail
})
  .then((response) => {
    shippingAddress(response.data);
    billingAddress(response.data);
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

    if (confirm("Are you sure you want to update you Billing Address!")) {
      axios.post(`${url}webflow/customer/update`, {
        billingFirstName: billingFirstName.value,
        billingLastName: billingLastName.value,
        billingAddress1: billingAddress1.value,
        billingAddress2: billingAddress2.value,
        billingCity: billingCity.value,
        billingState: billingState.value,
        billingZipCode: billingZipCode.value,
        billingCountry: billingCountry.value,
      })
        .then((response) => {
          if (response.status == 200) {
            const successBanner = document.getElementById('successBanner').style.display = 'block';
            const successBannerMessage = document.getElementById('successBannerMessage');
            successBannerMessage.textContent = "Billing Address Updated";
          } else {
            const errorBanner = document.getElementById('errorBanner').style.display = 'block';
            const errorMessageBanner = document.getElementById('errorBannerMessage');
            errorMessageBanner.textContent = "Something Went Wrong"
          }

        }).catch((error) => {
          const errorBanner = document.getElementById('errorBanner').style.display = 'block';
          const errorMessageBanner = document.getElementById('errorBannerMessage');
          errorMessageBanner.textContent = error.response.data
        });
    }
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

    shippingAddressErrors.forEach(function (el) { el.style.display = 'none'; });


    if (confirm("Are you sure you want to update you Shipping Address!")) {
      axios.post(`${url}webflow/customer/update`, {
        shippingFirstName: shippingFirstName.value,
        shippingLastName: shippingLastName.value,
        billingAddress1: shippingAddress1.value,
        billingAddress2: shippingAddress2.value,
        shippingCity: shippingCity.value,
        shippingState: shippingState.value,
        shippingZipCode: shippingZipCode.value,
        shippingCountry: shippingCountry.value,
      })
        .then((response) => {
          if (response.status == 200) {
            const successBanner = document.getElementById('successBanner').style.display = 'block';
            const successBannerMessage = document.getElementById('successBannerMessage');
            successBannerMessage.textContent = "Shipping Address Updated";
          } else {
            const errorBanner = document.getElementById('errorBanner').style.display = 'block';
            const errorMessageBanner = document.getElementById('errorBannerMessage');
            errorMessageBanner.textContent = "Something Went Wrong"
          }

        }).catch((error) => {
          const errorBanner = document.getElementById('errorBanner').style.display = 'block';
          const errorMessageBanner = document.getElementById('errorBannerMessage');
          errorMessageBanner.textContent = error.response.data
        });
    }
  });
})

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
