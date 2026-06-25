import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { getMyProjects } from "../../api/workers";

export default function MyProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        내 프로젝트
      </Typography>
      <Paper>
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
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  아직 배정된 프로젝트가 없습니다. 관리자의 배정을 기다려주세요.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
