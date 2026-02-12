import { HttpLink } from "@apollo/client";

export const link = new HttpLink({
  url: "/graphql",
});
