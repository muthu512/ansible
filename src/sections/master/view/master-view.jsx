import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import { useRouter } from 'src/routes/hooks'
import AppWidgetSummary from '../app-widget-summary';

export default function MasterView() {

    const router = useRouter();

    const handleClick = (path) => {
        if (path === "role") {
            router.push("/master/role")
        } else if (path === "dept") {
            router.push("/master/department")
        } else if (path === "design") {
            router.push("/master/designation")
        } else if (path === "status") {
            router.push("/master/status")
        } else if (path === "leads") {
            router.push("/master/leads")
        } else if (path === "courseType") {
            router.push("/master/course-type")
        } else if (path === "courses") {
            router.push("/master/courses")
        } else if (path === "fresher-or-exprience") {
            router.push("/master/fresher-or-exprience")
        } else if (path === 'batches') {
            router.push("/master/batches")
        }else if(path==='syllabus'){
            router.push('/master/syllabus')
        }
        else {
            router.push("/master")
        }
    }
    return (
        <Container maxWidth="xxl">
            <Typography variant="h4" sx={{ mb: 0, color: "#f79520" }}>
                Masters
            </Typography>
            <Typography variant='subtitle2' sx={{ mb: 2 }}>
                Master is in charge of all this applications default items creates and manages
            </Typography>
            <Grid container spacing={2} mt={1} >
                <Grid item xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="User Roles"
                        color="success"
                        pageClick={() => { handleClick('role') }}
                        icon={<img alt="icon" src="/assets/icons/glass/ic_roles.png" />}
                    />
                </Grid>
                <Grid item  xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Department"
                        color="success"
                        pageClick={() => { handleClick('dept') }}
                        icon={<img alt="icon" src="/assets/icons/glass/ic_department.png" />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Designation"
                        color="success"
                        pageClick={() => { handleClick('design') }}
                        icon={<img alt="icon" src="/assets/icons/glass/ic_designation.png" />}
                    />
                </Grid>
            </Grid>
            <Grid item xs={12} md={12} mt={1} mb={1}>
                <Divider variant="fullWidth" component="animate">CRM</Divider>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Status"
                        color="success"
                        pageClick={() => { handleClick('status') }}
                        icon={<img alt="icon" src="/assets/icons/glass/ic_status.png" />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Leads"
                        color="success"
                        pageClick={() => { handleClick('leads') }}
                        icon={<img alt="icon" src="/assets/icons/glass/ic_leads.png" />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Fresher/Exp"
                        color="success"
                        pageClick={() => { handleClick('fresher-or-exprience') }}
                        icon={<img alt="icon" src="/assets/icons/glass/ic_person.png" />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Course Type"
                        color="success"
                        pageClick={() => { handleClick('courseType') }}
                        icon={<img alt="icon" src="/assets/icons/glass/ic_type.png" />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Courses"
                        color="success"
                        pageClick={() => { handleClick('courses') }}
                        icon={<img alt="icon" src="/assets/icons/glass/ic_course.png" />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Batches"
                        color="success"
                        pageClick={() => { handleClick('batches') }}
                        icon={<img alt="icon" src="/assets/icons/glass/ic_batch.png" />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Syllabus"
                        color="info"
                        pageClick={() => { handleClick('syllabus') }}
                        icon={<img alt="icon" src="/assets/icons/glass/sylllabus.png" />}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}
