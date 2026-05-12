import * as React from 'react';
import { useEffect } from 'react';

import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { isSupabaseConfigured, supabase, supabaseConfigMessage } from './supabaseClient';
import { user } from './userState';

import About from './screens/About';
import {
  createDiaryTheme,
  darkThemeColors,
  getReadableTextColorForColors,
  lightThemeColors,
  type CustomThemeColors,
} from './Theme';
import Dashboard from './screens/Dashboard';
import DiaryAddEdit from './screens/DiaryAddEdit';
import DiaryItems from './screens/DiaryItems';
import Login from './screens/Login';
import Register from './screens/Register';
import Map from './screens/Map';
import { Route, Routes, useNavigate } from 'react-router';

type PageRoute = {
  page: string,
  route: string,
}

const pages: PageRoute[] = [
  { page: 'Dashboard', route: '/' },
  { page: 'About', route: '/about' },
  { page: 'Diary', route: '/diarylist' },
  { page: 'New', route: '/diaryedit' },
  { page: 'Map', route: '/map' },
]
const settings: PageRoute[] = [
  { page: 'Register', route: '/register' },
  { page: 'Login', route: '/login' },
]
const settingsUser: PageRoute[] = [
  { page: 'Change password', route: '/password' },
  { page: 'Logout', route: '/logout' },
]

const colorLabels: { key: keyof CustomThemeColors, label: string }[] = [
  { key: 'background', label: 'Background' },
  { key: 'card', label: 'Cards' },
  { key: 'accent', label: 'Accent' },
]

const websiteColorLabels: { key: keyof CustomThemeColors, label: string }[] = [
  { key: 'website', label: 'Start color' },
  { key: 'websiteMiddle', label: 'Middle color' },
  { key: 'websiteEnd', label: 'End color' },
]

function loadStoredDarkMode() {
  return localStorage.getItem('myDiaryDarkMode') === 'true'
}

function loadStoredThemeColors(darkMode: boolean) {
  const stored = localStorage.getItem('myDiaryThemeColors')
  const defaults = darkMode ? darkThemeColors : lightThemeColors
  if (!stored) {
    return defaults
  }

  try {
    return { ...defaults, ...JSON.parse(stored) } as CustomThemeColors
  } catch {
    return defaults
  }
}

