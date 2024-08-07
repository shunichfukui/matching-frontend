import React, { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CardHeader, Button, IconButton, Box } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CancelIcon from '@material-ui/icons/Cancel';

import { AuthContext } from 'App';
import AlertMessage from 'components/utils/AlertMessage';
import CommonFormInput from 'components/CommonFormInput';
import { signUp } from 'lib/api/auth';
import { SignUpFormData } from 'interfaces/index';
import { prefectures } from 'data/prefectures';
import { genders } from 'data/genders';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: theme.spacing(6),
  },
  submitBtn: {
    marginTop: theme.spacing(1),
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
  inputFileButton: {
    textTransform: 'none',
    color: theme.palette.primary.main,
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

const SignUp: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [gender, setGender] = useState<number>();
  const [prefecture, setPrefecture] = useState<number>();
  const [birthday, setBirthday] = useState<Date | null>(new Date('2000-01-01T00:00:00'));
  const [image, setImage] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const uploadImage = useCallback((e: any) => {
    const file = e.target.files[0];
    setImage(file);
  }, []);

  const previewImage = useCallback((e: any) => {
    const file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
  }, []);

  const createFormData = (): SignUpFormData => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('passwordConfirmation', passwordConfirmation);
    formData.append('gender', String(gender));
    formData.append('prefecture', String(prefecture));
    formData.append('birthday', String(birthday));
    formData.append('image', image);
    return formData;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const data = createFormData();

    try {
      const res = await signUp(data);
      if (res.status === 200) {
        Cookies.set('_access_token', res.headers['access-token']);
        Cookies.set('_client', res.headers['client']);
        Cookies.set('_uid', res.headers['uid']);
        setIsSignedIn(true);
        setCurrentUser(res.data.data);
        navigate('/home');
        setName('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
        setGender(undefined);
        setPrefecture(undefined);
        setBirthday(null);
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
          <CardHeader className={classes.header} title="サインアップ" />
          <CardContent>
            <CommonFormInput
              label="名前"
              value={name}
              onChange={(e) => setName(e.target.value as string)}
            />
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
            <CommonFormInput
              label="パスワード（確認用）"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value as string)}
            />
            <CommonFormInput
              label="性別"
              value={gender}
              onChange={(e) => setGender(e.target.value as number)}
              options={genders.map((gender, index) => ({ value: index, label: gender }))}
            />
            <CommonFormInput
              label="都道府県"
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value as number)}
              options={prefectures.map((prefecture, index) => ({
                value: index + 1,
                label: prefecture,
              }))}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around">
                <KeyboardDatePicker
                  fullWidth
                  inputVariant="outlined"
                  margin="dense"
                  id="date-picker-dialog"
                  label="誕生日"
                  format="MM/dd/yyyy"
                  value={birthday}
                  onChange={(date) => setBirthday(date)}
                  KeyboardButtonProps={{ 'aria-label': 'change date' }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <div className={classes.imageUploadBtn}>
              <input
                accept="image/*"
                className={classes.input}
                id="icon-button-file"
                type="file"
                onChange={(e) => {
                  uploadImage(e);
                  previewImage(e);
                }}
              />
              <label htmlFor="icon-button-file">
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
            </div>
            {preview && (
              <Box className={classes.box}>
                <IconButton color="inherit" onClick={() => setPreview('')}>
                  <CancelIcon />
                </IconButton>
                <img src={preview} alt="preview img" className={classes.preview} />
              </Box>
            )}
            <div style={{ textAlign: 'right' }}>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                disabled={!name || !email || !password || !passwordConfirmation}
                className={classes.submitBtn}
                onClick={handleSubmit}
              >
                送信
              </Button>
            </div>
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

export default SignUp;
