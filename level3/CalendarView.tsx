import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';

// 날짜 타입
type CalendarCell = {
  year: number;
  month: number;
  date: number;
  isCurrentMonth: boolean;
};

// 요일 배열
const daysKor = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getCalendarMatrix(year: number, month: number): CalendarCell[][] {
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();  // 1일이 무슨 요일인지
  const daysInMonth = new Date(year, month + 1, 0).getDate();  // 이번 달의 총 일수

  // 회색의 이전/다음달 정보
  const prevMonth = month === 0 ? 11 : month - 1;
  const nextMonth = month === 11 ? 0 : month + 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextYear = month === 11 ? year + 1 : year;
  // 이전달의 마지막 날짜
  const prevMonthDays = new Date(year, month, 0).getDate();

  let calendar: CalendarCell[][] = [];  // 최종 반환할 달력 배열
  let week: CalendarCell[] = [];  // 한 주 데이터

  // 첫주는 이전달 날짜로 채우기
  for (let i = 0; i < firstDayOfMonth; i++) {
    week.push({
      year: prevYear,
      month: prevMonth,
      date: prevMonthDays - firstDayOfMonth + 1 + i,
      isCurrentMonth: false,
    });
  }

  // 이번 달 날짜로 채우기
  let d = 1;
  while (d <= daysInMonth) {
    week.push({
      year,
      month,
      date: d,
      isCurrentMonth: true,
    });

    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
    d++;
  }

  // 마지막 주는 다음달 날짜로 채우기
  let nextMonthDay = 1;
  while (week.length > 0 && week.length < 7) {
    week.push({
      year: nextYear,
      month: nextMonth,
      date: nextMonthDay++,
      isCurrentMonth: false,
    });
  }
  if (week.length === 7) calendar.push(week);

  return calendar;
}

function getWeekByDate(
  matrix: CalendarCell[][],
  selected?: { year: number; month: number; date: number } | null
): CalendarCell[] {
  const today = new Date();
  const dateToFind = selected
    ? selected
    : { year: today.getFullYear(), month: today.getMonth(), date: today.getDate() };
  return (
    matrix.find((week) =>
      week.some(
        (day) =>
          day.year === dateToFind.year &&
          day.month === dateToFind.month &&
          day.date === dateToFind.date
      )
    ) || matrix[0]
  );
}

function addDays(date: { year: number; month: number; date: number }, days: number) {
  const d = new Date(date.year, date.month, date.date + days);
  return { year: d.getFullYear(), month: d.getMonth(), date: d.getDate() };
}

