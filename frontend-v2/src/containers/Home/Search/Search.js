import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'components/UI/Heading/Heading';
import Text from 'components/UI/Text/Text';
import Container from 'components/UI/Container/Container';
import GlideCarousel, {
  GlideSlide,
} from 'components/UI/GlideCarousel/GlideCarousel';
import SearchForm from './SearchForm';
import BannerWrapper, { SearchWrapper } from './Search.style';

// DESCRIPCIÓN:
// Componente que configura la parte principal de la pantalla principal: Carrusel de imágenes y usa la barra de búsqueda (componente hija llamada SearchForm)
const SearchArea = ({ searchTitleStyle, searchDescriptionStyle }) => {
  return (
    <BannerWrapper>
      <GlideCarousel // Carrusel de imágenes
        controls={true}
        options={{ gap: 0, autoplay: 10000, animationDuration: 1000, keyboard: true }} // Tiempo en que es presentada cada imagen del carrusel de imágenes
        bullets={true}
        numberOfBullets={4}
      >
        <>
         {/* Las imágenes del carrusel de imágenes */}
          <GlideSlide>
            <img src="/images/banner/1.jpg" alt="" />
          </GlideSlide>
          <GlideSlide>
            <img src="/images/banner/2.jpg" alt="" />
          </GlideSlide>
          <GlideSlide>
            <img src="/images/banner/3.jpg" alt="" />
          </GlideSlide>
          <GlideSlide>
            <img src="/images/banner/4.jpg" alt="" />
          </GlideSlide>
        </>
      </GlideCarousel>

      <Container>
        <SearchWrapper>
          <Heading
            {...searchTitleStyle}
            content="Busca sitios de interés inclusivos en Bogotá"
          />
          <Text
            {...searchDescriptionStyle}
            content="" // Aquí va el texto que aparece abajo de "Busca tu sitios de interés inclusivo"
          />
          <SearchForm />
        </SearchWrapper>
      </Container>
    </BannerWrapper>
  );
};

SearchArea.propTypes = {
  searchTitleStyle: PropTypes.object,
  searchDescriptionStyle: PropTypes.object,
};

SearchArea.defaultProps = {
  searchTitleStyle: {
    color: '#2C2C2C',
    fontSize: ['20px', '24px', '28px'],
    lineHeight: ['28px', '30px', '30px'],
    mb: '9px',
  },
  searchDescriptionStyle: {
    color: '#2C2C2C',
    fontSize: '15px',
    lineHeight: ['25px', '25px', '18px'],
    mb: '30px',
  },
};

export default SearchArea;
