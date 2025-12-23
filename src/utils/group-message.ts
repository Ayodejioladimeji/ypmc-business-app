import { format, isToday, isYesterday } from "date-fns";

export const groupMessagesByDate = (threads: any) => {
    const groupedMessages: any = {};

    threads?.forEach((thread: any) => {
        const date = new Date(thread.createdAt);
        let dateLabel;

        if (isToday(date)) {
            dateLabel = "Today";
        } else if (isYesterday(date)) {
            dateLabel = "Yesterday";
        } else {
            dateLabel = format(date, "MMMM d, yyyy");
        }

        if (!groupedMessages[dateLabel]) {
            groupedMessages[dateLabel] = [];
        }

        groupedMessages[dateLabel].push(thread);
    });

    return groupedMessages;
};