
import Home from "./pages/Home";
import ArticlePage from "./pages/ArticlePage";

function App() {
  const pathname = window.location.pathname;

  if (pathname.startsWith("/news/")) {
    return <ArticlePage />;
  }

  return <Home />;
}

export default App;
