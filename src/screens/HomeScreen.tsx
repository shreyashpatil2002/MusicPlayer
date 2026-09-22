import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SongTile from '../components/SongTile';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayer } from '../context/PlayerContext';
import { Colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';
import SearchScreen from './SearchScreen';
import LibraryScreen from './LibraryScreen';

const Tab = createBottomTabNavigator();

type RootNav = NativeStackNavigationProp<RootStackParamList>;

function HomeFeedScreen() {
  const player = usePlayer();
  const navigation = useNavigation<RootNav>();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Music Hub</Text>
        <Text style={styles.subtitle}>Spotify-like listener experience (demo)</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommended for you</Text>
        <TouchableOpacity
          onPress={() => player.currentSong && navigation.navigate('Player')}
          disabled={!player.currentSong}
        >
          <Text style={styles.link}>Now playing</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={player.songs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isActive = item.id === player.currentSong?.id;
          return (
            <SongTile
              song={item}
              isActive={isActive}
              isPlaying={isActive && player.isPlaying}
              onPress={async () => {
                await player.playSong(item);
                navigation.navigate('Player');
              }}
            />
          );
        }}
      />

      <MiniPlayer />
    </SafeAreaView>
  );
}

export default function HomeScreen() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.onSurfaceDim,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ color, size }) => {
          const icon =
            route.name === 'HomeTab'
              ? 'home'
              : route.name === 'SearchTab'
                ? 'search'
                : 'library-outline';
          return <Ionicons name={icon} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeFeedScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{ tabBarLabel: 'Search' }}
      />
      <Tab.Screen
        name="LibraryTab"
        component={LibraryScreen}
        options={{ tabBarLabel: 'Library' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    color: Colors.onSurface,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.onSurfaceDim,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  sectionTitle: {
    color: Colors.onSurface,
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: Colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 8,
  },
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.divider,
    height: 62,
    paddingBottom: 8,
    paddingTop: 6,
  },
});
