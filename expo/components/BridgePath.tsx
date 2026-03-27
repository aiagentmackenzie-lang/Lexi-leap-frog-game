import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Colors from '@/constants/colors';
import { CORRECT_COUNT } from '@/constants/wordBanks';

interface BridgePathProps {
  filledCount: number;
  words: string[];
}

function BridgeSlot({ filled, word, index, total }: { filled: boolean; word?: string; index: number; total: number }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      delay: index * 60,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (filled) {
      Animated.spring(fillAnim, {
        toValue: 1,
        tension: 150,
        friction: 6,
        useNativeDriver: true,
      }).start();
    }
  }, [filled]);

  const fillScale = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <Animated.View
      style={[
        styles.slot,
        { transform: [{ scale: scaleAnim }] },
        index === 0 && styles.slotFirst,
        index === total - 1 && styles.slotLast,
      ]}
    >
      {filled ? (
        <Animated.View style={[styles.slotFilled, { transform: [{ scale: fillScale }] }]}>
          <Text style={styles.slotWord} numberOfLines={1}>{word}</Text>
        </Animated.View>
      ) : (
        <View style={styles.slotEmpty}>
          <View style={styles.slotDot} />
        </View>
      )}
    </Animated.View>
  );
}

function BridgePathComponent({ filledCount, words }: BridgePathProps) {
  return (
    <View style={styles.container}>
      <View style={styles.riverBg}>
        <View style={styles.wave1} />
        <View style={styles.wave2} />
      </View>
      <View style={styles.frogRow}>
        <Text style={styles.frog}>🐸</Text>
        <View style={styles.bridgeTrack}>
          {Array.from({ length: CORRECT_COUNT }).map((_, i) => (
            <BridgeSlot
              key={i}
              index={i}
              total={CORRECT_COUNT}
              filled={i < filledCount}
              word={words[i]}
            />
          ))}
        </View>
        <Text style={styles.flag}>🏁</Text>
      </View>
    </View>
  );
}

export const BridgePath = React.memo(BridgePathComponent);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  riverBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.riverBlueDark,
    borderRadius: 20,
  },
  wave1: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
  },
  wave2: {
    position: 'absolute',
    top: '65%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
  },
  frogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  frog: {
    fontSize: 28,
    marginRight: 6,
  },
  flag: {
    fontSize: 22,
    marginLeft: 6,
  },
  bridgeTrack: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  slot: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
  },
  slotFirst: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  slotLast: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  slotEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(136, 163, 214, 0.08)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(136, 163, 214, 0.15)',
    borderStyle: 'dashed',
  },
  slotDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  slotFilled: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.electricCyanDim,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.electricCyan,
  },
  slotWord: {
    fontSize: 9,
    fontWeight: '800' as const,
    color: Colors.electricCyan,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
