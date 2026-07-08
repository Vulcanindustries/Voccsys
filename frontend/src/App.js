import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "@/pages/Landing";

function App() {
  return (
    <div className="App min-h-screen bg-[#09090B] text-[#FAFAFA]" data-testid="app-root">
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
            background: "#121214",
            border: "1px solid #27272A",
            color: "#FAFAFA",
            borderRadius: 2,
          },
        }}
      />
    </div>
  );
}

export default App;
