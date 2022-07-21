/* eslint-disable  */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SidebarStyle/style.scss';
import { Link } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import Card from 'react-bootstrap/Card';
import { useSelector } from 'react-redux';

const H5PIVSidebar = (props) => {
  const [isOpen, setOpen] = React.useState(false);
  const {
    allPlaylists,
    activeActivityId,
    setCurrentActiveId,
    showLti,
    shared,
    projectId,
    playlistId,
    nextResource,
    viewType,
    setH5pCurrentActivity
  } = props;
  console.log({ act: activeActivityId });
  // const organization = useSelector((state) => state.organization);
  const h5pRecord = useSelector((state) => state.h5pRecord);
  // const [activeKey, setActiveKey] = useState();
  const handleActivityState = (activityId) => {
    localStorage.setItem('projectPreview', true);
    setCurrentActiveId(activityId);
  };
  const currentPlaylistIndex = allPlaylists.findIndex((p) => p.id === playlistId);
  const nextPlaylist = currentPlaylistIndex < allPlaylists.length - 1 ? allPlaylists[currentPlaylistIndex + 1] : null;
  const organization = useSelector((state) => state.organization);
  console.log('nextPlaylist', nextPlaylist);

  const getNextLink = (activity) => {
    let nextLink = '#';
    if (activity) {
      nextLink = `/playlist/${playlistId}/activity/${activity.id}/preview`;
    } else if (nextPlaylist) {
      nextLink = `/playlist/${nextPlaylist.id}/activity/${nextPlaylist.activities[0]?.id}/preview`;
    }
    if (nextLink !== '#') {
      if (showLti) {
        if (viewType === 'activity') {
          nextLink += '/lti?view=activity';
        } else {
          nextLink += '/lti';
        }
      } else {
        nextLink = `/org/${organization.currentOrganization?.domain}/project/${projectId}${nextLink}`;

        if (shared) {
          nextLink += '/shared';
        }
        if (viewType === 'activity') {
          nextLink += '?view=activity';
        }
      }
    } else {
      if (viewType === 'activity') {
        nextLink += '?view=activity';
      }
    }
    return nextLink;
  }

  return (
    <div className="sidebar-wrapper">
      <div className="project-heading-wrapper">
        <h3>
          <div className="sidebar-project-name d-flex justify-content-between">
            {allPlaylists[0]?.project?.name}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825L9.425 14.6L8 16Z" fill="#515151" />
            </svg>
          </div>
        </h3>
      </div>

      <Accordion className="sidebar-accordion">
        {allPlaylists.map((playlist, count) => (
          <Card>
            <ContextAwareToggle
              eventKey={count + 1}
              classNames={`${isOpen ? 'active' : ''}`}
            >
              <span
                onClick={() => {
                  setOpen(!isOpen);
                }}
              >
                {playlist.title}
              </span>
            </ContextAwareToggle>
            <Accordion.Collapse eventKey={count + 1}>
              <Card.Body>
                {playlist.activities.map((activity) => (
                  <div className={`sidebar-links ${activeActivityId === activity.id ? 'active' : ''}`}>
                    {nextResource && (
                      <Link
                        onClick={() => {
                          if (setH5pCurrentActivity) {
                            setH5pCurrentActivity(activity);
                          }
                        }}
                        to={setH5pCurrentActivity ? void 0 : getNextLink(activity)}
                      >
                        {activity.title}
                      </Link>
                    )}
                  </div>
                ))}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    </div >
  );
};

export const ContextAwareToggle = ({
  children, eventKey, callback, classNames,
}) => {
  const currentEventKey = useContext(AccordionContext);
  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey),
  );
  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <div
      className={`accordion-header-wrapper d-flex justify-content-between align-items-center ${classNames}`}
      onClick={() => decoratedOnClick()}
    >
      {children}
      <FontAwesomeIcon icon={`angle-${isCurrentEventKey ? 'up' : 'down'}`} />
    </div>
  );
};

H5PIVSidebar.propTypes = {
  activeActivityId: PropTypes.any.isRequired,
  setCurrentActiveId: PropTypes.func.isRequired,
  showLti: PropTypes.bool,
  shared: PropTypes.bool,
  projectId: PropTypes.number,
  playlistId: PropTypes.number.isRequired,
  nextResource: PropTypes.object,
  allPlaylists: PropTypes.array,
};

H5PIVSidebar.defaultProps = {
  showLti: false,
  shared: false,
  projectId: null,
  nextResource: null,
  allPlaylists: [],
};

ContextAwareToggle.propTypes = {
  children: PropTypes.any.isRequired,
  eventKey: PropTypes.any.isRequired,
  callback: PropTypes.func.isRequired,
  classNames: PropTypes.string,
};

ContextAwareToggle.defaultProps = {
  classNames: [],
};

export default H5PIVSidebar;
