import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
const DescriptionWrapper = styled.div`
  padding: 0 0 29px;

  button {
    font-size: 15px;
    font-weight: 700;
    border: 0;
    padding: 0;
    height: auto;
    line-height: 1;
    box-shadow: none;
    text-shadow: none;
    color: ${themeGet('primary.0', '#008489')};

    &:hover,
    &:focus {
      color: ${themeGet('primary.1', '#399C9F')};
    }

    &::after {
      content: none;
    }
  }

  .tag-class {
    margin: 0 0 0 7px;
    fontSize: '36px';
  }

  .divider-class {
    margin: 15px 0;
  }

  .divider-class-keypoint {
    margin: 15px 0 20px 0;
  }
`;

export default DescriptionWrapper;
