import api from "./api";


/*
=========================================================
INITIATE M-PESA PAYMENT
=========================================================
*/

export async function initiatePayment({
    orderId,
    phoneNumber
}) {

    return api.post(
        "/payments/initiate",
        {
            orderId,
            phoneNumber,
            paymentMethod: "MPESA"
        }
    );

}