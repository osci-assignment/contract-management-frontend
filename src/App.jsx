import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import LoginPage from "./pages/auth/LoginPage";

import ContractUploadPage from "./pages/contracts/ContractUploadPage";
import ContractListPage from "./pages/contracts/ContractListPage";
import ContractDetailPage from "./pages/contracts/ContractDetailPage";

import ProjectListPage from "./pages/projects/ProjectListPage";
import ProjectDetailPage from "./pages/projects/ProjectDetailPage";

import CompanyListPage from "./pages/companies/CompanyListPage";
import CompanyDetailPage from "./pages/companies/CompanyDetailPage";

import WorkerListPage from "./pages/workers/WorkerListPage";
import WorkerDetailPage from "./pages/workers/WorkerDetailPage";
import MyWorkerProfilePage from "./pages/workers/MyWorkerProfilePage";
import MyProjectsPage from "./pages/workers/MyProjectsPage";
import UserApprovalPage from "./pages/users/UserApprovalPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* 로그인만 되어 있으면 접근 가능 (작업자 본인 화면 + 배정된 프로젝트 상세 열람) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/my/profile" element={<MyWorkerProfilePage />} />
          <Route path="/my/projects" element={<MyProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        </Route>
      </Route>

      {/* 관리자 전용 */}
      <Route element={<ProtectedRoute requireAdmin />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/contracts" replace />} />
          <Route path="/contracts/upload" element={<ContractUploadPage />} />
          <Route path="/contracts" element={<ContractListPage />} />
          <Route path="/contracts/:contractId" element={<ContractDetailPage />} />
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/companies" element={<CompanyListPage />} />
          <Route path="/companies/:companyId" element={<CompanyDetailPage />} />
          <Route path="/workers" element={<WorkerListPage />} />
          <Route path="/workers/:workerId" element={<WorkerDetailPage />} />
          <Route path="/users" element={<UserApprovalPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
