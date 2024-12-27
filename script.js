let board = [
    [{ color: 'black', type: 'rook' }, { color: 'black', type: 'knight' }, { color: 'black', type: 'bishop' }, { color: 'black', type: 'queen' }, { color: 'black', type: 'king' }, { color: 'black', type: 'bishop' }, { color: 'black', type: 'knight' }, { color: 'black', type: 'rook' }],
    [{ color: 'black', type: 'pawn' }, { color: 'black', type: 'pawn' }, { color: 'black', type: 'pawn' }, { color: 'black', type: 'pawn' }, { color: 'black', type: 'pawn' }, { color: 'black', type: 'pawn' }, { color: 'black', type: 'pawn' }, { color: 'black', type: 'pawn' }],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [{ color: 'white', type: 'pawn' }, { color: 'white', type: 'pawn' }, { color: 'white', type: 'pawn' }, { color: 'white', type: 'pawn' }, { color: 'white', type: 'pawn' }, { color: 'white', type: 'pawn' }, { color: 'white', type: 'pawn' }, { color: 'white', type: 'pawn' }],
    [{ color: 'white', type: 'rook' }, { color: 'white', type: 'knight' }, { color: 'white', type: 'bishop' }, { color: 'white', type: 'queen' }, { color: 'white', type: 'king' }, { color: 'white', type: 'bishop' }, { color: 'white', type: 'knight' }, { color: 'white', type: 'rook' }]
];

let selectedCell = null;
let gameOver = false;
let currentTurn = 'white';
let lastMove = null;
let whiteKingMoved = false;
let blackKingMoved = false;
let whiteRookMoved = { kingside: false, queenside: false };
let blackRookMoved = { kingside: false, queenside: false };

function createBoard() {
    const table = document.getElementById('chessboard');
    table.innerHTML = '';

    for (let i = 0; i < 8; i++) {
        let row = `<tr><td class='label'>${8 - i}</td>`;
        for (let j = 0; j < 8; j++) {
            const color = (i + j) % 2 === 0 ? 'grey' : 'white';
            const piece = board[i][j];
            row += `<td class='${color}' data-row='${i}' data-col='${j}' onclick='handleClick(this)'>`;
            if (piece) {
                row += `<img src='pieces/${piece.color}_${piece.type}.png' alt='${piece.color}_${piece.type}' class='piece'>`;
            }
            row += `</td>`;
        }
        row += '</tr>';
        table.innerHTML += row;
    }

    let bottomLabels = "<tr><td class='label'></td>";
    for (let j = 0; j < 8; j++) {
        bottomLabels += `<td class='label'>${String.fromCharCode(65 + j)}</td>`;
    }
    bottomLabels += "</tr>";
    table.innerHTML += bottomLabels;
}

function handleClick(cell) {
    if (gameOver) {
        alert('Game over. Start a new game to play again.');
        return;
    }
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (selectedCell) {
        const fromRow = parseInt(selectedCell.dataset.row);
        const fromCol = parseInt(selectedCell.dataset.col);
        if (isValidMove(fromRow, fromCol, row, col)) {
            movePiece(selectedCell, cell, row, col);
            // Check for checkmate after the move
            const opponentColor = currentTurn === 'white' ? 'black' : 'white';
            if (isKingInCheck(opponentColor) && isCheckmate(opponentColor)) {
                alert(`${opponentColor.charAt(0).toUpperCase() + opponentColor.slice(1)} is in checkmate! Game over.`);
                gameOver = true;
            }
            switchTurn();
        } else if (isKingInCheck(currentTurn)) {
            console.log('Invalid move: King cannot be left in check.');
        }
        selectedCell.classList.remove('selected');
        selectedCell = null;
    } else if (cell.querySelector('img')) {
        const piece = board[row][col];
        if (piece && piece.color === currentTurn) { // Only allow selecting pieces of the current turn
            selectedCell = cell;
            cell.classList.add('selected');
        }
    }
}



function switchTurn() {
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
    document.getElementById('turnIndicator').innerText = `Current Turn: ${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)}`;
}

