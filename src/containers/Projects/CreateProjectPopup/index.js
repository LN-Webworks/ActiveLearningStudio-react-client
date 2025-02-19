/* eslint-disable */
import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import Swal from 'sweetalert2';
import { Alert } from 'react-bootstrap';

import computer from 'assets/images/svg/desktop.svg';
import loader from 'assets/images/loader.svg';
import pexel from 'assets/images/svg/pixel.svg';
import { required, maxLength } from 'utils';
import { createProjectAction, updateProjectAction, uploadProjectThumbnailAction, showCreateProjectModalAction, visibilityTypes } from 'store/actions/project';
import InputField from 'components/InputField';
import TextareaField from 'components/TextareaField';
import PexelsAPI from 'components/models/pexels';

import './style.scss';

const maxLength80 = maxLength(80);
const maxLength1000 = maxLength(1000);

let imageValidation = '';
const projectShare = true;

const onSubmit = async (values, dispatch, props) => {
  const {
    history,
    project,
    fromTeam,
    selectedTeam,
    handleCloseProjectModal,
  } = props;
  const { name, description, vType } = values;
  const result = await dispatch(
    project?.thumbUrl
      ? createProjectAction({
        name,
        description,
        thumb_url: project?.thumbUrl,
        is_public: projectShare,
        organization_visibility_type_id: 1,
        team_id: fromTeam && selectedTeam ? selectedTeam?.id : null
      })
      : createProjectAction({
        name,
        description,
        is_public: projectShare,
        organization_visibility_type_id: 1,
        team_id: fromTeam && selectedTeam ? selectedTeam?.id : null,
        // eslint-disable-next-line max-len
        thumb_url: 'https://images.pexels.com/photos/593158/pexels-photo-593158.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=1&amp;fit=crop&amp;h=200&amp;w=280',
      })
  );
  handleCloseProjectModal(false);
  if (result && !fromTeam) {
    history.push('/projects');
  }
};
export const uploadThumb = async (e, permission, teamPermission, id, dispatch) => {
  const formData = new FormData();
  try {
    formData.append('thumb', e.target.files[0]);
    if (id) {
      formData.append('project_id', id);
    }
    imageValidation = '';
    const result = await dispatch(uploadProjectThumbnailAction(formData));
    return result;
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      // eslint-disable-next-line max-len
      text:
        permission?.Project?.includes('project:upload-thumb') || teamPermission?.Team?.includes('team:view-project')
          ? 'Image upload failed, kindly try again'
          : 'You do not have permission to upload image',
    });
  }
};

