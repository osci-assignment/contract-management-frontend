import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Business as BusinessIcon,
  Folder as FolderIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  UploadFile as UploadFileIcon,
  AccountCircle as AccountCircleIcon,
  HowToReg as HowToRegIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const drawerWidth = 240;

const adminMenu = [
  { label: "회원 승인 관리", path: "/users", icon: <HowToRegIcon /> },
  { label: "계약서 등록", path: "/contracts/upload", icon: <UploadFileIcon /> },
  { label: "계약서 목록", path: "/contracts", icon: <DescriptionIcon /> },
  { label: "프로젝트 목록", path: "/projects", icon: <FolderIcon /> },
  { label: "업체 목록", path: "/companies", icon: <BusinessIcon /> },
  { label: "작업자 목록", path: "/workers", icon: <GroupIcon /> },
];

const workerMenu = [
  { label: "내 프로필", path: "/my/profile", icon: <AccountCircleIcon /> },
  { label: "내 프로젝트", path: "/my/projects", icon: <FolderIcon /> },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, email, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState(null);

  const menu = role === "ADMIN" ? adminMenu : workerMenu;

  // pathname과 일치하는 메뉴가 여러 개일 수 있어("/contracts"와 "/contracts/upload" 둘 다
  // "/contracts/upload"에 매칭됨), 그중 가장 구체적인(긴) 경로 하나만 active로 선택한다.
  const activeMenuPath = menu
    .filter((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0]?.path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: "white",
          color: "text.primary",
          boxShadow: "0 1px 0 rgba(0,0,0,0.08)",
        }}
        elevation={0}
      >
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
              {(email || role || "?").charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled>{email}</MenuItem>
            <MenuItem disabled>{role === "ADMIN" ? "관리자" : "작업자"}</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              로그아웃
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar sx={{ px: 2 }}>
          <Typography variant="h6" fontWeight={700} color="primary.main" noWrap>
            계약 관리 백오피스
          </Typography>
        </Toolbar>
        <Divider />
        <List sx={{ px: 1, pt: 1 }}>
          {menu.map((item) => {
            const selected = item.path === activeMenuPath;
            return (
              <ListItemButton
                key={item.path}
                selected={selected}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                    "& .MuiListItemIcon-root": { color: "white" },
                    "&:hover": { bgcolor: "primary.dark" },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
