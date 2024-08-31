const gcd = (a, b) => {
    return b === 0 ? a : gcd(b, a % b);
};

export const calculateAspectRatio = (width, height) => {
    const divisor = gcd(width, height);
    const aspectWidth = width / divisor;
    const aspectHeight = height / divisor;
    return(`${aspectWidth}:${aspectHeight}`);
};