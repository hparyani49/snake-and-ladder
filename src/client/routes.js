import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Game from './components/pages/Game/Game';

export const Routes = () => (
    <Switch>
      <Route exact path='/' component={Game} />
    </Switch>
);
export default Routes;