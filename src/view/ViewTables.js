import React from 'react';
import '../style/App.css';

export default class ModalArchivo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="cursoTitulo">
                        {this.props.cursoEscogido}
                    </div>
                </div>
            </div>
        )
    };
}