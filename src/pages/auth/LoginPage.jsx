import { useState } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login, registerUser, registerAdmin } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";

/**
 * 시연용 페이지: 로그인 + 사용자 회원가입 + 관리자 회원가입을 탭으로 한 화면에 모아둔다.
 */
export default function LoginPage() {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const authLogin = useAuthStore((s) => s.login);

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login(form);
      authLogin({ ...data, email: form.email });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (apiFn, successMsg) => async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      await apiFn(form);
      setMessage(successMsg);
      setTab(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper sx={{ p: 4, width: 420 }} elevation={3}>
        <Typography variant="h5" fontWeight={700} mb={1} color="primary.main">
          계약 관리 백오피스
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          시연용 화면입니다. 로그인 / 회원가입을 한 화면에서 전환할 수 있습니다.
        </Typography>

        <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(null); setMessage(null); }} sx={{ mb: 2 }}>
          <Tab label="로그인" />
          <Tab label="사용자 가입" />
          <Tab label="관리자 가입" />
        </Tabs>

        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {tab === 0 && (
          <Box component="form" onSubmit={handleLogin}>
            <Stack spacing={2}>
              <TextField label="이메일" name="email" value={form.email} onChange={handleChange} fullWidth required />
              <TextField label="비밀번호" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required />
              <Button type="submit" variant="contained" size="large" disabled={loading}>
                로그인
              </Button>
            </Stack>
          </Box>
        )}

        {tab === 1 && (
          <Box component="form" onSubmit={handleRegister(registerUser, "가입 신청 완료! 관리자 승인 후 로그인할 수 있습니다.")}>
            <Stack spacing={2}>
              <TextField label="이메일" name="email" value={form.email} onChange={handleChange} fullWidth required />
              <TextField label="비밀번호 (8~20자)" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required />
              <Button type="submit" variant="contained" size="large" disabled={loading}>
                사용자로 가입
              </Button>
            </Stack>
          </Box>
        )}

        {tab === 2 && (
          <Box component="form" onSubmit={handleRegister(registerAdmin, "관리자 가입 완료! 바로 로그인할 수 있습니다.")}>
            <Stack spacing={2}>
              <TextField label="이메일" name="email" value={form.email} onChange={handleChange} fullWidth required />
              <TextField label="비밀번호 (8~20자)" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required />
              <Button type="submit" variant="contained" size="large" disabled={loading}>
                관리자로 가입
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
