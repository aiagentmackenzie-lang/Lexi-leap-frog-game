import React, { useEffect, useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import Colors from '@/constants/colors';

interface WordStoneProps {
  word: string;
  index: number;
  state: 'idle' | 'correct' | 'wrong' | 'disabled';
  onPress: (index: number) => void;
}

function WordStoneComponent({ word, index, state, onPress }: WordStoneProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const bobAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 80,
      friction: 8,
      delay: index * 40,
      useNativeDriver: true,
    }).start();

    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, {
          toValue: 1,
          duration: 1800 + (index % 4) * 200,
          useNativeDriver: true,
        }),
        Animated.timing(bobAnim, {
          toValue: 0,
          duration: 1800 + (index % 4) * 200,
          useNativeDriver: true,
        }),
      ])
    );
    bobLoop.start();

    return () => bobLoop.stop();
  }, []);

  useEffect(() => {
    if (state === 'correct') {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.15,
          tension: 200,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (state === 'wrong') {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [state]);

  const handlePress = useCallback(() => {
    if (state === 'correct' || state === 'disabled') return;
    onPress(index);
  }, [state, index, onPress]);

  const translateY = bobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });

  const borderColor =
    state === 'correct'
      ? Colors.neonGreen
      : state === 'wrong'
      ? Colors.errorRed
      : Colors.hazeBlue;

  const bgColor =
    state === 'correct'
      ? Colors.neonGreenDim
      : state === 'wrong'
      ? Colors.errorRedDim
      : Colors.cardBg;

  const textColor =
    state === 'correct'
      ? Colors.neonGreen
      : state === 'wrong'
      ? Colors.errorRed
      : Colors.textPrimary;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [
            { scale: scaleAnim },
            { translateY },
            { translateX: shakeAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        testID={`stone-${index}`}
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={state === 'correct' || state === 'disabled'}
        style={[
          styles.stone,
          {
            borderColor,
            backgroundColor: bgColor,
          },
        ]}
      >
        <Text style={[styles.text, { color: textColor }]}>{word}</Text>
        {state === 'correct' && <View style={[styles.glowDot, { backgroundColor: Colors.neonGreen }]} />}
      </TouchableOpacity>
    </Animated.View>
  );
}

export const WordStone = React.memo(WordStoneComponent);

const styles = StyleSheet.create({
  wrapper: {
    width: '25%',
    padding: 4,
  },
  stone: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  text: {
    fontSize: 14,
    fontWeight: '700' as const,
    textAlign: 'center',
  },
  glowDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
