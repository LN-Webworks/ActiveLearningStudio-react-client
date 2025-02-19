/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveAdminForm } from 'store/actions/admin';
import EditProjectModel from './model/editprojectmodel';
import { removeActiveAdminForm, setActiveTab } from 'store/actions/admin';
import CreateActivityItem from './formik/createActivityItem';
import CreateActivityType from './formik/createActivity';
import CreateOrg from './formik/createOrg';
import AddRole from './formik/addRole';
import CreateUser from './CreateUser';
import CreateUserForm from 'containers/Admin/formik/createuser';
import BrightCove from './formik/createBrightCove';
import Pills from './pills';
import Heading from './heading';
import Breadcrump from 'utils/BreadCrump/breadcrump';
import * as actionTypes from 'store/actionTypes';
import CreateLms from './formik/createLms';
import CreateDefaultSso from './formik/createDefaultSso';
import CreateLtiTool from './formik/createLtiTool';
import RemoveUser from './RemoveUser';
import './style.scss';
import { getRoles } from 'store/actions/organization';
import EditProject from './formik/editProject';
import { useHistory } from 'react-router-dom';
// import editicon from 'assets/images/edit2.svg';
import CreateSubject from './formik/createSubject';
import CreateEducationLevel from './formik/createEducationLevel';
import CreateAuthorTag from './formik/createAuthorTag';
import CreateActivityLayout from './formik/createActivityLayout';
import EditTeamModel from './model/EditTeamModel';
import { getGlobalColor } from 'containers/App/DynamicBrandingApply';

