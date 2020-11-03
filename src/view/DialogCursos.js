import React from 'react';
import '../style/App.css';

import EditableTable from './EditableTable.js';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class DialogCursos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionCols: [
                { field: 'nombre', title: 'Sección', width: 300 },
            ],

            sectionRows: [
                { id: 1, nombre: 'Unidad 1' },
                { id: 2, nombre: 'Unidad 2' },
                { id: 3, nombre: 'Unidad 3' },
                { id: 4, nombre: 'Unidad 4' },
            ],

            classCols: [
                { field: 'nombre', title: 'Clase', width: 300 },
            ],

            classRows: [
                { id: 1, nombre: 'Clase 1' },
                { id: 2, nombre: 'Clase 2' },
                { id: 3, nombre: 'Clase 3' },
                { id: 4, nombre: 'Clase 4' },
            ],
            isOpenDialogSecciones: false,
        };

        this.handleAddSection = this.handleAddSection.bind(this);
        this.handleClosingDialogSection = this.handleClosingDialogSection.bind(this);
        this.handleConcatSection = this.handleConcatSection.bind(this);
        this.handleAddClass = this.handleAddClass.bind(this);
    }

    handleAddSection() {
        this.setState({
          isOpenDialogSecciones: true,
        });
      }
    
    handleClosingDialogSection() {
        this.setState({ isOpenDialogCursos: false })
    }

    handleConcatSection(section) {
        this.setState({
            sectionRows: [...this.state.sectionRows, section]
        })
    }

    handleAddClass() {
        //Abrir Cuadro de Dialogo
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
                                        <input type="text" placeholder="Nombre del curso"></input>
                                    </div>
                                    <div className="cursos-secciones">
                                        <div className="cursos-secciones-contenido">
                                            <EditableTable title="Secciones del curso" rows={this.state.sectionRows} cols={this.state.sectionCols} />
                                        </div>
                                    </div>
                                </div>
                                <div className="cursos-right">
                                    <div className="cursos-clases">
                                        <div className="cursos-clases-contenido">
                                            <EditableTable title="Clases del curso" rows={this.state.classRows} cols={this.state.classCols} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="cursos-submit">
                                <button className="generic-button">REGISTRAR CURSO</button>
                                <button className="generic-button" onClick={this.props.closeAction}>CANCELAR</button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}