function movePiece(fromCell, toCell, row, col) {
    const fromRow = parseInt(fromCell.dataset.row);
    const fromCol = parseInt(fromCell.dataset.col);
    const piece = board[fromRow][fromCol];

    // Handle en passant
    if (piece.type === 'pawn' && fromCol !== col && !board[row][col]) {
        const capturedPawnRow = piece.color === 'white' ? row + 1 : row - 1;
        board[capturedPawnRow][col] = null;
        document.querySelector(`[data-row='${capturedPawnRow}'][data-col='${col}']`).innerHTML = '';
    }

    // Handle castling
    if (piece.type === 'king' && Math.abs(fromCol - col) === 2) {
        handleCastling(fromRow, fromCol, col);
    }

    // Perform the move
    board[row][col] = piece;
    board[fromRow][fromCol] = null;
    toCell.innerHTML = fromCell.innerHTML;
    fromCell.innerHTML = '';

    // Update last move
    lastMove = { fromRow, fromCol, toRow: row, toCol: col, piece };

    // Track king and rook moves for castling
    if (piece.type === 'king') {
        if (piece.color === 'white') whiteKingMoved = true;
        else blackKingMoved = true;
    }

    if (piece.type === 'rook') {
        if (piece.color === 'white') {
            if (fromCol === 0) whiteRookMoved.queenside = true;
            if (fromCol === 7) whiteRookMoved.kingside = true;
        } else {
            if (fromCol === 0) blackRookMoved.queenside = true;
            if (fromCol === 7) blackRookMoved.kingside = true;
        }
    }
}

function handleCastling(fromRow, fromCol, toCol) {
    if (toCol === fromCol + 2) {
        // Kingside castling
        board[fromRow][5] = board[fromRow][7];
        board[fromRow][7] = null;
        document.querySelector(`[data-row='${fromRow}'][data-col='5']`).innerHTML = document.querySelector(`[data-row='${fromRow}'][data-col='7']`).innerHTML;
        document.querySelector(`[data-row='${fromRow}'][data-col='7']`).innerHTML = '';
    } else if (toCol === fromCol - 2) {
        // Queenside castling
        board[fromRow][3] = board[fromRow][0];
        board[fromRow][0] = null;
        document.querySelector(`[data-row='${fromRow}'][data-col='3']`).innerHTML = document.querySelector(`[data-row='${fromRow}'][data-col='0']`).innerHTML;
        document.querySelector(`[data-row='${fromRow}'][data-col='0']`).innerHTML = '';
    }
}

function isKingInCheck(color) {
    // Find the king's position
    let kingPosition = null;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece && piece.type === 'king' && piece.color === color) {
                kingPosition = { row: i, col: j };
                break;
            }
        }
    }

    console.log(kingPosition)

    if (!kingPosition) {
        console.error(`${color} king not found!`);
        return false;
    }

    // Check if the king's position is under attack
    return isSquareUnderAttack(kingPosition.row, kingPosition.col, color);
}

// Iterate through all pieces of the given color
function isCheckmate(color) {
    console.log(`Checking for checkmate for ${color}`);
    if (!isKingInCheck(color)) {
        console.log(`King of ${color} is not in check. No checkmate.`);
        return false; // Not in check, so no checkmate
    }

    // Iterate through all pieces of the given color
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece && piece.color === color) {
                console.log(`Checking moves for piece ${piece.type} at ${i}, ${j}`);
                // Check all possible moves for this piece
                for (let toRow = 0; toRow < 8; toRow++) {
                    for (let toCol = 0; toCol < 8; toCol++) {
                        if (isValidMove(i, j, toRow, toCol)) {
                            console.log(`Found a valid move for ${piece.type} from ${i}, ${j} to ${toRow}, ${toCol}`);
                            return false; // Found a valid move, so no checkmate
                        }
                    }
                }
            }
        }
    }

    console.log(`Checkmate detected for ${color}`);
    return true; // No valid moves and in check, so checkmate
}

function isSquareUnderAttack(row, col, defenderColor) {
    const attackerColor = defenderColor === 'white' ? 'black' : 'white';

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece && piece.color === attackerColor) {
                if (isValidMove(i, j, row, col, true)) {
                    return true;
                }
            }
        }
    }

    return false;
}

function isValidMove(fromRow, fromCol, toRow, toCol, skipCheckValidation = false) {
    const piece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];

    if (!piece) return false;
    if (targetPiece && piece.color === targetPiece.color) return false;

    // if (!valid) return false;

    // Prevent moves that expose the king to check
    if (!skipCheckValidation) {
        const originalFromPiece = board[fromRow][fromCol];
        const originalToPiece = board[toRow][toCol];

        // Simulate the move
        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = null;

        const kingInCheck = isKingInCheck(piece.color);

        // Undo the move
        board[fromRow][fromCol] = originalFromPiece;
        board[toRow][toCol] = originalToPiece;

        if (kingInCheck) {
            console.log('Move invalid: King would be in check');
            return false;
        }
    
    }

    switch (piece.type) {
        case 'pawn':
            return isValidPawnMove(fromRow, fromCol, toRow, toCol, piece.color);
        case 'rook':
            return isValidRookMove(fromRow, fromCol, toRow, toCol);
        case 'bishop':
            return isValidBishopMove(fromRow, fromCol, toRow, toCol);
        case 'knight':
            return isValidKnightMove(fromRow, fromCol, toRow, toCol);
        case 'queen':
            return isValidRookMove(fromRow, fromCol, toRow, toCol) || isValidBishopMove(fromRow, fromCol, toRow, toCol);
        case 'king':
            return isValidKingMove(fromRow, fromCol, toRow, toCol);
    }
    
}

