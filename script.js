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
    const table = document.getElementById('chessboard')
    for (let i = 0; i < 8; i++) {
        let row = `<tr><td class='label'>${8 - i}</td>`;
        for (let j = 0; j < 8; j++) {
            const color = (i + j) % 2 === 0 ? 'grey' : 'white';;
            const piece = board[i][j];
            row += `<td class='${color}' onclick='handleClick(this, ${i}, ${j})'>`;
            if (piece) {
                row += `<img src='pieces/${piece}.png' alt='${piece}' class='piece'>`;
            }
        }
        row += '</tr>';
        table.innerHTML += row;
    }
}

function handleClick(cell, row, col) {
    if (selectedCell) {
        movePiece(selectedCell, cell, row, col);
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
}

createBoard();