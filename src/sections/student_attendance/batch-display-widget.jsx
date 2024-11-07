import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularWithValueLabel from '../../components/circle-progress/progress';
// ----------------------------------------------------------------------

export default function AppWidgetSummary({
  title,
  scheduleTime,
  icon,
  color = 'primary',
  sx,
  pageClick,
  progress,
  propClass,
  ...other
}) {
  return (
    <Card
      onClick={pageClick}
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 3,
        py: 2,
        justifyContent: 'start',
        alignItems: 'center',
        borderRadius: 2,
        ...sx,
        cursor: 'pointer',
       
      }}
      {...other}
    >
      {icon && <Box sx={{ alignItems: 'center', width: 30, height: 30 }}>{icon}</Box>}

      <Stack spacing={0.3}>
        <Typography
          sx={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            width: {md:'110px', xs:'200px'},
            whiteSpace: 'nowrap',
            fontSize:'12px'
          }}
          variant="subtitle1"
        >
          {title}
        </Typography>
        <Typography variant="body2" sx={{fontSize:'10px'}}>{scheduleTime}</Typography>
      </Stack>
      <CircularWithValueLabel className={propClass} progress={progress}/>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  pageClick: PropTypes.any,
  scheduleTime: PropTypes.string,
  progress: PropTypes.any,
  propClass: PropTypes.any,
};
