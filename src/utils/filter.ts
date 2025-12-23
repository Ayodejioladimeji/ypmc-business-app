export const searchFilter = (data: any[], inputData: string) => {
    if (!inputData.trim()) return data; 

    return data.filter((item) => {
        const searchText = inputData.toLowerCase();

        return (
            item.name?.toLowerCase().includes(searchText) ||  
            item.lastMessage?.message?.toLowerCase().includes(searchText)
        );
    });
};

export const DataFilter = (data: any[], inputData: string) => {
    if (!inputData.trim()) return data;

    const searchText = inputData.toLowerCase();

    return data.filter((item) => {
        if (typeof item === "string") {
            return item.toLowerCase().includes(searchText);
        }

        // If item is an object, search all string values
        if (typeof item === "object" && item !== null) {
            return Object.values(item).some((val) =>
                typeof val === "string" && val.toLowerCase().includes(searchText)
            );
        }

        return false;
    });
};


export const sortDeliveries = (result:any, dateFilter:string) => {
    const now = new Date();
    
    return result?.filter((item:any) => {
        const createdAt = new Date(item.createdAt);
        switch (dateFilter) {
            case "last month":
                const oneMonthAgo = new Date(now);
                oneMonthAgo.setMonth(now.getMonth() - 1);
                return createdAt >= oneMonthAgo;
            case "6 months":
                const sixMonthsAgo = new Date(now);
                sixMonthsAgo.setMonth(now.getMonth() - 6);
                return createdAt >= sixMonthsAgo;
            case "1 year":
                const oneYearAgo = new Date(now);
                oneYearAgo.setFullYear(now.getFullYear() - 1);
                return createdAt >= oneYearAgo;
            default:
                return item;
        }
    })
}