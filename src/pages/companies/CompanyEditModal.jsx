import { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  MenuItem,
} from "@mui/material";
import { updateCompany } from "../../api/companies";

export default function CompanyEditModal({ open, company, onClose, onUpdated }) {
  const [form, setForm] = useState({ name: "", contractType: "ELECTRONIC" });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company) {
      setForm({ name: company.name || "", contractType: company.contractType || "ELECTRONIC" });
      setError(null);
    }
  }, [company]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await updateCompany(company.id, form);
      onUpdated(updated);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>업체 정보 수정</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="업체명"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              select
              label="계약 형태"
              value={form.contractType}
              onChange={(e) => setForm({ ...form, contractType: e.target.value })}
              fullWidth
            >
              <MenuItem value="ELECTRONIC">전자계약</MenuItem>
              <MenuItem value="PAPER">수기계약</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>취소</Button>
          <Button type="submit" variant="contained" disabled={saving}>
            저장
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
