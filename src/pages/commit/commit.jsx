import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios'
import Cookies from 'js-cookie';

import {answered, commitGrade } from '../../store/action';
import './commit.scss';
class Commit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    if(!this.props.islogin) this.props.history.push('/')
    const bodyFormData = new FormData();
    bodyFormData.set('openid', Cookies.get('openid'));
    axios({
      method: 'post',
      url: '/biye/users/getuserinfo',
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(res => {
        const scoreInfo = {
          score: res.data.score,
          try: res.data.try,
        };
        this.props.grade(scoreInfo);
        if(res.data.try >= 2) {
          this.props.answer()
          this.props.history.push('/show');
        }
      })
      .catch(err => console.log(err))
  }
  toRange = () => {
    this.props.history.push('/range');
  };
  toQusetion = () => {
    alert('本次答题一共可以进行两次做答')
    this.props.history.replace('/question');
  };
  render() {
    return (
      <div id="commit">
        <div className="title">承诺书</div>
        <p>
          我自愿发扬成电人精神，
          <br/>
          书山学海，
          <br/>
          尖端前沿，
          <br/>
          勇敢前行。
          <br/>
          在以后千千万万个日夜里，
          <br/>
          不论身处何处，
          <br/>
          爱我成电千千万万遍。
          <br/>
        </p>
        <div className="btns">
          <button onClick={this.toRange}>排行榜</button>
          <button onClick={this.toQusetion}>开始答题</button>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  openid: state.info.openid,
  islogin: state.login
});

const mapDispatchToProps = dispatch => ({
  answer: () => dispatch(answered()),
  grade: (score) => dispatch(commitGrade(score)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Commit);

