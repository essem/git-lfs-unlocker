import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import EnhancedTable from './EnhancedTable';
import path from 'path';
import util from 'util';
import { exec } from 'child_process';

const execAsync = util.promisify(exec);

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  progressWrapper: {
    textAlign: 'center',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

const columnData = [
  { id: 'id', numeric: true, disablePadding: false, label: 'Id' },
  { id: 'owner', numeric: false, disablePadding: false, label: 'Owner' },
  { id: 'path', numeric: false, disablePadding: false, label: 'Path' },
  { id: 'lockedAt', numeric: false, disablePadding: false, label: 'Locked At' },
];

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      gitUserName: '',
      showOtherPeoples: false,
      workDir: path.resolve(this.props.workDir),
    };

    this.refreshData(this.state.workDir, this.state.showOtherPeoples);
  }

  async refreshData(cwd, showOtherPeoples) {
    try {
      const stdout = await execAsync('git config user.name', { cwd });
      const gitUserName = stdout.trim();

      const dataStr = await execAsync('git lfs locks --json', { cwd });
      let data = JSON.parse(dataStr).map(n => ({
        id: n.id,
        owner: n.owner.name,
        path: n.path,
        lockedAt: n.locked_at,
      }));

      if (!showOtherPeoples) {
        data = data.filter(n => {
          return n.owner === gitUserName;
        });
      }

      this.setState({
        gitUserName,
        data,
      });
    } catch (err) {
      console.error(err);
    }
  }

  onChangeShowOtherPeoples = e => {
    const showOtherPeoples = e.target.checked;
    this.setState({
      data: null,
      showOtherPeoples,
    });
    this.refreshData(this.state.workDir, showOtherPeoples);
  };

  renderTable() {
    const { classes } = this.props;
    const { data, workDir } = this.state;

    if (data === null) {
      return (
        <div className={classes.progressWrapper}>
          <CircularProgress className={classes.progress} />
        </div>
      );
    }
    return (
      <EnhancedTable
        workDir={workDir}
        columnData={columnData}
        data={data}
        defaultOrderBy="path"
      />
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.root} elevation={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.showOtherPeoples}
                onChange={this.onChangeShowOtherPeoples}
              />
            }
            label="Show others"
          />
        </Paper>
        {this.renderTable()}
      </div>
    );
  }
}

export default withStyles(styles)(List);
