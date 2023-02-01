moving = {'LEFT': [0, -1], 'RIGHT': [0, 1], 'UP': [-1, 0], 'DOWN': [1, 0]}
dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]]
opposite = {'LEFT': 'RIGHT', 'RIGHT': 'LEFT', 'UP': 'DOWN', 'DOWN': 'UP'}
const controlSettings = {
    up : "w",
    left: "a",
    right: "d",
    down: "s",
    hook: "q",
    pull: "e",
    undo: "z"
 }


function get_tile_by_id(id) {
    all_parts = []
    for (let i = 0; i < width; i++){
        for (let j = 0; j < height; j++){
            if (gboard[i][j].id == id) {
                all_parts.push([i, j])
            }
        }
    }
    return all_parts
}

//get_the_thing_in_the_square_safe
function gttitss(coord) {
    if (0 <= coord[0] && coord[0] < width && 0 <= coord[1] && coord[1] < height){
        return gboard[coord[0]][coord[1]]
    }
}

function change_tile(coord, obj){
    gboard[coord[0]][coord[1]] = obj   
}

function slhook(look) {
    hook[hook.length-1] = look
}

function sllhook(look) {
    hook[hook.length-2] = look
}

function lhook() {
    return hook.slice(-1)[0]
}

function llhook() {
    return hook.slice(-2,-1)[0]
}

function dir_to_string(dir) {
    if (dir[0]==0 && dir[1]==-1) {
        return 'LEFT'
    } else if (dir[0]==0 && dir[1]==1) {
        return 'RIGHT'
    } else if (dir[0]==1 && dir[1]==0) {
        return 'UP'
    } else if (dir[0]==-1 && dir[1]==0) {
        return 'DOWN'
    }
}

function is_the_move_ok(all_parts, direct) {
    yep_the_move_is_ok = true
    all_parts.forEach(part=>{
        move_location = [part[0] + moving[direct][0], part[1] + moving[direct][1]]
        entry = gttitss(move_location)
        console.log(entry)
        move_onto_self = (e) => {
            return e[0] == move_location[0] && e[1] == move_location[1]
        }
        if (entry && (entry.id != 0 && !all_parts.some(move_onto_self)) && (!all_parts.includes(move_location))){
            yep_the_move_is_ok = false
        }
            
    })
    return yep_the_move_is_ok
}

function move_tiles(all_parts, direct) {
    let moved_tiles = []
    all_parts.forEach(part => {
        moved_tiles.push([part[0] + moving[direct][0], part[1] + moving[direct][1], gboard[part[0]][part[1]]])
        change_tile(part, {id:0, type:'    '})
    })
    
    moved_tiles.forEach(moved_part => {
        change_tile(moved_part.slice(0, 2), moved_part[2])
    })
}

function move_hook(direct) {
    console.log("move",hook)
    if (hook.length > 0) {
        target = [lhook()[0] + moving[direct][0], lhook()[1] + moving[direct][1]]
        end = gttitss(target)
        if (end && end.id == 0) {
            if (lhook()[2] != 'NONE') {
                slhook([...lhook().slice(0,2), 'NONE'])
                
                change_tile(lhook().slice(0,2), {id:0, type:'    '})
            }
            hook.push([...target, 'NONE'])
            change_tile(target, {id:-1, type:'hook', dir:'N'})
        } else if (end && end.type != 'hook') {
            slhook([...lhook().slice(0,2), direct])
            change_tile(lhook().slice(0,2), {id:-1, type:'hook', dir:direct[0]})
        }
    }
}

function pull_hook() {
    console.log("pulled", hook)
    if (hook.length > 1) {
        end_hook = [lhook()[0], lhook()[1]]
        hook_block = '0'
        if (lhook()[2] != 'NONE') {
            opp_dir = moving[lhook()[2]]
            hook_target = [end_hook[0] + opp_dir[0], end_hook[1] + opp_dir[1]]
            hook_block = gttitss(hook_target)
            
        }
        change_tile(end_hook, {id:0, type:'    '})
        if (hook_block.id != 0 && hook_block.type != 'hook') {
            hooked = get_tile_by_id(hook_block.id)
            if (is_the_move_ok(hooked, opposite[lhook()[2]])){
                move_tiles(hooked, opposite[lhook()[2]])
                if (hook.length > 2) {
                    last_link = [lhook()[0] - llhook()[0], llhook()[1] - lhook()[1]]
                    if (dir_to_string(last_link) == opposite[lhook()[2]]) {
                        sllhook([...llhook().slice(0,2), lhook()[2]])
                        change_tile(llhook().slice(0,2), lhook()[2][0])
                    }
                }
            }
        }
        hook.pop()
    }
}

function retract_hook() {
    if (hook.length > 1) {
        change_tile(hook[0].slice(0,2), {id:0, type:'    '})
        hook.shift()
    }
}

function undo() {
    console.log("undo")
    if (past.length > 1) {
        const out = JSON.parse(JSON.stringify(past[past.length-2]))
        gboard = out[0]
        hook = out[1]
        past.pop()
    }
}

function check_for_a_win() {
    for (let i = 0; i < dirs.length; i++) {
        const e = gttitss([dirs[i][0] + hook[0][0], dirs[i][1] + hook[0][1]])
        if (e && e.type == 'win') {
            nae.innerHTML+=(' well done')
            return true
        }
    }
    return false
}

        
//Event listeners
document.addEventListener("keydown", (e)=>{
    switch (e.key) {
       case controlSettings.up:
          move_hook("UP")
          render(gboard)
          break;
       case controlSettings.left:
          move_hook("LEFT")
          render(gboard)
          break;
       case controlSettings.right:
          move_hook("RIGHT")
          render(gboard)
          break;
       case controlSettings.down:
          move_hook("DOWN")
          render(gboard)
          break;
       case controlSettings.hook:
          pull_hook()
          render(gboard)
          break;
       case controlSettings.pull:
        retract_hook()
            render(gboard)
         break;
         case controlSettings.undo:
            undo()
            render(gboard, hook, false)
            break;
    }
 })

var past = []
// var gboard = [[{id:-1,"type":"hook", dir:'N'},{id:0,"type":"    "}],[{id:0,"type":"    "},{id:0,"type":"    "}],[{id:2,"type":"block"},{id:2,"type":"block"}]]
// const width = gboard.length
// const height = gboard[0].length
// hook = [[0,0, 'NONE']]