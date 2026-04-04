export { endpoints } from "./endpoints";

export * as authClient from "./clients/auth";
export * as categoriesClient from "./clients/categories";
export * as interestsClient from "./clients/interests";
export * as digestClient from "./clients/digest";
export * as newsClient from "./clients/news";
export * as usersClient from "./clients/users";
export * as adminClient from "./clients/admin";
export * as analyticsClient from "./clients/analytics";
export * as sourcesClient from "./clients/sources";
export * from "./clients/errors";
export * from "./clients/session";

export * from "./mutations/auth";
export * from "./mutations/users";
export * from "./mutations/news";

export * from "./queries/digest";
export * from "./queries/admin";
export * from "./queries/analytics";
export * from "./queries/sources";
export * from "./queries/users";
export * from "./queries/news";
