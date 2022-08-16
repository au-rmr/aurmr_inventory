import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useState } from 'react';
import './../styles/App.css';


interface TableObject {
    asin: string,
    productName: string,
    productBinId: number,
    binName: string,
}

interface ObjectTableProps {
    objectList: TableObject[]
}

function ObjectTable(props:ObjectTableProps) {
    return (
        <TableContainer id="table" component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell align="right">ASIN</TableCell>
                <TableCell align="right">Bin Name</TableCell>
                <TableCell align="right">Product Bin ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.objectList && props.objectList.map((row) => (
                <TableRow
                  key={row.productBinId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.productName}
                  </TableCell>
                  <TableCell align="right">{row.asin}</TableCell>
                  <TableCell align="right">{row.binName}</TableCell>
                  <TableCell align="right">{row.productBinId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    );
}
export default ObjectTable;