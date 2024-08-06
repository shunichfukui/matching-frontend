import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Typography,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';
import { ChatRoom } from 'interfaces';
import { getChatRooms } from 'lib/api/chat_rooms';
import { useChatRoomsStyles } from 'styles';

const ChatRooms: React.FC = () => {
  const classes = useChatRoomsStyles();

  const [loading, setLoading] = useState<boolean>(true);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const handleGetChatRooms = async () => {
    try {
      const res = await getChatRooms();

      if (res.status === 200) {
        setChatRooms(res.data.chatRooms);
      } else {
        console.log('No chat rooms');
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    handleGetChatRooms();
  }, []);

  return (
    <>
      {!loading ? (
        chatRooms.length > 0 ? (
          chatRooms.map((chatRoom: ChatRoom, index: number) => (
            <Grid container key={index} justify="center">
              <List>
                <Link to={`/chatroom/${chatRoom.chatRoom.id}`} className={classes.link}>
                  <div className={classes.root}>
                    <ListItem alignItems="flex-start" style={{ padding: 0 }}>
                      <ListItemAvatar>
                        <Avatar alt="avatar" src={chatRoom.otherUser.image.url} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={chatRoom.otherUser.name}
                        secondary={
                          <div style={{ marginTop: '0.5rem' }}>
                            <Typography component="span" variant="body2" color="textSecondary">
                              {chatRoom.lastMessage === null
                                ? 'まだメッセージはありません。'
                                : chatRoom.lastMessage.content.length > 30
                                ? chatRoom.lastMessage.content.substr(0, 30) + '...'
                                : chatRoom.lastMessage.content}
                            </Typography>
                          </div>
                        }
                      />
                    </ListItem>
                  </div>
                </Link>
                <Divider component="li" />
              </List>
            </Grid>
          ))
        ) : (
          <Typography component="p" variant="body2" color="textSecondary">
            マッチング中の相手はいません。
          </Typography>
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default ChatRooms;
