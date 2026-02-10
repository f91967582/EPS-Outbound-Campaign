import { postData } from "../api/SirWebApi";

/**
 * Calls SirWeb with a Connect-style payload.
 */
export const sirWebInvoke = async ({
  action,
  nuDocumento,
  tpDocumento = "CED",
  nuPoliza,
  contactDataAttributes = {},
  endpoint = "/invoke", 
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
