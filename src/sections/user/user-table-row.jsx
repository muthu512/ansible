// import { useState } from 'react';
import PropTypes from 'prop-types';

// import Stack from '@mui/material/Stack';
// import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
// import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
// import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { Avatar, Tooltip } from '@mui/material';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  name,
  code,
  description,
  status,
  sno,
  email,
  designName,
  roleName,
  page,
  key,
  profile,
  uid,
  cid,
  order,
  url,
  deptName,
  duration,
  fees,
  userName,
  courseType,
  handleEdit,
  handleClick,
}) {
  // const [open, setOpen] = useState(null);
  const router = useRouter();

  // const handleOpenMenu = (event) => {
  //   setOpen(event.currentTarget);
  // };

  // const handleCloseMenu = () => {
  //   setOpen(null);
  //   handleEdit();
  // };

  const openUserView = (id) => {
    router.push(`/users/info/${id}`);
  };

  const openCustomerView = (id) => {
    router.push(`/crm/customer/${id}`);
  };

  const linkClick = (link) => {
    window.open(link, '_blank');
  };

  return (
    <>
      {page === 'users' ? (
        <TableRow key={key}>
          <TableCell size="small">{sno}</TableCell>
          <TableCell size="small" align="center">
            <Avatar
              onClick={() => {
                openUserView(uid);
              }}
              src={profile}
              alt="Uploaded Profile"
              sx={{
                width: 35,
                height: 35,
                bgcolor: 'lightgrey',
                border: '1px solid #f79520',
                cursor: 'pointer',
              }}
            />
          </TableCell>
          <TableCell
            size="small"
            onClick={() => {
              openUserView(uid);
            }}
          >
            <Tooltip title="User profile">
              <Label
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: 'blue' },
                }}
              >
                {userName}
              </Label>
            </Tooltip>
          </TableCell>
          <TableCell size="small">{email}</TableCell>
          <TableCell size="small">{deptName}</TableCell>
          <TableCell size="small">{designName}</TableCell>
          <TableCell size="small">{roleName}</TableCell>
          <TableCell align="center" size="small">
            <Label color={status ? 'success' : 'error'}>{status ? 'Active' : 'Inactive'}</Label>
          </TableCell>
          <TableCell align="right" size="small">
            <IconButton color="primary" sx={{ backgroundColor: 'whitesmoke' }}>
              <Tooltip title="Edit">
                <Iconify
                  onClick={() => {
                    handleEdit();
                  }}
                  icon="ic:outline-edit-note"
                />
              </Tooltip>
            </IconButton>
            {/* <IconButton onClick={()=>{openUserView(uid)}}>
              <Iconify icon="material-symbols:table-eye" />
          </IconButton> */}
          </TableCell>
        </TableRow>
      ) : (
        <TableRow key={key}>
          {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell> */}

          <TableCell size="small">{sno}</TableCell>

          {page === 'remainder' ? (
            <TableCell size="small">
              {' '}
              <Label
                onClick={() => {
                  openCustomerView(cid);
                }}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: 'blue' },
                }}
              >
                {name}
              </Label>{' '}
            </TableCell>
          ) : (
            <TableCell size="small">{name}</TableCell>
          )}

          {page === 'remainder' ? (
            <TableCell size="small">
              {' '}
              <Label
                onClick={() => {
                  openUserView(uid);
                }}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: 'blue' },
                }}
              >
                {userName}
              </Label>
            </TableCell>
          ) : null}

          {page === 'courses' ? <TableCell size="small">{courseType}</TableCell> : null}
          {page === 'courses' ? <TableCell size="small">{duration}</TableCell> : null}
          {page === 'courses' ? (
            <TableCell size="small">
              <Label color="secondary">₹{fees}</Label>
            </TableCell>
          ) : null}

          {page === 'designation' ? <TableCell size="small">{deptName}</TableCell> : null}
          {page === 'status' ? (
            <TableCell size="small" align="left">
              {order}
            </TableCell>
          ) : null}

<TableCell size="small">
            <Label color="info">{code}</Label>
          </TableCell>
          
          {page === 'lead' ? (
            <TableCell
              sx={{maxWidth:'150px',overflow:'hidden',}}
              align="left"
              onClick={() => {
                linkClick(url);
              }}
              style={{
                cursor: 'pointer',
                color: 'blue',
              }}
            >
             <Tooltip title={name} >{url}</Tooltip> 
            </TableCell>
          ) : null}

        

          <TableCell size="small">{description}</TableCell>
          {page === 'remainder' ? (
            <TableCell align="center" size="small">
              <Label color={status === 'Completed' ? 'success' : 'warning'}>{status ?? ''}</Label>
            </TableCell>
          ) : (
            <TableCell align="center" size="small">
              <Label color={status ? 'success' : 'error'}>{status ? 'Active' : 'Inactive'}</Label>
            </TableCell>
          )}

          <TableCell align="center" size="small">
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                sx={{ backgroundColor: 'whitesmoke' }}
                onClick={() => {
                  handleEdit();
                }}
              >
                <Iconify icon="ic:outline-edit-note" />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      )}
      {/* <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      > */}

      {/* <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem> */}

      {/* <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem> */}
      {/* </Popover> */}
    </>
  );
}

UserTableRow.propTypes = {
  description: PropTypes.any,
  handleClick: PropTypes.func,
  status: PropTypes.any,
  name: PropTypes.any,
  selected: PropTypes.any,
  handleEdit: PropTypes.any,
  code: PropTypes.any,
  sno: PropTypes.any,
  page: PropTypes.string,
  key: PropTypes.string,
  deptName: PropTypes.string,
  uid: PropTypes.string,
  cid: PropTypes.string,
  userName: PropTypes.string,
  email: PropTypes.string,
  designName: PropTypes.string,
  roleName: PropTypes.string,
  profile: PropTypes.string,
  order: PropTypes.string,
  url: PropTypes.string,
  courseType: PropTypes.string,
  duration: PropTypes.string,
  fees: PropTypes.string,
};
