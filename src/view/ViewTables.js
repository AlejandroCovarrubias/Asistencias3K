import React from 'react';
import '../style/App.css';

import DataTable from './DataTable.js';

export default class ModalArchivo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    doRows(x, y) {

    }

    doTable = function (x) {
        console.log(x);
        var cols = [];
        cols.push({ field: 'nombre', headerName: 'Nombre del Alumno', width: 300 });

        console.log(x.sesiones);

        for(var elm in x.sesiones){
            console.log(elm);
            cols.push({ field: "Aqui debe ir una fecha", headerName: "Aqui debe ir una fecha", width: 50 });
        }

        console.log(cols);

        //var rows = doRows(x.alumnos, x.sesiones);
        var rows = [];

        return (
            <div className="class">
                <div className="class-name">
                    <h5>{x.nombre}</h5>
                    <hr />
                </div>
                <div className="class-table">
                    <DataTable cols={cols} rows={rows}/>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="cursoTitulo">
                        <h3>{this.props.nombre}</h3>
                        <hr />
                    </div>
                    <div className="tables-container">
                        {this.props.clases.map(this.doTable)}
                    </div>
                </div>
            </div>
        )
    };
}