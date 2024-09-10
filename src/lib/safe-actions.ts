import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient();

import { useAction } from "next-safe-action/hooks";

export { useAction };
