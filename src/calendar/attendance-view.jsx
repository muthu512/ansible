import React from "react";
import PropTypes from 'prop-types';
import MUIDataTable from "mui-datatables";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Checkbox, FormControlLabel, Stack, Switch, Tooltip, Typography } from "@mui/material";
import { useRouter } from 'src/routes/hooks';

const AttendanceView = ({ getValueBack }) => {

    const router = useRouter();
    const columns = [
        {
            name: "Name",
            options: {
                filter: false,
            },
        },
        {
            name: "Department",
            options: {
                filter: true,
            },
        },
        {
            name: "Date",
            options: {
                filter: true,
            },
        },
        {
            name: "In-Time",
            options: {
                filter: true,

            },
        },
        {
            name: "Out-Time",
            options: {
                filter: false,
            },
        },
        
        {
            name: "Active",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => (
                    <FormControlLabel
                        label={value ? "Yes" : "No"}
                        value={value ? "Yes" : "No"}
                        control={
                            <Switch
                                color="primary"
                                checked={value}
                                value={value ? "Yes" : "No"}
                                onChange={(event) => {
                                    updateValue(!value);
                                }}
                            />
                        }
                    />
                ),
            },
        },
        {
            name: "Attendance",
            options: {
                filter: true,
                customBodyRender: (value, tableMeta, updateValue) => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={value}
                                onChange={(event) => updateValue(event.target.checked)}
                            />
                        }
                    />
                ),
            },
        },
    ];

    const data = [
        ["Robin Duncan", "Business Analyst", "Los Angeles", 20, 77000, false],
        ["Mel Brooks", "Business Consultant", "Oklahoma City", 37,888, true],
        ["Harper White", "Attorney", "Pittsburgh", 52, 420000, false],
        ["Kris Humphrey", "Agency Legal Counsel", "Laredo", 30, 150000, true],
        ["Frankie Long", "Industrial Analyst", "Austin", 31, 170000, false],
        ["Brynn Robbins", "Business Analyst", "Norfolk", 22, 90000, true],
        ["Justice Mann", "Business Consultant", "Chicago", 24, 133000, false],
        ["Addison Navarro", "Business Management Analyst", "New York", 50, 295000, true],
        ["Jesse Welch", "Agency Legal Counsel", "Seattle", 28, 200000, false],
        ["Eli Mejia", "Commercial Specialist", "Long Beach", 65, 400000, true],
        ["Gene Leblanc", "Industrial Analyst", "Hartford", 34, 110000, false],
        ["Danny Leon", "Computer Scientist", "Newark", 60, 220000, true],
        ["Lane Lee", "Corporate Counselor", "Cincinnati", 52, 180000, false],
        ["Jesse Hall", "Business Analyst", "Baltimore", 44, 99000, true],
        ["Danni Hudson", "Agency Legal Counsel", "Tampa", 37, 90000, false],
        ["Terry Macdonald", "Commercial Specialist", "Miami", 39, 140000, true],
        ["Justice Mccarthy", "Attorney", "Tucson", 26, 330000, false],
        ["Silver Carey", "Computer Scientist", "Memphis", 47, 250000, true],
        ["Franky Miles", "Industrial Analyst", "Buffalo", 49, 190000, false],
        ["Glen Nixon", "Corporate Counselor", "Arlington", 44, 80000, true],
        ["Gabby Strickland", "Business Process Consultant", "Scottsdale", 26, 45000, false],
        ["Mason Ray", "Computer Scientist", "San Francisco", 39, 142000, true],
    ];

    const options = {
        filter: true,
        filterType: "dropdown",
        responsive: "scroll",
        selectableRows: "single",
        onTableChange: (action, dataObj) => {
            const actualData = [];
            if (dataObj.selectedRows.data.length > 0) {
                const selectedRowIndices = Object.keys(dataObj.selectedRows.lookup);
                selectedRowIndices.forEach((value) => {
                    actualData.push(dataObj.data[value].data);
                });
            }
        },
    };
    

    return (
      
        <MUIDataTable
            title={<Stack  direction="row" alignItems="center"
                onClick={() => { router.back() }}
                sx={{
                    color: "#f79520",
                    "&:hover": {
                        color: 'blue',
                        cursor: "pointer",
                    }
                }}>
                    
                <KeyboardArrowLeftIcon/>
                <Tooltip title='back'>
                <Typography variant="h6">Staff Attendance</Typography>
                </Tooltip>
             
            </Stack>}
            data={data}
            columns={columns}
            options={options}
        />
    );
};

AttendanceView.propTypes = {
    getValueBack: PropTypes.func.isRequired,
};

export default AttendanceView;