let CreateProjectPopup = (props) => {
  const { isLoading, project, handleSubmit, handleCloseProjectModal, showCreateProjectModal, getProjectVisibilityTypes, vType } = props;
  const dispatch = useDispatch();
  const stateHeader = useSelector((state) => state.organization);
  const projectState = useSelector((state) => state.project);
  const { teamPermission } = useSelector((state) => state.team);
  const { permission } = stateHeader;
  const [modalShow, setModalShow] = useState(false);
  const openFile = useRef();
  const [visibilityTypeArray, setVisibilityTypeArray] = useState([]);
  // remove popup when escape is pressed
  const escFunction = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        handleCloseProjectModal(event);
      }
    },
    [handleCloseProjectModal]
  );


  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);
    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);
  useMemo(() => {
    (async () => {
      const { data } = await getProjectVisibilityTypes();
      setVisibilityTypeArray(data.data);
    })();
  }, [getProjectVisibilityTypes]);

  return (
    (permission?.Project?.includes('project:create')) ? (
      <div className="create-program-wrapper">
        <PexelsAPI
          show={modalShow}
          project={project}
          onHide={() => {
            setModalShow(false);
          }}
          searchName="abstract"
        />

        <form className="create-playlist-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="project-name">
            <Field
              name="name"
              component={InputField}
              type="text"
              validate={[required, maxLength80]}
              autoComplete="new-password"
              className="reduxlabel"
              label="Project name"
              placeholder="e.g Course Name"
            />
          </div>

          <div className="project-description">
            <Field name="description" component={TextareaField} validate={[required, maxLength1000]} autoComplete="new-password" label="Project Description" />
          </div>
          <div className="upload-thumbnail check">
            <div className="upload_placeholder">
              <label style={{ display: 'none' }}>
                <input
                  ref={openFile}
                  type="file"
                  accept="image/x-png,image/jpeg"
                  onChange={(e) => {
                    if (e.target.files.length === 0) {
                      return true;
                    }
                    if (
                      !(
                        e.target.files[0].type.includes('png') ||
                        e.target.files[0].type.includes('jpg') ||
                        e.target.files[0].type.includes('gif') ||
                        e.target.files[0].type.includes('jpeg')
                      )
                    ) {
                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Invalid file selected.',
                      });
                    } else if (e.target.files[0].size > 100000000) {
                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Selected file size should be less then 100MB.',
                      });
                    } else {
                      uploadThumb(e, permission, teamPermission, projectState?.selectedProject?.id, dispatch);
                    }
                  }}
                />
                <span>Upload</span>
              </label>

              <span className="validation-error">{imageValidation}</span>

              <div>
                {project?.thumbUrl ? (
                  <div className="thumb-display">
                    <label>
                      <h2>Upload Image</h2>
                    </label>
                    <div
                      className="imgbox"
                      style={{
                        backgroundImage: project.thumbUrl.includes('pexels.com') ? `url(${project.thumbUrl})` : `url(${global.config.resourceUrl}${project.thumbUrl})`,
                      }}
                    />
                  </div>
                ) : (
                  <div className="new-box">
                    <label>
                      <h2>Upload Image</h2>
                    </label>
                    <div className="imgbox">
                      {/* eslint-disable-next-line max-len */}
                      <img src="https://images.pexels.com/photos/593158/pexels-photo-593158.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=1&amp;fit=crop&amp;h=200&amp;w=280" alt="" />
                    </div>
                  </div>
                )}
              </div>

              <div className="button-flex ">
                <div className="pexel" onClick={() => setModalShow(true)}>
                  <img src={pexel} alt="pexel" />
                  <p>Pexels</p>
                </div>
                <div
                  className="gallery"
                  onClick={() => {
                    openFile.current.click();
                  }}
                >
                  <img src={computer} alt="" />
                  <p>My device</p>
                </div>
              </div>
            </div>

            <p className="disclaimer">
              Project Image dimension should be <strong>280px width and 200px height. </strong>
              Maximum File size allowed is <strong>100MB.</strong>
            </p>
          </div>
          <div className="create-project-template-wrapper">
            <button type="submit" className="create-project-submit-btn" disabled={isLoading}>
              {isLoading ? <img src={loader} alt="" /> : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    ) : (
      <Alert style={{ marginTop: '25px' }} variant="danger">
        You are not authorized to access this.
      </Alert>
    )
  );
};

CreateProjectPopup.propTypes = {
  project: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCloseProjectModal: PropTypes.func.isRequired,
  showCreateProjectModal: PropTypes.func.isRequired,
  getProjectVisibilityTypes: PropTypes.func.isRequired,
  vType: PropTypes.string,
};

CreateProjectPopup = reduxForm({
  form: 'createProjectForm',
  enableReinitialize: true,
  onSubmit,
})(CreateProjectPopup);

const mapDispatchToProps = (dispatch) => ({
  showCreateProjectModal: () => dispatch(showCreateProjectModalAction()),
  getProjectVisibilityTypes: () => dispatch(visibilityTypes()),
});

const mapStateToProps = (state) => ({
  initialValues: {
    name: state.project.selectedProject ? state.project.selectedProject.name : null,
    description: state.project.selectedProject ? state.project.selectedProject.description : null,
    vType: state.project.selectedProject?.organization_visibility_type_id ? state.project.selectedProject?.organization_visibility_type_id : null,
  },
  isLoading: state.project.isLoading,
  selectedTeam: state.team.selectedTeam,
});

export default React.memo(withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateProjectPopup)));
