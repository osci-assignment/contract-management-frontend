import { useEffect, useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Edit as EditIcon, ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import { getCompany } from "../../api/companies";
import CompanyEditModal from "./CompanyEditModal";

const contractTypeLabel = { ELECTRONIC: "전자계약", PAPER: "수기계약" };

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

export default function CompanyDetailPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const load = () => {
    setLoading(true);
    getCompany(companyId).then(setCompany).finally(() => setLoading(false));
  };

  useEffect(load, [companyId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!company) return <Typography>업체를 찾을 수 없습니다.</Typography>;

  return (
    <Box maxWidth={800}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/companies")} sx={{ mb: 2 }}>
        목록으로
      </Button>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          {company.name}
        </Typography>
        <Button startIcon={<EditIcon />} variant="outlined" onClick={() => setEditOpen(true)}>
          수정
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Field label="계약 형태">
              <Chip size="small" label={contractTypeLabel[company.contractType] || company.contractType} />
            </Field>
          </Grid>
          <Grid item xs={6}>
            <Field label="등록일">{company.createdAt?.slice(0, 10)}</Field>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          이 업체의 프로젝트 목록
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>프로젝트명</TableCell>
              <TableCell>시작일</TableCell>
              <TableCell>종료일</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {company.projects?.map((p) => (
              <TableRow
                key={p.projectId}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/projects/${p.projectId}`)}
              >
                <TableCell sx={{ color: "primary.main", fontWeight: 600 }}>{p.title}</TableCell>
                <TableCell>{p.startDate}</TableCell>
                <TableCell>{p.endDate}</TableCell>
                <TableCell align="right">
                  <ChevronRightIcon fontSize="small" sx={{ color: "text.disabled" }} />
                </TableCell>
              </TableRow>
            ))}
            {(!company.projects || company.projects.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  등록된 프로젝트가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <CompanyEditModal
        open={editOpen}
        company={company}
        onClose={() => setEditOpen(false)}
        onUpdated={setCompany}
      />
    </Box>
  );
}
