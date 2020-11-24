import React from 'react';

import DialogAlert from './DialogAlert.js';

export default class DragAndDrop extends React.Component {

    constructor(props) {
        super(props);
        this.state = { fileUploadState: "" }
        this.inputReference = React.createRef();

        this.state = {
            drag: false,
            isOpenAlert: false,
            invalidNames: [],
        }

        this.handleClosingAlert = this.handleClosingAlert.bind(this);
    }

    dropRef = React.createRef()

    handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    handleDragIn = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter++
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({ drag: true })
        }
    }

    handleDragOut = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter--
        if (this.dragCounter === 0) {
            this.setState({ drag: false })
        }
    }

    handleDrop = (e) => {
        var fil = e.dataTransfer.files;
        var validFil = [];
        var invalidFil = [];

        console.log(fil);

        if(fil !== undefined){
            const supportedFilesTypes = ['text/csv', 'application/vnd.ms-excel'];

            for (var i = 0; i < fil.length; i++) {
                const { type } = fil[i];

                if (supportedFilesTypes.indexOf(type) > -1) {
                    //Lo agrega a la nueva lista
                    validFil.push(fil[i]);
                } else {
                    invalidFil.push(fil[i]);
                }
            }

            if(invalidFil.length > 0){
                this.handleOpenAlert(invalidFil);
            }

            e.preventDefault();
            e.stopPropagation();
            this.setState({ drag: false })
            if (validFil && validFil.length > 0) {
                this.props.handleDrop(validFil)
                e.dataTransfer.clearData();
                this.dragCounter = 0
            }
        }
    }

    handleFileUpload(e) {
        var fil = e.target.files;
        var validFil = [];
        var invalidFil = [];

        console.log(fil);
        if (fil !== undefined) {
            const supportedFilesTypes = ['text/csv', 'application/vnd.ms-excel'];

            for (var i = 0; i < fil.length; i++) {
                const { type } = fil[i];

                if (supportedFilesTypes.indexOf(type) > -1) {
                    //Lo agrega a la nueva lista
                    validFil.push(fil[i]);
                } else {
                    invalidFil.push(fil[i]);
                }
            }

            if(invalidFil.length > 0){
                this.handleOpenAlert(invalidFil);
            }

            e.preventDefault()
            e.stopPropagation()
            this.setState({ drag: false })
            if (validFil && validFil.length > 0) {
                this.props.handleDrop(validFil)
                this.dragCounter = 0
            }
        }
    }

    componentDidMount() {
        let div = this.dropRef.current
        div.addEventListener('dragenter', this.handleDragIn)
        div.addEventListener('dragleave', this.handleDragOut)
        div.addEventListener('dragover', this.handleDrag)
        div.addEventListener('drop', this.handleDrop)
    }

    componentWillUnmount() {
        let div = this.dropRef.current
        div.removeEventListener('dragenter', this.handleDragIn)
        div.removeEventListener('dragleave', this.handleDragOut)
        div.removeEventListener('dragover', this.handleDrag)
        div.removeEventListener('drop', this.handleDrop)
    }

    fileUploadAction = () => this.inputReference.current.click();
    fileUploadInputChange = (e) => this.handleFileUpload(e);

    handleOpenAlert = (invalidFils) => {
        var invalidFilsNames = [];

        for (var i = 0; i < invalidFils.length; i++) {
            invalidFilsNames.push(invalidFils[i].name);
        }

        this.setState({
            isOpenAlert: true,
            invalidNames: invalidFilsNames,
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
                <div className="drag-area"
                    ref={this.dropRef}
                >
                    {this.state.drag &&
                        <div className="drag-area-dragged">
                            <div className="drag-area-dragged-top">
                                <div>SUBE EL ARCHIVO AQUÍ</div>
                            </div>
                        </div>
                    }
                    {this.props.children}
                </div>
                <div className="upload-section">
                    <input type="file" hidden ref={this.inputReference} onChange={this.fileUploadInputChange} multiple="multiple"/>
                    <button className="upload-button" onClick={this.fileUploadAction}>
                        SUBIR ARCHIVO
                    </button>
                </div>
                <DialogAlert
                    open={this.state.isOpenAlert}
                    closeAction={this.handleClosingAlert}
                    title={"Formato de Archivo no permitido"}
                    titleContent={"Formatos permitidos: CSV"}
                    subtitle={"Los siguientes archivos tienen un formato no permitido:"}
                    contentList={this.state.invalidNames}
                    buttonText={"ACEPTAR"} />
            </div>
        )
    }
}