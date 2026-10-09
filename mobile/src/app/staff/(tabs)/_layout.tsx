import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Platform } from "react-native";

const EMERALD_PRIMARY = "#059669";
const EMERALD_DARK = "#047857";
const EMERALD_LIGHT = "#ECFDF5";
const EMERALD_BORDER = "#6EE7B7";
const INACTIVE_ICON = "#1E293B";
const INACTIVE_TEXT = "#334155";

interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  focusedName: keyof typeof Ionicons.glyphMap;
  focused: boolean;
}

function NavIcon({ name, focusedName, focused }: TabIconProps) {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Ionicons
        name={focused ? focusedName : name}
        size={19}
        color={focused ? EMERALD_PRIMARY : INACTIVE_ICON}
      />
    </View>
  );
}

export default function StaffTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: EMERALD_DARK,
        tabBarInactiveTintColor: INACTIVE_TEXT,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <NavIcon name="grid-outline" focusedName="grid" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: "Reservations",
          tabBarIcon: ({ focused }) => (
            <NavIcon name="calendar-outline" focusedName="calendar" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tables"
        options={{
          title: "Tables",
          tabBarIcon: ({ focused }) => (
            <NavIcon name="albums-outline" focusedName="albums" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="queue"
        options={{
          title: "Queue",
          tabBarIcon: ({ focused }) => (
            <NavIcon name="people-outline" focusedName="people" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ focused }) => (
            <NavIcon name="notifications-outline" focusedName="notifications" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1.5,
    borderTopColor: "#E2E8F0",
    height: Platform.OS === "ios" ? 88 : 74,
    paddingTop: 5,
    paddingBottom: Platform.OS === "ios" ? 24 : 8,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
  },
  tabBarItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarLabel: {
    fontSize: 10.5,
    fontWeight: "700",
    marginTop: 1,
    letterSpacing: 0.2,
  },
  iconContainer: {
    width: 44,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIconContainer: {
    backgroundColor: EMERALD_LIGHT,
    borderWidth: 1.5,
    borderColor: EMERALD_BORDER,
    shadowColor: EMERALD_PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
});

