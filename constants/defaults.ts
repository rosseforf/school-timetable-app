import { SchoolClass, Teacher, Subject, Room, LessonTime, ScheduleEntry, BellSettings } from '@/types/school';

export const DEFAULT_CLASSES: SchoolClass[] = [
  { id: 'c1', name: '1-A', grade: 1 }, { id: 'c2', name: '1-B', grade: 1 },
  { id: 'c3', name: '2-A', grade: 2 }, { id: 'c4', name: '2-B', grade: 2 },
  { id: 'c5', name: '3-A', grade: 3 }, { id: 'c6', name: '3-B', grade: 3 },
  { id: 'c7', name: '4-A', grade: 4 }, { id: 'c8', name: '4-B', grade: 4 },
  { id: 'c9', name: '5-A', grade: 5 }, { id: 'c10', name: '5-B', grade: 5 },
  { id: 'c11', name: '6-A', grade: 6 }, { id: 'c12', name: '6-B', grade: 6 },
  { id: 'c13', name: '7-A', grade: 7 }, { id: 'c14', name: '7-B', grade: 7 },
  { id: 'c15', name: '8-A', grade: 8 }, { id: 'c16', name: '8-B', grade: 8 },
  { id: 'c17', name: '9-A', grade: 9 }, { id: 'c18', name: '9-B', grade: 9 },
  { id: 'c19', name: '10-A', grade: 10 }, { id: 'c20', name: '10-B', grade: 10 },
  { id: 'c21', name: '11-A', grade: 11 }, { id: 'c22', name: '11-B', grade: 11 },
];

export const DEFAULT_TEACHERS: Teacher[] = [
  { id: 't1', name: 'Karimov Rustam', subject: 'Matematika', phone: '+998901234567' },
  { id: 't2', name: 'Ahmadova Nilufar', subject: 'Ona tili', phone: '+998901234568' },
  { id: 't3', name: 'Toshmatov Jasur', subject: 'Fizika', phone: '+998901234569' },
  { id: 't4', name: 'Rahimova Dildora', subject: 'Kimyo' },
  { id: 't5', name: 'Xolmatov Sherzod', subject: 'Tarix', phone: '+998901234570' },
  { id: 't6', name: 'Yusupova Gulnora', subject: 'Biologiya' },
  { id: 't7', name: 'Sobirov Anvar', subject: 'Ingliz tili', phone: '+998901234571' },
  { id: 't8', name: 'Nazarova Malika', subject: 'Informatika' },
  { id: 't9', name: 'Qodirov Bobur', subject: 'Jismoniy tarbiya', phone: '+998901234572' },
  { id: 't10', name: 'Ergasheva Zulfiya', subject: 'Musiqa' },
];

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 's1', name: 'Matematika' },
  { id: 's2', name: 'Ona tili' },
  { id: 's3', name: 'Fizika' },
  { id: 's4', name: 'Kimyo' },
  { id: 's5', name: 'Tarix' },
  { id: 's6', name: 'Biologiya' },
  { id: 's7', name: 'Ingliz tili' },
  { id: 's8', name: 'Informatika' },
  { id: 's9', name: 'Jismoniy tarbiya' },
  { id: 's10', name: 'Musiqa' },
];

export const DEFAULT_ROOMS: Room[] = [
  { id: 'r1', name: '101' }, { id: 'r2', name: '102' }, { id: 'r3', name: '103' },
  { id: 'r4', name: '104' }, { id: 'r5', name: '105' }, { id: 'r6', name: '106' },
  { id: 'r7', name: '201' }, { id: 'r8', name: '202' }, { id: 'r9', name: '203' },
  { id: 'r10', name: '204' }, { id: 'r11', name: '301' }, { id: 'r12', name: '302' },
];

export const DEFAULT_LESSON_TIMES: LessonTime[] = [
  { id: 'lt1', lessonNumber: 1, startTime: '08:00', endTime: '08:45', shift: 1 },
  { id: 'lt2', lessonNumber: 2, startTime: '08:55', endTime: '09:40', shift: 1 },
  { id: 'lt3', lessonNumber: 3, startTime: '09:50', endTime: '10:35', shift: 1 },
  { id: 'lt4', lessonNumber: 4, startTime: '10:55', endTime: '11:40', shift: 1 },
  { id: 'lt5', lessonNumber: 5, startTime: '11:50', endTime: '12:35', shift: 1 },
  { id: 'lt6', lessonNumber: 6, startTime: '12:45', endTime: '13:30', shift: 1 },
  { id: 'lt7', lessonNumber: 1, startTime: '13:30', endTime: '14:15', shift: 2 },
  { id: 'lt8', lessonNumber: 2, startTime: '14:25', endTime: '15:10', shift: 2 },
  { id: 'lt9', lessonNumber: 3, startTime: '15:20', endTime: '16:05', shift: 2 },
  { id: 'lt10', lessonNumber: 4, startTime: '16:20', endTime: '17:05', shift: 2 },
  { id: 'lt11', lessonNumber: 5, startTime: '17:15', endTime: '18:00', shift: 2 },
];

