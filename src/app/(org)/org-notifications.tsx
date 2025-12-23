import React from "react";
import { ScrollView, View } from "react-native";

import { NotificationComponent } from "@/components";

const notifications = [
  {
    datetime: new Date("2024-09-02T15:05:00"),
    message: "You have a new message from David Adeleke",
    time: "3:05 PM",
  },
  {
    datetime: new Date("2024-09-01T19:05:00"),
    message: "You received ₦2,000 for a completed shipment (#45257)",
    time: "7:05 PM",
  },
  {
    datetime: new Date("2024-10-30T15:05:00"),
    message: "You have a new message from Chinedu Jay",
    time: "3:05 PM",
  },
  {
    datetime: new Date("2024-10-30T15:05:00"),
    message: "You have a new message from Damilola Adegbemile",
    time: "1:05 AM",
  },
  {
    datetime: new Date(),
    message: "Delivery Completed! Keep up the good work champ ✨",
    time: "3:05 PM",
  },
  {
    datetime: new Date(),
    message: "Delivery Completed! Keep up the good work champ ✨",
    time: "8:05 PM",
  },
];

const groupAndSortNotifications = (notifications: any[]) => {
  notifications.sort(
    (a: { datetime: number }, b: { datetime: number }) =>
      b.datetime - a.datetime
  );

  const grouped = notifications.reduce(
    (
      acc: { [x: string]: any[] },
      curr: { datetime: { toDateString: () => any } }
    ) => {
      const dateString = curr.datetime.toDateString();
      acc[dateString] = acc[dateString] || [];
      acc[dateString].push(curr);
      return acc;
    },
    {}
  );

  return Object.entries(grouped).map(([date, items]) => ({ date, items }));
};

const OrgNotifications = () => {
  const groupedNotifications = groupAndSortNotifications(notifications);

  return (
    <ScrollView style={{ backgroundColor: "white", marginTop: 4, padding: 12 }}>
      {groupedNotifications.map((group: any) => (
        <View key={group.date} style={{ marginBottom: 16 }}>
          {group?.items?.map((item: any, index: any) => (
            <NotificationComponent
              key={`${group.date}-${index}`}
              date={index === 0 ? group.date : ""}
              time={item.time}
              message={item.message}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default OrgNotifications;
