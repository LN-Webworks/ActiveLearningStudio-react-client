import React from 'react';
import PropTypes from 'prop-types';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SidebarStyle/style.scss';
import { Link } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { useSelector } from 'react-redux';

const H5PIVSidebar = (props) => {
  const { allPlaylists, activeActivityId } = props;
  console.log({ act: activeActivityId });
  const organization = useSelector((state) => state.organization);
  return (
    <>
      <div className="project-heading-wrapper">
        {/* <h3>{allPlaylists[0].project.name}</h3> */}
      </div>

      <Accordion>
        {allPlaylists.map((playlist, count) => (
          <>
            <Card>
              <Card.Header>
                <Accordion.Toggle variant="link" eventKey={count + 1}>
                  {playlist.title}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey={count + 1}>
                <Card.Body>
                  {playlist.activities.map((activity) => (
                    <div className={`sidebar-links ${activeActivityId === activity.id ? 'active' : ''}`}>
                      <Link
                        to={`/org/${organization.currentOrganization?.domain}/project/${playlist.project.id}/playlist/${playlist.id}/activity/${activity.id}/preview?view=activity`}
                        onClick={() => localStorage.setItem('projectPreview', true)}
                      >
                        {activity.title}
                      </Link>
                    </div>
                  ))}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </>
        ))}
      </Accordion>
    </>
  );
};

H5PIVSidebar.propTypes = {
  allPlaylists: PropTypes.any.isRequired,
  activeActivityId: PropTypes.any.isRequired,
};

export default H5PIVSidebar;