function App() {

  const navigate = useNavigate()

  const [dark, setDark] = React.useState(loadStoredDarkMode)
  const [customColors, setCustomColors] = React.useState<CustomThemeColors>(() => loadStoredThemeColors(loadStoredDarkMode()))

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const activeTheme = React.useMemo(
    () => createDiaryTheme(dark ? 'dark' : 'light', customColors),
    [customColors, dark]
  )
  const navColors = customColors.blendWebsite
    ? [customColors.website, customColors.websiteMiddle, customColors.websiteEnd]
    : [customColors.website]
  const navTextColor = getReadableTextColorForColors(navColors)
  const navBackground = customColors.blendWebsite
    ? `linear-gradient(135deg, ${customColors.website} 0%, ${customColors.websiteMiddle} 55%, ${customColors.websiteEnd} 140%)`
    : customColors.website
  const navTextShadow = navTextColor === '#ffffff'
    ? '0 1px 2px rgba(0,0,0,0.45)'
    : '0 1px 2px rgba(255,255,255,0.42)'

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleNavMenu = (page: string) => {
    //alert(page)
    navigate(page)
    setAnchorElNav(null);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (page: string) => {
    setAnchorElUser(null)
    if (page === '/logout') {
      logout()
      return
    }
    navigate(page)
  };

  const handleThemeColor = (key: keyof CustomThemeColors, value: string) => {
    setCustomColors((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const handleDarkMode = (checked: boolean) => {
    setDark(checked)
    setCustomColors(checked ? darkThemeColors : lightThemeColors)
  }

  const handleBlendWebsite = (checked: boolean) => {
    setCustomColors((current) => ({
      ...current,
      blendWebsite: checked,
    }))
  }

  const resetThemeColors = () => {
    setCustomColors(dark ? darkThemeColors : lightThemeColors)
  }

  const logout = async () => {
    if (!isSupabaseConfigured) {
      console.warn(supabaseConfigMessage)
      return
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.log(error)
      }
      // Handle post-logout logic here, e.g., redirecting the user
      console.log('User signed out successfully');
    } catch (error: unknown) {
      console.error('Logout error:', error instanceof Error ? error.message : error);
    }
  }

  function initUser() {
    if (!isSupabaseConfigured) {
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(session)
      user.session = session
      user.email = session?.user?.email ?? null
    }).catch(error => {
      console.log(error)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log(_event)
      console.log(session)
      user.session = session
      user.email = session?.user?.email ?? null
    })
  }

  useEffect(() => {
    initUser()
  }, [])

  useEffect(() => {
    localStorage.setItem('myDiaryDarkMode', String(dark))
  }, [dark])

  useEffect(() => {
    localStorage.setItem('myDiaryThemeColors', JSON.stringify(customColors))
  }, [customColors])

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: navBackground,
          color: navTextColor,
          textShadow: navTextShadow,
          borderBottom: `1px solid ${navTextColor === '#ffffff' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.16)'}`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
            <EditCalendarIcon sx={{ display: { xs: 'none', md: 'flex' }, fontSize: 36, mr: 1.2 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 3,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 900,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              My Diary
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.page} onClick={() => handleNavMenu(page.route)}>
                    <Typography sx={{ textAlign: 'center' }}>{page.page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <EditCalendarIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 900,
                letterSpacing: '.18rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              My Diary
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.page}
                  onClick={() => handleNavMenu(page.route)}
                  sx={{
                    my: 2,
                    mx: 0.25,
                    color: navTextColor,
                    display: 'block',
                    letterSpacing: '.04rem',
                    '&:hover': {
                      backgroundColor: navTextColor === '#ffffff' ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  {page.page}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={() => setAnchorElUser(null)}
              >
                <Typography sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                  {user.email || 'Guest mode'}
                </Typography>
                {(user.email ? settingsUser : settings).map((setting) => (
                  <MenuItem key={setting.page} onClick={() => handleCloseUserMenu(setting.route)}>
                    <Typography sx={{ textAlign: 'center' }}>{setting.page}</Typography>
                  </MenuItem>
                ))}
                <FormControlLabel
                  control={
                    <Switch checked={dark} onChange={() => {
                      handleDarkMode(!dark)
                    }} />
                  }
                  sx={{ ml: 1 }}
                  label="Dark mode"
                  labelPlacement='end'
                />
                <Divider sx={{ my: 1 }} />
                <Box sx={{ px: 2, pb: 1.5, minWidth: 260 }} onClick={(event) => event.stopPropagation()}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Custom theme
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={customColors.blendWebsite}
                        onChange={(event) => handleBlendWebsite(event.target.checked)}
                      />
                    }
                    sx={{ ml: 0, mb: 0.5 }}
                    label="Blended website color"
                  />
                  {(customColors.blendWebsite ? websiteColorLabels : websiteColorLabels.slice(0, 1)).map((item) => (
                    <Box
                      key={item.key}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 44px',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">{item.label}</Typography>
                      <Box
                        component="input"
                        type="color"
                        value={String(customColors[item.key])}
                        aria-label={item.label}
                        onChange={(event) => handleThemeColor(item.key, event.target.value)}
                        sx={{
                          width: 44,
                          height: 32,
                          p: 0,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                        }}
                      />
                    </Box>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  {colorLabels.map((item) => (
                    <Box
                      key={item.key}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 44px',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">{item.label}</Typography>
                      <Box
                        component="input"
                        type="color"
                        value={String(customColors[item.key])}
                        aria-label={item.label}
                        onChange={(event) => handleThemeColor(item.key, event.target.value)}
                        sx={{
                          width: 44,
                          height: 32,
                          p: 0,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                        }}
                      />
                    </Box>
                  ))}
                  <Button size="small" variant="outlined" fullWidth onClick={resetThemeColors}>
                    Reset colors
                  </Button>
                </Box>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {!isSupabaseConfigured && (
        <Alert severity="warning" sx={{ borderRadius: 0 }}>
          {supabaseConfigMessage}
        </Alert>
      )}
      <Box
        component="main"
        sx={{
          width: '100%',
          maxWidth: 1180,
          mx: 'auto',
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='about' element={<About />} />
          <Route path='diarylist' element={<DiaryItems />} />
          <Route path='diaryedit/:id?' element={<DiaryAddEdit />} />
          <Route path='register' element={<Register />} />
          <Route path='map/:loc?' element={<Map />} />
          <Route path='login' element={<Login />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}
export default App;
