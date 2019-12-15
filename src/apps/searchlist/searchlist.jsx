import React from "react";
import PropTypes from "prop-types";
import urlPropType from "url-prop-type";
import dayjs from "dayjs";
import { VariableSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Alert from "@reach/alert";
import replacePlaceholders from "../../core/replacePlaceholders";
import ListItem from "../../components/list-item/list-item";
import Skeleton, { getList } from "../../components/atoms/skeleton/skeleton";
import UnorderedList from "../../components/atoms/list/list";
import Button from "../../components/atoms/button/button";
import SimpleMaterial, {
  SimpleMaterialSkeleton
} from "../../components/simple-material/simple-material";

function SkeletonElement(_, index) {
  return (
    <ListItem
      key={index}
      aside={
        <>
          <Skeleton width="180px" height="50px" />
          <Skeleton width="180px" height="50px" />
        </>
      }
    >
      <div>
        <Skeleton height="30px" width="95px" mb="12px" />
        <Skeleton width="60px" mb="12px" />
        <Skeleton width="145px" />
      </div>
    </ListItem>
  );
}

function Searchlist({
  searches,
  loading,
  newButtonText,
  removeButtonText,
  searchUrl,
  statusText,
  newWindowText,
  goToSearchText,
  onOpenMaterials,
  onCloseMaterials,
  onSearchLinkClick,
  onRemoveSearch,
  authorUrl,
  materialUrl
}) {
  if (loading === "active") {
    return <UnorderedList>{getList(4).map(SkeletonElement)}</UnorderedList>;
  }
  return (
    <UnorderedList>
      {searches.map(search => {
        const onMaterialClick = () =>
          !search.open
            ? onOpenMaterials(search.id)
            : onCloseMaterials(search.id);
        return (
          <ListItem
            className="ddb-searchlist__item"
            key={search.id}
            containerClass="ddb-searchlist__container"
            childrenClass="ddb-searchlist__children"
            aside={
              <>
                {search.hit_count > 0 && (
                  <Button
                    align="left"
                    className="ddb-searchlist__new-button"
                    variant="charcoal"
                    onClick={onMaterialClick}
                  >
                    {newButtonText}
                  </Button>
                )}
                <Button onClick={() => onRemoveSearch(search.id)} align="left">
                  {removeButtonText}
                </Button>
              </>
            }
            footerClass="ddb-searchlist__materials"
            footer={
              search.open && (
                <AutoSizer>
                  {({ width, height }) => (
                    <VariableSizeList
                      className="ddb-searchlist__scroll"
                      layout="horizontal"
                      itemCount={search.materials?.length || 20}
                      estimatedItemSize={320}
                      itemSize={index => {
                        if (search.materials) {
                          const material = search.materials[index];
                          return material.coverUrl ? 320 : 220;
                        }
                        return 320;
                      }}
                      height={height}
                      width={width}
                    >
                      {({ style, index }) =>
                        search.materials ? (
                          <SimpleMaterial
                            authorUrl={authorUrl}
                            materialUrl={materialUrl}
                            style={style}
                            item={search.materials[index]}
                          />
                        ) : (
                          <SimpleMaterialSkeleton style={style} />
                        )
                      }
                    </VariableSizeList>
                  )}
                </AutoSizer>
              )
            }
          >
            <h2 className="ddb-searchlist__header">
              <a
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onSearchLinkClick(search.id)}
                href={replacePlaceholders({
                  text: searchUrl,
                  placeholders: {
                    query: encodeURIComponent(search.query)
                  }
                })}
              >
                {search.title}{" "}
                <span className="ddb-searchlist__go-to-search">
                  {goToSearchText}
                </span>
                <Alert
                  className="ddb-searchlist__new-window-warning"
                  type="polite"
                >
                  {newWindowText}
                </Alert>
              </a>
            </h2>
            <p className="ddb-searchlist__query">{search.query}</p>
            {search.hit_count > 0 && (
              <p className="ddb-searchlist__status">
                {replacePlaceholders({
                  text: statusText,
                  placeholders: {
                    hit_count: search.hit_count
                  }
                })}{" "}
                <time dateTime={search.last_seen}>
                  {dayjs(search.last_seen).format("DD/MM-YYYY")}
                </time>
                .
              </p>
            )}
          </ListItem>
        );
      })}
    </UnorderedList>
  );
}

Searchlist.propTypes = {
  loading: PropTypes.oneOf(["inactive", "active", "finished", "failed"]),
  onOpenMaterials: PropTypes.func.isRequired,
  onCloseMaterials: PropTypes.func.isRequired,
  onSearchLinkClick: PropTypes.func.isRequired,
  onRemoveSearch: PropTypes.func.isRequired,
  statusText: PropTypes.string.isRequired,
  newWindowText: PropTypes.string.isRequired,
  newButtonText: PropTypes.string.isRequired,
  removeButtonText: PropTypes.string.isRequired,
  goToSearchText: PropTypes.string.isRequired,
  searchUrl: PropTypes.string.isRequired,
  materialUrl: urlPropType.isRequired,
  authorUrl: urlPropType.isRequired,
  searches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      hit_count: PropTypes.number.isRequired,
      last_seen: PropTypes.string.isRequired,
      query: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired
};

Searchlist.defaultProps = {
  loading: "inactive"
};

export default Searchlist;
