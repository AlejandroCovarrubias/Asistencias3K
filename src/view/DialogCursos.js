import React from 'react';
import '../style/App.css';

import DialogTable from './DialogTable.js';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';

import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogCursos({open, closeAction, taskName, curso}) {
    return (
        <div>
            <Dialog 
                open={open}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                fullWidth={true}
                maxWidth={"xl"}
                >

                <DialogContent>
                    <div className="dialog-container">
                        <div className='encabezado-dialog'>
                            <h2>{taskName}</h2>
                            <hr/>
                        </div>
                        <div className="cursos-form">
                            <div className="cursos-left">
                                <div className="cursos-nombre">
                                    <input type="text" placeholder="NOMBRE DEL CURSO"></input>
                                </div>
                                <div className="cursos-secciones">
                                    <div className="cursos-secciones-encabezado">
                                        <div className="cursos-secciones-left">Secciones del Curso</div>
                                        <div className="cursos-secciones-right">
                                            <DeleteForeverIcon/>
                                            <EditIcon/>
                                            <AddBoxIcon/>
                                        </div>
                                    </div>
                                    <div className="cursos-secciones-contenido">
                                        <DialogTable />
                                    </div>
                                </div>
                                <div className="cursos-clases">
                                    <div className="cursos-clases-encabezado">
                                        <div className="cursos-clases-left">Clases del Curso</div>
                                        <div className="cursos-clases-right">
                                            <DeleteForeverIcon/>
                                            <EditIcon/>
                                            <AddBoxIcon/>
                                        </div>
                                    </div>
                                    <div className="cursos-clases-contenido">

                                    </div>
                                </div>
                            </div>
                            <div className="cursos-right">
                                
                            </div>
                        </div>
                        <div className="cursos-submit">
                            <button className="generic-button">REGISTRAR CURSO</button>
                            <button className="generic-button" onClick={closeAction}>CANCELAR</button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
