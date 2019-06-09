import React, { Suspense } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import List from './List';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  content: {
    padding: '10px 50px',
  },
};

class App extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Suspense fallback="loading">
          <AppBar position="static">
            <Toolbar>
              <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                Git LFS Unlocker
              </Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.content}>
            <List workDir="." />
          </div>
        </Suspense>
      </div>
    );
  }
}

export default withStyles(styles)(App);
