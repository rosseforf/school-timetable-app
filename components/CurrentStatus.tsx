import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSchool } from '@/contexts/SchoolContext';
import Colors from '@/constants/colors';

export default function CurrentStatus() {
  const { getShiftByTime, getCurrentLessonInfo, lessonTimes, isHolidayToday, getScheduleForDayShift, getCurrentDayIndex, getSubjectName } = useSchool();
  const [info, setInfo] = useState(getCurrentLessonInfo(getShiftByTime()));

  useEffect(() => {
    const interval = setInterval(() => {
      setInfo(getCurrentLessonInfo(getShiftByTime()));
    }, 1000);
    return () => clearInterval(interval);
  }, [getCurrentLessonInfo, getShiftByTime]);

  const holiday = isHolidayToday();
  if (holiday) {
    return (
      <View style={[styles.card, styles.holidayCard]}>
        <Text style={styles.holidayTitle}>🎉 Bugun bayram</Text>
        <Text style={styles.holidayName}>{holiday.name}</Text>
        <Text style={styles.holidayNote}>Qo'ng'iroqlar o'chirilgan</Text>
      </View>
    );
  }

  const shift = getShiftByTime();
  const dayIndex = getCurrentDayIndex();
  const todaySchedule = getScheduleForDayShift(dayIndex, shift);

  let currentSubjectName = '';
  if (info.type === 'lesson' && info.lessonNumber) {
    const currentEntry = todaySchedule.find(e => e.lessonNumber === info.lessonNumber);
    if (currentEntry) {
      currentSubjectName = getSubjectName(currentEntry.subjectId);
    }
  }

  let statusText = '';
  let subText = '';
  let isActive = false;

  const shiftTimes = lessonTimes.filter(lt => lt.shift === info.shift);

  switch (info.type) {
    case 'lesson':
      statusText = `Hozir: ${info.lessonNumber}-dars`;
      subText = currentSubjectName ? `Mavzu: ${currentSubjectName}` : '';
      isActive = true;
      break;
    case 'break':
      statusText = 'Tanaffus';
      subText = `${info.lessonNumber}-darsdan keyin`;
      break;
    case 'before':
      statusText = 'Darslar boshlanmagan';
      subText = shiftTimes.length > 0 ? `Boshlanish: ${shiftTimes[0].startTime}` : '';
      break;
    case 'after':
      statusText = 'Darslar tugagan';
      subText = "Bugunlik darslar yakunlandi";
      break;
  }

  const remainingText = info.remainingMinutes > 0
    ? `Qolgan vaqt: ${info.remainingMinutes} daqiqa`
    : '';

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, isActive ? styles.activeCard : styles.inactiveCard]}>
        <Text style={[styles.statusText, isActive && styles.activeStatusText]}>
          {statusText}
        </Text>
        {subText ? (
          <Text style={[styles.subText, isActive && styles.activeSubText]}>
            {subText}
          </Text>
        ) : null}
      </View>
      {remainingText ? (
        <Text style={styles.remainingText}>{remainingText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  card: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  activeCard: {
    backgroundColor: '#2E9B3E',
  },
  inactiveCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  holidayCard: {
    backgroundColor: 'rgba(255, 193, 7, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
  },
  holidayTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.warning,
  },
  holidayName: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 6,
  },
  holidayNote: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 8,
  },
  statusText: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  activeStatusText: {
    color: '#FFFFFF',
  },
  subText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  activeSubText: {
    color: 'rgba(255,255,255,0.85)',
  },
  remainingText: {
    fontSize: 14,
    color: '#8BA3C7',
    textAlign: 'center',
    marginTop: 10,
  },
});
