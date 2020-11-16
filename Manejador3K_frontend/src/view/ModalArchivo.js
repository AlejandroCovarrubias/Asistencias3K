import React from 'react';
import '../style/App.css';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';

import DragAndDrop from './DragAndDrop.js';
import DialogAlert from './DialogAlert.js';


const DEFAULTURL = 'http://localhost:8080';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class ModalArchivo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            indexEscogido: 0,
            indexEscogidoClases: 0,
            indexEscogidoSecciones: 0,
            isOpenDialogCursos: false,
            isOpenModalArchivos: false,
            isOpenAlert: false,
            tituloAlerta: "",
            mensajeAlerta: "",
            files: [{ "nombre": "" }], // Crashea si esta vacio esto xd
        };
        this.subirArchivo = this.subirArchivo.bind(this);
        this.handleCursosChange = this.handleCursosChange.bind(this);
        this.handleClasesChange = this.handleClasesChange.bind(this);
        this.handleSeccionesChange = this.handleSeccionesChange.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    doOptions = function (x) {
        return <option key={x.id}>{x.nombre}</option>
    };

    handleCursosChange = function (x) {
        const { selectedIndex } = x.target.options;

        this.setState({
            indexEscogido: selectedIndex,
        });
    };

    handleClasesChange = function (x) {
        const { selectedIndex } = x.target.options;

        this.setState({
            indexEscogidoClases: selectedIndex,
        });
    };

    handleSeccionesChange = function (x) {
        const { selectedIndex } = x.target.options;

        this.setState({
            indexEscogidoSecciones: selectedIndex,
        });
    };

    //Maneja los archivos
    handleDrop = (files) => {
        let fileList = this.state.files
        fileList = []

        console.log(files[0])
        fileList.push(files[0])

        this.setState({ files: fileList });
    }

    handleOpenAlert = () => {
        this.setState({
            isOpenAlert: true,
        });
    }

    handleClosingAlert() {
        this.setState({
            isOpenAlert: false,
        });
    }

    subirArchivo() {
        var curso = this.props.lista[this.state.indexEscogido]
        var idClase = curso.clases[this.state.indexEscogidoClases].id
        var idSeccion = curso.secciones[this.state.indexEscogidoSecciones].id
        //alert("Hola amigo, estas mandando al POST los siguientes datos:\nIDCURSO:"+idCurso+"\nIDCLASE:"+idClase+"\nIDSECCION:"+idSeccion+"\nARCHIVO:"+this.state.files[0].name)
        var file = this.state.files[0];

        // Leer el archivo y convertirlo a texto para mandarlo
        var lector = new FileReader()
        lector.readAsText(file)

        // Cacha error de lectura
        lector.onerror = function (e) {
            alert("Hubo un error con la lectura del documento.\n" + lector.error)
            lector.abort();
        }

        // Envia los datos cuando termine de leer el documento
        lector.onload = function (e) {

            const data = {
                idClase: idClase,
                idSeccion: idSeccion,
                archivo: lector.result
            }

            fetch(DEFAULTURL + '/asistencias', {
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
                        alert("Asistencias registradas correctamente.");
                    } else if (response.status === 404) {
                        alert("Error de busqueda" + "\nLa clase o seccion seleccionada no existen.");
                    }
                })
                .catch(
                    error => {
                        alert("Conexión Rechazada" + "\nLa conexión con el servidor ha sido rechazada. Intente nuevamente.");
                        console.log(error);
                    })
        }
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
                    maxWidth="sm"
                >
                    <DialogContent>
                        <div className="modal-container">
                            <div className='encabezado-dialog'>
                                <h2>Subir archivo de asistencia</h2>
                                <hr />
                            </div>

                            <DragAndDrop
                                handleDrop={this.handleDrop}
                                handleOpenAlert={this.handleOpenAlert}>
                                <div >
                                    <div >{this.state.files[0].name}</div>
                                </div>
                            </DragAndDrop>

                            <div className="drag-tool">
                                <div>ARRASTRA Y SUELTA EL ARCHIVO</div>
                            </div>

                            <div className="selects">
                                <div className="selects-options">
                                    <select
                                        className="drop"
                                        name="cursos"
                                        id="cursos"

                                        onChange={this.handleCursosChange}>
                                        {this.props.lista.map(this.doOptions)}
                                    </select>
                                    <select className="drop" name="clases" id="clases"
                                        onChange={this.handleClasesChange}>
                                        {this.props.lista[this.state.indexEscogido].clases.map(this.doOptions)}
                                    </select>
                                    <select className="drop" name="secciones" id="secciones"
                                        onChange={this.handleSeccionesChange}>
                                        {this.props.lista[this.state.indexEscogido].secciones.map(this.doOptions)}
                                    </select>
                                </div>
                            </div>

                            <div className="archivo-submit">
                                <button className="generic-button" onClick={this.subirArchivo}>SUBIR</button>
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
        )
    };
}