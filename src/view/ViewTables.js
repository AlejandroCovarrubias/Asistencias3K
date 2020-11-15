import React from 'react';
import '../style/App.css';

import DataTable from './DataTable.js';

export default class ModalArchivo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    doTable = function (x) {
        console.log(x);
        // 
        // cols.push({ field: 'nombre', headerName: 'Nombre del Alumno', width: 300 });

        // console.log(x.sesiones);

        // for(var elm in x.sesiones){
        //     console.log(elm);
        //     cols.push({ field: "Aqui debe ir una fecha", headerName: "Aqui debe ir una fecha", width: 50 });
        // }


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
            cols.push({field:'fecha', headerName: element.fechaSesion, width: 150});
        });

        // Ahora viene lo bueno, las hileras
        // Vamos a iterar por alumnos
        // x.alumnos.forEach(alumno =>{
        //     row = []
        //     // Primer espacio es el nombre de alumno
        //     row.push({field: 'nombre', value:alumno.nombre});
        //     // Itera por sesiones para ver en cuales esta
        //     x.sesiones.forEach(sesion =>{
        //         if(sesion.asistentes.includes(alumno.nombre)){
        //             row.push()
        //         }
        //     })
        // })

        return (
            <div className="class">
                <div className="class-name">
                    <h5>{x.nombre}</h5>
                    <hr />
                </div>
                <div className="class-table">
                    <DataTable columns={cols} rows={rows}/>
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