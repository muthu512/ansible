import React, { useCallback, useEffect, useState } from 'react';
import './over-all-attendance-style.css';
import {
  Typography,
  Tooltip,
  Stack,
  IconButton,
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useRouter } from 'src/routes/hooks';
import Iconify from 'src/components/iconify';
import { useParams } from 'react-router-dom';
import useApiService from 'src/services/api_services';
import GradientProgress from 'src/components/progress/gradientProgress';
import Label from 'src/components/label';

export default function OverAllAttendance() {
  const [batchAttendance, setBatchAttendance] = useState({
    dateInfo: [],
    stuAtt: [],
  });

  const router = useRouter();
  const { id } = useParams();
  const { getBatchAttendanceOverallReport } = useApiService();
  const [progress, setProgress] = useState(true);
  const [load, setLoad] = useState(true);

  const getOveralleport = useCallback(
    async (batchId) => {
      const response = await getBatchAttendanceOverallReport(batchId);
      setBatchAttendance(response);
      setProgress(false);
    },
    [getBatchAttendanceOverallReport]
  );

  useEffect(() => {
    if (load) {
      getOveralleport(id);
      setLoad(false);
    }
  }, [getOveralleport, id, load]);

  return progress ? (
    <GradientProgress />
  ) : (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0px',
          height: '33px',
          margin: '0px 5px',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          maxWidth="200px"
          margin={1}
          onClick={() => {
            router.back();
          }}
          sx={{
            color: '#f79520',
            '&:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
          }}
        >
          <KeyboardArrowLeftIcon />
          <Tooltip title="back">
            <Typography variant="h6">OverAll Attendance</Typography>
          </Tooltip>
        </Stack>

        <Tooltip title="Print" placement='left'>
          <IconButton onClick={() => window.print()} sx={{marginRight:'20px'}}>
        <Iconify   style={{height:'32px',width:'32px', cursor:'pointer',}} icon="flat-color-icons:print"/>
        </IconButton>
        </Tooltip>
      </div>
      <div className="header trainerName" style={{ padding: '5px' }}>
        <div>

          <h5 style={{color: 'grey'}}>Batch Name : <Label sx={{fontSize:'0.5rem'}} color="secondary">{`${batchAttendance.batchName}`}</Label></h5>
        </div>
        <div >
          <h5 style={{color: 'grey'}}>Trainer Name : <Label sx={{fontSize:'0.5rem'}} color='success'>{`${batchAttendance.trainnerName}`}</Label></h5>
        </div>
        <div className="totalCount">
          <h5 style={{color: 'grey'}}>Total Number of student : <Label sx={{fontSize:'0.5rem'}} color='primary'>{`${batchAttendance.stuAtt.length}`}</Label></h5>
        </div>
      </div>

      {progress ? (
        <GradientProgress />
      ) : (
        <div className="attendance-table">
          <table className="table">
            <thead className="thead">
              <tr className="tr"> 
                <th className="th sticky1">S.NO</th>
               <th className="th name sticky">Student Name</th> 
               <th className="th course courseSticky">Course Name</th>
                {batchAttendance.dateInfo.map((att) => (
                  <th key={att} className="th month">
                    {att}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tbody">
              {batchAttendance.stuAtt.map((student, i) => (
                <tr key={i} className="tr tableRow">
                  {(i + 1) % 2 === 0 ? (
                    <td className="td index sticky1 even">{i + 1}</td>
                  ) : (
                    <td className="td index sticky1 odd">{i + 1}</td>
                  )}
                  {(i + 1) % 2 === 0 ? (
                    <td className="td name sticky even">{student.studentName}</td>
                    
                  ) : (
                    <td className="td name sticky odd">{student.studentName}</td>
                  )}
                  {(i + 1) % 2 === 0 ? (

                    <td className="td course courseSticky even">{student.courseName}</td>
                    
                  ) : (
                    <td className="td course courseSticky odd">{student.courseName}</td>
                  )}
                  
                  {batchAttendance.dateInfo.map((att) => (
                    <td className="td" key={att}>
                      {student.attRepost[att] === true ? (
                        <Iconify
                          style={{ color: 'green' }}
                          icon="hugeicons:tick-02"
                          width="1rem"
                          height="1rem"
                        />
                      ) : (
                        <Iconify
                          style={{ color: 'red' }}
                          icon="system-uicons:cross"
                          width="1rem"
                          height="1rem"
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
