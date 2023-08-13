import React, { useState, Fragment } from 'react';
import { Tooltip } from 'antd';
import {
  LikeOutlined,
  LikeFilled,
  DislikeOutlined,
  DislikeFilled,
} from '@ant-design/icons';
import { BiSolidTimeFive } from 'react-icons/bi';
import axios from "../../../settings/axiosConfig"; // Para la petición de registro


const LikeDislike = ({ _id, loggedIn, isLikeSelected, isDislikeSelected, likesCount, dislikesCount }) => {
  const [state, setState] = useState({
    likes: likesCount && typeof likesCount === "number" ? likesCount : 0,
    dislikes: dislikesCount && typeof dislikesCount === "number" ? dislikesCount : 0,
    action: isLikeSelected ? 'liked' : (isDislikeSelected ? 'disliked' : ''),
  });

  const sendLikeDislike = async (action) => {
    const res = await axios.post(`${process.env.REACT_APP_HOST_BACK}/addLikeDislike`, { _id: _id, action: action });
    console.log("res: ", res)
    if (res && res.status === 200 && res.data && res.data.content) {
      console.log("entra")
      setState({
        action: res.data.content.action,
        likes: res.data.content.likes,
        dislikes: res.data.content.dislikes,
      });
    } else {
      setState({
        ...state,
        action: '',
      });
    }
  }

  const handleLike = async () => {
    if (loggedIn) {
      setState({
        ...state,
        action: 'loading',
      });
      await sendLikeDislike("like");
    }
  };

  const handleDisLike = async () => {
    if (loggedIn) {
      setState({
        ...state,
        action: 'loading',
      });
      await sendLikeDislike("dislike");
    }
  };

  return (
    <Fragment>
      <span className="comment-helpful">
        <Tooltip title={loggedIn ? "Me gusta" : "Debes iniciar sesión"}>
          {state.action === 'liked' ? (
            <LikeFilled onClick={handleLike} />
          ) : (
            state.action === 'loading' ?
              <BiSolidTimeFive />
              :
              <LikeOutlined onClick={handleLike} />
          )}
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{state.likes}</span>
      </span>
      <span className="comment-report">
        <Tooltip title={loggedIn ? "No me gusta" : "Debes iniciar sesión"}>
          {state.action === 'disliked' ? (
            <DislikeFilled onClick={handleDisLike} />
          ) : (
            state.action === 'loading' ?
              <BiSolidTimeFive />
              :
              <DislikeOutlined onClick={handleDisLike} />
          )}
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{state.dislikes}</span>
      </span>
    </Fragment>
  );
};

export default LikeDislike;
