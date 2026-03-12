export { endpoints } from "./endpoints";

export * as authClient from "./clients/auth";
export * as categoriesClient from "./clients/categories";
export * as digestClient from "./clients/digest";
export * as usersClient from "./clients/users";
export * from "./clients/errors";
export * from "./clients/session";

export * from "./mutations/auth";
export * from "./mutations/users";

export * from "./queries/digest";
