import { Grid ,Typography,Container} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import AppWidgetSummary from '../../../sections/master/app-widget-summary';

export default function AdminController() {
  const router = useRouter();

  const handleClick = (path) => {
    router.push('/assignee_change');
  };
  return (
    <Container maxWidth="xxl">
      <Typography variant="h4" sx={{ mb: 0, color: '#f79520' }}>
      Admin Controller
      </Typography>
      <Grid container spacing={2} mt={1} >
      <Grid item xs={12} sm={6} md={3}>
        <AppWidgetSummary
          title="Assignee Change"
          color="success"
          pageClick={() => {
            handleClick('assignee');
          }}
          sx={{ width: '300px', }}
          icon={<img alt="icon" src="/assets/icons/glass/ic_department.png" />}
        />
      </Grid>
      </Grid>
    </Container>
  );
}
