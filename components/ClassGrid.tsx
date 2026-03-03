import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Search, ChevronDown } from 'lucide-react-native';
import { useSchool } from '@/contexts/SchoolContext';
import Colors from '@/constants/colors';

const CARD_COLORS = [
  { bg: 'rgba(21, 101, 192, 0.35)', border: 'rgba(21, 101, 192, 0.5)' },
  { bg: 'rgba(0, 121, 107, 0.35)', border: 'rgba(0, 121, 107, 0.5)' },
  { bg: 'rgba(198, 40, 40, 0.3)', border: 'rgba(198, 40, 40, 0.45)' },
  { bg: 'rgba(46, 125, 50, 0.35)', border: 'rgba(46, 125, 50, 0.5)' },
  { bg: 'rgba(123, 31, 162, 0.3)', border: 'rgba(123, 31, 162, 0.45)' },
  { bg: 'rgba(230, 81, 0, 0.3)', border: 'rgba(230, 81, 0, 0.45)' },
];

const STUDENT_PHOTOS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=120&h=120&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
];

const FILTERS = [
  { label: 'Barcha sinflar', range: [1, 11] },
  { label: '1–4', range: [1, 4] },
  { label: '5–9', range: [5, 9] },
  { label: '10–11', range: [10, 11] },
];

