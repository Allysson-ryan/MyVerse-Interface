import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout/MainLayout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Cadastrar from "./Pages/cadastrar";
import AddReview from "./Pages/AddReview";
import MyList from "./Pages/MyList";
import ProfileSettings from "./Pages/ProfileSettings";
import ResenhasPage from "./Pages/Resenhas";
import ReviewDetails from "./Pages/ReviewDetails";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./Pages/Dashboard";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/entrar" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cadastrar" element={<Cadastrar />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/resenhas" element={<ResenhasPage />} />
            <Route path="/adicionar-resenha" element={<AddReview />} />
            <Route path="/minha-lista" element={<MyList />} />
            <Route path="/configuracao" element={<ProfileSettings />} />
          </Route>
          <Route path="/detalhes" element={<ReviewDetails />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
