import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Affine from "./pages/Affine";
import Vigenere from "./pages/Vigenere";
import ExtendedVigenere from "./pages/ExtendedVigenere";
import Playfair from "./pages/Playfair";
import Hill from "./pages/Hill";
import SuperEncryption from "./pages/SuperEncryption";

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
    },
    {
      path: "/super-encryption",
      element: <SuperEncryption />
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
