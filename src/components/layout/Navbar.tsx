"use client";

import { logout } from "@/features/auth/authSlice";
import { RootState } from "@/lib/store";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Chip,
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
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { items } = useSelector((state: RootState) => state.cart);

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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            E-Commerce Store
          </Link>
        </Typography>

        {/* Common navigation links - visible to all users */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="About">
            <IconButton color="inherit" component={Link} href="/about">
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Contact Us">
            <IconButton color="inherit" component={Link} href="/contact">
              <EmailIcon />
            </IconButton>
          </Tooltip>

          {/* User-specific navigation */}
          {isAuthenticated ? (
            <>
              {/* Logged-in user section */}
              <Tooltip title="My Cart">
                <IconButton color="inherit" component={Link} href="/cart">
                  <Badge badgeContent={items.length} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Chip
                avatar={
                  <Avatar sx={{ bgcolor: "secondary.main" }}>
                    {getInitials()}
                  </Avatar>
                }
                label={user?.firstName || "User"}
                color="default"
                variant="outlined"
                onClick={handleMenuOpen}
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.25)",
                  },
                  ml: 1,
                  border: "none",
                }}
              />
            </>
          ) : (
            /* Non-logged-in user section */
            <IconButton
              color="inherit"
              component={Link}
              href="/login"
              sx={{
                ml: 1,
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 1,
                px: 2,
                py: 0.5,
                fontSize: "0.875rem",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <LoginIcon sx={{ mr: 1, fontSize: "1.25rem" }} />
              Login
            </IconButton>
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
              <Typography variant="body2" color="text.secondary">
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
