import { paymentApi } from "./api";


/*
=========================================================
WITHDRAWALS LIVE ON THE PAYMENT SERVICE
=========================================================

/api/withdrawals is mounted by biashnet-mpesa-api, not the
main backend — it moves real money out of the seller's
marketplace wallet via M-PESA B2C. Calling it through the
main `api` client 404s.
=========================================================
*/


/*
=========================================================
CREATE WITHDRAWAL
=========================================================
*/

export async function createWithdrawal({
    amount,
    phoneNumber
}) {

    return paymentApi.post(
        "/withdrawals",
        {
            amount,
            phoneNumber
        }
    );
}


/*
=========================================================
GET MY WITHDRAWALS
=========================================================
*/

export async function getMyWithdrawals() {

    return paymentApi.get(
        "/withdrawals"
    );
}


/*
=========================================================
GET ONE WITHDRAWAL
=========================================================
*/

export async function getWithdrawal(
    withdrawalId
) {

    return paymentApi.get(
        `/withdrawals/${withdrawalId}`
    );
}


/*
=========================================================
CANCEL WITHDRAWAL
=========================================================
*/

export async function cancelWithdrawal(
    withdrawalId
) {

    return paymentApi.post(
        `/withdrawals/${withdrawalId}/cancel`
    );
}