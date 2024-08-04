import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import { makeStyles, Theme } from '@material-ui/core/styles';
import { Typography, Card, CardContent, CardHeader, Button, Box } from '@material-ui/core';

import { AuthContext } from 'App';
import AlertMessage from 'components/utils/AlertMessage';
import CommonFormInput from 'components/CommonFormInput';
import { signIn } from 'lib/api/auth';
import { SignInData } from 'interfaces/index';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: theme.spacing(6),
  },
  submitBtn: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    textTransform: 'none',
  },
  header: {
    textAlign: 'center',
  },
  card: {
    padding: theme.spacing(2),
    maxWidth: 340,
  },
  box: {
    marginTop: '2rem',
  },
  link: {
    textDecoration: 'none',
  },
}));

const SignIn: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const data: SignInData = { email, password };

    try {
      const res = await signIn(data);
      if (res.status === 200) {
        Cookies.set('_access_token', res.headers['access-token']);
        Cookies.set('_client', res.headers['client']);
        Cookies.set('_uid', res.headers['uid']);
        setIsSignedIn(true);
        setCurrentUser(res.data.data);
        navigate('/home');
        setEmail('');
        setPassword('');
      } else {
        setAlertMessageOpen(true);
      }
    } catch (err) {
      console.log(err);
      setAlertMessageOpen(true);
    }
  };

  return (
    <>
      <form noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardHeader className={classes.header} title="サインイン" />
          <CardContent>
            <CommonFormInput
              label="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value as string)}
            />
            <CommonFormInput
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value as string)}
            />
            <div style={{ textAlign: 'right' }}>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                disabled={!email || !password}
                className={classes.submitBtn}
                onClick={handleSubmit}
              >
                送信
              </Button>
            </div>
            <Box textAlign="center" className={classes.box}>
              <Typography variant="body2">
                まだアカウントをお持ちでない方は
                <Link to="/signup" className={classes.link}>
                  こちら
                </Link>
                から作成してください。
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </form>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message="メールアドレスかパスワードが間違っています"
      />
    </>
  );
};

export default SignIn;
