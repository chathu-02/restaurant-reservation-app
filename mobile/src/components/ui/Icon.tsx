import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type IconName =
  | 'utensils'
  | 'calendar'
  | 'users'
  | 'grid'
  | 'clock'
  | 'chevron-right'
  | 'chevron-left'
  | 'plus'
  | 'minus'
  | 'gear'
  | 'table'
  | 'bell'
  | 'check'
  | 'close'
  | 'person'
  | 'phone'
  | 'arrow-back'
  | 'arrow-forward'
  | 'arrow-right'
  | 'eye'
  | 'eye-off'
  | 'lock'
  | 'leaf'
  | 'sparkles'
  | 'zap'
  | 'star'
  | 'edit'
  | 'trash'
  | 'logout'
  | 'card'
  | 'camera'
  | 'armchair'
  | 'help'
  | 'help-circle'
  | 'search'
  | 'x-circle'
  | 'command'
  | 'dot'
  | 'pencil'
  | 'message'
  | 'alert-triangle'
  | 'trash-outline'
  | 'mic'
  | 'filter'
  | 'chevron-down'
  | 'target'
  | 'walk'
  | 'chart'
  | 'more-vertical'
  | 'flash'
  | 'whatsapp'
  | 'refresh'
  | 'mail'
  | 'restaurant';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function Icon({ name, size = 20, color = '#111827', style }: IconProps) {
  switch (name) {
    case 'utensils':
      return <MaterialCommunityIcons name="silverware-fork-knife" size={size} color={color} style={style} />;
    case 'calendar':
      return <Ionicons name="calendar-outline" size={size} color={color} style={style} />;
    case 'users':
      return <Ionicons name="people-outline" size={size} color={color} style={style} />;
    case 'grid':
      return <Ionicons name="grid-outline" size={size} color={color} style={style} />;
    case 'clock':
      return <Ionicons name="time-outline" size={size} color={color} style={style} />;
    case 'chevron-right':
      return <Feather name="chevron-right" size={size} color={color} style={style} />;
    case 'chevron-left':
      return <Feather name="chevron-left" size={size} color={color} style={style} />;
    case 'chevron-down':
      return <Feather name="chevron-down" size={size} color={color} style={style} />;
    case 'arrow-back':
      return <Ionicons name="arrow-back" size={size} color={color} style={style} />;
    case 'arrow-forward':
      return <Ionicons name="arrow-forward" size={size} color={color} style={style} />;
    case 'arrow-right':
      return <Feather name="arrow-right" size={size} color={color} style={style} />;
    case 'plus':
      return <Feather name="plus" size={size} color={color} style={style} />;
    case 'minus':
      return <Feather name="minus" size={size} color={color} style={style} />;
    case 'gear':
      return <Ionicons name="settings-outline" size={size} color={color} style={style} />;
    case 'table':
      return <MaterialIcons name="table-restaurant" size={size} color={color} style={style} />;
    case 'bell':
      return <Ionicons name="notifications-outline" size={size} color={color} style={style} />;
    case 'check':
      return <Feather name="check" size={size} color={color} style={style} />;
    case 'close':
      return <Ionicons name="close" size={size} color={color} style={style} />;
    case 'person':
      return <Ionicons name="person-outline" size={size} color={color} style={style} />;
    case 'phone':
      return <Ionicons name="call-outline" size={size} color={color} style={style} />;
    case 'eye':
      return <Ionicons name="eye-outline" size={size} color={color} style={style} />;
    case 'eye-off':
      return <Ionicons name="eye-off-outline" size={size} color={color} style={style} />;
    case 'lock':
      return <Ionicons name="lock-closed-outline" size={size} color={color} style={style} />;
    case 'leaf':
      return <Ionicons name="leaf-outline" size={size} color={color} style={style} />;
    case 'sparkles':
      return <Ionicons name="sparkles" size={size} color={color} style={style} />;
    case 'edit':
      return <Feather name="edit-3" size={size} color={color} style={style} />;
    case 'trash':
      return <Feather name="trash-2" size={size} color={color} style={style} />;
    case 'logout':
      return <MaterialIcons name="logout" size={size} color={color} style={style} />;
    case 'card':
      return <Ionicons name="card-outline" size={size} color={color} style={style} />;
    case 'camera':
      return <Ionicons name="camera-outline" size={size} color={color} style={style} />;
    case 'armchair':
      return <MaterialCommunityIcons name="seat" size={size} color={color} style={style} />;
    case 'help':
      return <Ionicons name="help-circle-outline" size={size} color={color} style={style} />;
    case 'help-circle':
      return <Ionicons name="help-circle-outline" size={size} color={color} style={style} />;
    case 'search':
      return <Ionicons name="search-outline" size={size} color={color} style={style} />;
    case 'x-circle':
      return <Ionicons name="close-circle-outline" size={size} color={color} style={style} />;
    case 'command':
      return <Feather name="command" size={size} color={color} style={style} />;
    case 'pencil':
      return <Feather name="edit-3" size={size} color={color} style={style} />;
    case 'message':
      return <Ionicons name="chatbubble-outline" size={size} color={color} style={style} />;
    case 'alert-triangle':
      return <Feather name="alert-triangle" size={size} color={color} style={style} />;
    case 'trash-outline':
      return <Feather name="trash-2" size={size} color={color} style={style} />;
    case 'mic':
      return <Ionicons name="mic-outline" size={size} color={color} style={style} />;
    case 'filter':
      return <Ionicons name="filter-outline" size={size} color={color} style={style} />;
    case 'target':
      return <Feather name="target" size={size} color={color} style={style} />;
    case 'walk':
      return <MaterialCommunityIcons name="walk" size={size} color={color} style={style} />;
    case 'chart':
      return <Feather name="bar-chart-2" size={size} color={color} style={style} />;
    case 'more-vertical':
      return <Feather name="more-vertical" size={size} color={color} style={style} />;
    case 'flash':
      return <Ionicons name="flash-outline" size={size} color={color} style={style} />;
    case 'whatsapp':
      return <Ionicons name="logo-whatsapp" size={size} color={color} style={style} />;
    case 'refresh':
      return <Ionicons name="refresh-outline" size={size} color={color} style={style} />;
    case 'mail':
      return <Ionicons name="mail-outline" size={size} color={color} style={style} />;
    case 'restaurant':
      return <Ionicons name="restaurant-outline" size={size} color={color} style={style} />;
    case 'dot':
    default:
      return <Ionicons name="ellipse" size={size} color={color} style={style} />;
  }
}

export default Icon;
