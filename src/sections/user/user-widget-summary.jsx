import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


// ----------------------------------------------------------------------

export default function UserWidgetSummary({ title,  icon, color = 'primary', sx,pageClick, ...other }) {
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
        ...sx,
        cursor:'pointer'
      }}
      {...other}
    >
      {icon && <Box sx={{ width: 25, height: 25 }}>{icon}</Box>}

      <Stack spacing={0.3}>
        <Typography variant="subtitle1">{title}</Typography>
      </Stack>
    </Card>
  );
}

UserWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  pageClick:PropTypes.any
};
