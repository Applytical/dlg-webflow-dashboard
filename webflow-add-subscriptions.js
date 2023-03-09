const modal = document.getElementById("addSubscriptionModal");
const modalContent = document.getElementById("addSubscriptionModalContent");
const closeModal = document.getElementById('modalClose');
const modalAgree = document.getElementById("addSubscriptionModalAgree");
const modalCancel = document.getElementById("addSubscriptionModalCancel");

axios.get(`${url}/webflow/products/all`)
  .then((response) => {
    showAllProducts(response.data)
  })
  .catch((error) => {
    console.log(error);
  });

function showAllProducts(products) {

  const cardContainer = document.getElementById("Product-Cards-Container")

  products.forEach(product => {
    const style = document.getElementById('productCardStyle');
    // Copy the card and it's style
    const card = style.cloneNode(true)

    const NoSubscriptions = document.getElementById('noSubscriptions')
    card.setAttribute('id', '');
    card.style.display = 'block';


    const addProductImage = card.getElementsByClassName('add-product-image')[0];
    addProductImage.src = product.img_url;
    addProductImage.addEventListener("error", function (event) {
      event.target.src = "https://cdn.shopify.com/s/files/1/0005/0947/6927/files/Livingood_Daily_Logo_Triangle.png?v=1613689543";
      event.onerror = null;
    })

    const addProductName = card.getElementsByClassName('add-product-name')[0];
    addProductName.textContent = product.base_product_name;

    const addProductPrice = card.getElementsByClassName('add-product-price')[0];
    addProductPrice.textContent = `$${product.price}`;


    const freqWrapper = card.querySelector('.freqwrapper');
    const freqSelect = freqWrapper.querySelector('.dropdown-input');

    freqSelect.setAttribute('product_id', product.base_product_id);
    freqSelect.setAttribute('variant_id', product.variants[0].variant_id);

    // Create an option element for each variant
    product.variants.forEach(variant => {
      const option = document.createElement('option');
      option.value = variant.variant_id;
      option.textContent = variant.variant_name;
      freqSelect.appendChild(option);
    });

    freqSelect.addEventListener('change', function () {

      // Loop through all the options and remove the selected attribute
      for (let i = 0; i < freqSelect.options.length; i++) {
        freqSelect.options[i].removeAttribute("selected");
      }

      // Set the selected attribute to the current option
      freqSelect.setAttribute('variant_id', this.value);
      freqSelect.options[select.selectedIndex].setAttribute('selected', true);

    });

    const createSubscriptionForm = card.querySelector('[data-create-subscription-form]');
    const createSubscriptionError = card.querySelector('[data-create-subscription-error]');
    const createSubscriptionLoading = card.querySelector('[data-create-subscription-loading]');
    const createSubscriptionIdle = card.querySelector('[data-create-subscription-idle]');

    createSubscriptionForm.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const freqWrapper = card.querySelector('.freqwrapper');
      const freqSelect = freqWrapper.querySelector('.dropdown-input');
      const variant_id = freqSelect.getAttribute("variant_id");
      const product_id = freqSelect.getAttribute("product_id");
      const customerId = sessionStorage.getItem("customerId");


      axios.post(`${url}/webflow/subscriptions/create`, {
        variant_id: variant_id,
        product_id: product_id,
        customerId: customerId,
      })
        .then((response) => {
          if (response.status == 200) {
            showAddProduct(response);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
    // Place the card into the div "Cards-Container"
    cardContainer.appendChild(card);
  });

  async function showAddProduct(response) {
    console.log(response);
    modal.style.display = "flex";
    const productName = document.getElementsByClassName('modal-product-name')[0];
    productName.textContent = response.data.product_name;

    const productId = document.getElementById('productName').setAttribute("data-product_id", response.data.product_id);

    const price = document.getElementById('modalProductPrice');
    price.textContent = `$${response.data.price}`
    price.setAttribute("data-price", response.data.price);


    const subscriptionProductImage = document.getElementsByClassName('modal-product-image')[0];
    subscriptionProductImage.src = response.data.img_url;
    subscriptionProductImage.srcset = response.data.img_url;
    subscriptionProductImage.addEventListener("error", function (event) {
      event.target.src = "https://cdn.shopify.com/s/files/1/0005/0947/6927/files/dashboard.jpg?v=1676298620";
      event.target.srcset = "https://cdn.shopify.com/s/files/1/0005/0947/6927/files/dashboard.jpg?v=1676298620";
      event.onerror = null;
    })


    let nextBillDate = new Date();
    let nextBillDateFormatted = (nextBillDate.getUTCMonth() + 1).toString() + "/" + nextBillDate.getUTCDate() + "/" + nextBillDate.getUTCFullYear().toString();
    const nextBillDateStorage = sessionStorage.setItem("next-bill-date", nextBillDateFormatted)
    const fp = flatpickr(".date", {
      defaultDate: nextBillDateFormatted,
      dateFormat: "m-d-Y",
      minDate: nextBillDateFormatted,

    });

    fp.config.onChange.push(function (dateStr) {
      let date = new Date(dateStr);
      const dateFormatted = (date.getUTCMonth() + 1).toString() + "/" + date.getUTCDate() + "/" + date.getUTCFullYear().toString();
      const nextBillDateStorageForm = sessionStorage.setItem("next-bill-date-form", dateFormatted)

    });
    const quantityControl = document.querySelectorAll("[data-quantity-control]");

    quantityControl.forEach(function (el) {
      let quantityElement = el.querySelector("[name=quantity]");
      quantityElement.readOnly = true;
      quantityElement.value = 1;
      quantityElement.setAttribute("data-initial-qty", 1);
      quantityElement.min = 1;
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

        const priceElement = document.getElementById('modalProductPrice');
        let price = quantityElement.value * Number(priceElement.dataset.price);

        priceElement.textContent = `$${price.toFixed(2)}`
        priceElement.setAttribute("data-updated-price", price.toFixed(2));

      });
    });

    const addProductForm = document.querySelectorAll('[data-add-product-form]');
    const addProductFormErrors = document.querySelectorAll('[data-add-product-error]');

    addProductForm.forEach(function (el) {
      let quantityElement = el.querySelector("[name=quantity]");
      var priceElement = document.getElementById('modalProductPrice')
      const nextBillDate = sessionStorage.getItem("next-bill-date-form")

      el.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();
        addProductFormErrors.forEach(function (el) { el.style.display = 'none'; });

        axios.post(`${url}/webflow/subscriptions/new/update`, {
          productQty: quantityElement.value,
          price: priceElement.dataset.price,
          nextBillDate: nextBillDate,
          purchaseId: response.data.purchaseId  
        })
          .then((response) => {
            if (response.status == 200) {
              modal.style.display = 'none';
              const successBanner = document.getElementById('successBanner').style.display = 'block';
              const successBannerMessage = document.getElementById('successBannerMessage');
              successBannerMessage.textContent = "Subscription Created";
              setTimeout(function () {
                window.location.href = "/account/subscriptions";
              }, 2000);
            }

          }).catch((error) => {
            const errorBanner = document.getElementById('errorBanner').style.display = 'block';
            const errorMessageBanner = document.getElementById('errorBannerMessage');
            errorMessageBanner.textContent = error.response.data
          });
      });
    });

    modalCancel.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
  
      modal.style.display = 'none';

      axios.post(`${url}/webflow/subscriptions/order/cancel`, {
        orderId: response.data.orderId  
      })
        .then((response) => {
       
        }).catch((error) => {
          console.log(error);
        });
  
    });
    
    closeModal.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      modal.style.display = 'none';
      axios.post(`${url}/webflow/subscriptions/order/cancel`, {
        orderId: response.data.orderId  
      })
        .then((response) => {
       
        }).catch((error) => {
          console.log(error);
        });
    });
  };



  // window.onclick = function (event) {
  //   if (event.target == modal) {
  //     modal.style.display = "none";
  //   }
  // }

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
}