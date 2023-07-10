import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Heading from 'components/UI/Heading/Heading';
import Text from 'components/UI/Text/Text';
import OwnerWrapper from './Owner.style';
import Map from 'components/Map/Map';
import { Element } from 'react-scroll';

let fullName = "";
let id = "";
let ownerAvatar = "";
let hasOwner = false;


const Owner = ({
  owner,
}) => {

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
    <OwnerWrapper>
      {hasOwner ? (
        <Link to={"/profile/" + id}>
          <Heading as="h2" content="Propietario" />
          <div className="avatar-area">
            <div className="author-avatar">
              <img src={ownerAvatar} alt={fullName} />
            </div>
            <div className="author-info">
              <h3 className="author-name">{fullName}</h3>
            </div>
          </div>
        </Link>
      ) : (
        <Heading as="h2" content="Sin propietario" />
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
