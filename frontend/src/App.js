import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "@/pages/Landing";

function App() {
  return (
    <div className="App min-h-screen bg-[#2B2B35] text-[#FAFAFA]" data-testid="app-root">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#33333E",
            border: "1px solid #4A4A55",
            color: "#FAFAFA",
            borderRadius: 2,
          },
        }}
      />
    </div>
  );
}

export default App;
