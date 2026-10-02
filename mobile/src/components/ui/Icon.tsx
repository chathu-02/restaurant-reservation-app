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
  | 'target'
  | 'clock'
  | 'chevron-right'
  | 'plus'
  | 'walk'
  | 'gear'
  | 'table'
  | 'chart'
  | 'bell'
  | 'check'
  | 'close'
  | 'person'
  | 'phone'
  | 'arrow-back'
  | 'dot';

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
    case 'target':
      return <MaterialCommunityIcons name="target" size={size} color={color} style={style} />;
    case 'clock':
      return <Ionicons name="time-outline" size={size} color={color} style={style} />;
    case 'chevron-right':
      return <Feather name="chevron-right" size={size} color={color} style={style} />;
    case 'plus':
      return <Feather name="plus" size={size} color={color} style={style} />;
    case 'walk':
      return <MaterialCommunityIcons name="walk" size={size} color={color} style={style} />;
    case 'gear':
      return <Ionicons name="settings-outline" size={size} color={color} style={style} />;
    case 'table':
      return <MaterialIcons name="table-restaurant" size={size} color={color} style={style} />;
    case 'chart':
      return <Ionicons name="bar-chart-outline" size={size} color={color} style={style} />;
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
    case 'arrow-back':
      return <Ionicons name="arrow-back" size={size} color={color} style={style} />;
    case 'dot':
      return <Ionicons name="ellipse" size={size} color={color} style={style} />;
    default:
      return <Ionicons name="ellipse" size={size} color={color} style={style} />;
  }
}

export default Icon;
