import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes } from './routes';
import { initUser } from './state/ducks/me/meSlice';
import { initApp } from './state/ducks/p2p/p2pSlice';
import { AppThunkDispatch } from './state/store';

const App: React.FC = () => {
  const dispatch: AppThunkDispatch = useDispatch();

  useEffect(() => {
    dispatch(initUser()).then(() => {
      dispatch(initApp());
    });
  }, [dispatch]);

  return <Routes />;
};

export default App;
