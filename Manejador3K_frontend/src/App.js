import React from 'react';
import './style/App.css';
import DialogCursos from './view/DialogCursos.js';
import ModalArchivo from './view/ModalArchivo.js';
import DialogAlert from './view/DialogAlert.js';
import ViewTables from './view/ViewTables.js';

import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddBoxIcon from '@material-ui/icons/AddBox';

const DEFAULTURL = 'http://localhost:8080';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curso: {},
      listaCursos: [
        {
          id: 0,
          nombre: '',
          secciones: [],
          clases: [],
        },
      ],
      isOpenDialogCursos: false,
      isOpenModalArchivos: false,
      isOpenAlert: false,
      isCursosNotEmpty: false,
      tituloAlerta: "",
      mensajeAlerta: "",
      botonAlerta: "",
      indexEscogido: 0,
    };

    this.abrirDialogoCursos = this.abrirDialogoCursos.bind(this);
    this.abrirModalArchivos = this.abrirModalArchivos.bind(this);
    this.abrirAlert = this.abrirAlert.bind(this);
    this.handleClosingDialog = this.handleClosingDialog.bind(this);
    this.handleClosingAlert = this.handleClosingAlert.bind(this);
    this.handleChangeCursoEscogido = this.handleChangeCursoEscogido.bind(this);
  }

  componentDidMount() {
    this.fetchCursos();
  }

  fetchCursos() {
    //buscar por id de usuario, cuando haya usuarios
    fetch(DEFAULTURL + '/cursos', {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    })
      .then(
        response => response.json())
      .then(data => {
        if (data.length > 0) {
          this.setState({ listaCursos: data, isCursosNotEmpty: true });
        }
      })
      .catch(
        error => this.abrirAlert("Conexión Rechazada", "La conexión con el servidor ha sido rechazada. Intente nuevamente recargando la página.", "RECARGAR PÁGINA"));
  }

  doOptions = function (x) {
    return <option key={x.id}>{x.nombre}</option>
  };

  abrirDialogoCursos() {
    this.setState({
      isOpenDialogCursos: true,
    });
  }

  abrirModalArchivos() {
    if (this.state.isCursosNotEmpty) {
      this.setState({
        isOpenModalArchivos: true,
      });
    }else{
      this.abrirAlert("No se encontraron Cursos registrados", "Registra un Curso en el sistema para poder cargar asistencias.", "ACEPTAR");
    }
  }

  abrirAlert(titulo, mensaje, boton) {
    this.setState({
      tituloAlerta: titulo,
      mensajeAlerta: mensaje,
      botonAlerta: boton,
      isOpenAlert: true,
    });
  }

  handleClosingDialog() {
    this.setState({
      isOpenDialogCursos: false,
      isOpenModalArchivos: false,
    });

    this.fetchCursos();
  }

  handleClosingAlert() {
    this.setState({
      isOpenAlert: false,
    });

    this.fetchCursos();
  }

  handleChangeCursoEscogido = function (x) {
    const { selectedIndex } = x.target.options;
    this.setState({
      indexEscogido: selectedIndex,
    })

    console.log(this.state.listaCursos[this.state.indexEscogido]);
  };

  render() {
    return (
      <div className="app3000">
        <header className="encabezado">
          <h2>Manejador de Asistencias 3000</h2>
          <hr />
        </header>

        <div className="menu">
          <div className="dropApp">
            <select className="dropCursos" name="cursos" id="cursos" onChange={this.handleChangeCursoEscogido}>
              {this.state.listaCursos.map(this.doOptions)}
            </select>
            <p>Selecciona el curso que deseas Editar, Eliminar o Filtrar</p>
          </div>
          <div className="filter-options">
            <button className="icon-button" onClick={this.abrirDialogoCursos}>
              <AddBoxIcon />
              Registrar
            </button>
            <button className="icon-button">
              <EditIcon />
              Editar
            </button>
            <button className="icon-button">
              <DeleteForeverIcon />
              Eliminar
            </button>
            <button className="generic-button">BUSQUEDA FILTRADA</button>
          </div>
          <div className="files">
            <button className="generic-button" onClick={this.abrirModalArchivos}>SUBIR ARCHIVO DE ASISTENCIAS</button>
          </div>
        </div>

        <div>
          <ViewTables
            clases={this.state.listaCursos[this.state.indexEscogido].clases}
            nombre={this.state.listaCursos[this.state.indexEscogido].nombre} />
        </div>

        <DialogCursos
          open={this.state.isOpenDialogCursos}
          closeAction={this.handleClosingDialog}
          taskName={'Registrar Curso'} />
        <ModalArchivo
          open={this.state.isOpenModalArchivos}
          closeAction={this.handleClosingDialog}
          lista={this.state.listaCursos} />
        <DialogAlert
          open={this.state.isOpenAlert}
          closeAction={this.handleClosingAlert}
          titulo={this.state.tituloAlerta}
          mensaje={this.state.mensajeAlerta}
          buttonText={this.state.botonAlerta} />
      </div>
    );
  }
}

export default App;