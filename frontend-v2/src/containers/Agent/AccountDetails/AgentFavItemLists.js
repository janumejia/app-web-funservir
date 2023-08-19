import React, { useContext } from 'react';
import SectionGrid from 'components/SectionGrid/SectionGrid';
import { PostPlaceholder } from 'components/UI/ContentLoader/ContentLoader';
import useDataApi from 'library/hooks/useDataApi';
import { SINGLE_POST_PAGE } from 'settings/constant';
import { AuthContext } from 'context/AuthProvider';
import Heading from 'components/UI/Heading/Heading';
import TextLink from 'components/UI/TextLink/TextLink';
import Image from 'components/UI/Image/Image';
import NotFoundWrapper, { ContentWrapper, ContentWrapperFav, NotFoundWrapperFav } from './NoData.style';

// const url = `${process.env.REACT_APP_HOST_BACK}/sites/`;

const AgentFavItemLists = () => {
  // const { data, loadMoreData, loading } = useDataApi('/data/agent.json');
  const { user, setUser } = useContext(AuthContext);
  const favourite_post = user && user.favorites ? user.favorites : [];
  console.log("user.favorites: ", user.favorites)

  return (
    <>
      {favourite_post.length > 0 ?
        <SectionGrid
          // link={SINGLE_POST_PAGE}
          data={favourite_post}
          // loading={loading}
          // limit={1}
          totalItem={favourite_post.length}
          columnWidth={[1 / 2, 1 / 2, 1 / 3, 1 / 4, 1 / 5, 1 / 6]}
          placeholder={<PostPlaceholder />}
        // handleLoadMore={loadMoreData}
        />
        :
        <NotFoundWrapperFav>
          <ContentWrapperFav>
            <Image src="/images/no-data-profile2.svg" alt="404" />
            <Heading as="h2" content="No has agregado favoritos aún" />
            <TextLink link="/listing" content="Ir a todos los sitios" />
          </ContentWrapperFav>
        </NotFoundWrapperFav>
      }
    </>
  );
};

export default AgentFavItemLists;
