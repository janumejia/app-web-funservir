import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import ImageGalleryWrapper from './ImageGallery.style';

const images = [
  {
    original: 'https://img.lalr.co/cms/2018/08/21143425/Fundacion-Manuelita.jpg?size=xl&ratio=r40_21',
    thumbnail: 'https://img.lalr.co/cms/2018/08/21143425/Fundacion-Manuelita.jpg?size=xl&ratio=r40_21 ',
  },
  {
    original: 'https://casadecolombia.co/wp-content/uploads/2018/10/foto-casa-de-colombia-fundacion-2.jpg',
    thumbnail: 'https://casadecolombia.co/wp-content/uploads/2018/10/foto-casa-de-colombia-fundacion-2.jpg',
  },
  {
    original: 'https://dps2018.prosperidadsocial.gov.co/SiteCollectionImages/Noticias/2018-Abr-25-Alianzas%20por%20lo%20social.jpeg',
    thumbnail: 'https://dps2018.prosperidadsocial.gov.co/SiteCollectionImages/Noticias/2018-Abr-25-Alianzas%20por%20lo%20social.jpeg',
  },
];

const PostImageGallery = () => {
  return (
    <ImageGalleryWrapper>
      <ImageGallery
        items={images}
        showPlayButton={false}
        showFullscreenButton={false}
        showIndex={true}
        lazyLoad={true}
        slideDuration={550}
      />
    </ImageGalleryWrapper>
  );
};

export default PostImageGallery;
