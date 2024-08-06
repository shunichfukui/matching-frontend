import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import CommonLayout from 'components/layouts/CommonLayout';
import Home from 'components/pages/Home';
import Users from 'components/pages/Users';
import SignUp from 'components/pages/SignUp';
import SignIn from 'components/pages/SignIn';
import NotFound from 'components/pages/NotFound';

import { getCurrentUser } from 'lib/api/auth';
import { User } from 'interfaces/index';
import ChatRoom from 'components/pages/ChatRoom';
import ChatRooms from 'components/pages/ChatRooms';

// グローバルで扱う変数・関数（contextで管理）
export const AuthContext = createContext(
  {} as {
    loading: boolean;
    isSignedIn: boolean;
    setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: User | undefined;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  }
);

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser();
      console.log(res);

      if (res?.status === 200) {
        setIsSignedIn(true);
        setCurrentUser(res?.data.currentUser);
      } else {
        console.log('No current user');
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    handleGetCurrentUser();
  }, [setCurrentUser]);

  // ユーザーが認証済みかどうかでルーティングを決定
  // 未認証だった場合は「/signin」ページに促す
  const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
    if (!loading) {
      if (isSignedIn) {
        return children;
      } else {
        return <Navigate to="/signin" />;
      }
    } else {
      return <></>;
    }
  };

  return (
    <Router>
      <AuthContext.Provider
        value={{ loading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser }}
      >
        <CommonLayout>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <Users />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat_rooms"
              element={
                <PrivateRoute>
                  <ChatRooms />
                </PrivateRoute>
              }
            />
            <Route
              path="/chatroom/:id"
              element={
                <PrivateRoute>
                  <ChatRoom />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CommonLayout>
      </AuthContext.Provider>
    </Router>
  );
};

export default App;
