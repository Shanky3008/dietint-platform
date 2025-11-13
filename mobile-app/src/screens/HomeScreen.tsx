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
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
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

  const StatCard = ({ title, value, subtitle, icon, color = '#2E7D32', index = 0 }: any) => (
    <Animated.View
      entering={FadeInUp.delay(index * 100).duration(600).springify()}
      style={styles.statCard}
    >
      <LinearGradient
        colors={[color, `${color}E6`]}
        style={styles.statIcon}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={icon} size={24} color="white" />
      </LinearGradient>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </Animated.View>
  );

  const QuickActionCard = ({ title, icon, color, onPress, index = 0 }: any) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600).springify()}
      style={styles.quickActionCard}
    >
      <TouchableOpacity style={styles.quickActionTouch} onPress={onPress}>
        <LinearGradient
          colors={[color, `${color}CC`]}
          style={styles.quickActionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.quickActionIconContainer}>
            <Ionicons name={icon} size={32} color="white" />
          </View>
          <Text style={styles.quickActionText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
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
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View entering={FadeIn.duration(600)} style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}!
              </Text>
              <Text style={styles.userName}>{user?.fullName}</Text>
              <Text style={styles.userRole}>
                {isNutritionist ? 'Coach Dashboard' : 'Your Health Journey'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications" size={26} color="white" />
              {stats.unreadNotifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {stats.unreadNotifications > 9 ? '9+' : stats.unreadNotifications}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Animated.Text entering={FadeIn.delay(200).duration(600)} style={styles.sectionTitle}>
            Overview
          </Animated.Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Upcoming"
              value={stats.upcomingAppointments}
              subtitle="Appointments"
              icon="calendar"
              color="#2E7D32"
              index={0}
            />
            <StatCard
              title="Active"
              value={stats.activeDietPlans}
              subtitle="Diet Plans"
              icon="restaurant"
              color="#FF9800"
              index={1}
            />
            <StatCard
              title="Notifications"
              value={stats.unreadNotifications}
              subtitle="Unread"
              icon="notifications"
              color="#667eea"
              index={2}
            />
            <StatCard
              title="Weight"
              value={stats.currentWeight ? `${stats.currentWeight}kg` : 'N/A'}
              subtitle={stats.weightChange ? `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange}kg` : 'No change'}
              icon="fitness"
              color="#764ba2"
              index={3}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Animated.Text entering={FadeIn.delay(400).duration(600)} style={styles.sectionTitle}>
            Quick Actions
          </Animated.Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} index={index} />
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
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginTop: 6,
    letterSpacing: -0.5,
  },
  userRole: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    fontWeight: '500',
  },
  notificationButton: {
    position: 'relative',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF5722',
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '800',
  },
  statsContainer: {
    padding: 24,
    paddingTop: 28,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 18,
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    width: (width - 58) / 2,
    marginBottom: 14,
    padding: 18,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  statTitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
    fontWeight: '500',
  },
  quickActionsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 58) / 2,
    height: 120,
    marginBottom: 14,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  quickActionTouch: {
    flex: 1,
  },
  quickActionGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  quickActionIconContainer: {
    marginBottom: 8,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  recentActivityContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 14,
    fontWeight: '600',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  professionalContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  professionalCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  professionalIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#f0f8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  professionalContent: {
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  professionalCredentials: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  professionalLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
    fontWeight: '500',
  },
  contactButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#f0f8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthTipContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  healthTipCard: {
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  healthTipText: {
    flex: 1,
    fontSize: 14,
    color: 'white',
    marginLeft: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
});

export default HomeScreen;