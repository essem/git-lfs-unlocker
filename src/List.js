import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EnhancedTable from './EnhancedTable';
import util from 'util';

const electron = window.require('electron');
const path = electron.remote.require('path');
const { exec } = electron.remote.require('child_process');
const execAsync = util.promisify(exec);

const styles = theme => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  buttons: {
    paddingTop: theme.spacing(2),
  },
  progressWrapper: {
    textAlign: 'center',
  },
  vmiddle: {
    verticalAlign: 'middle',
  },
  progress: {
    verticalAlign: 'middle',
    margin: theme.spacing(2),
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
      forceUnlock: false,
      filter: '',
      workDir: path.resolve(this.props.workDir),
      showUnlockingProgress: false,
      err: null,
    };

    this.refreshData(this.state.workDir);
  }

  async refreshData(cwd) {
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

      this.setState({
        gitUserName,
        data,
      });
    } catch (err) {
      this.setState({ err: err.toString() });
    }
  }

  onChangeShowOtherPeoples = e => {
    const showOtherPeoples = e.target.checked;
    this.setState({ showOtherPeoples });
  };

  onChangeForceUnlock = e => {
    const forceUnlock = e.target.checked;
    this.setState({ forceUnlock });
  };

  onChangeFilter = e => {
    const filter = e.target.value;
    this.setState({ filter });
  };

  onClickRefresh = e => {
    this.setState({ data: null });
    this.refreshData(this.state.workDir);
  };

  handleClickUnlock = selected => {
    this.setState({ showUnlockingProgress: true });
    (async () => {
      try {
        const option = this.state.forceUnlock ? '-f' : '';
        for (const id of selected) {
          await execAsync(`git lfs unlock --id=${id} ${option}`, {
            cwd: this.state.workDir,
          });
        }
        this.setState({ showUnlockingProgress: false, data: null });
        this.refreshData(this.state.workDir);
      } catch (err) {
        this.setState({ showUnlockingProgress: false, err: err.toString() });
      }
    })();
  };

  handleClose = () => {
    this.setState({ err: null });
  };

  renderTable() {
    const { classes } = this.props;
    const { workDir, gitUserName, showOtherPeoples, filter } = this.state;
    let data = this.state.data;

    if (data === null) {
      return (
        <div className={classes.progressWrapper}>
          <CircularProgress className={classes.progress} />
        </div>
      );
    }

    if (!showOtherPeoples) {
      data = data.filter(n => {
        return n.owner === gitUserName;
      });
    }

    if (filter != '') {
      data = data.filter(n => {
        return n.path.includes(filter);
      });
    }

    return (
      <EnhancedTable
        workDir={workDir}
        columnData={columnData}
        data={data}
        defaultOrderBy="path"
        onClickUnlock={this.handleClickUnlock}
      />
    );
  }

  renderUnlockingProgress() {
    const { classes } = this.props;
    const { showUnlockingProgress } = this.state;

    return (
      <Dialog open={showUnlockingProgress}>
        <DialogContent>
          <CircularProgress className={classes.progress} />
          <span className={classes.vmiddle}>Unlocking in progress...</span>
        </DialogContent>
      </Dialog>
    );
  }

  renderError() {
    if (this.state.err === null) {
      return '';
    }

    return (
      <Dialog
        open={true}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Failed to unlock file(s)'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.state.err}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper} elevation={1}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.showOtherPeoples}
                  onChange={this.onChangeShowOtherPeoples}
                />
              }
              label="Show others"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.forceUnlock}
                  onChange={this.onChangeForceUnlock}
                />
              }
              label="Force unlock"
            />
            <Input
              placeholder="Enter a string to filter the list"
              className={classes.input}
              value={this.state.filter}
              onChange={this.onChangeFilter}
            />
          </FormGroup>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.onClickRefresh}
            >
              Refresh
            </Button>
          </div>
        </Paper>
        {this.renderTable()}
        {this.renderUnlockingProgress()}
        {this.renderError()}
      </div>
    );
  }
}

export default withStyles(styles)(List);
