import { useEffect, useRef, useState } from "react";
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
  Chip,
  Link as MuiLink,
  IconButton,
  Tooltip,
  Stack,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { Refresh as RefreshIcon, ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { getContracts } from "../../api/contracts";

const statusColor = {
  PENDING: "default",
  COMPLETED: "success",
  FAILED: "error",
};

const POLLING_INTERVAL_SECONDS = 5;

const statusTabs = [
  { label: "전체", value: "" },
  { label: "성공", value: "COMPLETED" },
  { label: "처리중", value: "PROCESSING" },
  { label: "대기", value: "PENDING" },
  { label: "실패", value: "FAILED" },
];

function StatusBadge({ status, failureReason }) {
  if (status === "PROCESSING") {
    return (
      <Stack direction="row" spacing={0.7} alignItems="center">
        <CircularProgress size={14} thickness={6} />
        <Typography variant="body2" color="info.main">처리중</Typography>
      </Stack>
    );
  }

  return (
    <Tooltip title={status === "FAILED" ? (failureReason || "실패 사유 없음") : ""}>
      <Chip size="small" label={status} color={statusColor[status] || "default"} />
    </Tooltip>
  );
}

export default function ContractListPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(POLLING_INTERVAL_SECONDS);
  const [statusTab, setStatusTab] = useState(0);

  const pageRef = useRef(page);
  const sizeRef = useRef(size);
  const statusRef = useRef(statusTabs[statusTab].value);
  pageRef.current = page;
  sizeRef.current = size;
  statusRef.current = statusTabs[statusTab].value;

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getContracts(pageRef.current, sizeRef.current, statusRef.current);
      setRows(data.content);
      setTotalElements(data.totalElements);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setSecondsLeft(POLLING_INTERVAL_SECONDS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, statusTab]);

  useEffect(() => {
    const pollTimer = setInterval(() => {
      fetchData();
      setSecondsLeft(POLLING_INTERVAL_SECONDS);
    }, POLLING_INTERVAL_SECONDS * 1000);

    const countdownTimer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? POLLING_INTERVAL_SECONDS : prev - 1));
    }, 1000);

    return () => {
      clearInterval(pollTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  const handleManualRefresh = () => {
    fetchData();
    setSecondsLeft(POLLING_INTERVAL_SECONDS);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h5" fontWeight={700}>
          계약서 목록
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {secondsLeft}초 후 자동 새로고침
          </Typography>
          <Tooltip title="새로고침">
            <IconButton onClick={handleManualRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Tabs
        value={statusTab}
        onChange={(_, v) => { setStatusTab(v); setPage(0); }}
        sx={{ mb: 2 }}
      >
        {statusTabs.map((t) => (
          <Tab key={t.value} label={t.label} />
        ))}
      </Tabs>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>계약서 ID</TableCell>
              <TableCell>파일명</TableCell>
              <TableCell>업체</TableCell>
              <TableCell>프로젝트</TableCell>
              <TableCell>OCR 상태</TableCell>
              <TableCell width={32} />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.contractId}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/contracts/${row.contractId}`)}
              >
                <TableCell>{row.contractId}</TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: 600 }}>{row.fileName || "-"}</TableCell>
                <TableCell>
                  {row.company ? (
                    <MuiLink
                      component={RouterLink}
                      to={`/companies/${row.company.companyId}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {row.company.name}
                    </MuiLink>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {row.project ? (
                    <MuiLink
                      component={RouterLink}
                      to={`/projects/${row.project.projectId}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {row.project.title}
                    </MuiLink>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={row.ocrStatus} failureReason={row.failureReason} />
                </TableCell>
                <TableCell>
                  <ChevronRightIcon fontSize="small" sx={{ color: "text.disabled" }} />
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  등록된 계약서가 없습니다.
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
