const success_HTTP_codes = [200, 201];
class EzReq {
  #api_url = null;
  #headers = null;

  get api_url() {
    return this.#api_url;
  }

  get headers() {
    return this.#headers;
  }

  constructor(api_url, headers) {
    this.#api_url = new URL(api_url);
    this.#headers = headers;
    EzReq.assert(this.#api_url);
  }

  static assert(url) {
    if (!(url instanceof URL)) {
      throw new Error("api url must be instance of URL class");
    }
  }

  updateUrl(args) {
    if (!args.path) {
      throw new Error("need a pathname");
    }
    this.#api_url.pathname = args.path;

    if (args.params) {
      for (const param in args.params) {
        this.#api_url.searchParams.append(param, args.params[param]);
      }
    }

    if (args.hash) {
      this.#api_url.hash = args.hash;
    }
  }

  checkCallback(callback) {
    if (!callback) return;
    if (typeof callback.fn !== "function") {
      throw new Error("callback must be a function");
    }
  }

  async GET(args) {
    this.updateUrl(args);
    this.checkCallback(args.callback);
    let raw_response;
    try {
      raw_response = await fetch(this.#api_url, {
        method: "GET",
        headers: args.headers || this.#headers,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
    return await this.handleResponse(raw_response, args.callback);
  }

  async POST(args) {
    this.updateUrl(args);
    this.checkCallback(args.callback);
    let raw_response;
    try {
      raw_response = await fetch(this.#api_url, {
        method: "POST",
        headers: args.headers || this.#headers,
        body: JSON.stringify(args.body),
      });
    } catch (error) {
      console.log(error);
      return false;
    }
    return await this.handleResponse(raw_response, args.callback);
  }

  async PUT(args) {
    this.updateUrl(args);
    this.checkCallback(args.callback);
    let raw_response;
    try {
      raw_response = await fetch(this.#api_url, {
        method: "PUT",
        headers: args.headers || this.#headers,
        body: JSON.stringify(args.body),
      });
    } catch (error) {
      console.log(error);
      return false;
    }
    return await this.handleResponse(raw_response, args.callback);
  }

  async PATCH(args) {
    await this.PUT(args);
  }

  async handleResponse(res, callback) {
    if (success_HTTP_codes.includes(res.status)) {
      let response = await res.json();
      if (callback?.fn) {
        response = callback.fn(response, callback.args);
      }
      return response;
    } else {
      const response = res;
      return response;
    }
  }
}

// ##################################################################

const apiurl = "https://fakestoreapi.com";
const headers = {
  "X-access-token": "very-secret-token",
};

const apiv1 = new EzReq(apiurl, headers);

// if callback have an return value there will be problem
// first argument is response second one is user arguments
const callback = (response, your_args) => {
  console.log(
    "if token error update token and re request maybe fire a swall or toast bla bla bla",
  );
  return response;
};

(async () => {
  const getRes = await apiv1.GET({
    path: "products",
    params: {
      limit: "5",
      sort: "desc",
    },
    hash: "hello",
    headers: {
      lorem: "ipsum",
    },
    callback: {
      fn: callback,
      args: "this is some cb args",
    },
  });
  console.log(getRes);

  const postRes = await apiv1.POST({
    path: "/products",
    body: {
      title: "test product",
      price: 13.5,
      description: "lorem",
      category: "electronic",
    },
  });
  // console.log(postRes);

  const putRes = await apiv1.PUT({
    path: "/products/2",
    body: {
      title: "test product",
      price: 13.5,
      description: "update lorem",
      category: "electronic",
    },
  });
  // console.log(putRes);
})();
