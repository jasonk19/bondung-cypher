import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Affine from "./pages/Affine";
import Vigenere from "./pages/Vigenere";
import ExtendedVigenere from "./pages/ExtendedVigenere";
import Playfair from "./pages/Playfair";
import Hill from "./pages/Hill";

function App() {
  const router = createBrowserRouter([
    {
      path: "/affine",
      element: <Affine />
    },
    {
      path: "/vigenere",
      element: <Vigenere />
    },
    {
      path: "/extended-vigenere",
      element: <ExtendedVigenere />
    },
    {
      path: "/playfair",
      element: <Playfair />
    },
    {
      path: "/hill",
      element: <Hill />
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
