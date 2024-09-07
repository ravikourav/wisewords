const message = {
    follow: 'has started following you',
    comment: 'has commented on your post',
    reply: 'has replied to your comment',
    postLike: 'Liked your post',
    commentLike: 'liked your comment',
    replyLike: 'liked your reply',
}

export const notificationMessage = (type, context = null) => {
    if (type === 'like' && context) {
        const likeMessages = {
            post: message.postLike,
            comment: message.commentLike,
            reply: message.replyLike,
        };
        return likeMessages[context];
    }
    
    return message[type];
}
