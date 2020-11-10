import React from 'react';
import './style/App.css';
import DialogCursos from './view/DialogCursos.js';
import ModalArchivo from './view/ModalArchivo.js';
import DialogAlert from './view/DialogAlert.js';

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
    };

    this.abrirDialogoCursos = this.abrirDialogoCursos.bind(this);
    this.abrirModalArchivos = this.abrirModalArchivos.bind(this);
    this.abrirAlert = this.abrirAlert.bind(this);
    this.handleClosingDialog = this.handleClosingDialog.bind(this);
    this.handleClosingAlert = this.handleClosingAlert.bind(this);
  }

  componentDidMount(){
    this.fetchCursos();
  }

  fetchCursos(){
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
    .then(
      data => this.setState({listaCursos: data}))
    .catch(
      error => this.abrirAlert("Conexión Rechazada","La conexión con el servidor ha sido rechazada. Intente nuevamente recargando la página."));
  }

  doOptions = function (x) {
    return <option key={x.nombre}>{x.nombre}</option>
  };

  abrirDialogoCursos() {
    this.setState({
      isOpenDialogCursos: true,
    });
  }

  abrirModalArchivos(){
    this.setState({
      isOpenModalArchivos: true,
    });
  }

  abrirAlert(titulo, mensaje){
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

  handleClosingAlert(){
    this.setState({
      isOpenAlert: false,
    });

    this.fetchCursos();
  }

  render() {
    return (
      <div className="app3000">
        <header className="encabezado">
          <h2>Manejador de Asistencias 3000</h2>
          <hr />
        </header>

        <div className="menu">
          <div className="left">
            <button className="generic-button" onClick={this.abrirDialogoCursos}>REGISTRAR CURSO</button>
            <button className="generic-button">VER CURSOS</button>
          </div>
          <div className="right">
            <button className="generic-button" onClick={this.abrirModalArchivos}>SUBIR ARCHIVO DE ASISTENCIAS</button>
          </div>
        </div>

        <div className="filters">
          <div className="filter-options">
            <select className="dropCursos" name="cursos" id="cursos">
              {this.state.listaCursos.map(this.doOptions)}
            </select>
            <button className="generic-button">BUSQUEDA FILTRADA</button>
          </div>
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
          mensaje={this.state.mensajeAlerta}/>
      </div>
    );
  }
}

export default App;