//www.downgram.in
let config;
let url;
let formData = {};
let isFormValidated = false;

window.onload = function () {
  changeTheme(localStorage.getItem("darkMode")); //select theme
  const urlParams = new URLSearchParams(window.location.search);
  const reportSUbmitted = urlParams.get("submit");
  formData["sender"] = "Downtok";

  saveViewCount(); // save page views

  if (window.location.pathname === "/pages/leaderboard.html") {
    getLeaderboardData();
  }

  $('a[href="' + window.location.pathname + '"]')
    .parents("li") //variations ("li,ul")
    .addClass("active");
};

function handleFormInput(e) {
  formData[e.id] = e.value;
}

function isvalidated(event) {
  var form = document.getElementById("issue-form");
  if (form.checkValidity() === false) {
    isFormValidated = false;
  } else {
    event.preventDefault();
    isFormValidated = true;
    reporter();
  }
}

function reporter() {
  $("#spinner").show();
  console.log("formData : ", formData);

  let requestBody = formData;
  fetch("https://prod.kushalbhalaik.xyz/api/issuereporter", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.message === "Report sent successfully") {
        $("#issue-form").hide();
        var formParent = document.getElementById("container");
        var newElement = document.createElement("p");
        newElement.setAttribute("id", "success-message");
        newElement.innerHTML = `<h2> Thank you! Issue has been submitted. <i style='color:limegreen' class='far fa-check-circle'></i></h2><br>
          <a
              href="report-issue.html"
              target="_self"
              >Report another <i class="fas fa-comment-dots"></i
            ></a>
          `;
        formParent.appendChild(newElement);
      }
    })
    .catch((err) => {
      console.log("err", err.message);
    })
    .finally(() => {
      $("#spinner").hide();
    });
}

function saveViewCount() {
  let sessionBody = { channelType: "web" };

  fetch("https://prod.kushalbhalaik.xyz/api/downtok-game/saveviewcount", {
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
  fetch("https://prod.kushalbhalaik.xyz/api/downtok-game/sessioncount")
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

function getLeaderboardData() {
  fetch("https://prod.kushalbhalaik.xyz/api/downtok-game/scores")
    .then((response) => response.json())
    .then((responseJson) => {
      document.querySelectorAll("#spinner").forEach(function (el) {
        el.style.display = "none";
      });

      let highScores = responseJson.result;

      if (highScores.allTimeHighest.length > 0) {
        document.getElementById("all-time-highest-score").innerHTML =
          highScores.allTimeHighest[0].score.$numberDouble;
        document.getElementById("all-time-highest-name").innerHTML =
          highScores.allTimeHighest[0].name;
      } else {
        document.getElementById("all-time-highest-score").innerHTML = "-";
      }

      if (highScores.todayHighest.length > 0) {
        document.getElementById("today-highest-score").innerHTML =
          highScores.todayHighest[0].score.$numberDouble;
        document.getElementById("today-highest-name").innerHTML =
          highScores.todayHighest[0].name;
      } else {
        document.getElementById("today-highest-score").innerHTML = "-";
      }

      if (highScores.thisWeekHighest.length > 0) {
        document.getElementById("this-week-highest-score").innerHTML =
          highScores.thisWeekHighest[0].score.$numberDouble;
        document.getElementById("this-week-highest-name").innerHTML =
          highScores.thisWeekHighest[0].name;
      } else {
        document.getElementById("this-week-highest-score").innerHTML = "-";
      }

      if (highScores.thisMonthHighest.length > 0) {
        document.getElementById("this-month-highest-score").innerHTML =
          highScores.thisMonthHighest[0].score.$numberDouble;
        document.getElementById("this-month-highest-name").innerHTML =
          highScores.thisMonthHighest[0].name;
      } else {
        document.getElementById("this-month-highest-score").innerHTML = "-";
      }

      var tableBody = document.querySelector("div#top-10-scores tbody");
      for (var i = 0; i < highScores.topTenScores.length; i++) {
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.innerHTML = i + 1;
        var td1 = document.createElement("td");
        td1.setAttribute("class", "player-name");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");

        var text1 = document.createTextNode(highScores.topTenScores[i].name);
        var text2 = document.createTextNode(
          highScores.topTenScores[i].score.$numberDouble
        );
        var text3 = document.createTextNode(
          new Date(
            parseInt(highScores.topTenScores[i].createDate.$date.$numberLong)
          )
        );

        td1.appendChild(text1);
        td2.appendChild(text2);
        td3.appendChild(text3);
        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        tableBody.appendChild(tr);
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
}

function themeSelection() {
  let isSelected = document.getElementById("theme-toggle").checked;

  localStorage.setItem("darkMode", !isSelected);
  changeTheme(localStorage.getItem("darkMode"));
}

function changeTheme(userPref) {
  $(document).ready(function () {
    if (userPref === "true") {
      $("body").css("background-color", "#12253c");
      $(".dark-th").css("color", "#ffffff");
      $("#theme-toggle").prop("checked", true);
    } else {
      $("body").css("background-color", "#ecf0f3");
      $(".dark-th").css("color", "rgba(0,0,0,.5)");
      $("#theme-toggle").prop("checked", false);
    }
  });
}
