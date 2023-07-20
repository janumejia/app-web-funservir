import styled from 'styled-components';

const AmenitiesWrapper = styled.div`
  padding: 29px 0;

  .amenities_title {
    margin-bottom: 30px;
  }

  .inclusive_icon {
    width: '24px';
    height: '24px';
  }

  a {
    &:hover {
      color: #31b8bd;
    }
  }
`;

export const AmenitiesArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: flex-start;
  margin-bottom: -15px;

  > div {
    width: calc(100% / 4 - 10px);

    @media (max-width: 767px) {
      width: calc(100% / 3 - 10px);
      margin-bottom: 20px;
    }

    @media (max-width: 580px) {
      width: calc(100% / 2 - 10px);
      margin-bottom: 20px;
    }
    
    margin-right: 10px; /* Add space between elements */
  }
`;

export default AmenitiesWrapper;
