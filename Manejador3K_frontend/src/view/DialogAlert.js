import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class DialogAlert extends React.Component {

  doContentList(x) {
    return <li>{x}</li>
  }

  checkContentList(){
    return this.props.contentList !== undefined;
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            <h5>{this.props.titleContent}</h5>
            <p>{this.props.subtitle}</p>
            <div>
              {this.props.content}
            </div>

            <div>
              <ul>
                {this.checkContentList() && this.props.contentList.map(this.doContentList)}
              </ul>
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