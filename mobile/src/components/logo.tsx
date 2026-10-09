import { Image, View } from "react-native";
import { LOGO } from "@/lib/brand";

// badge puts the logo on a white rounded tile, which helps dark logos stand out on the green banner
export function Logo({ size = 72, badge }: { size?: number; color?: string; badge?: boolean }) {
  const image = (
    <Image
      source={LOGO}
      style={{ width: size, height: size }}
      resizeMode="contain"
      accessibilityLabel="Restaurant logo"
    />
  );
  if (!badge) return image;
  return (
    <View style={{ backgroundColor: "#fff", borderRadius: size * 0.25, padding: size * 0.12 }}>
      {image}
    </View>
  );
}