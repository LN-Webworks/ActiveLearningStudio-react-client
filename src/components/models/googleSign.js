/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal /* , Button */ } from 'react-bootstrap';
import { Formik } from 'formik';
import { GoogleLogin } from 'react-google-login';

import logo from 'assets/images/loginlogo.png';
import {
  googleClassRoomLoginAction,
  googleClassRoomLoginFailureAction,
 } from 'store/actions/gapi';
import { copyProject  } from 'store/actions/share';

const GoogleModel = ({
  show,
  onHide,
  googleClassRoomLogin,
  googleClassRoomLoginFailure,
  projectId,
}) => {
  
  const dataRedux = useSelector((state) => state);
 
  const [showForm, setShowForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dataRedux.share.googleShare === true) {
      setShowForm(true);
    } else if (dataRedux.share.googleShare === false) {
      setShowForm(false);
    } else if (dataRedux.share.googleShare === 'close') {
      onHide();
    }
  }, [dataRedux, onHide]);

  useEffect(() => {
    if(!!dataRedux.share.courses){
      setCourses(dataRedux.share.courses);
      setLoading(false)
    }
  }, [dataRedux.share.courses])

  return (
    <Modal
      show={show}
      onHide={onHide}
      className="model-box-google model-box-view"
    >
      <Modal.Header closeButton>
        <img src={logo} alt="" />
      </Modal.Header>

      <Modal.Body>
        <div className="sign-in-google">
          {!showForm ? (
            <div className="content-authorization">
              <p>
                With CurrikiStudio you can publish your Project as a new Google Classroom course.
              </p>
              <p>To start, please log into your Google account.</p>
              <div>
                <GoogleLogin
                  clientId="898143939834-9ioui2i9ghgrmcgmgtg0h6rsf83d0t0c.apps.googleusercontent.com"
                  onSuccess={googleClassRoomLogin}
                  onFailure={(response) => googleClassRoomLoginFailure(response)}
                  scope="https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.topics https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.coursework.students"
                  cookiePolicy="single_host_origin"
                >
                  <span>Login with Google</span>
                </GoogleLogin>
              </div>
            </div>
          ) : (
            <div className="classroom-form">
              <div>
                <h1>
                  Are you sure you want to share this Project to Google Classroom?
                </h1>
                {loading && <p className="loading-classes">Loading Classes....</p>}
                <Formik
                  initialValues={{
                    course: 'test',
                    heading: 'test',
                    description: 'test',
                    room: 'test',
                  }}
                 
                  onSubmit={( values ) => {
                   onHide()
                    copyProject(projectId, values.course);
                    setLoading(false)
                  }}
                >
                  {({
                    values,
                    // errors,
                    // touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    // isSubmitting,
                    /* and other goodies */
                  }) => (
                    <form onSubmit={handleSubmit}>
                        <select
                            class="form-control select-dropdown"
                            name="course"
                            value={values.course}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        >
                            <option value="">Create a new class</option>
                            {!!courses && courses.map((item, i) => {
                              return <option key={i} value={item.id}>{item.name}</option>;
                            })}
                        </select>
                      {/* <input
                        type="text"
                        name="course"
                        class="form-control"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.course}
                        placeholder="Course Name"
                      /> */}

                      {/* {errors.course && touched.course && (
                        <div className="form-error">{errors.course}</div>
                      )} */}

                      {/* <select
                        class="form-control"
                        name="room"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.room}
                        placeholder="Course Name"
                      >
                        <option>Select your room</option>
                        {rooms.map((data) => {
                          return <option>{data}</option>;
                        })}
                      </select> */}

                      {/* {errors.room && touched.room && (
                        <div className="form-error">{errors.room}</div>
                      )} */}

                      {/* <input
                        type="text"
                        name="heading"
                        class="form-control"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.heading}
                        placeholder="Heading"
                      /> */}

                      {/* {errors.heading && touched.heading && (
                        <div className="form-error">{errors.heading}</div>
                      )} */}

                      {/* <textarea
                        class="form-control"
                        rows="5"
                        type="text"
                        name="description"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                        placeholder="Description"
                      /> */}

                      {/* {errors.description && touched.description && (
                        <div className="form-error">{errors.description}</div>
                      )} */}

                      {/*
                      <p>
                        Are you sure you want to share this Project to Google Classroom?
                      </p>
                      */}
                      {!loading &&<button type="submit">Confirm</button>}
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

GoogleModel.propTypes = {
  show: PropTypes.bool.isRequired,
  projectId: PropTypes.number.isRequired,
  onHide: PropTypes.func.isRequired,
  googleClassRoomLogin: PropTypes.func.isRequired,
  googleClassRoomLoginFailure: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  googleClassRoomLogin: (response) => dispatch(googleClassRoomLoginAction(response)),
  googleClassRoomLoginFailure: (response) => dispatch(googleClassRoomLoginFailureAction(response)),
});

const mapStateToProps = () => ({});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GoogleModel),
);
