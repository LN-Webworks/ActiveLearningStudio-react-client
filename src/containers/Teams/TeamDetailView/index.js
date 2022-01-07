import React, { useState } from 'react';
import PropTypes from 'prop-types';
import EditTeamImage from 'assets/images/svg/editTeam.svg';
import EditDetailImage from 'assets/images/svg/detailEdit.svg';
import searchimg from 'assets/images/svg/search-icon-admin-panel.svg';
import './style.scss';
import Buttons from 'utils/Buttons/buttons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import UserIcon from 'assets/images/svg/user.svg';
import Deleticon from 'assets/images/svg/trash.svg';
import Right from 'assets/images/svg/right.svg';
import Userimg from 'assets/images/mem.png';
import MyTeamCard from 'utils/MyTeamCard/myteamcard';
import BackgroundTeamCardImage from 'assets/images/cardlistimg.png';

const TeamDetail = ({ team, organization }) => {
  // const [left, setleft] = useState(false);
  console.log(team);
  const [toggleLeft, setToggleLeft] = useState(false);
  return (
    <div className="add-team-page">
      <div className={`${toggleLeft ? 'width90' : ''} left`}>
        <div className="organization-name">{organization}</div>
        <div className="title-image">
          <div>
            <h1 className="title">{team?.name}</h1>
          </div>
          <div>
            <img
              className="editimage-tag"
              src={EditTeamImage}
              alt="EditTeamImage"
            />
          </div>
        </div>
        <div className="add-team-detail">
          <div className="team-detail">
            <p>
              This project is about the influence the design of everyday objects
              and art had have over the main historic moments of the world. With
              this course you’ll have a big complete understanding of main
              social design needs and the technical approach to solve them.
              {' '}
            </p>
          </div>
          <div className="team-edit-detail">
            <img
              className="editimage-tag"
              src={EditDetailImage}
              alt="EditDetailImage"
            />
          </div>
        </div>
        <div className="flex-button-top">
          <div className="team-controller">
            <div className="search-and-filters">
              <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search project"
                />
                <img src={searchimg} alt="search" />
              </div>
            </div>
            <div className="team-project-btns">
              <Buttons
                text="Open White Board"
                secondary
                width="168px"
                height="32px"
                className="mr-16"
                hover
              />
              <Buttons
                icon={faPlus}
                text="Add project"
                primary
                width="128px"
                height="32px"
                hover
                onClick={() => {
                  // setPageLoad((oldStatus) => !oldStatus);
                }}
              />
            </div>
          </div>
        </div>
        <div className="team-cards">
          <div className="mt-16">
            <MyTeamCard
              title="How to use CurrikiStudio"
              backgroundImg={BackgroundTeamCardImage}
            />
          </div>
          <div className="mt-16">
            <MyTeamCard
              title="How to use CurrikiStudio"
              backgroundImg={BackgroundTeamCardImage}
            />
          </div>
          <div className="mt-16">
            <MyTeamCard
              title="How to use CurrikiStudio"
              backgroundImg={BackgroundTeamCardImage}
            />
          </div>
          <div className="mt-16">
            <MyTeamCard
              title="How to use CurrikiStudio"
              backgroundImg={BackgroundTeamCardImage}
            />
          </div>
          <div className="mt-16">
            <MyTeamCard
              title="How to use CurrikiStudio"
              backgroundImg={BackgroundTeamCardImage}
            />
          </div>
          <div className="mt-16">
            <MyTeamCard
              title="How to use CurrikiStudio"
              backgroundImg={BackgroundTeamCardImage}
            />
          </div>
          <div className="mt-16">
            <MyTeamCard
              title="How to use CurrikiStudio"
              backgroundImg={BackgroundTeamCardImage}
            />
          </div>
          <div className="mt-16">
            <MyTeamCard
              title="How to use CurrikiStudio"
              backgroundImg={BackgroundTeamCardImage}
            />
          </div>
          <div className="mt-16">
            <MyTeamCard
              title="How to use CurrikiStudio"
              backgroundImg={BackgroundTeamCardImage}
            />
          </div>
        </div>
      </div>
      <div className={`${toggleLeft ? 'width10' : ''} right`}>
        <button
          type="button"
          className="toggle_btn"
          onClick={() => setToggleLeft(!toggleLeft)}
        >
          <img src={Right} alt="chevron-right" className={`${toggleLeft ? 'image_rotate' : ''}`} />
        </button>
        <div className="right_head">
          <h1 className={`${toggleLeft ? 'none' : ''}`}>Team members </h1>
          <img src={UserIcon} alt="" />
        </div>
        <div className="right_select">
          <select className={`${toggleLeft ? 'none' : ''}`}>
            <option>Invite a team member</option>
          </select>
        </div>
        <div className="right_card">
          <div className="right_info">
            <div>
              <img src={Userimg} alt="" />
            </div>
            <div className={`${toggleLeft ? 'none' : ''}`}>
              <h6>Master</h6>
              <p>masterdemo@curriki.org</p>
            </div>
          </div>
          <div className={`${toggleLeft ? 'none' : ''} right_label`}>
            <button type="button">Admin</button>
            <img src={Deleticon} alt="" />
          </div>
        </div>
        <div className="right_card">
          <div className="right_info">
            <div>
              <img src={Userimg} alt="" />
            </div>
            <div className={`${toggleLeft ? 'none' : ''}`}>
              <h6>Master</h6>
              <p>masterdemo@curriki.org</p>
            </div>
          </div>
          <div className={`${toggleLeft ? 'none' : ''} right_label`}>
            <button type="button">Admin</button>
            <img src={Deleticon} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

TeamDetail.propTypes = {
  team: PropTypes.object.isRequired,
  organization: PropTypes.string.isRequired,
};

export default TeamDetail;
