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
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getCompanies, deleteCompany } from "../../api/companies";
import CompanyEditModal from "./CompanyEditModal";

const contractTypeLabel = { ELECTRONIC: "전자계약", PAPER: "수기계약" };

export default function CompanyListPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [editTarget, setEditTarget] = useState(null);

  const fetchData = () => {
    getCompanies(page, size).then((data) => {
      setRows(data.content);
      setTotalElements(data.totalElements);
    });
  };

  useEffect(fetchData, [page, size]);

  const handleDelete = async (e, companyId) => {
    e.stopPropagation();
    if (!window.confirm("이 업체를 삭제하시겠습니까?")) return;
    await deleteCompany(companyId);
    fetchData();
  };

  const handleEdit = (e, row) => {
    e.stopPropagation();
    setEditTarget(row);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={1}>
        업체 목록
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        업체명을 클릭하면 해당 업체의 프로젝트 목록을 볼 수 있습니다.
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>업체명</TableCell>
              <TableCell>계약 형태</TableCell>
              <TableCell>등록일</TableCell>
              <TableCell align="right">작업</TableCell>
              <TableCell width={32} />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/companies/${row.id}`)}
              >
                <TableCell sx={{ color: "primary.main", fontWeight: 600 }}>{row.name}</TableCell>
                <TableCell>
                  <Chip size="small" label={contractTypeLabel[row.contractType] || row.contractType} />
                </TableCell>
                <TableCell>{row.createdAt?.slice(0, 10)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="수정">
                    <IconButton size="small" onClick={(e) => handleEdit(e, row)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="삭제">
                    <IconButton size="small" color="error" onClick={(e) => handleDelete(e, row.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <ChevronRightIcon fontSize="small" sx={{ color: "text.disabled" }} />
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  등록된 업체가 없습니다.
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

      <CompanyEditModal
        open={Boolean(editTarget)}
        company={editTarget}
        onClose={() => setEditTarget(null)}
        onUpdated={fetchData}
      />
    </Box>
  );
}
