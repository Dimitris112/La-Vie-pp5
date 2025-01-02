import React from "react";
import { Link, useHistory } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";

const Post = ({
  id,
  owner,
  profile_id,
  profile_image,
  comments_count,
  likes_count,
  like_id,
  title,
  content,
  image,
  updated_at,
  postPage,
  setPosts,
}) => {
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  // Helper function to update post data
  const updatePostData = (postId, changes) => {
    setPosts((prevPosts) => ({
      ...prevPosts,
      results: prevPosts.results.map((post) =>
        post.id === postId ? { ...post, ...changes } : post
      ),
    }));
  };

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
    } catch (err) {
      alert("Failed to delete the post. Please try again.");
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { post: id });
      updatePostData(id, { likes_count: likes_count + 1, like_id: data.id });
    } catch (err) {
      alert("Failed to like the post. Please try again.");
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      updatePostData(id, { likes_count: likes_count - 1, like_id: null });
    } catch (err) {
      alert("Failed to unlike the post. Please try again.");
    }
  };

  return (
    <Card className={styles.Post}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link
            to={`/profiles/${profile_id}`}
            className="d-flex align-items-center"
          >
            <Avatar src={profile_image} height={55} />
            <span className="ml-2">{owner}</span>
          </Link>
          <div className="d-flex align-items-center">
            <span className="text-muted small">{updated_at}</span>
            {is_owner && postPage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/posts/${id}`}>
        <Card.Img src={image} alt={title} className={styles.Image} />
      </Link>
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        {content && <Card.Text>{content}</Card.Text>}
        <div className={styles.PostBar}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i
                className="far fa-heart text-muted"
                aria-label="Cannot like own post"
              />
            </OverlayTrigger>
          ) : like_id ? (
            <span onClick={handleUnlike} aria-label="Unlike post">
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike} aria-label="Like post">
              <i className={`far fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like posts!</Tooltip>}
            >
              <i
                className="far fa-heart text-muted"
                aria-label="Log in to like post"
              />
            </OverlayTrigger>
          )}
          <span>{likes_count}</span>
          <Link to={`/posts/${id}`}>
            <i className="far fa-comments" aria-label="View comments" />
          </Link>
          <span>{comments_count}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;
