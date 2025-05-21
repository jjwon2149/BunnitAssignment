import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';

function CalendarView() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF'}}>
      <Text>캘린더</Text>
    </View>
  );
}

function DataView() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF'}}>
      <Text>통계</Text>
    </View>
  );
}

function SeeMoreView() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF'}}>
      <Text>더보기</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        }}
        >
        <Tab.Screen 
          name="Calendar" 
          component={CalendarView}
          options={{
            title: '캘린더',
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="calendar-today" color={color} size={size} />
            ),
            headerShown: false
          }}
        />
        <Tab.Screen 
          name="Data" 
          component={DataView}
          options={{
            title: '통계',
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="bar-chart" color={color} size={20} />
            ),
            headerShown: false
          }}
        />
        <Tab.Screen 
          name="SeeMore" 
          component={SeeMoreView}
          options={{
            title: '더보기',
            tabBarIcon: ({color, size}) => (
              <FontAwesome5 name="ellipsis-h" color={color} size={size} iconStyle="solid" />
            ),
            headerShown: false
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
