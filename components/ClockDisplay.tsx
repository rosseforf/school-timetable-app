import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSchool } from '@/contexts/SchoolContext';
import { DAY_NAMES } from '@/types/school';
import Colors from '@/constants/colors';

export default function ClockDisplay() {
  const insets = useSafeAreaInsets();
  const { getCurrentDayIndex, getShiftByTime, isHolidayToday } = useSchool();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const dayIndex = getCurrentDayIndex();
  const shift = getShiftByTime();
  const holiday = isHolidayToday();
  const dayName = dayIndex < 6 ? DAY_NAMES[dayIndex] : 'Yakshanba';

  return (
    <LinearGradient
      colors={['#0A1A2E', '#0E2440', '#0D2137']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + 16 }]}
    >
      <Text style={styles.clockText}>
        {hours}:{minutes}:{seconds}
      </Text>
      <Text style={styles.dayShiftText}>
        {dayName}, {shift}-smena
      </Text>
      {holiday && (
        <View style={styles.holidayBanner}>
          <Text style={styles.holidayIcon}>🎉</Text>
          <Text style={styles.holidayText}>Bugun bayram — {holiday.name}</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  clockText: {
    fontSize: 52,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  dayShiftText: {
    fontSize: 17,
    color: '#B0C4DE',
    fontWeight: '500' as const,
    marginTop: 4,
  },
  holidayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  holidayIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  holidayText: {
    fontSize: 14,
    color: Colors.warning,
    fontWeight: '600' as const,
  },
});
