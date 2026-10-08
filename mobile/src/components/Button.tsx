import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import Icon, { IconName } from './ui/Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'white' | 'outline' | 'ghost';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconColor?: string;
  iconSize?: number;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
  iconColor,
  iconSize = 18,
}: ButtonProps) {
  const getIconColor = () => {
    if (iconColor) return iconColor;
    if (variant === 'primary') return '#FFFFFF';
    if (variant === 'white') return '#374151';
    if (variant === 'secondary') return '#009669';
    return '#111827';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : '#009669'}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Icon name={icon} size={iconSize} color={getIconColor()} />
          )}
          <Text
            style={[
              styles.label,
              styles[`${variant}Text`],
              disabled && styles.disabledText,
              textStyle,
            ]}>
            {label}
          </Text>
          {icon && iconPosition === 'right' && (
            <Icon name={icon} size={iconSize} color={getIconColor()} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
  // Variants
  primary: {
    backgroundColor: '#009669',
    shadowColor: '#009669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  secondary: {
    backgroundColor: '#E6F8F0',
  },
  secondaryText: {
    color: '#00875A',
  },
  white: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBF0EE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  whiteText: {
    color: '#111827',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#009669',
  },
  outlineText: {
    color: '#009669',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: '#6B7280',
  },
  disabledText: {
    color: '#9CA3AF',
  },
});

export default Button;
