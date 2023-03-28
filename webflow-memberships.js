const testingUrl = "https://9fae-80-6-132-186.ngrok.io";
const customerId = sessionStorage.getItem("customerId");
const customerEmail = sessionStorage.getItem("email");
const fetchMembership = (payload) => {
  const endpoint = payload.customerId ? '/webflow/memberships/id' : '/webflow/memberships/email';
  const key = payload.customerId ? 'customerId' : 'customerEmail';
  axios.post(`${testingUrl}${endpoint}`, {
    [key]: payload[key]
  })
    .then((response) => {
      if (response.status == 200) {
        ShowMemberships(response);
        const billdate = sessionStorage.setItem("next-bill-date", response.data.nextBillDate)
      }
    });
}

if (customerId) {
  fetchMembership({ customerId });
} else if (customerEmail) {
  fetchMembership({ customerEmail });
}

// Define a helper function that takes an id and returns the corresponding element with that id
const getElementById = (id) => document.getElementById(id);

// Get various elements from the DOM using their ids and the getElementById helper function
const membershipModal = getElementById("membershipModal"); // Get the membership modal element
const ChangeMembership = getElementById("ChangeMembership"); // Get the "Change Membership" button element
const cancelSubscriptionFlow = getElementById("cancelSubscriptionFlowBtn"); // Get the "Cancel Subscription" button element
const membershipModalClose = getElementById("membershipModalClose"); // Get the close button element of the membership
const modalAgree = getElementById("membershipModalAgree"); // Get the "Agree" button element of the membership modal
const modalCancel = getElementById("membershipModalCancel"); // Get the "Cancel" button element of the membership modal
let updateBillDateMembershipModal = getElementById("updateBillDateMembershipModal");

cancelSubscriptionFlow.addEventListener("click", async function (el) {
  const cancelFlowModalClose = document.getElementById("cancelFlowModalCancel");
  const modalClose = document.getElementById('closeModal');
  const cancellationReasonsDiv = document.getElementById("cancellationReasons");
  const areYouSure = document.getElementById("areYouSure");
  const otherReasonCancel = document.getElementById("otherReasonCancel");
  var changeBillDateModal = document.getElementById('changeBillDateModal');

  cancellationReasonsDiv.style.display = "block";
  otherReasonCancel.style.display = "none";

  membershipModal.style.display = 'flex';

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





async function ShowMemberships(response) {
  const modules = document.querySelectorAll("[data-product-id]");
  const memberShipId = response.data.membershipId;

  const createdAt = new Date(response.data.dateCreated).getTime();

  // Membership last updated
  const lastUpdated = new Date(response.data.dateUpdated).getTime();
  // Membership last updated + 24 Hours
  const lastUpdated24hours = new Date(response.data.dateUpdated).getTime() + (24 * 60 * 60 * 1000)

  modules.forEach(function (el) {

    const productId = el.getAttribute("data-product-id");

    const currentPlan = el.querySelectorAll(".membership-btn");
    let lessThan = false;
    if (createdAt == lastUpdated) { // if created date is equal to last updated date
      updateMembershipStatus(el, response, productId, memberShipId, currentPlan, lessThan);
    } else if (lastUpdated24hours < lastUpdated) {
      lessThan = true;
      updateMembershipStatus(el, response, productId, memberShipId, currentPlan, lessThan);
    } else if (lastUpdated24hours > lastUpdated) { // If lastUpdated time is more than 24 hours ago
      updateMembershipStatus(el, response, productId, memberShipId, currentPlan, lessThan);
    }
  });

  const loading = document.getElementById("membershipsLoading").style.display = "none";
  const dashboard = document.getElementById("membershipsDiv").style.display = "block";
}

function updateMembershipStatus(el, response, productId, memberShipId, currentPlan, lessThan) {
  if (productId == memberShipId) {
    // If product ID matches the membership ID
    console.log(productId);
    console.log("Active Plan");

    // Add "featured" class to the element
    el.classList.add("featured");
    el.dataset.PurchaseId = response.data.purchaseId;

    // Update current plan text and style
    currentPlan.forEach(function (el) {
      el.textContent = "Active Plan";
      el.classList.remove("btn-secondary");
      el.classList.add("btn-primary");
    });

    if (memberShipId == 278) {
      // if membership id is equal to 278
      const showNextBillDate = document.getElementById("updateNextBillDate");
      showNextBillDate.style.display = "block";

      // display the "updateNextBillDate" element
      var updateBillDateModal = document.getElementById('updateBillDateModal');
      showNextBillDate.addEventListener('click', function (e) {
        showNextBillDateModal(e)
      });
    }

  } else {
    // If product ID doesn't match the membership ID
    console.log(productId);
    console.log("Possible Upgrade");

    // Update current plan button style
    currentPlan.forEach(function (el) {
      el.classList.remove("btn-primary");
      el.classList.add("btn-secondary");

      // Disable click event for the button
      if (lessThan == true) {
        el.style.pointerEvents = "none";
      } else {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          console.log("You Clicked " + productId);
          showModal(productId);
        });
      }
    });
  }
}
function showModal(productId) {
  membershipModal.style.display = 'flex';
  ChangeMembership.style.display = 'flex';

  const monthlyId = 278;
  const lifetimeId = 101;
  const annualId = 276;

  let subscriptionModalTitle = ChangeMembership.querySelector("#subscriptionModalTitle");

  const currentPlan = document.querySelector(".featured");
  const currentPlanProductId = currentPlan.getAttribute("data-product-id");
  const purchaseId = currentPlan.getAttribute("data--purchase-id");

  // Monthly to Annual
  if (productId == annualId && currentPlanProductId == monthlyId) {

    subscriptionModalTitle.textContent = "Are You Sure You Want to Upgrade Your Monthly To Annual Membership"

  } else if (productId == lifetimeId && currentPlanProductId == monthlyId) {
    subscriptionModalTitle.textContent = "Are You Sure You Want to Upgrade Your Monthly To Lifetime Membership"
  }

  const modalAgree = document.getElementById("membershipModalAgree");
  modalAgree.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    axios.post(`${testingUrl}/webflow/memberships/upgrade`, {
      productId: productId,
      originalProductId: currentPlanProductId,
      purchaseId: purchaseId
    }).then((response) => {
      console.log(response);

    }).catch((error) => {
      console.log(error);
    });
  });
}

