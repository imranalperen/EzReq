Simple purpose request library.

The main idea of this library is that we create many of the same functionality try catch blocks in API requests, especially in front-end projects. For example, firing a sweetalert if the status is 2xx, logging errors, etc. I developed EzReq to automate this.

I used this structure in my own projects and made it as customizable as possible to share. You can also customize it for your projects.

Example usage:
```js
const EzReq = require("./index");

const apiurl = "https://dummyjson.com";
const headers = { "X-access-token": "very-secret-token" };

const apiv1 = new EzReq(apiurl, headers);

const mySuccessCallback = (response, your_args) => {
  // fire a swal, manipulate response etc.
  return response;
};

const myErrorCalback = (error, your_args) => {
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
})();
```