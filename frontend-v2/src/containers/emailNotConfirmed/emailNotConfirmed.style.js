import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';

const EmailConfirmedWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 890px;
  padding: 0 25px;
  margin: 60px auto;

  img {
    max-width: 560px;
    @media (max-width: 667px) {
      max-width: 100%;
    }
  }
`;

export const ContentWrapper = styled.div`
  text-align: center;

  a {
    height: 37px;
    padding: 0 14px;
    margin: 20px;
    font-size: 15px;
    box-shadow: none;
    font-weight: 700;
    text-shadow: none;
    display: inline-flex;
    align-items: center;
    border-radius: 3px;
    color: ${themeGet('color.1', '#ffffff')};
    border-color: ${themeGet('primary.0', '#008489')};
    background-color: ${themeGet('primary.0', '#008489')};
    &:focus,
    &:hover {
      outline: 0;
      color: ${themeGet('color.1', '#ffffff')};
      border-color: ${themeGet('primary.1', '#399C9F')};
      background-color: ${themeGet('primary.1', '#399C9F')};
    }
  }
`;

export default EmailConfirmedWrapper;
