import { Box, Typography, Stack, Tooltip, Avatar, useMediaQuery, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import Label from '../label';
import GradientProgress from '../progress/gradientProgress';
import Iconify from '../iconify';

const ListView = ({ data, onRowClick, page, secondRow, deletedata, editdata }) => {
  const smallScreen = useMediaQuery('(max-width: 450px)');
  return data === undefined ? (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 100,
      }}
    >
      <GradientProgress />
    </div>
  ) : (
    <Box sx={{ padding: 1 }}>
      {page === 'followup'
        ? data.map((item, index) => (
          <Box key={index} sx={{ borderBottom: '1px solid rgba(200,200,200,0.5)', padding: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Tooltip title="View Details">
                <Avatar
                  sx={{ width: 50, height: 50 }}
                  key={item.id}
                  alt="profile image"
                  src={item.profile}
                >
                  {!item.profile && item.assigneeName.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontSize: '14px' }}>
                      <Label
                        onClick={() => onRowClick(item.uid)}
                        color="primary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.assigneeName}
                      </Label>
                    </Typography>
                    <Iconify icon="mdi:arrow-right-thin" sx={{ mx: 1 }} />
                    <Typography sx={{ fontSize: '14px' }}>
                      <Label
                        onClick={() => onRowClick(item.cid)}
                        color="secondary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.customerName}
                      </Label>
                    </Typography>
                  </div>
                  <Typography
                    mt={0.5}
                    variant="body2"
                    sx={{
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      width: '180px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.fcontent}
                  </Typography>
                </div>
                <Typography
                  variant="body2"
                  sx={{
                    ml: 1,
                    alignSelf: 'flex-end',
                    fontSize: '10px',
                    width: '120px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.fdate}
                </Typography>
              </div>
            </Stack>
          </Box>
        ))
        : null}

      {page === 'enquiries'
        ? data.map((item, index) => (
          <Box key={index} sx={{ borderBottom: '1px solid rgba(200,200,200,0.5)', padding: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Tooltip title="View Details">
                <Avatar
                  sx={{ width: 50, height: 50 }}
                  key={item.id}
                  alt="profile image"
                  src={item.profile}
                >
                  {!item.profile && item.name.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography variant="body1" sx={{ fontSize: '14px' }}>
                      <Label
                        onClick={() => onRowClick(item.uid)}
                        color="primary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.assigneeName}
                      </Label>
                    </Typography>
                    <Iconify icon="mdi:arrow-right-thin" />

                    <Typography sx={{ fontSize: '14px' }}>
                      <Label
                        color="secondary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.name}
                      </Label>
                    </Typography>
                  </div>
                  <Typography mt={0.5} variant="body2" sx={{ fontSize: '12px' }}>
                    {item.mobileNumber}
                  </Typography>
                </div>
                {!smallScreen ? (
                  <Typography
                    variant="body2"
                    sx={{
                      alignSelf: 'flex-end',
                    }}
                  >
                    <Label>{item.location}</Label>
                  </Typography>
                ) : null}
              </div>
            </Stack>
          </Box>
        ))
        : null}

      {page === 'user'
        ? data.map((item, index) => (
          <Box key={index} sx={{ borderBottom: '1px solid rgba(200,200,200,0.5)', padding: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Tooltip title="View Details">
                <Avatar
                  sx={{ width: 50, height: 50 }}
                  key={item.id}
                  alt="profile image"
                  src={item.profile}
                >
                  {!item.profile && item.userName.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography variant="body1" sx={{ fontSize: '14px' }}>
                      <Label
                        onClick={() => onRowClick(item.uid)}
                        color="primary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.userName}
                      </Label>
                    </Typography>

                    {!smallScreen ? (
                      <Typography sx={{ fontSize: '14px' }}>
                        <Label
                          color="secondary"
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {item.deptName}
                        </Label>
                      </Typography>
                    ) : null}
                  </div>
                  <Typography mt={0.5} variant="body2" sx={{ fontSize: '12px' }}>
                    {item.mobileNumber}
                  </Typography>
                </div>
                <Typography
                  variant="body2"
                  sx={{
                    alignSelf: 'flex-end',
                  }}
                >
                  <Label color={item.active ? 'success' : 'error'}>
                    {item.active ? 'active' : 'Inactive'}
                  </Label>
                </Typography>
              </div>
            </Stack>
          </Box>
        ))
        : null}

      {data === undefined ? (
        <GradientProgress />
      ) : page === 'batchtable' ? (
        data.map((item, index) => (
          <Box key={index} sx={{ borderBottom: '1px solid rgba(200,200,200,0.5)', padding: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Tooltip title="View Details">
                <Avatar
                  sx={{ width: 50, height: 50 }}
                  key={item.id}
                  alt="profile image"
                  src={item.courseProfile}
                >
                  {!item.courseProfile && item.trainnerName.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography variant="body1" sx={{ fontSize: '14px' }}>
                      <Label
                        onClick={() => onRowClick(item.trainnerId)}
                        color="primary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.trainnerName}
                      </Label>
                    </Typography>
                    <Typography sx={{ fontSize: '14px' }}>
                      <Label
                        color="secondary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.courseName}
                      </Label>
                    </Typography>
                  </div>
                  <Typography mt={0.5} variant="body2" sx={{ fontSize: '12px' }}>
                    {item.title}
                  </Typography>
                </div>
                {!smallScreen ? (
                  <Typography
                    variant="body2"
                    sx={{
                      alignSelf: 'flex-end',
                    }}
                  >
                    <Label
                      color={
                        item.status === 'New'
                          ? 'info'
                          : item.status === 'Closed'
                            ? 'error'
                            : 'success'
                      }
                    >
                      {item.status}
                    </Label>
                  </Typography>
                ) : null}
              </div>
            </Stack>
          </Box>
        ))
      ) : null}

      {page === 'assigneeChange'
        ? data.map((item, index) => (
          <Box key={index} sx={{ borderBottom: '1px solid rgba(200,200,200,0.5)', padding: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography variant="body1" sx={{ fontSize: '14px' }}>
                      <Label
                        onClick={() => onRowClick(item.assigneeFrom)}
                        color="primary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.assigneeFromName}
                      </Label>
                    </Typography>
                    <Iconify icon="mdi:arrow-right-thin" sx={{ mx: 1 }} />

                    <Typography sx={{ fontSize: '14px' }}>
                      <Label
                        onClick={() => secondRow(item.assigneeTo)}
                        color="secondary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.assigneeToName}
                      </Label>
                    </Typography>
                  </div>

                </div>
                <Typography
                  variant="body2"
                  sx={{
                    alignSelf: 'flex-end',
                  }}
                >
                  <Label color={item.active ? 'success' : 'error'}>
                    {item.active ? 'active' : 'Inactive'}
                  </Label>
                </Typography>
              </div>
            </Stack>
          </Box>
        ))
        : null}

      {page === 'CRM report'
        ? data.map((item, index) => (
          <Box key={index} sx={{ borderBottom: '1px solid rgba(200,200,200,0.5)', padding: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography variant="body1" sx={{ fontSize: '14px' }}>
                      <Label
                        onClick={() => onRowClick(item.cid)}
                        color="primary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.name}
                      </Label>
                    </Typography>
                    {!smallScreen ? (
                      <Typography sx={{ fontSize: '14px' }}>
                        <Label
                          color="secondary"
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {item.courseName}
                        </Label>
                      </Typography>
                    ) : null}
                  </div>
                  <Typography mt={0.5} variant="body2" sx={{ fontSize: '12px' }}>
                    {item.mobileNumber}
                  </Typography>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                  {' '}
                  <Typography
                    variant="body2"
                    sx={{
                      alignSelf: 'flex-end',
                    }}
                  >
                    <Label>{item.assigneeName}</Label>
                  </Typography>{' '}
                  <Typography mt={0.5} variant="body2" sx={{ fontSize: '12px' }}>
                    {' '}
                    <Label color="secondary"> {item.statusCode} </Label>
                  </Typography>{' '}
                </div>
              </div>
            </Stack>
          </Box>
        ))
        : null}

      {page === 'CRM'
        ? data.map((item, index) => (
          <Box key={index} sx={{ borderBottom: '1px solid rgba(200,200,200,0.5)', padding: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography variant="body1" sx={{ fontSize: '14px' }}>
                      <Label
                        onClick={() => onRowClick(item.uid)}
                        color="primary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.name}
                      </Label>
                    </Typography>
                    {!smallScreen ? (
                      <Typography sx={{ fontSize: '14px' }}>
                        <Label
                          color="secondary"
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {item.courseName}
                        </Label>
                      </Typography>
                    ) : null}
                  </div>
                  <Typography mt={0.5} variant="body2" sx={{ fontSize: '12px' }}>
                    {item.mobileNumber}
                  </Typography>
                </div>

                <div>
                  {' '}
                  <Typography
                    variant="body2"
                    sx={{
                      alignSelf: 'flexend',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Label>{item.assigneeName}</Label>
                  </Typography>{' '}
                  <Typography
                    mt={0.5}
                    variant="body2"
                    sx={{
                      fontSize: '12px',
                      display: 'flex',
                      justifyContent: 'end',
                    }}
                  >
                    {' '}
                    <IconButton onClick={() => editdata(item)}>
                      <Iconify icon="ic:outline-edit-note" sx={{ color: 'blue' }} />
                    </IconButton>
                    <IconButton onClick={() => deletedata(item.cid)}>
                      <Iconify
                        icon="material-symbols:delete-outline-rounded"
                        sx={{ color: 'red' }}
                      />
                    </IconButton>
                  </Typography>{' '}
                </div>
              </div>
            </Stack>
          </Box>
        ))
        : null}

      {page === 'transaction'
        ? data.map((item, index) => (
          <Box key={index} sx={{ borderBottom: '1px solid rgba(200,200,200,0.5)', padding: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography variant="body1" sx={{ fontSize: '14px' }}>
                      <Label
                        onClick={() => onRowClick(item.uid)}
                        color="primary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.customerName}
                      </Label>
                    </Typography>
                    <Typography sx={{ fontSize: '14px' }}>
                    {item.paymentType === "" ?
                        <Label>no data</Label>
                        :
                        <Label
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.paymentType}
                      </Label> }
                    </Typography>
                  </div>
                  <Typography mt={0.5} variant="body2" sx={{ fontSize: '12px' }}>
                    {item.mobileNumber}
                  </Typography>
                </div>

                <div>
                  {' '}
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '12px',
                      display: 'flex',
                      justifyContent: 'end',
                    }}
                  >
                    <Label>{item.paymentStatus}</Label>
                  </Typography>{' '}
                  <Typography
                    mt={0.5}
                    variant="body2"
                    sx={{
                      fontSize: '12px',
                      display: 'flex',
                      justifyContent: 'end',
                    }}
                  >
                    {' '}
                    <Label color="secondary"> {item.amount} </Label>
                  </Typography>{' '}
                </div>
              </div>
            </Stack>
          </Box>
        ))
        : null}

      {page === 'Onboard'
        ? data.map((item, index) => (
          <Box key={index} sx={{ borderBottom: '1px solid rgba(200,200,200,0.5)', padding: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography variant="body1" sx={{ fontSize: '14px' }}>
                      <Label
                        onClick={() => onRowClick(item.uid)}
                        color="primary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.studentName}
                      </Label>
                    </Typography>
                    {!smallScreen ? (
                      <Typography sx={{ fontSize: '14px' }}>
                        <Label
                          color="secondary"
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {item.courseName}
                        </Label>
                      </Typography>
                    ) : null}
                  </div>
                  <Typography mt={0.5} variant="body2" sx={{ fontSize: '12px' }}>
                    <Label
                      sx={{
                        maxWidth: '150px',
                        height: '25px',
                        whiteSpace: 'nowrap',
                        lineHeight: '25px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'inline-block',
                      }}
                    >
                      {item.batchTitle}
                    </Label>
                  </Typography>
                </div>

                <div>
                  {' '}
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '12px',
                      display: 'flex',
                      justifyContent: 'end',
                    }}
                  >
                    <Label color="success">{item.trainnerName}</Label>
                  </Typography>{' '}
                  <Typography
                    mt={0.5}
                    variant="body2"
                    sx={{
                      fontSize: '12px',
                      display: 'flex',
                      justifyContent: 'end',
                    }}
                  >
                    {' '}
                    <Label color="secondary"> {item.scheduleTime} </Label>
                  </Typography>{' '}
                </div>
              </div>
            </Stack>
          </Box>
        ))
        : null}

      {page === 'remainder'
        ? data.map((item, index) => (
          <Box key={index} sx={{ borderBottom: '1px solid rgba(200,200,200,0.5)', padding: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography variant="body1" sx={{ fontSize: '14px' }}>
                      <Label
                        onClick={() => onRowClick(item.uid)}
                        color="primary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.customerName}
                      </Label>
                    </Typography>
                    {!smallScreen ? (
                      <Typography sx={{ fontSize: '14px' }}>
                        <Label
                          color="secondary"
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {item.status}
                        </Label>
                      </Typography>
                    ) : null}
                  </div>
                  <Typography mt={0.5} variant="body2" sx={{ fontSize: '12px' }}>
                    {item.mobileNumber}
                  </Typography>
                </div>

                <div>
                  {' '}
                  <Typography
                    variant="body2"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'end',
                    }}
                  >
                    <Label color="primary">{item.assignee}</Label>
                  </Typography>{' '}
                  <Typography mt={0.5} variant="body2" sx={{ fontSize: '12px' }}>
                    {' '}
                    <Label color="secondary"> {item.updateDate} </Label>
                  </Typography>{' '}
                </div>
              </div>
            </Stack>
          </Box>
        ))
        : null}

      {page === 'syllabus'
        ? data.map((item, index) => (
          <Box key={index} sx={{ borderBottom: '1px solid rgba(200,200,200,0.5)', padding: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography variant="body1" sx={{ fontSize: '14px' }}>
                      <Label
                        onClick={() => onRowClick(item.id)}
                        color="primary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.title}
                      </Label>
                    </Typography>
                    {!smallScreen ? (
                      <Typography sx={{
                        fontSize: '14px', 
                        maxWidth: '180px', 
                        height: '25px',
                        lineHeight: '25px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        bgcolor:'#ddd',
                        px:1,
                        borderRadius:'5px'
                      }}>
                        {item.description}
                      </Typography>
                    ) : null}
                  </div>
                  <Typography mt={0.5} variant="body2" sx={{ fontSize: '12px' }}>
                    <Label
                      color="secondary"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {item.courseName}
                    </Label>
                  </Typography>
                </div>
                <div>
                  {' '}
                  <Typography
                    variant="body2"
                    sx={{
                      alignSelf: 'flex-end',
                    }}
                  />

                  <Typography mt={0.5} variant="body2" sx={{ fontSize: '12px' }}>
                    {' '}
                    <Label color="secondary"> {item.status} </Label>
                  </Typography>{' '}

                  <Typography
                    mt={0.5}
                    variant="body2"
                    sx={{
                      fontSize: '12px',
                      display: 'flex',
                      justifyContent: 'end',
                    }}
                  >
                    {' '}
                    <IconButton onClick={() => editdata(item)}>
                      <Iconify icon="ic:outline-edit-note" sx={{ color: 'blue' }} />
                    </IconButton>
                  </Typography>{' '}

                </div>
              </div>
            </Stack>
          </Box>
        ))
        : null}
      {page === 'student report'
        ? data.map((item, index) => (
          <Box key={index} sx={{ borderBottom: '1px solid rgba(200,200,200,0.5)', padding: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography variant="body1" sx={{ fontSize: '14px' }}>
                      <Label
                        onClick={() => onRowClick(item.cid)}
                        color="primary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {item.studentName}
                      </Label>
                    </Typography>
                    {!smallScreen ? (
                      <Typography sx={{ fontSize: '14px' }}>
                        {item.billNumber > 0 ?
                          <Label
                            color="secondary"
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            {item.billNumber}
                          </Label> : <Label>No data</Label>}
                      </Typography>
                    ) : null}
                  </div>
                  <Typography mt={0.5} variant="body2" sx={{ fontSize: '12px' }}>
                    {item.mobileNumber}
                  </Typography>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                  {' '}
                  <Typography
                    variant="body2"
                    sx={{
                      alignSelf: 'flex-end',
                    }}
                  >
                    <Label color="success">{item.totalPresent}</Label>
                  </Typography>{' '}
                  <Typography mt={0.5} variant="body2" sx={{ fontSize: '12px' }}>
                    {' '}
                    <Label color="error"> {item.totalAbsent} </Label>
                  </Typography>{' '}
                </div>
              </div>
            </Stack>
          </Box>
        ))
        : null}
    </Box>
  );
};

ListView.propTypes = {
  data: PropTypes.any,
  onRowClick: PropTypes.any,
  secondRow: PropTypes.any,
  page: PropTypes.any,
  deletedata: PropTypes.any,
  editdata: PropTypes.any,
};
export default ListView;

