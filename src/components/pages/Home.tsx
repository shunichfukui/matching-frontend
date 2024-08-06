import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import {
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Box,
  Button,
  Avatar,
  Divider,
} from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';

import { AuthContext } from 'App';
import { prefectures } from 'data/prefectures';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CancelIcon from '@material-ui/icons/Cancel';

import { signOut } from 'lib/api/auth';
import { updateUser } from 'lib/api/users';
import { useStyles } from 'styles';
import { createFormData } from 'components/utils/formDataHandlers';
import { calculateUserAge, getUserPrefecture } from 'components/utils/userUtils';
import { useImageUpload } from 'hooks/useImageUpload';

const Home: React.FC = () => {
  const { isSignedIn, setIsSignedIn, currentUser, setCurrentUser } = useContext(AuthContext);

  const classes = useStyles();
  const navigate = useNavigate();

  const [editFormOpen, setEditFormOpen] = useState<boolean>(false);
  const [name, setName] = useState<string | undefined>(currentUser?.name);
  const [prefecture, setPrefecture] = useState<number | undefined>(currentUser?.prefecture || 0);
  const [profile, setProfile] = useState<string | undefined>(currentUser?.profile);

  const { image, preview, uploadImage, previewImage, setPreview } = useImageUpload();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const data = createFormData(name, prefecture, profile, image);

    try {
      const res = await updateUser(currentUser?.id, data);
      console.log(res);

      if (res.status === 200) {
        setEditFormOpen(false);
        setCurrentUser(res.data.user);

        console.log('Update user successfully!');
      } else {
        console.log(res.data.message);
      }
    } catch (err) {
      console.log(err);
      console.log('Failed in updating user!');
    }
  };

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const res = await signOut();

      if (res.data.success === true) {
        Cookies.remove('_access_token');
        Cookies.remove('_client');
        Cookies.remove('_uid');

        setIsSignedIn(false);
        navigate('/signin');

        console.log('Succeeded in sign out');
      } else {
        console.log('Failed in sign out');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isSignedIn && currentUser ? (
        <>
          <Card className={classes.card}>
            <CardContent>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <IconButton onClick={() => setEditFormOpen(true)}>
                    <SettingsIcon color="action" fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
              <Grid container justifyContent="center">
                <Grid item>
                  <Avatar alt="avatar" src={currentUser?.image.url} className={classes.avatar} />
                </Grid>
              </Grid>
              <Grid container justifyContent="center">
                <Grid item style={{ marginTop: '1.5rem' }}>
                  <Typography variant="body1" component="p" gutterBottom>
                    {currentUser?.name} {calculateUserAge(String(currentUser?.birthday))}歳 (
                    {getUserPrefecture(currentUser?.prefecture)})
                  </Typography>
                  <Divider style={{ marginTop: '0.5rem' }} />
                  <Typography
                    variant="body2"
                    component="p"
                    gutterBottom
                    style={{ marginTop: '0.5rem', fontWeight: 'bold' }}
                  >
                    自己紹介
                  </Typography>
                  {currentUser.profile ? (
                    <Typography variant="body2" component="p" color="textSecondary">
                      {currentUser.profile}
                    </Typography>
                  ) : (
                    <Typography variant="body2" component="p" color="textSecondary">
                      よろしくお願いいたします。
                    </Typography>
                  )}
                  <Button
                    variant="outlined"
                    onClick={handleSignOut}
                    color="primary"
                    fullWidth
                    startIcon={<ExitToAppIcon />}
                    style={{ marginTop: '1rem' }}
                  >
                    サインアウト
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <form noValidate autoComplete="off">
            <Dialog open={editFormOpen} keepMounted onClose={() => setEditFormOpen(false)}>
              <DialogTitle style={{ textAlign: 'center' }}>プロフィールの変更</DialogTitle>
              <DialogContent>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="名前"
                  value={name}
                  margin="dense"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                />
                <FormControl variant="outlined" margin="dense" fullWidth>
                  <InputLabel id="demo-simple-select-outlined-label">都道府県</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={prefecture}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                      setPrefecture(e.target.value as number)
                    }
                    label="都道府県"
                  >
                    {prefectures.map((prefecture, index) => (
                      <MenuItem key={index + 1} value={index + 1}>
                        {prefecture}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  placeholder="1000文字以内で書いてください。"
                  variant="outlined"
                  multiline
                  fullWidth
                  label="自己紹介"
                  rows="8"
                  value={profile}
                  margin="dense"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setProfile(e.target.value);
                  }}
                />
                <div className={classes.imageUploadBtn}>
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="icon-button-file"
                    type="file"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                {preview ? (
                  <Box className={classes.box}>
                    <IconButton color="inherit" onClick={() => setPreview('')}>
                      <CancelIcon />
                    </IconButton>
                    <img src={preview} alt="preview img" className={classes.preview} />
                  </Box>
                ) : null}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleSubmit} color="primary" disabled={!name || !profile}>
                  送信
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Home;
