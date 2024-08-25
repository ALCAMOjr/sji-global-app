import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { colorMap } from "../../utils/Colors.js"; // Import the shared colorMap


const TableReportes = ({ reportesDetalles }) => {
  return (
    <TableContainer component={Paper} className="justify-center flex relative min-w-max items-center mt-20">
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell><span className="text-sm font-bold text-black">Etapa</span></TableCell>
            <TableCell align='center'><span className="text-sm font-bold text-black">Total de Créditos</span></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportesDetalles.map((reporte, index) => (
            <TableRow key={index} style={{ backgroundColor: colorMap[reporte.Etapa] || '#FFFFFF' }}>
              <TableCell>{reporte.Etapa}</TableCell>
              <TableCell align='center'>{reporte.Total_Creditos}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableReportes;
