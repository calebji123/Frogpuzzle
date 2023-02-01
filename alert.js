//From animal farm
var alertBox = document.getElementById("alertMain");
var alertCloseButton = document.getElementById("alertCloseButton");
var alertMain = document.getElementById("alertMain");
var mess = document.getElementById("alertText");

var onAlert = false;
function newAlert(size, message) {
    if (!onAlert) {
      //change sizes
      alertMain.classList = "";
      if (size == "s") {
      alertMain.classList.add("small");
      } else if (size == "m") {
      alertMain.classList.add("medium");
      } else if (size == "l") {
      alertMain.classList.add("large")
      }
      //change text
      mess.innerHTML = message;
      alertBox.style.display = "block";
      onAlert = true;
    }
}
alertCloseButton.onclick = function () { closeAlert(); }

function closeAlert() {
  alertBox.style.display = "none";
  onAlert = false;
}