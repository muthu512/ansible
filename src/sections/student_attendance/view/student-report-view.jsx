import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css'; 
import { ModuleRegistry } from '@ag-grid-community/core';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { RichSelectModule } from '@ag-grid-enterprise/rich-select';
import { SparklinesModule } from '@ag-grid-enterprise/sparklines';
import { StatusBarModule } from '@ag-grid-enterprise/status-bar';
import PropTypes from 'prop-types';
import './student-report.css';

// Register AG Grid modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ExcelExportModule,
  MenuModule,
  RangeSelectionModule,
  RowGroupingModule,
  SetFilterModule,
  RichSelectModule,
  SparklinesModule,
  StatusBarModule,
  AllModules,
]);

const numberFormatter = ({ value }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 2,
  });
  return value == null ? '' : formatter.format(value);
};

// Cell Renderer Component
const TickerCellRenderer = ({ data }) => (
  data && (
    <div>
      <img
        src={`/example/finance/logos/${data.ticker}.png`}
        style={{
          width: '20px',
          height: '20px',
          marginRight: '5px',
          borderRadius: '32px',
        }}
        alt={`${data.ticker} logo`}
      />
      <b className="custom-ticker">{data.ticker}</b>
      <span className="ticker-name"> {data.name}</span>
    </div>
  )
);

TickerCellRenderer.propTypes = {
  data: PropTypes.shape({
    ticker: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number,
    price: PropTypes.number,
    purchasePrice: PropTypes.number,
    purchaseDate: PropTypes.string,
    last24: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};

// Main Component
const StudentReportData = () => {
  const [rowData, setRowData] = useState(getData());
  const gridRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRowData((row) =>
        row.map((item) =>
          Math.random() < 0.1
            ? {
                ...item,
                price:
                  item.price +
                  item.price *
                    ((Math.random() * 4 + 1) / 100) *
                    (Math.random() > 0.5 ? 1 : -1),
              }
            : item
        )
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const colDefs = useMemo(() => [
    {
      field: 'ticker',
      cellRenderer: 'tickerCellRenderer',
      minWidth: 230,
    },
    {
      field: 'instrument',
      cellDataType: 'text',
      type: 'rightAligned',
      maxWidth: 180,
    },
    {
      headerName: 'P&L',
      cellDataType: 'number',
      type: 'rightAligned',
      cellRenderer: 'agAnimateShowChangeCellRenderer',
      valueGetter: ({ data }) =>
        data && data.quantity * (data.price / data.purchasePrice),
      valueFormatter: numberFormatter,
      aggFunc: 'sum',
    },
    {
      headerName: 'Total Value',
      type: 'rightAligned',
      cellDataType: 'number',
      valueGetter: ({ data }) => data && data.quantity * data.price,
      cellRenderer: 'agAnimateShowChangeCellRenderer',
      valueFormatter: numberFormatter,
      aggFunc: 'sum',
    },
    {
      field: 'quantity',
      cellDataType: 'number',
      type: 'rightAligned',
      valueFormatter: numberFormatter,
      maxWidth: 150,
    },
    {
      headerName: 'Price',
      field: 'purchasePrice',
      cellDataType: 'number',
      type: 'rightAligned',
      valueFormatter: numberFormatter,
      maxWidth: 150,
    },
    {
      field: 'purchaseDate',
      cellDataType: 'dateString',
      type: 'rightAligned',
      hide: true,
    },
    {
      headerName: 'Last 24hrs',
      field: 'last24',
      cellRenderer: 'agSparklineCellRenderer',
      cellRendererParams: {
        sparklineOptions: {
          line: {
            strokeWidth: 2,
          },
        },
      },
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    filter: true,
    enableRowGroup: true,
    enableValue: true,
  }), []);

  const getRowId = useCallback(({ data: { ticker } }) => ticker, []);

  // Define the statusBar here
  const statusBar = useMemo(() => ({
    statusPanels: [
      { statusPanel: 'agTotalAndFilteredRowCountComponent' },
      { statusPanel: 'agTotalRowCountComponent' },
      { statusPanel: 'agFilteredRowCountComponent' },
      { statusPanel: 'agSelectedRowCountComponent' },
      { statusPanel: 'agAggregationComponent' },
    ],
  }), []);

  return (
    <div className="grid">
      <AgGridReact
        ref={gridRef}
        getRowId={getRowId}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        enableRangeSelection
        enableCharts
        rowSelection="multiple"
        rowGroupPanelShow="always"
        suppressAggFuncInHeader
        groupDefaultExpanded={-1}
        statusBar={statusBar}
        frameworkComponents={{ tickerCellRenderer: TickerCellRenderer }}
        className="ag-theme-quartz" 
      />
    </div>
  );
};

// Mock getData function for completeness
const getData = () => [
  { ticker: 'AAPL', instrument: 'Apple Inc.', quantity: 10, price: 150, purchasePrice: 140, last24: [150, 155, 152, 157] },
  { ticker: 'GOOGL', instrument: 'Alphabet Inc.', quantity: 5, price: 2800, purchasePrice: 2700, last24: [2800, 2820, 2780, 2850] },
  // Add more data as needed
];

export default StudentReportData;
