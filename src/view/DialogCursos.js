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
            exito: false,
            tituloAlerta: "",
            mensajeAlerta: "",
            nuevoID: [],
        };

        this.handleClasesChange = this.handleClasesChange.bind(this);
        this.handleSeccionesChange = this.handleSeccionesChange.bind(this);
        this.handleClosingAlert = this.handleClosingAlert.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        var cursoE = document.getElementById('cursoNombre').value

        if(!cursoE || !cursoE.trim()){
            //cursoE es nulo, undefined, or contiene solo espacios
            this.abrirAlert("Hay un problema con el nombre del curso", "El curso debe tener nombre. Rellena el campo.")
        } else if (cursoE === "") {  
            this.abrirAlert("Hay un problema con el nombre del curso", "El curso debe tener nombre. Rellena el campo.")
        } else {
            this.postCurso(cursoE)
        }
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

    handleClosingAlert() {
        if (this.state.exito) {
            window.location.reload(false);
        } else {
            this.setState({
                exito: false,
                isOpenAlert: false,
            });
        }
    }

    postCurso(nombreCurso) {
        const data = {
            nombre: nombreCurso,
            secciones: this.state.secciones,
            clases: this.state.clases,
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
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        exito: true,
                    });
                    this.abrirAlert("Curso registrado exitosamente", "");
                } else if (response.status === 400) {
                    this.abrirAlert("Curso repetido", "Ya existe un curso con ese nombre.");
                }
            })
            .catch(
                error => console.log(error));
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
                        mensaje={this.state.mensajeAlerta}
                        buttonText={"ACEPTAR"} />
                </Dialog>
            </div>
        );
    }
}
