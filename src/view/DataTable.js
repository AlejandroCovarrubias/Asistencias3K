import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'nombreSeccion', headerName: 'Nombre de la sección', width: 100},
];

const rows = [
    {id: 1, nombreSeccion: 'Unidad 1'},
    {id: 2, nombreSeccion: 'Unidad 2'},
    {id: 3, nombreSeccion: 'Unidad 3'},
    {id: 4, nombreSeccion: 'Unidad 4'},
];

export default function DataTable() {
  return (
    <div style={{ height: 240, width: '100%' }}>
      <DataGrid size='small' rows={rows} columns={columns} pageSize={10} />
    </div>
  );
}