import React, { useState, useEffect, useContext, useCallback } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Typography, Avatar } from '@material-ui/core';
import AlertMessage from 'components/utils/AlertMessage';
import { User, Like } from 'interfaces/index';
import { AuthContext } from 'App';
import { UserDetail } from 'components/UserDetail';
import { getUsers } from 'lib/api/users';
import { createLike, getLikes } from 'lib/api/likes';

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

const Users: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();

  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userDetailOpen, setUserDetailOpen] = useState<boolean>(false);
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const handleGetUsers = useCallback(async () => {
    try {
      const res = await getUsers();
      if (res?.status === 200) {
        setUsers(res?.data.users);
      } else {
        console.log('No users');
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }, []);

  const handleGetLikes = useCallback(async () => {
    try {
      const res = await getLikes();
      if (res?.status === 200) {
        setLikedUsers(res?.data.activeLikes);
      } else {
        console.log('No likes');
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleCreateLike = async (user: User) => {
    const data: Like = {
      fromUserId: currentUser?.id,
      toUserId: user.id,
    };

    try {
      const res = await createLike(data);
      if (res?.status === 200) {
        setLikes([res.data.like, ...likes]);
        setLikedUsers([user, ...likedUsers]);
      } else {
        console.log('Failed');
      }

      if (res?.data.isMatched === true) {
        setAlertMessageOpen(true);
        setUserDetailOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetUsers();
    handleGetLikes();
  }, [handleGetUsers, handleGetLikes]);

  const isLikedUser = (userId: number | undefined): boolean => {
    return likedUsers.some((likedUser: User) => likedUser.id === userId);
  };

  return (
    <>
      {!loading ? (
        users.length > 0 ? (
          <Grid container justify="center">
            {users.map((user: User, index: number) => (
              <div
                key={index}
                onClick={() => {
                  setUser(user);
                  setUserDetailOpen(true);
                }}
              >
                <Grid item style={{ margin: '0.5rem', cursor: 'pointer' }}>
                  <Avatar alt="avatar" src={user.image.url} className={classes.avatar} />
                  <Typography
                    variant="body2"
                    component="p"
                    gutterBottom
                    style={{ marginTop: '0.5rem', textAlign: 'center' }}
                  >
                    {user.name}
                  </Typography>
                </Grid>
              </div>
            ))}
          </Grid>
        ) : (
          <Typography component="p" variant="body2" color="textSecondary">
            まだ1人もユーザーがいません。
          </Typography>
        )
      ) : null}
      {user && (
        <UserDetail
          user={user}
          open={userDetailOpen}
          onClose={() => setUserDetailOpen(false)}
          onCreateLike={() => handleCreateLike(user)}
          isLikedUser={isLikedUser(user.id)}
        />
      )}
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="success"
        message="マッチングが成立しました!"
      />
    </>
  );
};

export default Users;
