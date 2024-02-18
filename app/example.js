const EzReq = require("./index");

const apiurl = "https://dummyjson.com";
const headers = { "X-access-token": "very-secret-token" };

const apiv1 = new EzReq(apiurl, headers);

/**
 * @param {object} response - The response to request with the .json() method applied.
 * @param {any} your_args - The arguments of callback.
 */
const mySuccessCallback = (response, your_args) => {
  console.log(your_args);
  return response;
};

/**
 * @param {Error} error - The catch error of request.
 * @param {any} your_args - The arguments of callback.
 */
const myErrorCalback = (error, your_args) => {
  console.log(your_args);
  return error;
};

(async () => {
  const getRes = await apiv1.GET({
    path: "products",
    params: {
      limit: "5",
      sort: "desc",
    },
    // optional. if you want to use different headers you can use.
    headers: {
      lorem: "ipsum",
    },
    // optional
    onSuccess: {
      fn: mySuccessCallback,
      args: "this is some cb args",
    },
    // optional
    onError: {
      fn: myErrorCalback,
      args: "this is some on error args",
    },
  });
  console.log(getRes);

  const postRes = await apiv1.POST({
    path: "/api/v1/heath",
    body: {
      title: "test product",
      price: 13.5,
      description: "lorem",
      category: "electronic",
    },
  });
  console.log("This is reponse of post request:", postRes);

  const putRes = await apiv1.PUT({
    path: "/products/2",
    body: {
      title: "test product",
      price: 13.5,
      description: "update lorem",
      category: "electronic",
    },
  });
  console.log("This is reponse of PUT request: ", putRes);
})();
