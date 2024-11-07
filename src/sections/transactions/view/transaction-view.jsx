import { parse, format } from 'date-fns';
import { useState, useEffect, forwardRef, useCallback, useMemo } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Typography from '@mui/material/Typography';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Radio,
  Dialog,
  TextField,
  FormLabel,
  RadioGroup,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  InputAdornment,
  FormControlLabel,
  DialogContentText,
  useMediaQuery,
  OutlinedInput,
  Tooltip,
  Grid,
  IconButton,
} from '@mui/material';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import useApiService from 'src/services/api_services';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snakbar/SnackbarContext';
import DataTable from 'src/components/datatable/data-table';
import { useRouter } from 'src/routes/hooks';
import Label from 'src/components/label';
import ConfirmDialog from '../../../components/confirmdialog/confirm-dialog';
import ListView from '../../../components/List-view-component/ListView';
import GradientProgress from '../../../components/progress/gradientProgress';

// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

export default function TransactionPage() {

  const { showSnackbar } = useSnackbar();

  const { getAccount, addTransaction, getPaymentTransaction, createPayment, deleteTranssaction } = useApiService();

  const [searchText, setSearchText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [errors] = useState({});
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const isSmallScreen = useMediaQuery('(max-width: 650px)');

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const copyToMobileNumber = (phoneNumber) => {
    navigator.clipboard.writeText(phoneNumber);
  };

  const quickFilterText = searchText.trim();

  const defaultColDef = useMemo(() => ({
    filter: 'agTextColumnFilter',
  }), []);
  const smallscreen = useMediaQuery('(min-width: 450px)');
  const [progressLoading , setProgressLoading] = useState(true)
  const [rowData, setRowData] = useState([]);
  
  const [columnDefs] = useState([
    {
      id: '',
      field: 'S.no',
      valueGetter: 'node.rowIndex + 1',
      align: 'center',
      flex: 1,
      maxWidth: 100,
      filter: false,
    },
    { field: 'tdate', flex: 2 },
    { field: 'refId', flex: 2 },
    {
      field: 'customerName', flex: 2,
      cellRenderer: (params) => (<Label
        onClick={() => { router.push(`/crm/customer/${params.data.cid}`) }}
        sx={{
          margin: '11px',
          "&:hover": {
            color: 'blue',
            cursor: "pointer",
          }
        }}> <Iconify icon="mdi:account-circle" sx={{ marginRight: .5 }} />{params.value}
      </Label>)
    },
    {
      field: 'mobileNumber', flex: 2,
      cellRenderer: (params) => (
        <Label
          onClick={() => {
            copyToMobileNumber(params.value);
          }}
          sx={{
            marginTop: '11px',
            '&:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
          }}
        >
          {' '}

          <Tooltip title="copy">
            <ContentCopyRoundedIcon sx={{ margin: 0.5, fontSize: 'medium' }} />
          </Tooltip>
          {params.value}
        </Label>
      ),
    },
       { field: 'billNo', flex: 2,
        cellRenderer:(params) => <span>
          {params.value}
        </span>
        },
    {
      field: 'amount', flex: 2,
      cellRenderer: (params) => <Label
        color="secondary">₹ {params.value}</Label>,
    },
    { field: 'paymentStatus', flex: 2,
    cellRenderer: (params) => <Label color={ params.value === 'Full' ? 'success' : 'warning' }>
    {params.value}
  </Label> },
    { field: 'paymentType', flex: 2 },
    { field: 'assigneeName', flex: 2,
      cellRenderer: (params) => (<Label
        onClick={() => { router.push(`/users/info/${params.data.uid}`) }}
        sx={{
          margin: '11px',
          color:`${params.data.color}`,
          "&:hover": {
            color: 'blue',
            cursor: "pointer",
          }
        }}> <Iconify icon="mdi:account-circle" sx={{ marginRight: .5 }} />{params.value}
      </Label>)
     },
    { field: 'course', flex: 2 },
    {
      field: 'Actions',
      flex: 1.5,
      filter: false,
      minWidth:110,
      cellRenderer: (params) => (
        <>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => {
              handleTransactionEdit(params.data);
            }}
          >
            <Iconify icon="ic:outline-edit-note" />
          </IconButton>
        </Tooltip>
         <Tooltip title="Delete">
         <IconButton
           onClick={() => {
            handleClickDelete(params.data.id);
           }}
         >
           <Iconify icon="material-symbols:delete-outline-rounded" sx={{ color: 'red' }} />
         </IconButton>
       </Tooltip>
       </>
      )
    },
  ]);
  
  const [columnDefsUser] = useState([
    {
      id: '',
      field: 'S.no',
      valueGetter: 'node.rowIndex + 1',
      align: 'center',
      flex: 1,
      maxWidth: 100,
      filter: false,
    },
    { field: 'tdate', flex: 2 },
    {
      field: 'customerName', flex: 2,
      cellRenderer: (params) => (<Label> 
        <Iconify icon="mdi:account-circle" sx={{ marginRight: .5 }} />{params.value}
      </Label>)
    },
    {
      field: 'mobileNumber', flex: 2,
      cellRenderer: (params) => (
        <Label
          onClick={() => {
            copyToMobileNumber(params.value);
          }}
          sx={{
            marginTop: '11px',
            '&:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
          }}
        >
          {' '}

          <Tooltip title="copy">
            <ContentCopyRoundedIcon sx={{ margin: 0.5, fontSize: 'medium' }} />
          </Tooltip>
          {params.value}
        </Label>
      ),
    },
    {
      field: 'amount', flex: 2,
      cellRenderer: (params) => <Label
        color="secondary">₹ {params.value}</Label>,
    },
    { field: 'paymentStatus', flex: 2, 
      cellRenderer: (params) => <Label color={ params.value === 'Full' ? 'success' : 'warning' }>
        {params.value}
      </Label>
    },
    { field: 'paymentType', flex: 2 },
    { field: 'assigneeName', flex: 2,
      cellRenderer: (params) => (<Label
        onClick={() => { router.push(`/users/info/${params.data.uid}`) }}
        sx={{
          margin: '11px',
          color:`${params.data.color}`,
          "&:hover": {
            color: 'blue',
            cursor: "pointer",
          }
        }}> <Iconify icon="mdi:account-circle" sx={{ marginRight: .5 }} />{params.value}
      </Label>)
     },
    { field: 'course', flex: 2 },
    {
      field: 'Actions',
      flex: 1.5,
      filter: false,
      maxWidth: "300px",
      cellRenderer: (params) => (
        <Tooltip title="Edit">
          <IconButton
            onClick={() => {
              handleTransactionEdit(params.data);
            }}
          >
            <Iconify icon="ic:outline-edit-note" />
          </IconButton>
        </Tooltip>
      )
    },
  ]);

  const [account, setAccount] = useState([{ label: '', id: 0 }]);
  const [transaction, setTransaction] = useState({
    "id": 0,
    "cid": "",
    "customerName": "",
    "mobileNumber": "",
    "refId": "",
    "paymentStatus": "",
    "paymentType": "",
    "amount": 0,
    "description": "",
    "tdate": format(new Date(), "yyyy-MMM-dd"),
  });

  const [payment,setPayment] = useState({})
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(true);

  const getAccountDetails = useCallback(async () => {
    const response = await getAccount();
    setAccount(response.map((element) => ({ label: element.title, id: element.id })));
  }, [getAccount]);


  const getAllTransactionPayment = useCallback(async () => {
    const response = await getPaymentTransaction();
    setRowData(response)
    setProgressLoading(false)
    setLoad(false);
  }, [getPaymentTransaction]);

  const handleDeleteBatch = async () => {
    const response = await deleteTranssaction(itemToDelete);
    handleCloseDelete();
    if (response.status === "OK") {
      showSnackbar(response.message, 'success');
      getAllTransactionPayment()
    } else {
      showSnackbar(response.message, 'warning');
    }
  }

  const handleClickDelete = (item) => {
    setItemToDelete(item);
    setConfirmDelete(true);
  };

  useEffect(() => {
    if (load) {
      getAccountDetails();
      getAllTransactionPayment();
    }
  }, [load, getAccountDetails, getAllTransactionPayment]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseDelete = () => {
    setConfirmDelete(false);
    setItemToDelete(null);
  };

  const handleClose = () => {
    setOpen(false);
    setTransaction({
      accountId: 0,
      type: '',
      tdate: format(new Date(), 'yyyy-MM-dd'),
      amount: 0,
      description: '',
    });
  };

  const saveTransaction = async () => {
    const response = await addTransaction(transaction);
    if (response.status === 'OK') {
      showSnackbar(response.message, 'success');
      getAccountDetails();
    }
  };

  const saveTransDialog = async () => {
    handleClose();
    const response = await createPayment(payment);
    if (response.status === "OK") {
      showSnackbar(response.message, 'success');
    } else {
      showSnackbar(response.message, 'warning');
    }
    getAllTransactionPayment()
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      if (/^\d*\.?\d{0,2}$/.test(value)) {
        setTransaction((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else {
      setTransaction((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleTransactionEdit = (row) => {
    setPayment({
      "id": row.id,
      "cid": row.cid,
      "refId": row.refId,
      "paymentStatus": row.paymentStatus,
      "paymentType": row.paymentType,
      "amount": row.amount,
      "description": row.description,
      "tdate": row.tdate,
    })
    setOpen(true)
  }
  const handleChangePay = (e) => {
    const { name, value } = e.target;
    setPayment((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  return (

    <Container maxWidth='xxl'>
      <Card sx={{padding:'0 10px 10px 10px',marginBottom:'10px'}}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={0}
          padding={2}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between"
            onClick={() => { router.back() }}
            sx={{
              color: "#f79520",
              "&:hover": {
                color: 'blue',
                cursor: "pointer",
              }
            }}>
            <KeyboardArrowLeftIcon />
            <Tooltip title='back'>
              <Typography variant="h6">Transaction</Typography>
            </Tooltip>
          </Stack>

          <OutlinedInput
            value={searchText}
            onChange={handleSearchTextChange}
            placeholder="Search...."
            sx={{ height: 36, marginRight: '20px', display: smallscreen ? '' : 'none' }}
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled', width: 20, height: 20 }}
                />
              </InputAdornment>
            }
          />
          <Button
            variant="contained"
            color="inherit"
            sx={{ display: 'none' }}
            onClick={handleClickOpen}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Transaction
          </Button>
          <Dialog
            onClose={handleClose}
            TransitionComponent={Transition}
            PaperProps={{
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                saveTransaction();
                handleClose();
              },
            }}
          >
            <DialogTitle>New Transaction</DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <DialogContentText>
                  Here, you may add credit and debit transactions to your account.
                </DialogContentText>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Transaction Date"
                    value={parse(transaction.tdate, 'yyyy-MM-dd', new Date())}
                    onChange={(newValue) => {
                      setTransaction((prevState) => ({
                        ...prevState,
                        tdate: format(newValue, 'yyyy-MM-dd'),
                      }));
                    }}
                    format="yyyy-MM-dd"
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label"><Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify sx={{ marginRight: '4px' }} icon="fluent-emoji-high-contrast:bank" width="1.2rem" height="1.2rem" />
                    <div>Account *</div>
                  </Grid></InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={transaction.accountId}
                    label=
                    {<Grid item style={{ display: 'flex', alignItems: 'center' }}>
                      <Iconify sx={{ marginRight: '4px' }} icon="fluent-emoji-high-contrast:bank" width="1.2rem" height="1.2rem" />
                      <div>  Account *</div>
                    </Grid>}
                    name="accountId"
                    required
                    placeholder="Select Account"
                    onChange={handleChange}
                  >
                    {account.map((e) => (
                      <MenuItem value={e.id}>{e.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl required component="fieldset">
                  <FormLabel component="legend">Transaction Type: </FormLabel>
                  <RadioGroup
                    row
                    aria-label="options"
                    name="type"
                    value={transaction.type}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      sx={{ color: transaction.type === 'CREDIT' ? 'green' : 'default' }}
                      value="CREDIT"
                      control={<Radio color="success" />}
                      label="Credit"
                    />
                    <FormControlLabel
                      sx={{ color: transaction.type === 'DEBIT' ? 'red' : 'default' }}
                      value="DEBIT"
                      control={<Radio color="error" />}
                      label="Debit"
                      color="error"
                    />
                  </RadioGroup>
                </FormControl>
                <TextField
                  label="Amount"
                  name="amount"
                  value={transaction.amount === 0 ? '' : transaction.amount}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment:<InputAdornment position="start">$</InputAdornment>,
                    inputProps: { maxLength: 10 },
                  }}
                  variant="outlined"
                  fullWidth
                  required
                  margin="dense"
                />
                <TextField
                  margin="dense"
                  id="description"
                  maxRows={5}
                  minRows={3}
                  value={transaction.description}
                  multiline
                  onChange={handleChange}
                  name="description"
                  label=
                  {<Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify sx={{ marginRight: '4px' }} icon="material-symbols-light:description-rounded" width="1.2rem" height="1.2rem" />
                    <div>  Description *</div>
                  </Grid>}
                  type="text"
                  fullWidth
                  variant="outlined"
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
          {/* --------------Edit transaction--------------- */}

          <ConfirmDialog
          text=" remove the Transaction record? If you remove the record, it will be erased"
          confirmPopup={confirmDelete}
          handleExit={handleDeleteBatch}
          handleClosePopup={handleCloseDelete}
        />

          <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            onBackdropClick='false'
          PaperProps={{
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              saveTransDialog();
              handleClose();
            },
          }}
          >
            <DialogTitle sx={{color: '#f79520'}}>Edit Transaction</DialogTitle>
            <DialogContent item sx={{ padding: '30px', paddingTop: '30px' }}>
              <Stack spacing={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={payment.paymentType}
                        name='paymentType'
                        error={Boolean(errors.paymentType)}
                        helperText={errors.paymentType}
                        label={
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                              <Iconify
                                icon="marketeq:wallet-money-3"
                                width="1.2rem"
                                height="1.2rem"
                              />
                            </Grid>
                            <Grid item>
                              <div>Payment Type *</div>
                            </Grid>
                          </Grid>
                        }
                        onChange={handleChangePay}
                      >
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="UPI">UPI</MenuItem>
                        <MenuItem value="Card">Card</MenuItem>
                        <MenuItem value="G Pay">G Pay</MenuItem>
                        <MenuItem value="PhonePe">PhonePe</MenuItem>
                        <MenuItem value="Bucciness Account">Bucciness Account</MenuItem>
                        <MenuItem value="Paytm">Paytm</MenuItem>
                        <MenuItem value="CRUD">CRUD</MenuItem>
                        <MenuItem value="Netbanking">Netbanking</MenuItem>
                        <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                        <MenuItem value="Check">Check</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </TextField>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={payment.paymentStatus}
                        error={Boolean(errors.paymentStatus)}
                        helperText={errors.paymentStatus}
                        label={
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                              <Iconify
                                icon="marketeq:wallet-money-3"
                                width="1.2rem"
                                height="1.2rem"
                              />
                            </Grid>
                            <Grid item>
                              <div>Payment Status *</div>
                            </Grid>
                          </Grid>
                        }
                        name="paymentStatus"
                        onChange={handleChangePay}
                      >
                        <MenuItem value="Partial">Partial</MenuItem>
                        <MenuItem value="Full">Full</MenuItem>
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      value={payment.amount}
                      onChange={handleChangePay}
                      id="outlined-basic"
                      name="amount"
                      label={
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>
                            <Iconify
                              icon="emojione-monotone:money-bag"
                              width="1.2rem"
                              height="1.2rem"
                            />
                          </Grid>
                          <Grid item>
                            <div>Amount *</div>
                          </Grid>
                        </Grid>
                      }
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker
                          value={parse(payment.tdate, 'yyyy-MMM-dd', new Date())}
                          onChange={(newValue) => {
                            setPayment((prevState) => ({
                              ...prevState,
                              tdate: format(newValue, 'yyyy-MMM-dd'),
                            }));
                          }}
                          format='yyyy-MMM-dd'
                          label={
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item>
                                <Iconify
                                  icon="lets-icons:date-range"
                                  width="1.2rem"
                                  height="1.2rem"
                                />
                              </Grid>
                              <Grid item>
                                <div>Payment Date *</div>
                              </Grid>
                            </Grid>
                          } />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      value={payment.description}
                      onChange={handleChangePay}
                      id="outlined-basic"
                      name="description"
                      label={
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>
                            <Iconify
                              icon="fluent:text-description-24-filled"
                              width="1.2rem"
                              height="1.2rem"
                            />
                          </Grid>
                          <Grid item>
                            <div>Description *</div>
                          </Grid>
                        </Grid>
                      }
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                </Grid>
              </Stack>
              
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>

        {progressLoading ? <GradientProgress/> :
        <>
        {isSmallScreen ? (
          <ListView
            data={rowData}
            onRowClick={uid => router.push(`/crm/customer/${uid}`)}
            page="transaction"
          />
        ) : (
        <DataTable
          quickFilterText={quickFilterText}
          rowData={rowData}
          columnDefs={auth.user.roleCode === 'ADMIN' ?  columnDefs : columnDefsUser}
          defaultColDef={defaultColDef}
        />)} </> }
      </Card>
    </Container>
  );
}
