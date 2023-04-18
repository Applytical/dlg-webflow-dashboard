const testingUrl = "https://9fae-80-6-132-186.ngrok.io";
const customerId = sessionStorage.getItem("customerId");
const customerEmail = sessionStorage.getItem("email");
const shopifyTags = sessionStorage.getItem("shopifyTags");
let found = false;

const search = "Livingood Daily Lifestyle";
const arr = shopifyTags.split(", ");

const fetchMembership = (payload) => {
  const endpoint = payload.customerId ? '/webflow/memberships/id' : '/webflow/memberships/email';
  const key = payload.customerId ? 'customerId' : 'customerEmail';
  axios.post(`${testingUrl}${endpoint}`, {
    [key]: payload[key]
  })
    .then((response) => {
      if (response.status == 200) {
        ShowMemberships(response);
        sessionStorage.setItem("next-bill-date", response.data.nextBillDate);
      }
    });
}

for (let i = 0; i < arr.length; i++) {
  if (arr[i].includes(search)) {
    found = true;
    showLifeTimeCard();
    break;
  }
}

if (!found) {
  if (customerId) {
    fetchMembership({ customerId });
  } else if (customerEmail) {
    fetchMembership({ customerEmail });
  }
}

async function showLifeTimeCard() {
  const hideActions = document.querySelector(".membership-actions").style.display = "none";
  const modules = document.querySelectorAll("[data-product-id]");

  modules.forEach(function (el) {

    const productId = el.getAttribute("data-product-id");

    const currentPlan = el.querySelectorAll(".membership-btn");

    if (productId == 101) {

      // Add "featured" class to the element
      el.classList.add("featured");

      // Update current plan text and style
      currentPlan.forEach(function (el) {
        el.textContent = "Active Plan";
        el.classList.remove("btn-secondary");
        el.classList.add("btn-primary");
      });
    } else {
      // Update current plan button style
      currentPlan.forEach(function (el) {
        el.classList.remove("btn-primary");
        el.classList.add("btn-lifetime");

        // Disable click event for the button
        el.style.pointerEvents = "none";

      });
    }
    const dashboard = document.getElementById("membershipsDiv").style.display = "block";
    const membershipCards = document.querySelector(".membership-cards");
    membershipCards.style.display = "block";
    const loading = document.getElementById("membershipsLoading").style.display = "none";
  });

}

// Define a helper function that takes an id and returns the corresponding element with that id
const getElementById = (id) => document.getElementById(id);

// Get various elements from the DOM using their ids and the getElementById helper function
const membershipModal = getElementById("membershipModal"); // Get the membership modal element
const ChangeMembership = getElementById("ChangeMembership"); // Get the "Change Membership" button element
const cancelMembershipFlowBtn = getElementById("cancelMembershipFlowBtn"); // Get the "Cancel Membership" button element
const cancelMembershipFlow = getElementById("cancelMembershipFlow");
const membershipModalClose = getElementById("membershipModalClose"); // Get the close button element of the membership
const modalAgree = getElementById("membershipModalAgree"); // Get the "Agree" button element of the membership modal
const modalCancel = getElementById("membershipModalCancel"); // Get the "Cancel" button element of the membership modal
let updateBillDateMembershipModal = getElementById("updateBillDateMembershipModal");

cancelMembershipFlowBtn.addEventListener("click", async function (e) {
  const cancelFlowModalClose = getElementById("cancelFlowModalCancel");
  const modalClose = getElementById('closeModal');
  const cancellationReasonsDiv = getElementById("cancellationReasons");
  const areYouSure = getElementById("areYouSure");
  const otherReasonCancel = getElementById("otherReasonCancel");
  var changeBillDateModal = getElementById('changeBillDateModal');
  membershipModal.style.display = 'flex';
  cancellationReasonsDiv.style.display = "block";
  cancelMembershipFlow.style.display = 'block';
  const currentPlan = document.querySelector(".featured");
  const purchaseId = currentPlan.getAttribute("data--purchase-id");

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

        var otherReasonSubmit = getElementById('otherReasonBtn');
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
          membershipModal.style.display = 'none';
          cancellationReasonsDiv.style.display = "none";
          otherReasonCancel.style.display = "none";
          areYouSure.style.display = "none";
          changeBillDateModal.style.display = "none";
        });
      }
    });


    membershipModalClose.addEventListener("click", (e) => {
      e.preventDefault();
      membershipModal.style.display = 'none';
      ChangeMembership.style.display = 'none';
      updateBillDateMembershipModal.style.display = 'none';
    });


    const cancelFlowGoBack = document.getElementById("cancelFlowGoBack");
    const cancelFlowBillDateGoBack = document.getElementById("cancelFlowBillDateGoBack");

    [cancelFlowGoBack, cancelFlowBillDateGoBack].forEach((element) => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        otherReasonCancel.style.display = "none";
        changeBillDateModal.style.display = "none";
        areYouSure.style.display = "none";
        cancellationReasonsDiv.style.display = "block";
      });
    });

    [modalClose, cancelFlowModalClose].forEach((element) => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        membershipModal.style.display = 'none';
        cancelMembershipFlow.style.display = "none";
        areYouSure.style.display = "none";
      });
    });
  });
});

