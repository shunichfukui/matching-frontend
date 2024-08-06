import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, Avatar, TextField, Box, Button } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { AuthContext } from 'App';
import { Message, User } from 'interfaces';
import { getChatRoom } from 'lib/api/chat_rooms';
import { createMessage } from 'lib/api/messages';
import { iso8601ToDateTime } from 'components/utils/convertDate';
import { useChatRoomStyles } from 'styles';

const ChatRoom: React.FC = () => {
  const classes = useChatRoomStyles();

  const { currentUser } = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();

  const chatRoomId = parseInt(id || '0');

  const [loading, setLoading] = useState<boolean>(true);
  const [otherUser, setOtherUser] = useState<User>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState<string>('');

  const handleGetChatRoom = async () => {
    try {
      const res = await getChatRoom(chatRoomId);
      console.log(res);

      if (res?.status === 200) {
        setOtherUser(res?.data.otherUser);
        setMessages(res?.data.messages);
      } else {
        console.log('No other user');
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    handleGetChatRoom();
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const data: Message = {
      chatRoomId: chatRoomId,
      userId: currentUser?.id,
      content: content,
    };

    try {
      const res = await createMessage(data);
      console.log(res);

      if (res.status === 200) {
        setMessages([...messages, res.data.message]);
        setContent('');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {!loading ? (
        <div style={{ maxWidth: 360 }}>
          <Grid container justifyContent="center" style={{ marginBottom: '1rem' }}>
            <Grid item>
              <Avatar alt="avatar" src={otherUser?.image.url || ''} className={classes.avatar} />
              <Typography
                variant="body2"
                component="p"
                gutterBottom
                style={{ marginTop: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}
              >
                {otherUser?.name}
              </Typography>
            </Grid>
          </Grid>
          {messages.map((message: Message, index: number) => (
            <Grid
              key={index}
              container
              justifyContent={message.userId === otherUser?.id ? 'flex-start' : 'flex-end'}
            >
              <Grid item>
                <Box
                  borderRadius={
                    message.userId === otherUser?.id ? '30px 30px 30px 0px' : '30px 30px 0px 30px'
                  }
                  bgcolor={message.userId === otherUser?.id ? '#d3d3d3' : '#ffb6c1'}
                  color={message.userId === otherUser?.id ? '#000000' : '#ffffff'}
                  m={1}
                  border={0}
                  style={{ padding: '1rem' }}
                >
                  <Typography variant="body1" component="p">
                    {message.content}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  component="p"
                  color="textSecondary"
                  style={{ textAlign: message.userId === otherUser?.id ? 'left' : 'right' }}
                >
                  {iso8601ToDateTime(message.createdAt?.toString() || '100000000')}
                </Typography>
              </Grid>
            </Grid>
          ))}
          <Grid container justifyContent="center" style={{ marginTop: '2rem' }}>
            <form className={classes.formWrapper} noValidate autoComplete="off">
              <TextField
                required
                multiline
                value={content}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
                className={classes.textInputWrapper}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={!content}
                onClick={handleSubmit}
                className={classes.button}
              >
                <SendIcon />
              </Button>
            </form>
          </Grid>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ChatRoom;
