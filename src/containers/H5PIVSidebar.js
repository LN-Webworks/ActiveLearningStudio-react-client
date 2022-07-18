import React from 'react';
import PropTypes from 'prop-types';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SidebarStyle/style.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const H5PIVSidebar = (props) => {
  const { allPlaylists, activeActivityId } = props;
  console.log({ act: activeActivityId });
  const organization = useSelector((state) => state.organization);
  return (
    <>
      <div className="project-heading-wrapper">
        <h3>{allPlaylists[0].project.name}</h3>
      </div>
      <div className="accordion" id="accordionExample">
        {allPlaylists.map((playlist, count) => (
          <div className="card">
            <div className="card-head" id={`heading${count}`}>
              <div
                className="mb-0 heading-wrapper"
                data-toggle="collapse"
                data-target={`#collapse${count}`}
                aria-expanded="true"
                aria-controls={`collapse${count}`}
              >
                {playlist.title}
              </div>
            </div>

            <div
              id={`#collapse${count}`}
              className={`collapse ${count === 0 && 'show'}`}
              aria-labelledby={`heading${count}`}
              data-parent="#accordionExample"
            >
              <div className="card-body">
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

H5PIVSidebar.propTypes = {
  allPlaylists: PropTypes.any.isRequired,
  activeActivityId: PropTypes.any.isRequired,
};

export default H5PIVSidebar;