function showNextBillDateModal(e) {
  console.log(e);

  membershipModal.style.display = 'flex';

  updateBillDateMembershipModal.style.display = 'flex';

  let minDate = new Date();
  let maxDate = new Date(minDate.getMonth() + 1);
  const nextBillDateStorage = sessionStorage.getItem("next-bill-date")
  const date = new Date(nextBillDateStorage);

  const fp = flatpickr(".modal-date-membership", {
    defaultDate: date,
    dateFormat: "m-d-Y",
    minDate: minDate,
    maxDate: new Date().fp_incr(30),
    inline: true

  });

  fp.config.onChange.push(function (dateStr) {
    let date = new Date(dateStr);
    const dateFormatted = (date.getUTCMonth() + 1).toString() + "/" + date.getUTCDate() + "/" +
      date.getUTCFullYear().toString();
    const nextBillDateStorage = sessionStorage.setItem("next-bill-date-changed", dateFormatted);
  });

  var updateBillDateModal = document.getElementById('updateBillDateModal');
  updateBillDateModal.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const nextBillDateStorage = sessionStorage.getItem("next-bill-date-changed");
    axios.post(`${url}/webflow/subscriptions/update`, {
      nextBillDate: nextBillDateStorage,
    })
      .then((response) => {
        if (response.status == 200) {
          membershipModal.style.display = 'none';
          updateBillDateModal.style.display = "none";
          const successBanner = document.getElementById('successBanner').style.display = 'block';
          const successBannerMessage = document.getElementById('successBannerMessage');
          successBannerMessage.textContent = "Subscription Updated";
          setTimeout(() => {
            const successBanner = document.getElementById('successBanner').style.display = 'none';
          }, 3000);
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
        errorMessageBanner.textContent = error.response.data;
        setTimeout(() => {
          const errorBanner = document.getElementById('errorBanner').style.display = 'none';
        }, 3000);
      });

  });

  var noBillDataChange = document.getElementById('noBillDataChange');
  noBillDataChange.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    membershipModal.style.display = 'none';
    ChangeMembership.style.display = 'none';
  });
}


window.onclick = function (event) {
  if (event.target == membershipModal) {
    membershipModal.style.display = 'none';
    ChangeMembership.style.display = 'none';
    cancelSubscriptionFlow.style.display = "none";
  }
}

modalCancel.addEventListener("click", function (e) {
  e.preventDefault();
  membershipModal.style.display = 'none';
  ChangeMembership.style.display = 'none';
  membershipModal.style.display = 'none';
  updateBillDateMembershipModal.style.display = 'none';
});