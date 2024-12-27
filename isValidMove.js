function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol]
    const targetPiece = board[toRow][toCol]

    // if click doesnt select a piece
    // should be handled in the controller
    if (!piece) return false;

    // check move doesnt leave the king in check
    if (checkValidation(fromRow, fromCol, toRow, toCol)) {
        return True;
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

    return true;
}

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