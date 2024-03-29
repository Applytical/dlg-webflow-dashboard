var introguide = introJs();

window.addEventListener('DOMContentLoaded', function () {
  const showTourButton = document.querySelector('#showTour');
  console.log(showTourButton);
  showTourButton.addEventListener('click', function () {
    console.log("Opening Tour");
    introguide.start();
  });

  if (getCookie('dlg.hidetour') == "true") return false;

  // Add delay before tour starts
  var delayInMilliseconds = 1000; //3 seconds
  setTimeout(function () {
    // Start tour
    introguide.start();
  }, delayInMilliseconds);

  // When tour finished, hide tour
  introguide.oncomplete(function () {
    setCookie('dlg.hidetour', true, 30);
  });

  // When tour existted, hide tour
  introguide.onexit(function () {
    setCookie('dlg.hidetour', true, 30);
  });
});

// Cookie helper functions
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}