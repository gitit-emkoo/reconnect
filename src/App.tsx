import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboading";
import Diagnosis from "./pages/Diagnosis";
import DiagnosisResult from "./pages/DiagnosisResult";
import MainSolo from "./pages/MainSolo";
import Invite from "./pages/Invite";
import MainShared from "./pages/MainShared";
import EmotionCard from "./pages/EmotionCard";
import EmotionDiary from "./pages/EmotionDiary";
import Challenge from "./pages/Challenge";
import Report from "./pages/Report";
import ContentCenter from "./pages/ContentCenter";
import GlobalStyle from "./styles/GlobalStyle";


const App = () => {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/diagnosis/result" element={<DiagnosisResult />} />
          <Route path="/main/solo" element={<MainSolo />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/main/shared" element={<MainShared />} />
          <Route path="/emotion-card" element={<EmotionCard />} />
          <Route path="/emotion-diary" element={<EmotionDiary />} />
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/report" element={<Report />} />
          <Route path="/content-center" element={<ContentCenter />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
