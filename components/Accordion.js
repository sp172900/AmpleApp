import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, LayoutAnimation, UIManager, Image, YellowBox, Linking } from "react-native";

YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);

const Accordion = props => {

    const [expanded, setExpanded] = useState(false);
    const icons = {
        'up': require('../images/up.png'),
        'down': require('../images/down.png')
    };

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const makeExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.Linear);
        setExpanded(!expanded);
    };

    const findItem = item => {
        const url = 'https://www.amazon.com/s?k=' + item + '&ref=nb_sb_noss';
        Linking.openURL(url);
    };

    let icon = icons['down'];
    if (expanded) {
        icon = icons['up'];
    }

    return (
        <View style={{ backgroundColor: 'white', borderWidth: 0.5, borderColor: '#8E8E93' }}>
            <TouchableOpacity style={styles.row} onPress={makeExpand}>
                <Text style={styles.textTitle}>{props.title}</Text>
                <Image style={styles.icon} source={icon}></Image>
            </TouchableOpacity>
            {expanded && (
                <View style={styles.container}>
                    <FlatList
                        keyExtractor={(item, index) => item.id}
                        scrollEnabled={true}
                        data={props.data}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => findItem(item.key)}>
                                <View style={styles.item}>
                                    <Text style={styles.textData}>{item.key}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    ></FlatList>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 2
    },
    item: {
        padding: 1,
        marginLeft: 28,
        marginRight: 15
    },
    row: {
        height: 40,
        paddingLeft: 25,
        paddingRight: 15,
        margin: 5,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 10
    },
    textTitle: {
        fontSize: 18,
        color: 'black'
    },
    textData: {
        fontSize: 15,
        paddingBottom: 5,
        paddingTop: 0
    },
    icon: {
        width: 25,
        height: 25,
        tintColor: '#10518f',
        alignItems: "center"
    },
    category: {
        alignItems: "flex-start"
    },
});

export default Accordion;