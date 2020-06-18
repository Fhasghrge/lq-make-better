import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './pages/login/Login'
import Commit from './pages/commit/commit'
import Question from './pages/question/question'
import Show from './pages/show/show'
import Range from './pages/range/range'

import store from './store/index';
import slogan from './assets/image/slogan.png'
import uestc from './assets/image/uestc.png'
import './index.scss'

const isWeixin = () => {
  //判断是否是微信
  const ua = navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i) == 'micromessenger';
};
function NotWx () {
  return (
    <div>请用微信打开此链接！</div>
  )
}
if (isWeixin()) {
  ReactDOM.render(
    <Provider store={store}>
      <img src={uestc} alt='uestc' className='uestc'></img>
      <img src={slogan} alt='slogan' className='slogan'></img>
      <main>
        <Router>
          <Switch>
            <Route path='/' exact component={Login}></Route>
            <Route path='/commit' component={Commit}></Route>
            <Route path='/question' component={Question}></Route>
            <Route path='/show' component={Show}></Route>
            <Route path='/range' component={Range}></Route>
          </Switch>
        </Router>
      </main>
    </Provider>
    ,
    document.getElementById('root')
  );
}else {
  ReactDOM.render(
    <NotWx></NotWx>
    ,
    document.getElementById('root')
  );
}