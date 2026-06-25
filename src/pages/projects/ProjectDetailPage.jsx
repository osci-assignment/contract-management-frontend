import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Autocomplete,
  TextField,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  getProject,
  getProjectWorkers,
  assignWorkerToProject,
  unassignWorkerFromProject,
} from "../../api/projects";
import { getWorkers } from "../../api/workers";
import { useAuthStore } from "../../store/authStore";
import ProjectEditModal from "./ProjectEditModal";

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

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const isAdmin = useAuthStore((s) => s.isAdmin());
  const [project, setProject] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [error, setError] = useState(null);

  // 작업자 검색 (Autocomplete)
  const [workerOptions, setWorkerOptions] = useState([]);
  const [workerSearchLoading, setWorkerSearchLoading] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerInput, setWorkerInput] = useState("");

  const load = async () => {
    setLoading(true);
    const [projectData, workerData] = await Promise.all([
      getProject(projectId),
      getProjectWorkers(projectId),
    ]);
    setProject(projectData);
    setWorkers(workerData);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // 입력 후 300ms 디바운스로 작업자 이름 검색 (타이핑마다 호출하지 않게)
  useEffect(() => {
    const timer = setTimeout(() => {
      setWorkerSearchLoading(true);
      getWorkers(0, 10, workerInput)
        .then((data) => setWorkerOptions(data.content))
        .finally(() => setWorkerSearchLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [workerInput]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedWorker) return;
    setError(null);
    try {
      await assignWorkerToProject(projectId, selectedWorker.workerId);
      setSelectedWorker(null);
      setWorkerInput("");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnassign = async (workerId) => {
    await unassignWorkerFromProject(projectId, workerId);
    load();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project) return <Typography>프로젝트를 찾을 수 없습니다.</Typography>;

  return (
    <Box maxWidth={800}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/projects")} sx={{ mb: 2 }}>
        목록으로
      </Button>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          {project.title}
        </Typography>
        {isAdmin && (
          <Button startIcon={<EditIcon />} variant="outlined" onClick={() => setEditOpen(true)}>
            수정
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          업체 정보
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Field label="업체명">{project.companyName}</Field>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Field label="시작일">{project.startDate}</Field>
          </Grid>
          <Grid item xs={6}>
            <Field label="종료일">{project.endDate}</Field>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          배정된 작업자
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {isAdmin && (
          <Box component="form" onSubmit={handleAssign} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1}>
              <Autocomplete
                size="small"
                sx={{ width: 320 }}
                options={workerOptions}
                loading={workerSearchLoading}
                value={selectedWorker}
                onChange={(_, value) => setSelectedWorker(value)}
                inputValue={workerInput}
                onInputChange={(_, value) => setWorkerInput(value)}
                getOptionLabel={(option) =>
                  `${option.name} (${option.position} · ${option.department})`
                }
                isOptionEqualToValue={(option, value) => option.workerId === value.workerId}
                noOptionsText="검색 결과가 없습니다"
                renderInput={(params) => (
                  <TextField {...params} label="이름으로 작업자 검색" placeholder="예: 홍길동" />
                )}
              />
              <Button type="submit" variant="contained" disabled={!selectedWorker}>
                배정
              </Button>
            </Stack>
          </Box>
        )}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>직책</TableCell>
              <TableCell>부서</TableCell>
              {isAdmin && <TableCell align="right">작업</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {workers.map((w) => (
              <TableRow key={w.workerId}>
                <TableCell>{w.name}</TableCell>
                <TableCell>{w.position}</TableCell>
                <TableCell>{w.department}</TableCell>
                {isAdmin && (
                  <TableCell align="right">
                    <Button size="small" color="error" onClick={() => handleUnassign(w.workerId)}>
                      배정 해제
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {workers.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 4 : 3} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  배정된 작업자가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {isAdmin && (
        <ProjectEditModal
          open={editOpen}
          project={project}
          onClose={() => setEditOpen(false)}
          onUpdated={setProject}
        />
      )}
    </Box>
  );
}
