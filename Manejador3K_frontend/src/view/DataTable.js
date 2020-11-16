import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

export default class DataTable extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      };
    }

      render() {
        return(
          <div style={{ height: 650, width: '100%' }}>
            <DataGrid size='small' rows={this.props.rows} columns={this.props.columns} headerHeight={35} rowHeight={30} />
          </div>
        );
    }
  }

