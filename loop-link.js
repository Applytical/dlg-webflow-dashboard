const LoopLink = document.querySelectorAll("#LoopLink");
  LoopLink.forEach(function (el) {
	el.addEventListener('click', function (e) {
		const shopifyCustomerId = sessionStorage.getItem("shopifyCustomerId");
		if (shopifyCustomerId) {
			const token = sessionStorage.getItem("loginToken");
			const url = `https://dr-livingood.myshopify.com/a/loop_subscriptions/customer/${shopifyCustomerId}?token=${token}`
		window.open(url, '_blank');
        } else {
			const url = `https://hub.livingooddaily.com/no-subscriptions`
            window.open(url, '_blank');
		}
	 	
	});
})