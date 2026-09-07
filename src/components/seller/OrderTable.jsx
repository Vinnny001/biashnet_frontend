import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  ArrowForwardRounded,
  ShoppingBagRounded,
} from "@mui/icons-material";

import { Link } from "react-router-dom";

import {
  formatCurrency,
  formatDate,
} from "../../utils/formatters";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_COLOR = {
  pending: "warning",
  processing: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

function getOrderStatus(order) {
  return (
    order.orderStatus ||
    order.status ||
    "pending"
  );
}

function getBuyerName(order) {
  return (
    order.customerName ||
    order.buyerName ||
    order.customer?.name ||
    "Customer"
  );
}

function getOrderId(order) {
  return order.id || order._id;
}

function getSellerItems(order, sellerId) {
  if (!sellerId) {
    return order.items || [];
  }

  return (order.items || []).filter(
    (item) =>
      item.sellerId === sellerId
  );
}

function getSellerTotal(
  order,
  sellerId
) {
  const items = getSellerItems(
    order,
    sellerId
  );

  return items.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );
}

export default function OrderTable({
  orders = [],
  sellerId,
  onStatusChange,
}) {
  if (!orders.length) {
    return <EmptyOrders />;
  }

  return (
    <>
      {/* =================================
          DESKTOP TABLE
      ================================== */}

      <Box
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
          overflowX: "auto",
        }}
      >
        <Card
          sx={{
            borderRadius: 2.5,
            boxShadow: "none",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Order
                </TableCell>

                <TableCell>
                  Customer
                </TableCell>

                <TableCell>
                  Items
                </TableCell>

                <TableCell>
                  Seller Total
                </TableCell>

                <TableCell>
                  Date
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order) => {
                const id =
                  getOrderId(order);

                const items =
                  getSellerItems(
                    order,
                    sellerId
                  );

                const total =
                  getSellerTotal(
                    order,
                    sellerId
                  );

                const status =
                  getOrderStatus(order);

                return (
                  <TableRow
                    key={id}
                    hover
                  >
                    <TableCell>
                      <Typography
                        fontWeight={800}
                      >
                        #{String(id).slice(
                          -8
                        )}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight={700}
                      >
                        {getBuyerName(
                          order
                        )}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        {items.map(
                          (item) => (
                            <Typography
                              key={
                                item.id ||
                                item.productId
                              }
                              variant="body2"
                            >
                              {item.title ||
                                item.name ||
                                "Product"}{" "}
                              ×{" "}
                              {item.quantity ||
                                1}
                            </Typography>
                          )
                        )}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight={900}
                        color="primary.main"
                      >
                        {formatCurrency(
                          total
                        )}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {formatDate(
                        order.createdAt
                      )}
                    </TableCell>

                    <TableCell>
                      <StatusControl
                        status={status}
                        onChange={
                          onStatusChange
                            ? (value) =>
                                onStatusChange(
                                  id,
                                  value
                                )
                            : null
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Button
                        component={Link}
                        to={`/orders/${id}`}
                        size="small"
                        endIcon={
                          <ArrowForwardRounded />
                        }
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </Box>

      {/* =================================
          MOBILE CARDS
      ================================== */}

      <Stack
        spacing={1.5}
        sx={{
          display: {
            xs: "flex",
            md: "none",
          },
        }}
      >
        {orders.map((order) => {
          const id =
            getOrderId(order);

          const items =
            getSellerItems(
              order,
              sellerId
            );

          const total =
            getSellerTotal(
              order,
              sellerId
            );

          const status =
            getOrderStatus(order);

          return (
            <Card
              key={id}
              sx={{
                borderRadius: 2.5,
                boxShadow: "none",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent>
                {/* Header */}

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={1}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Order
                    </Typography>

                    <Typography
                      fontWeight={900}
                    >
                      #
                      {String(id).slice(
                        -8
                      )}
                    </Typography>
                  </Box>

                  <StatusControl
                    status={status}
                    onChange={
                      onStatusChange
                        ? (value) =>
                            onStatusChange(
                              id,
                              value
                            )
                        : null
                    }
                  />
                </Stack>

                {/* Customer */}

                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Customer
                  </Typography>

                  <Typography
                    fontWeight={800}
                  >
                    {getBuyerName(
                      order
                    )}
                  </Typography>
                </Box>

                {/* Items */}

                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Items
                  </Typography>

                  <Stack
                    spacing={0.5}
                    sx={{ mt: 0.5 }}
                  >
                    {items.map(
                      (item) => (
                        <Typography
                          key={
                            item.id ||
                            item.productId
                          }
                          variant="body2"
                        >
                          {item.title ||
                            item.name ||
                            "Product"}{" "}
                          ×{" "}
                          {item.quantity ||
                            1}
                        </Typography>
                      )
                    )}
                  </Stack>
                </Box>

                {/* Bottom */}

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-end"
                  sx={{
                    mt: 2,
                    pt: 1.5,
                    borderTop:
                      "1px solid",
                    borderColor:
                      "divider",
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Seller total
                    </Typography>

                    <Typography
                      fontWeight={900}
                      color="primary.main"
                    >
                      {formatCurrency(
                        total
                      )}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {formatDate(
                        order.createdAt
                      )}
                    </Typography>
                  </Box>

                  <Button
                    component={Link}
                    to={`/orders/${id}`}
                    size="small"
                    endIcon={
                      <ArrowForwardRounded />
                    }
                  >
                    View
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </>
  );
}

function StatusControl({
  status,
  onChange,
}) {
  if (!onChange) {
    return (
      <Chip
        label={status}
        color={
          STATUS_COLOR[status] ||
          "default"
        }
        size="small"
        sx={{
          fontWeight: 700,
          textTransform:
            "capitalize",
        }}
      />
    );
  }

  return (
    <Select
      size="small"
      value={status}
      onChange={(event) =>
        onChange(
          event.target.value
        )
      }
      sx={{
        minWidth: 120,
        "& .MuiSelect-select": {
          py: 0.75,
          fontWeight: 700,
          textTransform:
            "capitalize",
        },
      }}
    >
      {STATUS_OPTIONS.map(
        (option) => (
          <MenuItem
            key={option}
            value={option}
          >
            {option}
          </MenuItem>
        )
      )}
    </Select>
  );
}

function EmptyOrders() {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "none",
        border: "1px dashed",
        borderColor: "divider",
      }}
    >
      <CardContent
        sx={{
          py: 7,
          textAlign: "center",
        }}
      >
        <ShoppingBagRounded
          sx={{
            fontSize: 56,
            color: "text.disabled",
            mb: 1,
          }}
        />

        <Typography
          variant="h6"
          fontWeight={900}
        >
          No orders yet
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            maxWidth: 420,
            mx: "auto",
            mt: 0.5,
          }}
        >
          When customers purchase your
          products, their orders will appear
          here.
        </Typography>
      </CardContent>
    </Card>
  );
}