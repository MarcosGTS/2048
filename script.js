const CANVAS_SIZE = 500
const GRID_SIZE = 8
const CELL_SIZE = 500 / 8


const GRID_COLOR = "black"

const canvas = document.getElementById("Canvas")
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

const game = initGame(context)
game.update()

function initGame (context) {
    const state = {
        grid: [],
    }

    state.grid = createGrid()

    function update() {
        generateNumber()
        renderGrid(context)
    }

    function generateNumber () {
        const grid = state.grid
        let randomX = Math.floor(Math.random() * GRID_SIZE)
        let randomY = Math.floor(Math.random() * GRID_SIZE)

        while (grid[randomY][randomX]) {
            randomX = Math.floor(Math.random() * GRID_SIZE)
            randomY = Math.floor(Math.random() * GRID_SIZE)
        }
        
        grid[randomY][randomX] = "2"
    }

    function renderGrid(context) {
        const grid = state.grid;
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[0].length; col++) {
                
                const number = grid[row][col] || ""
    
                const canvasX = col * CELL_SIZE
                const canvasY = row * CELL_SIZE
    
                context.fillStyle = "white"
                context.strokeStyle = GRID_COLOR
                context.fillRect(canvasX, canvasY, CELL_SIZE, CELL_SIZE)
                context.strokeRect(canvasX, canvasY, CELL_SIZE, CELL_SIZE)
    
                context.fillStyle = "black"
                context.textAlign = "center"
                context.textBaseLine = "center"
                
                const centerX = canvasX + CELL_SIZE/2
                const centerY = canvasY + CELL_SIZE/2
                context.fillText(number, centerX, centerY, CELL_SIZE)
            }
        }
    }

    return {
        state, 
        update
    }
}

document.addEventListener("keydown", () => {
    game.update()
})