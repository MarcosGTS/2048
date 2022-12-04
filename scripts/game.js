import { createGrid, rotateBy } from "./gridOperations.js"

function initGame (gridSize) {
    const state = {
        grid: [],
        prev: null,
        score: 0,
        isRunning: true,
    }

    state.grid = createGrid(gridSize, gridSize)
    generateNumber()
    console.log(state.grid)
    function update() {
        if (!state.isRunning) return 
        
        if (checkChanges(state.grid, state.prev)) {
            state.score += generateNumber()
        }
        
        if (checkGameOver()) state.isRunning = false
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
        for (let row of matrix) {
            flatedMatrix = flatedMatrix.concat(row)
        }

        return flatedMatrix.reduce((prev, crr) => crr > prev ? crr : prev, 0)
    }

    function generateNumber () {
        const grid = state.grid

        let randomX = Math.floor(Math.random() * gridSize)
        let randomY = Math.floor(Math.random() * gridSize)

        while (grid[randomY][randomX]) {
            randomX = Math.floor(Math.random() * gridSize)
            randomY = Math.floor(Math.random() * gridSize)
        }
        
        let maxValue = Math.max(getMaxValue(grid), 4)
        const power = Math.floor(Math.random() * (Math.log2(maxValue) - 1) + 1)
        grid[randomY][randomX] = 2 ** power
        
        return grid[randomY][randomX]
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
       
        for (let row = 0; row < gridSize; row++) {
        for (let col = gridSize - 1; col >= 0; col--) {
            
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

export {initGame}