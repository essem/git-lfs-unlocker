import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

function getSorting(order, orderBy) {
  if (order === 'desc') {
    return (a, b) => {
      if (b[orderBy] === a[orderBy]) {
        return b['id'] < a['id'] ? -1 : 1;
      }
      return b[orderBy] < a[orderBy] ? -1 : 1;
    };
  } else {
    return (a, b) => {
      if (a[orderBy] === b[orderBy]) {
        return a['id'] < b['id'] ? -1 : 1;
      }
      return a[orderBy] < b[orderBy] ? -1 : 1;
    };
  }
}

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: props.defaultOrderBy,
      selected: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.state.data) {
      this.setState({ selected: [] });
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState(state => ({ selected: this.props.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleClickUnlock = () => {
    this.props.onClickUnlock(this.state.selected);
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes, workDir, columnData, data } = this.props;
    const { order, orderBy, selected } = this.state;

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar
          title={workDir}
          numSelected={selected.length}
          onClickUnlock={this.handleClickUnlock}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              columnData={columnData}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data.sort(getSorting(order, orderBy)).map(n => {
                const isSelected = this.isSelected(n.id);
                return (
                  <TableRow
                    hover
                    onClick={event => this.handleClick(event, n.id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected} />
                    </TableCell>
                    {columnData.map(c => (
                      <TableCell
                        key={c.id}
                        align={c.numeric ? 'right' : 'left'}
                      >
                        {n[c.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(EnhancedTable);
