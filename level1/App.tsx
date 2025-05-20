import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import CalendarView from './CalendarView';

function HomeView() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF'}}>
      <Text>Home</Text>
    </View>
  );
}

function LibraryView() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF'}}>
      <Text>Library</Text>
    </View>
  );
}

function MypageView() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF'}}>
      <Text>Mypage</Text>
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
          name="Home" 
          component={HomeView}
          options={{
            title: 'HOME',
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
            headerShown: false
          }}
        />
        <Tab.Screen 
          name="Calendar" 
          component={CalendarView}
          options={{
            title: 'CALENDAR',
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="calendar-month" color={color} size={size} />
            ),
            headerShown: false
          }}
        />
        <Tab.Screen 
          name="Library" 
          component={LibraryView}
          options={{
            title: 'LIBRARY',
            tabBarIcon: ({color, size}) => (
              <FontAwesome5 name="dumbbell" color={color} size={20} iconStyle="solid" />
            ),
            headerShown: false
          }}
        />
        <Tab.Screen 
          name="Mypage" 
          component={MypageView}
          options={{
            title: 'MY PAGE',
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="person-outline" color={color} size={size} />
            ),
            headerShown: false
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}