import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import Result from "./pages/Result";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
