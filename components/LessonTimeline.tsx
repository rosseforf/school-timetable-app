import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSchool } from '@/contexts/SchoolContext';
import Colors from '@/constants/colors';

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export default function LessonTimeline() {
  const { lessonTimes, getShiftByTime, getCurrentLessonInfo } = useSchool();
  const [currentShift, setCurrentShift] = useState(getShiftByTime());
  const [info, setInfo] = useState(getCurrentLessonInfo(currentShift));

  useEffect(() => {
    const interval = setInterval(() => {
      const shift = getShiftByTime();
      setCurrentShift(shift);
      setInfo(getCurrentLessonInfo(shift));
    }, 1000);
    return () => clearInterval(interval);
  }, [getShiftByTime, getCurrentLessonInfo]);

  const shiftTimes = lessonTimes
    .filter(lt => lt.shift === currentShift)
    .sort((a, b) => a.lessonNumber - b.lessonNumber);

  if (shiftTimes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Dars jadvali</Text>
        <Text style={styles.emptyText}>Dars vaqtlari kiritilmagan</Text>
      </View>
    );
  }

  const items: Array<{
    type: 'lesson' | 'break';
    lessonNumber: number;
    startTime: string;
    endTime: string;
    duration: number;
    isCurrent: boolean;
  }> = [];

  for (let i = 0; i < shiftTimes.length; i++) {
    const lt = shiftTimes[i];
    const isCurrentLesson = info.type === 'lesson' && info.lessonNumber === lt.lessonNumber;
    items.push({
      type: 'lesson',
      lessonNumber: lt.lessonNumber,
      startTime: lt.startTime,
      endTime: lt.endTime,
      duration: timeToMinutes(lt.endTime) - timeToMinutes(lt.startTime),
      isCurrent: isCurrentLesson,
    });

    if (i < shiftTimes.length - 1) {
      const next = shiftTimes[i + 1];
      const breakDuration = timeToMinutes(next.startTime) - timeToMinutes(lt.endTime);
      const isCurrentBreak = info.type === 'break' && info.lessonNumber === lt.lessonNumber;
      if (breakDuration > 0) {
        items.push({
          type: 'break',
          lessonNumber: lt.lessonNumber,
          startTime: lt.endTime,
          endTime: next.startTime,
          duration: breakDuration,
          isCurrent: isCurrentBreak,
        });
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dars jadvali</Text>
      <View style={styles.timeline}>
        {items.map((item, index) => (
          <View key={`${item.type}-${item.lessonNumber}-${index}`} style={styles.timelineRow}>
            <View style={styles.lineContainer}>
              <View style={[
                styles.dot,
                item.isCurrent && styles.dotActive,
                item.type === 'break' && !item.isCurrent && styles.dotBreak,
              ]} />
              {index < items.length - 1 && (
                <View style={[
                  styles.line,
                  item.isCurrent && styles.lineActive,
                ]} />
              )}
            </View>
            <View style={[
              styles.itemCard,
              item.isCurrent && (item.type === 'lesson' ? styles.itemCardActive : styles.itemCardBreakActive),
              item.type === 'break' && !item.isCurrent && styles.itemCardBreak,
            ]}>
              {item.type === 'lesson' ? (
                <View style={styles.lessonContent}>
                  <View style={styles.lessonHeader}>
                    <Text style={[styles.lessonLabel, item.isCurrent && styles.lessonLabelActive]}>
                      {item.lessonNumber}-dars
                    </Text>
                    <Text style={[styles.durationText, item.isCurrent && styles.durationActive]}>
                      {item.duration} daq
                    </Text>
                  </View>
                  <Text style={[styles.timeRange, item.isCurrent && styles.timeRangeActive]}>
                    {item.startTime} – {item.endTime}
                  </Text>
                </View>
              ) : (
                <View style={styles.breakContent}>
                  <Text style={[styles.breakLabel, item.isCurrent && styles.breakLabelActive]}>
                    Tanaffus
                  </Text>
                  <Text style={[styles.breakTime, item.isCurrent && styles.breakTimeActive]}>
                    {item.duration} daqiqa  ·  {item.startTime} – {item.endTime}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 14,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  timeline: {},
  timelineRow: {
    flexDirection: 'row',
    minHeight: 48,
  },
  lineContainer: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.textMuted,
    marginTop: 14,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 13,
  },
  dotBreak: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 10,
    backgroundColor: Colors.border,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
  },
  lineActive: {
    backgroundColor: Colors.primaryDark,
  },
  itemCard: {
    flex: 1,
    marginLeft: 10,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.cardBg,
  },
  itemCardActive: {
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.25)',
  },
  itemCardBreak: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
  },
  itemCardBreakActive: {
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.15)',
  },
  lessonContent: {},
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  lessonLabelActive: {
    color: Colors.primary,
  },
  durationText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  durationActive: {
    color: Colors.primaryDark,
  },
  timeRange: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  timeRangeActive: {
    color: 'rgba(0, 230, 118, 0.8)',
  },
  breakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  breakLabelActive: {
    color: Colors.primary,
  },
  breakTime: {
    fontSize: 11,
    color: Colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  breakTimeActive: {
    color: 'rgba(0, 230, 118, 0.7)',
  },
});
