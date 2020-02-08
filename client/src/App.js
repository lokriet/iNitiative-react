import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Layout from './components/UI/Layout/Layout';
import Home from './components/Home/Home';
import { Toolbar } from './components/Navigation/Toolbar/Toolbar';
import Register from './components/Auth/Register/Register';
import Login from './components/Auth/Login/Login';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Toolbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
