import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';

const SinglePageWrapper = styled.div`
  padding-bottom: 56px;
  @media (max-width: 480px) {
    margin-bottom: 30px;
  }
`;

export const LocationMeta = styled.div`
  color: ${themeGet('text.1', '#909090')};
  font-size: 13px;
  font-weight: 400;
`;

export const Title = styled.h2`
  color: ${themeGet('text.0', '#2C2C2C')};
  font-size: 25px;
  line-height: 34px;
  font-weight: 700;
  margin: 0 0 4px;
`;

export const RatingMeta = styled.div`
  display: flex;
  align-items: center;
  color: ${themeGet('text.0', '#2C2C2C')};
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 27px;
  @media (max-width: 767px) {
    margin-bottom: 20px;
  }

  i {
    color: ${themeGet('primary.0', '#008489')};
  }

  svg {
    fill: ${themeGet('primary.0', '#008489')};
  }

  strong {
    font-weight: 700;
    margin-left: 8px;
    margin-top: -2px;
  }
`;

export const Text = styled.p`
  color: ${themeGet('text.0', '#2C2C2C')};
  font-size: 15px;
  line-height: 24px;
  font-weight: 400;
  margin: 0 0 30px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const TextButton = styled.div`
  margin: 30px 0 30px;
  @media (max-width: 767px) {
    margin-top: 19px;
  }
`;

export const TobBarWrapper = styled.div`
  .sticky-outer-wrapper {
    .sticky-inner-wrapper {
      background-color: ${themeGet('color.1', '#ffffff')};

      .scrollbar {
        box-shadow: none;
        border-top: 1px solid ${themeGet('border.3', '#E6E6E6')};
        border-bottom: 1px solid ${themeGet('border.3', '#E6E6E6')};

        .scrollbar_left {
          margin-right: 25px;
          padding-left: 25px;

          a {
            color: ${themeGet('text.0', '#2C2C2C')};
            font-size: 16px;
            padding: 28px 20px;
            text-transform: capitalize;
            transition: color 0.2s ease-in-out;

            ${'' /* &:first-child {
              padding-left: 0;
            } */}

            @media (max-width: 1200px) {
              padding: 18px 20px;
            }

            &:hover {
              color: ${themeGet('primary.0', '#008489')};
            }

            &.active {
              font-weight: 700;
              color: ${themeGet('primary.0', '#008489')};
              border-bottom: 4px solid ${themeGet('primary.0', '#008489')};
            }
          }
        }

        .scrollbar_right {
          padding-right: 25px;

          button,
          .ant-btn {
            @media (max-width: 767px) {
              min-width: 50px;
              svg {
                margin-right: 0;
              }
              > span {
                display: none;
              }
            }
          }
        }
      }
    }

    &.isSticky {
      .sticky-inner-wrapper {
        > div {
          border: 0;
          box-shadow: 0 2px 5px -2px rgba(0, 0, 0, 0.16);
        }
      }
    }
  }
`;

export const ButtonGroup = styled.div`
  button,
  button.ant-btn {
    margin: 0 5px;
    height: 37px;
    min-width: 90px;
    padding: 0 5px;
    border: 1px solid ${themeGet('border.3', '#E6E6E6')};
    color: ${themeGet('text.0', '#2C2C2C')};
    font-size: 15px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
    svg {
      width: 18.309px;
      height: 15.537px;
      margin-right: 10px;
      path {
        fill: transparent;
        stroke: ${themeGet('text.0', '#2C2C2C')};
        stroke-width: 1.5px;
      }
    }

    &.active {
      svg {
        path {
          stroke: ${themeGet('color.4', '#FC5C63')};
          fill: ${themeGet('color.4', '#FC5C63')};
        }
      }
    }

    &:focus {
      outline: none;
    }
    &:hover {
      background-color: ${themeGet('color.2', '#F7F7F7')};
    }
    &:after {
      display: none;
    }

    &:first-child {
      margin-left: 0;
      svg {
        position: relative;
        top: 1px;
        path {
          stroke-width: 1.8px;
        }
      }
    }

    &:last-child {
      margin-right: 0;
    }
  }
