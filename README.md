# Lexi-Leap Frog Game

A delightful word puzzle game where you help Lexi the frog hop across the river by finding the right words!

![Made with Expo](https://img.shields.io/badge/Made%20with-Expo-000020.svg?logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-61DAFB.svg?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?logo=typescript&logoColor=white)

---

## How to Play

1. **Your Mission**: Help Lexi the frog 🐸 cross the river by building a word bridge!
2. **Find the Category**: Each round, look for words belonging to a secret category
3. **Build the Bridge**: Find **8 correct words** to complete the bridge and help Lexi reach the finish line 🏁
4. **Watch Out**: Wrong answers break your streak - but you can keep trying!

### Categories to Master
- 🦁 **Animals** — Lion, Bear, Tiger, and more
- 🎨 **Colors** — Red, Blue, Purple, and more
- 🔷 **Shapes** — Circle, Triangle, Hexagon, and more
- 🍎 **Fruits** — Apple, Banana, Mango, and more

---

## Features

✨ **Engaging Gameplay**
- 4x4 grid of floating word stones
- Progressive difficulty across levels
- Score tracking with streak multipliers
- Animated frog celebration when you win!

🎨 **Neon Visual Theme**
- Stunning dark aesthetics with midnight backgrounds
- Electric cyan and laser pink accents
- Smooth animations and haptic feedback
- Minimalist, modern design

📱 **Cross-Platform**
- Native iOS support
- Native Android support
- Web browser compatible

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Expo](https://expo.dev) | React Native framework |
| [Expo Router](https://docs.expo.dev/router/introduction/) | File-based navigation |
| [React Native](https://reactnative.dev) | Native mobile UI |
| [TypeScript](https://www.typescriptlang.org) | Type-safe code |
| [React Query](https://tanstack.com/query) | State management |
| [Lucide](https://lucide.dev) | Beautiful icons |
| [Zustand](https://zustand-demo.pmnd.rs) | Local state |

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (via [nvm](https://github.com/nvm-sh/nvm))
- [Bun](https://bun.sh/docs/installation)

### Installation

```bash
# Clone the repository
git clone https://github.com/aiagentmackenzie-lang/Lexi-leap-frog-game.git
cd Lexi-leap-frog-game

# Install dependencies
bun install

# Start development server
bun run start
```

### Running on Device

**iOS Simulator:**
```bash
bun run start -- --ios
```

**Android Emulator:**
```bash
bun run start -- --android
```

**Web Browser:**
```bash
bun run start-web
```

### Testing on Physical Device

1. Download [Expo Go](https://expo.dev/go) from the App Store or Google Play
2. Scan the QR code from the development server
3. Start playing!

---

## Screenshots

| Game Grid | Bridge Building | Victory! |
|-----------|-----------------|----------|
| Word stones floating on midnight background | Progress across the river | 🐸 Lexi hops to victory |

---

## Project Structure

```
Lexi-leap-frog-game/
├── app/
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Main game screen
│   ├── +not-found.tsx       # 404 screen
│   └── +native-intent.tsx   # Native intent handler
├── components/
│   ├── BridgePath.tsx       # Bridge visualization
│   └── WordStone.tsx        # Interactive word tiles
├── constants/
│   ├── Colors.ts            # Neon color palette
│   └── wordBanks.ts         # Word categories & game logic
├── assets/
│   └── images/              # App icons & splash
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript config
```

---

## Game Logic

The game generates a 4x4 grid (16 stones) with:
- **8 correct words** from the target category
- **8 distractor words** from other categories

Players tap word stones to build the bridge. Correct answers earn 10+ points (with streak bonuses), while wrong answers cost 5 points.

---

## Building for Production

### iOS App Store

```bash
# Install EAS CLI
bun i -g @expo/eas-cli

# Configure and build
eas build:configure
eas build --platform ios
eas submit --platform ios
```

### Google Play Store

```bash
eas build --platform android
eas submit --platform android
```

Learn more at [Expo's deployment guides](https://docs.expo.dev/submit/introduction/).

---

## Credits

**Designed & Developed by:**
- **Raphael Main** — Creative Director
- **Agent Mackenzie** — AI Developer & Co-Creator

📧 [aiagent.mackenzie@gmail.com](mailto:aiagent.mackenzie@gmail.com)

---

## License

MIT License — Feel free to fork, modify, and share!

---

<p align="center">Made with 💚 and a few hops from Lexi 🐸</p>
