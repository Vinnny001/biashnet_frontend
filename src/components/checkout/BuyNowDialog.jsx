import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useState } from "react";

import {
  buyNow,
} from "../../services/checkout.Service";

import { formatCurrency } from "../../utils/formatters";


/*
=========================================================
BIASHNET BUY NOW DIALOG
=========================================================

FLOW:

Product
   ↓
Buy Now
   ↓
Buyer enters details
   ↓
createCheckout()
   ↓
Marketplace Order created
   ↓
initiatePayment()
   ↓
M-PESA STK Push
   ↓
Buyer enters PIN
   ↓
Payment callback
   ↓
Order becomes PAID
=========================================================
*/

export default function BuyNowDialog({
  open,
  onClose,
  product,
  onSuccess,
}) {

  const [quantity, setQuantity] =
    useState(1);

  const [phone, setPhone] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [name, setName] =
    useState("");

  const [landmark, setLandmark] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [paymentStarted, setPaymentStarted] =
    useState(false);

  const [paymentResult, setPaymentResult] =
    useState(null);


  /*
  =======================================================
  PRODUCT
  =======================================================
  */

  const stock =
    Number(product?.stock || 0);

  const productTitle =
    product?.title ||
    product?.name ||
    "Product";


  /*
  =======================================================
  DISPLAY PRICE
  =======================================================
  */

  const estimatedTotal =
    Number(product?.price || 0) *
    quantity;


  /*
  =======================================================
  RESET
  =======================================================
  */

  function resetForm() {

    setQuantity(1);
    setPhone("");
    setLocation("");
    setName("");
    setLandmark("");
    setNotes("");
    setError("");
    setPaymentStarted(false);
    setPaymentResult(null);

  }


  /*
  =======================================================
  CLOSE
  =======================================================
  */

  function handleClose() {

    if (loading) {
      return;
    }

    resetForm();

    onClose?.();

  }


  /*
  =======================================================
  QUANTITY
  =======================================================
  */

  function handleQuantityChange(event) {

    const value =
      Number(event.target.value);

    if (!Number.isFinite(value)) {
      setQuantity(1);
      return;
    }

    const normalized =
      Math.floor(value);

    if (normalized < 1) {
      setQuantity(1);
      return;
    }

    if (
      stock > 0 &&
      normalized > stock
    ) {
      setQuantity(stock);
      return;
    }

    setQuantity(normalized);

  }


  /*
  =======================================================
  VALIDATION
  =======================================================
  */

  function validateForm() {

    if (!product?.id) {
      return "Product information is missing.";
    }

    if (stock <= 0) {
      return "This product is currently out of stock.";
    }

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return "Please enter a valid quantity.";
    }

    if (quantity > stock) {
      return `Only ${stock} item${
        stock === 1 ? "" : "s"
      } available.`;
    }

    const cleanPhone =
      phone.trim()
        .replace(/\s+/g, "")
        .replace(/-/g, "");

    if (!cleanPhone) {
      return "M-PESA phone number is required.";
    }

    if (
      !/^(\+254|254|07|01)\d{8,9}$/.test(
        cleanPhone
      )
    ) {
      return "Enter a valid Kenyan M-PESA phone number.";
    }

    if (!location.trim()) {
      return "Delivery location is required.";
    }

    return null;
  }


  /*
  =======================================================
  BUY
  =======================================================
  */

  async function handleBuy() {

    if (loading) {
      return;
    }

    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {

      /*
      -----------------------------------------------------
      COMPLETE BUY NOW FLOW
      -----------------------------------------------------
      */

      const result =
        await buyNow({

          listingId:
            product.id,

          quantity,

          buyerPhone:
            phone.trim(),

          deliveryAddress: {

            name:
              name.trim() || null,

            phone:
              phone.trim(),

            location:
              location.trim(),

            landmark:
              landmark.trim() || null,

            notes:
              notes.trim() || null,

          },

        });


      /*
      -----------------------------------------------------
      VERIFY ORDER
      -----------------------------------------------------
      */

      if (!result?.orderId) {
        throw new Error(
          "Order was created but no order ID was returned."
        );
      }


      /*
      -----------------------------------------------------
      VERIFY PAYMENT
      -----------------------------------------------------
      */

      if (!result?.payment) {
        throw new Error(
          "Order was created but M-PESA payment could not be initiated."
        );
      }


      /*
      -----------------------------------------------------
      SUCCESS
      -----------------------------------------------------
      */

      console.log(
        "✅ BIASHNET ORDER CREATED:",
        result.orderId
      );

      console.log(
        "📲 BIASHNET STK PUSH SENT:",
        result.payment
      );


      setPaymentResult(result);

      setPaymentStarted(true);


      /*
      Give parent/product page a chance to react.
      */

      onSuccess?.(result);

    } catch (error) {

      console.error(
        "❌ Buy Now error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to start payment. Please try again.";

      setError(message);

    } finally {

      setLoading(false);

    }

  }


  /*
  =======================================================
  PAYMENT STARTED SCREEN
  =======================================================
  */

  if (paymentStarted) {

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>
          Payment Request Sent
        </DialogTitle>

        <DialogContent>

          <Stack
            spacing={2}
            sx={{ pt: 1 }}
          >

            <Alert severity="success">

              M-PESA payment request sent
              successfully.

            </Alert>


            <Typography
              variant="h6"
              fontWeight={700}
            >
              Check your phone
            </Typography>


            <Typography
              color="text.secondary"
            >
              An M-PESA prompt has been sent to:

            </Typography>


            <Typography
              fontWeight={700}
            >
              {paymentResult?.payment?.phone ||
                phone}
            </Typography>


            <Divider />


            <Stack
              direction="row"
              justifyContent="space-between"
            >

              <Typography>
                Order ID
              </Typography>

              <Typography
                fontWeight={700}
                sx={{
                  wordBreak: "break-all",
                  textAlign: "right",
                }}
              >
                {paymentResult?.orderId}
              </Typography>

            </Stack>


            <Stack
              direction="row"
              justifyContent="space-between"
            >

              <Typography>
                Amount
              </Typography>

              <Typography
                fontWeight={800}
              >
                {formatCurrency(
                  paymentResult?.payment?.amount ||
                  paymentResult?.amount ||
                  0
                )}
              </Typography>

            </Stack>


            <Alert severity="info">

              Enter your M-PESA PIN on your phone
              to complete the payment.

            </Alert>


            <Typography
              variant="body2"
              color="text.secondary"
            >
              Do not close or cancel the M-PESA
              request while completing payment.

            </Typography>

          </Stack>

        </DialogContent>


        <DialogActions
          sx={{ p: 2 }}
        >

          <Button
            variant="contained"
            onClick={handleClose}
          >
            Done
          </Button>

        </DialogActions>

      </Dialog>
    );
  }


  /*
  =======================================================
  NORMAL BUY FORM
  =======================================================
  */

  return (

    <Dialog
      open={open}
      onClose={
        loading
          ? undefined
          : handleClose
      }
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle>
        Buy Now
      </DialogTitle>


      <DialogContent>

        <Stack
          spacing={2}
          sx={{ pt: 1 }}
        >

          <Typography
            variant="h6"
            fontWeight={700}
          >
            {productTitle}
          </Typography>


          <Stack
            direction="row"
            justifyContent="space-between"
          >

            <Typography
              color="text.secondary"
            >
              Price
            </Typography>

            <Typography
              fontWeight={700}
            >
              {formatCurrency(
                Number(product?.price || 0)
              )}
            </Typography>

          </Stack>


          <Typography
            variant="body2"
            color="text.secondary"
          >
            {stock > 0
              ? `${stock} available`
              : "Out of stock"}
          </Typography>


          <Divider />


          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{
              min: 1,
              max: stock || 1,
            }}
            fullWidth
            disabled={
              loading ||
              stock <= 0
            }
          />


          <TextField
            label="M-PESA phone number"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            placeholder="0712345678"
            helperText="An M-PESA payment prompt will be sent to this number."
            fullWidth
            required
            disabled={loading}
          />


          <TextField
            label="Recipient name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Your name"
            fullWidth
            disabled={loading}
          />


          <TextField
            label="Delivery location"
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
            placeholder="Juja, JKUAT..."
            fullWidth
            required
            disabled={loading}
          />


          <TextField
            label="Landmark"
            value={landmark}
            onChange={(event) =>
              setLandmark(event.target.value)
            }
            placeholder="Near Gate C..."
            fullWidth
            disabled={loading}
          />


          <TextField
            label="Delivery notes"
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            placeholder="Special delivery instructions..."
            multiline
            minRows={2}
            fullWidth
            disabled={loading}
          />


          <Divider />


          <Stack
            direction="row"
            justifyContent="space-between"
          >

            <Typography
              fontWeight={600}
            >
              Estimated total
            </Typography>

            <Typography
              variant="h6"
              fontWeight={800}
              color="primary"
            >
              {formatCurrency(
                estimatedTotal
              )}
            </Typography>

          </Stack>


          <Typography
            variant="caption"
            color="text.secondary"
          >
            The final amount is calculated and
            verified by the BIASHNET backend.
          </Typography>


          {error && (

            <Alert
              severity="error"
              onClose={() =>
                setError("")
              }
            >
              {error}
            </Alert>

          )}

        </Stack>

      </DialogContent>


      <DialogActions
        sx={{ p: 2 }}
      >

        <Button
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </Button>


        <Button
          variant="contained"
          onClick={handleBuy}
          disabled={
            loading ||
            !product?.id ||
            stock <= 0
          }
        >

          {loading
            ? "Sending M-PESA..."
            : "Pay with M-PESA"}

        </Button>

      </DialogActions>

    </Dialog>
  );
}