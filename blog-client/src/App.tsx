import "./App.css";
import { Helmet } from "react-helmet";
import { Navbar } from "./layouts/Navbar";
import { Content } from "./layouts/Content";

function App() {
  return (
    <div className="app-wrapper">
      <Helmet>
        <title>React Chat App</title>
        <meta name="description" content="React Chat App Description" />
      </Helmet>
      <Navbar />
      <Content />
    </div>
  );
}

export default App;
