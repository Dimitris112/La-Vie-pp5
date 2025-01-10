import React, { useState } from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import ReportForm from "../reports/ReportForm";

const Post = (props) => {
  const {
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
    views,
    postPage,
    setPosts,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const [showReportModal, setShowReportModal] = useState(false);

  const handleCloseReportModal = () => setShowReportModal(false);

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
    } catch (err) {
      // console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { post: id });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) =>
          post.id === id
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post
        ),
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) =>
          post.id === id
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post
        ),
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <>
      <Card className={styles.Post}>
        <Card.Body>
          <Media className="align-items-center justify-content-between">
            <Link to={`/profiles/${profile_id}`}>
              <Avatar src={profile_image} height={55} />
              {owner}
            </Link>
            <div className="d-flex flex-column align-items-end">
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
          <Card.Img src={image} alt={title} className={styles.PostImage} />
        </Link>

        <Card.Body>
          {title && <Card.Title className="text-center">{title}</Card.Title>}
          {content && <Card.Text>{content}</Card.Text>}

          <div
            className={styles.PostBar}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {is_owner ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>You can't like your own post!</Tooltip>}
              >
                <i className="far fa-heart" />
              </OverlayTrigger>
            ) : like_id ? (
              <span onClick={handleUnlike}>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Like post</Tooltip>}
                >
                  <i className={`fas fa-heart ${styles.Heart}`} />
                </OverlayTrigger>
              </span>
            ) : currentUser ? (
              <span onClick={handleLike}>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Like post</Tooltip>}
                >
                  <i className={`far fa-heart ${styles.HeartOutline}`} />
                </OverlayTrigger>
              </span>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Log in to like posts!</Tooltip>}
              >
                <i className="far fa-heart" />
              </OverlayTrigger>
            )}
            <span className="ml-1">{likes_count}</span>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Total comments</Tooltip>}
            >
              <Link to={`/posts/${id}`} className="ml-3">
                <i className="far fa-comments" />
              </Link>
            </OverlayTrigger>
            <span className="ml-1">{comments_count}</span>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Total views</Tooltip>}
            >
              <div className="ml-3 d-inline-flex align-items-center">
                <i className="fas fa-eye" />
                <span className="ml-1">{views}</span>
              </div>
            </OverlayTrigger>

            {currentUser ? (
              owner === currentUser.username ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>You can't report your own post!</Tooltip>}
                >
                  <span className={`${styles.ReportButton} ml-3`}>
                    <i className="far fa-flag" />
                  </span>
                </OverlayTrigger>
              ) : (
                <span
                  className={`${styles.ReportButton} ml-3`}
                  onClick={() => setShowReportModal(true)}
                >
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Report post</Tooltip>}
                  >
                    <i className="far fa-flag" />
                  </OverlayTrigger>
                </span>
              )
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Log in to report posts!</Tooltip>}
              >
                <span className={`${styles.ReportButton} ml-3`}>
                  <i className="far fa-flag" />
                </span>
              </OverlayTrigger>
            )}
          </div>
        </Card.Body>
      </Card>
      <ReportForm
        type="post"
        objectId={id}
        show={showReportModal}
        handleClose={handleCloseReportModal}
      />
    </>
  );
};

export default Post;