function AdminPanel({ showSSO }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [allProjectTab, setAllProjectTab] = useState(null);
  const adminState = useSelector((state) => state.admin);
  const [users, setUsers] = useState(null);
  const { paginations } = useSelector((state) => state.ui);
  const organization = useSelector((state) => state.organization);
  const { permission, roles, currentOrganization, activeOrganization } = organization;
  const { activeForm, activeTab, removeUser } = adminState;
  const [modalShow, setModalShow] = useState(false);
  const [modalShowTeam, setModalShowTeam] = useState(false);
  const [rowData, setrowData] = useState(false);
  const [activePageNumber, setActivePageNumber] = useState(false);
  useEffect(() => {
    if ((roles?.length === 0 && activeOrganization?.id) || activeOrganization?.id !== currentOrganization?.id) {
      dispatch(getRoles());
    }
  }, [activeOrganization]);
  useEffect(() => {}, [activeTab]);
  useEffect(() => {
    const tab = localStorage.getItem('activeTab');
    if (tab) {
      dispatch(setActiveTab(tab));
    }
  }, []);
  useEffect(() => {
    if (paginations?.length <= 1 || !paginations) {
      dispatch({
        type: actionTypes.UPDATE_PAGINATION,
        payload: [currentOrganization || []],
      });
    }
  }, [currentOrganization]);

  const paragraphColor = getGlobalColor('--main-paragraph-text-color');

  return (
    <div className="admin-panel">
      {true ? (
        <>
          <div className="content-wrapper">
            <div className="inner-content">
              <Breadcrump />
              <Heading />
              {!showSSO ? (
                <Tabs
                  defaultActiveKey={activeTab}
                  activeKey={activeTab}
                  id="uncontrolled-tab-example"
                  onSelect={(key) => {
                    dispatch(setActiveTab(key));
                    localStorage.setItem('activeTab', key);
                  }}
                >
                  {permission?.Organization?.includes('organization:view') && (
                    <Tab eventKey="Organization" title="Organizations">
                      <div className="parent-organization-detail">
                        <div className="detailer">
                          <h3>Main organization: {currentOrganization?.name}</h3>
                          <p>{currentOrganization?.description}</p>
                        </div>
                        {permission?.Organization?.includes('organization:edit') && (
                          <button
                            onClick={() => {
                              dispatch(setActiveAdminForm('edit_org'));
                              dispatch({
                                type: 'SET_ACTIVE_EDIT',
                                payload: currentOrganization,
                              });
                            }}
                          >
                            {/*<img src={editicon} alt="" />*/}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="mr-2" viewBox="0 0 14 14" fill="none" css-inspector-installed="true">
                              <path
                                d="M6.36842 2.26562H2.19374C1.8774 2.26563 1.57402 2.39129 1.35033 2.61498C1.12664 2.83867 1.00098 3.14205 1.00098 3.45839V11.8078C1.00098 12.1241 1.12664 12.4275 1.35033 12.6512C1.57402 12.8749 1.8774 13.0005 2.19374 13.0005H10.5431C10.8594 13.0005 11.1628 12.8749 11.3865 12.6512C11.6102 12.4275 11.7359 12.1241 11.7359 11.8078V7.63307"
                                stroke={paragraphColor}
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M10.8404 1.37054C11.0776 1.13329 11.3994 1 11.735 1C12.0705 1 12.3923 1.13329 12.6295 1.37054C12.8668 1.6078 13.0001 1.92959 13.0001 2.26512C13.0001 2.60065 12.8668 2.92244 12.6295 3.15969L6.9639 8.82533L4.57837 9.42172L5.17475 7.03618L10.8404 1.37054Z"
                                stroke={paragraphColor}
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                            Edit organization
                          </button>
                        )}
                      </div>
                      <div className="module-content">
                        <Pills modules={['All Organizations']} type="Organization" subType="All Organizations" />
                      </div>
                    </Tab>
                  )}
                  {(permission?.Organization?.includes('organization:view-all-project') || permission?.Organization?.includes('organization:view-exported-project')) && (
                    <Tab eventKey="Projects" title="Projects">
                      <div className="module-content">
                        <Pills
                          setModalShow={setModalShow}
                          modules={[
                            permission?.Organization?.includes('organization:view-all-project') && 'All Projects',
                            permission?.Organization?.includes('organization:view-exported-project') && 'Exported Projects',
                          ]}
                          allProjectTab={allProjectTab}
                          setAllProjectTab={setAllProjectTab}
                          type="Projects"
                          setrowData={setrowData}
                          setActivePageNumber={setActivePageNumber}
                        />
                      </div>
                    </Tab>
                  )}
                  {(permission?.Organization?.includes('organization:view-activity-item') ||
                    permission?.Organization?.includes('organization:view-activity-type') ||
                    permission?.Organization?.includes('organization:view-activity-type')) && (
                    <Tab eventKey="Activities" title="Activities">
                      <div className="module-content">
                        <Pills
                          modules={[
                            'Activity Layouts',
                            permission?.Organization?.includes('organization:view-activity-type') && 'Activity Types',
                            permission?.Organization?.includes('organization:view-activity-item') && 'Activity Items',
                            'Subjects',
                            'Education Level',
                            'Author Tags',
                          ]}
                          type="Activities"
                        />
                      </div>
                    </Tab>
                  )}
                  {(permission?.Organization?.includes('organization:view-user') || permission?.Organization?.includes('organization:view-role')) && (
                    <Tab eventKey="Users" title="Users">
                      <div className="module-content">
                        <Pills
                          type="Users"
                          modules={[
                            permission?.Organization?.includes('organization:view-user') && 'All Users',
                            permission?.Organization?.includes('organization:view-role') && 'Manage Roles',
                          ]}
                          subType="All Users"
                          users={users}
                          setUsers={setUsers}
                        />
                      </div>
                    </Tab>
                  )}
                  {permission?.Organization?.includes('organization:view-user') && (
                    <Tab eventKey="Teams" title="Teams">
                      <div className="module-content">
                        <Pills type="Teams" modules={['All teams']} subType="All teams" setModalShowTeam={setModalShowTeam} />
                      </div>
                    </Tab>
                  )}
                  {(permission?.Organization?.includes('organization:view-lms-setting') || permission?.Organization?.includes('organization:view-all-setting')) && (
                    <Tab eventKey="LMS" title="Integrations">
                      <div className="module-content">
                        <Pills
                          modules={[
                            permission?.Organization?.includes('organization:view-lms-setting') && 'LMS settings',
                            permission?.Organization?.includes('organization:view-all-setting') && 'LTI Tools',
                            permission?.Organization?.includes('organization:view-brightcove-setting') && 'BrightCove',
                          ]}
                          type="LMS"
                        />
                        {/* <Pills modules={['All settings', 'LTI Tools']} type="LMS" /> */}
                      </div>
                    </Tab>
                  )}

                  {/* <Tab eventKey="Settings" title="Settings">
                  <div className="module-content">
                    <h2>Settings</h2>
                    <Pills modules={["All settings"]} type="Settings" />
                  </div>
                </Tab> */}
                </Tabs>
              ) : (
                <Tabs
                  defaultActiveKey={'DefaultSso'}
                  activeKey={'DefaultSso'}
                  id="uncontrolled-tab-example"
                  onSelect={(key) => {
                    dispatch(setActiveTab(key));
                    localStorage.setItem('activeTab', key);
                  }}
                >
                  {permission.activeRole?.includes('admin') && !currentOrganization?.parent && (
                    <Tab eventKey="DefaultSso" title="Default SSO settings">
                      <div className="module-content">
                        <Pills modules={['All Default SSO Settings']} type="DefaultSso" />
                      </div>
                    </Tab>
                  )}
                </Tabs>
              )}
            </div>
          </div>
          {(activeForm === 'add_activity_type' || activeForm === 'edit_activity_type') && (
            <div className="form-new-popup-admin">
              <div className="inner-form-content">{activeForm === 'add_activity_type' ? <CreateActivityType /> : <CreateActivityType editMode />}</div>
            </div>
          )}
          {(activeForm === 'add_activity_item' || activeForm === 'edit_activity_item') && (
            <div className="form-new-popup-admin">
              <FontAwesomeIcon
                icon="times"
                className="cross-all-pop"
                onClick={() => {
                  dispatch(removeActiveAdminForm());
                }}
              />
              <div className="inner-form-content">{activeForm === 'add_activity_item' ? <CreateActivityItem /> : <CreateActivityItem editMode />}</div>
            </div>
          )}
          {(activeForm === 'add_subject' || activeForm === 'edit_subject') && (
            <div className="form-new-popup-admin">
              <FontAwesomeIcon
                icon="times"
                className="cross-all-pop"
                onClick={() => {
                  dispatch(removeActiveAdminForm());
                }}
              />
              <div className="inner-form-content">{activeForm === 'add_subject' ? <CreateSubject /> : <CreateSubject editMode />}</div>
            </div>
          )}
          {(activeForm === 'add_education_level' || activeForm === 'edit_education_level') && (
            <div className="form-new-popup-admin">
              <FontAwesomeIcon
                icon="times"
                className="cross-all-pop"
                onClick={() => {
                  dispatch(removeActiveAdminForm());
                }}
              />
              <div className="inner-form-content">{activeForm === 'add_education_level' ? <CreateEducationLevel /> : <CreateEducationLevel editMode />}</div>
            </div>
          )}
          {(activeForm === 'add_author_tag' || activeForm === 'edit_author_tag') && (
            <div className="form-new-popup-admin">
              <FontAwesomeIcon
                icon="times"
                className="cross-all-pop"
                onClick={() => {
                  dispatch(removeActiveAdminForm());
                }}
              />
              <div className="inner-form-content">{activeForm === 'add_author_tag' ? <CreateAuthorTag /> : <CreateAuthorTag editMode />}</div>
            </div>
          )}
          {(activeForm === 'add_activity_layout' || activeForm === 'edit_activity_layout') && (
            <div className="form-new-popup-admin">
              <FontAwesomeIcon
                icon="times"
                className="cross-all-pop"
                onClick={() => {
                  dispatch(removeActiveAdminForm());
                }}
              />
              <div className="inner-form-content">{activeForm === 'add_activity_layout' ? <CreateActivityLayout /> : <CreateActivityLayout editMode />}</div>
            </div>
          )}
          {(activeForm === 'add_org' || activeForm === 'edit_org') && (
            <div className="form-new-popup-admin">
              <div className="inner-form-content" style={{ width: '944px' }}>
                {activeForm === 'add_org' ? <CreateOrg /> : <CreateOrg editMode />}
              </div>
            </div>
          )}
          {activeForm === 'add_role' && (
            <div className="form-new-popup-admin">
              <FontAwesomeIcon
                icon="times"
                className="cross-all-pop"
                onClick={() => {
                  dispatch(removeActiveAdminForm());
                }}
              />
              <div className="inner-form-content">
                <AddRole />
              </div>
            </div>
          )}
          {activeForm === 'add_lms' && (
            <div className="form-new-popup-admin">
              <FontAwesomeIcon
                icon="times"
                className="cross-all-pop"
                onClick={() => {
                  dispatch(removeActiveAdminForm());
                }}
              />
              <div className="inner-form-content">
                <CreateLms method="create" />
              </div>
            </div>
          )}
          {activeForm === 'add_brightcove' && (
            <div className="form-new-popup-admin">
              <div className="inner-form-content">
                <BrightCove mode={activeForm} />
              </div>
            </div>
          )}
          {activeForm === 'edit_bright_form' && (
            <div className="form-new-popup-admin">
              <div className="inner-form-content">
                <BrightCove mode={activeForm} editMode />
              </div>
            </div>
          )}
          {activeForm === 'edit_lms' && (
            <div className="form-new-popup-admin">
              <FontAwesomeIcon
                icon="times"
                className="cross-all-pop"
                onClick={() => {
                  dispatch(removeActiveAdminForm());
                }}
              />
              <div className="inner-form-content">
                <CreateLms editMode />
              </div>
            </div>
          )}
          {activeForm === 'clone_lms' && (
            <div className="form-new-popup-admin">
              <FontAwesomeIcon
                icon="times"
                className="cross-all-pop"
                onClick={() => {
                  dispatch(removeActiveAdminForm());
                }}
              />
              <div className="inner-form-content">
                <CreateLms editMode clone />
              </div>
            </div>
          )}
          {activeForm === 'edit_project' && (
            <div className="form-new-popup-admin">
              <FontAwesomeIcon
                icon="times"
                className="cross-all-pop"
                onClick={() => {
                  dispatch(removeActiveAdminForm());
                }}
              />
              <div className="inner-form-content">
                <EditProject editMode allProjectTab={allProjectTab} setAllProjectTab={setAllProjectTab} />
              </div>
            </div>
          )}
          {activeForm === 'create_user' && <CreateUser mode={activeForm} />}
          {activeForm === 'edit_user' && (
            <div className="form-new-popup-admin">
              <div className="inner-form-content">
                <CreateUserForm mode={activeForm} editMode />
              </div>
            </div>
          )}

          {activeForm === 'add_default_sso' && (
            <div className="form-new-popup-admin">
              <FontAwesomeIcon
                icon="times"
                className="cross-all-pop"
                onClick={() => {
                  dispatch(removeActiveAdminForm());
                }}
              />
              <div className="inner-form-content">
                <CreateDefaultSso method="create" />
              </div>
            </div>
          )}
          {activeForm === 'edit_default_sso' && (
            <div className="form-new-popup-admin">
              <FontAwesomeIcon
                icon="times"
                className="cross-all-pop"
                onClick={() => {
                  dispatch(removeActiveAdminForm());
                }}
              />
              <div className="inner-form-content">
                <CreateDefaultSso editMode />
              </div>
            </div>
          )}

          {activeForm === 'clone_lti_tool' && (
            <div className="form-new-popup-admin">
              <FontAwesomeIcon
                icon="times"
                className="cross-all-pop"
                onClick={() => {
                  dispatch(removeActiveAdminForm());
                }}
              />
              <div className="inner-form-content">
                <CreateLtiTool editMode clone />
              </div>
            </div>
          )}

          {(activeForm === 'add_lti_tool' || activeForm === 'edit_lti_tool') && (
            <div className="form-new-popup-admin">
              <FontAwesomeIcon
                icon="times"
                className="cross-all-pop"
                onClick={() => {
                  dispatch(removeActiveAdminForm());
                }}
              />
              <div className="inner-form-content">{activeForm === 'add_lti_tool' ? <CreateLtiTool /> : <CreateLtiTool editMode />}</div>
            </div>
          )}
          {removeUser && <RemoveUser users={users} setUsers={setUsers} />}

          <EditProjectModel
            show={modalShow}
            onHide={() => setModalShow(false)}
            row={rowData}
            showFooter={true}
            activePage={activePageNumber}
            setAllProjectTab={setAllProjectTab}
            activeOrganization={activeOrganization}
          />
          <EditTeamModel show={modalShowTeam} onHide={() => setModalShowTeam(false)} activePage={activePageNumber} activeOrganization={activeOrganization} showFooter={true} />
        </>
      ) : (
        <div className="content-wrapper" style={{ padding: '20px' }}>
          <Alert variant="danger">You are not authorized to view this page.</Alert>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
