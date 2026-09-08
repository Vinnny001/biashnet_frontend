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
REMOVE ITEM FROM AN UNPAID ORDER
=========================================================

Buyer-only, only while the order is still unpaid.
Removing the last item cancels the whole order.
=========================================================
*/

export async function removeOrderItem(orderId, listingId) {

    return paymentApi.delete(
        `/orders/${orderId}/items/${listingId}`
    );
}


/*
=========================================================
REDUCE ITEM QUANTITY ON AN UNPAID ORDER
=========================================================

Buyer-only, only while unpaid, and only a reduction —
quantity must be below what's currently on the order.
=========================================================
*/

export async function reduceOrderItemQuantity(orderId, listingId, quantity) {

    return paymentApi.patch(
        `/orders/${orderId}/items/${listingId}`,
        { quantity }
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

    removeItem(orderId, listingId) {

        return removeOrderItem(orderId, listingId);
    },

    reduceItemQuantity(orderId, listingId, quantity) {

        return reduceOrderItemQuantity(orderId, listingId, quantity);
    },

    resolvePartial(orderId, decision) {

        return resolvePartial(orderId, decision);
    },

    getMySubOrders,

};
