import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { UploadFile as UploadFileIcon, Close as CloseIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { uploadContracts } from "../../api/contracts";

export default function ContractUploadPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFilesSelected = (e) => {
    const selected = Array.from(e.target.files || []);
    // 같은 파일을 여러 번 선택해도 누적되지 않게, 이름+크기 기준으로 중복 제거
    setFiles((prev) => {
      const merged = [...prev, ...selected];
      const seen = new Set();
      return merged.filter((f) => {
        const key = `${f.name}_${f.size}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    });
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      await uploadContracts(files);
      navigate("/contracts");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box maxWidth={560}>
      <Typography variant="h5" fontWeight={700} mb={1}>
        계약서 등록
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        PDF 또는 사진(수기 계약서) 파일을 여러 개 한 번에 업로드할 수 있습니다. 파일마다
        OCR/LLM으로 업체명과 계약 기간을 자동 추출해 업체·프로젝트를 생성합니다. 처리는
        비동기로 진행되며 잠시 후 계약서 목록에서 상태를 확인할 수 있습니다.
      </Typography>

      <Paper sx={{ p: 4 }} component="form" onSubmit={handleSubmit}>
        <Stack spacing={2} alignItems="flex-start">
          <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
            파일 선택 (여러 개 가능)
            <input
              type="file"
              hidden
              multiple
              accept=".pdf,image/*"
              onChange={handleFilesSelected}
            />
          </Button>

          {files.length > 0 && (
            <List dense sx={{ width: "100%" }}>
              {files.map((file, index) => (
                <ListItem
                  key={`${file.name}_${file.size}`}
                  secondaryAction={
                    <IconButton edge="end" size="small" onClick={() => handleRemove(index)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{ bgcolor: "background.default", borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024).toFixed(0)} KB`}
                  />
                </ListItem>
              ))}
            </List>
          )}

          {uploading && <LinearProgress sx={{ width: "100%" }} />}

          {error && <Alert severity="error" sx={{ width: "100%" }}>{error}</Alert>}

          <Button type="submit" variant="contained" disabled={files.length === 0 || uploading}>
            {files.length > 0 ? `${files.length}개 파일 업로드` : "업로드"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
