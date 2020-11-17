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
        const supportedFilesTypes = ['text/csv', 'application/vnd.ms-excel'];
        const { type } = e.dataTransfer.files[0];

        console.log(type);
        if (supportedFilesTypes.indexOf(type) > -1) {
            //Lee el archivo
            const reader = new FileReader();
            reader.readAsDataURL(e.dataTransfer.files[0])

            e.preventDefault()
            e.stopPropagation()
            this.setState({ drag: false })
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                this.props.handleDrop(e.dataTransfer.files)
                e.dataTransfer.clearData()
                this.dragCounter = 0
            }
        } else {
            //Hacer que te de el mensaje
            this.handleOpenAlert();
            e.preventDefault()
            e.stopPropagation()
            this.setState({ drag: false })
        }
    }

    handleFileUpload(e) {
        var fil = e.target.files[0];
        
        console.log(fil);
        if (fil !== undefined) {
            const supportedFilesTypes = ['text/csv', 'application/vnd.ms-excel'];
            const { type } = fil;

            //console.log(type);
            if (supportedFilesTypes.indexOf(type) > -1) {
                //Lee el archivo
                const reader = new FileReader();
                reader.readAsDataURL(e.target.files[0])


                //Cambiar de sitio
                const payload = new FormData();
                payload.append('file', e.target.files[0]);

                const xhr = new XMLHttpRequest();

                xhr.open('POST', 'http://localhost:8080/uploadFile');
                xhr.send(payload);

                e.preventDefault()
                e.stopPropagation()
                this.setState({ drag: false })
                if (e.target.files && e.target.files.length > 0) {
                    this.props.handleDrop(e.target.files)
                    this.dragCounter = 0
                }
            } else {
                //Hacer que te de el mensaje
                this.handleOpenAlert();
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

    handleOpenAlert = () => {
        this.setState({
            isOpenAlert: true,
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
                    <input type="file" hidden ref={this.inputReference} onChange={this.fileUploadInputChange} />
                    <button className="upload-button" onClick={this.fileUploadAction}>
                        SUBIR ARCHIVO
                    </button>
                </div>
                <DialogAlert
                    open={this.state.isOpenAlert}
                    closeAction={this.handleClosingAlert}
                    titulo={"Formato de Archivo no permitido"}
                    mensaje={"Formatos Permitidos: CSV"}
                    buttonText={"ACEPTAR"} />
            </div>
        )
    }
}