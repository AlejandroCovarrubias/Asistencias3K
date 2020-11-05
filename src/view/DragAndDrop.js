import React from 'react';

export default class DragAndDrop extends React.Component {
    state = {
        drag: false
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

            const payload = new FormData();
            payload.append('file', e.dataTransfer.files[0]);

            const xhr = new XMLHttpRequest();

            xhr.open('POST', 'http://localhost:8080/uploadFile');
            xhr.send(payload);

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
            alert('No es del tipo indicado')
            e.preventDefault()
            e.stopPropagation()
            this.setState({ drag: false })
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

    render() {
        return (
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
        )
    }
}