async function cancelFlowRequest(cancelPayload) {

  axios.post(`${testingUrl}/webflow/subscriptions/cancel`, {
    purchaseId: cancelPayload.purchaseId,
    cancelReason: cancelPayload.reason
  })
    .then((response) => {
      if (response.status == 200) {
        membershipModal.style.display = 'none';
        cancelSubscriptionFlow.style.display = "none";
      }
    }).catch((error) => {
      console.log(error)
      setTimeout(() => {
        errorBanner.style.display = 'none';
      }, 3000);
    });
}


async function ShowMemberships(response) {
  const modules = document.querySelectorAll("[data-product-id]");
  const memberShipId = response.data.membershipId;

  const createdAt = new Date(response.data.dateCreated).getTime();
  const addCreatedAt = sessionStorage.setItem("Membership Created At", createdAt);

  // Membership last updated
  const lastUpdated = new Date(response.data.dateUpdated).getTime();
  const addLastUpdated = sessionStorage.setItem("Membership Last Updated At", lastUpdated);
  // Membership last updated + 24 Hours
  const lastUpdated24hours = new Date(response.data.dateUpdated).getTime() + (24 * 60 * 60 * 1000);

  if (response.data.status === "ACTIVE") {

    modules.forEach(function (el) {

      const productId = el.getAttribute("data-product-id");

      const currentPlan = el.querySelectorAll(".membership-btn");
      let lessThan = false;
      if (createdAt == lastUpdated) { // if created date is equal to last updated date
        updateMembershipStatus(el, response, productId, memberShipId, currentPlan, lessThan);
      } else if (lastUpdated < lastUpdated24hours) {
        // lessThan = true; // CHANGE BACK WHEN TESTING 24 HOURS
        updateMembershipStatus(el, response, productId, memberShipId, currentPlan, lessThan);
      } else if (lastUpdated > lastUpdated24hours) { // If lastUpdated time is more than 24 hours ago
        updateMembershipStatus(el, response, productId, memberShipId, currentPlan, lessThan);
      }
    });

    const loading = document.getElementById("membershipsLoading").style.display = "none";
    const membershipCards = document.querySelector(".membership-cards");
    membershipCards.style.display = "block";

  } else {
    const loading = document.getElementById("membershipsLoading").style.display = "none";
    const subscriptionStatus = document.querySelector(".membership-cancelled");
    subscriptionStatus.style.display = "block";

  }

  const dashboard = document.getElementById("membershipsDiv").style.display = "block";
}

