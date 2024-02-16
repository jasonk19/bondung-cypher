import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Playfair from "./pages/Playfair";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <></>
    },
    {
      path: "/playfair",
      element: <Playfair />
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
