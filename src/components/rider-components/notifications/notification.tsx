import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { s } from 'react-native-size-matters';
import moment from 'moment';

interface NotificationsProps {
    id: string,
    createdAt: string,
    message: string,
    isRead: boolean,
    title: string,
    type: string,
}

interface NotificationProps {
    notifications: NotificationsProps[]
}

interface GroupedNotifications {
    [key: string]: NotificationsProps[];
}

const NotificationComponent = ({ notifications }: NotificationProps) => {
    
    const groupedNotifications = notifications?.reduce((acc, notification) => {
        const date = moment(notification.createdAt).format("ll")

        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(notification);
        return acc;
    }, {} as GroupedNotifications);

    const renderNotificationItem = ({ item }: { item: NotificationsProps }) => (
        <View style={styles.notificationItem}>
            <View style={styles.iconBox}>
                <FontAwesome5 name="bell" size={18} style={styles.icon} />
            </View>
            <Text style={styles.messageText}>{item.message}</Text>
        </View>
    );

    return (
        <FlatList
            data={Object.entries(groupedNotifications)}
            keyExtractor={([date]) => date}
            renderItem={({ item: [date, items] }) => (
                <View style={styles.dateGroup}>
                    <Text style={styles.dateText}>{date}</Text>
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id}
                        renderItem={renderNotificationItem}
                    />
                </View>
            )}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    dateGroup: {
        marginBottom: 24,
    },
    dateText: {
        fontSize: s(12),
        color: colors.mutedForeground,
        marginBottom: 20,
    },
    notificationItem: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems:'center'
    },
    iconBox: {
        backgroundColor: '#1E83C51A',
        height: 32,
        width: 32,
        borderRadius: 50,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        color: '#1E83C5'
    },
    messageText: {
        fontSize: s(12),
        flex: 1,
        lineHeight: 22
    },
});

export default NotificationComponent;
