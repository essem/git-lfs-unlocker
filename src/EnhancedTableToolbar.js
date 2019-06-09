import React from 'react';
import { useTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import LockOpenIcon from '@material-ui/icons/LockOpen';

const styles = theme => ({
  root: {
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { title, numSelected, classes } = props;
  const { t } = useTranslation();

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {t('toolbar.selected', { number: numSelected })}
          </Typography>
        ) : (
          <Typography variant="subtitle1" id="tableTitle">
            {title}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title={t('toolbar.unlock')}>
            <IconButton onClick={props.onClickUnlock}>
              <LockOpenIcon />
            </IconButton>
          </Tooltip>
        ) : (
          ''
        )}
      </div>
    </Toolbar>
  );
};

export default withStyles(styles)(EnhancedTableToolbar);
