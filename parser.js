const nae = document.getElementById('name')
const desc = document.getElementById('desc')
var canvas = document.getElementById("myCanvas");
var titleelem = document.getElementById("title")
const re = /([^\n-]*?)\r?\n\[\r\n(.*?)\]/gms

var array = []
fetch('puzzos.txt').then( r => r.text() ).then( t => {
    array = [...t.matchAll(re)];
    desc.innerHTML = ''
    for (let i = 0; i < array.length; i++) {
        const ele = document.createElement('div')
        ele.innerHTML = `${i+1}: ${array[i][1]}<br>`
        ele.onclick = () => {
            maien(i)
            desc.style.display = 'none'
        }
        desc.appendChild(ele)
    }
})

var gboard = []
var hook = []
var width = 0
var height = 0

function maien(thenumber) {
    nae.innerHTML = array[thenumber][1]
    nae.style.display = "inline-block"
    lines = array[thenumber][2].split(/\r?\n/)
    canvas.style.display = "inline-block"
    titleelem.style.display = "none"

    gboard = []
    hook = []
    width = 0
    height = 0

    const theotherstuff = ['H', 'L', 'W']
    already_seen = [' ']
    lines.forEach(l=>{
        const outtt = []
        for (var i = 0; i < l.length; i++) {
            const s = l[i]
            let id = -1
            let thing = ''
            let tile_obj = {}
            if (theotherstuff.includes(s)) {
            } else if (already_seen.includes(s)) {
                id=already_seen.indexOf(s)
            } else {
                already_seen.push(s)
                id=already_seen.length-1
            }
            switch (s) {
                case ' ':
                    thing = '    '
                    break;
                case 'H':
                    thing = 'hook'
                    hook[0] = [gboard.length, i, 'NONE']
                    break;
                case 'W':
                    thing = 'win'
                    break;
                case 'L':
                    thing = 'lava'
                    break;
                default:
                    if ('░▒▓'.includes(s)) {
                        tile_obj.deco = {wall:true}
                    }
                    thing = 'block'
                    break;
                
            }
            tile_obj.type = thing
            tile_obj.id = id
            outtt.push(tile_obj)
        }
        if (outtt.length>0) {
        gboard.push(outtt)}
    })

    width = gboard.length
    height = gboard[0].length
    render(gboard)
}