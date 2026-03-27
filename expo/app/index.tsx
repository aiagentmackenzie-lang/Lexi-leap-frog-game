import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { RotateCcw, Zap, Trophy } from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  generateGrid,
  getRandomCategory,
  CORRECT_COUNT,
} from '@/constants/wordBanks';
import { WordStone } from '@/components/WordStone';
import { BridgePath } from '@/components/BridgePath';

type StoneState = 'idle' | 'correct' | 'wrong' | 'disabled';

function initGame(excludeCategory?: string) {
  const category = getRandomCategory(excludeCategory);
  const { words, correctWords } = generateGrid(category);
  return { category, words, correctWords };
}

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const [gameData, setGameData] = useState(() => initGame());
  const [stoneStates, setStoneStates] = useState<StoneState[]>(Array(16).fill('idle'));
  const [bridgeWords, setBridgeWords] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

  const winAnim = useRef(new Animated.Value(0)).current;
  const frogLeapAnim = useRef(new Animated.Value(0)).current;
  const headerGlow = useRef(new Animated.Value(0)).current;
  const wrongTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(headerGlow, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(headerGlow, { toValue: 0, duration: 2000, useNativeDriver: false }),
      ])
    );
    glowLoop.start();
    return () => glowLoop.stop();
  }, []);

  const resetGame = useCallback(() => {
    setGameWon(false);
    winAnim.setValue(0);
    frogLeapAnim.setValue(0);
    const newGame = initGame(gameData.category);
    setGameData(newGame);
    setStoneStates(Array(16).fill('idle'));
    setBridgeWords([]);
    setLevel(prev => prev + 1);
  }, [gameData.category]);

  const triggerWin = useCallback(() => {
    setGameWon(true);
    console.log('[Game] Win triggered!');

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 150);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 300);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 450);
    }

    Animated.sequence([
      Animated.spring(frogLeapAnim, {
        toValue: 1,
        tension: 60,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(winAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStonePress = useCallback((index: number) => {
    if (gameWon) return;

    const word = gameData.words[index];
    const isCorrect = gameData.correctWords.has(word);

    console.log(`[Game] Tapped: "${word}" | Correct: ${isCorrect}`);

    if (isCorrect) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
      }

      setStoneStates(prev => {
        const next = [...prev];
        next[index] = 'correct';
        return next;
      });

      setBridgeWords(prev => {
        const updated = [...prev, word];
        if (updated.length >= CORRECT_COUNT) {
          setTimeout(() => triggerWin(), 300);
        }
        return updated;
      });

      setScore(prev => prev + 10 + streak * 2);
      setStreak(prev => prev + 1);
    } else {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 100);
      }

      setStoneStates(prev => {
        const next = [...prev];
        next[index] = 'wrong';
        return next;
      });
      setStreak(0);
      setScore(prev => Math.max(0, prev - 5));

      const existingTimer = wrongTimers.current.get(index);
      if (existingTimer) clearTimeout(existingTimer);

      const timer = setTimeout(() => {
        setStoneStates(prev => {
          const next = [...prev];
          if (next[index] === 'wrong') next[index] = 'idle';
          return next;
        });
        wrongTimers.current.delete(index);
      }, 600);
      wrongTimers.current.set(index, timer);
    }
  }, [gameWon, gameData, streak, triggerWin]);

  const winOverlayOpacity = winAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const frogScale = frogLeapAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.8, 1.3],
  });

  const categoryGlow = headerGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.laserPink, Colors.electricCyan],
  });

  const progress = bridgeWords.length / CORRECT_COUNT;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.scoreBox}>
            <Trophy size={14} color={Colors.bridgeGold} />
            <Text style={styles.scoreText}>{score}</Text>
          </View>
          <View style={styles.levelBox}>
            <Zap size={14} color={Colors.laserPink} />
            <Text style={styles.levelText}>Level {level}</Text>
          </View>
        </View>

        <View style={styles.categoryRow}>
          <Text style={styles.categoryLabel}>Find all the</Text>
          <Animated.Text style={[styles.categoryName, { color: categoryGlow }]}>
            {gameData.category}
          </Animated.Text>
        </View>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <BridgePath filledCount={bridgeWords.length} words={bridgeWords} />

      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {gameData.words.map((word, index) => (
            <WordStone
              key={`${level}-${index}`}
              word={word}
              index={index}
              state={stoneStates[index]}
              onPress={handleStonePress}
            />
          ))}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {streak >= 3 && !gameWon && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {streak} streak!</Text>
          </View>
        )}
        <TouchableOpacity
          testID="reset-button"
          style={styles.resetBtn}
          onPress={resetGame}
          activeOpacity={0.7}
        >
          <RotateCcw size={18} color={Colors.textSecondary} />
          <Text style={styles.resetText}>New Round</Text>
        </TouchableOpacity>
      </View>

      {gameWon && (
        <Animated.View
          style={[styles.winOverlay, { opacity: winOverlayOpacity }]}
          pointerEvents={gameWon ? 'auto' : 'none'}
        >
          <Animated.Text style={[styles.winFrog, { transform: [{ scale: frogScale }] }]}>
            🐸
          </Animated.Text>
          <Text style={styles.winTitle}>Bridge Complete!</Text>
          <Text style={styles.winSubtitle}>Lexi made it across!</Text>
          <Text style={styles.winScore}>+{10 * CORRECT_COUNT + streak * 2} points</Text>
          <TouchableOpacity
            testID="next-level-button"
            style={styles.nextBtn}
            onPress={resetGame}
            activeOpacity={0.8}
          >
            <Text style={styles.nextBtnText}>Next Level →</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bridgeGoldDim,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
    color: Colors.bridgeGold,
    fontSize: 16,
    fontWeight: '800' as const,
  },
  levelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.laserPinkDim,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    color: Colors.laserPink,
    fontSize: 14,
    fontWeight: '700' as const,
  },
  categoryRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  categoryName: {
    fontSize: 28,
    fontWeight: '900' as const,
    letterSpacing: 1,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.hazeBlueDim,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.electricCyan,
    borderRadius: 2,
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    alignItems: 'center',
    gap: 10,
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 165, 0, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.3)',
  },
  streakText: {
    color: '#FFA500',
    fontSize: 14,
    fontWeight: '700' as const,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.hazeBlueDim,
  },
  resetText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  winOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 14, 26, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  winFrog: {
    fontSize: 72,
    marginBottom: 16,
  },
  winTitle: {
    color: Colors.neonGreen,
    fontSize: 32,
    fontWeight: '900' as const,
    letterSpacing: 1,
    marginBottom: 6,
  },
  winSubtitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '500' as const,
    marginBottom: 12,
  },
  winScore: {
    color: Colors.bridgeGold,
    fontSize: 20,
    fontWeight: '800' as const,
    marginBottom: 32,
  },
  nextBtn: {
    backgroundColor: Colors.electricCyan,
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 20,
  },
  nextBtnText: {
    color: Colors.midnight,
    fontSize: 18,
    fontWeight: '800' as const,
  },
});
