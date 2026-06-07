import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Onboarding from "./components/Onboarding";
import { api } from "./api";

import DashboardPage from "./pages/Gym/DashboardPage";
import WorkoutPage from "./pages/Gym/WorkoutPage";
import StatisticsPage from "./pages/Gym/StatisticsPage";
import ExercisesPage from "./pages/Gym/ExercisesPage";
import ProfilePage from "./pages/Gym/ProfilePage";
import GoalsPage from "./pages/Gym/GoalsPage";
import ProgressPage from "./pages/Gym/ProgressPage";
import PersonalRecordsPage from "./pages/Gym/PersonalRecordsPage";
import RemindersPage from "./pages/Gym/RemindersPage";
import WorkoutPlanPage from "./pages/Gym/WorkoutPlanPage";

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(null)

  useEffect(() => {
    api.getProfile().then(p => {
      setOnboardingDone(!!p?.onboarding_completed)
    }).catch(() => setOnboardingDone(true))
  }, [])

  if (onboardingDone === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    )
  }

  return (
    <>
      {!onboardingDone && <Onboarding onComplete={() => setOnboardingDone(true)} />}
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<DashboardPage />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/history" element={<Navigate to="/workout" replace />} />
            <Route path="/stats" element={<StatisticsPage />} />
            <Route path="/exercises" element={<ExercisesPage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/personal-records" element={<PersonalRecordsPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/workout-plan" element={<WorkoutPlanPage />} />

            {/* TailAdmin Pages */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
