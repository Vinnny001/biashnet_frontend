import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  DeleteOutlineRounded,
  EditRounded,
  VisibilityRounded,
  Inventory2Rounded,
} from "@mui/icons-material";

import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatters";

const STATUS_COLOR = {
  approved: "success",
  active: "success",
  pending: "warning",
  rejected: "error",
};

function getProductImage(product) {
  return (
    product.images?.[0]?.thumb ||
    product.images?.[0]?.small ||
    product.images?.[0]?.full ||
    product.image ||
    product.imageUrl ||
    ""
  );
}

function getProductName(product) {
  return product.title || product.name || "Untitled product";
}

function getProductId(product) {
  return product.id || product._id;
}

export default function ProductTable({
  products = [],
  onDelete,
}) {
  if (!products.length) {
    return <EmptyProducts />;
  }

  return (
    <>
      {/* =========================
          DESKTOP
      ========================== */}
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
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((product) => {
                const id = getProductId(product);
                const image = getProductImage(product);
                const name = getProductName(product);
                const status =
                  product.status || "pending";

                return (
                  <TableRow
                    key={id}
                    hover
                  >
                    {/* Product */}
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ minWidth: 250 }}
                      >
                        <ProductImage
                          src={image}
                          name={name}
                        />

                        <Box>
                          <Typography
                            fontWeight={800}
                            noWrap
                            sx={{
                              maxWidth: 220,
                            }}
                          >
                            {name}
                          </Typography>

                          {product.subCategory && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {product.subCategory}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {product.category || "—"}
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight={800}
                      >
                        {formatCurrency(
                          product.price
                        )}
                      </Typography>

                      {product.oldPrice && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            textDecoration:
                              "line-through",
                          }}
                        >
                          {formatCurrency(
                            product.oldPrice
                          )}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      {product.stock ?? "—"}
                    </TableCell>

                    <TableCell>
                      <StatusChip status={status} />
                    </TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={0.5}
                      >
                        <Tooltip title="View">
                          <IconButton
                            component={Link}
                            to={`/products/${id}`}
                            size="small"
                          >
                            <VisibilityRounded />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton
                            component={Link}
                            to={`/seller/products/${id}/edit`}
                            size="small"
                            color="primary"
                          >
                            <EditRounded />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              onDelete?.(id)
                            }
                          >
                            <DeleteOutlineRounded />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </Box>

      {/* =========================
          MOBILE
      ========================== */}
      <Stack
        spacing={1.5}
        sx={{
          display: {
            xs: "flex",
            md: "none",
          },
        }}
      >
        {products.map((product) => {
          const id = getProductId(product);
          const image = getProductImage(product);
          const name = getProductName(product);
          const status =
            product.status || "pending";

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
                <Stack
                  direction="row"
                  spacing={1.5}
                >
                  <ProductImage
                    src={image}
                    name={name}
                    size={76}
                  />

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Typography
                        fontWeight={900}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {name}
                      </Typography>

                      <StatusChip
                        status={status}
                      />
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {product.category ||
                        "Uncategorized"}
                    </Typography>

                    <Typography
                      fontWeight={900}
                      color="primary.main"
                      sx={{ mt: 1 }}
                    >
                      {formatCurrency(
                        product.price
                      )}
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  sx={{
                    mt: 2,
                    pt: 1.5,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Stock:{" "}
                      <strong>
                        {product.stock ?? "—"}
                      </strong>
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={0.5}
                    >
                      <IconButton
                        component={Link}
                        to={`/products/${id}`}
                        size="small"
                      >
                        <VisibilityRounded />
                      </IconButton>

                      <IconButton
                        component={Link}
                        to={`/seller/products/${id}/edit`}
                        size="small"
                        color="primary"
                      >
                        <EditRounded />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          onDelete?.(id)
                        }
                      >
                        <DeleteOutlineRounded />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </>
  );
}

function ProductImage({
  src,
  name,
  size = 56,
}) {
  if (!src) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: 2,
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Inventory2Rounded
          color="disabled"
        />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={name}
      sx={{
        width: size,
        height: size,
        objectFit: "cover",
        borderRadius: 2,
        bgcolor: "action.hover",
        flexShrink: 0,
      }}
    />
  );
}

function StatusChip({ status }) {
  const normalized =
    String(status).toLowerCase();

  return (
    <Chip
      label={status}
      color={
        STATUS_COLOR[normalized] ||
        "default"
      }
      size="small"
      sx={{
        fontWeight: 700,
        textTransform: "capitalize",
      }}
    />
  );
}

function EmptyProducts() {
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
        <Inventory2Rounded
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
          No products yet
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            maxWidth: 420,
            mx: "auto",
            mt: 0.5,
            mb: 3,
          }}
        >
          Your products will appear here after
          you publish them. Add your first product
          and start selling on BIASHNET.
        </Typography>

        <Button
          component={Link}
          to="/seller/products/new"
          variant="contained"
          startIcon={<AddRounded />}
          sx={{
            fontWeight: 800,
          }}
        >
          Add Your First Product
        </Button>
      </CardContent>
    </Card>
  );
}