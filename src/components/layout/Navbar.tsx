"use client";

import { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { clearCart, setUserId } from "@/store/slices/cartSlice";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  AppBar,
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  console.log("username", user?.username);

  const { items } = useSelector((state: RootState) => state.cart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setUserId(""));
    dispatch(clearCart());
    handleMenuClose();
    router.push("/");
  };

  const navigateTo = (path: string) => {
    handleMenuClose();
    router.push(path);
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (isAuthenticated && user) {
      return `${user.firstName?.[0] || ""}${
        user.lastName?.[0] || ""
      }`.toUpperCase();
    }
    return "";
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontSize: {
              xs: "0.875rem", // Extra small screens
              sm: "1rem", // Small screens
              md: "1.25rem", // Medium screens
              lg: "1.5rem", // Large screens
            },
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Beshara Store
          </Link>
        </Typography>

        {/* Common navigation links - visible to all users */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          <Tooltip title="About" placement="bottom" arrow>
            <IconButton
              color="inherit"
              component={Link}
              href="/about"
              sx={{
                p: { xs: 0.5, sm: 1 },
                "& .MuiSvgIcon-root": {
                  fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                },
              }}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <IconButton
            color="inherit"
            component={Link}
            href="/contact"
            sx={{
              p: { xs: 0.5, sm: 1 },
              "& .MuiSvgIcon-root": {
                fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
              },
            }}
          >
            <EmailIcon />
          </IconButton>

          {/* User-specific navigation */}
          {isAuthenticated ? (
            <>
              <Tooltip title="Cart">
                {mounted ? (
                  <IconButton
                    color="inherit"
                    component={Link}
                    href="/cart"
                    sx={{
                      p: { xs: 0.5, sm: 1 },
                      "& .MuiSvgIcon-root": {
                        fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                      },
                    }}
                  >
                    <Badge badgeContent={totalItems} color="secondary">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                ) : (
                  <IconButton
                    color="inherit"
                    component={Link}
                    href="/cart"
                    sx={{
                      p: { xs: 0.5, sm: 1 },
                      "& .MuiSvgIcon-root": {
                        fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                      },
                    }}
                  >
                    <ShoppingCartIcon />
                  </IconButton>
                )}
              </Tooltip>
              <Tooltip title="Account">
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{
                    ml: { xs: 0.5, sm: 1 },
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: 1,
                    px: { xs: 1, sm: 2 },
                    py: { xs: 0.25, sm: 0.5 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                      mr: { xs: 0.5, sm: 1 },
                    },
                  }}
                >
                  <PersonIcon />
                  <Box
                    component="span"
                    sx={{
                      display: { xs: "none", sm: "inline" },
                      ml: { xs: 0.5, sm: 1 },
                    }}
                  >
                    {user?.username || "User"}
                  </Box>
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Login">
              <IconButton
                color="inherit"
                component={Link}
                href="/login"
                sx={{
                  ml: { xs: 0.5, sm: 1 },
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 1,
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.25, sm: 0.5 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                    mr: { xs: 0.5, sm: 1 },
                  },
                }}
              >
                <LoginIcon />
                <Box
                  component="span"
                  sx={{
                    display: { xs: "none", sm: "inline" },
                    ml: { xs: 0.5, sm: 1 },
                  }}
                >
                  Login
                </Box>
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* User account menu - only for logged-in users */}
        {isAuthenticated && (
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                width: 200,
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "0.7rem", // Extra small screens
                    sm: "0.75rem", // Small screens
                    md: "0.875rem", // Medium screens and up
                  },
                  wordBreak: "break-word",
                  maxWidth: "200px",
                }}
              >
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => navigateTo("/profile")}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => navigateTo("/cart")}>
              <ListItemIcon>
                <ShoppingCartIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>My Cart</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
