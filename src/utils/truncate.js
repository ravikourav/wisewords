export const truncateText = (comment, maxWords) => {
    if (!comment) return '';
    const words = comment.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : comment;
};

export const truncateTextByChars = (text, maxChars) => {
    if (!text) return '';
    return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
};
