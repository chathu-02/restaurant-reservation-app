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
<<<<<<< HEAD
  | 'target'
  | 'clock'
  | 'chevron-right'
  | 'chevron-down'
  | 'plus'
  | 'walk'
  | 'gear'
  | 'table'
  | 'chart'
=======
  | 'clock'
  | 'chevron-right'
  | 'chevron-left'
  | 'plus'
  | 'minus'
  | 'gear'
  | 'table'
>>>>>>> origin/feature/customer-staff
  | 'bell'
  | 'check'
  | 'close'
  | 'person'
  | 'phone'
  | 'arrow-back'
<<<<<<< HEAD
  | 'dot'
  | 'search'
  | 'mic'
  | 'filter'
  | 'star'
  | 'alert-triangle'
  | 'book'
  | 'print'
  | 'more-vertical'
  | 'message'
  | 'refresh'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'id-card'
  | 'arrow-forward'
  | 'mail'
  | 'help-circle'
  | 'pencil'
  | 'flash'
  | 'sun'
  | 'wine'
  | 'whatsapp'
  | 'trash-outline';
=======
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
  | 'search'
  | 'x-circle'
  | 'command'
  | 'dot';
>>>>>>> origin/feature/customer-staff

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
<<<<<<< HEAD
    case 'target':
      return <MaterialCommunityIcons name="target" size={size} color={color} style={style} />;
=======
>>>>>>> origin/feature/customer-staff
    case 'clock':
      return <Ionicons name="time-outline" size={size} color={color} style={style} />;
    case 'chevron-right':
      return <Feather name="chevron-right" size={size} color={color} style={style} />;
<<<<<<< HEAD
    case 'chevron-down':
      return <Feather name="chevron-down" size={size} color={color} style={style} />;
    case 'plus':
      return <Feather name="plus" size={size} color={color} style={style} />;
    case 'walk':
      return <MaterialCommunityIcons name="walk" size={size} color={color} style={style} />;
=======
    case 'chevron-left':
    case 'arrow-back':
      return <Ionicons name="arrow-back" size={size} color={color} style={style} />;
    case 'arrow-right':
      return <Feather name="arrow-right" size={size} color={color} style={style} />;
    case 'plus':
      return <Feather name="plus" size={size} color={color} style={style} />;
    case 'minus':
      return <Feather name="minus" size={size} color={color} style={style} />;
>>>>>>> origin/feature/customer-staff
    case 'gear':
      return <Ionicons name="settings-outline" size={size} color={color} style={style} />;
    case 'table':
      return <MaterialIcons name="table-restaurant" size={size} color={color} style={style} />;
<<<<<<< HEAD
    case 'chart':
      return <Ionicons name="bar-chart-outline" size={size} color={color} style={style} />;
=======
>>>>>>> origin/feature/customer-staff
    case 'bell':
      return <Ionicons name="notifications-outline" size={size} color={color} style={style} />;
    case 'check':
      return <Feather name="check" size={size} color={color} style={style} />;
    case 'close':
      return <Ionicons name="close" size={size} color={color} style={style} />;
    case 'person':
      return <Ionicons name="person-outline" size={size} color={color} style={style} />;
    case 'phone':
<<<<<<< HEAD
      return <Ionicons name="call" size={size} color={color} style={style} />;
    case 'arrow-back':
      return <Ionicons name="arrow-back" size={size} color={color} style={style} />;
    case 'arrow-forward':
      return <Ionicons name="arrow-forward" size={size} color={color} style={style} />;
    case 'dot':
      return <Ionicons name="ellipse" size={size} color={color} style={style} />;
    case 'search':
      return <Ionicons name="search-outline" size={size} color={color} style={style} />;
    case 'mic':
      return <Ionicons name="mic-outline" size={size} color={color} style={style} />;
    case 'filter':
      return <Ionicons name="options-outline" size={size} color={color} style={style} />;
    case 'star':
      return <Ionicons name="star" size={size} color={color} style={style} />;
    case 'alert-triangle':
      return <Feather name="alert-triangle" size={size} color={color} style={style} />;
    case 'book':
      return <Ionicons name="book-outline" size={size} color={color} style={style} />;
    case 'print':
      return <Ionicons name="print-outline" size={size} color={color} style={style} />;
    case 'more-vertical':
      return <Ionicons name="ellipsis-vertical" size={size} color={color} style={style} />;
    case 'message':
      return <Ionicons name="chatbubble-outline" size={size} color={color} style={style} />;
    case 'refresh':
      return <Ionicons name="refresh-outline" size={size} color={color} style={style} />;
    case 'lock':
      return <Ionicons name="lock-closed-outline" size={size} color={color} style={style} />;
=======
      return <Ionicons name="call-outline" size={size} color={color} style={style} />;
>>>>>>> origin/feature/customer-staff
    case 'eye':
      return <Ionicons name="eye-outline" size={size} color={color} style={style} />;
    case 'eye-off':
      return <Ionicons name="eye-off-outline" size={size} color={color} style={style} />;
<<<<<<< HEAD
    case 'id-card':
      return <MaterialCommunityIcons name="badge-account-horizontal-outline" size={size} color={color} style={style} />;
    case 'mail':
      return <Ionicons name="mail-outline" size={size} color={color} style={style} />;
    case 'help-circle':
      return <Ionicons name="help-circle-outline" size={size} color={color} style={style} />;
    case 'pencil':
      return <Ionicons name="pencil" size={size} color={color} style={style} />;
    case 'flash':
      return <Ionicons name="flash" size={size} color={color} style={style} />;
    case 'sun':
      return <Ionicons name="sunny-outline" size={size} color={color} style={style} />;
    case 'wine':
      return <Ionicons name="wine-outline" size={size} color={color} style={style} />;
    case 'whatsapp':
      return <Ionicons name="logo-whatsapp" size={size} color={color} style={style} />;
    case 'trash-outline':
      return <Ionicons name="trash-outline" size={size} color={color} style={style} />;
=======
    case 'lock':
      return <Ionicons name="lock-closed-outline" size={size} color={color} style={style} />;
    case 'leaf':
      return <Ionicons name="leaf-outline" size={size} color={color} style={style} />;
    case 'sparkles':
      return <Ionicons name="sparkles" size={size} color={color} style={style} />;
    case 'zap':
      return <Ionicons name="flash" size={size} color={color} style={style} />;
    case 'star':
      return <Ionicons name="star" size={size} color={color} style={style} />;
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
    case 'search':
      return <Ionicons name="search-outline" size={size} color={color} style={style} />;
    case 'x-circle':
      return <Ionicons name="close-circle-outline" size={size} color={color} style={style} />;
    case 'command':
      return <Feather name="command" size={size} color={color} style={style} />;
    case 'dot':
>>>>>>> origin/feature/customer-staff
    default:
      return <Ionicons name="ellipse" size={size} color={color} style={style} />;
  }
}

export default Icon;
