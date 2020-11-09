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
            nombre: "",
            secciones: [],
            clases: [],

            sectionCols: [
                { field: 'nombre', title: 'Sección', width: 300 },
            ],

            classCols: [
                { field: 'nombre', title: 'Clase', width: 300 },
            ],
        };

        this.handleClasesChange = this.handleClasesChange.bind(this);
        this.handleSeccionesChange = this.handleSeccionesChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event){
        event.preventDefault();
        var cursoE = document.getElementById('cursoNombre').value
        console.log(cursoE);
        console.log(this.state.clases);
        console.log(this.state.secciones);
    }

    handleClasesChange(clasesData){
        this.setState({
            clases: clasesData,
        });
    }
    
    handleSeccionesChange(seccionesData){
        this.setState({
            secciones: seccionesData,
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
                                                handleChange={ this.handleSeccionesChange } />
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
                                                handleChange={ this.handleClasesChange } />
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
                </Dialog>
            </div>
        );
    }
}
