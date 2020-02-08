import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Layout from './components/UI/Layout/Layout';
import Register from './components/Auth/Register/Register';
import Home from './components/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/register' component={Register} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
