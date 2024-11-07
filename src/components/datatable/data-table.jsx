import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMediaQuery } from '@mui/system';
import { useMemo } from 'react';


const DataTable = ({ rowData, columnDefs, onGridReady, quickFilterText, refreshTable,onPaginationChanged,onFirstDataRendered,pagers,onCellValueChange, ...dataProp }) => {

  const is4KScreen = useMediaQuery('(min-width: 1440px)');
  const defaultColDef = useMemo(
    () => ({
      filter: 'agTextColumnFilter',
    }),
    []
  );

  const True = true

  

  return (

    <div
      className='ag-theme-quartz'
      style={{
        height: is4KScreen ? '88vh' : 470,
      }}
    >
      <AgGridReact
        quickFilterText={quickFilterText}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        refreshTable={refreshTable}
        onCellValueChanged={onCellValueChange}
        rowHeight={50}
        onGridReady={onGridReady}
        pagination={pagers==="noPagination" ? false : True}
        pivotPanelShow='always'
        paginationPageSize={is4KScreen ? 25 : 10}
        paginationPageSizeSelector={is4KScreen ? [25, 50, 75] : [10, 25, 50]}
        onPaginationChanged={onPaginationChanged}
        onFirstDataRendered={onFirstDataRendered}
        tooltipShowDelay={0}
      />
    </div>

  )
}

DataTable.propTypes = {
  quickFilterText: PropTypes.any,
  rowData: PropTypes.object,
  columnDefs: PropTypes.object,
  onGridReady: PropTypes.any,
  refreshTable: PropTypes.any,
  onPaginationChanged: PropTypes.any,
  pagers:PropTypes.any,
  onFirstDataRendered: PropTypes.any,
  onCellValueChange:PropTypes.any

};
export default DataTable;
