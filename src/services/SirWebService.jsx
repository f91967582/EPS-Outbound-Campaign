// src/services/sirWebService.js
import { postData } from "../api/SirWebApi";

/**
 * Calls SirWeb with a Connect-style payload.
 * baseURL should already include /Dev, so endpoint should start with "/invoke" or your real route.
 */
export const sirWebInvoke = async ({
  action,
  nuDocumento,
  tpDocumento = "CED",
  nuPoliza,
  contactDataAttributes = {},
  endpoint = "/invoke", // <-- change to your real route if different
}) => {
  const payload = {
    Details: {
      ContactData: { Attributes: contactDataAttributes },
      Parameters: {
        action,
        nuDocumento,
        tpDocumento,
        ...(nuPoliza ? { nuPoliza } : {}),
      },
    },
  };

  return postData(endpoint, payload);
};