function updateMembershipStatus(el, response, productId, memberShipId, currentPlan, lessThan) {
  if (lessThan === true) {
    const lastUpdatedlessthan24 = document.querySelector(".membership-24-hour-check");
    lastUpdatedlessthan24.style.display = "block";
  }

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

    if (lessThan !== true) {
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
      if (lessThan === true) {
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

  const upgradeTypeMap = {
    MonthlyToAnnual: "Are You Sure You Want to Upgrade Your Monthly To Annual Membership",
    AnnualToMonthly: "Are You Sure You Want to Downgrade Your Annual To Monthly Membership",
    MonthlyToLifestyle: "Are You Sure You Want to Upgrade Your Monthly To Lifetime Membership",
    AnnualToLifestyle: "Are You Sure You Want to Upgrade Your Annual To Lifetime Membership",
  };

  let upgradeType = null;

  if (productId == annualId && currentPlanProductId == monthlyId) {
    upgradeType = 'MonthlyToAnnual';
  } else if (productId == lifetimeId && currentPlanProductId == monthlyId) {
    upgradeType = 'MonthlyToLifestyle';
  } else if (productId == lifetimeId && currentPlanProductId == annualId) {
    upgradeType = 'AnnualToLifestyle';
  } else if (productId == monthlyId && currentPlanProductId == annualId) {
    upgradeType = 'AnnualToMonthly';

  subscriptionModalTitle.textContent = upgradeTypeMap[upgradeType];

  const modalAgree = document.getElementById("membershipModalAgree");
  modalAgree.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const customerId = sessionStorage.getItem("customerId");
    const endpoint = `${testingUrl}/webflow/memberships/${upgradeType === 'AnnualToMonthly' ? 'downgrade' : 'upgrade'}`;

    axios.post(endpoint, {
      productId: productId,
      originalProductId: currentPlanProductId,
      purchaseId: purchaseId,
      upgradeType: upgradeType,
      customerId: customerId,
    }).then((response) => {
      membershipModal.style.display = 'none';
      ChangeMembership.style.display = 'none';
      updateBillDateMembershipModal.style.display = 'none';
      const successBanner = document.getElementById('successBanner').style.display = 'block';
      const successBannerMessage = document.getElementById('successBannerMessage');
      successBannerMessage.textContent = "Membership Updated";
      setTimeout(() => {
        const successBanner = document.getElementById('successBanner').style.display = 'none';
        window.location.reload();
      }, 3000);
    }).catch((error) => {
      if (error.response.data == "Cannot force billing on a subscription twice within 24 hours") {
        const lastUpdatedlessthan24 = document.querySelector(".membership-24-hour-check");
        lastUpdatedlessthan24.style.display = "block";
        membershipModal.style.display = 'none';
        ChangeMembership.style.display = 'none';
        updateBillDateMembershipModal.style.display = 'none';
        setTimeout(function () { window.location.reload(); }, 3000);
      }

    });

  });
}

function showNextBillDateModal(e) {

  membershipModal.style.display = 'flex';

  updateBillDateMembershipModal.style.display = 'flex';

  const currentPlan = document.querySelector(".featured");
  const purchaseId = currentPlan.getAttribute("data--purchase-id");

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

  const updateBillDateModal = document.getElementById('updateBillDateModal');
  updateBillDateModal.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const nextBillDateStorage = sessionStorage.getItem("next-bill-date-changed");
    axios.post(`${testingUrl}/webflow/memberships/update/date`, {
      nextBillDate: nextBillDateStorage,
      purchaseId: purchaseId,
    })
      .then((response) => {
        if (response.status == 200) {
          updateBillDateMembershipModal.style.display = "none";
          membershipModal.style.display = "none";
          const successBanner = document.getElementById('successBanner');
          successBanner.style.display = 'block';
          const successBannerMessage = document.getElementById('successBannerMessage');
          successBannerMessage.textContent = "Membership Updated";
          setTimeout(() => {
            successBanner.style.display = 'none';
          }, 3000);
        }
      })
      .catch((error) => {
        updateBillDateMembershipModal.style.display = "none";
        membershipModal.style.display = "none";
        const errorBanner = document.getElementById('errorBanner');
        errorBanner.style.display = 'block';
        const errorMessageBanner = document.getElementById('errorBannerMessage');
        errorMessageBanner.textContent = error.response.data;
        setTimeout(() => {
          errorBanner.style.display = 'none';
        }, 3000);
      });
  });

  var noBillDataChange = document.getElementById('noBillDataChange');
  noBillDataChange.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    membershipModal.style.display = 'none';
    updateBillDateMembershipModal.style.display = 'none';
  });
  const closeNextBilldDateModal = document.getElementById("nextBillDateModalClose");
  closeNextBilldDateModal.addEventListener("click", (e) => {
    e.preventDefault();
    membershipModal.style.display = 'none';
    updateBillDateMembershipModal.style.display = 'none';
  });
}

window.onclick = (event) => {
  if (event.target == membershipModal) {
    membershipModal.style.display = 'none';
    ChangeMembership.style.display = 'none';
    cancelMembershipFlow.style.display = "none";
    updateBillDateMembershipModal.style.display = "none";
  }
}

modalCancel.addEventListener("click", (e) => {
  e.preventDefault();
  membershipModal.style.display = 'none';
  ChangeMembership.style.display = 'none';
  updateBillDateMembershipModal.style.display = 'none';
});