const LoopLink = document.getElementById("LoopLink");
 LoopLink.addEventListener('click', function (e) {
  	const shopifyCustomerId = sessionStorage.getItem("shopifyCustomerId");
	const token = sessionStorage.getItem("loginToken");
	const url = `https://dr-livingood.myshopify.com/a/loop_subscriptions/customer/${shopifyCustomerId}?token=${token}`
	window.open(url, '_blank');
 });
