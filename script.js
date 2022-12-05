import { initGame } from "./scripts/game.js"


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

const game = initGame(GRID_SIZE)
renderGrid(game.state.grid, context)

const moveSet = {
    "ArrowDown": game.moveDown,
    "ArrowUp": game.moveUp,
    "ArrowLeft": game.moveLeft,
    "ArrowRight": game.moveRight,
}

document.addEventListener("keydown", (event) => {
    update(event.key)
})

for (const button of buttons) { 
    button.addEventListener("click", () => {
        update(button.id)
    })
}

function update(command) {
    if (game.checkGameOver()) console.log("gameover")
    if (!moveSet[command]) return
    moveSet[command]()
    game.update()
    renderGrid(game.state.grid, context)
}

function getColorByValue(value) {
    return CELL_COLORS[Math.log2(value) - 1] || "white"
}

function renderGrid(grid, context) {
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

    if (!game.state.isRunning) { 
        context.fillStyle = 'rgba(255, 255, 255, 0.6)';
        context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

        context.font = "48px serif"
        context.fillStyle = "black"
        context.textAlign = "center"
        context.fillText("Game Over!", CANVAS_SIZE/2, CANVAS_SIZE/2)
    }
}