interface ClassCardData {
  id: string;
  className: string;
  subjectName: string;
  teacherName: string;
  roomName: string;
  lessonNumber: number;
  isCurrent: boolean;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export default function ClassGrid() {
  const {
    getCurrentDayIndex, getShiftByTime, getScheduleForDayShift, getCurrentLessonInfo,
    getClassName, getTeacherName, getSubjectName, getRoomName, classes, lessonTimes,
  } = useSchool();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(0);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentInfo, setCurrentInfo] = useState(getCurrentLessonInfo(getShiftByTime()));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInfo(getCurrentLessonInfo(getShiftByTime()));
    }, 1000);
    return () => clearInterval(interval);
  }, [getCurrentLessonInfo, getShiftByTime]);

  const dayIndex = getCurrentDayIndex();
  const shift = getShiftByTime();
  const todaySchedule = getScheduleForDayShift(dayIndex, shift);

  const shiftTimes = useMemo(() =>
    lessonTimes
      .filter(lt => lt.shift === shift)
      .sort((a, b) => a.lessonNumber - b.lessonNumber),
    [lessonTimes, shift]
  );

  const breakInfo = useMemo(() => {
    if (currentInfo.type === 'break' && currentInfo.lessonNumber !== undefined) {
      const currentLT = shiftTimes.find(lt => lt.lessonNumber === currentInfo.lessonNumber);
      const nextLT = shiftTimes.find(lt => lt.lessonNumber === (currentInfo.lessonNumber ?? 0) + 1);
      if (currentLT && nextLT) {
        const duration = timeToMinutes(nextLT.startTime) - timeToMinutes(currentLT.endTime);
        return { duration, time: nextLT.startTime };
      }
    }
    if (currentInfo.type === 'lesson' && currentInfo.lessonNumber !== undefined) {
      const currentLT = shiftTimes.find(lt => lt.lessonNumber === currentInfo.lessonNumber);
      const nextLT = shiftTimes.find(lt => lt.lessonNumber === (currentInfo.lessonNumber ?? 0) + 1);
      if (currentLT && nextLT) {
        const duration = timeToMinutes(nextLT.startTime) - timeToMinutes(currentLT.endTime);
        return { duration, time: currentLT.endTime };
      }
    }
    return null;
  }, [currentInfo, shiftTimes]);

  const currentLessonNum = currentInfo.type === 'lesson' ? currentInfo.lessonNumber : undefined;

  const cardData = useMemo((): ClassCardData[] => {
    const uniqueClasses = new Map<string, ClassCardData>();
    const targetLesson = currentLessonNum ?? 1;

    for (const entry of todaySchedule) {
      if (entry.lessonNumber === targetLesson && !uniqueClasses.has(entry.classId)) {
        uniqueClasses.set(entry.classId, {
          id: entry.id,
          className: getClassName(entry.classId),
          subjectName: getSubjectName(entry.subjectId),
          teacherName: getTeacherName(entry.teacherId),
          roomName: getRoomName(entry.roomId),
          lessonNumber: entry.lessonNumber,
          isCurrent: currentLessonNum === entry.lessonNumber,
        });
      }
    }

    const classesWithSchedule = Array.from(uniqueClasses.values());

    const scheduledClassIds = new Set(Array.from(uniqueClasses.keys()));
    const unscheduledClasses = classes
      .filter(c => !scheduledClassIds.has(c.id))
      .map(c => ({
        id: `empty-${c.id}`,
        className: c.name,
        subjectName: "Bo'sh dars",
        teacherName: '',
        roomName: '',
        lessonNumber: 0,
        isCurrent: false,
      }));

    return [...classesWithSchedule, ...unscheduledClasses];
  }, [todaySchedule, classes, getClassName, getSubjectName, getTeacherName, getRoomName, currentLessonNum]);

  const filteredData = useMemo(() => {
    let data = cardData;
    const filter = FILTERS[activeFilter];
    if (filter && activeFilter !== 0) {
      data = data.filter(item => {
        const gradeMatch = item.className.match(/^(\d+)/);
        if (gradeMatch) {
          const grade = parseInt(gradeMatch[1], 10);
          return grade >= filter.range[0] && grade <= filter.range[1];
        }
        return true;
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(item =>
        item.className.toLowerCase().includes(q) ||
        item.teacherName.toLowerCase().includes(q) ||
        item.subjectName.toLowerCase().includes(q)
      );
    }
    return data;
  }, [cardData, activeFilter, search]);

  const highlightedCard = filteredData.length > 0 ? filteredData[0] : null;
  const gridCards = filteredData.slice(1);

  const gridRows = useMemo(() => {
    const rows: ClassCardData[][] = [];
    for (let i = 0; i < gridCards.length; i += 2) {
      rows.push(gridCards.slice(i, i + 2));
    }
    return rows;
  }, [gridCards]);

  const getCardColor = useCallback((index: number) => {
    return CARD_COLORS[index % CARD_COLORS.length];
  }, []);

  const getPhoto = useCallback((index: number) => {
    return STUDENT_PHOTOS[index % STUDENT_PHOTOS.length];
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setShowFilterDropdown(!showFilterDropdown);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownText}>{FILTERS[activeFilter].label}</Text>
          <ChevronDown size={16} color="#8BA3C7" />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Qidiruv..."
            placeholderTextColor="#4A6485"
            value={search}
            onChangeText={setSearch}
          />
          <Search size={16} color="#4A6485" />
        </View>
      </View>

      {showFilterDropdown && (
        <View style={styles.dropdownMenu}>
          {FILTERS.map((f, i) => (
            <TouchableOpacity
              key={f.label}
              style={[styles.dropdownItem, i === activeFilter && styles.dropdownItemActive]}
              onPress={() => {
                setActiveFilter(i);
                setShowFilterDropdown(false);
              }}
            >
              <Text style={[styles.dropdownItemText, i === activeFilter && styles.dropdownItemTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {highlightedCard && (
        <View style={styles.highlightCard}>
          <View style={styles.highlightContent}>
            <Text style={styles.highlightClassName}>{highlightedCard.className}</Text>
            <Text style={styles.highlightSubject}>{highlightedCard.subjectName}</Text>
            {highlightedCard.teacherName ? (
              <Text style={styles.highlightTeacher}>O'qituvchi: {highlightedCard.teacherName.split(' ')[0][0]}. {highlightedCard.teacherName.split(' ').slice(1).join(' ')}</Text>
            ) : null}
            {highlightedCard.roomName ? (
              <Text style={styles.highlightRoom}>{highlightedCard.roomName}-xona</Text>
            ) : null}
          </View>
          <Image
            source={{ uri: getPhoto(0) }}
            style={styles.highlightPhoto}
          />
        </View>
      )}

      {breakInfo && (
        <View style={styles.breakDivider}>
          <View style={styles.breakLine} />
          <Text style={styles.breakText}>
            Tanaffus: {breakInfo.duration} daqiqa  {breakInfo.time}
          </Text>
          <View style={styles.breakLine} />
        </View>
      )}

      {gridRows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.gridRow}>
          {row.map((item, colIndex) => {
            const colorIndex = rowIndex * 2 + colIndex + 1;
            const color = getCardColor(colorIndex);
            return (
              <View
                key={item.id}
                style={[styles.gridCard, { backgroundColor: color.bg }]}
              >
                <View style={styles.gridCardContent}>
                  <Text style={styles.gridClassName}>{item.className}</Text>
                  <Text style={styles.gridSubject} numberOfLines={1}>{item.subjectName}</Text>
                  {item.teacherName ? (
                    <Text style={styles.gridTeacher} numberOfLines={1}>
                      O'qituvchi: {item.teacherName.split(' ')[0][0]}. {item.teacherName.split(' ').slice(1).join(' ')}
                    </Text>
                  ) : (
                    <Text style={styles.gridTeacher}>O'qituvchi:</Text>
                  )}
                  {item.roomName ? (
                    <Text style={styles.gridRoom}>{item.roomName}-xona</Text>
                  ) : (
                    <Text style={styles.gridRoom}>{'\u00A0'}</Text>
                  )}
                </View>
                <Image
                  source={{ uri: getPhoto(colorIndex) }}
                  style={styles.gridPhoto}
                />
              </View>
            );
          })}
          {row.length === 1 && <View style={styles.gridCardPlaceholder} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  dropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#132034',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1C3150',
  },
  dropdownText: {
    fontSize: 14,
    color: '#B0C4DE',
    fontWeight: '500' as const,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#132034',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1C3150',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    padding: 0,
  },
  dropdownMenu: {
    backgroundColor: '#19293F',
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1C3150',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1C3150',
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#8BA3C7',
  },
  dropdownItemTextActive: {
    color: '#00E676',
    fontWeight: '600' as const,
  },
  highlightCard: {
    flexDirection: 'row',
    backgroundColor: '#132034',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E9B3E',
    borderWidth: 1,
    borderColor: '#1C3150',
    alignItems: 'center',
  },
  highlightContent: {
    flex: 1,
  },
  highlightClassName: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  highlightSubject: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  highlightTeacher: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  highlightRoom: {
    fontSize: 12,
    color: '#8BA3C7',
  },
  highlightPhoto: {
    width: 72,
    height: 72,
    borderRadius: 10,
    marginLeft: 12,
    backgroundColor: '#19293F',
  },
  breakDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 2,
    paddingHorizontal: 4,
  },
  breakLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1C3150',
  },
  breakText: {
    fontSize: 13,
    color: '#8BA3C7',
    marginHorizontal: 10,
    fontWeight: '500' as const,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  gridCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridCardPlaceholder: {
    flex: 1,
  },
  gridCardContent: {
    flex: 1,
  },
  gridClassName: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  gridSubject: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  gridTeacher: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  gridRoom: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
  },
  gridPhoto: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginLeft: 8,
    backgroundColor: '#19293F',
  },
});
