import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

// Auth
import { AuthProvider, useAuth } from './src/hooks/useAuth';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';
import MessagingScreen from './src/screens/MessagingScreen';
import HealthCheckScreen from './src/screens/HealthCheckScreen';
import PhotoFoodLogScreen from './src/screens/PhotoFoodLogScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AppointmentsScreen from './src/screens/AppointmentsScreen';
import AppointmentDetailScreen from './src/screens/AppointmentDetailScreen';
import DietPlansScreen from './src/screens/DietPlansScreen';
import DietPlanDetailScreen from './src/screens/DietPlanDetailScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import VideoCallScreen from './src/screens/VideoCallScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Navigation
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Paper theme
const theme = {
  colors: {
    primary: '#2E7D32',
    accent: '#4CAF50',
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#000000',
    placeholder: '#666666',
  },
};

// Loading Screen
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#2E7D32" />
    <Text style={styles.loadingText}>Loading DietInt...</Text>
  </View>
);

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: '#ffffff' }
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => {
  const { user, isNutritionist } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Chat':
              iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
              break;
            case 'Messages':
              iconName = focused ? 'mail' : 'mail-outline';
              break;
            case 'Health':
              iconName = focused ? 'fitness' : 'fitness-outline';
              break;
            case 'FoodLog':
              iconName = focused ? 'camera' : 'camera-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'Dashboard',
          headerTitle: isNutritionist ? 'Nutritionist Dashboard' : 'My Dashboard'
        }} 
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatbotScreen} 
        options={{ 
          title: 'AI Chat',
          headerTitle: 'AI Nutrition Assistant'
        }} 
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagingScreen} 
        options={{ 
          title: 'Messages',
          headerTitle: 'Consultations'
        }} 
      />
      <Tab.Screen 
        name="Health" 
        component={HealthCheckScreen} 
        options={{ 
          title: 'Health',
          headerTitle: 'Health Check-in'
        }} 
      />
      <Tab.Screen 
        name="FoodLog" 
        component={PhotoFoodLogScreen} 
        options={{ 
          title: 'Food Log',
          headerTitle: 'Photo Food Log'
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profile',
          headerTitle: user?.fullName || 'Profile'
        }} 
      />
    </Tab.Navigator>
  );
};

// App Stack Navigator
const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#2E7D32',
      },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="MainTabs" 
      component={MainTabs} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="Appointments" 
      component={AppointmentsScreen} 
      options={{ title: 'Appointments' }} 
    />
    <Stack.Screen 
      name="AppointmentDetail" 
      component={AppointmentDetailScreen} 
      options={{ title: 'Appointment Details' }} 
    />
    <Stack.Screen 
      name="DietPlans" 
      component={DietPlansScreen} 
      options={{ title: 'Diet Plans' }} 
    />
    <Stack.Screen 
      name="DietPlanDetail" 
      component={DietPlanDetailScreen} 
      options={{ title: 'Diet Plan Details' }} 
    />
    <Stack.Screen 
      name="Progress" 
      component={ProgressScreen} 
      options={{ title: 'Progress Tracking' }} 
    />
    <Stack.Screen 
      name="Notifications" 
      component={NotificationsScreen} 
      options={{ title: 'Notifications' }} 
    />
    <Stack.Screen 
      name="VideoCall" 
      component={VideoCallScreen} 
      options={{ title: 'Video Consultation' }} 
    />
    <Stack.Screen 
      name="Settings" 
      component={SettingsScreen} 
      options={{ title: 'Settings' }} 
    />
  </Stack.Navigator>
);

// Main App Component
const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

// Root App Component
export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        // Request notification permissions
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Notification permission not granted');
        }

        // Set up notification response listener
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
          console.log('Notification clicked:', response);
          // Handle notification click navigation here
        });

        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsReady(true);

        return () => subscription.remove();
      } catch (error) {
        console.error('App preparation error:', error);
        setIsReady(true);
      }
    };

    prepare();
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <AppContent />
          <StatusBar style="light" backgroundColor="#2E7D32" />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
  },
});