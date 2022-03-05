import {
  Paper,
  Table as TableMU,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import React from 'react';

function createData(action, date, value) {
  return { action, date, value };
}

export const Table = () => {
  const rows = [
    createData('Buy', '15.05.2003', '939.3'),
    createData('Sell', '19.08.2004', '1095.2'),
    createData('Buy', '08.11.2004', '1166.2'),
    createData('Sell', '20.07.2006', '1259.81'),
    createData('Buy', '14.09.2006', '1318'),
    createData('Sell', '24.12.2007', '1484.55'),
    createData('Buy', '24.06.2009', '896.31'),
    createData('Sell', '06.07.2010', '1028.09'),
    createData('Buy', '25.10.2010', '1184.74'),
    createData('Sell', '15.08.2011', '1178.86'),
    createData('Buy', '01.02.2012', '1312.45'),
    createData('Sell', '31.08.2015', '1986.73'),
    createData('Buy', '22.12.2015', '2023.15'),
    createData('Sell', '12.01.2016', '1927.83'),
    createData('Buy', '26.04.2016', '2089.84'),
    createData('Sell', '10.12.2018', '2630.86'),
    createData('Buy', '01.04.2019', '2848.63')
  ];
  return (
    <TableContainer elevation={16} component={Paper} sx={{ maxWidth: 650 }}>
      <TableMU sx={{ maxWidth: 650 }} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Action</TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.date}>
              <TableCell component="th" scope="row" align="center">
                {row.action}
              </TableCell>
              <TableCell align="center">{row.date}</TableCell>
              <TableCell align="center">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableMU>
    </TableContainer>
  );
};
