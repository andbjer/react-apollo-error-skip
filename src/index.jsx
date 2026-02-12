/*** APP ***/
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Defer20220824Handler } from "@apollo/client/incremental";
import { LocalState } from "@apollo/client/local-state";
import { ApolloProvider, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./index.css";
import { link } from "./link.js";

const GET_COUNTRY = gql`
  query GetCountry($name: String!) {
    countries(filter: { name: { eq: $name } }) {
      code
      name
      capital
      currency
      emoji
    }
  }
`;

function App() {
  const [name, setName] = useState("");
  const { loading, data } = useQuery(GET_COUNTRY, {
    skip: !name,
    variables: { name },
    pollInterval: 60 * 1000, // 1 minute
  });

  return (
    <main>
      <h3>Home</h3>
      <div>
        <button
          onClick={() => {
            setName("Norway");
          }}
        >
          Get info about Norway
        </button>
      </div>
      <h2>Country</h2>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {data?.countries.map((country) => (
            <li key={country.code}>
              <dl>
                <dt>Code</dt>
                <dd>{country.code}</dd>
                <dt>Name</dt>
                <dd>{country.name}</dd>
                <dt>Capital</dt>
                <dd>{country.capital}</dd>
                <dt>Currency</dt>
                <dd>{country.currency}</dd>
                <dt>Emoji</dt>
                <dd>{country.emoji}</dd>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    },
    query: {
      fetchPolicy: "network-only",
    },
  },
  localState: new LocalState({}),
  incrementalHandler: new Defer20220824Handler(),
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ApolloProvider client={client}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  </ApolloProvider>,
);
