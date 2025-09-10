'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, AccountCircle } from '@mui/icons-material';
import { RootState } from '@/lib/store';
import { logout } from '@/lib/features/auth/authSlice';
import { getBrandLogo } from '@/lib/branding';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
    handleClose();
  };

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Mobile', href: '/mobile' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          {getBrandLogo()}
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} component={Link} href={item.href} onClick={handleDrawerToggle}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {!isAuthenticated ? (
          <>
            <ListItem component={Link} href="/auth/login" onClick={handleDrawerToggle}>
              <ListItemText primary="Sign In" />
            </ListItem>
            <ListItem component={Link} href="/auth/register" onClick={handleDrawerToggle}>
              <ListItemText primary="Get Started" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem component={Link} href="/dashboard" onClick={handleDrawerToggle}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            {user?.role === 'admin' && (
              <ListItem component={Link} href="/admin" onClick={handleDrawerToggle}>
                <ListItemText primary="Admin Panel" />
              </ListItem>
            )}
            <ListItem onClick={() => { handleLogout(); handleDrawerToggle(); }}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link}
            href="/"
            sx={{ 
              flexGrow: 1, 
              color: 'primary.main', 
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {getBrandLogo()}
          </Typography>
          
          {isMobile ? (
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  sx={{ color: 'text.primary', textTransform: 'none' }}
                >
                  {item.label}
                </Button>
              ))}
              {isAuthenticated && user?.role === 'COACH' && (
                <Button component={Link} href="/dashboard/billing" sx={{ color: 'text.primary', textTransform: 'none' }}>
                  Billing
                </Button>
              )}
              {isAuthenticated && user?.role === 'ADMIN' && (
                <>
                  <Button component={Link} href="/admin/billing" sx={{ color: 'text.primary', textTransform: 'none' }}>
                    Admin Billing
                  </Button>
                  <Button component={Link} href="/admin/upi" sx={{ color: 'text.primary', textTransform: 'none' }}>
                    UPI Settings
                  </Button>
                </>
              )}
              
              {!isAuthenticated ? (
                <>
                  <Button
                    component={Link}
                    href="/auth/login"
                    sx={{ color: 'text.primary', textTransform: 'none' }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="contained"
                    component={Link}
                    href="/auth/register"
                    sx={{ 
                      bgcolor: 'primary.main', 
                      '&:hover': { bgcolor: 'primary.dark' },
                      textTransform: 'none'
                    }}
                  >
                    Get Started
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    href="/dashboard"
                    sx={{ color: 'text.primary', textTransform: 'none' }}
                  >
                    Dashboard
                  </Button>
                  {user?.role === 'admin' && (
                    <Button
                      component={Link}
                      href="/admin"
                      sx={{ color: 'primary.main', textTransform: 'none', fontWeight: 'bold' }}
                    >
                      Admin
                    </Button>
                  )}
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="primary"
                  >
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      {user?.fullName?.charAt(0) || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose} component={Link} href="/profile">
                      Profile
                    </MenuItem>
                    {user?.role === 'admin' && (
                      <MenuItem onClick={handleClose} component={Link} href="/admin">
                        Admin Panel
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
