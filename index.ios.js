import React from 'react';
import {View, Text, AppRegistry, StyleSheet, TouchableHighlight} from 'react-native';
import MinSecMilli from 'minutes-seconds-milliseconds';


var StopWatch = React.createClass({

  getInitialState: function(){
    return {
      timeElapsed: null,
      isRunning: false,
      startTime: null,
      isPaused: false,
      pauseStart: null,
      totalPause: 0,
      lastLapTime: 0,
      laps: []
    }
  },

  render: function(){
    return (
      <View style={styles.container}>
        <View style={[styles.header]}>
          <View style={[styles.timerWrapper]}>
            <Text style={styles.timer}>{MinSecMilli(this.state.timeElapsed)}</Text>
          </View>
          <View style={[styles.buttonWrapper]}>
            {this.stopButton()}
            {this.startPauseButton()}
            {this.lapButton()}
          </View>
        </View>
        <View style={[styles.footer]}>
          {this.laps()}
        </View>
      </View>
    );
  },

  startPauseButton: function(){
    return (
      <TouchableHighlight style={[styles.button, this.startPauseStyle()]} underlayColor="gray" onPress={this.handleStartPress}><Text>{this.state.isRunning ? 'Pause' : 'Start'}</Text></TouchableHighlight>
    );
  },

  handleStartPress: function(){
    // Pause
    if(this.state.isRunning){
      clearInterval(this.interval);
      this.setState({
        isRunning: false,
        pauseStart: new Date(),
        isPaused: true,
        timeElapsed: new Date() - this.state.totalPause - this.state.startTime
      });
      return;
    }

    // Unpause
    if(this.state.isPaused){

      var pausedTime = new Date() - this.state.pauseStart;
      pausedTime += this.state.totalPause;

      this.setState({totalPause: pausedTime})

      this.interval = setInterval(function(){
        this.setState({
          isRunning: true,
          isPaused: false,
          timeElapsed: new Date() - this.state.totalPause - this.state.startTime
        });
      }.bind(this), 60)
    }

    else {
      this.setState({
        startTime: new Date()
      })

      this.interval = setInterval(function(){
        this.setState({
          timeElapsed: new Date() - this.state.startTime,
          isRunning: true
        });
      }.bind(this), 60);
    }
  },

  stopButton: function(){
    return (
      <TouchableHighlight style={[styles.button, {borderColor: 'red'}]} underlayColor="gray" onPress={this.handleStopPress}><Text>Stop</Text></TouchableHighlight>
    );
  },

  handleStopPress: function(){

    clearInterval(this.interval);
    if(this.state.isRunning || this.state.isPaused){
      this.setState({
        isRunning: false,
        isPaused: false
      });
    }
  },

  startPauseStyle: function(){
    return this.state.isRunning ? {borderColor: 'blue'} : {borderColor: 'green'}
  },

  lapButton: function(){
    return (
      <TouchableHighlight style={styles.button} underlayColor="gray" onPress={this.handleLapPress}><Text>Lap</Text></TouchableHighlight>
    );
  },


  handleLapPress: function(){

    if(this.state.isRunning){
      var lapTime = this.state.timeElapsed - this.state.lastLapTime;

      this.setState({
        lastLapTime: this.state.timeElapsed,
        laps: this.state.laps.concat([lapTime])
      });
    }

    return;
  },

  laps: function(){
    return this.state.laps.map(function(time, i){
      return (
        <View key={i} style={styles.lap}>
        <Text style={styles.lapText}>Lap #{i + 1}: </Text>
        <Text style={styles.lapText}>{MinSecMilli(time)}</Text>
        </View>
      )
    })
  }
});

// STYLES
var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },

  header: {
    flex: 1
  },

  footer: {
    flex: 1,
    alignItems: 'center'
  },

  timerWrapper: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonWrapper: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },

  timer: {
    fontSize: 60,
    textAlign: 'right'
  },

  button: {
    borderWidth: 2,
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  lap: {
    justifyContent: 'space-around',
    flexDirection: 'row'
  },

  lapText: {
    fontSize: 30
  }
});

AppRegistry.registerComponent('stopwatch', function(){return StopWatch});
