import api from "./api";


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