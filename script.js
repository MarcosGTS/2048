const CELL_SIZE = 32
const GRID_SIZE = 8

const GRID_COLOR = "black"

const canvas = document.getElementById("Canvas")
const context = canvas.getContext("2d")

canvas.width = CELL_SIZE * GRID_SIZE
canvas.height = CELL_SIZE * GRID_SIZE

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

function renderGrid(grid, context) {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            
            const number = grid[row][col] || "0"

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

const grid = createGrid()
grid[3][2] = "2048"
renderGrid(grid, context)