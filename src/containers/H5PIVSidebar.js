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
  const { allPlaylists, activeActivityId } = props;
  console.log({ act: activeActivityId });
  const organization = useSelector((state) => state.organization);
  // const [activeKey, setActiveKey] = useState();
  return (
    <div className="sidebar-wrapper px-4">
      <div className="project-heading-wrapper">
        <h3>
          <div className="sidebar-project-name d-flex justify-content-between">
            {/* {allPlaylists[0].project.name} */}
            <FontAwesomeIcon icon="arrow-left" />
          </div>
        </h3>
      </div>

      <Accordion>
        {allPlaylists.map((playlist, count) => (
          <Card>
            <ContextAwareToggle
              eventKey={count + 1}
            >
              {playlist.title}
            </ContextAwareToggle>
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
        ))}
      </Accordion>
    </div>
  );
};

export const ContextAwareToggle = ({ children, eventKey, callback }) => {
  const currentEventKey = useContext(AccordionContext);
  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey),
  );
  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <div
      className="accordion-header-wrapper d-flex justify-content-between align-items-center"
      onClick={() => decoratedOnClick()}
    >
      {children}
      <FontAwesomeIcon icon={`angle-${isCurrentEventKey ? 'up' : 'down'}`} />
    </div>
  );
};

H5PIVSidebar.propTypes = {
  allPlaylists: PropTypes.any.isRequired,
  activeActivityId: PropTypes.any.isRequired,
};

ContextAwareToggle.propTypes = {
  children: PropTypes.any.isRequired,
  eventKey: PropTypes.any.isRequired,
  callback: PropTypes.func.isRequired,
};

export default H5PIVSidebar;
