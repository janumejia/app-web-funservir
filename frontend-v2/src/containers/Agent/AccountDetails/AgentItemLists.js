import React, { useContext } from 'react';
import { AuthContext } from 'context/AuthProvider';
import SectionGrid from 'components/SectionGrid/SectionGrid';
import { PostPlaceholder } from 'components/UI/ContentLoader/ContentLoader';
import useDataApi from 'library/hooks/useDataApi';
import { SINGLE_POST_PAGE } from 'settings/constant';
import { ContentWrapperFav, NotFoundWrapperFav } from './NoData.style';
import Image from 'components/UI/Image/Image';
import Heading from 'components/UI/Heading/Heading';
import TextLink from 'components/UI/TextLink/TextLink';
import Loader from 'components/Loader/Loader';


const AgentItemLists = () => {
  const { data, loadMoreData, loading, total } = useDataApi('/data/agent.json');
  //const listed_post = data[0] && data[0].listed_post ? data[0].listed_post : [];
  const { user, profileData } = useContext(AuthContext);
  const listed_post = profileData.associatedSites ? profileData.associatedSites : null;

  if(!listed_post) return <Loader />

  return (
    <>
      {listed_post && listed_post.length > 0 ?
        <SectionGrid
          myProfile={profileData._id === user._id}
          link={SINGLE_POST_PAGE}
          data={listed_post}
          loading={loading}
          limit={1}
          totalItem={listed_post.length}
          columnWidth={[1 / 2, 1 / 2, 1 / 3, 1 / 4, 1 / 5, 1 / 6]}
          placeholder={<PostPlaceholder />}
          handleLoadMore={loadMoreData}
        />
        :
        <NotFoundWrapperFav>
          <ContentWrapperFav>
            <Image src="/images/no-data-profile2.svg" alt="404" />
            <Heading as="h2" content="No se han agregado sitios" />
            {/* <TextLink link="/listing" content="Ir a todos los sitios" /> */}
          </ContentWrapperFav>
        </NotFoundWrapperFav>
      }
    </>
  );
};

export default AgentItemLists;
