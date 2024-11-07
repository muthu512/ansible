import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'src/routes/hooks';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Avatar, Card, CardHeader, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import useApiService from 'src/services/api_services';
import AppNewsUpdate from '../app-news-update';
import AppCurrentVisits from '../app-current-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppConversionRates from '../app-conversion-rates';
import BasicBars from '../app-transaction-weekly-barchat';

// ----------------------------------------------------------------------

export default function AppView() {
  const router = useRouter();

  const auth = useSelector((state) => state.auth);
  const { getDashboardInfo, getTransactionDashbord, getTransactionDataWeek } = useApiService();
  const [weeklyData, setWeeklyData] = useState({})
  const [load, setLoad] = useState(true);
  const [getTransaction, setGetTransaction] = useState([])
  const [transactionHandling, setTransactionHangling] = useState(false)
  const [dashboardInfo, setDashboardInfo] = useState({
    todayEnqiryies: 0,
    todayFollowups: 0,
    totalCustomers: 0,
    totalJoinners: 0,
    crmProgress: [],
    courseEnquiryRatio: [],
    followupUpdate: [],
  });
  const[show, setShow] = useState(true);

  const getDashboard = useCallback(
    async (code) => {
      const response = await getDashboardInfo(code);
      setDashboardInfo(response);
      setLoad(false);
    },
    [getDashboardInfo]
  );

  const getTransactionData = useCallback(
    async () => {
      const response = await getTransactionDashbord();
      setGetTransaction(response);
      setLoad(false);

    },
    [getTransactionDashbord]
  );

  const getWeeklyTransaction = useCallback(
    async () => {
      const response = await getTransactionDataWeek();
      setWeeklyData(response);
      setLoad(false);
      setTransactionHangling(true);
    },
    [getTransactionDataWeek]
  );


  useEffect(() => {
    if (load) {
      getDashboard();
      getTransactionData();
      getWeeklyTransaction()
    }
    const interval = setInterval(() => { getDashboard(); getTransactionData(); getWeeklyTransaction() }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, [load, getDashboard, getTransactionData, getWeeklyTransaction]);

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 5000);
  })



  return (
    <Container maxWidth="xxl">
      <Typography
        variant="h4"
        sx={{
          marginBottom: 3,
          opacity: show ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          height: show ? 'auto' : 0,
          overflow: 'hidden', 
        }}
      >
        Hi, Welcome back 👋 {auth.user !== null ? auth.user.userName : ''}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}
          sx={{
            cursor: 'pointer',
            '&:hover #card': {
              transition: 'background-color 0.3s ease-in-out',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            },
            '& #iconimg': {
              transition: 'transform 0.6s ease-in-out',
            },
            '&:hover #iconimg': {
              transform: 'scale(1.2)',
            },
            '&:hover .app-widget-title': {
              color: '#1877F2',
              fontWeight: 'bold'
            }
          }}
        >
          <AppWidgetSummary id="card"
            title={<span className="app-widget-title">Enquiries</span>}
            onClick={() => { router.push(`enquiries`) }}
            total={dashboardInfo.todayEnqiryies}
            color="success"
            icon={<img alt="iconimg" id="iconimg" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}
          sx={{
            cursor: 'pointer',
            '&:hover #card': {
              transition: 'background-color 0.3s ease-in-out',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
            },
            '& #iconimg': {
              transition: 'transform 0.6s ease-in-out',
            },
            '&:hover #iconimg': {
              transform: 'scale(1.2)',
            },
            '&:hover .app-widget-title': {
              color: '#1877F2',
              fontWeight: 'bold'
            }
          }}>
          <AppWidgetSummary id='card'
            title={<span className="app-widget-title">Followups</span>}
            onClick={() => { router.push(`followups`) }}
            total={dashboardInfo.todayFollowups}
            color="info"
            icon={<img alt="icon" id="iconimg" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}
          sx={{
            cursor: 'pointer',
            '&:hover #card': {
              transition: 'background-color 0.3s ease-in-out',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
            },
            '& #iconimg': {
              transition: 'transform 0.6s ease-in-out',
            },
            '&:hover #iconimg': {
              transform: 'scale(1.2)',
            },
            '&:hover .app-widget-title': {
              color: '#1877F2',
              fontWeight: 'bold'
            }
          }}>
          <AppWidgetSummary id='card'
            title={<span className="app-widget-title">Customers</span>}
            onClick={() => { router.push(`crm`) }}
            total={dashboardInfo.totalCustomers}
            color="warning"
            icon={<img alt="icon" id="iconimg" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}
          sx={{
            cursor: 'pointer',
            '&:hover #card': {
              transition: 'background-color 0.3s ease-in-out',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
            },
            '& #iconimg': {
              transition: 'transform 0.6s ease-in-out',
            },
            '&:hover #iconimg': {
              transform: 'scale(1.2)',
            },
            '&:hover .app-widget-title': {
              color: '#1877F2',
              fontWeight: 'bold'
            }
          }}>
          <AppWidgetSummary id="card"
            title={<span className="app-widget-title">Joined</span>}
            onClick={() => { router.push(`crm`) }}
            total={dashboardInfo.totalJoinners}
            color="secondary"
            icon={<img alt="icon" id="iconimg" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        {auth.user.roleCode === 'ADMIN' ?

          <><Grid item xs={12} md={6} lg={4} >
            <Card sx={{ maxHeight: '400px', boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', p: 1 }}>
              <CardHeader title='Overall Transaction Report' subheader='over all report' />

              <Grid item xs={12} md={12} lg={12} p={1} >
                <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
                  <IconButton >
                    <Iconify sx={{ color: 'orange' }} icon="mdi:hours-24" width={25} />
                  </IconButton>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, padding: 0, fontSize: 13 }}>Today Data</p>
                    <h4 style={{ margin: 0, padding: 0 }} >{getTransaction.today !== undefined ? getTransaction.today : 0}</h4>
                  </div>
                </Card>
              </Grid>
              <Grid item xs={12} md={12} lg={12} p={1}>
                <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
                  <IconButton  >
                    <Iconify sx={{ color: 'orange' }} icon="heroicons:calendar-days-16-solid" width={25} />
                  </IconButton>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, padding: 0, fontSize: 13 }}>Weekly Data</p>
                    <h4 style={{ margin: 0, padding: 0 }} >{getTransaction.week !== undefined ? getTransaction.week : 0}</h4>
                  </div>
                </Card>
              </Grid>
              <Grid item xs={12} md={12} lg={12} p={1}>
                <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
                  <IconButton  >
                    <Iconify sx={{ color: 'orange' }} icon="quill:snooze-month" width={25} />
                  </IconButton>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, padding: 0, fontSize: 13 }}>Monthly Data</p>
                    <h4 style={{ margin: 0, padding: 0 }} >{getTransaction.month !== undefined ? getTransaction.month : 0}</h4>
                  </div>
                </Card>
              </Grid>
              <Grid item xs={12} md={12} lg={12} p={1}>
                <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
                  <IconButton  >
                    <Iconify sx={{ color: 'orange' }} icon="streamline:subscription-cashflow-solid" width={25} />
                  </IconButton>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, padding: 0, fontSize: 13 }}>Yearly Date</p>
                    <h4 style={{ margin: 0, padding: 0 }} >{getTransaction.year !== undefined ? getTransaction.year : 0}</h4>
                  </div>
                </Card>
              </Grid>
            </Card>
          </Grid>

            <Grid item xs={12} md={6} lg={8} >

              <BasicBars
                show={transactionHandling}
                date={weeklyData.listDates} amount={weeklyData.data}
              />
            </Grid> </> : null}


        <Grid item xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="CRM Progress"
            chart={{
              series: dashboardInfo.crmProgress,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AppConversionRates
            sx={{ minHeight: 490 }}
            title="Course Enquiry Ratio"
            subheader="Over all course enqiry ratio"
            chart={{
              series: dashboardInfo.courseEnquiryRatio,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <AppNewsUpdate sx={{ minHeight: 490, position: 'relative',marginBottom:"20px" }}
            title="Followup Updates"
            list={dashboardInfo.followupUpdate.map((followUp, index) => ({
              id: followUp.id,
              title: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Link to={`/users/info/${followUp.uid}`} style={{ color: 'rgb(24, 119, 242)' }}>
                    {followUp.assigneeName}
                  </Link>
                  <Iconify icon="mdi:arrow-right-thin" sx={{ mx: 0.5 }} />
                  <Link to={`/crm/customer/${followUp.cid}`} style={{ color: 'rgb(255, 171, 0)' }}>
                    {followUp.customerName}
                  </Link>
                </div>
              ),
              description: followUp.fcontent,
              image: followUp.profile === null || followUp.profile === undefined || followUp.profile === "" ? '/assets/icons/glass/ic_glass_bag.png' : followUp.profile,
            }))}

          >
            {dashboardInfo.followupUpdate.map((followUp) => (
              <Avatar
                key={followUp.id} alt="profile image"
                src={followUp.profile}>
                {!followUp.profile && followUp.assigneeName.charAt(0).toUpperCase()}
              </Avatar>
            ))}
          </AppNewsUpdate>
        </Grid>
      </Grid>
    </Container>
  );
}
