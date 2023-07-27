import React, { useEffect, useState } from 'react';
import ImageGallery, { Fullscreen } from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import ImageGalleryWrapper from './ImageGallery.style';
import { BsArrowsFullscreen } from "react-icons/bs";

const PostImageGallery = ({ gallery }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const asyncFunction = async () => {
      let auxImages = [];
      auxImages = await gallery.map((img) => {
        return { "original": img.secure_url.replace('/image/upload/', '/image/upload/f_auto,q_auto/'), "thumbnail": img.secure_url.replace('/image/upload/', '/image/upload/w_200,f_auto,q_auto/') }
      })
      setImages(auxImages)
    }

    asyncFunction();
  }, [gallery])

  return (
    <ImageGalleryWrapper>
      <ImageGallery
        items={images}
        showPlayButton={false}
        // renderFullscreenButton={(onClick, isFullscreen) => (
        //   <div className="fullscreen-button-container">
        //     {!isFullscreen && <BsArrowsFullscreen onClick={onClick} style={{ width: '30px', height: '30px' }}/>}
        //   </div>
        // )}
        showFullscreenButton={false}
        showIndex={true}
        lazyLoad={true}
        slideDuration={350}
      />
    </ImageGalleryWrapper>
  );
};

export default PostImageGallery;
