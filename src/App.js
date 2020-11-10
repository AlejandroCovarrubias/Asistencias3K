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
          nombre: '',
          secciones: [],
          clases: [],
        },
      ],
      isOpenDialogCursos: false,
      isOpenModalArchivos: false,
      isOpenAlert: false,
      tituloAlerta: "",
      mensajeAlerta: "",
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
      .then( data => {
        if(data.length > 0){
          this.setState({ listaCursos: data })
        }
      })
      .catch(
        error => this.abrirAlert("Conexión Rechazada", "La conexión con el servidor ha sido rechazada. Intente nuevamente recargando la página."));
  }

  doOptions = function (x) {
    return <option key={x.nombre}>{x.nombre}</option>
  };

  abrirDialogoCursos() {
    this.setState({
      isOpenDialogCursos: true,
    });
  }

  abrirModalArchivos() {
    this.setState({
      isOpenModalArchivos: true,
    });
  }

  abrirAlert(titulo, mensaje) {
    this.setState({
      tituloAlerta: titulo,
      mensajeAlerta: mensaje,
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
    const {selectedIndex} = x.target.options;
    this.setState({
      indexEscogido: selectedIndex,
    })
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
            <a>Selecciona el curso que deseas Editar, Eliminar o Filtrar</a>
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
          <ViewTables />
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
          buttonText={"ACTUALIZAR PÁGINA"} />
      </div>
    );
  }
}

export default App;