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

    return api.post(
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

    return api.get(
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

    return api.get(
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

    return api.post(
        `/withdrawals/${withdrawalId}/cancel`
    );
}