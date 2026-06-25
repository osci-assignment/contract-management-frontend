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
  Tabs,
  Tab,
  Chip,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { getUsers, approveUser, rejectUser } from "../../api/users";

const statusTabs = [
  { label: "승인 대기", value: "PENDING" },
  { label: "승인됨", value: "APPROVED" },
  { label: "거절됨", value: "REJECTED" },
];

const statusColor = { PENDING: "warning", APPROVED: "success", REJECTED: "error" };
const roleLabel = { ADMIN: "관리자", WORKER: "일반 유저" };

export default function UserApprovalPage() {
  const [tab, setTab] = useState(0);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);

  const status = statusTabs[tab].value;

  const fetchData = () => {
    getUsers(status, page, size).then((data) => {
      setRows(data.content);
      setTotalElements(data.totalElements);
    });
  };

  useEffect(fetchData, [status, page, size]);

  const handleApprove = async (userId) => {
    setError(null);
    try {
      await approveUser(userId);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (userId) => {
    setError(null);
    try {
      await rejectUser(userId);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        회원 가입 승인 관리
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => { setTab(v); setPage(0); }}
        sx={{ mb: 2 }}
      >
        {statusTabs.map((t) => (
          <Tab key={t.value} label={t.label} />
        ))}
      </Tabs>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>유저 ID</TableCell>
              <TableCell>이메일</TableCell>
              <TableCell>역할</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>가입일</TableCell>
              {status === "PENDING" && <TableCell align="right">작업</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.userId} hover>
                <TableCell>{row.userId}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{roleLabel[row.role] || row.role}</TableCell>
                <TableCell>
                  <Chip size="small" label={row.status} color={statusColor[row.status] || "default"} />
                </TableCell>
                <TableCell>{row.createdAt?.slice(0, 10)}</TableCell>
                {status === "PENDING" && (
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" variant="contained" onClick={() => handleApprove(row.userId)}>
                        승인
                      </Button>
                      <Button size="small" color="error" variant="outlined" onClick={() => handleReject(row.userId)}>
                        거절
                      </Button>
                    </Stack>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={status === "PENDING" ? 6 : 5} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  해당 상태의 유저가 없습니다.
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
