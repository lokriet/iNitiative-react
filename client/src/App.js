import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Layout from './components/UI/Layout/Layout';
import Authenticate from './components/Auth/Authenticate';
// import Login from './components/Auth/Login/Login';
import Home from './components/Home/Home';
import { Toolbar } from './components/Navigation/Toolbar/Toolbar';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Toolbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/register' render={() => <Authenticate isLogin={false} />} />
          <Route path='/login' render={() => <Authenticate isLogin={true} />} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
