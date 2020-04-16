//www.downtok.in
let config;
window.onload = function () {
  $("#spinner").show(); //shows loader
  changeTheme(localStorage.getItem("darkMode")); //select theme
  const urlParams = new URLSearchParams(window.location.search);
  const gameScore = urlParams.get("score");

  saveViewCount(); // save page views

  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  ) {
    fetch("config.json")
      .then((response) => response.json())
      .then((responseJSON) => {
        config = responseJSON;
        getSessionCount();
      });
  } else if (window.location.pathname === "/result.html") {
    $(document).ready(function () {
      $("h1#score").text(gameScore);
    });
  } else if (window.location.pathname === "/pages/404.html") {
    window.location.replace("https://www.downtok.in");
  }
};

function saveViewCount() {
  let sessionBody = { channelType: "web" };

  fetch("https://prod.downgram.in/api/downtok/saveviewcount", {
    method: "POST",
    body: JSON.stringify(sessionBody),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {})
    .catch((err) => {
      console.log("err", err);
    });
}

function getSessionCount() {
  var url = document.getElementById("search-box").value;

  fetch("https://prod.downgram.in/api/downtok/sessioncount")
    .then((response) => response.json())
    .then((responseJson) => {
      let totalSessions = responseJson.result.$numberDouble;

      $(document).ready(function () {
        $("span.stats").text(totalSessions);
      });

      $("#spinner").hide(); //hides loader
    })
    .catch((err) => {
      console.log("err", err);
      $("#spinner").hide(); //hides loader
    });
}

function saveSessionDetails(url) {
  let sessionBody = { linkURL: url, channelType: "web" };
  $("a[title~='Host']").hide(); //hides 000webhost banner
  fetch("https://prod.downgram.in/api/downtok/savesession", {
    method: "POST",
    body: JSON.stringify(sessionBody),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {
      $("#spinner").hide(); //hides loader
    })
    .catch((err) => {
      console.log("err", err);
      $("#spinner").hide(); //hides loader
    });
}

function themeSelection() {
  let isSelected = document.getElementById("theme-toggle").checked;

  localStorage.setItem("darkMode", !isSelected);
  changeTheme(localStorage.getItem("darkMode"));
}

function changeTheme(userPref) {
  var deviceWidth = Math.max(window.screen.width, window.innerWidth);
  console.log("deviceWidth :", deviceWidth);
  $(document).ready(function () {
    if (userPref === "true") {
      $(".dark-th").css("color", "#ffffff");
      $("#theme-toggle").prop("checked", true);
      if (deviceWidth < 575) {
        $("body").css("background-image", "url(./assets/black_nature1024.jpg)");
      } else {
        $("body").css("background-image", "url(./assets/black_nature.jpg)");
      }
    } else {
      $(".dark-th").css("color", "rgba(0,0,0,.5)");
      $("#theme-toggle").prop("checked", false);
      if (deviceWidth < 575) {
        $("body").css("background-image", "url(./assets/white_nature1024.jpg)");
      } else {
        $("body").css("background-image", "url(./assets/white_nature.jpg)");
      }
    }
  });
}
