console.log("Starting tour!");

var introguide = introJs();

window.addEventListener('load', function () {
  if (getCookie('dlg.hidetour') == "true") return false;

  introguide.start();

  introguide.oncomplete(function () {
    setCookie('dlg.hidetour', true, 30);
  });

  introguide.onexit(function () {
    setCookie('dlg.hidetour', true, 30);
  });

  const showTourButton = document.querySelector('#showTour');
  showTourButton.addEventListener('click', function () {
    introguide.start();
  })
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