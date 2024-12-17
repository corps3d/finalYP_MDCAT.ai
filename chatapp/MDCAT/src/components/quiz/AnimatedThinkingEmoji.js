import React, { useState, useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const AnimatedThinkingIndicator = () => {
  const [dotCount, setDotCount] = useState(3);
  const scaleAnims = useRef(
    Array(3).fill().map(() => new Animated.Value(1))
  ).current;
  const opacityAnims = useRef(
    Array(3).fill().map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
    
    // Store animation references
    const animations = scaleAnims.map((anim) => 
      createDotAnimation(anim)
    );

    // Start all animations
    animations.forEach(anim => anim.start());

    // Dot reduction schedule
    const reductionTimer1 = setTimeout(() => {
      setDotCount(2);
      Animated.timing(opacityAnims[2], {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start();
    }, 20000);

  }, []);

  return (
    <View 
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
      }}
    >
      {[0, 1, 2].slice(0, dotCount).map((index) => (
        <Animated.View 
          key={index}
          style={{
            transform: [{ scale: scaleAnims[index] }],
            opacity: opacityAnims[index],
            marginHorizontal: 5,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#4F8383', // Your primary color
            shadowColor: '#2F4F4F',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 3
          }}
        />
      ))}
    </View>
  );
};

export default AnimatedThinkingIndicator;