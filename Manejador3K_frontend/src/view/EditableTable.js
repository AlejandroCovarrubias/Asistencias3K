import React, { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import TextField from "@material-ui/core/TextField";

function EditableTable(props) {

  const [nameError, setNameError] = useState({
    error: false,
    label: "",
    helperText: "",
    validateInput: false,
  });

  const cols = [
    {
      field: 'nombre',
      title: 'Nombre',
      width: 300,
      editComponent: (props) => (
        <TextField
          type="text"
          id="standard-error-helper-text"
          error={nameError.validateInput}
          label={nameError.validateInput ? nameError.label : ""}
          helperText={nameError.validateInput ? nameError.helperText : ""}
          fullWidth
          value={props.value ? props.value : ""}
          onChange={(e) => {
            props.onChange(e.target.value);
            if (nameError.validateInput) {
              setNameError({
                validateInput: false,
              });
            }
          }}
        />
      ),
    },
  ];

  const [gridData, setGridData] = useState({
    title: props.title,
    data: props.rows,
    resolve: () => { },
  });

  useEffect(() => {
    gridData.resolve();
    props.handleChange(props.rows);
  }, [gridData]);

  const onRowAdd = newData =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        let data = [...gridData.data];

        if (!newData.nombre || !newData.nombre.trim()) {
          setNameError({
            error: true,
            label: "Requerido",
            helperText: "Este campo es requerido",
            validateInput: true,
          });
          reject();
          return;
        } else if (newData.nombre === '') {
          setNameError({
            error: true,
            label: "Requerido",
            helperText: "Este campo es requerido",
            validateInput: true,
          });
          reject();
          return;
        } else if (newData.nombre.length > 30) {
          setNameError({
            error: true,
            label: "Texto muy largo",
            helperText: "Máximo 30 carácteres",
            validateInput: true,
          });
          reject();
          return;
        }

        resolve();

        data.push({ id: data.length, nombre: newData.nombre });
        props.rows.push({ id: data.length, nombre: newData.nombre });

        setGridData({ ...gridData, data, resolve });
        setNameError({ error: false, label: "", helperText: "", validateInput: false,});
      }, 600)
    });

  const onRowUpdate = (newData, oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        // Copiar el estado actual de los datos en un array
        let data = [...gridData.data];

        if (!newData.nombre || !newData.nombre.trim()) {
          setNameError({
            error: true,
            label: "Requerido",
            helperText: "Este campo es requerido",
            validateInput: true,
          });
          reject();
          return;
        } else if (newData.nombre === '') {
          setNameError({
            error: true,
            label: "Requerido",
            helperText: "Este campo es requerido",
            validateInput: true,
          });
          reject();
          return;
        } else if (newData.nombre.length > 30) {
          setNameError({
            error: true,
            label: "Texto muy largo",
            helperText: "Máximo 30 carácteres",
            validateInput: true,
          });
          reject();
          return;
        }

        resolve();

        // Obtener el indice editado
        let index = data.indexOf(oldData);

        data[index] = { id: index + 1, nombre: newData.nombre };
        props.rows[index] = newData;

        setGridData({ ...gridData, data, resolve });
        setNameError({ error: false, label: "", helperText: "", validateInput: false,});
      }, 600);
    });

  const onRowDelete = oldData =>
    new Promise((resolve, reject) => {
      let data = [...gridData.data];
      let index = data.indexOf(oldData);

      data.splice(index, 1);
      props.rows.splice(index, 1);

      setGridData({ ...gridData, data, resolve });
    });

  return (
    <MaterialTable
      title={gridData.title}
      columns={cols}
      data={gridData.data}
      editable={{
        isEditable: rowData => true,
        isDeletable: rowData => true,
        onRowAdd: onRowAdd,
        onRowUpdate: onRowUpdate,
        onRowDelete: onRowDelete,
        onRowAddCancelled: rowData => setNameError({ error: false, label: "", helperText: "", validateInput: false, }),
        onRowUpdateCancelled: rowData => setNameError({ error: false, label: "", helperText: "", validateInput: false, }),
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
