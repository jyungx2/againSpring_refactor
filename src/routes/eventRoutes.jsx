import EventMainPage from "@pages/eventPage/EventMainPage";
import EventDetailPage from "@pages/eventPage/EventDetailPage";

const eventRoutes = [
  { path: "event", element: <EventMainPage /> },
  { path: "event/detail/:id", element: <EventDetailPage /> },
];

export default eventRoutes;
