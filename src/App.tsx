import React from 'react';
import { useDispatch } from 'react-redux';
import { Routes } from './routes';
import { initNodes } from './state/ducks/p2p/p2pSlice';

const App: React.FC = () => {
  const dispatch = useDispatch();
  dispatch(initNodes());

  return <Routes />;
};

export default App;
