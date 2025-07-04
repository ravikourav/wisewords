import './css/AnimatedLikeButton.css';

function AnimatedLikeButton({ liked, scale = 1 , onClick }) {
  return (
    <div onClick={onClick}
      className={`heart-icon ${liked ? 'liked' : ''}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    ></div>
  );
}

export default AnimatedLikeButton;
