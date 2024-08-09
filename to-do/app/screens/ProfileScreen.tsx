import React from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type Props = {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const ProfileScreen: React.FC<Props> = ({ setIsLoggedIn }) => {
    const user = useSelector((state: RootState) => state.tasks.user);

    // logout handler
    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Profile</Text>
            {user && (
                <>
                    <TextInput placeholder="Username" value={user.username} editable={false} style={styles.input} />
                    <TextInput placeholder="Email" value={user.email} editable={false} style={styles.input} />
                    <TextInput placeholder="Role" value={user.role} editable={false} style={styles.input} />
                </>
            )}
            <Button onPress={handleLogout} mode="contained" style={styles.logoutButton}>
                Logout
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        // backgroundColor: "#fff",
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
    logoutButton: {
        marginTop: 10,
    },
});

export default ProfileScreen;
