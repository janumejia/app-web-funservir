import React, { Component } from 'react'
import {DropzoneDialog} from 'material-ui-dropzone'
import Button from '@material-ui/core/Button';

import { BsUpload } from "react-icons/bs"; // Para usr iconos en React. Documentación https://react-icons.github.io/react-icons

// Sacado de https://www.npmjs.com/package/react-mui-dropzone
export default class DropzoneDialogComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            files: []
        };
    }

    handleClose() {
        this.setState({
            open: false
        });
    }

    handleSave(files) {
        //Saving files to state for further use and closing Modal.
        this.setState({
            files: files,
            open: false
        });
    }

    handleOpen() {
        this.setState({
            open: true,
        });
    }

    render() {
        return (
            <div>
                Adjuntar RUT de la empresa:
                <Button onClick={this.handleOpen.bind(this)}>
                  <BsUpload />
                </Button>
                <DropzoneDialog
                    open={this.state.open}
                    onSave={this.handleSave.bind(this)}
                    acceptedFiles={['application/pdf']}
                    showPreviews={true}
                    maxFileSize={2097152}
                    filesLimit={1}
                    onClose={this.handleClose.bind(this)}
                > 
                Arrastra y suelta tu archivo aquí
                </DropzoneDialog>
            </div>
        );
    }
}