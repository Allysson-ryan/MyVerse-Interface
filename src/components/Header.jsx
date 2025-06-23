import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { UserCircle } from "phosphor-react";
import { logoutUser } from "../utils/logout";

const pages = [
  { name: "Início", path: "/" },
  { name: "Resenhas", path: "/resenhas" },
  { name: "Adicionar resenha", path: "/adicionar-resenha" },
  { name: "Minha lista", path: "/minha-lista" },
];

function Header() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Poppins",
              fontWeight: 670,

              color: "var(--color-brandprimary)",
              textDecoration: "none",
            }}
          >
            MyVerse
          </Typography>

          {/* Menu Desktop - Visível apenas em md ou superior */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            {pages.map(({ name, path }) => {
              const isActive = currentPath === path;
              return (
                <Link
                  key={name}
                  to={path}
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      color: isActive
                        ? "var(--color-brandprimary)"
                        : "var(--color-brandsoftgray)",
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      fontSize: "16px",

                      cursor: "pointer",
                      "&:hover": {
                        color: "var(--color-brandprimary)",
                      },
                      "&::after": isActive
                        ? {
                            content: '""',
                            position: "absolute",
                            bottom: -4,
                            left: 0,
                            right: 0,
                            height: "2px",
                            backgroundColor: "var(--color-brandprimary)",
                          }
                        : {},
                    }}
                  >
                    {name}
                  </Box>
                </Link>
              );
            })}
          </Box>

          {/* Ícone do usuário com menu suspenso */}
          <Box
            sx={{ position: "relative", display: { xs: "none", md: "flex" } }}
          >
            <IconButton
              onClick={() => setMenuOpen(!menuOpen)}
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
              sx={{
                color: "black",
                position: "relative",
                zIndex: 2,
              }}
            >
              <UserCircle size={32} color="#979292" />
            </IconButton>

            {/* Dropdown do perfil */}
            {menuOpen && (
              <Box
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
                sx={{
                  position: "absolute",
                  top: 45,
                  right: 0,
                  backgroundColor: "#e9e9e9",
                  borderRadius: "6px",
                  padding: 2,
                  minWidth: 190,
                  height: 130,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                  zIndex: 1,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -8,
                    right: 20,
                    width: 0,
                    height: 0,
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderBottom: "8px solid #e9e9e9",
                  },
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => navigate("/configuracao")}
                  sx={{
                    borderRadius: "999px",
                    backgroundColor: "white",
                    color: "black",
                    textTransform: "none",
                    fontSize: "15px",
                    minWidth: "100px",
                    height: "35px",
                    padding: "8px 20px",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  Ver perfil
                </Button>
                <Button
                  onClick={logoutUser}
                  startIcon={
                    <span>
                      <LogoutIcon
                        sx={{
                          color: "#c64141",
                          minWidth: "18px",
                          height: "18px",
                        }}
                      />
                    </span>
                  }
                  sx={{
                    borderRadius: "999px",
                    border: "2px solid #c64141",
                    color: "#c64141",
                    textTransform: "none",
                    fontSize: "15px",
                    minWidth: "100px",
                    height: "35px",
                    padding: "8px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      backgroundColor: "#e89e9e",
                      border: "none",
                    },
                  }}
                >
                  Sair
                </Button>
              </Box>
            )}
          </Box>

          {/* Logo mobile */}
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "Poppins",
              fontWeight: 670,
              color: "var(--color-brandprimary)",
              textDecoration: "none",
            }}
          >
            MyVerse
          </Typography>

          {/* Ícone de menu hamburguer mobile */}
          <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={toggleDrawer(true)}
              sx={{ color: "black" }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Drawer lateral */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            PaperProps={{
              sx: {
                backgroundColor: "var(--color-brandsteel)",
                width: 260,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                paddingTop: 13,
                paddingBottom: 4,
                boxSizing: "border-box",
              },
            }}
          >
            <IconButton
              onClick={toggleDrawer(false)}
              sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
            >
              <CloseIcon />
            </IconButton>

            <List
              sx={{
                width: "100%",
                textAlign: "center",
              }}
            >
              {pages.map(({ name, path }) => {
                const isActive = currentPath === path;

                return (
                  <Link
                    to={path}
                    key={name}
                    onClick={toggleDrawer(false)}
                    style={{
                      textDecoration: "none",
                      width: "100%",
                    }}
                  >
                    <ListItem
                      button
                      sx={{
                        color: isActive ? "#2f3955" : "white",
                        width: "100%",
                        backgroundColor: isActive ? "#92a0c9" : "transparent",
                        fontWeight: isActive ? 700 : 400,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontSize: "1.1rem",
                              textAlign: "center",
                            }}
                          >
                            {name}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Link>
                );
              })}
            </List>

            {/* Botão "Meu perfil" */}
            <Box mt={2}>
              <Button
                variant="contained"
                onClick={() => navigate("/configuracao")}
                startIcon={<AccountCircleIcon />}
                sx={{
                  backgroundColor: "#1e2a4f",
                  borderRadius: "20px",
                  color: "white",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  marginTop: "20px",
                  fontSize: "0.9rem",
                  "&:hover": {
                    backgroundColor: "#364e8a",
                  },
                }}
              >
                Meu perfil
              </Button>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
