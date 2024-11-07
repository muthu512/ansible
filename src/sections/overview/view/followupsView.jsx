
import DataTable from 'src/components/datatable/data-table';
import useApiService from 'src/services/api_services';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, InputAdornment, OutlinedInput, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material';
import Label from 'src/components/label';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Iconify from 'src/components/iconify';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'src/routes/hooks';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ExcelExportModule } from "@ag-grid-enterprise/excel-export";
import { MenuModule } from "@ag-grid-enterprise/menu";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ListView from '../../../components/List-view-component/ListView';

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ExcelExportModule,
    MenuModule,
]);

export default function Followup() {

    const [searchText, setSearchText] = useState('');
    const [refreshTable, setRefreshTable] = useState(false);
    const [tested, setTest] = useState(true);

    const testing = () => {
        setTest(!tested);
    }

    // Handler to update search text
    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
    };
    const quickFilterText = searchText.trim();

    const { getFollowups } = useApiService();
    const is4KScreen = useMediaQuery('(min-width: 1920px)');
    const isSmallScreen = useMediaQuery('(max-width: 650px)');
    const router = useRouter();

    const [todayFollow, setTodayFollow] = useState();
    const [load, setLoad] = useState(true);

    const getTodayFollowupdata = useCallback(async () => {
        const response = await getFollowups();
        setTodayFollow(response);
        setLoad(false);
    }, [getFollowups]);

    const exportToExcel = (rowData, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(rowData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, `${fileName}.xlsx`);
    };

    useEffect(() => {
        if (load) {
            getTodayFollowupdata()
        }
    }, [load, getTodayFollowupdata])


    const handleRefresh = () => {
        setRefreshTable(!refreshTable); 
    };

    const defaultColDef = useMemo(() => ({
        // floatingFilter: true,
        filter: 'agTextColumnFilter',
    }), []);

    const [columnDefs] = useState([
        { id: '', field: 'S.no', valueGetter: "node.rowIndex + 1", align: 'center', maxWidth: 80, flex: 1, filter: false, cellStyle: {textAlign: 'center'}
        },
        { id:'fdate', headerName: 'Followup Date', field: 'fdate', flex: 2, cellStyle: {textAlign: 'center'} },
        {
            id: 'customerName', field: 'customerName', flex: 1, cellStyle: {textAlign: 'center'},

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
            id: 'assigneeName', field: 'assigneeName', flex: 1, cellStyle: {textAlign: 'center'},
            cellRenderer: (params) => (
                    <Label
                        onClick={() => { testing() }}
                        sx={{
                            margin: '11px',
                            "&:hover": {
                                color: 'blue',
                                cursor: "pointer",
                            }
                        }}> {params.value}
                    </Label>
            )
        },
        { headerName: 'Followup content ', field: 'fcontent', align: 'center', },
    ]);

    return (

        <>
            <div style={{ padding: '10px', display: 'flex', gap: 20, justifyContent: 'space-between', flexWrap: 'wrap', alignItems: "center", justifyItems: "center" }}>
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
                        <Typography variant="h6">Today Follow Ups</Typography>
                    </Tooltip>
                </Stack>

                { isSmallScreen ? null :
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'warp' }}>

                    <div>
                        <Stack spacing={2} direction="row" sx={{ marginRight: '15px' }}>
                            <Button variant="text" onClick={handleRefresh}>
                                <RefreshIcon />
                            </Button>
                        </Stack>
                    </div>

                    <OutlinedInput
                        value={searchText}
                        onChange={handleSearchTextChange}
                        placeholder="Search...."
                        sx={{ height: 36 }}
                        startAdornment={
                            <InputAdornment position="start" >
                                <Iconify
                                    icon="eva:search-fill"
                                    sx={{ color: 'text.disabled', width: 20, height: 20 }}
                                />
                            </InputAdornment>
                        }
                    />
                    <Button onClick={() => { exportToExcel(todayFollow, 'Today_followup') }}>Export to Excel</Button>
                </div> }
            </div>


            {isSmallScreen ? (
                <ListView
                    data={todayFollow}
                    onRowClick={cid => router.push(`/crm/customer/${cid}`)}
                    page="followup"
                />
            ) : (
            <Box
                className='ag-theme-quartz'
                sx={{
                    height: is4KScreen ? '92vh' : 470,
                }}                    >
                <DataTable
                    quickFilterText={quickFilterText}
                    rowData={todayFollow}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    refreshTable={refreshTable}
                    onGridReady={params => {
                        params.api.sizeColumnsToFit();
                    }}
                    domLayout='autoHeight'
                />
            </Box>
              )}

        </>
    )
}