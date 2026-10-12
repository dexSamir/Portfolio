import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { MouseTracker } from "./components/mouse-tracker";
import { Navigation } from "./components/navigation";
import { PageMeta } from "./components/page-meta";
import { ErrorBoundary } from "./components/error-boundary";
import HomePage from "./pages/home";
import { AdminGuard } from "./components/admin-guard";
const ProjectsPage = lazy(() => import("./pages/projects"));
const ResumePage = lazy(() => import("./pages/resume"));
const ContactPage = lazy(() => import("./pages/contact"));
const TestimonialsPage = lazy(() => import("./pages/testimonials"));
const LoginPage = lazy(() => import("./pages/login"));
const AdminDashboard = lazy(() => import("./pages/admin"));
const AdminCreatePage = lazy(() => import("./pages/admin/create"));
const NotFoundPage = lazy(() => import("./pages/not-found"));
const ForbiddenPage = lazy(() => import("./pages/forbidden"));

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoginRoute = location.pathname === "/login";
  const isErrorPage =
    location.pathname === "/404" || location.pathname === "/403";


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <>
      <PageMeta />
      <a href="#main-content" className="skip-link">Skip to content</a>
      {!isAdminRoute && !isLoginRoute && !isErrorPage && <MouseTracker />}
      {!isAdminRoute && !isLoginRoute && !isErrorPage && <Navigation />}
      <main id="main-content" tabIndex={-1}
        className={`relative ${!isAdminRoute && !isLoginRoute && !isErrorPage ? "z-10" : ""}`}
      >
        <ErrorBoundary key={location.pathname}><Suspense fallback={<div className="min-h-screen pt-24 text-center" role="status">Loading…</div>}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="/admin/create" element={<AdminGuard><AdminCreatePage /></AdminGuard>} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
        </Suspense></ErrorBoundary>
      </main>
    </>
  );
}

export default App;
