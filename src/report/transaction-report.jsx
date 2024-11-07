import * as React from 'react';
import { useState, useCallback } from 'react';
import { Container, useMediaQuery } from '@mui/system';
import './crmReportStyle.css';
import { Grid, Button, Tooltip, Card, IconButton, Typography, InputAdornment, OutlinedInput, } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import useApiService from 'src/services/api_services';
import styled from 'styled-components';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { format, parse } from 'date-fns';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { useRouter } from '../routes/hooks';
import Label from '../components/label';
import Iconify from '../components/iconify';
import DataTable from '../components/datatable/data-table';
import ListView from '../components/List-view-component/ListView';

export default function TransactionReport() {

    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [load, setLoad] = useState(true);
    const { searchTransaction, downloadTransactionReport } = useApiService();
    const [report, setReport] = useState([]);
    const [downloadProgress, setDownloadProgress] = useState(false)

    const isSmallScreen = useMediaQuery('(max-width: 650px)');

    const [transactionData, setTransactionData] = useState({
        "fromDate": format(new Date(), 'yyyy-MMM-dd'),
        "toDate": format(new Date(), 'yyyy-MMM-dd'),
    })

    const CustomDatePicker = styled(DatePicker)({

        '& .MuiOutlinedInput-root': {
            height: '100%', 
        },

    });

    const copyToMobileNumber = (phoneNumber) => {
        navigator.clipboard.writeText(phoneNumber);
    };

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
        { field: 'billNo', flex: 2 },
        {
            field: 'amount', flex: 2,
            cellRenderer: (params) => <Label
                color="secondary">₹ {params.value}</Label>,
        },
        {
            field: 'paymentStatus', flex: 2,
            cellRenderer: (params) => <Label color={params.value === 'Full' ? 'success' : 'warning'}>
                {params.value}
            </Label>
        },
        { field: 'paymentType', flex: 2 },
        {
            field: 'assigneeName', flex: 2,
            cellRenderer: (params) => (<Label
                onClick={() => { router.push(`/users/info/${params.data.uid}`) }}
                sx={{
                    margin: '11px',
                    "&:hover": {
                        color: 'blue',
                        cursor: "pointer",
                    }
                }}> <Iconify icon="mdi:account-circle" sx={{ marginRight: .5 }} />{params.value}
            </Label>)
        },
        { field: 'course', flex: 2 },
        
    ]);

    const handleClear = (event) => {
        setTransactionData({
            "fromDate": format(new Date(), 'yyyy-MMM-dd'),
            "toDate": format(new Date(), 'yyyy-MMM-dd'),
        })
    }

    const search = React.useCallback(
        async (searchData) => {
            const response = await searchTransaction(searchData);
            setReport(response);
            localStorage.setItem('searchResults', JSON.stringify(response));
            setDownloadProgress(false);
        },
        [searchTransaction]
    );
    const downloadTableData = useCallback(
        async (searchReportData) => {
            const response = await downloadTransactionReport(searchReportData);
            const disposition = response.headers['content-disposition'];
            let filename = 'Transaction_Report.xlsx';
            if (disposition && disposition.indexOf('filename=') !== -1) {
                const matches = disposition.match(/filename="(.+)"/);
                if (matches != null && matches[1]) {
                    filename = matches[1];
                }
            }
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        },
        [downloadTransactionReport],
    );

    const handleExportToExcel = () => {
        setDownloadProgress(true)
        downloadTableData(transactionData).finally(() => {
            setDownloadProgress(false);
        });;
    };

        React.useEffect(() => {
            if (load) {
              setLoad(false);
              const storedData = JSON.parse(localStorage.getItem('searchResults'));
              if (storedData) {
                setReport(storedData); 
              }
            }
          }, [load]);

    const handleFindClick = () => {
        search(transactionData)
        setShowForm(false);
    }
    const handleShowForm = () => {
        setShowForm(true);
    }

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                    color: '#f79520',
                    padding: '10px',
                    marginLeft: '10px',
                    '&:hover': {
                        color: 'blue',
                        cursor: 'pointer',
                    },
                }}
            >
                {showForm === true ?
                    <Stack
                        direction="row"
                        onClick={() => router.back()}
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
                            <Typography onClick={() => router.back()} variant="h6">Transaction Report</Typography>
                        </Tooltip>
                    </Stack> : null}
            </Stack>

            {showForm === true ?
                <div style={{ display: 'grid', width: '100%', height: '70dvh', alignItems: 'center' }}>
                    <Container maxWidth="md">
                        <Card className='formCardT' sx={{ paddingTop: '10px', boxShadow: '1px  2px  10px #ddd', }}>
                            <Stack direction="column" alignItems="start" mb={0} padding={2}>
                                <Grid
                                    container
                                    spacing={1}
                                    alignItems="center"
                                    sx={{ flexWrap: 'wrap', width: '100%' }}
                                >
                                    <Grid
                                        item
                                        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, rowGap: '20px' }}
                                    >
                                        <Grid
                                            item
                                            sx={{
                                                display: 'flex',
                                                gap: '10px',
                                                flexWrap: 'wrap',
                                                flexGrow: 1,
                                                justifyContent: 'space-evenly'
                                            }}
                                        >
                                            <Grid item xs={12} sm={12} md={5.5}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <CustomDatePicker
                                                        sx={{ width: { xs: '100%', sm: '100%', xl: '100%' } }}
                                                        value={parse(transactionData.fromDate, 'yyyy-MMM-dd', new Date())}
                                                        name="fromDate"
                                                        label="Start Date"
                                                        format="yyyy-MMM-dd"
                                                        onChange={(newValue) => {
                                                            setTransactionData((prevState) => ({
                                                                ...prevState,
                                                                fromDate: format(newValue, 'yyyy-MMM-dd'),
                                                            }));
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={5.5}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <CustomDatePicker
                                                        sx={{ width: { xs: '100%', sm: '100%', xl: '100%' } }}
                                                        name="toDate"
                                                        value={parse(transactionData.toDate, 'yyyy-MMM-dd', new Date())}
                                                        label="End Date"
                                                        format="yyyy-MMM-dd"
                                                        onChange={(newValue) => {
                                                           setTransactionData((prevState) => ({
                                                                ...prevState,
                                                                toDate: format(newValue, 'yyyy-MMM-dd'),
                                                            }));
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={12} sx={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: "center", }}>
                                                <Button
                                                    onClick={handleFindClick}
                                                    variant='contained'
                                                >
                                                    <Iconify sx={{ marginRight: '10px' }} icon="line-md:file-search-twotone" /> Find
                                                </Button>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: "center", }} >
                                                <Button
                                                    onClick={handleClear}
                                                    variant='outlined'
                                                >
                                                    <Iconify sx={{ marginRight: '10px' }} icon="mdi:clear-reverse-outline" /> Clear
                                                </Button>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Card>
                    </Container>
                </div>
                :
                <Card className="reportCardT" style={{ margin: '5px',paddingBottom:"10px"}}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px',
                        }}
                    >
                        <Stack
                            direction="row"
                            onClick={() => router.back()}
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
                                <Typography onClick={() => router.back()} variant="h6">Transacrtion Report</Typography>
                            </Tooltip>
                        </Stack>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <OutlinedInput
                                placeholder="Search...."
                                sx={{ height: 36, }}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Iconify
                                            icon="eva:search-fill"
                                            sx={{ color: 'text.disabled', width: 20, height: 20 }}
                                        />
                                    </InputAdornment>

                                }
                            />
                            <div className='tableButtons' style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
                                {downloadProgress ? <CircularProgress size={24} /> :
                                    <Tooltip title="Export to Excel">
                                        <IconButton
                                            onClick={handleExportToExcel}
                                            sx={{ backgroundColor: 'rgba(235,235,235)', borderRadius: '10px' }}
                                            disabled={downloadProgress}
                                        >
                                            <Iconify icon="vscode-icons:file-type-excel" />
                                        </IconButton>
                                    </Tooltip>}
                                <Tooltip title="Export to PDF" >
                                    <IconButton
                                        sx={{ backgroundColor: 'rgba(235,235,235)', borderRadius: '10px', display: 'none' }}

                                    ><Iconify icon="formkit:filepdf" sx={{ color: "#db2929" }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip>
                                    <Button onClick={handleShowForm}
                                        sx={{ backgroundColor: 'rgba(235,235,235)' }}
                                    >
                                        <Iconify sx={{ marginRight: '10px' }} icon='line-md:file-search-twotone' /> Search On
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>

                    <div style={{ width: '100%', padding: '0 10px 0 10px' }}>
                        {isSmallScreen ? (
                            <ListView
                                data={report}
                                onRowClick={uid => router.push(`/crm/customer/${uid}`)}
                                page="transaction"
                            />
                        ) : (
                            <DataTable rowData={report}
                                columnDefs={columnDefs}
                                pagers="noPagination" />)}
                    </div>
                </Card>}
        </>
    );
}