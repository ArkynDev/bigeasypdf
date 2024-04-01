import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import { MergePDF } from "../pages/MergePDF";

export const router = createBrowserRouter ([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "MergePDF", element: <MergePDF /> }
        ],
    }
])