function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);

    const intervals = {
        y: 31536000,
        m: 2592000,
        w: 604800,
        d: 86400,
        h: 3600,
        min: 60,
        s: 1
    };

    for (const interval in intervals) {
        const value = Math.floor(seconds / intervals[interval]);
        if (value > 1) {
            return `${value} ${interval}`;
        } else if (value === 1) {
            return `${value} ${interval}`;
        }
    }

    return 'Just now';
}

export default timeAgo;