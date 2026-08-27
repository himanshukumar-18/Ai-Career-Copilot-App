import { useEffect } from "react";
import { useDispatch } from "react-redux";

import AppRoutes from "./routes/AppRoutes";

import { getMeThunk } from "./features/auth/authThunk";

import ErrorBoundary from "./components/ui/ErrorBoundary";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {

    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (token) {

      dispatch(
        getMeThunk()
      );
    }

  }, [dispatch]);

  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;
