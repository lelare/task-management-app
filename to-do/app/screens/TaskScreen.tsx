import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Text, Alert } from "react-native";
import { Button } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import moment from "moment";
import { useDispatch } from "react-redux";
import { addTask, updateTask, deleteTask } from "../redux/store";
import { OPENWEATHERMAP_API_KEY } from "@env";
import { IP } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Task = {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    completed: boolean;
};

type WeatherData = {
    temperature: number;
    description: string;
};

type RootStackParamList = {
    ListScreen: undefined;
    TaskScreen: { task?: Task };
};

type TaskScreenNavigationProp = StackNavigationProp<RootStackParamList, "TaskScreen">;
type TaskScreenRouteProp = RouteProp<RootStackParamList, "TaskScreen">;

type Props = {
    navigation: TaskScreenNavigationProp;
    route: TaskScreenRouteProp;
};

const CACHE_DURATION = 30 * 60 * 1000;

const TaskScreen: React.FC<Props> = ({ route, navigation }) => {
    const [title, setTitle] = useState(route.params?.task?.title || "");
    const [description, setDescription] = useState(route.params?.task?.description || "");
    // set current task id when we edit it and null while creating a new one
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(route.params?.task?.id || null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        // fetch weather info
        checkAndFetchWeather();
    }, []);

    const checkAndFetchWeather = () => {
        // get cached weather info
        AsyncStorage.getItem("weatherData")
            .then((cachedData) => {
                if (cachedData) {
                    const parsedData = JSON.parse(cachedData);
                    console.log(parsedData);
                    const now = new Date().getTime();

                    if (parsedData.timestamp && now - parsedData.timestamp < CACHE_DURATION) {
                        // use cached data if it's still valid
                        setWeather(parsedData.weather);
                        return;
                    }
                }
                // fetch new weather info if cache is expired or not available
                fetchWeather();
            })
            .catch((error) => {
                console.error("Cache error:", error);
                fetchWeather();
            });
    };

    const fetchWeather = () => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Tallinn&units=metric&appid=${OPENWEATHERMAP_API_KEY}`)
            .then((response) => response.json())
            .then((data) => {
                const weatherData = {
                    temperature: data.main.temp,
                    description: data.weather[0].description,
                };
                setWeather(weatherData);

                const cacheData = {
                    weather: weatherData,
                    timestamp: new Date().getTime(),
                };

                // cache weather info
                AsyncStorage.setItem("weatherData", JSON.stringify(cacheData)).catch((error) => {
                    console.error("Failed to cache weather data:", error);
                });
            })
            .catch((e) => console.log("error", e));
    };

    // add or edit existing task
    const handleTask = () => {
        if (!title.trim()) {
            Alert.alert("Validation Error", "Task title cannot be empty.");
            return;
        }

        const taskData = {
            id: currentTaskId || String(Date.now()),
            title: title || "",
            description: description || "",
            location: "Estonia",
            // get date or set current time while creating
            date: route.params?.task?.date || moment().format("YYYY-MM-DD"),
            completed: route.params?.task?.completed || false,
        };

        if (currentTaskId) {
            fetch(`${IP}/tasks/${currentTaskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskData),
            }).then(() => {
                dispatch(updateTask(taskData));
                navigation.goBack();
            });
        } else {
            fetch(`${IP}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskData),
            }).then(() => {
                dispatch(addTask(taskData));
                navigation.goBack();
            });
        }
    };

    // delete existing task
    const handleDeleteTask = (id: string) => {
        if (currentTaskId) {
            fetch(`${IP}/tasks/${currentTaskId}`, {
                method: "DELETE",
            })
                .then(() => {
                    dispatch(deleteTask(currentTaskId));
                    navigation.goBack();
                })
                .catch((e) => console.log("error", e));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}> {currentTaskId ? "Edit Task" : "Add Task"}</Text>
            <TextInput placeholder="Task Title" value={title} onChangeText={setTitle} style={styles.input} />
            <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
            />
            {weather && (
                <Text style={styles.weatherText}>
                    Weather in Tallinn: {weather.temperature}°C, {weather.description}{" "}
                </Text>
            )}
            <Button icon={currentTaskId ? "content-save-edit" : "plus"} onPress={handleTask} mode="contained">
                {currentTaskId ? "Save" : "Add Task"}
            </Button>
            {currentTaskId && (
                <Button icon="delete" onPress={handleDeleteTask} mode="contained" style={styles.deleteButton}>
                    Delete Task
                </Button>
            )}
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
    // buttonWrapper: {
    //     display: "flex",
    //     justifyContent: "space-between",
    //     alignItems: "center",
    // },
    weatherText: {
        marginVertical: 20,
        fontSize: 16,
    },
    deleteButton: {
        marginTop: 10,
    },
});

export default TaskScreen;
