import React, { Component } from 'react';
import { View, Animated, StyleSheet, PanResponder } from 'react-native';


export default class App extends Component {
  state = {
    ball: new Animated.ValueXY({ x: 0, y: 0 })
  };


  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => true,

      onPanResponderGrant: (e, gestureState) => {
        this.state.ball.setOffset({
          x: this.state.ball.x._value,
          y: this.state.ball.y._value
        });

        this.state.ball.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: Animated.event([null, {
        dx: this.state.ball.x,
        dy: this.state.ball.y
      }],
      {
        listener: (e, gestureState) => {
          console.log(gestureState);
        }
      }),

      onPanResponderRelease: () => {
        this.state.ball.flattenOffset();
      }
    });
  }


  componentDidMount() {
    Animated.sequence([
      Animated.decay(this.state.ball.y, {
        velocity: 1,
        duration: 1000
      }),

      Animated.delay(1500),

      Animated.spring(this.state.ball.y, {
        toValue: 0,
        bounciness: 20,
        duration: 1000
      }),

      Animated.delay(1500),

      Animated.timing(this.state.ball.y, {
        toValue: 300,
        duration: 1000
      })
    ]).start();
  }


  render() {
    return (
      <View style={styles.container}>
        <Animated.View
          { ...this._panResponder.panHandlers }
          style={[
            styles.ball,
            {
              transform: [
                { translateX: this.state.ball.x },
                { translateY: this.state.ball.y }
              ],
              opacity: this.state.ball.y.interpolate({
                inputRange: [0, 300],
                outputRange: [1, 0.2],
                extrapolate: 'clamp'
              })
            }
          ]}
        />
      </View>
    );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#000000'
  },
  ball: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffff'
  }
});
