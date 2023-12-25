// get the height of the terrain at the given 3-dimensional coordinates
export function getTerrainHeight(x, y, z, levels) {
    let intensity = 0.25;
    let height = 0;

    for (let i = 0; i < levels; i++) {
        height += getNoise(x, y, z, intensity);
        x *= 2;
        y *= 2;
        z *= 2;
        intensity /= 2;
    }

    return height;
}

function getNoise(x, y, z, intensity) {
    return (Math.sin(x) + Math.sin(y) + Math.sin(z)) * intensity;
}