// 메인 캘린더 컴포넌트
export default function CalendarView() {
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth());
  const [selected, setSelected] = useState<{ year: number; month: number; date: number } | null>(null);

  const [isMonth, setIsMonth] = useState(true);
  const height = useSharedValue(380);

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(height.value, { duration: 250 }),
  }));

  // 캘린더 2차원 배열
  const calendarMatrix = getCalendarMatrix(year, month);

  // 현재 주
  const currentWeek = getWeekByDate(calendarMatrix, selected);

  // 월 이동
  const moveMonth = (delta: number) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setYear(newYear);
    setMonth(newMonth);
  };

  // 주 이동
  const moveWeek = (delta: number) => {
    if (!selected) return;
    const newDate = addDays(selected, delta * 7);
    setYear(newDate.year);
    setMonth(newDate.month);
    setSelected(newDate);
  };

  // 날짜 선택
  const handleDatePress = (item: CalendarCell) => {
    setYear(item.year);
    setMonth(item.month);
    setSelected({ year: item.year, month: item.month, date: item.date });
  };

  // 제스처
  const gesture = Gesture.Pan()
  .onEnd((e) => {
    // 세로 스와이프
    if (e.translationY < -30 && isMonth) {
      runOnJS(setIsMonth)(false);
      height.value = 104;
    } else if (e.translationY > 30 && !isMonth) {
      runOnJS(setIsMonth)(true);
      height.value = 380;
    }
    // 가로 스와이프
    if (e.translationX < -30) {
      if (isMonth) runOnJS(moveMonth)(1);
      else runOnJS(moveWeek)(1);
    } else if (e.translationX > 30) {
      if (isMonth) runOnJS(moveMonth)(-1);
      else runOnJS(moveWeek)(-1); 
    }
  });

  // 렌더링
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 66 }}>
        <View style={calStyles.header}>
          <TouchableOpacity onPress={() => isMonth ? moveMonth(-1) : moveWeek(-1)}>
            <Text style={calStyles.arrow}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={calStyles.monthLabel}>
            {`${year}년 ${month + 1}월`}
          </Text>
          <TouchableOpacity onPress={() => isMonth ? moveMonth(1) : moveWeek(1)}>
            <Text style={calStyles.arrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        {/* 요일 라벨 */}
        <View style={calStyles.weekRow}>
          {daysKor.map((d, i) => (
            <Text
              key={i}
              style={[
                calStyles.weekDay,
                i === 0 && calStyles.sunday,
                i === 6 && calStyles.saturday,
              ]}
            >{d}</Text>
          ))}
        </View>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[animatedStyle]}>
            {/* 월간or주간 모드 */}
            {isMonth ? (
              calendarMatrix.map((week, wi) => (
                <View key={wi} style={calStyles.weekRow}>
                  {week.map((item, di) => {
                    const isSelected = selected &&
                      item.year === selected.year &&
                      item.month === selected.month &&
                      item.date === selected.date;
                    return (
                      <TouchableOpacity
                        key={di}
                        style={[
                          calStyles.dayCell,
                          isSelected && calStyles.selectedDay,
                          !item.isCurrentMonth && calStyles.nonCurrentMonthCell,
                        ]}
                        onPress={() => handleDatePress(item)}
                        disabled={!item.isCurrentMonth}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            calStyles.dayText,
                            di === 0 && calStyles.sunday,
                            di === 6 && calStyles.saturday,
                            !item.isCurrentMonth && calStyles.nonCurrentMonthText,
                            isSelected && calStyles.selectedDayText,
                          ]}
                        >
                          {item.date}
                        </Text>
                        {isSelected && (
                          <View style={calStyles.selectedCircle} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))
            ) : (
              // 주간 모드
              <View style={calStyles.weekRow}>
                {currentWeek.map((item, di) => {
                  const isSelected = selected &&
                    item.year === selected.year &&
                    item.month === selected.month &&
                    item.date === selected.date;
                  return (
                    <TouchableOpacity
                      key={di}
                      style={[
                        calStyles.dayCell,
                        isSelected && calStyles.selectedDay,
                        !item.isCurrentMonth && calStyles.nonCurrentMonthCell,
                      ]}
                      onPress={() => handleDatePress(item)}
                      disabled={!item.isCurrentMonth}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          calStyles.dayText,
                          di === 0 && calStyles.sunday,
                          di === 6 && calStyles.saturday,
                          !item.isCurrentMonth && calStyles.nonCurrentMonthText,
                          isSelected && calStyles.selectedDayText,
                        ]}
                      >
                        {item.date}
                      </Text>
                      {isSelected && (
                        <View style={calStyles.selectedCircle} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

// 스타일시트
const calStyles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  arrow: { fontSize: 28, width: 44, textAlign: 'center', color: '#67b5f5' }, // 화살표
  monthLabel: { fontSize: 22, fontWeight: 'bold', width: 180, textAlign: 'center' }, // 월/연도
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, marginHorizontal: 8 },
  weekDay: { width: 40, textAlign: 'center', fontWeight: '600', color: '#AAA' }, // 요일
  sunday: { color: '#e74c3c' },  // 일요일 빨간색
  saturday: { color: '#3498db' },  // 토요일 파란색
  dayCell: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, margin: 1, position: 'relative' }, // 날짜 셀
  dayText: { fontSize: 16, color: '#333' }, // 날짜 기본
  nonCurrentMonthCell: {},  // 이전/다음달 셀
  nonCurrentMonthText: { color: '#d3d3d3' },// 이전/다음달 날짜, 회색
  selectedDay: { },  // 선택 셀
  selectedDayText: { color: '#000000', fontWeight: 'bold' }, // 선택된 날짜
  selectedCircle: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#67b5f5', // 선택 원 테두리
  },
});