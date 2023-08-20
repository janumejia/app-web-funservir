import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import useToggle from './useToggle';
import FavoriteWrapper from './Favorite.style';
import { AuthContext } from 'context/AuthProvider';
import { Popover, message } from 'antd';
import axios from "settings/axiosConfig"; // Para la petición de registro

const Favorite = ({ className, content, onClick, isActive, _idSite, userData, setUserData }) => {
  const { loggedIn } = useContext(AuthContext);
  // use toggle hooks
  const [toggleValue, toggleHandler] = useToggle(isActive);
  const [loading, setLoading] = useState(false);

  // Add all classs to an array
  const addAllClass = ['favorite'];

  // className prop checking
  if (className) {
    addAllClass.push(className);
  }

  const handelClick = async (event) => {
    const isRequestOK = await sendFavorite();
    if(isRequestOK) {
      toggleHandler();
      onClick(!toggleValue);
    }
  };
  
  const sendFavorite = async () => {
    try {
      if (loggedIn) {
        // message.loading("Cargando favorito", 0);
        const res = await axios.post(`${process.env.REACT_APP_HOST_BACK}/handleFavorite`, { _idSite: _idSite, action: (toggleValue ? "discardFav" : "saveFav") });
        message.destroy();
        if (res) {
          if (res.status === 200) {
            setUserData({ ...userData, favorites: res.data.content.favorites })
            // message.success(res.data.message, 3);
            return true;
          } else message.warning("Error en la solicitud", 3);
        }
        console.log("reportar");
      }
    } catch (e) {
      message.destroy();
      message.warning("Error en la solicitud", 3);
    }
    return false;
  };

  return (
    <>
      {!loggedIn ?
        <Popover
          content={"Debes iniciar sesión primero"}
          trigger="hover"
          placement="bottom"
        >
          <FavoriteWrapper
            // onClick={handelClick}
            className={`${addAllClass.join(' ')} ${toggleValue ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.64 18.232">
              <path
                d="M60.16,56h-.04a4.551,4.551,0,0,0-3.8,2.08A4.551,4.551,0,0,0,52.52,56h-.04A4.522,4.522,0,0,0,48,60.52a9.737,9.737,0,0,0,1.912,5.308A33.506,33.506,0,0,0,56.32,72a33.506,33.506,0,0,0,6.408-6.172A9.737,9.737,0,0,0,64.64,60.52,4.522,4.522,0,0,0,60.16,56Z"
                transform="translate(-47 -55)"
              />
            </svg>
            <span>{content}</span>
          </FavoriteWrapper>
        </Popover>
        : 
        <FavoriteWrapper
          onClick={handelClick}
          className={`${addAllClass.join(' ')} ${toggleValue ? 'active' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.64 18.232">
            <path
              d="M60.16,56h-.04a4.551,4.551,0,0,0-3.8,2.08A4.551,4.551,0,0,0,52.52,56h-.04A4.522,4.522,0,0,0,48,60.52a9.737,9.737,0,0,0,1.912,5.308A33.506,33.506,0,0,0,56.32,72a33.506,33.506,0,0,0,6.408-6.172A9.737,9.737,0,0,0,64.64,60.52,4.522,4.522,0,0,0,60.16,56Z"
              transform="translate(-47 -55)"
            />
          </svg>
          <span>{content}</span>
        </FavoriteWrapper>
      }
    </>

  );
};

Favorite.propTypes = {
  /** ClassName of the Favorite */
  className: PropTypes.string,
  /** content of the Favorite */
  content: PropTypes.string,
  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value`.
   */
  onClick: PropTypes.func,
};

Favorite.defaultProps = {
  onClick: () => { },
};

export default Favorite;
