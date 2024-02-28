import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
//import { createDrawerNavigator } from "@react-navigation/drawer";

// Drawer Navigator screens
//import Sidebar from "./src/Sidebar";
import Settings from "./src/sidebar/Settings";
import SyncBackup from "./src/sidebar/SyncBackup";
import About from "./src/sidebar/About";

// Stack Navigator screens
import Home from "./src/Home";
import NoteAdd from "./src/NoteAdd";
import Header from "./src/Header";
import Detail from "./src/Detail";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Style
import { Ionicons } from "@expo/vector-icons";

//const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Drawer Navigator
/* 
function DrawerRoutes() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: "gray",
        drawerActiveTintColor: "white",
        drawerLabelStyle: { marginLeft: -20 },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Sync and Backup"
        component={SyncBackup}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="sync-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={About}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="information-circle-outline" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

 */
// Stack Navigator
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            //headerShown: false, // hide header dari Stack dan menampilkan yang dari Drawer
            title: "Home",
            headerStyle: {
              backgroundColor: "#fff",
              height: 50,
              borderWidth: 0, // remove header border
            },
          }}
        />
        <Stack.Screen
          name="NoteAdd"
          component={NoteAdd}
          options={{
            title: "NoteAdd",
            headerStyle: {
              backgroundColor: "#fff",
              height: 50,
              // borderWidth: 0,
            },
          }}
        />
        <Stack.Screen
          name="Detail"
          component={Detail}
          options={{
            title: "Detail",
            headerStyle: {
              backgroundColor: "#fff",
              height: 50,
              // borderWidth: 0,
            },
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            title: "Settings",
            headerStyle: {
              backgroundColor: "#fff",
              height: 50,
              // borderWidth: 0,
            },
          }}
        />
        <Stack.Screen
          name="SyncBackup"
          component={SyncBackup}
          options={{
            title: "SyncBackup",
            headerStyle: {
              backgroundColor: "#fff",
              height: 50,
              // borderWidth: 0,
            },
          }}
        />
        <Stack.Screen
          name="About"
          component={About}
          options={{
            title: "About",
            headerStyle: {
              backgroundColor: "#fff",
              height: 50,
              // borderWidth: 0,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
