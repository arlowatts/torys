export function hexBuffer(edgeLength, aspectRatio) {
    const positions = [];

    // compute parameters for the spacing between points
    const halfRowHeight = edgeLength * 0.5;
    const columnWidth = edgeLength * Math.cos(Math.PI / 6);

    const verticalResolution = Math.ceil(1 / edgeLength) + 1;
    const horizontalResolution = Math.ceil(aspectRatio / columnWidth);

    const x = -horizontalResolution * columnWidth / 2;
    const y = -(verticalResolution - 0.5) * edgeLength / 2;

    // fill the array of positions following a zig-zag pattern
    for (let i = 0; i < horizontalResolution; i++) {
        // go down the first column
        for (let j = 0; j < verticalResolution; j++) {
            positions.push(x + columnWidth * i);
            positions.push(y + edgeLength * j);
            positions.push(0);

            positions.push(x + columnWidth * (i + 1));
            positions.push(y + edgeLength * j + halfRowHeight);
            positions.push(0);
        }

        // step into the second column
        i++;

        if (i >= horizontalResolution) {
            break;
        }

        // go up the second column
        for (let j = 0; j < verticalResolution; j++) {
            positions.push(x + columnWidth * i);
            positions.push(y + edgeLength * (verticalResolution - j - 1) + halfRowHeight);
            positions.push(0);

            positions.push(x + columnWidth * (i + 1));
            positions.push(y + edgeLength * (verticalResolution - j - 1));
            positions.push(0);
        }
    }

    return positions;
}
