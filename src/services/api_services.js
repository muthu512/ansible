import axios from 'axios';
import { useRouter } from 'src/routes/hooks';
import useAuthToken from './user_auth_token';

// const API_BASE_URL = 'https://login360.info:8080/services';
const API_BASE_URL = 'http://192.168.29.140:8080/services';

const ApiService = () => {
  const token = useAuthToken();
  const router = useRouter();

  const connectionCheck = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      router.push(`/not_found`);
      throw error;
    }
  };
  
  const getHeaders = () => {
    if (token !== null && token !== '') {
      return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        accept: 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
      accept: 'application/json',
    };
  };

  const signin = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      router.push(`/not_found`);
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const saveAppUser = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/appuser/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appuser/get`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const getUsersByDepartment = async (deptCode) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/appuser/get/department?deptCode=${deptCode}`,
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };
  const getUserById = async (uid) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appuser/get/id?uid=${uid}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const getActiveUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appuser/get/active`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  // =======================Roles==========================

  const getRoles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/role/get/all`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw error;
    }
  };

  const createRole = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/role/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const getRolesActive = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/role/get/active`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw error;
    }
  };

  //  ================================Department================================

  const getDepartment = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/department/get/all`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw error;
    }
  };
  
  const getDepartmentActive = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/department/get/active`,{
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw error;
    }
  };

  const createDepartment = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/department/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  //  ================================Designation============================

  const getDesignation = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/designation/get/all`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw error;
    }
  };

  const createDesignation = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/designation/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const getDesignationActive = async (code) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/designation/get/${code}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching designationActive:', error.message);
      throw error;
    }
  };

  // ========================  users

  const getUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appuser/get/all`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw error;
    }
  };

  // ===================== status

  const getStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/status/get/all`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching status:', error.message);
      throw error;
    }
  };
  const getStatusActive = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/status/get/active`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching status:', error.message);
      throw error;
    }
  };
  const createStatus = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/status/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching status:', error);
      throw error;
    }
  };

  // ===================== Leads

  const getLeads = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lead/get/all`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error.message);
      router.push(`/409`);
      throw error;
    }
  };
  const getLeadsActive = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lead/get/active`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching status:', error.message);
      throw error;
    }
  };
  const createLeads = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/lead/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching lead:', error);
      throw error;
    }
  };

  // ===================== CourseType

  const getCourseType = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course/type/get/all`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching course type:', error.message);
      throw error;
    }
  };
  const getCourseTypeActive = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course/type/get/active`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching course type:', error.message);
      throw error;
    }
  };
  const createCourseType = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/course/type/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching course type:', error);
      throw error;
    }
  };

  // =============== Courses

  const getCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course/get/all`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error.message);
      throw error;
    }
  };
  const getCourseActive = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course/get/active`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error.message);
      throw error;
    }
  };
  const createCourse = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/course/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  };

  // =============== Fresher/ Exprience

  const getFresherOrExprience = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fresh/expr/get/all`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FresherOrExprience :', error.message);
      throw error;
    }
  };
  const getFresherOrExprienceActive = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fresh/expr/get/active`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FresherOrExprience :', error.message);
      throw error;
    }
  };
  const createFresherOrExprience = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/fresh/expr/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FresherOrExprience :', error);
      throw error;
    }
  };

  // ================= Customer

  const createCustomer = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/customer/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  };

  const getCustomersByStatus = async (statusCode) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customer/get/status/${statusCode}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FresherOrExprience :', error.message);
      throw error;
    }
  };
  const getCustomersAll = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customer/get/all`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FresherOrExprience :', error.message);
      throw error;
    }
  };

  const getCustomerById = async (cid) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customer/get/id/${cid}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FresherOrExprience :', error.message);
      throw error;
    }
  };

  // ----------Follow up

  const addFollowup = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/followup/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  };
  const getCustomersFollowup = async (cid) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/followup/get/customer/${cid}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FresherOrExprience :', error.message);
      throw error;
    }
  };
  // ====================== dashboard

  const getDashboardInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/basic/info`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FresherOrExprience :', error.message);
      throw error;
    }
  };

  // ------------------Remeinder ------------------

  const addReminder = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reminder/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  };
  const getReminderbyToday = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reminder/today`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FresherOrExprience :', error.message);
      throw error;
    }
  };
  const getReminder = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reminder/all`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FresherOrExprience :', error.message);
      throw error;
    }
  };
  const getEnquiries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customer/today/enquiry/details`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FresherOrExprience :', error.message);
      throw error;
    }
  };

  const getFollowups = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/followup/today/details`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FresherOrExprience :', error.message);
      throw error;
    }
  };

  const getDeleteCustomer = async (cid) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/customer/delete/${cid}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FresherOrExprience :', error.message);
      throw error;
    }
  };

  const getBatchesByTrainner = async (uid) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/batch/trainner?uid=${uid}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FresherOrExprience :', error.message);
      throw error;
    }
  };

  const createBatches = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/batch/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching batch:', error);
      throw error;
    }
  };

  const getAllBatches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/batch/get/all`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching get batch:', error);
      throw error;
    }
  };

  const deleteBatches = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/batch/delete/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching get batch:', error);
      throw error;
    }
  };

  const getBatchCourses = async (code) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/batch/course?code=${code}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching get batch:', error);
      throw error;
    }
  };

  const addToBatch = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/student/onboard/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  };

  const studentOnboardTable = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/student/onboard/get/all`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching status:', error.message);
      throw error;
    }
  };

  

  const getStudentOnboardBatch = async (cid) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/student/onboard/get/batch?cid=${cid}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching get batch:', error);
      throw error;
    }
  };

  const getStudentInfo = async (batchId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/student/onboard/get/student?id=${batchId}`,
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching get batch:', error);
      throw error;
    }
  };

  const deleteStudentOnboard = async (onboardId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/student/onboard/delete/batch?id=${onboardId}`,
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching get batch:', error);
      throw error;
    }
  };

  const createStudentAttendance = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/student/attendance/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('createStudentAttendance:', error);
      throw error;
    }
  };

  const getBatchAttendanceReportByDate = async (batchId, date) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/student/attendance/get/batch?batchId=${batchId}&attDate=${date}`,
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching get batch:', error);
      throw error;
    }
  };

  const getBatchAttendanceReportInfo = async (batchId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/student/attendance/batch/report?batchId=${batchId}`,
        {
          headers: getHeaders(),
        }
      );
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching get batch:', error);
      throw error;
    }
  };

  const getBatchAttendanceOverallReport = async (batchId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/student/attendance/batch/overall/report?batchId=${batchId}`,
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching get batch:', error);
      throw error;
    }
  };

  const createSyllabus = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/syllabus/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('createSyllabus', error);
      throw error;
    }
  };

  const getAllSyllabus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/syllabus/getall`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('getSyllabus', error);
      throw error;
    }
  };

  const getSyllabusByTopic = async (topicId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/syllabus/get/topics?id=${topicId}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('getTopic', error);
      throw error;
    }
  };

  const getCustomerSearch = async (key) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customer/search/all?key=${key}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error Global Search  :', error.message);
      throw error;
    }
  };

  const updateSyllabus = async (data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/syllabus/topic/update`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error Global Search  :', error.message);
      throw error;
    }
  };

  const deleteSyllabus = async (topicId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/syllabus/delete/topic?id=${topicId}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching get batch:', error);
      throw error;
    }
  };

  const getSyllabusByCourse = async (courseCode) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/syllabus/course?code=${courseCode}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('getSyllabusByCourse:', error.message);
      throw error;
    }
  };

  const getBatchSyllabusTopic = async (batchId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/batch/syllabus/topics?id=${batchId}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('getBatchSyllabusTopic:', error.message);
      throw error;
    }
  };

  const createPayment = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/transaction/save`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('createTransaction', error);
      throw error;
    }
  };

  const getPaymentTransaction = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transaction/getall`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('getPaymentTransaction:', error.message);
      throw error;
    }
  };

  const getAllStudentReport = async (batchId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/student/attendance/report?batchId=${batchId}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('getPaymentTransaction:', error.message);
      throw error;
    }
  };

  const searchCrmReport = async (searchData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/crm/search`, searchData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('getPaymentTransaction:', error.message);
      throw error;
    }
  };

  const searchReportStudent = async (searchData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/student/report/search`, searchData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('getPaymentTransaction:', error.message);
      throw error;
    }
  };

  const downloadCrmReport = async (download) => {
    try {
      const response = await axios({
        url: `${API_BASE_URL}/crm/download`, // Your API endpoint
        method: 'POST',
        data:download,
        headers:getHeaders(),
        responseType: 'arraybuffer', // Important for binary data
      });
      return response;
    } catch (error) {
      console.error('downloadCrmReport:', error.message);
      throw error;
    }
  };
  
  const getPaymentStatus = async (cid) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transaction/customer?cid=${cid}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('getPaymentTransaction:', error.message);
      throw error;
    }
  };

  const downloadStudentReport = async (download) => {
    try {
      const response = await axios({
        url: `${API_BASE_URL}/student/report/download`, // Your API endpoint
        method: 'POST',
        data:download,
        headers:getHeaders(),
        responseType: 'arraybuffer', // Important for binary data
      });
      return response;
    } catch (error) {
      console.error('downloadStudentReport:', error.message);
      throw error;
    }
  };

  const deleteReminder = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/reminder/delete/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching deleteReminder :', error.message);
      throw error;
    }
  };

  const assigneeCreate = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/assignee/change/save`,data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('createAssignee', error.message);
      throw error;
    }
  };

  const getTransactionDashbord = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transaction/dashboard`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('getPaymentTransaction:', error.message);
      throw error;
    }
  }; 

  const deleteTranssaction = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/transaction/delete/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching deleteTransaction :', error.message);
      throw error;
    }
  };

  const getassigneeCreate = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/assignee/change/get/all`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('getPaymentTransaction:', error.message);
      throw error;
    }
  };


  const getTransactionDataWeek = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transaction/week/chart`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('getTransactionDataWeek:', error.message);
      throw error;
    }
  };

  const deleteChangedAssignee = async (id) => {
    try{
      const response = await axios.delete(`${API_BASE_URL}/assignee/change/delete/${id}`, {
        headers: getHeaders(),
        });
        return response.data;
    } catch (error){
      console.error('deleteChangedAssignee:', error.message);
      throw error;
    }
  } 

  const searchTransaction = async (searchData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/transaction/report/search`, searchData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('getPaymentTransaction:', error.message);
      throw error;
    }
  };

  const downloadTransactionReport = async (download) => {
    try {
      const response = await axios({
        url: `${API_BASE_URL}/transaction/report/download`, // Your API endpoint
        method: 'POST',
        data:download,
        headers:getHeaders(),
        responseType: 'arraybuffer', // Important for binary data
      });
      return response;
    } catch (error) {
      console.error('downloadTransaactionReport:', error.message);
      throw error;
    }
  };

  const downloadCertificatePDF = async (id) => {
    try {
      const response = await axios({
        url: `${API_BASE_URL}/pdf/cert/download/${id}`, 
        method: 'GET',
        responseType: 'blob', // Important for handling PDF as a Blob
      });
  
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate_${id}.pdf`); // Customize the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response;
    } catch (error) {
      console.error('downloadCertificatePDF:', error.message);
      throw error;
    }
  };

  const deleteManageSyllabus = async (syllbusId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/syllabus/delete/syllabus?id=${syllbusId}`, {
            headers: getHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('deleteManageSyllabus:', error.message);
        throw error;
    }
};


  return {
    connectionCheck,
    getUserInfo,
    register,
    signin,
    getRoles,
    createRole,
    getDepartment,
    createDepartment,
    getDesignation,
    createDesignation,
    getDepartmentActive,
    getUsers,
    getDesignationActive,
    getRolesActive,
    saveAppUser,
    createStatus,
    getStatus,
    getStatusActive,
    createLeads,
    getLeads,
    getLeadsActive,
    createCourseType,
    getCourseTypeActive,
    getCourseType,
    createCourse,
    getCourseActive,
    getCourses,
    createFresherOrExprience,
    getFresherOrExprience,
    getFresherOrExprienceActive,
    getActiveUsers,
    createCustomer,
    getCustomersByStatus,
    getUserById,
    getCustomerById,
    addFollowup,
    getCustomersFollowup,
    getDashboardInfo,
    addReminder,
    getReminderbyToday,
    getReminder,
    getEnquiries,
    getFollowups,
    getDeleteCustomer,
    getBatchesByTrainner,
    createBatches,
    getAllBatches,
    studentOnboardTable,
    getBatchCourses,
    addToBatch,
    getStudentOnboardBatch,
    getStudentInfo,
    createStudentAttendance,
    getBatchAttendanceReportInfo,
    getBatchAttendanceReportByDate,
    getBatchAttendanceOverallReport,
    getUsersByDepartment,
    deleteStudentOnboard,
    createSyllabus,
    getAllSyllabus,
    getSyllabusByTopic,
    getCustomersAll,
    updateSyllabus,
    deleteSyllabus,
    getCustomerSearch,
    getSyllabusByCourse,
    getBatchSyllabusTopic,
    createPayment,
    getPaymentTransaction,
    getAllStudentReport,
    searchCrmReport,
    searchReportStudent,
    downloadCrmReport,
    getPaymentStatus,
    downloadStudentReport,
    deleteReminder,
    assigneeCreate,
    getTransactionDashbord,
    getassigneeCreate,
    deleteTranssaction,
    getTransactionDataWeek,
    deleteChangedAssignee,
    searchTransaction,
    downloadTransactionReport,
    deleteBatches,
    downloadCertificatePDF,
    deleteManageSyllabus,
  };
}
export default ApiService;
