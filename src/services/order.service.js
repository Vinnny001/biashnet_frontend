import { paymentApi } from "./api";


/*
=========================================================
GET SINGLE ORDER
=========================================================
*/

export async function getOrder(orderId) {

    return paymentApi.get(
        `/orders/${orderId}`
    );
}


/*
=========================================================
GET BUYER ORDERS
=========================================================
*/

export async function getMyOrders() {

    return paymentApi.get(
        "/orders/my"
    );
}


/*
=========================================================
GET SELLER ORDERS
=========================================================
*/

export async function getSellerOrders() {

    return paymentApi.get(
        "/orders/seller"
    );
}


/*
=========================================================
GET MY SUB-ORDERS (seller)
=========================================================

Per-order drop-off status/deadline for the authenticated
seller — see backend service/logisticsService.js.
=========================================================
*/

export async function getMySubOrders() {

    return paymentApi.get(
        "/seller/sub-orders"
    );
}


/*
=========================================================
CANCEL ORDER
=========================================================
*/

export async function cancelOrder(orderId) {

    return paymentApi.post(
        `/orders/${orderId}/cancel`
    );
}


/*
=========================================================
RESOLVE PARTIAL FULFILLMENT
=========================================================

Only usable once the order has been flagged
(customerDecisionRequired) because a seller missed their
36h drop-off window.
=========================================================
*/

export async function resolvePartial(orderId, decision) {

    return paymentApi.post(
        `/orders/${orderId}/resolve-partial`,
        { decision }
    );
}


/*
=========================================================
OBJECT EXPORT
=========================================================

Several pages import `{ orderService }` as an
object-of-methods (matching product.service.js's
convention). `list()` routes to the buyer's own orders by
default, or the seller's orders when called with
`{ sellerId }` — the backend always derives the actual
identity from the auth token regardless, this just picks
the right endpoint.
=========================================================
*/

export const orderService = {

    list(params = {}) {

        if (params?.sellerId) {

            return getSellerOrders();
        }

        return getMyOrders();
    },

    get(orderId) {

        return getOrder(orderId);
    },

    cancel(orderId) {

        return cancelOrder(orderId);
    },

    resolvePartial(orderId, decision) {

        return resolvePartial(orderId, decision);
    },

    getMySubOrders,

};
