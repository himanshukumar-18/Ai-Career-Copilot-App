import { useEffect } from "react";
import { useDispatch } from "react-redux";

import AppRoutes from "./routes/AppRoutes";

import { getMeThunk } from "./features/auth/authThunk";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {

    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (token) {

      dispatch(
        getMeThunk(token)
      );

    }

  }, [dispatch]);

  return <AppRoutes />;
}

export default App;