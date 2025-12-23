import axios from "axios";

const PAYSTACK_SECRET_KEY = "sk_test_6b767f8dc171ac19394d73e89bd5c3c8240dccb2";
export const verifyAccountNumber = async (accountNumber: string, bankCode: string) => {
   
    try {
        const response = await axios.get(
            `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.data.status) {
            return {
                success: true,
                accountName: response.data.data.account_name,
            };
        } else {
            return {
                success: false,
                message: "Account verification failed",
            };
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "An error occurred",
        };
    }
};
