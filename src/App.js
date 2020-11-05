import React from 'react';
import './style/App.css';
import DialogCursos from './view/DialogCursos.js';
import ModalArchivo from './view/ModalArchivo.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listaCursos: [
        {
          nombre: 'METODOLOGIAS AGILES DE DESARROLLO',
          secciones: [],
          clases: [],
        },
        {
          nombre: 'ARQUITECTURAS EMPRESARIALES',
          secciones: [],
          clases: [],
        },
        {
          nombre: 'DISEÑIO DE SOFTWARE',
          secciones: [],
          clases: [],
        },

      ],
      isOpenDialogCursos: false,
      isOpenModalArchivos: false,
    };

    this.abrirDialogoCursos = this.abrirDialogoCursos.bind(this);
    this.abrirModalArchivos = this.abrirModalArchivos.bind(this);
    this.handleClosingDialog = this.handleClosingDialog.bind(this);
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

  handleClosingDialog() {
    this.setState({ 
      isOpenDialogCursos: false,
      isOpenModalArchivos: false, 
    })
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
        <DialogCursos open={this.state.isOpenDialogCursos} closeAction={this.handleClosingDialog} taskName={'Registrar Curso'} />
        <ModalArchivo open={this.state.isOpenModalArchivos} closeAction={this.handleClosingDialog} />
      </div>
    );
  }
}

export default App;