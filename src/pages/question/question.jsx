import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { answered } from '../../store/action';
import Cookies from 'js-cookie';

import './question.scss';
class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNum: 1,
      questions: [
        {
          id: 21,
          question: '清水河校区主楼一共有几层',
          options: '5,6,7,8',
          answer: '8',
          type: '基础知识',
          show_time: 0,
          pass_time: 0,
        },
        {
          id: 11,
          question: '我电本科专业共有多少个',
          options: '63,61,56,51',
          answer: '63',
          type: '基础知识',
          show_time: 0,
          pass_time: 0,
        },
        {
          id: 37,
          question: '清水河校区哪个食堂的男生最多',
          options: '银桦餐厅,桃园餐厅,家园餐厅,朝阳餐厅',
          answer: '朝阳餐厅',
          type: '基础知识',
          show_time: 0,
          pass_time: 0,
        },
        {
          id: 10,
          question: '我电有几个国家级重点实验室',
          options: '2,3,4,5',
          answer: '4',
          type: '基础知识',
          show_time: 0,
          pass_time: 0,
        },
        {
          id: 50,
          question:
            '“明明可以靠颜值，却偏要靠实力。”她是我电最年轻的副院长，她于_____年来我电工作',
          options: '2014,2015,2016,2017',
          answer: '2015',
          type: '名教师',
          show_time: 0,
          pass_time: 0,
        },
        {
          id: 55,
          question: '下列选项中，在大一必修的两门课是',
          options:
            '毛概与概率论,微积分和信号与系统,大学物理和马原,近代史和思修',
          answer: '近代史和思修',
          type: '名课程',
          show_time: 1,
          pass_time: 1,
        },
        {
          id: 62,
          question: '刘若英来过我电_____次',
          options: '1,2,3,4',
          answer: '3',
          type: '名讲座',
          show_time: 0,
          pass_time: 0,
        },
        {
          id: 84,
          question: '2019年成都版快闪《我和我的祖国》，我电共有多少学子参加',
          options: '40人,50人,60人,70人',
          answer: '70人',
          type: '大事记',
          show_time: 1,
          pass_time: 0,
        },
        {
          id: 83,
          question:
            '我电在2014-2018年中国高校创新人才培养暨学科竞赛评估中排名第几',
          options: '1,2,3,4',
          answer: '4',
          type: '大事记',
          show_time: 1,
          pass_time: 0,
        },
        {
          id: 64,
          question: '我电清水河校区幼儿园建设于几号启动',
          options: '5.1,5.11,6.1,6.11',
          answer: '6.1',
          type: '大事记',
          show_time: 0,
          pass_time: 0,
        },
      ],
      examid: 0,
      selectNums: new Array(10).fill(0),
    };
  }
  componentDidMount() {
    if (!this.props.islogin) this.props.history.push('/');
    if (this.props.try >= 2) {
      this.props.answer();
      this.props.history.push('/show');
    }

    const bodyFormData = new FormData();
    bodyFormData.set('openid', Cookies.get('openid'));
    axios({
      method: 'post',
      url: '/biye/users/getproblem',
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((res) => {
        this.setState({
          questions: res.data.data,
          examid: res.data.examid,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
  componentWillReceiveProps(nProps) {
    if (nProps.answeredProp) {
      this.props.history.push('/show');
    }
  }
  render() {
    const { currentNum } = this.state;
    let options = this.state.questions[currentNum - 1].options
      .split(',')
      .map((item, index) => (
        <li
          onClick={this.select.bind(this, index)}
          key={item}
          className={
            this.state.selectNums[currentNum - 1] === index + 1 ? 'active' : ''
          }
        >
          {item}
        </li>
      ));
    return (
      <div id="question">
        <header>
          <p>
            <p className="num">{currentNum}/10</p>
            <p className="content">
              {this.state.questions[currentNum - 1].question}？
            </p>
          </p>
        </header>
        <main>{options}</main>
        <footer>
          <button onClick={this.preQuest}>上一页</button>
          <button onClick={this.nextQuest}>
            {currentNum === 10 ? '交卷' : '下一题'}
          </button>
        </footer>
      </div>
    );
  }
  select(index) {
    const { selectNums } = this.state;
    selectNums[this.state.currentNum - 1] = index + 1;
    this.setState({
      selectNums,
    });
  }
  postInfo() {
    const nickname = this.props.nickName;
    const openid = Cookies.get('openid');
    const iconurl = this.props.iconUrl;
    // 异常跳转
    if(!nickname || !openid || !iconurl) {
      alert('正在获取信息...')
      window.location.href = 'http://starstudio.uestc.edu.cn/biye/users'
    }
    const bodyFormData3 = new FormData();
    bodyFormData3.set('openid', Cookies.get('openid'));
    bodyFormData3.set('iconurl', this.props.iconUrl);
    bodyFormData3.set('nickname', this.props.nickName);
    return axios({
      method: 'post',
      url: '/biye/users/saveInfo',
      data: bodyFormData3,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  postSubmit() {
    const bodyFormData = new FormData();
    bodyFormData.set('openid', Cookies.get('openid'));
    bodyFormData.set('examid', this.state.examid);
    this.state.selectNums.forEach((key, index) => {
      bodyFormData.set(`correct[${index}]`, key);
    });
    return axios({
      method: 'post',
      url: '/biye/users/submit',
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((res) => {
        this.props.answer();
        console.log('提交成功！');
      })
      .catch((err) => {
        console.log(err);
      });
  }
  submitFunction = async () => {
    try {
      await this.postSubmit();
      await this.postInfo();
      alert('提交成功！');
      this.props.history.push('/show');
    } catch (err) {
      console.log(err);
    }
  };
  // 防抖
  debounce(fun, delay) {
    let timeout = null;
    return function (args) {
      let that = this;
      let _args = args;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fun.call(that, _args);
      }, delay);
    };
  }

  deSubmitFunction = this.debounce(this.submitFunction, 500);

  nextQuest = () => {
    if (this.state.currentNum === 10) {
      this.deSubmitFunction();
    } else {
      this.setState((state, props) => ({
        currentNum: state.currentNum + 1,
      }));
    }
  };

  preQuest = () => {
    if (this.state.currentNum === 1) return;
    this.setState((state, props) => ({
      currentNum: state.currentNum - 1,
    }));
  };
}

const mapStateToProps = (state) => ({
  islogin: state.login,
  openid: state.info.openid,
  iconUrl: state.info.url,
  nickName: state.info.name,
  answeredProp: state.haveAnswered,
  try: state.try,
});

const mapDispatchToProps = (dispatch) => ({
  answer: () => dispatch(answered()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Question);
