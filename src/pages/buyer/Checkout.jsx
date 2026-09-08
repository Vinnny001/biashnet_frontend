import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  Lock,
  Payment,
  ShoppingBag,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CheckoutForm from "../../components/forms/CheckoutForm";
import Card from "../../components/common/Card";

import { useCart } from "../../hooks/useCart";

import { createCheckout } from "../../services/checkout.Service";

import { formatCurrency } from "../../utils/formatters";
import { describeCheckoutError } from "../../utils/errors";


/*
|--------------------------------------------------------------------------
| Checkout Page
|--------------------------------------------------------------------------
|
| IMPORTANT
|
| The frontend does NOT:
|
| - calculate the authoritative product price
| - calculate commission
| - calculate seller earnings
| - determine sellerId
| - create one order per seller
|
| The backend does all of that.
|
| Frontend only sends:
|
| {
|   items: [
|     {
|       listingId,
|       quantity
|     }
|   ],
|   buyerPhone,
|   deliveryAddress,
|   idempotencyKey
| }
|
|--------------------------------------------------------------------------
*/


export default function Checkout() {

  const navigate =
    useNavigate();


  const cart =
    useCart();


  const [error, setError] =
    useState("");


  const [placing, setPlacing] =
    useState(false);


  const [checkoutCreated, setCheckoutCreated] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | Redirect if cart is empty
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (
      !cart.items ||
      cart.items.length === 0
    ) {

      navigate("/cart", {
        replace: true,
      });

    }

  }, [
    cart.items,
    navigate,
  ]);


  /*
  |--------------------------------------------------------------------------
  | CREATE IDEMPOTENCY KEY
  |--------------------------------------------------------------------------
  |
  | This protects against:
  |
  | - double tapping checkout
  | - network retry
  | - Android/browser retry
  | - accidental duplicate order creation
  |
  |--------------------------------------------------------------------------
  */

  function createIdempotencyKey() {

    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {

      return crypto.randomUUID();

    }


    return (
      `checkout_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}`
    );

  }


  /*
  |--------------------------------------------------------------------------
  | SUBMIT CHECKOUT
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(values) {

    if (placing) {

      return;

    }


    if (
      checkoutCreated
    ) {

      return;

    }


    setError("");

    setPlacing(true);


    try {

      /*
      ======================================================
      PREPARE CART
      ======================================================
      */

      if (
        !Array.isArray(cart.items) ||
        cart.items.length === 0
      ) {

        throw new Error(
          "Your cart is empty."
        );

      }


      /*
      ======================================================
      SEND ONLY TRUSTED INPUTS
      ======================================================
      */

      const items =
        cart.items.map(
          (item) => {

            const listingId =
              item.listingId ||
              item.id;


            const quantity =
              Number(
                item.quantity || 1
              );


            if (!listingId) {

              throw new Error(
                "A product in your cart is missing its listing ID."
              );

            }


            if (
              !Number.isInteger(quantity) ||
              quantity <= 0
            ) {

              throw new Error(
                "One of the products has an invalid quantity."
              );

            }


            return {

              listingId,

              quantity,

            };

          }
        );


      /*
      ======================================================
      IDEMPOTENCY
      ======================================================
      */

      const idempotencyKey =
        createIdempotencyKey();


      /*
      ======================================================
      CREATE SERVER-CONTROLLED CHECKOUT
      ======================================================
      */

      const response =
        await createCheckout({

          items,

          buyerPhone:
            values.buyerPhone ||
            values.phoneNumber ||
            values.phone ||
            "",

          deliveryAddress:
            values.address
              ? {
                  location: values.address,
                  phone:
                    values.phone ||
                    values.buyerPhone ||
                    null,
                  notes:
                    values.notes ||
                    null,
                }
              : null,

          idempotencyKey,

        });


      /*
      ======================================================
      VALIDATE RESPONSE
      ======================================================
      */

      if (
        !response ||
        !response.orderId
      ) {

        throw new Error(
          "Checkout was created but no order ID was returned."
        );

      }


      /*
      ======================================================
      MARK CHECKOUT CREATED
      ======================================================
      */

      setCheckoutCreated(
        true
      );


      /*
      ======================================================
      DO NOT CLEAR CART YET
      ======================================================
      |
      | We clear the cart AFTER payment succeeds.
      |
      | If STK initiation fails, the buyer should still
      | have their cart.
      |
      ======================================================
      */


      /*
      ======================================================
      GO TO PAYMENT PAGE
      ======================================================
      */

      navigate(
        `/buyer/payment/${response.orderId}`,
        {
          state: {

            orderId:
              response.orderId,

            checkout:
              response,

          },

        }
      );

    } catch (err) {

      console.error(
        "Checkout creation error:",
        err
      );


      setError(
        describeCheckoutError(
          err,
          cart.items,
          "Could not create your checkout. Please try again."
        )
      );

    } finally {

      setPlacing(false);

    }

  }


  /*
  |--------------------------------------------------------------------------
  | EMPTY CART UI
  |--------------------------------------------------------------------------
  */

  if (
    !cart.items ||
    cart.items.length === 0
  ) {

    return null;

  }


  /*
  |--------------------------------------------------------------------------
  | CALCULATE DISPLAY TOTAL
  |--------------------------------------------------------------------------
  |
  | This is ONLY a visual estimate.
  |
  | The backend remains authoritative.
  |
  |--------------------------------------------------------------------------
  */

  const displaySubtotal =
    cart.items.reduce(
      (
        total,
        item
      ) => {

        return (
          total +
          Number(
            item.price || 0
          ) *
          Number(
            item.quantity || 1
          )
        );

      },
      0
    );


  return (

    <Box
      sx={{
        py: {
          xs: 2,
          md: 4,
        },
      }}
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          mb: 3,
        }}
      >

        <Button
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate("/cart")
          }
          disabled={placing}
        >
          Back to cart
        </Button>

      </Stack>


      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          mb: 1,
        }}
      >
        Checkout
      </Typography>


      <Typography
        color="text.secondary"
        sx={{
          mb: 3,
        }}
      >
        Confirm your delivery details before proceeding
        to secure payment.
      </Typography>


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
        >
          {error}
        </Alert>

      )}


      <Grid
        container
        spacing={3}
      >

        {/* =================================================
            CHECKOUT FORM
        ================================================= */}

        <Grid
          item
          xs={12}
          md={7}
        >

          <Card>

            <Stack
              spacing={2}
            >

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >

                <ShoppingBag />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Delivery details
                </Typography>

              </Stack>


              <Divider />


              <CheckoutForm
                onSubmit={handleSubmit}
                disabled={placing}
              />

            </Stack>

          </Card>

        </Grid>


        {/* =================================================
            ORDER SUMMARY
        ================================================= */}

        <Grid
          item
          xs={12}
          md={5}
        >

          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              position: {
                md: "sticky",
              },
              top: {
                md: 20,
              },
            }}
          >

            <Stack
              spacing={2}
            >

              <Typography
                variant="h6"
                fontWeight={700}
              >
                Order summary
              </Typography>


              <Divider />


              {/* ==========================================
                  ITEMS
              ========================================== */}

              <Stack
                spacing={1.5}
              >

                {cart.items.map(
                  (
                    item,
                    index
                  ) => {

                    const quantity =
                      Number(
                        item.quantity || 1
                      );


                    const price =
                      Number(
                        item.price || 0
                      );


                    const total =
                      price *
                      quantity;


                    return (

                      <Box
                        key={
                          item.listingId ||
                          item.id ||
                          index
                        }
                      >

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          spacing={2}
                        >

                          <Box
                            sx={{
                              minWidth: 0,
                            }}
                          >

                            <Typography
                              fontWeight={600}
                              noWrap
                            >
                              {item.name ||
                                item.title ||
                                "Product"}
                            </Typography>


                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              Qty: {quantity}
                            </Typography>

                          </Box>


                          <Typography
                            fontWeight={600}
                            sx={{
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {formatCurrency(
                              total
                            )}
                          </Typography>

                        </Stack>

                      </Box>

                    );

                  }
                )}

              </Stack>


              <Divider />


              {/* ==========================================
                  SUBTOTAL
              ========================================== */}

              <Stack
                direction="row"
                justifyContent="space-between"
              >

                <Typography>
                  Subtotal
                </Typography>


                <Typography
                  fontWeight={600}
                >
                  {formatCurrency(
                    displaySubtotal
                  )}
                </Typography>

              </Stack>


              {/* ==========================================
                  DELIVERY
              ========================================== */}

              <Stack
                direction="row"
                justifyContent="space-between"
              >

                <Typography>
                  Delivery
                </Typography>


                <Typography
                  fontWeight={600}
                >
                  Calculated at checkout
                </Typography>

              </Stack>


              <Divider />


              {/* ==========================================
                  TOTAL
              ========================================== */}

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Estimated total
                </Typography>


                <Typography
                  variant="h5"
                  fontWeight={800}
                  color="primary.main"
                >
                  {formatCurrency(
                    displaySubtotal
                  )}
                </Typography>

              </Stack>


              {/* ==========================================
                  SECURITY
              ========================================== */}

              <Alert
                severity="info"
                icon={<Lock />}
              >
                Your final amount is verified securely
                by Biashnet's backend before payment.
              </Alert>


              {/* ==========================================
                  PAYMENT INDICATOR
              ========================================== */}

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  pt: 1,
                }}
              >

                <Payment />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Secure M-Pesa payment
                </Typography>

              </Stack>

            </Stack>

          </Paper>

        </Grid>

      </Grid>

    </Box>

  );

}