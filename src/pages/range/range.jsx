import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import FirstLogo from '../../assets/image/first.png';
import SecondLogo from '../../assets/image/second.png';
import ThirdLogo from '../../assets/image/thrid.png';
import './range.scss';
const RangeLogo = (props) => {
  if (props.range === 1) {
    return (
      <div className="rangelogo">
        <img src={FirstLogo} alt="no1" />
      </div>
    );
  } else if (props.range === 2) {
    return (
      <div className="rangelogo">
        <img src={SecondLogo} alt="no1" />
      </div>
    );
  } else if (props.range === 3) {
    return (
      <div className="rangelogo">
        <img src={ThirdLogo} alt="no1" />
      </div>
    );
  } else {
    return <div className="rangelogo">{props.range}</div>;
  }
};
class Range extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rangeData: [],
    };
  }
  componentDidMount() {
    if (!this.props.isLogin) this.props.history.push('/');

    axios
      .get('/biye/users/getrank')
      .then((res) => {
        if (res.data && res.data.length) {
          this.setState({
            rangeData: res.data,
          });
        }
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  back = () => {
    this.props.history.go(-1);
  };
  render() {
    return (
      <div className="range">
        <main>
          <ul>
            {this.state.rangeData.map((item, index) => {
              return (
                <li key={item.wxid}>
                  <div className="name-img">
                    <RangeLogo range={index + 1} />
                    <div className="img">
                      <img src={item.url} alt="avatar" />
                    </div>
                    <div className="name">{item.nickname}</div>
                  </div>
                  <div className="score">{item.score}</div>
                </li>
              );
            })}
          </ul>
        </main>
        <footer>
          <button onClick={this.back}>返回</button>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLogin: state.login,
});

export default connect(mapStateToProps)(Range);
