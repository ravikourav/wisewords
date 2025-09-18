import { useState, useRef, useEffect } from "react";
import "./css/DetailedCard.css";
import Card from "../components/Card.js";
import { formatNumber } from "../utils/formatNumbers.js";
import Button from "../components/Button.js";
import Loading from "../components/Loading.js";
import { useMediaQuery } from "react-responsive";
import { Link, useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import BackButton from "../components/BackButton.js";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import { calculateAspectRatio } from "../utils/calculateDimensions.js";
import Badge from "../components/Badge.js";
import { useAlert } from "../context/AlertContext.js";
import SearchBar from "../components/SearchBar.js";

//icons
import { CiPause1 } from "react-icons/ci";
import { ReactComponent as LikeIcon } from "../assets/icon/like.svg";
import { ReactComponent as CopyIcon } from "../assets/icon/copy.svg";
import { ReactComponent as PlayIcon } from "../assets/icon/play.svg";
import { ReactComponent as CommentIcon } from "../assets/icon/comment.svg";
import Dropdown from "../components/Dropdown.js";
import timeAgo from "../utils/timeAgo.js";
import RenderProfileImage from "../components/RenderProfileImage.js";
import CommentScection from "../components/CommentScection.js";

function DetailedCard({ data = null }) {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const id = data?._id || paramId;
  const { isLoggedIn, user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isFollowing, setIsFollowing] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [cardWidth, setCardWidth] = useState("");
  // eslint-disable-next-line
  const [cardHeight, setCardHeight] = useState("");

  const [showCommentSection, setShowCommentSection] = useState(false);

  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const utteranceRef = useRef(null);

  const featchCardData = async () => {
    setLoading(true);
    const headers = {
      "Content-Type": "application/json",
    };
    const token = Cookies.get("authToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${id}`;
    const response = await axios.get(endpoint, { headers });
    setCardData(response.data);
    setLikes(response.data.likeCount);
    console.log(response.data);
    if (isLoggedIn) {
      await followStatus(response.data);
    } else {
      setLoading(false);
    }
  };

  const followStatus = async (data) => {
    if (user._id === data.owner_id._id) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
      setIsFollowing(user.following.includes(data.owner_id._id));
    }
    await likeStatus(data);
    dimension(data);
  };

  const likeStatus = async (data) => {
    setLiked(data.hasLiked);
    setLoading(false);
  };

  const dimension = (data) => {
    const ratio = calculateAspectRatio(data.width, data.height);
    const [aspectWidth, aspectHeight] = ratio.split(":").map(Number);
    if (aspectWidth > aspectHeight) {
      const newWidth = Math.min(window.innerWidth * 0.56, data.width);
      const newHeight = newWidth / (aspectWidth / aspectHeight);
      setCardWidth(newWidth + "px");
      setCardHeight(newHeight + "px");
    } else {
      const newHeight = Math.min(window.innerHeight * 0.78, data.height);
      const newWidth = newHeight * (aspectWidth / aspectHeight);
      setCardWidth(newWidth + "px");
      setCardHeight(newHeight + "px");
    }
  };

  useEffect(() => {
    if (data) {
      setCardData(data);
      console.log("data from props : ", data);
      setLoading(false);
    } else {
      featchCardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const followUnfollowOwner = async () => {
    const token = Cookies.get("authToken");
    const endpoint = isFollowing
      ? `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${cardData.owner_id._id}/unfollow`
      : `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${cardData.owner_id._id}/follow`;

    try {
      const response = await axios.post(
        endpoint,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsFollowing(!isFollowing);
        cardData.owner_id.followers = response.data.followers;
        if (isFollowing) {
          // Remove the owner ID from the following array
          setUser((prevUser) => ({
            ...prevUser,
            following: prevUser.following.filter(
              (id) => id !== cardData.owner_id._id
            ),
          }));
          console.log("User unfollowed successfully");
        } else {
          // Add the owner ID to the following array
          setUser((prevUser) => ({
            ...prevUser,
            following: [...prevUser.following, cardData.owner_id._id],
          }));
          console.log("User followed successfully");
        }
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  const handleLike = async () => {
    const token = Cookies.get("authToken");
    const endpoint = liked
      ? `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${id}/unlike`
      : `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${id}/like`;
    try {
      const response = await axios.post(
        endpoint,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setLikes(liked ? likes - 1 : likes + 1);
        setLiked(!liked);
        cardData.likes = response.data.likes;
        console.log(
          liked ? "post unliked succesfully" : "post liked succesfully"
        );
      }
    } catch (error) {
      showAlert(
        liked ? "Error while liking post" : "Error while liking post",
        "error"
      );
    }
  };

  const handleTextToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      if (!isPlaying) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = speechSynthesis
          .getVoices()
          .find((voice) => voice.lang === "en-US");
        utterance.onend = () => setIsPlaying(false); // Reset playing state when speech ends
        speechSynthesis.speak(utterance);
        utteranceRef.current = utterance; // Store the utterance instance
        setIsPlaying(true);
      } else {
        speechSynthesis.pause();
        setIsPlaying(false);
      }
    } else {
      showAlert("your browser does not support text to speech.", "error");
    }
  };

  const handleResume = () => {
    if ("speechSynthesis" in window && speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  const handleSpeak = () => {
    if (isPlaying) {
      speechSynthesis.pause();
      setIsPlaying(false);
    } else if (speechSynthesis.paused) {
      handleResume();
    } else {
      handleTextToSpeech(`${cardData.author} said, "${cardData.content}"`);
    }
  };

  const handleCopy = () => {
    const textToCopy = `${cardData.author} said, "${cardData.content}"`;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
          fallbackCopyTextToClipboard(textToCopy);
        });
    } else {
      fallbackCopyTextToClipboard(textToCopy);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      showAlert("Oops, unable to copy", "error");
    }

    document.body.removeChild(textArea);
  };

  const editPost = () => {
    navigate(`/updatePost/${id}`);
  };

  const handleClose = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const deletePost = async () => {
    setLoading(true);
    const token = Cookies.get("authToken");
    const endpoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/post/${id}`;
    try {
      await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      navigate(-1);
    } catch {
      showAlert("Error Deleting this Post", "error");
    }
  };

  return (
    <div className="page-root detailed-page-layout">
      <div className="searchbar-header-container">
        <BackButton onClick={handleClose} />
        <SearchBar />
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="content-wrapper">
            <div className="card-container">
              <div className="post-owner-container">
                <div className="flex-row">
                  <Link to={`/user/${cardData.owner_id.username}`}>
                    <RenderProfileImage
                      source={cardData.owner_id.profile}
                      className="post-owner-profile-image"
                    />
                  </Link>
                  <div className="flex-column">
                    <p
                      onClick={() => {
                        navigate(`/user/${cardData.owner_id.username}`);
                      }}
                      className="post-owner-name"
                    >
                      {cardData.owner_id.name}{" "}
                      <Badge badge={cardData.owner_id.badge} size={16} />
                    </p>
                    <p className="post-owner-followers">
                      {formatNumber(cardData.owner_id.followers.length)}{" "}
                      followers
                    </p>
                  </div>
                </div>
                {isOwner ? (
                  <Dropdown
                    size={25}
                    showIcon={true}
                    options={[
                      { label: "Edit", onClick: editPost },
                      { label: "Delete", onClick: deletePost },
                    ]}
                    iconOrientation="vertical"
                    menuPosition="bottom-right"
                  />
                ) : (
                  <Button
                    onClick={followUnfollowOwner}
                    disabled={!isLoggedIn}
                    text={isFollowing ? "Following" : "Follow"}
                    selected={isFollowing}
                  />
                )}
              </div>
              <Card
                sizeCustom={true}
                width={isMobile ? "" : cardWidth}
                margin={false}
                content={cardData.content}
                textColor={cardData.contentColor}
                author={"-" + cardData.author}
                authorColor={cardData.authorColor}
                background={cardData.backgroundImage}
                tint={cardData.tintColor}
              />
              <div className="detailed-card-post-info">
                <p className="detailed-card-post-title">{cardData.title}</p>
                <p className="detailed-card-post-tag">
                  {cardData.tags.map((tag, index) => (
                    <span key={index}>#{tag} </span>
                  ))}
                </p>
                <p className="detailed-card-post-time">
                  {timeAgo(cardData.createdAt)}
                </p>
              </div>
            </div>
          </div>
          <div className="post-controle-wrapper">
            <div className="post-controle">
              <div
                onClick={isLoggedIn ? handleLike : null}
                className={`control-wrapper ${
                  isLoggedIn ? "" : "control-wrapper-disabled"
                }`}
              >
                <LikeIcon
                  fill={liked ? "red" : "white"}
                  stroke={isLoggedIn ? (liked ? "red" : "black") : "darkgray"}
                  strokeWidth="1.5"
                  className="post-icon"
                />
                <p className="controle-label">
                  {formatNumber(cardData.likesCount)}
                </p>
              </div>
              <div
                className="control-wrapper"
                onClick={() => {
                  setShowCommentSection(true);
                }}
              >
                <CommentIcon className="post-icon" />
                <p className="controle-label">
                  {formatNumber(cardData.commentsCount)}
                </p>
              </div>
              <div className="control-wrapper" onClick={handleSpeak}>
                {!isPlaying ? (
                  <PlayIcon className="post-icon" />
                ) : (
                  <CiPause1 className="post-icon" />
                )}
                <p className="controle-label">{isPlaying ? "Pause" : "Play"}</p>
              </div>
              <div className="control-wrapper" onClick={handleCopy}>
                <CopyIcon className="post-icon" />
                <p className="controle-label">{!copied ? "Copy" : "Copied"}</p>
              </div>
            </div>
          </div>
        </>
      )}
      <CommentScection
        postId={id}
        visibilty={showCommentSection}
        onClose={() => {
          setShowCommentSection(false);
        }}
      />
    </div>
  );
}

export default DetailedCard;
