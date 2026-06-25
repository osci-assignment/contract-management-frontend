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
  TablePagination,
} from "@mui/material";
import { ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../../api/projects";

export default function ProjectListPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    getProjects(page, size).then((data) => {
      setRows(data.content);
      setTotalElements(data.totalElements);
    });
  }, [page, size]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        프로젝트 목록
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>프로젝트명</TableCell>
              <TableCell>업체명</TableCell>
              <TableCell>시작일</TableCell>
              <TableCell>종료일</TableCell>
              <TableCell width={32} />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.projectId}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/projects/${row.projectId}`)}
              >
                <TableCell sx={{ color: "primary.main", fontWeight: 600 }}>{row.title}</TableCell>
                <TableCell>{row.companyName}</TableCell>
                <TableCell>{row.startDate}</TableCell>
                <TableCell>{row.endDate}</TableCell>
                <TableCell>
                  <ChevronRightIcon fontSize="small" sx={{ color: "text.disabled" }} />
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  등록된 프로젝트가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={size}
          onRowsPerPageChange={(e) => { setSize(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Paper>
    </Box>
  );
}
