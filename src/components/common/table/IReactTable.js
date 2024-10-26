/* eslint-disable */

import React, { useEffect } from "react";
import {
  useTable,
  useGlobalFilter,
  useExpanded,
  usePagination,
  useRowSelect,
  useSortBy,
} from "react-table";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Grid,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import IGlobalFilter from "./IGlobalFilter";

function IReactTable({
  dataFotter,
  paginationFlag,
  footerFlag,
  columns,
  data,
  detailsCoulmns,
  renderRowSubComponent,
  skipPageReset,
  flagTable,
  tableRef,
  hideFilter,
  hiddenColumns,
  heightTable,
}) {
  const numberOfPages = [10, 25, 50, 100, 300, 500, 1000];
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    setPageSize,
    selectedFlatRows,
    pageCount,
    setGlobalFilter,
    prepareRow,
    visibleColumns,
  } = useTable(
    {
      columns,
      data,
      autoResetPage: !skipPageReset,
      initialState: {
        hiddenColumns: hiddenColumns != undefined ? hiddenColumns : "",
      },
    },
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <div
      className="scrollable"
      style={{ height: heightTable ? heightTable : "" }}
    >
      <Grid container spacing={2} className="mb-3">
        {hideFilter ? null : (
          <IGlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        )}
      </Grid>
      <TableContainer ref={tableRef}>
        <Table {...getTableProps()} className="table-hover editableTable">
          <TableHead>
            {headerGroups.map((headerGroup, index) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={index}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽 "
                          : " 🔼 "
                        : ""}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <React.Fragment key={row.id}>
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell, index) => (
                      <TableCell {...cell.getCellProps()} key={index}>
                        {cell.render("Cell")}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.isExpanded ? (
                    <TableRow>
                      <TableCell colSpan={visibleColumns.length}>
                        {renderRowSubComponent({ row })}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
              );
            })}
          </TableBody>
          {footerFlag && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan="2">
                  التقدير : {dataFotter.result} <br />
                  النتيجة : {dataFotter.status}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
      {!paginationFlag && (
        <div className="text-center my-5">
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}{" "}
            </strong>
            <span>
              | Go to Page:{" "}
              <TextField
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const pageNumber = e.target.value
                    ? Number(e.target.value) - 1
                    : 0;
                  gotoPage(pageNumber);
                }}
                style={{ width: "50px" }}
              />
            </span>
          </span>{" "}
          <Select
            className="me-5"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {numberOfPages.map((pageSize) => (
              <MenuItem key={pageSize} value={pageSize}>
                Show {pageSize}
              </MenuItem>
            ))}
          </Select>
          <Button
            color="primary"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {"<<"}
          </Button>
          <Button
            className="ms-1"
            color="primary"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            Prev
          </Button>
          <Button
            className="ms-3"
            color="primary"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            Next
          </Button>
          <Button
            className="ms-1"
            color="primary"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default IReactTable;
