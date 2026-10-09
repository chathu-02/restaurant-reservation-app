import { Logo } from "@/components/logo";
import { BRAND } from "@/lib/brand";
import { useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { Pressable, StyleSheet, Text, View, Animated, Dimensions, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');

const SLIDES = [
  { id: "1", image: require("../../../assets/images/onboarding1.jpg"), title: "Book Ahead", text: "Reserve a table before you arrive and skip the wait on busy nights." },
  { id: "2", image: require("../../../assets/images/onboarding2.jpg"), title: "Skip the Crowd", text: "Join the queue from anywhere and watch your position update live." },
  { id: "3", image: require("../../../assets/images/onboarding3.jpg"), title: "Stay Updated", text: "Get an alert in the app the moment your table is ready." },
];

const Paginator = ({ data, scrollX }: { data: any[], scrollX: Animated.Value }) => {
  return (
    <View style={styles.paginatorContainer}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 32, 10],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4],
          extrapolate: 'clamp',
        });

        const color = scrollX.interpolate({
          inputRange,
          outputRange: ["#BFCBC5", "#10B981", "#BFCBC5"],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i.toString()}
            style={[
              styles.dot,
              { width: dotWidth, opacity, backgroundColor: color },
            ]}
          />
        );
      })}
    </View>
  );
};

export default function Onboarding() {
  const router = useRouter();
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
      if (index !== currentIndexRef.current) {
        currentIndexRef.current = index;
        setCurrentIndex(index); // Force re-render for button text
      }
    });
    return () => scrollX.removeListener(listenerId);
  }, [scrollX]);

  useEffect(() => {
    // Splash entrance
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      // Fade out splash
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => setShowSplash(false));
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const finish = () => router.replace("/role-choice" as never);

  const scrollToNext = () => {
    if (currentIndexRef.current < SLIDES.length - 1) {
      const nextIndex = currentIndexRef.current + 1;
      const offset = nextIndex * width;
      // Try multiple methods to support different RN/Animated.FlatList versions
      if (slidesRef.current?.scrollToOffset) {
        slidesRef.current.scrollToOffset({ offset, animated: true });
      } else if ((slidesRef.current as any)?.getNode) {
        (slidesRef.current as any).getNode().scrollToOffset({ offset, animated: true });
      } else {
        slidesRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }
    } else {
      finish();
    }
  };

  if (showSplash) {
    return (
      <View style={[styles.screen, styles.center, { backgroundColor: "#F0FDF4", position: 'absolute', width, height, zIndex: 100 }]}>
        <Animated.View style={{ alignItems: 'center', opacity: splashOpacity, transform: [{ scale: logoScale }] }}>
          <Logo size={240} color="#064E3B" />
          <Text style={[styles.name, { color: "#064E3B" }]}>{BRAND.name}</Text>
          <Text style={{ color: "#047857", fontSize: 14, letterSpacing: 3, marginTop: 8, fontWeight: '600' }}>
            {BRAND.tagline.toUpperCase()}
          </Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F0FDF4" }}>
      <SafeAreaView style={styles.screen}>
        <View style={styles.topRow}>
          <Pressable onPress={finish} style={styles.skip} accessibilityRole="button">
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <Animated.FlatList
          ref={slidesRef}
          data={SLIDES}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          renderItem={({ item, index }) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

            const imageScale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1, 0.8],
              extrapolate: 'clamp',
            });

            const textTranslateY = scrollX.interpolate({
              inputRange,
              outputRange: [50, 0, 50],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0, 1, 0],
              extrapolate: 'clamp',
            });

            return (
              <View style={[styles.slideContainer, { width }]}>
                <Animated.View 
                  style={[
                    styles.imageContainer, 
                    { 
                      transform: [{ scale: imageScale }],
                      opacity
                    }
                  ]}
                >
                  <Image 
                    source={item.image} 
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay} />
                </Animated.View>

                <Animated.View 
                  style={{ 
                    alignItems: 'center',
                    transform: [{ translateY: textTranslateY }],
                    opacity
                  }}
                >
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.body}>{item.text}</Text>
                </Animated.View>
              </View>
            );
          }}
        />

        <View style={styles.bottomContainer}>
          <Paginator data={SLIDES} scrollX={scrollX} />
          
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }
            ]}
            accessibilityRole="button"
            onPress={scrollToNext}
          >
            <Text style={styles.buttonText}>
              {currentIndex === SLIDES.length - 1 ? "Get Started" : "Continue"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center" },
  name: { fontSize: 32, fontWeight: "800", marginTop: 16 },
  
  topRow: { 
    alignItems: "flex-end", 
    zIndex: 10,
    paddingHorizontal: 24,
    paddingTop: 12
  },
  skip: { minHeight: 44, justifyContent: "center" },
  skipText: { fontSize: 16, color: "#047857", fontWeight: "600" },

  slideContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: width * 0.85,
    height: width * 0.85,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
    borderRadius: 36,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(6, 78, 59, 0.15)",
  },
  
  title: { 
    fontSize: 34, 
    fontWeight: "900", 
    color: "#064E3B", 
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  body: { 
    fontSize: 18, 
    lineHeight: 28, 
    color: "#55645D", 
    textAlign: "center", 
    paddingHorizontal: 16,
    fontWeight: "400"
  },
  
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  paginatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    marginBottom: 20,
  },
  dot: { 
    height: 8, 
    borderRadius: 4, 
    marginHorizontal: 5,
  },
  button: { 
    height: 64, 
    borderRadius: 20, 
    backgroundColor: "#10B981", 
    alignItems: "center", 
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonText: { 
    color: "#FFFFFF", 
    fontSize: 19, 
    fontWeight: "800",
    letterSpacing: 1
  },
});