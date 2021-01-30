import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from './connection';
import { selectMe } from './state/ducks/me/meSlice';
import { Routes } from './routes';
import styled from 'styled-components';

const Root = styled.div`
  background: ${(props) => props.theme.colors.bg2};
  height: 100%;
  width: 100%;
`;

const App: React.FC = () => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);

  // TODO use server notification to trigger to connect.
  useEffect(() => {
    dispatch(connect(`ws://192.168.10.101:3000/ws?uid=${me.id}`, me));
  }, [dispatch, me]);

  return (
    <Root>
      <Routes />
    </Root>
  );
};

export default App;
