let verticalResolution, horizontalResolution;

// export function hexBuffer(edgeLength, aspectRatio) {
//     const positions = [];

//     // compute parameters for the spacing between points
//     const halfRowHeight = edgeLength * 0.5;
//     const columnWidth = edgeLength * Math.cos(Math.PI / 6);

//     verticalResolution = Math.ceil(1 / edgeLength) + 1;
//     horizontalResolution = Math.ceil(aspectRatio / columnWidth);

//     let x = -horizontalResolution * columnWidth / 2;
//     let y = -(verticalResolution - 0.5) * edgeLength / 2;

//     // fill the array of positions following a zig-zag pattern
//     for (let i = 0; i < horizontalResolution; i++) {
//         // go down the first column
//         for (let j = 0; j < verticalResolution; j++) {
//             positions.push(x + columnWidth * i);
//             positions.push(y + edgeLength * j);
//             positions.push(0);

//             positions.push(x + columnWidth * (i + 1));
//             positions.push(y + edgeLength * j + halfRowHeight);
//             positions.push(0);
//         }

//         // step into the second column
//         i++;

//         if (i >= horizontalResolution) {
//             break;
//         }

//         // go up the second column
//         for (let j = 0; j < verticalResolution; j++) {
//             positions.push(x + columnWidth * i);
//             positions.push(y + edgeLength * (verticalResolution - j - 1) + halfRowHeight);
//             positions.push(0);

//             positions.push(x + columnWidth * (i + 1));
//             positions.push(y + edgeLength * (verticalResolution - j - 1));
//             positions.push(0);
//         }
//     }

//     return positions;
// }

export function hexBuffer(edgeLength, aspectRatio) {
    const positions = [];

    // compute parameters for the spacing between points
    const halfRowHeight = edgeLength * 0.5;
    const columnWidth = edgeLength * Math.cos(Math.PI / 6);

    verticalResolution = Math.ceil(1 / edgeLength) + 1;
    horizontalResolution = Math.ceil(aspectRatio / columnWidth);

    let x = -horizontalResolution * columnWidth / 2;
    let y = -(verticalResolution - 0.5) * edgeLength / 2;

    for (let i = 0; i < horizontalResolution; i++) {
        // go down the first column
        for (let j = 0; j < verticalResolution - 1; j++) {
            positions.push(x + columnWidth * i);
            positions.push(y + edgeLength * j);
            positions.push(0);

            positions.push(x + columnWidth * (i + 1));
            positions.push(y + edgeLength * j + halfRowHeight);
            positions.push(0);

            positions.push(x + columnWidth * i);
            positions.push(y + edgeLength * (j + 1));
            positions.push(0);

            positions.push(x + columnWidth * (i + 1));
            positions.push(y + edgeLength * j + halfRowHeight);
            positions.push(0);

            positions.push(x + columnWidth * (i + 1));
            positions.push(y + edgeLength * (j + 1) + halfRowHeight);
            positions.push(0);

            positions.push(x + columnWidth * i);
            positions.push(y + edgeLength * (j + 1));
            positions.push(0);
        }

        // step into the second column
        i++;

        if (i >= horizontalResolution) {
            break;
        }

        // go up the second column
        for (let j = 0; j < verticalResolution - 1; j++) {
            positions.push(x + columnWidth * (i + 1));
            positions.push(y + edgeLength * j);
            positions.push(0);

            positions.push(x + columnWidth * (i + 1));
            positions.push(y + edgeLength * (j + 1));
            positions.push(0);

            positions.push(x + columnWidth * i);
            positions.push(y + edgeLength * j + halfRowHeight);
            positions.push(0);

            positions.push(x + columnWidth * i);
            positions.push(y + edgeLength * j + halfRowHeight);
            positions.push(0);

            positions.push(x + columnWidth * (i + 1));
            positions.push(y + edgeLength * (j + 1));
            positions.push(0);

            positions.push(x + columnWidth * i);
            positions.push(y + edgeLength * (j + 1) + halfRowHeight);
            positions.push(0);
        }
    }

    return positions;
}

export function getNeighbors(vertexIndex) {
    const neighbors = [];

    const row = getRow(vertexIndex);
    const column = getColumn(vertexIndex);

    neighbors.push(getIndex(row - 1,                      column));
    neighbors.push(getIndex(row + 1,                      column));
    neighbors.push(getIndex(verticalResolution - row,     column - 1));
    neighbors.push(getIndex(verticalResolution - row - 1, column - 1));
    neighbors.push(getIndex(verticalResolution - row,     column + 1));
    neighbors.push(getIndex(verticalResolution - row - 1, column + 1));

    console.log(vertexIndex+"="+getIndex(row, column)+" ("+row+"/"+verticalResolution+","+column+"/"+horizontalResolution+")");

    return neighbors;
}

function getIndex(row, column) {
    if (row < 0 || row >= verticalResolution || column < 0 || column > horizontalResolution) {
        return -1;
    }

    if (column == horizontalResolution) {
        column -= 1;
        row = verticalResolution - row - 1;

        return (row + column * verticalResolution) * 2 + 1;
    }

    return (row + column * verticalResolution) * 2;
}

function getRow(index) {
    let row = Math.floor(index / 2) % verticalResolution;

    if (index % 2 == 1) {
        row = verticalResolution - row - 1;
    }

    return row;
}

function getColumn(index) {
    let column = Math.floor(index / (2 * verticalResolution));

    if (index % 2 == 1) {
        column += 1;
    }

    return column;
}
