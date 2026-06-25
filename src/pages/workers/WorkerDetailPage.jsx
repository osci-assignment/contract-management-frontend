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
  Link as MuiLink,
  CircularProgress,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from "@mui/icons-material";
import { getWorker, getWorkerProjects } from "../../api/workers";
import WorkerEditModal from "./WorkerEditModal";

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

export default function WorkerDetailPage() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const [workerData, projectData] = await Promise.all([
      getWorker(workerId),
      getWorkerProjects(workerId),
    ]);
    setWorker(workerData);
    setProjects(projectData);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workerId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!worker) return <Typography>작업자를 찾을 수 없습니다.</Typography>;

  return (
    <Box maxWidth={800}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/workers")} sx={{ mb: 2 }}>
        목록으로
      </Button>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          {worker.name}
        </Typography>
        <Button startIcon={<EditIcon />} variant="outlined" onClick={() => setEditOpen(true)}>
          수정
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Field label="직책">{worker.position}</Field>
          </Grid>
          <Grid item xs={6}>
            <Field label="부서">{worker.department}</Field>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          배정된 프로젝트 목록
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>프로젝트명</TableCell>
              <TableCell>업체명</TableCell>
              <TableCell>기간</TableCell>
              <TableCell>배정일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.projectId}>
                <TableCell>
                  <MuiLink component={RouterLink} to={`/projects/${p.projectId}`}>
                    {p.projectTitle}
                  </MuiLink>
                </TableCell>
                <TableCell>{p.companyName}</TableCell>
                <TableCell>{p.startDate} ~ {p.endDate}</TableCell>
                <TableCell>{p.assignedAt?.slice(0, 10)}</TableCell>
              </TableRow>
            ))}
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  배정된 프로젝트가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <WorkerEditModal
        open={editOpen}
        worker={worker}
        onClose={() => setEditOpen(false)}
        onUpdated={setWorker}
      />
    </Box>
  );
}
