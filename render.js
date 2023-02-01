var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const colorScheme = {
    hook:'pink'
}

function render(board, hooks, save = true) {
    check_for_a_win()
    if (hooks == undefined) {
        hooks = hook;
    }

    if (save) {
        past.push(JSON.parse(JSON.stringify([board, hooks])))
        if (past.length > 250) {
            past.shift();
        }
    }

    const blockSize = Math.min(40, 600 / board.length)
    const width = board.length * blockSize
    const height = board[0].length * blockSize


    canvas.width = height
    canvas.height = width
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[0].length; y++) {
            nearby = checkNeighbours(board, x, y, equalsId)
            ctx.strokeStyle = "black";
            switch (board[x][y].type) {
                case "block":
                    ctx.fillStyle = "grey"
                    ctx.fillRect(y * blockSize, x * blockSize, blockSize, blockSize)
                    ctx.strokeRect(y * blockSize, x * blockSize, blockSize, blockSize)
                    ctx.fillStyle = colors[board[x][y].id - 1]
                    if (board[x][y].deco && board[x][y].deco.wall) {
                        ctx.strokeRect((y + 0.15) * blockSize, (x + 0.15) * blockSize, blockSize * 0.7, blockSize * 0.7)
                        ctx.fillStyle = fillWall(board[x][y].id)
                    }
                    fillPartial(x, y, blockSize, nearby, true, true)

                    break;
                case "win":
                    ctx.fillStyle = "gold"
                    ctx.fillRect(y * blockSize + blockSize * 0.1, x * blockSize + blockSize * 0.1, blockSize * 0.8, blockSize * 0.8)
                    break;
                default:
                    break;
            }
        }
    }
    ctx.fillStyle = colorScheme.hook
    for (i = 1; i < hooks.length; i++) {
        directions = { "UP": false, "LEFT": false, "RIGHT": false, "DOWN": false }
        directions[dir_to_string([hooks[i][0] - hooks[i - 1][0], hooks[i - 1][1] - hooks[i][1]])] = true;
        if (i < hooks.length - 1) {
            directions[dir_to_string([hooks[i][0] - hooks[i + 1][0], hooks[i + 1][1] - hooks[i][1]])] = true;
        } else {
            ndir = { "UP": false, "LEFT": false, "RIGHT": false, "DOWN": false }
            ndir[hooks[i][2]] = true;
            fillPartial(...hooks[i].slice(0, 2), blockSize, ndir)
        }
        fillPartial(...hooks[i].slice(0, 2), blockSize, directions, true)
    }
    directions = { "UP": false, "LEFT": false, "RIGHT": false, "DOWN": false }
    if (hooks.length > 1) {
        directions[dir_to_string([hooks[0][0] - hooks[1][0], hooks[1][1] - hooks[0][1]])] = true;
    }
    fillPartial(...hooks[0].slice(0, 2), blockSize, directions)
    frog(...hooks[0].slice(0, 2), blockSize)
}

function frog(y, x, blockSize) {
    ctx.fillStyle = 'green'
    ctx.beginPath();
    ctx.arc((x+0.5) * blockSize, (y+0.5) * blockSize, blockSize / 3, 0, 2 * Math.PI);
    ctx.fill();
}

function fillPartial(y, x, blockSize, directions, circle = false, modst=false) {
    const margin = 5
    const width = blockSize / 4
    if (directions.UP) {
        ctx.fillRect(x * blockSize + (blockSize - width) / 2, y * blockSize - margin, width, blockSize / 2 + margin)
    }
    if (directions.LEFT) {
        ctx.fillRect(x * blockSize - margin, y * blockSize + (blockSize - width) / 2, blockSize / 2 + margin, width)
    }
    if (directions.RIGHT) {
        ctx.fillRect(x * blockSize + blockSize / 2, y * blockSize + (blockSize - width) / 2, blockSize / 2 + margin, width)
    }
    if (directions.DOWN) {
        ctx.fillRect(x * blockSize + (blockSize - width) / 2, y * blockSize + blockSize / 2, width, blockSize / 2 + margin)
    }
    const circleWidth = blockSize / 4
    if (circle) {
        ctx.beginPath();
        ctx.arc(x * blockSize + blockSize / 2, y * blockSize + blockSize / 2, (circleWidth / 2), 0, 2 * Math.PI);
        ctx.fill();
    }
    if (modst && directions.total==0) {
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = ctx.fillStyle
        ctx.moveTo((x+0.3) * blockSize, (y+0.3) * blockSize);
        ctx.lineTo((x+0.7) * blockSize, (y+0.7) * blockSize);
        ctx.stroke()
        ctx.moveTo((x+0.7) * blockSize, (y+0.3) * blockSize);
        ctx.lineTo((x+0.3) * blockSize, (y+0.7) * blockSize);
        ctx.stroke()
        ctx.lineWidth = 1;
        ctx.lineCap = 'butt';
        ctx.strokeStyle = "black";
    }    
}

function equalsId(a, b) {
    return a.id == b.id
}

function checkNeighbours(gameState, x, y, func) {
    base = { "UP": false, "LEFT": false, "RIGHT": false, "DOWN": false, "total": 0 }
    val = gameState[x][y]
    if (y < gameState[0].length - 1 && func(gameState[x][y + 1], val)) {
        base.RIGHT = true
        base.total += 1
    }
    if (x < gameState.length - 1 && func(gameState[x + 1][y], val)) {
        base.DOWN = true
        base.total += 1
    }
    if (y > 0 && func(gameState[x][y - 1], val)) {
        base.LEFT = true
        base.total += 1
    }
    if (x > 0 && func(gameState[x - 1][y], val)) {
        base.UP = true
        base.total += 1
    }
    return base
}

count = []
function fillWall(id) {
    if(!count.includes(id)){
        count.push(id)
    }
    return wall_colors[count.indexOf(id)]
}