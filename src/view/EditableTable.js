import React, { useState, useEffect } from 'react';
import MaterialTable from "material-table";

const EditableTable = props => {
  const [gridData, setGridData] = useState({
    title: props.title,
    data: props.rows,
    columns: props.cols,
    resolve: () => {},
    updatedAt: new Date()
  });

  useEffect(() => {
    gridData.resolve();
  }, [gridData]);

  const onRowAdd = newData =>
    new Promise((resolve, reject) => {
      const data = [...gridData.data];
      data.push({id: data.length + 1, nombre: newData.nombre});
      const updatedAt = new Date();
      setGridData({ ...gridData, data, updatedAt, resolve });
    });

  const onRowUpdate = (newData, oldData) =>
    new Promise((resolve, reject) => {
      // Copiar el estado actual de los datos en un array
      const data = [...gridData.data];
      // Obtener el indice editado
      const index = data.indexOf(oldData);
      // replace old data
      data[index] = newData;
      // update state with the new array
      const updatedAt = new Date();
      setGridData({ ...gridData, data, updatedAt, resolve });
    });

  const onRowDelete = oldData =>
    new Promise((resolve, reject) => {
      let data = [...gridData.data];
      const index = data.indexOf(oldData);
      data.splice(index, 1);
      const updatedAt = new Date();
      setGridData({ ...gridData, data, updatedAt, resolve });
    });

  return (
    <MaterialTable
      title={gridData.title}
      columns={gridData.columns}
      data={gridData.data}
      editable={{
        isEditable: rowData => true,
        isDeletable: rowData => true,
        onRowAdd: onRowAdd,
        onRowUpdate: onRowUpdate,
        onRowDelete: onRowDelete
      }}
      options={{
        pageSize: 5,
        pageSizeOptions: [],
        search: false,
        minBodyHeight: 400,
        maxBodyHeight: 400,
        headerStyle:{backgroundColor:'#dcdcdc'},
      }}
      localization={{ 
        body: { 
          addTooltip: 'Agregar',
          deleteTooltip: 'Eliminar',
          editTooltip: 'Editar',
          editRow: { 
            deleteText: '¿Estás seguro que deseas eliminar esta fila?' }, 
            cancelTooltip: 'Cancelar',
            saveTooltip: 'Guardar',
          }, 
          header: { 
            actions: 'Editar/Eliminar'
          },
          toolbar: {
            searchTooltip: 'Buscar',
            searchPlaceholder: 'Buscar',
          },
          pagination: {
            labelDisplayedRows: '{from} - {to} de {count}',
            labelRowsSelect: 'filas',
            labelRowsPerPage: 'Filas por página',
            firstAriaLabel: 'Primer página',
            firstTooltip: 'Primer página',
            previousAriaLabel: 'Página anterior',
            previousTooltip: 'Página anterior',
            nextAriaLabel: 'Página siguiente',
            nextTooltip: 'Página siguiente',
            lastAriaLabel: 'Última página',
            lastTooltip: 'Última página',
          },
        }}
    />
  );
};

export default EditableTable;
