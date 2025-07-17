import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { appointmentService, progressService, notificationService } from '../api/apiClient';

const { width } = Dimensions.get('window');

interface DashboardStats {
  upcomingAppointments: number;
  completedAppointments: number;
  activeDietPlans: number;
  unreadNotifications: number;
  currentWeight?: number;
  weightChange?: number;
  lastCheckIn?: string;
}

const HomeScreen = ({ navigation }: any) => {
  const { user, isNutritionist } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    upcomingAppointments: 0,
    completedAppointments: 0,
    activeDietPlans: 0,
    unreadNotifications: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load appointments
      const appointmentsResponse = await appointmentService.getAppointments({
        limit: 100,
        status: 'upcoming'
      });
      
      // Load progress data
      const progressResponse = await progressService.getProgress({
        limit: 1,
        orderBy: 'createdAt',
        order: 'desc'
      });
      
      // Load notifications
      const notificationsResponse = await notificationService.getNotifications({
        read: false,
        limit: 50
      });

      setStats({
        upcomingAppointments: appointmentsResponse.data?.length || 0,
        completedAppointments: 0, // Would need separate API call
        activeDietPlans: 1, // Would need separate API call
        unreadNotifications: notificationsResponse.data?.length || 0,
        currentWeight: progressResponse.data?.[0]?.weight || undefined,
        weightChange: progressResponse.data?.[0]?.weightChange || undefined,
        lastCheckIn: progressResponse.data?.[0]?.createdAt || undefined,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const quickActions = isNutritionist ? [
    {
      title: 'View Clients',
      icon: 'people',
      color: '#2E7D32',
      onPress: () => navigation.navigate('Clients'),
    },
    {
      title: 'Create Diet Plan',
      icon: 'restaurant',
      color: '#FF9800',
      onPress: () => navigation.navigate('CreateDietPlan'),
    },
    {
      title: 'Appointments',
      icon: 'calendar',
      color: '#2196F3',
      onPress: () => navigation.navigate('Appointments'),
    },
    {
      title: 'Reports',
      icon: 'analytics',
      color: '#9C27B0',
      onPress: () => navigation.navigate('Reports'),
    },
  ] : [
    {
      title: 'Book Appointment',
      icon: 'calendar',
      color: '#2E7D32',
      onPress: () => navigation.navigate('Appointments'),
    },
    {
      title: 'Diet Plans',
      icon: 'restaurant',
      color: '#FF9800',
      onPress: () => navigation.navigate('DietPlans'),
    },
    {
      title: 'Progress',
      icon: 'trending-up',
      color: '#2196F3',
      onPress: () => navigation.navigate('Progress'),
    },
    {
      title: 'Food Log',
      icon: 'camera',
      color: '#9C27B0',
      onPress: () => navigation.navigate('FoodLog'),
    },
  ];

  const StatCard = ({ title, value, subtitle, icon, color = '#2E7D32' }: any) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const QuickActionCard = ({ title, icon, color, onPress }: any) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
      <LinearGradient
        colors={[color, `${color}CC`]}
        style={styles.quickActionGradient}
      >
        <Ionicons name={icon} size={28} color="white" />
        <Text style={styles.quickActionText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}!
              </Text>
              <Text style={styles.userName}>{user?.fullName}</Text>
              <Text style={styles.userRole}>
                {isNutritionist ? 'Nutritionist Dashboard' : 'Your Health Journey'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications" size={24} color="white" />
              {stats.unreadNotifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {stats.unreadNotifications > 9 ? '9+' : stats.unreadNotifications}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Upcoming"
              value={stats.upcomingAppointments}
              subtitle="Appointments"
              icon="calendar"
              color="#2E7D32"
            />
            <StatCard
              title="Active"
              value={stats.activeDietPlans}
              subtitle="Diet Plans"
              icon="restaurant"
              color="#FF9800"
            />
            <StatCard
              title="Notifications"
              value={stats.unreadNotifications}
              subtitle="Unread"
              icon="notifications"
              color="#2196F3"
            />
            <StatCard
              title="Weight"
              value={stats.currentWeight ? `${stats.currentWeight}kg` : 'N/A'}
              subtitle={stats.weightChange ? `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange}kg` : 'No change'}
              icon="fitness"
              color="#9C27B0"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.activityText}>
                Health check-in completed
              </Text>
              <Text style={styles.activityTime}>Today</Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="camera" size={20} color="#FF9800" />
              <Text style={styles.activityText}>
                Food photo logged
              </Text>
              <Text style={styles.activityTime}>Yesterday</Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="chatbubble" size={20} color="#2196F3" />
              <Text style={styles.activityText}>
                AI consultation completed
              </Text>
              <Text style={styles.activityTime}>2 days ago</Text>
            </View>
          </View>
        </View>

        {/* Professional Info */}
        <View style={styles.professionalContainer}>
          <Text style={styles.sectionTitle}>Professional Support</Text>
          <View style={styles.professionalCard}>
            <View style={styles.professionalIcon}>
              <Ionicons name="leaf" size={28} color="#2E7D32" />
            </View>
            <View style={styles.professionalContent}>
              <Text style={styles.professionalName}>
                Gouri Priya Mylavarapu
              </Text>
              <Text style={styles.professionalCredentials}>
                MSc Nutrition • 15+ years experience
              </Text>
              <Text style={styles.professionalLocation}>
                📍 Hyderabad, India
              </Text>
            </View>
            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="call" size={20} color="#2E7D32" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Tip */}
        <View style={styles.healthTipContainer}>
          <Text style={styles.sectionTitle}>Today's Health Tip</Text>
          <LinearGradient
            colors={['#4CAF50', '#66BB6A']}
            style={styles.healthTipCard}
          >
            <Ionicons name="bulb" size={24} color="white" />
            <Text style={styles.healthTipText}>
              Stay hydrated! Drink at least 8 glasses of water throughout the day. 
              Add a slice of lemon for extra vitamin C and flavor.
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
  userRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    width: (width - 50) / 2,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 1,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 50) / 2,
    height: 100,
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  recentActivityContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  professionalContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  professionalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  professionalIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  professionalContent: {
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  professionalCredentials: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  professionalLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthTipContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  healthTipCard: {
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthTipText: {
    flex: 1,
    fontSize: 14,
    color: 'white',
    marginLeft: 15,
    lineHeight: 20,
  },
});

export default HomeScreen;