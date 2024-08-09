// App.js
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider, useDispatch } from "react-redux";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import ListScreen from "./screens/ListScreen";
import TaskScreen from "./screens/TaskScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import store, { setTasks } from "./redux/store";
import { IP } from "@env";

// function HomeScreen({ navigation }) {
//     return (
//         <View
//             style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center",
//             }}
//         >
//             <Text>Edit app/index.tsx to edit this screen.</Text>
//             <Button title="Go to List" onPress={() => navigation.navigate("ListScreen")} />
//         </View>
//     );
// }

const Stack = createStackNavigator();

export type UserRole = "Admin" | "User";

const Index = () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
};

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [role, setRole] = React.useState<UserRole | null>(null);
    const dispatch = useDispatch();
    console.log("salam");
    useEffect(() => {
        // fetch tasks when the app loads and set them in redux store
        fetch(`${IP}/tasks`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                dispatch(setTasks(data));
            })
            .catch((e) => console.log("error", e));
    }, [dispatch]);

    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                {!isLoggedIn ? (
                    <Stack.Screen name="LoginScreen" options={{ headerShown: false }}>
                        {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} setRole={setRole} />}
                    </Stack.Screen>
                ) : (
                    <>
                        <Stack.Screen
                            name="To-Do."
                            options={({ navigation }) => ({
                                headerRight: () => (
                                    <Button
                                        style={styles.profileButton}
                                        icon="account-circle"
                                        onPress={() => navigation.navigate("ProfileScreen")}
                                    >
                                        Profile
                                    </Button>
                                ),
                            })}
                        >
                            {(props) => <ListScreen {...props} role={role} />}
                        </Stack.Screen>
                        {role === "Admin" && (
                            <Stack.Screen
                                name="TaskScreen"
                                component={TaskScreen}
                                options={{
                                    headerTitle: "",
                                    headerBackTitleVisible: false, // for IOS
                                }}
                            />
                        )}
                        <Stack.Screen
                            name="ProfileScreen"
                            options={{
                                headerTitle: "",
                                headerBackTitleVisible: false, // for IOS
                            }}
                        >
                            {(props) => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
                        </Stack.Screen>
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    profileButton: {
        marginHorizontal: 8,
    },
});

export default Index;