export const DEFAULT_SCHEDULE: ScheduleEntry[] = [
  { id: 'se1', dayIndex: 0, shift: 1, lessonNumber: 1, classId: 'c9', subjectId: 's1', teacherId: 't1', roomId: 'r1' },
  { id: 'se2', dayIndex: 0, shift: 1, lessonNumber: 2, classId: 'c9', subjectId: 's3', teacherId: 't3', roomId: 'r3' },
  { id: 'se3', dayIndex: 0, shift: 1, lessonNumber: 3, classId: 'c9', subjectId: 's7', teacherId: 't7', roomId: 'r5' },
  { id: 'se4', dayIndex: 0, shift: 1, lessonNumber: 4, classId: 'c9', subjectId: 's5', teacherId: 't5', roomId: 'r7' },
  { id: 'se5', dayIndex: 0, shift: 1, lessonNumber: 5, classId: 'c9', subjectId: 's9', teacherId: 't9', roomId: 'r9' },
  { id: 'se6', dayIndex: 0, shift: 1, lessonNumber: 1, classId: 'c11', subjectId: 's2', teacherId: 't2', roomId: 'r2' },
  { id: 'se7', dayIndex: 0, shift: 1, lessonNumber: 2, classId: 'c11', subjectId: 's4', teacherId: 't4', roomId: 'r4' },
  { id: 'se8', dayIndex: 0, shift: 1, lessonNumber: 3, classId: 'c11', subjectId: 's6', teacherId: 't6', roomId: 'r6' },
  { id: 'se9', dayIndex: 0, shift: 1, lessonNumber: 4, classId: 'c11', subjectId: 's8', teacherId: 't8', roomId: 'r8' },
  { id: 'se10', dayIndex: 0, shift: 1, lessonNumber: 5, classId: 'c11', subjectId: 's10', teacherId: 't10', roomId: 'r10' },
  { id: 'se11', dayIndex: 0, shift: 1, lessonNumber: 1, classId: 'c13', subjectId: 's3', teacherId: 't3', roomId: 'r11' },
  { id: 'se12', dayIndex: 0, shift: 1, lessonNumber: 2, classId: 'c13', subjectId: 's1', teacherId: 't1', roomId: 'r1' },
  { id: 'se13', dayIndex: 0, shift: 1, lessonNumber: 3, classId: 'c13', subjectId: 's5', teacherId: 't5', roomId: 'r7' },
  { id: 'se14', dayIndex: 0, shift: 1, lessonNumber: 1, classId: 'c15', subjectId: 's8', teacherId: 't8', roomId: 'r8' },
  { id: 'se15', dayIndex: 0, shift: 1, lessonNumber: 2, classId: 'c15', subjectId: 's2', teacherId: 't2', roomId: 'r2' },
  { id: 'se16', dayIndex: 0, shift: 1, lessonNumber: 3, classId: 'c15', subjectId: 's1', teacherId: 't1', roomId: 'r3' },
  { id: 'se17', dayIndex: 0, shift: 2, lessonNumber: 1, classId: 'c1', subjectId: 's2', teacherId: 't2', roomId: 'r1' },
  { id: 'se18', dayIndex: 0, shift: 2, lessonNumber: 2, classId: 'c1', subjectId: 's1', teacherId: 't1', roomId: 'r2' },
  { id: 'se19', dayIndex: 0, shift: 2, lessonNumber: 3, classId: 'c1', subjectId: 's10', teacherId: 't10', roomId: 'r10' },
  { id: 'se20', dayIndex: 0, shift: 2, lessonNumber: 1, classId: 'c3', subjectId: 's1', teacherId: 't1', roomId: 'r3' },
  { id: 'se21', dayIndex: 0, shift: 2, lessonNumber: 2, classId: 'c3', subjectId: 's7', teacherId: 't7', roomId: 'r5' },
  { id: 'se22', dayIndex: 1, shift: 1, lessonNumber: 1, classId: 'c9', subjectId: 's2', teacherId: 't2', roomId: 'r2' },
  { id: 'se23', dayIndex: 1, shift: 1, lessonNumber: 2, classId: 'c9', subjectId: 's8', teacherId: 't8', roomId: 'r8' },
  { id: 'se24', dayIndex: 1, shift: 1, lessonNumber: 3, classId: 'c9', subjectId: 's4', teacherId: 't4', roomId: 'r4' },
  { id: 'se25', dayIndex: 1, shift: 1, lessonNumber: 4, classId: 'c9', subjectId: 's6', teacherId: 't6', roomId: 'r6' },
  { id: 'se26', dayIndex: 1, shift: 1, lessonNumber: 1, classId: 'c11', subjectId: 's1', teacherId: 't1', roomId: 'r1' },
  { id: 'se27', dayIndex: 1, shift: 1, lessonNumber: 2, classId: 'c11', subjectId: 's3', teacherId: 't3', roomId: 'r3' },
  { id: 'se28', dayIndex: 1, shift: 1, lessonNumber: 3, classId: 'c11', subjectId: 's7', teacherId: 't7', roomId: 'r5' },
];

export const DEFAULT_BELL_SETTINGS: BellSettings = {
  enabled: true,
  volume: 80,
  vibration: true,
  preWarning: 1,
  breakBell: true,
  paused: false,
};

export const DEFAULT_ADMIN_PASSWORD = '1234';
