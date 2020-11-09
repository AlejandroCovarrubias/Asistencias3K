import React from 'react';
import '../style/App.css';

import EditableTable from './EditableTable.js';
import DialogAlert from './DialogAlert.js';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';

const DEFAULTURL = 'http://localhost:8080';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class DialogCursos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre: "",
            secciones: [],
            clases: [],

            sectionCols: [
                { field: 'nombre', title: 'Sección', width: 300 },
            ],

            classCols: [
                { field: 'nombre', title: 'Clase', width: 300 },
            ],
            isOpenAlert: false,
            isOpenAlertExito: false,
            tituloAlerta: "",
            mensajeAlerta: "",
        };

        this.handleClasesChange = this.handleClasesChange.bind(this);
        this.handleSeccionesChange = this.handleSeccionesChange.bind(this);
        this.handleClosingAlert = this.handleClosingAlert.bind(this);
        this.handleClosingAlertExito = this.handleClosingAlertExito(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        var cursoE = document.getElementById('cursoNombre').value

        console.log(cursoE);
        console.log(this.state.clases);
        console.log(this.state.secciones);

        this.postCurso(cursoE)
    }

    handleClasesChange(clasesData) {
        this.setState({
            clases: clasesData,
        });
    }

    handleSeccionesChange(seccionesData) {
        this.setState({
            secciones: seccionesData,
        });
    }

    abrirAlert(titulo, mensaje) {
        this.setState({
            tituloAlerta: titulo,
            mensajeAlerta: mensaje,
            isOpenAlert: true,
        });
    }

    abrirAlertExito(titulo, mensaje) {
        this.setState({
            tituloAlerta: titulo,
            mensajeAlerta: mensaje,
            isOpenAlertExito: true,
        });
    }

    handleClosingAlert() {
        this.setState({
            isOpenAlert: false,
        });
    }

    handleClosingAlertExito() {
        this.setState({
            isOpenAlertExito: false,
            nombre: "",
            secciones: [],
            clases: [],
        });

        this.props.closeAction();
    }

    postCurso(nombreCurso) {
        const data = {
            nombre: nombreCurso,
            secciones: [],
            clases: [],
        }

        fetch(DEFAULTURL + '/cursos', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(
                response => response.json()
            )
            .then(
                data => this.postSecciones(data[0])
            )
            .catch(
                error => this.abrirAlert("Conexión Rechazada", "La conexión con el servidor ha sido rechazada."));
    }

    postSecciones(curso) {
        if (this.state.secciones.length > 0) {
            var newRoute = '/secciones/' + curso.id;

            fetch(DEFAULTURL + newRoute, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.secciones),
            })
                .then(
                    data => this.postClases(curso)
                )
                .catch(
                    error => this.abrirAlert("Conexión Rechazada", "La conexión con el servidor ha sido rechazada. Cursos"));
        } else {
            this.postClases(curso)
        }
    }

    postClases(curso) {
        if (this.state.clases.length > 0) {
            var newRoute = '/clases/' + curso.id;

            fetch(DEFAULTURL + newRoute, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.clases),
            })
                .then(
                    this.abrirAlertExito("Curso registrado con exito")
                )
                .catch(
                    error => this.abrirAlert("Conexión Rechazada", "La conexión con el servidor ha sido rechazada."));
        }
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    fullWidth={true}
                    maxWidth="lg"
                >
                    <DialogContent>
                        <div className="dialog-container">
                            <div className='encabezado-dialog'>
                                <h2>{this.props.taskName}</h2>
                                <hr />
                            </div>
                            <div className="cursos-form">
                                <div className="cursos-left">
                                    <div className="cursos-nombre">
                                        <input
                                            type="text"
                                            placeholder="Nombre del curso"
                                            id="cursoNombre"
                                        ></input>
                                    </div>
                                    <div className="cursos-secciones">
                                        <div className="cursos-secciones-contenido">
                                            <EditableTable
                                                title="Secciones del curso"
                                                rows={this.state.secciones}
                                                cols={this.state.sectionCols}
                                                handleChange={this.handleSeccionesChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="cursos-right">
                                    <div className="cursos-clases">
                                        <div className="cursos-clases-contenido">
                                            <EditableTable
                                                title="Clases del curso"
                                                rows={this.state.clases}
                                                cols={this.state.classCols}
                                                handleChange={this.handleClasesChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="cursos-submit">
                                <button className="generic-button" onClick={this.onSubmit}>REGISTRAR CURSO</button>
                                <button className="generic-button" onClick={this.props.closeAction}>CANCELAR</button>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogAlert
                        open={this.state.isOpenAlert}
                        closeAction={this.handleClosingAlert}
                        titulo={this.state.tituloAlerta}
                        mensaje={this.state.mensajeAlerta} />
                    <DialogAlert
                        open={this.state.isOpenAlertExito}
                        closeAction={this.handleClosingAlertExito}
                        titulo={this.state.tituloAlerta}
                        mensaje={this.state.mensajeAlerta} />
                </Dialog>
            </div>
        );
    }
}
