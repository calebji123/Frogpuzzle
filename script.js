var backbutton = document.getElementById("back")
var infobutton = document.getElementById("info")

backbutton.onclick = home

var message = `
Pull the blocks so you can get to the yellow square!!!<br>
All blocks of the same color are connected.<br><br>
Controls:<br>
wasd: move<br>
q: pull (them -> you)<br>
e: pull (you -> them)<br>
z: undo<br><br>
Level difficulty rating: <br>
(overall difficulty/fun difficulty/frustrating difficulty)<br><br>
Accepting puzzle suggestions, name suggestions and bug reports.<br>
Known bugs:<br>
Tongue duplication/block movement on tongue, deleting block<br>
Movement outside of boundary (might not be a bug)`
infobutton.onclick = () => {
   newAlert("l", message)
}


function home () {
   desc.style.display = "grid"
   nae.style.display = "none"
   canvas.style.display = "none"
   titleelem.style.display = "inline-block"
   past = []
}


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