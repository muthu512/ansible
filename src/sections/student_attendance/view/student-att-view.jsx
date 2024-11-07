import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useRouter } from 'src/routes/hooks';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useApiService from 'src/services/api_services';
import AppWidgetSummary from '../batch-display-widget';


export default function StudentAttendance() {
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const { getBatchesByTrainner } = useApiService();
  const [trainnerBatch, setTrainnerBatch] = useState([]);
  const [load, setLoad] = useState([]);
  const getBatches = useCallback(async () => {
    const response = await getBatchesByTrainner(auth.user.uid);
    setTrainnerBatch(response);
    setLoad(false);
  }, [getBatchesByTrainner, auth]);

  useEffect(() => {
    if (load) {
      getBatches();
    }
  }, [load, getBatches]);


  return (
      <Container maxWidth="xxl">
        <Typography variant="h6" sx={{ mb: 0, color: '#f79520' }}>
          Student Batches
        </Typography>
        <Grid container spacing={2} mt={1} >
          <Grid item xs={12} md={12} mt={1} mb={1}>
            <Divider variant="fullWidth" sx={{color:'#f79520'}} >
              Upcomming
            </Divider>
          </Grid>
          {trainnerBatch.map((batch) => (
            batch.status === 'New' ?
              <Grid item xs={12} sm={6} md={3}
                sx={{
                  '&:hover #card': {
                    transition: 'background-color 0.3s ease-in-out',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                  },

                  '& #iconimg': {
                    transition: 'transform 0.6s ease-in-out',
                  },
                  '&:hover #iconimg': {
                    transform: 'scale(1.2)',
                  },
                  '&:hover .app-widget-title': {
                    fontWeight: 'bold'
                  },
                }
                } >
                <AppWidgetSummary id='card'
                  progress={batch.progress}
                  title={<span className="app-widget-title">{batch.title}</span>}
                  scheduleTime={<span className="app-widget-title1">{batch.scheduleTime}</span>}
                  color="success"
                  onClick={() => {
                    router.push(`${batch.id}`);
                  }}
                  icon={
                    batch.courseProfile ? (
                      <img alt="icon" src={batch.courseProfile} />
                    ) : (
                      <img alt="icon" id="iconimg" src="/assets/icons/glass/code.png" />
                    )
                  }
                />
              </Grid> :
              null
          ))}
          <Grid item xs={12} md={12} mt={1} mb={1}>
            <Divider variant="fullWidth" component="animate" sx={{color:'blue'}}>
              OnGoing
            </Divider>
          </Grid>
          {trainnerBatch.map((batch) => (
            batch.status === 'Active' ?
              <Grid item xs={12} sm={6} md={3}
                sx={{
                  '&:hover #card': {
                    transition: 'background-color 0.3s ease-in-out',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                  },

                  '& #iconimg': {
                    transition: 'transform 0.6s ease-in-out',
                  },
                  '&:hover #iconimg': {
                    transform: 'scale(1.2)',
                  },
                  '&:hover .app-widget-title': {
                    fontWeight: 'bold'
                  },
                }
                } >
                <AppWidgetSummary id='card'
                  progress={batch.progress}
                  title={<span className="app-widget-title">{batch.title}</span>}
                  scheduleTime={<span className="app-widget-title1">{batch.scheduleTime}</span>}
                  color="success"
                  onClick={() => {
                    router.push(`${batch.id}`);
                  }}
                  icon={
                    batch.courseProfile ? (
                      <img alt="icon" src={batch.courseProfile} />
                    ) : (
                      <img alt="icon" id="iconimg" src="/assets/icons/glass/code.png" />
                    )
                  }
                />
              </Grid> :
              null
          ))}
          <Grid item xs={12} md={12} mt={1} mb={1}>
            <Divider
              sx={{color:'green'}}
              variant="fullWidth"
              component="div"  // Change to your desired color
            >
              Completed
            </Divider>

          </Grid>
          {trainnerBatch.filter(s => s.status === "Closed").length === 0 ? <h4 style={{ textAlign: 'center', width: '100%' }}>No Completed Batches</h4> : trainnerBatch.map((batch) => (
            batch.status === 'Closed' ?
              <Grid item xs={12} sm={6} md={3}
                sx={{
                  marginBottom:"20px",
                  '&:hover #card': {
                    transition: 'background-color 0.3s ease-in-out',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                  },

                  '& #iconimg': {
                    transition: 'transform 0.6s ease-in-out',
                  },
                  '&:hover #iconimg': {
                    transform: 'scale(1.2)',
                  },
                  '&:hover .app-widget-title': {
                    fontWeight: 'bold'
                  },
                }
                } >
                <AppWidgetSummary id='card'
                  progress={batch.progress}
                  title={<span className="app-widget-title">{batch.title}</span>}
                  scheduleTime={<span className="app-widget-title1">{batch.scheduleTime}</span>}
                  color="success"
                  onClick={() => {
                    router.push(`${batch.id}`);
                  }}
                  icon={
                    batch.courseProfile ? (
                      <img alt="icon" src={batch.courseProfile} />
                    ) : (
                      <img alt="icon" id="iconimg" src="/assets/icons/glass/code.png" />
                    )
                  }
                />
              </Grid> : null
          ))}
        </Grid>
      </Container>
  );
}
