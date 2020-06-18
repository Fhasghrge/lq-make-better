import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import axios from 'axios';

import Level0 from '../../assets/image/level0.png';
import Level1 from '../../assets/image/level1.png';
import Level2 from '../../assets/image/level2.png';
import Level3 from '../../assets/image/level3.png';
import Level4 from '../../assets/image/level4.png';
import Level0name from '../../assets/image/level0name.png';
import Level4name from '../../assets/image/level4name.png';

import { reText as actionReText, commitGrade } from '../../store/action';
import './show.scss';

const ScoreShow = function (props) {
  const { grade, name } = props;
  const view = {};
  if (grade === 100) {
    view.imgUrl = Level0;
    view.cssName = 'level0';
    view.imgPlugin = Level0name;
    view.solgan = '状元';
  } else if (grade >= 90 && grade <= 99) {
    view.imgUrl = Level1;
    view.cssName = 'level1';
    view.solgan = '榜眼';
  } else if (grade >= 80 && grade <= 89) {
    view.imgUrl = Level2;
    view.cssName = 'level2';
    view.solgan = '探花';
  } else if (grade >= 60 && grade <= 79) {
    view.imgUrl = Level3;
    view.cssName = 'level3';
    view.solgan = (
      <>
        <text>进</text>
        <text>士</text>
      </>
    );
  } else {
    view.imgUrl = Level4;
    view.cssName = 'level4';
    view.imgPlugin = Level4name;
    view.solgan = '秀才';
  }
  return (
    <div className={view.cssName}>
      <img src={view.imgUrl} alt="mian" className="view-main"></img>
      <div className="view-name">{view.solgan}</div>
      <img
        src={view.imgPlugin}
        alt="plugin"
        className={view.imgPlugin ? 'view-plugin' : 'none'}
      ></img>
      <div className="view-grade">{grade}</div>
      <div className="view-title">{name}</div>
    </div>
  );
};
class Show extends Component {
  constructor(props) {
    super(props)
    this.state = {
      grade: 0,
    }
  }
  toRange = () => this.props.history.push('/range');

  reTextAndRouter = () => {
    this.props.reText();
  };
  getUserInfo() {
    const bodyFormData2 = new FormData();
    // 异常跳转
    if (!Cookies.get('openid')) {
      alert('正在重新获取信息...');
      window.location.href = 'http://starstudio.uestc.edu.cn/biye/users';
    }
    bodyFormData2.set('openid', Cookies.get('openid'));
    return axios({
      method: 'post',
      url: '/biye/users/getuserinfo',
      data: bodyFormData2,
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => {
      const scoreInfo = {
        score: res.data.score,
        try: res.data.try,
      };
      this.props.grade(scoreInfo);
      this.setState({
        grade: res.data.score
      })
    });
  }
  componentDidMount() {
    if (!this.props.islogin) this.props.history.push('/');
    if (!this.props.haveAnswered) {
      this.props.history.push('/commit');
    }
    this.getUserInfo();
  }
  componentWillReceiveProps(nProps) {
    if (!nProps.haveAnswered) {
      this.props.history.push('/commit');
    }
  }
  render() {
    return (
      <div id="show">
        <header>
          <div>
            <img src={decodeURI(this.props.imgUrl)} alt="hat" className="hat" />
          </div>
        </header>
        <main>
          <ScoreShow
            name={this.props.name}
            grade={this.state.grade || this.props.grade}
          ></ScoreShow>
        </main>
        <footer>
          <button onClick={this.toRange}>排行榜</button>
          <button
            disabled={this.props.try >= 2 ? true : false}
            onClick={this.reTextAndRouter}
          >
            重新测试
          </button>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  islogin: state.login,
  imgUrl: state.info.url,
  name: state.info.name,
  grade: state.grade,
  haveAnswered: state.haveAnswered,
  try: state.try,
});

const mapDispatchToProps = (dispatch) => ({
  reText: () => dispatch(actionReText()),
  grade: (score) => dispatch(commitGrade(score)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Show);
