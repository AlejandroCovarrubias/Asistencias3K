import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
  { field: 'nombreAlumno', headerName: 'Nombre del Alumno', width: 200 },
  { field: 'fecha', headerName: 'PRIMER FECHA', width: 30},
];

const rows = [];

export default function DataTable() {
  return (
    <div style={{ height: 240, width: '100%' }}>
      <DataGrid size='small' rows={rows} columns={columns} pageSize={10} />
    </div>
  );
}