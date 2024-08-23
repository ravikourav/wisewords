export function getImageDimensions(screenWidth, screenHeight, imageWidth, imageHeight) {
    const maxScreenWidth = screenWidth * 0.9;
    const maxScreenHeight = screenHeight * 0.9;

    return calculateAspectRatioFit(imageWidth, imageHeight, maxScreenWidth, maxScreenHeight);
}

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth * ratio, height: srcHeight * ratio };
}