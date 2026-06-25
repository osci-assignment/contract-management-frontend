import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import {
  createMyWorkerProfile,
  updateMyWorkerProfile,
  getWorker,
} from "../../api/workers";

/**
 * 승인된 일반 유저가 본인 작업자 프로필(이름/직책/부서)을 등록/수정한다.
 * 백엔드에 "내 프로필 단건 조회" API가 따로 없어서, 미등록 상태를 빈 폼으로 보여주고
 * 등록 시도 -> 이미 있으면 에러 메시지로 안내 -> 수정 모드로 전환하는 방식으로 처리한다.
 */
export default function MyWorkerProfilePage() {
  const [form, setForm] = useState({ name: "", position: "", department: "" });
  const [mode, setMode] = useState("create"); // "create" | "update"
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "create") {
        await createMyWorkerProfile(form);
        setMessage("작업자 프로필이 등록되었습니다.");
        setMode("update");
      } else {
        await updateMyWorkerProfile(form);
        setMessage("작업자 프로필이 수정되었습니다.");
      }
    } catch (err) {
      if (mode === "create" && err.code === "OSCI3002") {
        // 이미 등록된 경우 안내만 하고, 직접 다시 정보를 입력해 수정하도록 유도
        setMode("update");
        setError("이미 작업자로 등록되어 있습니다. 정보를 입력 후 '수정'을 눌러주세요.");
      } else {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box maxWidth={480}>
      <Typography variant="h5" fontWeight={700} mb={1}>
        내 작업자 프로필
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        이름/직책/부서를 입력하면, 관리자가 프로젝트에 배정할 수 있습니다.
      </Typography>

      <Paper sx={{ p: 3 }} component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="warning">{error}</Alert>}
          <TextField
            label="이름"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="직책"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="부서"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={saving}>
            {mode === "create" ? "등록" : "수정"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
