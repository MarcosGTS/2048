const CANVAS_SIZE = 300
const GRID_SIZE = 4
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE

const GRID_COLOR = "black"
const CELL_COLORS = ["yellow", "orange", "purple", "green", "red", "blue", "gray"]

const canvas = document.getElementById("Canvas")
const buttons = document.getElementsByTagName("button")
const context = canvas.getContext("2d")

canvas.width = CANVAS_SIZE
canvas.height = CANVAS_SIZE

function createGrid() {
    let grid = []

    for (let i = 0; i < GRID_SIZE; i++) {
        let row = []
        for (let j = 0; j < GRID_SIZE; j++) {
            row.push("") 
        }
        grid.push(row)
    }

    return grid
}

function matrixRotation(matrix) {
    const newMatrix = []
    for (let row = 0; row < matrix.length; row++) {
        const newRow = []
        for (let col = 0; col < matrix[0].length; col++) {
            newRow.unshift(matrix[col][row])
        }
        newMatrix.push(newRow)
    }

    return newMatrix
}

function rotateBy (matrix, num = 1) {
    
    for (let i = 0; i < num; i++) {
        matrix = matrixRotation(matrix)
    }

    return matrix
}


const game = initGame(context)
game.update()

function initGame (context) {
    const state = {
        grid: [],
        prev: null,
    }

    state.grid = createGrid()
    generateNumber()

    function update() {
        if (checkChanges(state.grid, state.prev)) generateNumber()
        renderGrid(context)
    }

    function checkChanges(crr, prev) {

        if (!prev) return true

        for (let row = 0; row < crr.length; row++) {
        for (let col = 0; col < crr[0].length; col++){
            if (crr[row][col] != prev[row][col]) return true
        }}

        return  false
    }

    function getMaxValue(matrix) {
        let flatedMatrix = []
        for (row of matrix) {
            flatedMatrix = flatedMatrix.concat(row)
        }

        return flatedMatrix.reduce((prev, crr) => crr > prev ? crr : prev, 0)
    }

    function generateNumber () {
        const grid = state.grid

        let randomX = Math.floor(Math.random() * GRID_SIZE)
        let randomY = Math.floor(Math.random() * GRID_SIZE)

        while (grid[randomY][randomX]) {
            randomX = Math.floor(Math.random() * GRID_SIZE)
            randomY = Math.floor(Math.random() * GRID_SIZE)
        }
        
        let maxValue = Math.max(getMaxValue(grid), 4)
        const power = Math.floor(Math.random() * (Math.log2(maxValue) - 1) + 1)
        grid[randomY][randomX] = 2 ** power
    }

    function moveRight() {
        let {grid} = state
        grid = moveDirectional(grid, 0)

        state.prev = state.grid
        state.grid = grid
    }

    function moveUp() {
        let {grid} = state
        grid = moveDirectional(grid, 1)

        state.prev = state.grid
        state.grid = grid
    }

    function moveLeft() {
        let {grid} = state
        grid = moveDirectional(grid, 2)

        state.prev = state.grid
        state.grid = grid
    }

    function moveDown() {
        let {grid} = state
        grid = moveDirectional(grid, 3)

        state.prev = state.grid
        state.grid = grid   
    }

    function moveDirectional(grid, direction = 0) {
        /*
            0 - right
            1 - up
            2 - left
            3 - down 
        */

        grid = rotateBy(grid, direction)
        grid = move(grid)
        grid = rotateBy(grid, 4 - direction)

        return grid
    }

    function checkGameOver() {

        let {grid} = state
        for (let direction = 0; direction < 4; direction++) {
            const fureteState = moveDirectional(grid, direction)
            if (checkChanges(fureteState, grid)) return false
        }

        return true
    }

    function move(matrix) {
        //copy nested arrays
        const grid = JSON.parse(JSON.stringify(matrix)); 
       
        for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = GRID_SIZE - 1; col >= 0; col--) {
            
            let value = grid[row][col]
            let offset = 1

            if (value == "") continue
            
            while (grid[row][col + offset] == "")  {offset++}
            
            grid[row][col] = ""

            if (grid[row][col + offset] == value) {
                grid[row][col + offset] = grid[row][col + offset] + value
            } else {
                grid[row][col + offset - 1] = value
            }

        }}

        return grid
    }

    function getColorByValue(value) {
        return CELL_COLORS[Math.log2(value) - 1] || "white"
    }

    function renderGrid(context) {
        const grid = state.grid;
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[0].length; col++) {
                
                const number = grid[row][col] || ""
    
                const canvasX = col * CELL_SIZE
                const canvasY = row * CELL_SIZE
    
                context.fillStyle = getColorByValue(number)
                context.strokeStyle = GRID_COLOR
                context.fillRect(canvasX, canvasY, CELL_SIZE, CELL_SIZE)
                context.strokeRect(canvasX, canvasY, CELL_SIZE, CELL_SIZE)
    
                context.font = "24px serif"
                context.fillStyle = "black"
                context.textAlign = "center"
                context.textBaseLine = "center"
                
                const centerX = canvasX + CELL_SIZE/2
                const centerY = canvasY + CELL_SIZE/2
                context.fillText(number, centerX, centerY, CELL_SIZE)
            }
        }

        if (checkGameOver()) { 
            context.fillStyle = 'rgba(255, 255, 255, 0.6)';
            context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)


            context.font = "48px serif"
            context.fillStyle = "black"
            context.textAlign = "center"
            context.fillText("Game Over!", CANVAS_SIZE/2, CANVAS_SIZE/2)
        }
    }

    return {
        state, 
        update,
        moveLeft,
        moveRight,
        moveUp,
        moveDown,
        checkGameOver,
    }
}

const moveSet = {
    "ArrowDown": game.moveDown,
    "ArrowUp": game.moveUp,
    "ArrowLeft": game.moveLeft,
    "ArrowRight": game.moveRight,
}

document.addEventListener("keydown", (event) => {
    if(game.checkGameOver()) console.log("gameover")
    if (moveSet[event.key]) moveSet[event.key]()
    game.update()
})

for (const button of buttons) {
    
    button.addEventListener("click", () => {
        if(game.checkGameOver()) console.log("gameover")
        if (moveSet[button.id]) moveSet[button.id]()
        game.update()
    })
}