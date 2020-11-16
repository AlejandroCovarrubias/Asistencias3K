import React, { useState, useEffect } from 'react';
import MaterialTable from "material-table";

function EditableTable(props) {

  const [gridData, setGridData] = useState({
    title: props.title,
    data: props.rows,
    columns: props.cols,
    resolve: () => {},
  });

  useEffect(() => {
    gridData.resolve();
    props.handleChange(props.rows);
  }, [gridData]);

  const onRowAdd = newData =>
    new Promise((resolve, reject) => {
      let data = [...gridData.data];

      data.push({ id: data.length, nombre: newData.nombre });
      props.rows.push({id: data.length, nombre: newData.nombre });

      setGridData({ ...gridData, data, resolve });
    }
  );

  const onRowUpdate = (newData, oldData) =>
    new Promise((resolve, reject) => {
      // Copiar el estado actual de los datos en un array
      let data = [...gridData.data];
      // Obtener el indice editado
      let index = data.indexOf(oldData);

      data[index] = {id: index + 1, nombre: newData.nombre};
      props.rows[index] = newData; 

      setGridData({ ...gridData, data, resolve });
    }
  );

  const onRowDelete = oldData =>
    new Promise((resolve, reject) => {
      let data = [...gridData.data];
      let index = data.indexOf(oldData);
      
      data.splice(index, 1);
      props.rows.splice(index, 1);

      setGridData({ ...gridData, data, resolve });
    }
  );

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
        pageSize: 4,
        pageSizeOptions: [],
        search: false,
        minBodyHeight: 300,
        maxBodyHeight: 300,
        headerStyle: { backgroundColor: '#dcdcdc' },
      }}
      localization={{
        body: {
          addTooltip: 'Agregar',
          deleteTooltip: 'Eliminar',
          editTooltip: 'Editar',
          editRow: {
            deleteText: '¿Estás seguro que deseas eliminar esta fila?'
          },
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
