import React from 'react';
import '../style/App.css';

import DataTable from './DataTable.js';

export default class ModalArchivo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curso: this.props.cursoEscodigo,
        };
    }

    doTable = function (x){
    return ( 
        <div className="class">
            <div className="class-name">
                <h5>{x.nombre}</h5>
                <hr />
            </div>
            <div className="class-table">
                <DataTable />
            </div>
        </div>
    )}

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