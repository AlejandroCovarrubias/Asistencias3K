import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class DialogAlert extends React.Component {
  render(){
    return (
        <div>
          <Dialog
            open={this.props.open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{this.props.titulo}</DialogTitle>
            <DialogContent>
                <div>
                    {this.props.mensaje}
                </div>
            </DialogContent>
            <div className="dialog-actions">
    <button className="generic-button" onClick={this.props.closeAction}>{this.props.buttonText}</button>
            </div>
          </Dialog>
        </div>
      )
    }
}