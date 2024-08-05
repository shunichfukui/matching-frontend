import React from 'react';
import {
  Dialog,
  DialogContent,
  Grid,
  Avatar,
  Typography,
  Divider,
  Button,
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { User } from 'interfaces/index';
import { prefectures } from 'data/prefectures';

type UserDetailProps = {
  user: User;
  open: boolean;
  onClose: () => void;
  onCreateLike: () => void;
  isLikedUser: boolean;
};

export const UserDetail: React.FC<UserDetailProps> = ({
  user,
  open,
  onClose,
  onCreateLike,
  isLikedUser,
}) => {
  const userAge = (): number => {
    const birthday = user.birthday.toString().replace(/-/g, '');
    if (birthday.length !== 8) return 0;

    const date = new Date();
    const today =
      date.getFullYear() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2);

    return Math.floor((parseInt(today) - parseInt(birthday)) / 10000);
  };

  const userPrefecture = (): string => {
    return prefectures[user.prefecture - 1];
  };

  return (
    <Dialog open={open} keepMounted onClose={onClose}>
      <DialogContent>
        <Grid container justify="center">
          <Grid item>
            <Avatar alt="avatar" src={user?.image.url} style={{ width: 80, height: 80 }} />
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Grid item style={{ marginTop: '1rem' }}>
            <Typography variant="body1" component="p" gutterBottom style={{ textAlign: 'center' }}>
              {user.name} {userAge() > 0 ? userAge() : '年齢不詳'}歳 ({userPrefecture()})
            </Typography>
            <Divider />
            <Typography
              variant="body2"
              component="p"
              gutterBottom
              style={{ marginTop: '0.5rem', fontWeight: 'bold' }}
            >
              自己紹介
            </Typography>
            <Typography
              variant="body2"
              component="p"
              color="textSecondary"
              style={{ marginTop: '0.5rem' }}
            >
              {user.profile ? user.profile : 'よろしくお願いします。'}
            </Typography>
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Button
            variant="outlined"
            onClick={onCreateLike}
            color="secondary"
            startIcon={isLikedUser ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            disabled={isLikedUser}
            style={{ marginTop: '1rem', marginBottom: '1rem' }}
          >
            {isLikedUser ? 'いいね済み' : 'いいね'}
          </Button>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
