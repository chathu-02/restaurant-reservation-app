import { Logo } from "@/components/logo";
import { BRAND } from "@/lib/brand";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const SLIDES = [
  {
    id: "1",
    tag: "Fine Dining Experience",
    image: require("../../../assets/images/onboarding1.jpg"),
    text: "Reserve your ideal table before you arrive and skip the long wait on busy nights.",
    shiftRatio: 0.22,
  },
  {
    id: "2",
    tag: "Live Waitlist",
    image: require("../../../assets/images/onboarding2.jpg"),
    text: "Join the virtual queue from anywhere and watch your live position update in real time.",
    shiftRatio: 0.10,
  },
  {
    id: "3",
    tag: "Smart Notifications",
    image: require("../../../assets/images/onboarding3.jpg"),
    text: "Get an instant alert the exact moment your table is ready, so you can walk right in.",
    shiftRatio: 0.10,
  },
];

const Paginator = ({
  data,
  scrollX,
  width,
}: {
  data: any[];
  scrollX: Animated.Value;
  width: number;
}) => {
  return (
    <View style={styles.paginatorContainer}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 30, 8],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.35, 1, 0.35],
          extrapolate: "clamp",
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: [
            "rgba(255, 255, 255, 0.35)",
            "#10B981",
            "rgba(255, 255, 255, 0.35)",
          ],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={i.toString()}
            style={[
              styles.dot,
              { width: dotWidth, opacity, backgroundColor },
            ]}
          />
        );
      })}
    </View>
  );
};

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const [showSplash, setShowSplash] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);

  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  // Splash Screen Animations
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const listenerId = scrollX.addListener(({ value }) => {
      const index = Math.round(value / width);
      if (index !== currentIndexRef.current && index >= 0 && index < SLIDES.length) {
        currentIndexRef.current = index;
        setCurrentIndex(index);
      }
    });
    return () => scrollX.removeListener(listenerId);
  }, [scrollX, width]);

  useEffect(() => {
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }).start(() => setShowSplash(false));
    }, 1800);

    return () => clearTimeout(timer);
  }, [logoScale, splashOpacity]);

  const finish = () => router.replace("/role-choice" as never);

  const scrollToNext = () => {
    if (currentIndexRef.current < SLIDES.length - 1) {
      const nextIndex = currentIndexRef.current + 1;
      const offset = nextIndex * width;
      if (slidesRef.current?.scrollToOffset) {
        slidesRef.current.scrollToOffset({ offset, animated: true });
      } else {
        slidesRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }
    } else {
      finish();
    }
  };

  if (showSplash) {
    return (
      <View
        style={[
          styles.screen,
          styles.center,
          {
            backgroundColor: "#FFFFFF",
            position: "absolute",
            width,
            height,
            zIndex: 100,
          },
        ]}
      >
        <StatusBar style="dark" />
        <Animated.View
          style={{
            alignItems: "center",
            opacity: splashOpacity,
            transform: [{ scale: logoScale }],
          }}
        >
          <Logo size={240} />
          <Text style={styles.splashName}>{BRAND.name}</Text>
          <View style={styles.splashTaglineContainer}>
            <Text style={styles.splashTagline}>
              {BRAND.tagline.toUpperCase()}
            </Text>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Fullscreen Swipable Slides */}
      <Animated.FlatList
        ref={slidesRef}
        data={SLIDES}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          // Gentle parallax zoom for the background photo
          const imageScale = scrollX.interpolate({
            inputRange,
            outputRange: [1.12, 1, 1.12],
            extrapolate: "clamp",
          });

          // Text entrance motion
          const textTranslateY = scrollX.interpolate({
            inputRange,
            outputRange: [40, 0, 40],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: "clamp",
          });

          const shift = item.shiftRatio ?? 0.12;

          return (
            <View style={[styles.slideContainer, { width, height }]}>
              {/* Fullscreen Background Photo shifted upwards */}
              <Animated.Image
                source={item.image}
                style={[
                  styles.bgImage,
                  {
                    height: height * (1 + shift + 0.15),
                    top: -height * shift,
                    transform: [{ scale: imageScale }],
                  },
                ]}
                resizeMode="cover"
              />

              {/* Cinematic Rich Color & Gradient Overlay */}
              <LinearGradient
                colors={[
                  "rgba(2, 22, 17, 0.45)",
                  "rgba(2, 22, 17, 0.05)",
                  "rgba(2, 22, 17, 0.7)",
                  "rgba(2, 22, 17, 0.96)",
                  "#021611",
                ]}
                locations={[0, 0.18, 0.44, 0.68, 1]}
                style={StyleSheet.absoluteFill}
              />

              {/* Slide Content positioned above bottom controls */}
              <View
                style={[
                  styles.slideContent,
                  {
                    paddingBottom: Math.max(insets.bottom, 24) + 124,
                  },
                ]}
              >
                <Animated.View
                  style={{
                    alignItems: "center",
                    transform: [{ translateY: textTranslateY }],
                    opacity,
                  }}
                >
                  <Text style={styles.tagText}>{item.tag}</Text>
                  <Text style={styles.body}>{item.text}</Text>
                </Animated.View>
              </View>
            </View>
          );
        }}
      />

      {/* Floating Top Navigation Bar */}
      <SafeAreaView
        edges={["top"]}
        style={styles.topBarContainer}
        pointerEvents="box-none"
      >
        <View />

        {currentIndex < SLIDES.length - 1 ? (
          <Pressable
            onPress={finish}
            style={({ pressed }) => [
              styles.skipButton,
              pressed && styles.skipButtonPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.skipText}>Skip</Text>
            <Ionicons name="chevron-forward" size={14} color="#D1D5DB" />
          </Pressable>
        ) : null}
      </SafeAreaView>

      {/* Bottom Controls (Paginator & Action Button) */}
      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: Math.max(insets.bottom, 24) + 12 },
        ]}
        pointerEvents="box-none"
      >
        <Paginator data={SLIDES} scrollX={scrollX} width={width} />

        <Pressable
          style={({ pressed }) => [
            styles.buttonPressable,
            pressed && styles.buttonPressed,
          ]}
          accessibilityRole="button"
          onPress={scrollToNext}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {currentIndex === SLIDES.length - 1 ? "Get Started" : "Continue"}
            </Text>
            <Ionicons
              name={
                currentIndex === SLIDES.length - 1
                  ? "arrow-forward-circle"
                  : "arrow-forward"
              }
              size={18}
              color="#FFFFFF"
              style={{ marginLeft: 6 }}
            />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#021611",
  },
  screen: {
    flex: 1,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  splashName: {
    fontFamily: "Georgia",
    fontSize: 40,
    color: "#064E3B",
    marginTop: 18,
    letterSpacing: 1.2,
    textAlign: "center",
  },
  splashTaglineContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  splashTagline: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#047857",
    fontSize: 12,
    letterSpacing: 3,
  },

  // Slide Layout
  slideContainer: {
    position: "relative",
    overflow: "hidden",
  },
  bgImage: {
    position: "absolute",
    left: 0,
    right: 0,
    width: "100%",
  },
  slideContent: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  // Headline (system serif fallback keeps onboarding portable)
  tagText: {
    fontFamily: "Georgia",
    fontSize: 36,
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.8,
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 8,
  },
  // Subtitle / Body copy (Plus Jakarta Sans - Clean Modern Sans-serif)
  body: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 15,
    lineHeight: 24,
    color: "#E2E8F0",
    textAlign: "center",
    paddingHorizontal: 16,
    letterSpacing: 0.2,
  },

  // Top Bar
  topBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 12,
    zIndex: 20,
  },

  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.22)",
  },
  skipButtonPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.26)",
    transform: [{ scale: 0.96 }],
  },
  skipText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },

  // Bottom Controls
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    zIndex: 20,
  },
  paginatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 24,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonPressable: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  buttonGradient: {
    height: 48,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  buttonText: {
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#FFFFFF",
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});
