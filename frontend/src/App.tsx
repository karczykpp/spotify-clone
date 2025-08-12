import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import MainLayout from "./layout/MainLayout";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import ChatPage from "./pages/Chat/ChatPage";
import AlbumPage from "./pages/AlbumPage";
import AdminPage from "./pages/Admin/AdminPage";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/NotFoundPage";
function App() {
  return (
    <>
      <Routes>
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpForceRedirectUrl={"/auth-callback"}
            />
          }
        />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
