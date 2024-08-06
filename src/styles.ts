import { makeStyles, Theme } from '@material-ui/core/styles';

export const useChatRoomsStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    minWidth: 340,
    maxWidth: '100%',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
}));

export const useChatRoomStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: '0 auto',
  },
  formWrapper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 340,
  },
  textInputWrapper: {
    width: '100%',
  },
  button: {
    marginLeft: theme.spacing(1),
  },
}));

export const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  card: {
    width: 340,
  },
  imageUploadBtn: {
    textAlign: 'right',
  },
  input: {
    display: 'none',
  },
  box: {
    marginBottom: '1.5rem',
  },
  preview: {
    width: '100%',
  },
}));
