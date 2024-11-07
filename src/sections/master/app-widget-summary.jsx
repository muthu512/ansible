import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Tooltip, } from '@mui/material';
import Typography from '@mui/material/Typography';


// ----------------------------------------------------------------------

export default function AppWidgetSummary({ title, icon, scheduleTime, deleteIcon, color = 'primary', sx, pageClick, ...other }) {
  return (
    <Card
      onClick={pageClick}
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 3,
        py: 2,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: { xs: 'left', md: 'space-between' },
        ...sx,
        cursor: 'pointer'
      }}
      {...other}
    >
      {icon && <Box sx={{ width: 35, height: 35 }}>{icon}</Box>}
      <Stack spacing={0.3}>

        <Typography sx={{
          textOverflow: 'ellipsis', overflow: 'hidden', width: '150px',
          whiteSpace: 'nowrap'
        }} variant="subtitle1">{title}</Typography>
        <Typography variant="body2">{scheduleTime}</Typography>
      </Stack>
      <Tooltip title="Delete">{deleteIcon && <Box sx={{ width: 35, height: 35 }}>{deleteIcon}</Box>}</Tooltip>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  scheduleTime: PropTypes.string,
  pageClick: PropTypes.any,
  deleteIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};
