import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './style.scss';

const ActivityCard = (props) => {
  const {
    activity,
    projectId,
    playlistId,
    lti,
  } = props;

  return (
    <li>
      <Link
        to={
          lti
            ? `/playlist/${playlistId}/activity/${activity.id}/preview/lti`
            : `/project/${projectId}/playlist/${playlistId}/activity/${activity.id}/preview`
        }
      >
        <div
          className="playimg"
          style={{
            backgroundImage:
              !!activity.thumb_url && activity.thumb_url.includes('pexels.com')
                ? `url(${activity.thumb_url})`
                : `url(${global.config.resourceUrl}${activity.thumb_url})`,
          }}
        />
        <div className="plydet">
          {activity.metadata ? activity.metadata.title : activity.title}
        </div>
      </Link>
    </li>
  );
};

ActivityCard.propTypes = {
  activity: PropTypes.object.isRequired,
  projectId: PropTypes.number.isRequired,
  playlistId: PropTypes.number.isRequired,
  lti: PropTypes.bool,
};

ActivityCard.defaultProps = {
  lti: false,
};

export default ActivityCard;
