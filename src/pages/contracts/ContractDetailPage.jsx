import { useEffect, useState } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Link as MuiLink,
  CircularProgress,
  Stack,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Download as DownloadIcon } from "@mui/icons-material";
import { getContract, downloadContractFile } from "../../api/contracts";

const statusColor = {
  PENDING: "default",
  COMPLETED: "success",
  FAILED: "error",
};

function Field({ label, children }) {
  return (
    <Box mb={2}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{children ?? "-"}</Typography>
    </Box>
  );
}

function StatusBadge({ status }) {
  if (status === "PROCESSING") {
    return (
      <Stack direction="row" spacing={0.7} alignItems="center">
        <CircularProgress size={16} thickness={6} />
        <Typography variant="body2" color="info.main">처리중</Typography>
      </Stack>
    );
  }
  return <Chip size="small" label={status} color={statusColor[status] || "default"} />;
}

export default function ContractDetailPage() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getContract(contractId)
      .then(setContract)
      .finally(() => setLoading(false));
  }, [contractId]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await downloadContractFile(contractId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = contract.fileName || `contract_${contractId}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!contract) {
    return <Typography>계약서를 찾을 수 없습니다.</Typography>;
  }

  return (
    <Box maxWidth={800}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/contracts")} sx={{ mb: 2 }}>
        목록으로
      </Button>
      <Typography variant="h5" fontWeight={700} mb={3}>
        계약서 상세 (ID: {contract.contractId})
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          계약서 정보
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Field label="파일명">
              <Button
                size="small"
                variant="text"
                startIcon={<DownloadIcon fontSize="small" />}
                onClick={handleDownload}
                disabled={downloading}
                sx={{ p: 0, textTransform: "none" }}
              >
                {contract.fileName || "-"}
              </Button>
            </Field>
          </Grid>
          <Grid item xs={6}>
            <Field label="OCR 처리 상태">
              <StatusBadge status={contract.ocrStatus} />
            </Field>
          </Grid>
          {contract.ocrStatus === "FAILED" && (
            <Grid item xs={12}>
              <Field label="실패 사유">
                <Typography color="error.main">{contract.failureReason || "사유가 기록되지 않았습니다."}</Typography>
              </Field>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          업체 정보
        </Typography>
        {contract.company ? (
          <Field label="업체명">
            <MuiLink component={RouterLink} to={`/companies/${contract.company.companyId}`}>
              {contract.company.name}
            </MuiLink>
          </Field>
        ) : (
          <Typography color="text.secondary">아직 추출/매칭되지 않았습니다.</Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          프로젝트 정보
        </Typography>
        {contract.project ? (
          <Field label="프로젝트명">
            <MuiLink component={RouterLink} to={`/projects/${contract.project.projectId}`}>
              {contract.project.title}
            </MuiLink>
          </Field>
        ) : (
          <Typography color="text.secondary">아직 추출/매칭되지 않았습니다.</Typography>
        )}
      </Paper>
    </Box>
  );
}
