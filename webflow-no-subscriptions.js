const lifestyleBtn = document.getElementById('joinLifeStyle');

lifestyleBtn.addEventListener('click', function (e) {
  const refreshPage = document.getElementById('refreshPage');
  const refreshPageDiv = document.getElementById('refreshPageDiv').style.display = "block";
  refreshPage.addEventListener('click', function (e) {

    window.location.href("/account/subscriptions");

  });
});