`;

export const PostImage = styled.div`
  ${'' /* height: 683px; */}
  height: calc(100vh - 2 * 82px);
  position: relative;

  img.main-image {
    width: ${({ hasSecondAndThirdImage }) => (hasSecondAndThirdImage ? "66.6%" : "100%")};
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
    border-top-right-radius: ${({ hasSecondAndThirdImage }) => (hasSecondAndThirdImage ? "8px" : "0px")}; /* Added border radius */
    border-bottom-right-radius: ${({ hasSecondAndThirdImage }) => (hasSecondAndThirdImage ? "8px" : "0px")}; /* Added border radius */
  }

  .second-image,
  .third-image {
    position: absolute;
    object-fit: cover;
    border-top-left-radius: 8px; /* Added border radius */
    border-bottom-left-radius: 8px; /* Added border radius */
    display: ${({ hasSecondAndThirdImage }) => (hasSecondAndThirdImage ? "block" : "none")};
  }

  .second-image {
    width: 33%;
    height: 49.5%;
    top: 0;
    right: 0;
  }

  .third-image {
    width: 33%;
    height: 49.5%;
    bottom: 0;
    right: 0;
  }

  @media (max-width: 991px) {
    height: 406px;

    img.main-image {
      width: 100%;
      border-top-right-radius: 0px; /* Added border radius */
      border-bottom-right-radius: 0px; /* Added border radius */
    }

    .second-image,
    .third-image {
      display: none;
    }

  }

  .image_gallery_button {
    background: ${themeGet('color.1', '#ffffff')};
    border-radius: 3px;
    font-size: 17px;
    font-weight: 700;
    color: #2c2c2c;
    border: 1px solid;
    border-color: transparent;
    height: 37px;
    ${'' /* box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16); */}
    position: absolute;
    bottom: 30px;
    right: 25px;
    cursor: pointer;

    .button-icon {
      margin-right: 8px; /* Adjust the spacing between icon and text */
      margin-top: 3px;
    }

    :hover {
      border-color: black;
    }

    :hover,
    :focus {
      background: ${themeGet('color.2', '#E6E6E6')};
      color: ${themeGet('text.0', '#2C2C2C')};
    }
  }
`;

export const PostImageKeyPoint = styled.div`
  /* height: calc(100vh - 2 * 82px); */
  height: ${({ hasFirstImage }) => (hasFirstImage ? "400px" : "0px")};
  position: relative;

  img.main-image {
    width: ${({ hasSecondAndThirdImage }) => (hasSecondAndThirdImage ? "66.6%" : "100%")};
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
    border-radius: "8px"; /* Added border radius */
  }

  .second-image,
  .third-image {
    position: absolute;
    object-fit: cover;
    border-radius: 8px; /* Added border radius */
    display: ${({ hasSecondAndThirdImage }) => (hasSecondAndThirdImage ? "block" : "none")};
  }

  .second-image {
    width: 33%;
    height: 49.5%;
    top: 0;
    right: 0;
  }

  .third-image {
    width: 33%;
    height: 49.5%;
    bottom: 0;
    right: 0;
  }

  @media (max-width: 991px) {
    height: 406px;

    img.main-image {
      width: 100%;
      border-top-right-radius: 0px; /* Added border radius */
      border-bottom-right-radius: 0px; /* Added border radius */
    }

    .second-image,
    .third-image {
      display: none;
    }

  }

  .image_gallery_button {
    background: ${themeGet('color.1', '#ffffff')};
    border-radius: 3px;
    font-size: 17px;
    font-weight: 700;
    color: #2c2c2c;
    border: 1px solid;
    border-color: transparent;
    height: 37px;
    ${'' /* box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16); */}
    position: absolute;
    bottom: 30px;
    right: 25px;
    padding: 8px;
    cursor: pointer;

    .button-icon {
      margin-right: 8px; /* Adjust the spacing between icon and text */
      margin-top: 3px;
    }

    :hover {
      border-color: black;
    }

    :hover,
    :focus {
      background: ${themeGet('color.2', '#E6E6E6')};
      color: ${themeGet('text.0', '#2C2C2C')};
    }
  }
`;

export default SinglePageWrapper;
