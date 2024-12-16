const board = [
    ['black_rook', 'black_knight', 'black_bishop', 'black_queen', 'black_king', 'black_bishop', 'black_knight', 'black_rook'],
    ['black_pawn', 'black_pawn', 'black_pawn', 'black_pawn', 'black_pawn', 'black_pawn', 'black_pawn', 'black_pawn'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['white_pawn', 'white_pawn', 'white_pawn', 'white_pawn', 'white_pawn', 'white_pawn', 'white_pawn', 'white_pawn'],
    ['white_rook', 'white_knight', 'white_bishop', 'white_queen', 'white_king', 'white_bishop', 'white_knight', 'white_rook']
];

let selectedCell = null;

function createBoard() {
    const table = document.getElementById('chessboard');
    table.innerHTML = '';

    // Add top column labels (A-H)
    let topLabels = "<tr><td class='label'></td>";
    for (let j = 0; j < 8; j++) {
        topLabels += `<td class='label'>${String.fromCharCode(65 + j)}</td>`;
    }
    topLabels += "</tr>";
    table.innerHTML += topLabels;

    for (let i = 0; i < 8; i++) {
        let row = `<tr><td class='label'>${8 - i}</td>`;
        for (let j = 0; j < 8; j++) {
            const color = (i + j) % 2 === 0 ? 'grey' : 'white';
            const piece = board[i][j];
            row += `<td class='${color}' data-row='${i}' data-col='${j}' onclick='handleClick(this)'>`;
            if (piece) {
                row += `<img src='pieces/${piece}.png' alt='${piece}' class='piece'>`;
            }
            row += `</td>`;
        }
        row += '</tr>';
        table.innerHTML += row;
    }
}

function handleClick(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (selectedCell) {
        const fromRow = parseInt(selectedCell.dataset.row);
        const fromCol = parseInt(selectedCell.dataset.col);
        if (isValidMove(fromRow, fromCol, row, col)) {
            movePiece(selectedCell, cell, row, col);
        }
        selectedCell.classList.remove('selected');
        selectedCell = null;
    } else if (cell.querySelector('img')) {
        selectedCell = cell;
        cell.classList.add('selected');
    }
}

function movePiece(fromCell, toCell, row, col) {
    toCell.innerHTML = fromCell.innerHTML;
    fromCell.innerHTML = '';
    board[row][col] = board[fromCell.dataset.row][fromCell.dataset.col];
    board[fromCell.dataset.row][fromCell.dataset.col] = '';
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    const deltaRow = toRow - fromRow;
    const deltaCol = toCol - fromCol;

    switch (piece) {
        case 'white_pawn':
            return deltaRow === -1 && deltaCol === 0 && !board[toRow][toCol];
        case 'black_pawn':
            return deltaRow === 1 && deltaCol === 0 && !board[toRow][toCol];
        case 'white_rook':
        case 'black_rook':
            return deltaRow === 0 || deltaCol === 0;
        case 'white_knight':
        case 'black_knight':
            return (Math.abs(deltaRow) === 2 && Math.abs(deltaCol) === 1) || (Math.abs(deltaRow) === 1 && Math.abs(deltaCol) === 2);
        case 'white_bishop':
        case 'black_bishop':
            return Math.abs(deltaRow) === Math.abs(deltaCol);
        case 'white_queen':
        case 'black_queen':
            return deltaRow === 0 || deltaCol === 0 || Math.abs(deltaRow) === Math.abs(deltaCol);
        case 'white_king':
        case 'black_king':
            return Math.abs(deltaRow) <= 1 && Math.abs(deltaCol) <= 1;
        default:
            return false;
    }
}

createBoard();