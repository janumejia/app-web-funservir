import React, {useContext} from 'react';
import { AuthContext } from 'context/AuthProvider';
import SectionGrid from 'components/SectionGrid/SectionGrid';
import { PostPlaceholder } from 'components/UI/ContentLoader/ContentLoader';
import useDataApi from 'library/hooks/useDataApi';
import { SINGLE_POST_PAGE } from 'settings/constant';


const AgentItemLists = () => {
  const { data, loadMoreData, loading, total } = useDataApi('/data/agent.json');
  //const listed_post = data[0] && data[0].listed_post ? data[0].listed_post : [];
  const {user, profileData } = useContext(AuthContext);
  const listed_post = profileData.associatedSites? profileData.associatedSites : [];
  
  return (
    <SectionGrid
      myProfile={profileData._id===user._id}
      link={SINGLE_POST_PAGE}
      data={listed_post}
      loading={loading}
      limit={1}
      totalItem={listed_post.length}
      columnWidth={[1 / 2, 1 / 2, 1 / 3, 1 / 4, 1 / 5, 1 / 6]}
      placeholder={<PostPlaceholder />}
      handleLoadMore={loadMoreData}
    />
  );
};

export default AgentItemLists;
