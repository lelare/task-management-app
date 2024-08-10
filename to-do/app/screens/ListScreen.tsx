import React, { useState } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { Card, Title, Paragraph, Button, IconButton, Checkbox, Switch } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import moment from "moment";
import { UserRole } from "../index";
import { useSelector, useDispatch } from "react-redux";
import { RootState, updateTask, deleteTask } from "../redux/store";

type Task = {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    completed: boolean;
};

type RootStackParamList = {
    ListScreen: undefined;
    TaskScreen: { task?: Task };
    ProfileScreen: undefined;
};

type ListScreenNavigationProp = StackNavigationProp<RootStackParamList, "ListScreen">;
type ListScreenRouteProp = RouteProp<RootStackParamList, "ListScreen">;

type Props = {
    navigation: ListScreenNavigationProp;
    route: ListScreenRouteProp;
    role: UserRole | null;
};

const IP = process.env.EXPO_PUBLIC_IP;

const ListScreen: React.FC<Props> = ({ navigation, role }) => {
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const dispatch = useDispatch();
    const [showAll, setShowAll] = useState(false);

    // complete task
    const handleTaskStatus = (id: string) => {
        const task = tasks.find((task) => task.id === id);
        if (task) {
            const updatedTask = { ...task, completed: !task.completed };
            fetch(`${IP}/tasks/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTask),
            })
                .then((response) => response.json())
                .then(() => {
                    dispatch(updateTask(updatedTask));
                })
                .catch((e) => console.log("error", e));
        }
    };

    // delete existing task
    const handleDeleteTask = (id: string) => {
        if (role === "Admin") {
            fetch(`${IP}/tasks/${id}`, {
                method: "DELETE",
            })
                .then(() => {
                    dispatch(deleteTask(id));
                })
                .catch((e) => console.log("error", e));
        }
    };

    const renderItem = ({ item }: { item: Task }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Checkbox
                        status={item.completed ? "checked" : "unchecked"}
                        onPress={() => handleTaskStatus(item.id)}
                    />
                    <Title style={[styles.cardTitle, item.completed ? styles.completed : undefined]}>
                        {item.title}
                    </Title>
                </View>
                <Paragraph>{item.description}</Paragraph>
                <Paragraph>Location: {item.location}</Paragraph>
                <Paragraph>Date: {moment(item.date).format("MMMM Do, YYYY")}</Paragraph>
            </Card.Content>
            <Card.Actions>
                {role === "Admin" && (
                    <>
                        <IconButton icon="pencil" onPress={() => navigation.navigate("TaskScreen", { task: item })} />
                        <IconButton icon="delete" onPress={() => handleDeleteTask(item.id)} />
                    </>
                )}
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            {role === "Admin" && (
                <Button icon="plus" onPress={() => navigation.navigate("TaskScreen")} mode="contained">
                    Add Task
                </Button>
            )}
            <View style={styles.switchContainer}>
                <Paragraph>Show All Tasks</Paragraph>
                <Switch value={showAll} onValueChange={() => setShowAll(!showAll)} />
            </View>
            <FlatList
                data={tasks
                    .filter((task) => (showAll ? true : !task.completed))
                    .sort((a, b) => moment(a.date).diff(moment(b.date)))}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        // backgroundColor: "#fff",
    },
    card: {
        // flexDirection: "row",
        // justifyContent: "space-between",
        // alignItems: "center",
        marginVertical: 8,
        backgroundColor: "#fcfcfc",
    },
    cardHeader: {
        flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "stretch",
        marginLeft: -10,
        backgroundColor: "#fcfcfc",
    },
    cardTitle: {
        lineHeight: 30,
    },
    completed: {
        textDecorationLine: "line-through",
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },
});

export default ListScreen;
