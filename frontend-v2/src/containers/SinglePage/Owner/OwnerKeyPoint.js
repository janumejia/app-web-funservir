import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Heading from 'components/UI/Heading/Heading';
import Text from 'components/UI/Text/Text';
import OwnerWrapper from './Owner.style';
import Map from 'components/Map/Map';
import { Element } from 'react-scroll';
import { AuthContext } from 'context/AuthProvider';
import { Popover } from 'antd';
import { BiLinkExternal } from 'react-icons/bi';

let fullName = "";
let id = "";
let ownerAvatar = "";
let hasOwner = false;


const Owner = ({
  title,
  owner,
  modified,
}) => {
  const { loggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (owner && owner.name && owner.lastName && owner._id && owner.profilePicture) {
      fullName = owner.name + " " + owner.lastName;
      id = owner._id;
      ownerAvatar = owner.profilePicture;
      hasOwner = true;
    }
  }, [owner])

  return (
    // <Element name="Dueño del sitio" className="ownerclass">
    <OwnerWrapper modified={modified}>
      {hasOwner ? (
        loggedIn ?
          (
            <Link to={"/profile/" + id}>
              <Heading as="h2" content={title} />
              <div className="avatar-area">
                <div className="author-avatar">
                  <img src={ownerAvatar} alt={fullName} />
                </div>
                <div className="author-info">
                  <h3 className="author-name">{fullName}</h3>
                  <a
                  href={"/profile/" + id}
                    style={{
                      "display": "flex",
                      "justify-content": "left",
                      "align-items": "center",
                    }}
                    >
                      Ver perfil <BiLinkExternal style={{ "margin": "0 0 0 3px" }} />
                    </a>
                </div>
              </div>
            </Link>
          )
          :
          (
            <>
              <Heading as="h2" content={title} />
              <Popover
                content={"Debes iniciar sesión primero"}
                placement="bottomLeft"
                style={{
                  "display": "flex",
                  "align-items": "center"
                }}
              >
                <div className="avatar-area">
                  <div className="author-avatar">
                    <img src={ownerAvatar} alt={fullName} />
                  </div>
                  <div className="author-info">
                    <h3 className="author-name">{fullName}</h3>
                    <a
                    style={{
                      "display": "flex",
                      "justify-content": "left",
                      "align-items": "center",
                    }}
                    >
                      Ver perfil <BiLinkExternal style={{ "margin": "0 0 0 3px" }} />
                    </a>
                  </div>
                </div>
              </Popover>
            </>
          )
      ) : (
        <Heading as="h2" content="Sin información" />
      )}
    </OwnerWrapper>
  );
};

Owner.propTypes = {
  titleStyle: PropTypes.object,
  contentStyle: PropTypes.object,
};

Owner.defaultProps = {
  titleStyle: {
    color: '#2C2C2C',
    fontSize: ['17px', '20px', '25px'],
    lineHeight: ['1.15', '1.2', '1.36'],
    mb: '4px',
  },
  contentStyle: {
    fontSize: '15px',
    fontWeight: '400',
    color: '#2C2C2C',
    lineHeight: '1.6',
    mb: ['14px', '20px', '27px'],
  },
  boldContentStyle: {
    fontWeight: '700',
    mb: '0!important',
  },
  linkStyle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#008489',
  },
};

export default Owner;
