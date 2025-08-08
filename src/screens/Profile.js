import { useState, useEffect } from "react";
import "./css/Profile.css";
import { useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import CardGrid from "../components/CardGrid.js";
import Cookies from "js-cookie";
import axios from "axios";
import Loading from "../components/Loading.js";
import { useAuth } from "../context/AuthContext.js";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.js";
import IconButton from "../components/IconButton.js";
import Badge from "../components/Badge.js";
import BackButton from "../components/BackButton.js";
import SearchBar from "../components/SearchBar.js";
import NotificationModel from "../components/NotificationModel.js";
import { useReport } from "../context/ReportContext.js";
import { useNotification } from "../context/NotificationContext.js";

//icons
import { ReactComponent as ShareIcon } from "../assets/icon/share.svg";
import { ReactComponent as BellIcon } from "../assets/icon/bell.svg";
import Dropdown from "../components/Dropdown.js";
import ProfileSetting from "../components/ProfielSetting.js";
import RenderProfileImage from "../components/RenderProfileImage.js";

function Profile() {
  const navigate = useNavigate();
  const { openReport } = useReport();
  const { username } = useParams();
  const { logout, user, updateUser, isLoggedIn } = useAuth();
  const { unreadCount } = useNotification();

  // user data of username
  const [data, setData] = useState(null);

  // posts by user in pagenation
  const [postedData, setPostedData] = useState([]);
  const [postPage, setPostPage] = useState(1);
  const [postHasMore, setPostHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // saved posts by user in pagenation
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedPage, setSavedPage] = useState(1);
  const [savedHasMore, setSavedHasMore] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(false);

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("posts");
  const [tab, setTab] = useState("home");

  const [followerUsers, setFollowerUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);

  const [followLoading, setFollowLoading] = useState(false);
  const [loadingFol, setLoadingFol] = useState(false);

  const [isOwner, setIsOwner] = useState(false);
  const [isFollowing, setIsFollowing] = useState(null);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    const checkOwner = (id) => {
      if (user?._id === id) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
        setIsFollowing(user?.following.includes(id));
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const endPoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${username}`;
        const response = await axios.get(endPoint);
        setData(response.data);
        checkOwner(response.data._id);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username, user]);

  const fetchUserPosts = async (page = 1) => {
    if (!data) return;

    setLoadingPosts(true);

    try {
      const endPoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${data.username}/posts?page=${page}&limit=10`;
      const res = await axios.get(endPoint);
      console.log(endPoint);

      if (page === 1) {
        setPostedData(res.data.posts);
      } else {
        setPostedData((prev) => [...prev, ...res.data.posts]);
      }

      setPostHasMore(page < res.data.totalPages);
      setPostPage(page);
      console.log(res.data.posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchSavedPosts = async (page = 1) => {
    if (!data) return;

    setLoadingSaved(true);

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${data.username}/saved?page=${page}&limit=10`
      );

      if (page === 1) {
        setSavedPosts(res.data.posts);
      } else {
        setSavedPosts((prev) => [...prev, ...res.data.posts]);
      }

      setSavedHasMore(page < res.data.totalPages);
      setSavedPage(page);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    if (data) {
      setTab("home");
      //reset posts pagenation
      setPostedData([]);
      setPostPage(1);
      setPostHasMore(true);

      //reset saved posts pagenation
      setSavedPosts([]);
      setSavedPage(1);
      setSavedHasMore(true);
    }
  }, [data]);

  useEffect(() => {
    if (!data) return;

    if (selected === "posts" && postedData.length === 0) {
      fetchUserPosts(1);
    }

    if (selected === "saved" && savedPosts.length === 0) {
      fetchSavedPosts(1);
    }
    // eslint-disable-next-line
  }, [selected, data]);

  useEffect(() => {
    const fetchUserList = async (setter) => {
      setLoadingFol(true);
      try {
        const endPoint = `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${data._id}/${tab}`;
        const response = await axios.get(endPoint);
        setter(response.data);
      } catch (error) {
        console.error("Error fetching user list:", error);
      } finally {
        setLoadingFol(false);
      }
    };

    if (tab === "followers" && data?.followers?.length > 0) {
      fetchUserList(setFollowerUsers);
    }

    if (tab === "following" && data?.following?.length > 0) {
      fetchUserList(setFollowingUsers);
    }
  }, [tab, data]);

  // mobile view tab change
  useEffect(() => {
    if (!isMobile && tab === "notification") {
      setTab("home");
    }
  }, [isMobile, tab]);

  // handel button clicks
  const displayData = selected === "posts" ? postedData : savedPosts;

  const selectContent = (select) => {
    setSelected(select);
  };

  const handleShare = async (url) => {
    const encodedUrl = encodeURIComponent(url);

    if (navigator.share) {
      try {
        await navigator.share({
          url: encodedUrl,
        });
      } catch (error) {
        console.error("Error sharing content:", error);
      }
    } else {
      console.log("Web Share API is not supported in your browser.");
    }
  };

  const handleProfileClick = (username) => {
    navigate(`/user/${username}`);
  };

  const followUnfollowOwner = async () => {
    const token = Cookies.get("authToken");
    const prevState = isFollowing;

    // Optimistically toggle UI
    setIsFollowing(!isFollowing);
    setFollowLoading(true);

    const endpoint = prevState
      ? `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${data._id}/unfollow`
      : `${process.env.REACT_APP_BACKEND_API_URL}/api/user/${data._id}/follow`;

    try {
      const response = await axios.post(
        endpoint,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        // rollback if error
        setIsFollowing(prevState);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      setIsFollowing(prevState); // rollback
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUpdateClose = () => {
    updateUser();
    setTab("home");
  };

  return (
    <div className="page-root">
      {tab === "home" && (
        <>
          <div className="searchbar-header-container">
            <SearchBar />
            {isMobile && (
              <div style={{ position: "relative" }}>
                <BellIcon
                  fill="white"
                  stroke="black"
                  className="icon"
                  onClick={() => setTab("notification")}
                />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 2,
                      border: "3px solid white",
                      right: 2,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "red",
                    }}
                  />
                )}
              </div>
            )}
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="profile-page">
              <div className="profile-img-container">
                {data.coverImg && (
                  <img className="cover-img" src={data.coverImg} alt="" />
                )}
                <RenderProfileImage
                  source={data.profile}
                  className="profile-img"
                />
              </div>
              {data && (
                <div className="user-profile-info">
                  <p className="user-name">
                    {data.name} <Badge badge={data.badge} size={26} />
                  </p>
                  <p className="user-bio">{data.bio}</p>
                  <p className="user-id">@{data.username}</p>
                  <div className="follow-container">
                    <div className="user-data-wrapper">
                      <p className="user-data">{data.posts.length}</p>
                      <p className="user-data-label">Posts</p>
                    </div>
                    <div
                      className="user-data-wrapper"
                      onClick={() => setTab("followers")}
                    >
                      <p className="user-data">{data.followers.length}</p>
                      <p className="user-data-label">Followers</p>
                    </div>
                    <div
                      className="user-data-wrapper"
                      onClick={() => setTab("following")}
                    >
                      <p className="user-data">{data.following.length}</p>
                      <p className="user-data-label">Following</p>
                    </div>
                  </div>
                </div>
              )}
              {isOwner ? (
                <div className="profile-control">
                  <div className="control-button">
                    <IconButton
                      icon={ShareIcon}
                      onClick={() => handleShare(data.username)}
                      size="25px"
                    />
                  </div>
                  <div className="control-button">
                    <Button text="Logout" selected={true} onClick={logout} />
                  </div>
                  <div className="control-button">
                    <Dropdown
                      showIcon={true}
                      options={[
                        {
                          label: "Edit Profile",
                          onClick: () => setTab("settings"),
                        },
                      ]}
                      menuPosition="top-right"
                    />
                  </div>
                </div>
              ) : (
                <div className="profile-control">
                  <div className="control-button">
                    <IconButton
                      icon={ShareIcon}
                      size="25px"
                      onClick={handleShare}
                    />
                  </div>
                  <div className="control-button">
                    <Button
                      text={
                        followLoading
                          ? "Loading..."
                          : isFollowing
                          ? "Following"
                          : "Follow"
                      }
                      selected={isFollowing}
                      disabled={!isLoggedIn || followLoading}
                      onClick={followUnfollowOwner}
                    />
                  </div>
                  <div className="control-button">
                    <Dropdown
                      showIcon={true}
                      options={[
                        {
                          label: "Report",
                          onClick: () => openReport("user", data._id),
                        },
                      ]}
                      menuPosition="top-right"
                    />
                  </div>
                </div>
              )}
              <div className="post-selector-container">
                <p
                  className={`post-selector ${
                    selected === "posts" && "post-selected"
                  }`}
                  onClick={() => selectContent("posts")}
                >
                  {isOwner ? "Your Posts" : "Created"}
                </p>
                {isOwner && (
                  <p
                    className={`post-selector ${
                      selected === "saved" && "post-selected"
                    }`}
                    onClick={() => selectContent("saved")}
                  >
                    Saved
                  </p>
                )}
              </div>
              <>
                <CardGrid data={displayData} header={false} footer={false} />

                {/* Loading indicator for initial load */}
                {displayData.length === 0 && (loadingPosts || loadingSaved) && (
                  <Loading />
                )}

                {/* Load more buttons or loading indicator for more data */}
                {selected === "posts" && (
                  <>
                    {postHasMore && !loadingPosts && (
                      <div className="load-more-container">
                        <Button
                          text="More"
                          onClick={() => fetchUserPosts(postPage + 1)}
                        />
                      </div>
                    )}
                    {loadingPosts && postPage > 1 && <Loading />}
                  </>
                )}

                {selected === "saved" && (
                  <>
                    {savedHasMore && !loadingSaved && (
                      <div className="load-more-container">
                        <Button
                          text="More"
                          onClick={() => fetchSavedPosts(savedPage + 1)}
                        />
                      </div>
                    )}
                    {loadingSaved && savedPage > 1 && <Loading />}
                  </>
                )}
              </>
            </div>
          )}
        </>
      )}
      {tab === "followers" && (
        <>
          <div className="pannel-header" onClick={() => setTab("home")}>
            <BackButton onClick={() => setTab("home")} />
            <h2 className="pannel-title">Followers</h2>
          </div>
          {loadingFol ? (
            <Loading />
          ) : (
            <div className="followers-container">
              {/* Followers List */}
              {followerUsers.length > 0 ? (
                <div className="user-list">
                  {followerUsers.map((user) => (
                    <div
                      key={user._id}
                      className="user-card"
                      onClick={() => handleProfileClick(user.username)}
                    >
                      <RenderProfileImage
                        source={user.profile}
                        className="ff-profile-img"
                      />
                      <div className="ff-user-info">
                        <h3 className="ff-user-name">
                          {user.name} <Badge badge={user.badge} size={26} />
                        </h3>
                        <h3 className="ff-user-username">@{user.username}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-container">
                  <p className="empty-state-message">
                    Even the wisest voices begin in silence.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
      {tab === "following" && (
        <>
          <div className="pannel-header" onClick={() => setTab("home")}>
            <BackButton onClick={() => setTab("home")} />
            <h2 className="pannel-title">Following</h2>
          </div>
          {loadingFol ? (
            <Loading />
          ) : (
            <div className="following-container">
              {/* Following List */}
              {followingUsers.length > 0 ? (
                <div className="user-list">
                  {followingUsers.map((user) => (
                    <div
                      key={user._id}
                      className="user-card"
                      onClick={() => handleProfileClick(user.username)}
                    >
                      <RenderProfileImage
                        source={user.profile}
                        className="ff-profile-img"
                      />
                      <div className="ff-user-info">
                        <h3 className="ff-user-name">
                          {user.name} <Badge badge={user.badge} size={26} />
                        </h3>
                        <h3 className="ff-user-username">@{user.username}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-container">
                  <p className="empty-state-message">
                    Your path is empty — find voices worth hearing.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
      {tab === "notification" && (
        <>
          <div className="pannel-header" onClick={() => setTab("home")}>
            <BackButton onClick={() => setTab("home")} />
            <h2 className="pannel-title">Updates</h2>
          </div>
          {loadingFol ? (
            <Loading />
          ) : (
            <NotificationModel onClick={() => setTab("home")} />
          )}
        </>
      )}
      {tab === "settings" && <ProfileSetting onClose={handleUpdateClose} />}
    </div>
  );
}

export default Profile;
