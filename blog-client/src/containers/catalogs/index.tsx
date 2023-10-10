import { Helmet } from "react-helmet";
const Catalog = () => {
  return (
    <>
      <Helmet>
        <title>Chat App</title>
        <meta name="description" content="Chat App Description" />
      </Helmet>
      <div className="card h-full flex p-8">
        <h1>Catalog working</h1>
      </div>
    </>
  );
};

export default Catalog;
