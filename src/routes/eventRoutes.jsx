import EventMainPage from "@pages/eventPage/EventMainPage";
import EventDetailPage from "@pages/eventPage/EventDetailPage";
import MaintenancePage from "@pages/MaintenancePage";
import { maintenanceLoader } from "../utils/maintenanceLoader";

const eventRoutes = [
  {
    path: "event",
    element: <EventMainPage />,
    loader: maintenanceLoader,
    errorElement: <MaintenancePage />
  },
  {
    path: "event/detail/:id",
    element: <EventDetailPage />,
    loader: maintenanceLoader,
    errorElement: <MaintenancePage />
  },
];


export default eventRoutes;
