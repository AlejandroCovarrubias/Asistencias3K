import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
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
            <DialogActions>
                <button className="generic-button" onClick={this.props.closeAction}>RECARGAR PÁGINA</button>
            </DialogActions>
          </Dialog>
        </div>
      )
    }
}