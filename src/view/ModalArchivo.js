import React from 'react';
import '../style/App.css';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';

import DragAndDrop from './DragAndDrop.js';
import DialogAlert from './DialogAlert.js';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class ModalArchivo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            indexEscogido: 0,
            isOpenDialogCursos: false,
            isOpenModalArchivos: false,
            isOpenAlert: false,
            files: [],
        };
        this.handleCursosChange = this.handleCursosChange.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    doOptions = function (x) {
        return <option key={x.nombre}>{x.nombre}</option>
    };

    handleCursosChange = function (x) {
        const { selectedIndex } = x.target.options;

        this.setState({
            indexEscogido: selectedIndex,
        });
    };

    //Maneja los archivos
    handleDrop = (files) => {
        let fileList = this.state.files
        fileList = []

        console.log(files[0])
        fileList.push(files[0].name)

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
                                    <div >{this.state.files[0]}</div>
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
                                    <select className="drop" name="clases" id="clases" >
                                        {this.props.lista[this.state.indexEscogido].clases.map(this.doOptions)}
                                    </select>
                                    <select className="drop" name="secciones" id="secciones" >
                                        {this.props.lista[this.state.indexEscogido].secciones.map(this.doOptions)}
                                    </select>
                                </div>
                            </div>

                            <div className="archivo-submit">
                                <button className="generic-button">SUBIR</button>
                                <button className="generic-button" onClick={this.props.closeAction}>CANCELAR</button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        )
    };
}