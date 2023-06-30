import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';

const OwnerWrapper = styled.div`
  padding: 20px 0;
  .location_meta {
    margin-bottom: 29px;
  }
  a {
    &:hover {
      color: #31b8bd;
    }
  }

  .avatar-area {
    margin: 15px 0 0 0;
    display: flex;
    align-items: center;
    .author-avatar {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 20px;
      @media (max-width: 480px) {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .author-info {
      .author-name {
        color: ${themeGet('text.0', '#2C2C2C')};
        font-size: 15px;
        font-weight: 700;
        line-height: 18px;
        @media (max-width: 480px) {
          margin: 0 0 6px;
        }
      }
      .comment-date {
        color: ${themeGet('text.2', '#777777')};
        font-size: 13px;
        line-height: 16px;
      }
    }
  }
`;

export default OwnerWrapper;
