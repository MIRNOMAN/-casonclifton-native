import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Heart, Home, UserCircle2 } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

type CustomTabBarItemProps = {
  isFocused: boolean;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
};

function CustomTabBarItem({ isFocused, label, icon, onPress }: CustomTabBarItemProps) {
  const scale = useRef(new Animated.Value(isFocused ? 1 : 0.96)).current;
  const labelOpacity = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const iconScale = useRef(new Animated.Value(isFocused ? 1 : 0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: isFocused ? 1 : 0.96,
        useNativeDriver: true,
        friction: 8,
        tension: 120,
      }),
      Animated.spring(iconScale, {
        toValue: isFocused ? 1 : 0.92,
        useNativeDriver: true,
        friction: 8,
        tension: 120,
      }),
      Animated.timing(labelOpacity, {
        toValue: isFocused ? 1 : 0,
        duration: isFocused ? 220 : 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [iconScale, isFocused, labelOpacity, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPress={onPress} style={[styles.slot, isFocused && styles.focusedSlot]}>
        <Animated.View
          style={[
            styles.iconWrap,
            isFocused ? styles.focusedIconWrap : styles.idleIconWrap,
            { transform: [{ scale: iconScale }] },
          ]}>
          {icon}
        </Animated.View>
        {isFocused ? (
          <Animated.Text style={[styles.focusedLabel, { opacity: labelOpacity }]}>
            {label}
          </Animated.Text>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        <BlurView
          intensity={52}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.barOverlay} pointerEvents="none" />
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const options = descriptors[route.key]?.options;
          const label = options?.title ?? route.name;

          const icon =
            route.name === 'index' ? (
              <Home size={20} color="#FFFFFF" fill="#FFFFFF" />
            ) : route.name === 'settings' ? (
              <Heart size={20} color="#FFFFFF" fill="transparent" />
            ) : (
              <UserCircle2 size={20} color="#FFFFFF" />
            );

          return (
            <CustomTabBarItem
              key={route.key}
              isFocused={isFocused}
              label={label}
              icon={icon}
              onPress={() => navigation.navigate(route.name)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 24,
  },
  bar: {
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1F232A',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.24,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },
  barOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 26, 44, 0.24)',
  },
  slot: {
    minWidth: 54,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 8,
  },
  focusedSlot: {
    backgroundColor: '#FFFFFF',
    minWidth: 140,
    justifyContent: 'flex-start',
    paddingLeft: 8,
    paddingRight: 18,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusedIconWrap: {
    backgroundColor: '#08162D',
  },
  idleIconWrap: {
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  focusedLabel: {
    color: '#0D1117',
    fontSize: 14,
    fontWeight: '700',
  },
});
