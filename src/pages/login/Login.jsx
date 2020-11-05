import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import JSEncrypt from 'jsencrypt';
import Cookies from 'js-cookie';

import {
  login as actionLogin,
  wxlogin as actionWxLogin,
} from '../../store/action';
import './login.scss';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stdNumber: '',
      stdPasswd: '',
      stdNumberErr: false,
      stdPasswdErr: false,
    };
  }
  componentDidMount() {
    // 从Cookie获取来自微信的信息
    const { nickname, openid, iconurl } = Cookies.get();
    const wxinfodata = {
      nickname,
      openid,
      iconurl,
    };
    this.props.wxlogin(wxinfodata);

    // TODO:
    // understand this!
    // Fix: 软键盘导致背景压缩
    const initViewport = function (height) {
      let metaEl = document.querySelector('#viewportMeta');
      let content =
        'height=' +
        height +
        ',width=device-width,initial-scale=1.0,user-scalable=no';
      metaEl.setAttribute('name', 'viewport');
      metaEl.setAttribute('content', content);
    };
    const realHeight =
      window.innerWidth > window.innerHeight
        ? window.innerWidth
        : window.innerHeight;
    initViewport(realHeight);
  }
  componentWillReceiveProps(nProps) {
    if (this.props.isAnswered) {
      this.props.history.push('/show');
    } else if (this.props.isLogin) {
      this.props.history.push('/commit');
    }
    if (nProps.isLogin) {
      this.props.history.push('/commit');
    }
  }
  changeStdNum = (e) => {
    this.setState({ stdNumber: e.target.value });
  };
  changeStdPasswd = (e) => {
    this.setState({ stdPasswd: e.target.value });
  };
  httpLogin = () => {
    let { stdNumber, stdPasswd } = this.state;
    //  教师测试校验
    if(stdNumber === '2018081311021' && stdPasswd === 'starstudio') {
      this.props.login({
        stdNumber: stdNumber,
        stdPassWd: stdPasswd,
      });
    }
    // 学生校验
    const textStdNum = new RegExp(/^201\d{6,16}$/);
    const textStdPasswd = new RegExp(/^.{7,28}$/);
    stdNumber = stdNumber.trim();
    stdPasswd = stdPasswd.trim();

    // 客户端正则校验
    if (textStdNum.test(stdNumber) && textStdPasswd.test(stdPasswd)) {
      this.setState({
        stdNumberErr: false,
        stdPasswdErr: false,
      });
      let encryptor = new JSEncrypt(); // 新建JSEncrypt对象
      const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDx3ftEFi+dV2xEXAcHau4YNfAc
        z7eLGi4juajS04VPgVaK1/T2Mg1alxVLThbLsH3bcsEZC1ZToZPEyTkVFTrU5RDI
        Mx28Fr6FaKrPJEK9Wwp82Q0yHyxpN9ahwKcGxo1hTd+KHiF0Uz8l0EXZiBVE3Twg
        sjLRXkA4C+sC3AlMjwIDAQAB`;
      encryptor.setPublicKey(publicKey); // 设置公钥
      let rsaPassWord = encryptor.encrypt(stdPasswd); // 对需要加密的数据进行加密

      const bodyFormData = new FormData();
      bodyFormData.set('id', stdNumber);
      bodyFormData.set('pass', rsaPassWord);
      axios({
        method: 'post',
        url: '/biye/users/stulogin',
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((res) => {
          if (res.data.errcode === 1) {
            this.props.login({
              stdNumber: stdNumber,
              stdPassWd: stdPasswd,
            });
          } else {
            alert('账户或者密码错误');
            this.setState({
              stdNumberErr: true,
              stdPasswdErr: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert('账户或者密码错误');
      !textStdNum.test(stdNumber) &&
        this.setState({
          stdNumberErr: true,
        });
      !textStdPasswd.test(stdPasswd) &&
        this.setState({
          stdPasswdErr: true,
        });
    }
  };
  render() {
    return (
      <div className="login">
        <div className="m-title">毕业前的最后一份答卷</div>
        <div className="m-login-form">
          <label htmlFor="stdNumber">账号</label>
          <input
            type="text"
            name="stdNumber"
            onChange={this.changeStdNum}
            placeholder="请输入学号"
            className={'stdNumber ' + (this.state.stdNumberErr ? 'err' : '')}
          />
          <label htmlFor="stdPasswd">密码</label>
          <input
            type="password"
            name="stdPasswd"
            onChange={this.changeStdPasswd}
            placeholder="请输入信息门户密码"
            className={'stdPasswd ' + (this.state.stdPasswdErr ? 'err' : '')}
          />
        </div>
        <button className="login-btn" onClick={this.httpLogin}>
          登录
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  openid: state.info.openid,
  isLogin: state.login,
  isAnswered: state.haveAnswered,
});

const mapDispatchToProps = (dispatch) => ({
  login: (userinfo) => dispatch(actionLogin(userinfo)),
  wxlogin: (wxinfo) => dispatch(actionWxLogin(wxinfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
