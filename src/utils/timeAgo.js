function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);

    if (seconds < 1) {
        return 'Just now';
    }

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (const interval in intervals) {
        const value = Math.floor(seconds / intervals[interval]);
        if (value > 1) {
            return `${value} ${interval}s ago`;
        } else if (value === 1) {
            return `1 ${interval} ago`;
        }
    }

    return 'Just now';
}

export default timeAgo;
