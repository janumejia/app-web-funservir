import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Box from 'components/UI/Box/Box';
import Text from 'components/UI/Text/Text';
import ProductCard from '../ProductCard/ProductCard';
import { createStore, StateMachineProvider } from 'little-state-machine';

const LoadMore = ({
  handleLoadMore,
  showButton,
  buttonText,
  loading,
  loadMoreComponent,
  loadMoreStyle,
}) => {
  return (
    !!showButton && (
      <Box key={buttonText} className="loadmore_wrapper" {...loadMoreStyle}>
        {loadMoreComponent ? (
          loadMoreComponent
        ) : (
          <Button loading={loading} onClick={handleLoadMore}>
            {buttonText || 'Cargar más'}
          </Button>
        )}
      </Box>
    )
  );
};

export default function SectionGrid({
  data = [],
  totalItem,
  limit,
  columnWidth,
  paginationComponent,
  handleLoadMore,
  loadMoreComponent,
  placeholder,
  loading,
  buttonText,
  rowStyle,
  columnStyle,
  loadMoreStyle,
  link,
  myProfile
}) {
  const n = limit ? Number(limit) : 1;
  const limits = Array(n).fill(0);
  createStore({});
  let showButton = data.length < totalItem;

  return (
    <>
      <StateMachineProvider>
        <Box className="grid_wrapper" {...rowStyle}>
          {data && data.length
            ? data.map((item) => {
              if (!myProfile) {
                if (item.status && item.status === "Aprobado") {
                  return (
                    <Box
                      className="grid_column"
                      width={columnWidth}
                      key={item.id}
                      {...columnStyle}
                    >
                      <ProductCard myProfile={myProfile} slug={item.name} {...item}  /> {/*link={link} recordar que con esto es que se le pone el link a la págnia del sitio*/}
                    </Box>
                  );
                }
              } else {
                return (
                  <Box
                    className="grid_column"
                    width={columnWidth}
                    key={item.id}
                    {...columnStyle}
                  >
                    <ProductCard myProfile={myProfile} slug={item.name}  {...item} /> {/*link={link} recordar que con esto es que se le pone el link a la págnia del sitio*/}
                  </Box>

                );
              }
            })
            : null}

          {loading &&
            limits.map((_, index) => (
              <Box
                className="grid_column"
                width={columnWidth}
                key={index}
                {...columnStyle}
              >
                {placeholder ? placeholder : <Text content="Loading ..." />}
              </Box>
            ))}
        </Box>
      </StateMachineProvider>
      {showButton && (
        <LoadMore
          showButton={showButton}
          handleLoadMore={handleLoadMore}
          loading={loading}
          buttonText={buttonText}
          loadMoreComponent={loadMoreComponent}
          loadMoreStyle={loadMoreStyle}
        />
      )}
      {paginationComponent && (
        <Box className="pagination_wrapper">{paginationComponent}</Box>
      )}
    </>
  );
}

SectionGrid.propTypes = {
  data: PropTypes.array.isRequired,
  totalItem: PropTypes.number,
  columnWidth: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  paginationComponent: PropTypes.element,
  handleLoadMore: PropTypes.func,
  loadMoreComponent: PropTypes.element,
  placeholder: PropTypes.element,
  loading: PropTypes.bool,
  limit: PropTypes.number,
  buttonText: PropTypes.string,
  rowStyle: PropTypes.object,
  columnStyle: PropTypes.object,
  loadMoreStyle: PropTypes.object,
};

SectionGrid.defaultProps = {
  rowStyle: {
    flexBox: true,
    flexWrap: 'wrap',
    mr: ['-10px', '-10px', '-10px', '-10px', '-10px', '-15px'],
    ml: ['-10px', '-10px', '-10px', '-10px', '-10px', '-15px'],
  },
  columnStyle: {
    pr: ['10px', '10px', '10px', '10px', '10px', '15px'],
    pl: ['10px', '10px', '10px', '10px', '10px', '15px'],
  },
  loadMoreStyle: {
    flexBox: true,
    justifyContent: 'center',
    mt: '1rem',
  },
};
