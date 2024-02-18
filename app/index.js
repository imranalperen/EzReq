class EzReq {
  #api_url = null;
  #headers = null;

  get api_url() {
    return this.#api_url;
  }

  get headers() {
    return this.#headers;
  }

  /**
   * Only api_url required. Other constructors are optional
   * @param {URL} api_url - Api url like `api.myapi.io`.
   * @param {object} headers - Headers which uses all requests.
   * @param {Arraay} success_HTTP_codes - If it is not specified takes DEFAULT_SUCCESS_LIST.
   * @param {Array} fail_HTTP_codes - If it is not specified takes DEFAULT_FAIL_LIST.
   */
  constructor(api_url, headers) {
    this.#api_url = new URL(api_url);
    this.#headers = headers;
    EzReq.assert(this);
  }

  static assert(obj) {
    if (!(obj.api_url instanceof URL)) {
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

  checkCallback(onSuccess, onError) {
    if (onSuccess && typeof onSuccess.fn !== "function") {
      throw new Error("callback must be a function.");
    }
    if (onError && typeof onError.fn !== "function") {
      throw new Error("callback must be a function.");
    }
  }

  /**
   * @typedef {Object} RequestOptions
   * @property {string} path - The request path.
   * @property {string} headers - Request headers.
   * @property {string} hash - The request hash value. aka anchor tag.
   * @property {Function} onSuccess - Callback function for successfull request.
   * @property {Function} onError - Callback function for unsuccessfull request.
   */

  /**
   * Function that makes a GET request that given options.
   * @param {RequestOptions} args - The request options.
   */
  async GET(args) {
    this.updateUrl(args);
    this.checkCallback(args.onSuccess, args.onError);

    try {
      const response = await fetch(this.#api_url, {
        method: "GET",
        headers: args.headers || this.#headers,
      }).then((res) => res.json());
      return this.handleResponse(response, args.onSuccess);
    } catch (error) {
      if (args.onError) {
        args.onError.fn(error, args.onError.args);
      }
      return error;
    }
  }

  /**
   * Function that makes a POST request that given options.
   * @param {RequestOptions} args - The request options.
   * @param {object} args.body - The request body.
   */
  async POST(args) {
    this.updateUrl(args);
    this.checkCallback(args.onSuccess, args.onError);

    try {
      const response = await fetch(this.#api_url, {
        method: "POST",
        headers: args.headers || this.#headers,
        body: JSON.stringify(args.body),
      }).then((res) => res.json());
      return this.handleResponse(response, args.onSuccess);
    } catch (error) {
      if (args.onError) {
        args.onError.fn(error, args.onError.args);
      }
      return error;
    }
  }

  /**
   * Function that makes a PUT request that given options.
   * @param {RequestOptions} args - The request options.
   * @param {object} args.body - The request body.
   */
  async PUT(args) {
    this.updateUrl(args);
    this.checkCallback(args.onSuccess, args.onError);

    try {
      const response = await fetch(this.#api_url, {
        method: "PUT",
        headers: args.headers || this.#headers,
        body: JSON.stringify(args.body),
      }).then((res) => res.json());
      return this.handleResponse(response, args.onSuccess);
    } catch (error) {
      if (args.onError) {
        args.onError.fn(error, args.onError.args);
      }
      return error;
    }
  }

  /**
   * Function that makes a DELETE request that given options.
   * @param {RequestOptions} args - The request options.
   */
  async DELETE(args) {
    this.updateUrl(args);
    this.checkCallback(args.onSuccess, args.onError);

    try {
      const response = await fetch(this.#api_url, {
        method: "DELETE",
        headers: args.headers || this.#headers,
      }).then((res) => res.json());
      return this.handleResponse(response, args.onSuccess);
    } catch (error) {
      if (args.onError) {
        args.onError.fn(error, args.onError.args);
      }
      return error;
    }
  }

  async handleResponse(res, onSuccFunc) {
    let response = res;
    if (onSuccFunc?.fn) {
      response = onSuccFunc.fn(response, onSuccFunc.args);
    }
    return response;
  }
}

module.exports = EzReq;
