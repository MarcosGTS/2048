function createGrid(gridWidth, gridHeight) {
    let grid = []

    for (let i = 0; i < gridHeight; i++) {
        let row = []
        for (let j = 0; j < gridWidth; j++) {
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

export {createGrid, rotateBy}