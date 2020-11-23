import React from 'react';
import '../style/App.css';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';

import DragAndDrop from './DragAndDrop.js';
import DialogAlert from './DialogAlert.js';
import DialogConfirm from './DialogConfirm.js';


const DEFAULTURL = 'http://localhost:8080';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

var readedData = [];

export default class ModalArchivo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            indexEscogidoSecciones: 0,
            isOpenDialogCursos: false,
            isOpenModalArchivos: false,
            isOpenAlert: false,
            isOpenConfirm: false,
            tituloAlerta: "",
            mensajeAlerta: "",
            exito: false,
            files: [{ "name": "" }], // Crashea si esta vacio esto xd
            filesNames: [],
            problems: [],
        };
        this.subirArchivo = this.subirArchivo.bind(this);
        this.handleSeccionesChange = this.handleSeccionesChange.bind(this);
        this.handleClosingAlert = this.handleClosingAlert.bind(this);
        this.handleClosingConfirm = this.handleClosingConfirm.bind(this);
        this.openAlert = this.openAlert.bind(this);
        this.openConfirm = this.openConfirm.bind(this);
        this.confirmSubir = this.confirmSubir.bind(this);
        this.changeState = this.changeState.bind(this);
        this.resetStateAndCancel = this.resetStateAndCancel.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.readFileAsText = this.readFileAsText.bind(this);
    }

    doOptions = function (x) {
        return <option key={x.id} value={x.nombre}>{x.nombre}</option>
    };

    handleSeccionesChange = function (x) {
        const { selectedIndex } = x.target.options;

        this.setState({
            indexEscogidoSecciones: selectedIndex,
        });
    };

    //Maneja los archivos
    handleDrop = (files) => {
        let fileList = [];
        let fileListNames = [];

        for (var i = 0; i < files.length; i++) {
            if (!files[i].name) return
            fileListNames.push(files[i].name)
        }

        console.log(fileListNames)
        fileList.push(files)

        this.setState({ files: fileList, filesNames: fileListNames });
    }

    handleOpenAlert = () => {
        this.setState({
            isOpenAlert: true,
        });
    }

    subirArchivo() {
        this.setState({
            isOpenConfirm: false,
        })

        const openAlert = this.openAlert;
        const changeState = this.changeState;

        var curso = this.props.lista[this.props.indexCurso];

        if (curso.clases.length > 0 && curso.secciones.length > 0) {
            var idClase = curso.clases[this.props.indexClase].id
            var idSeccion = curso.secciones[this.state.indexEscogidoSecciones].id
            const archivos = this.state.files;

            if (archivos[0].length < 0) {
                this.openAlert("No se encontró ningun documento", "Arrastra un documento .CSV o cárgalo directamente.");
                return
            }

            // Guarda la lista de promesas de leer archivos, el resultado deberia ser un arreglo
            // de promesas con resultado de JSON con los datos a mandar con fetch
            var promesasArchivos = [];
            archivos[0].forEach( file =>{
                promesasArchivos.push(this.readFileAsText(file,idClase,idSeccion))
            })

            // Espera a que se hagan todas las promesas y da resultados con callback
            Promise.all(promesasArchivos).then((results) => {

                // Guarda la lista de promesas de fetch
                var promesasFetch = [];
                results.forEach(result => {
                    promesasFetch.push(
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
                            body: JSON.stringify(result),
                        })
                    )
                })
            
                // Espera a que se hagan todas las promesas y da resultados con callback
                Promise.all(promesasFetch).then(responses =>{

                    // Guarda la lista de promesas de lectura de resultados de fetch
                    var promesasData = [];

                    responses.forEach(response =>{

                        console.log(responses)

                        promesasData.push(new Promise((resolve, reject) => {
                            if (response.status === 200) {
                                resolve("La lista de asistencias ha sido registrada")
                            } else if (response.status === 404) {
                                resolve("La clase y seccion seleccionada no existe")
                            } else if (response.status === 418) {
                                response.text().then(data => {
                                    resolve(data)
                                })
                            }
                        }))                        
                    })

                    // Espera a que se hagan todas las promesas y da resultados con callback
                    Promise.all(promesasData).then(data =>{
                        
                        var newData = []

                        // Empareja nombres con data
                        archivos[0].forEach(function(archivo,index){
                            this.push(archivo.name +" : "+data[index])
                        },newData)

                        // Muestra resultados
                        console.log(newData)
                        openAlert("Resultados", "", newData);
                    });

                    
                })

                    // Promise.all(results.map(data => {
                        
                    // })).then(responses => {
                    //     return Promise.all(responses.map(response => {
                            
                    //     cambiar estado
                    // }).catch(error => {
                    //     openAlert("Conexión Rechazada", "La conexión con el servidor ha sido rechazada. Intente nuevamente.")
                    // })
                
            }).catch((error) => {
                alert("Error al leer los archivos. "+error)
            })


        } else {
            openAlert("Añade Clases y Secciones al Curso", "El Curso de " + this.props.lista[this.state.indexCurso].nombre + " no tiene Clases y/o Secciones asignadas.");
        }
    };

    readFileAsText(file, idClase, idSeccion) {
        return new Promise((resolve, reject) => {
            const lector = new FileReader();
            lector.onerror = reject;
            lector.onload = (e) => {
                var dat = {
                    idClase: idClase,
                    idSeccion: idSeccion,
                    archivo: lector.result
                }
                resolve(dat)
            }
            lector.readAsText(file);
        })
    }

    openAlert(title, content, contentList) {
        this.setState({
            tituloAlerta: title,
            mensajeAlerta: content,
            problems: contentList,
            isOpenAlert: true,
        });
    }

    openConfirm(title, content) {
        this.setState({
            isOpenConfirm: true,
        });
    }

    changeState() {
        this.setState({
            exito: true,
        })
    }

    resetStateAndCancel() {
        this.setState({
            isOpenDialogCursos: false,
            isOpenModalArchivos: false,
            isOpenAlert: false,
            tituloAlerta: "",
            mensajeAlerta: "",
            exito: false,
            files: [{ "name": "" }], // Crashea si esta vacio esto xd
            filesNames: [],
        })
        this.props.closeAction()
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

    handleClosingConfirm() {
        this.setState({
            isOpenConfirm: false,
        });
    }

    confirmSubir() {
        this.openConfirm("", "");
    }

    checkProperties() {
        return this.props.lista[this.props.indexCurso].clases[this.props.indexClase] === undefined;
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
                                <p> {!this.checkProperties() && this.props.lista[this.props.indexCurso].nombre + " > " + this.props.lista[this.props.indexCurso].clases[this.props.indexClase].nombre} </p>
                                <hr />
                            </div>

                            <DragAndDrop
                                handleDrop={this.handleDrop}
                                handleOpenAlert={this.handleOpenAlert}>
                                <div>
                                    {this.state.filesNames.map((file) => <div>{file}</div>)}
                                </div>
                            </DragAndDrop>

                            <div className="drag-tool">
                                <div>ARRASTRA Y SUELTA EL ARCHIVO</div>
                            </div>

                            <div className="selects">
                                <div className="selects-options">
                                    <p>Seleccionar sección</p>
                                    <select className="drop" name="secciones" id="secciones"
                                        onChange={this.handleSeccionesChange}>
                                        {this.props.lista[this.props.indexCurso].secciones.map(this.doOptions)}
                                    </select>
                                </div>
                            </div>

                            <div className="archivo-submit">
                                <button className="generic-button" onClick={this.confirmSubir}>SUBIR</button>
                                <button className="generic-button" onClick={this.resetStateAndCancel}>CANCELAR</button>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogAlert
                        open={this.state.isOpenAlert}
                        closeAction={this.handleClosingAlert}
                        title={this.state.tituloAlerta}
                        content={this.state.mensajeAlerta}
                        contentList={this.state.problems}
                        buttonText={"ACEPTAR"} />
                    <DialogConfirm
                        open={this.state.isOpenConfirm}
                        title={"¿Desea subir el siguiente contenido?"}
                        titleContent={!this.checkProperties() &&
                            this.props.lista[this.props.indexCurso].nombre + " > "
                            + this.props.lista[this.props.indexCurso].clases[this.props.indexClase].nombre + " > "
                            + this.props.lista[this.props.indexCurso].secciones[this.state.indexEscogidoSecciones].nombre}
                        contentList={this.state.filesNames}
                        yesAction={this.subirArchivo}
                        yesButtonText={"CONFIRMAR"}
                        noAction={this.handleClosingConfirm}
                        noButtonText={"CANCELAR"}
                    />
                </Dialog>
            </div>
        )
    };
}