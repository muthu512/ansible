import * as React from 'react';
import PropTypes from 'prop-types';
import { BarChart } from '@mui/x-charts/BarChart';
import { Card,CardHeader } from '@mui/material';


export default function BasicBars({date, amount, show}) {
  return (
    <Card sx={{textAlign:'center'}}>
        <CardHeader title='Weekly Transaction' subheader='Report' />
  
    <BarChart
    xAxis={[{ scaleType: 'band', data:show ? date : [],  tick: {
      angle: 30, // Rotate labels by -45 degrees
      textAnchor: 'end', // Adjust text alignment
    },} ]} 

      series={[{ data:show ? amount :[]}]}
      height={320}
      barLabel="value"
      sx={{ml:"2%",p:"2%", width:"150%"}}

    />
    </Card>
  );
}
BasicBars.propTypes = {
  date : PropTypes.any,
  amount : PropTypes.any,
  show : PropTypes.any,
}

// import * as React from 'react';
// import { BarChart } from '@mui/x-charts/BarChart';

// const BasicBars = () => 
//    (
//     <BarChart
//       xAxis={[
//         {
//           scaleType: 'band',
//           data: ['group A', 'group 2', 'group 3'],
//           tick: {
//             angle: -45, // Set angle for rotation
//             textAnchor: 'end', // Align text
//           },
//         },
//       ]}
//       series={[{ data: [4, 3, 5] }]}
//       height={300}
//       barLabel="value"
//     />
//   );
// ;

// export default BasicBars;
 