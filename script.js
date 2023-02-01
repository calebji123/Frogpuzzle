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
Accepting puzzle suggestions, name suggestions and bug reports.<br>`
infobutton.onclick = () => {
   newAlert("l", message)
}


function home () {
   desc.style.display = "grid"
   nae.style.display = "none"
   canvas.style.display = "none"
   titleelem.style.display = "inline-block"
   reset()
}