// Helper functions for each piece's movement

function isValidPawnMove(fromRow, fromCol, toRow, toCol, color) {
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;

    // Normal move
    if (fromCol === toCol && !board[toRow][toCol]) {
        if (toRow - fromRow === direction) return true;
        if (fromRow === startRow && toRow - fromRow === 2 * direction && !board[fromRow + direction][toCol]) {
            return true;
        }
    }

    // Capture move
    if (Math.abs(fromCol - toCol) === 1 && toRow - fromRow === direction) {
        // Regular capture
        if (board[toRow][toCol] && board[toRow][toCol].color !== color) {
            return true;
        }
        // En passant
        if (lastMove && lastMove.piece.type === 'pawn' &&
            Math.abs(lastMove.toRow - lastMove.fromRow) === 2 &&
            lastMove.toRow === fromRow &&
            lastMove.toCol === toCol) {
            return true;
        }
    }

    return false;
}

function isValidRookMove(fromRow, fromCol, toRow, toCol) {
    if (fromRow !== toRow && fromCol !== toCol) return false;
    return isPathClear(fromRow, fromCol, toRow, toCol);
}

function isValidBishopMove(fromRow, fromCol, toRow, toCol) {
    if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false;
    return isPathClear(fromRow, fromCol, toRow, toCol);
}

function isValidKnightMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function isValidKingMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    // Normal king move (one square in any direction)
    if (rowDiff <= 1 && colDiff <= 1) {
        return true;
    }

    // Castling logic
    if (rowDiff === 0 && colDiff === 2) { // Castling happens when the king moves 2 squares
        if (currentTurn === 'white' && !whiteKingMoved) {
            if (toCol === 6 && !whiteRookMoved.kingside && isPathClear(fromRow, fromCol, fromRow, 7)) {
                // Kingside castling for white
                return !isSquareUnderAttack(fromRow, 4, 'white') &&
                       !isSquareUnderAttack(fromRow, 5, 'white') &&
                       !isSquareUnderAttack(fromRow, 6, 'white');
            } else if (toCol === 2 && !whiteRookMoved.queenside && isPathClear(fromRow, fromCol, fromRow, 0)) {
                // Queenside castling for white
                return !isSquareUnderAttack(fromRow, 4, 'white') &&
                       !isSquareUnderAttack(fromRow, 3, 'white') &&
                       !isSquareUnderAttack(fromRow, 2, 'white');
            }
        } else if (currentTurn === 'black' && !blackKingMoved) {
            if (toCol === 6 && !blackRookMoved.kingside && isPathClear(fromRow, fromCol, fromRow, 7)) {
                // Kingside castling for black
                return !isSquareUnderAttack(fromRow, 4, 'black') &&
                       !isSquareUnderAttack(fromRow, 5, 'black') &&
                       !isSquareUnderAttack(fromRow, 6, 'black');
            } else if (toCol === 2 && !blackRookMoved.queenside && isPathClear(fromRow, fromCol, fromRow, 0)) {
                // Queenside castling for black
                return !isSquareUnderAttack(fromRow, 4, 'black') &&
                       !isSquareUnderAttack(fromRow, 3, 'black') &&
                       !isSquareUnderAttack(fromRow, 2, 'black');
            }
        }
    }

    return false;
}


// Check if the path between two positions is clear (used by rook, bishop, queen)
function isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
    const colStep = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
        if (board[currentRow][currentCol]) {
            return false;
        }
        currentRow += rowStep;
        currentCol += colStep;
    }

    return true;
}

function getValidMoves(board, playerColor) {
    const moves = [];

    board.forEach((row, fromRow) => {
        row.forEach((piece, fromCol) => {
            if (piece && piece.color === playerColor) {
                for (let toRow = 0; toRow < 8; toRow++) {
                    for (let toCol = 0; toCol < 8; toCol++) {
                        if (isValidMove(fromRow, fromCol, toRow, toCol)) {
                            moves.push({
                                from: { row: fromRow, col: fromCol },
                                to: { row: toRow, col: toCol }
                            });
                        }
                    }
                }
            }
        });
    });

    return moves;
}

function getRandomMove(board, playerColor) {
    const validMoves = getValidMoves(board, playerColor);
    if (validMoves.length === 0) return null; // No moves available
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
}


createBoard();
