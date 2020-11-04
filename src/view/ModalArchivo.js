import React from 'react';
import '../style/App.css';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';

import DragAndDrop from './DragAndDrop.js'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class ModalArchivo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            listaCursos: [
                {
                    nombre: 'METODOLOGIAS AGILES DE DESARROLLO',
                    secciones: [
                        { nombre: 'UNIDAD 1' },
                        { nombre: 'UNIDAD 2' },
                        { nombre: 'UNIDAD 3' }],
                    clases: [
                        { nombre: 'CLASE 10AM' },
                        { nombre: 'CLASE 11AM' },
                        { nombre: 'CLASE 12AM' }],
                },
                {
                    nombre: 'ARQUITECTURAS EMPRESARIALES',
                    secciones: [
                        { nombre: 'SECCIÓN 1' },
                        { nombre: 'SECCIÓN 2' },
                        { nombre: 'SECCIÓN 3' }],
                    clases: [
                        { nombre: 'CLASE 3PM' },
                        { nombre: 'CLASE 4PM' },
                        { nombre: 'CLASE 5PM' }],
                },
                {
                    nombre: 'DISEÑIO DE SOFTWARE',
                    secciones: [
                        { nombre: 'PARCIAL 1' },
                        { nombre: 'PARCIAL 2' },
                        { nombre: 'PARCIAL 3' }],
                    clases: [
                        { nombre: 'CLASE 15:30' },
                        { nombre: 'CLASE 17:00' },
                        { nombre: 'CLASE 20:00' }],
                },

            ],
            indexEscogido: 0,
            isOpenDialogCursos: false,
            isOpenModalArchivos: false,
            files: [],
        };
        this.handleCursosChange = this.handleCursosChange.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    //Para obtener data de una API
    //componentDidMount () {
    //    fetch("http://localhost/dashboard/?action=unassignedUsers.getUnassingedUsers", {
    //        credentials: 'same-origin'
    //    })
    //    .then(response => response.json())
    //    .then( (json) => {
    //        this.setState({
    //            data: json
    //        });
    //    });
    //}

    doOptions = function (x) {
        return <option key={x.nombre}>{x.nombre}</option>
    };

    handleCursosChange = function (x) {
        const { selectedIndex } = x.target.options;

        this.setState({
            indexEscogido: selectedIndex,
        });

        console.log(this.state.listaCursos[this.state.indexEscogido]);
    };

    //Maneja los archivos
    handleDrop = (files) => {
        let fileList = this.state.files
        fileList = []

        console.log(files[0])
        fileList.push(files[0].name)

        this.setState({ files: fileList });
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

                            <DragAndDrop handleDrop={this.handleDrop}>
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
                                        {this.state.listaCursos.map(this.doOptions)}
                                    </select>
                                    <select className="drop" name="clases" id="clases" >
                                        {this.state.listaCursos[this.state.indexEscogido].clases.map(this.doOptions)}
                                    </select>
                                    <select className="drop" name="secciones" id="secciones" >
                                        {this.state.listaCursos[this.state.indexEscogido].secciones.map(this.doOptions)}
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