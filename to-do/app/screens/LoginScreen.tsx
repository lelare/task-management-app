import React, { useState } from "react";
import { View, StyleSheet, TextInput, Text, Alert } from "react-native";
import { Button } from "react-native-paper";
import { UserRole } from "../index";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/store";

type Props = {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setRole: (role: UserRole) => void;
};

const LoginScreen: React.FC<Props> = ({ setIsLoggedIn, setRole }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleLogin = () => {
        // dummy users
        const users = {
            admin: {
                password: "admin123",
                role: "Admin" as UserRole,
                email: "admin@example.com",
                username: "Admin",
            },
            user: { password: "user123", role: "User" as UserRole, email: "user@example.com", username: "RegularUser" },
        };

        // get user, 0: admin, 1: regularUser
        const user = users[username];

        // authentification process
        if (user && password === user.password) {
            setRole(user.role);
            dispatch(setUser({ username: user.username, email: user.email, role: user.role }));
            setIsLoggedIn(true);
        } else {
            Alert.alert("Login Failed", "Invalid username or password");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button style={styles.loginButton} onPress={handleLogin} mode="contained">
                Login
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        color: "#000",
    },
    loginButton: {
        marginTop: 10,
    },
});

export default LoginScreen;
