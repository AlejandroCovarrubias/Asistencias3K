import React from 'react';
import '../style/App.css';

import DataTable from './DataTable.js';
import { RowCount } from '@material-ui/data-grid';

export default class ModalArchivo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    doTable = function (x) {
        //console.log(x);

        // Define las hileras

        var cols = [];
        var rows = [];
        // Primera hilera son los headers
        // Nombre
        cols.push({ field: 'nombre', headerName: 'Nombre del Alumno', width: 300 });

        // Sesiones
        x.sesiones.forEach(element => {
            console.log("Toy iterando")
            console.log(element)
            cols.push({ field: element.fechaSesion, headerName: element.fechaSesion, width: 150 });
        });

        // Ahora viene lo bueno, las hileras
        // Vamos a iterar por alumnos
        x.alumnos.forEach(function (alumno, index) {
            console.log("Iterando por alumnos " + index)
            var row = "{ \"id\":" + index + ", \"nombre\":\"" + alumno + "\"";
            // Itera por sesiones para ver en cuales esta
            x.sesiones.forEach(sesion => {
                if (sesion.asistentes.includes(alumno)) {
                    var fecha = ", \"" + sesion.fechaSesion + "\":\"✔\"";
                    row = row + fecha;
                } else {
                    var fecha = ", \"" + sesion.fechaSesion + "\":\"X\"";
                    row = row + fecha;
                }
            })
            // Termina el objeto
            row = row + " }"
            console.log(row)
            var rowN = JSON.parse(row)
            console.log(rowN)
            // Agrega al arreglo de hileras
            rows.push(rowN);
        })

        return (
            <div className="class">
                <div className="class-name">
                    <h5>{x.nombre}</h5>
                    <hr />
                </div>
                <div className="class-table">
                    <DataTable columns={cols} rows={rows} />
                </div>
            </div>
        )
    }

    checkClasses(){
        return this.props.clases.length > 0;
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
                        {!this.checkClasses() && 
                        <div className="no-classes">
                            <p>Parece que no hay clases en este curso.</p>
                        </div>
                        }
                        {this.props.clases.map(this.doTable)}
                    </div>
                </div>
            </div>
        )
    };
}