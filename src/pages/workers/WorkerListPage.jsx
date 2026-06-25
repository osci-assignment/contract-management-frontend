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
  TextField,
  InputAdornment,
} from "@mui/material";
import { ChevronRight as ChevronRightIcon, Search as SearchIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getWorkers } from "../../api/workers";

export default function WorkerListPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    getWorkers(page, size, keyword).then((data) => {
      setRows(data.content);
      setTotalElements(data.totalElements);
    });
  }, [page, size, keyword]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        작업자 목록
      </Typography>

      <TextField
        placeholder="이름으로 검색"
        size="small"
        value={keyword}
        onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
        sx={{ mb: 2, width: 280 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>작업자 ID</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>직책</TableCell>
              <TableCell>부서</TableCell>
              <TableCell width={32} />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.workerId}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/workers/${row.workerId}`)}
              >
                <TableCell>{row.workerId}</TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: 600 }}>{row.name}</TableCell>
                <TableCell>{row.position}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>
                  <ChevronRightIcon fontSize="small" sx={{ color: "text.disabled" }} />
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  {keyword ? "검색 결과가 없습니다." : "등록된 작업자가 없습니다."}
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
