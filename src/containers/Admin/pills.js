/* eslint-disable */
import React, { useState, useMemo, useEffect } from "react";
import { Tabs, Tab, Table } from "react-bootstrap";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import adminService from "services/admin.service";
import Starter from "./starter";
import { columnData } from "./column";


import { getOrgUsers, searchUserInOrganization, getsubOrgList, getRoles, clearSearchUserInOrganization } from 'store/actions/organization';
import { getActivityItems, loadResourceTypesAction } from "store/actions/resource";
import { getJobListing, getLogsListing, getUserReport } from "store/actions/admin";
import { alphaNumeric } from "utils";

export default function Pills(props) {
  const { modules, type, subType } = props;

  const [key, setKey] = useState(modules && modules[0]);

  const [subTypeState, setSubTypeState] = useState(subType);
  // All User Business Logic Start
  const dispatch = useDispatch();
  const organization = useSelector((state) => state.organization);
  const { activityTypes, activityItems } = useSelector ((state) => state.admin)
  const [userReportsStats, setUserReportStats] = useState(null);
  const admin = useSelector((state) => state.admin);
  const [ activePage, setActivePage ] = useState(1);
  const [ size, setSize ] = useState(10);
  const { activeOrganization, roles, permission, searchUsers } = organization;
  const [ activeRole,setActiveRole ] = useState('');
  const { activeTab, activityType } = admin
  const [currentTab, setCurrentTab] = useState("all");
  const [users, setUsers] = useState(null);
  const [searchAlertToggler, setSearchAlertToggler] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryProject, setSearchQueryProject] = useState("");
  const [searchQueryStats, setSearchQueryStats] = useState("");
  const [allProjectTab, setAllProjectTab] = useState(null);
  const [allProjectUserTab, setAllProjectUserTab] = useState(null);
  const [allProjectIndexTab, setAllProjectIndexTab] = useState(null);
  const [lmsProject, setLmsProject] = useState(null);
  const [jobs, setJobs ] = useState(null);
  const [jobType, SetJobType] = useState({ value: 1 , display_name: 'Pending'});
  const [logs, setLogs ] = useState(null);
  const [logType, SetLogType] = useState({ value: 'all' , display_name: 'All'});
  const [changeIndexValue, setChangeIndexValue] = useState("1");
  useEffect(()=>{
    setKey(modules?.[0])

  },[activeTab])
  const searchUsersFromOrganization = async (query, page) => {
    if (query.length > 1) {
      const result = await dispatch(
        searchUserInOrganization(activeOrganization?.id, query, searchUsers ? activePage : 1, activeRole)
      );
      if (result?.data?.length > 0) {
        setUsers(result);
        setSearchAlertToggler(1);
      } else {
        setSearchAlertToggler(0);
      }
    }
  };
  const searchQueryChangeHandler = async ({ target }) => {
    if (target.value.length) {
      if(!!alphaNumeric(target.value)) {
        setSearchQuery(target.value);
      }
      searchUsersFromOrganization(target.value, activePage);
      setActivePage(searchUsers ? activePage : 1);
      if (target.value.length> 1 ) setUsers(null);
    } else {
      dispatch(clearSearchUserInOrganization());
      setActivePage(1);
      setSearchQuery("");
      const result = await dispatch(
        getOrgUsers(activeOrganization?.id, 1, activeRole)
      );
      setUsers(result);
    }
  };



  const searchProjectQueryChangeHandler = async ({ target }, index, subType) => {
    console.log(target.value, subType)

    if (subType === 'index') {
      if (!!target.value) {
        setSearchQueryProject(target.value);
        setAllProjectIndexTab(null);
        const searchapi = adminService.userSerchIndexs(activeOrganization?.id, undefined, index, target.value)
        searchapi.then((data) => {
          // console.log(data)
          setAllProjectIndexTab(data)

        })
      } else {
        setSearchQueryProject('');
        const searchapi = adminService.getAllProjectIndex(activeOrganization?.id, activePage, index)
        searchapi.then((data) => {
          // console.log(data)
          setAllProjectIndexTab(data)

        })
      }
    } else if (subType === 'all') {
      if (!!target.value) {
        setSearchQueryProject(target.value);
        setAllProjectTab(null);
        const allproject = adminService.getAllProjectSearch(activeOrganization?.id, undefined, target.value)
        // console.log(allproject)
        allproject.then((data) => {
          console.log(data)
          setAllProjectTab(data)
        })
      } else {
        setSearchQueryProject('');
        const allproject = adminService.getAllProject(activeOrganization?.id, activePage)
        allproject.then((data) => {
          // console.log(data)
          setAllProjectTab(data)
        })
      }
    } else if (subType === 'user') {
      if (!!target.value) {
        setSearchQueryProject(target.value);
        setAllProjectUserTab(null);
        const userproject = adminService.getUserProjectSearch(activeOrganization?.id, undefined, target.value)
        userproject.then((data) => {
          setAllProjectUserTab(data)
        })
      } else {
        setSearchQueryProject('');
        const userproject = adminService.getUserProject(activeOrganization?.id, activePage)
        userproject.then((data) => {
          // console.log(data)
          setAllProjectUserTab(data)
        })
      }
    }
  };

  useMemo(() => {
    if (activeTab !== 'Users') setActiveRole(null);
  }, [activeTab])

  useMemo(async () => {

    if (
      activeOrganization &&
      type === "Users" &&
      subTypeState === "All Users"
    ) {
      if (searchQuery.length > 1) {
        const result = await dispatch(searchUserInOrganization(activeOrganization?.id, searchQuery, activePage, activeRole));
        setUsers(result);
      }
      else if (
        organization?.users?.data?.length > 0 &&
        activePage === organization?.activePage &&
        !activeRole
      ) {
        setUsers(organization?.users);
      } else if (activeRole) {
        const result = await dispatch(
          getOrgUsers(activeOrganization?.id, activePage, activeRole)
        );
        setUsers(result);
      }
    }
    if (type === 'Organization' ) {
       dispatch(getsubOrgList(activeOrganization?.id));
    }
  }, [
    activeOrganization,
    activePage,
    type,
    subTypeState,
    activeTab,
    activeRole,
    organization?.users?.length
  ]);
  // All Users Business Logic End

  useMemo(async () => {
    setAllProjectTab(null);
    setAllProjectUserTab(null);
    setAllProjectIndexTab(null);
    if (activeOrganization && type === "Project" && currentTab == "all") {
      const result = await adminService.getAllProject(
        activeOrganization?.id,
        activePage || 1
      );
      setAllProjectTab(result);
    } else if (
      activeOrganization &&
      type === "Project" &&
      currentTab === "user"
    ) {
      const result = await adminService.getUserProject(
        activeOrganization?.id,
        activePage || 1
      );
      setAllProjectUserTab(result);
    } else if (
      activeOrganization &&
      type === "Project" &&
      currentTab === "index"
    ) {
      const result = await adminService.getAllProjectIndex(
        activeOrganization?.id,
        activePage || 1,
        changeIndexValue
      );
      setAllProjectIndexTab(result);
    }
  }, [activeOrganization?.id, type, activePage, changeIndexValue, currentTab]);
  // Activity Tab Business Logic
  useEffect(() => {
    if (type=== 'Activities' && subTypeState === 'Activity Items') {
      //pagination
      dispatch(getActivityItems('', activePage));
    } else if (type=== 'Activities' && subTypeState === 'Activity Items' && activePage === 1) {
      //on page 1
      dispatch (getActivityItems());
    }
  }, [type, subTypeState, activePage])
  useEffect(() => {
    if (type=== 'Activities' && subTypeState === 'Activity Types' && activePage !== organization?.activePage) {
      //pagination
      dispatch(loadResourceTypesAction('', activePage));
    } else if (type=== 'Activities' && subTypeState === 'Activity Types' && activePage === 1) {
      //on page 1
      dispatch (loadResourceTypesAction());
    }
  },[activePage, subTypeState, type])
  const searchActivitiesQueryHandler = async ({target}, subTypeRecieved) => {
    if (subTypeRecieved === 'Activity Types') {
      if (target.value) {
        await dispatch(loadResourceTypesAction(target.value, ''));
      } else {
        await dispatch(loadResourceTypesAction());
      }
    } else if (subTypeRecieved === 'Activity Items') {
      if (target.value) {
        await dispatch(getActivityItems(target.value, ''));
      } else {
        await dispatch(getActivityItems());
      }
    }
  }
  // Stats User Report
  useEffect(() => {
    if (type=== 'Stats' && subTypeState === 'Report' && searchQueryStats) {
      setUserReportStats(null);
      let result = dispatch(getUserReport('all', size, activePage, searchQueryStats));
      result.then((data) =>{
        setUserReportStats(data);
      });
    }
    else if (type=== 'Stats' && subTypeState === 'Report' && (activePage !== organization?.activePage || size !== organization?.size)) {
      //pagination
      setUserReportStats(null);
      let result = dispatch(getUserReport('all',size,activePage,''));
      result.then((data) =>{
        setUserReportStats(data);
      });
    } else if (type=== 'Stats' && subTypeState === 'Report' && (activePage === 1 || size === 10)) {
      //on page 1
      setUserReportStats(null);
      let result = dispatch (getUserReport('all'));
      result.then((data) =>{
        setUserReportStats(data);
      });
    }
    if (type === 'Stats' && subTypeState === 'Queues:Jobs' && searchQueryStats) {
      let result = dispatch(getJobListing(jobType.value, size, activePage ,searchQueryStats));
      result.then((data) => setJobs(data.data));
    }
    else if (type === 'Stats' && subTypeState === 'Queues:Jobs' && (activePage !== organization?.activePage || size !== organization?.size) && jobType) {
      const result = dispatch(getJobListing(jobType.value, size, activePage))
      result.then((data) => {
        setJobs(data.data);
      });
    } else if (type === 'Stats' && subTypeState === 'Queues:Jobs' && (activePage === 1 || size === 10)) {
      const result = dispatch(getJobListing(jobType.value))
      result.then((data) => {
        setJobs(data.data);
      });
    }
    if (type === 'Stats' && subTypeState === 'Queues:Logs' && searchQueryStats) {
      let result = dispatch(getLogsListing(logType.value, size, activePage , searchQueryStats));
      result.then((data) => setLogs(data.data));
    }
    else if (type === 'Stats' && subTypeState === 'Queues:Logs' && (activePage !== organization?.activePage || size !== organization?.size) && logType) {
      const result = dispatch(getLogsListing(logType.value, size, activePage))
      console.log(result);
      result.then((data) => {
        setLogs(data.data);
      });
    } else if (type === 'Stats' && subTypeState === 'Queues:Logs' && (activePage === 1 || size === 10)) {
      const result = dispatch(getLogsListing(logType.value))
      result.then((data) => {
        setLogs(data.data);
      });
    }
  },[activePage, subTypeState, type, size, jobType, logType])
  const searchUserReportQueryHandler = async ({target}, subTypeRecieved) => {
    if (subTypeRecieved === 'Report') {
      if (target.value) {
        setUserReportStats(null);
        setSearchQueryStats(target.value);
        setUserReportStats(await dispatch(getUserReport('all', size, undefined, target.value)));
      } else {
        setSearchQueryStats('');
        setUserReportStats(null);
        setUserReportStats(await dispatch(getUserReport('all', size, activePage)));
      }
    }
    if (subTypeRecieved === 'Queues:Jobs') {
      if (target.value) {
        setSearchQueryStats(target.value);
        let result = dispatch(getJobListing(jobType.value, size, undefined ,target.value));
        result.then((data) => setJobs(data.data));
      } else {
        setSearchQueryStats('');
        let result = dispatch(getJobListing(jobType.value, size, activePage));
        result.then((data) => setJobs(data.data));
      }
    }
    if (subTypeRecieved === 'Queues:Logs') {
      if (target.value) {
        setSearchQueryStats(target.value);
        let result = dispatch(getLogsListing(logType.value, size, undefined , target.value));
        result.then((data) => setLogs(data.data));
      } else {
        setSearchQueryStats('');
        let result = dispatch(getLogsListing(logType.value, size, activePage));
        result.then((data) => setLogs(data.data));
      }
    }
  }
  //LMS project ***************************************
  useMemo(async () => {
    if(type==="LMS") {
    // setLmsProject(null);
    const result =  adminService.getLmsProject(activePage|| 1);
    result.then((data) => {
      setLmsProject(data)
    })
    }
  }, [type, activePage]);

  const searchQueryChangeHandlerLMS = (search) => {
    // setLmsProject(null);
    const result =  adminService.getLmsProjectSearch(search.target.value,(activePage|| 1));
    result.then((data) => {
      setLmsProject(data)
    })
  }

  useEffect(() => {
    if (activeTab === 'Project') {
      setSubTypeState('All Projects');
      setCurrentTab('all');
    } else if (activeTab === 'Activities') {
      setSubTypeState('Activity Types');
    } else if (activeTab === 'Users') {
      setSubTypeState('All Users');
    } else if (activeTab === 'Stats') {
      setSubTypeState('Report');
    }
  },[activeTab]);
  // console.log(columnData)
  return (
    <Tabs
      defaultActiveKey={modules && modules[0]}
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(key) => {
        setSubTypeState(key);
        setKey(key);
        setActivePage(1)
        setSearchQueryProject('');
        setSearchQueryStats('');
        if (key === "All Projects") {
          setCurrentTab("all");
        } else if (key === "User Projects") {
          setCurrentTab("user");
        } else if (key === "Indexing Queue") {
          setCurrentTab("index");
        }
      }}
    >
      {modules?.map((asset) => (
        <Tab eventKey={asset} title={asset}>
          <div className="module-content-inner">
            {type === "Stats" && subTypeState === "Report" && (
              <Starter
                paginationCounter={true}
                search={true}
                print={true}
                data={userReportsStats}
                searchUserReportQueryHandler={searchUserReportQueryHandler}
                btnText=""
                btnAction=""
                searchQueryStats={searchQueryStats}
                subTypeState={subTypeState}
                importUser={false}
                filter={true}
                size={size}
                setSize={setSize}
                activePage={activePage}
                setActivePage={setActivePage}
                tableHead={columnData.statereport}
                type={type}
              />
            )}
            {type === "Stats" && subTypeState === "Queues:Jobs" && (
              <Starter
                paginationCounter={true}
                search={true}
                print={false}
                data={jobs}
                btnText=""
                subTypeState={subTypeState}
                searchUserReportQueryHandler={searchUserReportQueryHandler}
                size={size}
                jobType={jobType}
                SetJobType={SetJobType}
                setSize={setSize}
                activePage={activePage}
                btnAction=""
                searchQueryStats={searchQueryStats}
                importUser={false}
                filter={true}
                setActivePage={setActivePage}
                tableHead={columnData.statejobs}
                type={type}
              />
            )}
            {type === "Stats" && subTypeState === "Queues:Logs" && (
              <Starter
                paginationCounter={true}
                search={true}
                print={false}
                data={logs}
                btnText=""
                subTypeState={subTypeState}
                searchUserReportQueryHandler={searchUserReportQueryHandler}
                size={size}
                logType={logType}
                SetLogType={SetLogType}
                setSize={setSize}
                btnAction=""
                searchQueryStats={searchQueryStats}
                importUser={false}
                filter={true}
                activePage={activePage}
                setActivePage={setActivePage}
                tableHead={columnData.statelogs}
                type={type}
              />
            )}
            {type === "Users" && subTypeState === "All Users" && (
              <Starter
                // paginationCounter={true}
                search={true}
                print={false}
                btnText="Create new user"
                btnAction="create_user"
                importUser={true}
                filter={false}
                tableHead={columnData.userall}
                data={users}
                activePage={activePage}
                // size={size}
                // setSize={setSize}
                activeRole={activeRole}
                setActiveRole={setActiveRole}
                subTypeState={'All Users'}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchQueryChangeHandler={searchQueryChangeHandler}
                searchAlertToggler={searchAlertToggler}
                setActivePage={setActivePage}
                type={type}
                roles={roles}
                inviteUser={true}
              />
            )}
            {type === "Users" && subTypeState === "Manage Roles" && (
              <Starter
                paginationCounter={false}
                search={false}
                print={false}
                btnText="Add Role"
                btnAction="add_role"
                importUser={false}
                filter={false}
                subTypeState={subTypeState}
                tableHead={[]}
                data={[]}
                activeRole={activeRole}
                setActiveRole={setActiveRole}
                type={type}
                roles={roles}
                permissionRender={permission?.Organization?.includes('organization:view-role')}
              />
            )}
            {type === "Organization" && (
              <Starter
                paginationCounter={false}
                search={true}
                print={false}
                btnText="Create Organization"
                btnAction="add_org"
                importUser={false}
                filter={false}
                tableHead={columnData.organization}
                data={[]}
                type={type}

              />
            )}

            {type === "LMS" && (
              <Starter
                paginationCounter={false}
                search={true}
                print={false}
                btnText="Create New LMS"
                btnAction="add_lms"
                importUser={false}
                filter={false}
                tableHead={columnData.lmssettings}
                data={lmsProject}
                type={type}
                setActivePage={setActivePage}
                activePage={activePage}
                searchQueryChangeHandler={searchQueryChangeHandlerLMS}
              />
            )}

            {type === "Project" && subTypeState === "All Projects" && (
              <Starter
                paginationCounter={false}
                search={true}
                tableHead={columnData.projectAll}
                data={allProjectTab}
                searchProjectQueryChangeHandler={searchProjectQueryChangeHandler}
                type={type}
                importUser={true}
                searchQueryProject={searchQueryProject}
                setActivePage={setActivePage}
                activePage={activePage}
                subType="all"
                setCurrentTab={setCurrentTab}
              />
            )}
            {type === "Project" && subTypeState === "User Projects" && (
              <Starter
                paginationCounter={false}
                search={true}
                tableHead={columnData.projectUser}
                data={allProjectUserTab}
                type={type}
                setActivePage={setActivePage}
                activePage={activePage}
                subType="user"
                setCurrentTab={setCurrentTab}
                searchQueryProject={searchQueryProject}
                searchProjectQueryChangeHandler={searchProjectQueryChangeHandler}
              />
            )}
            {type === "Project" && subTypeState === "Indexing Queue" && (
              <Starter
                paginationCounter={false}
                search={true}
                tableHead={columnData.projectIndex}
                data={allProjectIndexTab}
                type={type}
                searchQuery={searchQuery}
                searchProjectQueryChangeHandler={searchProjectQueryChangeHandler}
                searchAlertToggler={searchAlertToggler}
                setActivePage={setActivePage}
                activePage={activePage}
                subType="index"
                setCurrentTab={setCurrentTab}
                filter={true}
                searchQueryProject={searchQueryProject}
                setChangeIndexValue={setChangeIndexValue}
              />
            )}
            {type === 'Activities' && subTypeState === 'Activity Types' && (
              <Starter
                search={true}
                tableHead={columnData.ActivityTypes}
                subType={'Activity Types'}
                searchActivitiesQueryHandler={searchActivitiesQueryHandler}
                btnText="Add Activity Type"
                btnAction="add_activity_type"
                data={activityTypes}
                type={type}
                setActivePage={setActivePage}
                activePage={activePage}
              />
            )}
            {(type === 'Activities' && subTypeState === 'Activity Items') && (
              <Starter
                search={true}
                tableHead={columnData.ActivityItems}
                subType={'Activity Items'}
                searchActivitiesQueryHandler={searchActivitiesQueryHandler}
                btnText="Add Activity Item"
                btnAction="add_activity_item"
                data={activityItems}
                type={type}
                setActivePage={setActivePage}
                activePage={activePage}
              />
            )}
            {(type === 'Settings' && subTypeState === 'All settings') && (
              <Starter
                type={type}
                subType={'All settings'}
                subTypeState={subTypeState}
              />
            )}
          </div>
        </Tab>
      ))}
    </Tabs>
  );
}

Pills.propTypes = {
  manage: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
}
