import React, { Component, FormEvent } from 'react';

import Display from './Display';

export type UnitOfTime = 'hours' | 'minutes' | 'seconds';

export interface TimeState {
  hours: string;
  minutes: string;
  seconds: string;
  timeInterval?: any;
  unitOfTime?: UnitOfTime;
  status: 'stopped' | 'paused' | 'started';
}

interface DispatchProps {
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

interface StateProps {
  status: 'stopped' | 'paused' | 'started';
}

type Props = DispatchProps & StateProps;

class Timer extends Component<{}, TimeState> {
  interval: any;
  constructor(props: any) {
    super(props);
    this.state = {
      hours: '00',
      minutes: '00',
      seconds: '00',
      timeInterval: null,
      status: 'stopped',
    };
  }

  static getTotalMilliseconds = (state: TimeState) => {
    return (parseInt(state.hours) * 60 * 60
      + parseInt(state.minutes) * 60
      + parseInt(state.seconds)
    ) * 1000;
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setHours(hours: number) {
    console.log(hours);
    if (hours < 0) {
      this.setState(() => ({ hours: '00' }));
    } else {
      this.setState((prevState) => {
        hours = parseInt(this.formatTime(parseInt(prevState.hours) + hours));
        if (hours > 99) {
          hours = parseInt(prevState.hours);
        }
        return { hours: this.formatTime(hours) };
      });
    }
  }

  setMinutes(minutes: number) {
    if (minutes < 0) {
      this.setState(() => ({ minutes: '00' }));
    } else {
      this.setState((prevState) => {
        minutes = parseInt(this.formatTime(parseInt(prevState.minutes) + minutes));
        if (minutes < 60) {
          if (parseInt(minutes.toString()[0]) > 5) {
            minutes = 59;
          }
        } else if (minutes > 59) {
          minutes = parseInt(minutes.toString().slice(minutes.toString().length - 1));
        }
        return { minutes: this.formatTime(minutes) };
      });
    }
  }

  setSeconds(seconds: number) {
    if (seconds < 0) {
      this.setState(() => ({ seconds: '00' }));
    } else {
      this.setState((prevState) => {
        seconds = parseInt(this.formatTime(parseInt(prevState.seconds) + seconds));

        if (seconds < 60) {
          if (parseInt(seconds.toString()[0]) > 5) {
            seconds = 59;
          }
        } else if (seconds > 59) {
          seconds = parseInt(seconds.toString().slice(seconds.toString().length - 1));
        }

        return { seconds: this.formatTime(seconds) };
      });
    }
  }

  formatTime(time: number) {
    return time < 10 ? '0' + time : time.toString().slice(time.toString().length - 2);
  }

  canStart() {
    return this.state.status === 'started' && this.state.timeInterval > 0;
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (!this.canStart()) {
        if (this.state.status === 'started') {
          console.log('cannot start but start called');
        }
        return;
      }
      this.setState((prevState) => {
        return { timeInterval: prevState.timeInterval - 10 };
      });
      if (this.state.timeInterval === 0) {
        console.log('countdown is over');
      }
    }, 10);
  }

  onInputChange = (unitOfTime: UnitOfTime) => (event: FormEvent<HTMLInputElement>) => {

    const re = /^[0-9\b]+$/;
    let inputValue = event.currentTarget.value;

    if(re.test(inputValue))
    {
      if(unitOfTime === 'hours')
      {
        if(parseInt(inputValue) < 100)
          this.setState(() => ({ hours: inputValue }));
        else
          this.setState(() => ({ hours: '99' }));

      }
      if(unitOfTime === 'minutes')
      {
        if(parseInt(inputValue) < 60)
          this.setState(() => ({ minutes: inputValue }));
        else
          this.setState(() => ({ minutes: '59' }));
      }

      if(unitOfTime === 'seconds')
      {
        if(parseInt(inputValue) < 60)
          this.setState(() => ({ seconds: inputValue }));
        else
          this.setState(() => ({ seconds: '59' }));
      }

    }

  };

  onBlur = (unitOfTime: UnitOfTime) => {
    this.onInputChange(unitOfTime);
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: TimeState) : TimeState {
    if (nextProps.status === prevState.status) return prevState;

    if (nextProps.status === 'started' && prevState.status !== 'paused') {
      const timeInterval = Timer.getTotalMilliseconds(prevState);
      return {
        ...prevState,
        timeInterval: timeInterval > 0 ? timeInterval : null,
        status: nextProps.status,
      }
    }
    if (nextProps.status === 'stopped') {
      return {
        hours: '00',
        minutes: '00',
        seconds: '00',
        timeInterval: null,
        status: nextProps.status,
      };
    }

    return {
      ...prevState,
      status: nextProps.status,
    };
  }

  render() {
    return (
      <div className="timer">
        <Display
          onBlur={this.onBlur}
          onInputChange={this.onInputChange}
          hours={this.state.hours}
          minutes={this.state.minutes}
          seconds={this.state.seconds}
          timeInterval={this.state.timeInterval} />
      </div>
    );
  }
}

export default Timer;
