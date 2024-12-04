var background = function() {
  "use strict";
  function defineBackground(arg) {
    if (arg == null || typeof arg === "function") return { main: arg };
    return arg;
  }
  var _MatchPattern = class {
    constructor(matchPattern) {
      if (matchPattern === "<all_urls>") {
        this.isAllUrls = true;
        this.protocolMatches = [..._MatchPattern.PROTOCOLS];
        this.hostnameMatch = "*";
        this.pathnameMatch = "*";
      } else {
        const groups = /(.*):\/\/(.*?)(\/.*)/.exec(matchPattern);
        if (groups == null)
          throw new InvalidMatchPattern(matchPattern, "Incorrect format");
        const [_, protocol, hostname, pathname] = groups;
        validateProtocol(matchPattern, protocol);
        validateHostname(matchPattern, hostname);
        this.protocolMatches = protocol === "*" ? ["http", "https"] : [protocol];
        this.hostnameMatch = hostname;
        this.pathnameMatch = pathname;
      }
    }
    includes(url) {
      if (this.isAllUrls)
        return true;
      const u = typeof url === "string" ? new URL(url) : url instanceof Location ? new URL(url.href) : url;
      return !!this.protocolMatches.find((protocol) => {
        if (protocol === "http")
          return this.isHttpMatch(u);
        if (protocol === "https")
          return this.isHttpsMatch(u);
        if (protocol === "file")
          return this.isFileMatch(u);
        if (protocol === "ftp")
          return this.isFtpMatch(u);
        if (protocol === "urn")
          return this.isUrnMatch(u);
      });
    }
    isHttpMatch(url) {
      return url.protocol === "http:" && this.isHostPathMatch(url);
    }
    isHttpsMatch(url) {
      return url.protocol === "https:" && this.isHostPathMatch(url);
    }
    isHostPathMatch(url) {
      if (!this.hostnameMatch || !this.pathnameMatch)
        return false;
      const hostnameMatchRegexs = [
        this.convertPatternToRegex(this.hostnameMatch),
        this.convertPatternToRegex(this.hostnameMatch.replace(/^\*\./, ""))
      ];
      const pathnameMatchRegex = this.convertPatternToRegex(this.pathnameMatch);
      return !!hostnameMatchRegexs.find((regex) => regex.test(url.hostname)) && pathnameMatchRegex.test(url.pathname);
    }
    isFileMatch(url) {
      throw Error("Not implemented: file:// pattern matching. Open a PR to add support");
    }
    isFtpMatch(url) {
      throw Error("Not implemented: ftp:// pattern matching. Open a PR to add support");
    }
    isUrnMatch(url) {
      throw Error("Not implemented: urn:// pattern matching. Open a PR to add support");
    }
    convertPatternToRegex(pattern) {
      const escaped = this.escapeForRegex(pattern);
      const starsReplaced = escaped.replace(/\\\*/g, ".*");
      return RegExp(`^${starsReplaced}$`);
    }
    escapeForRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  };
  var MatchPattern = _MatchPattern;
  MatchPattern.PROTOCOLS = ["http", "https", "file", "ftp", "urn"];
  var InvalidMatchPattern = class extends Error {
    constructor(matchPattern, reason) {
      super(`Invalid match pattern "${matchPattern}": ${reason}`);
    }
  };
  function validateProtocol(matchPattern, protocol) {
    if (!MatchPattern.PROTOCOLS.includes(protocol) && protocol !== "*")
      throw new InvalidMatchPattern(
        matchPattern,
        `${protocol} not a valid protocol (${MatchPattern.PROTOCOLS.join(", ")})`
      );
  }
  function validateHostname(matchPattern, hostname) {
    if (hostname.includes(":"))
      throw new InvalidMatchPattern(matchPattern, `Hostname cannot include a port`);
    if (hostname.includes("*") && hostname.length > 1 && !hostname.startsWith("*."))
      throw new InvalidMatchPattern(
        matchPattern,
        `If using a wildcard (*), it must go at the start of the hostname`
      );
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var browserPolyfill = { exports: {} };
  (function(module, exports) {
    (function(global2, factory) {
      {
        factory(module);
      }
    })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : commonjsGlobal, function(module2) {
      if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
        throw new Error("This script should only be loaded in a browser extension.");
      }
      if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
        const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
        const wrapAPIs = (extensionAPIs) => {
          const apiMetadata = {
            "alarms": {
              "clear": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "clearAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "get": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "bookmarks": {
              "create": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getChildren": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getRecent": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getSubTree": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTree": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "move": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeTree": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "browserAction": {
              "disable": {
                "minArgs": 0,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "enable": {
                "minArgs": 0,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "getBadgeBackgroundColor": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getBadgeText": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getPopup": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTitle": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "openPopup": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "setBadgeBackgroundColor": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setBadgeText": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setIcon": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "setPopup": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setTitle": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "browsingData": {
              "remove": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "removeCache": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeCookies": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeDownloads": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeFormData": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeHistory": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeLocalStorage": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removePasswords": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removePluginData": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "settings": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "commands": {
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "contextMenus": {
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "cookies": {
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAllCookieStores": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "set": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "devtools": {
              "inspectedWindow": {
                "eval": {
                  "minArgs": 1,
                  "maxArgs": 2,
                  "singleCallbackArg": false
                }
              },
              "panels": {
                "create": {
                  "minArgs": 3,
                  "maxArgs": 3,
                  "singleCallbackArg": true
                },
                "elements": {
                  "createSidebarPane": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              }
            },
            "downloads": {
              "cancel": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "download": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "erase": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getFileIcon": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "open": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "pause": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeFile": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "resume": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "show": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "extension": {
              "isAllowedFileSchemeAccess": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "isAllowedIncognitoAccess": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "history": {
              "addUrl": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "deleteAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "deleteRange": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "deleteUrl": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getVisits": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "i18n": {
              "detectLanguage": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAcceptLanguages": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "identity": {
              "launchWebAuthFlow": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "idle": {
              "queryState": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "management": {
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getSelf": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "setEnabled": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "uninstallSelf": {
                "minArgs": 0,
                "maxArgs": 1
              }
            },
            "notifications": {
              "clear": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "create": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getPermissionLevel": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "pageAction": {
              "getPopup": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTitle": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "hide": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setIcon": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "setPopup": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setTitle": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "show": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "permissions": {
              "contains": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "request": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "runtime": {
              "getBackgroundPage": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getPlatformInfo": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "openOptionsPage": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "requestUpdateCheck": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "sendMessage": {
                "minArgs": 1,
                "maxArgs": 3
              },
              "sendNativeMessage": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "setUninstallURL": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "sessions": {
              "getDevices": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getRecentlyClosed": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "restore": {
                "minArgs": 0,
                "maxArgs": 1
              }
            },
            "storage": {
              "local": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "managed": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "sync": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              }
            },
            "tabs": {
              "captureVisibleTab": {
                "minArgs": 0,
                "maxArgs": 2
              },
              "create": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "detectLanguage": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "discard": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "duplicate": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "executeScript": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getCurrent": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getZoom": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getZoomSettings": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "goBack": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "goForward": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "highlight": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "insertCSS": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "move": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "query": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "reload": {
                "minArgs": 0,
                "maxArgs": 2
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeCSS": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "sendMessage": {
                "minArgs": 2,
                "maxArgs": 3
              },
              "setZoom": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "setZoomSettings": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "update": {
                "minArgs": 1,
                "maxArgs": 2
              }
            },
            "topSites": {
              "get": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "webNavigation": {
              "getAllFrames": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getFrame": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "webRequest": {
              "handlerBehaviorChanged": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "windows": {
              "create": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getCurrent": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getLastFocused": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            }
          };
          if (Object.keys(apiMetadata).length === 0) {
            throw new Error("api-metadata.json has not been included in browser-polyfill");
          }
          class DefaultWeakMap extends WeakMap {
            constructor(createItem, items = void 0) {
              super(items);
              this.createItem = createItem;
            }
            get(key) {
              if (!this.has(key)) {
                this.set(key, this.createItem(key));
              }
              return super.get(key);
            }
          }
          const isThenable = (value) => {
            return value && typeof value === "object" && typeof value.then === "function";
          };
          const makeCallback = (promise, metadata) => {
            return (...callbackArgs) => {
              if (extensionAPIs.runtime.lastError) {
                promise.reject(new Error(extensionAPIs.runtime.lastError.message));
              } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                promise.resolve(callbackArgs[0]);
              } else {
                promise.resolve(callbackArgs);
              }
            };
          };
          const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
          const wrapAsyncFunction = (name, metadata) => {
            return function asyncFunctionWrapper(target, ...args) {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                if (metadata.fallbackToNoCallback) {
                  try {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  } catch (cbError) {
                    console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                    target[name](...args);
                    metadata.fallbackToNoCallback = false;
                    metadata.noCallback = true;
                    resolve();
                  }
                } else if (metadata.noCallback) {
                  target[name](...args);
                  resolve();
                } else {
                  target[name](...args, makeCallback({
                    resolve,
                    reject
                  }, metadata));
                }
              });
            };
          };
          const wrapMethod = (target, method, wrapper) => {
            return new Proxy(method, {
              apply(targetMethod, thisObj, args) {
                return wrapper.call(thisObj, target, ...args);
              }
            });
          };
          let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
          const wrapObject = (target, wrappers = {}, metadata = {}) => {
            let cache = /* @__PURE__ */ Object.create(null);
            let handlers = {
              has(proxyTarget2, prop) {
                return prop in target || prop in cache;
              },
              get(proxyTarget2, prop, receiver) {
                if (prop in cache) {
                  return cache[prop];
                }
                if (!(prop in target)) {
                  return void 0;
                }
                let value = target[prop];
                if (typeof value === "function") {
                  if (typeof wrappers[prop] === "function") {
                    value = wrapMethod(target, target[prop], wrappers[prop]);
                  } else if (hasOwnProperty(metadata, prop)) {
                    let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                    value = wrapMethod(target, target[prop], wrapper);
                  } else {
                    value = value.bind(target);
                  }
                } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                  value = wrapObject(value, wrappers[prop], metadata[prop]);
                } else if (hasOwnProperty(metadata, "*")) {
                  value = wrapObject(value, wrappers[prop], metadata["*"]);
                } else {
                  Object.defineProperty(cache, prop, {
                    configurable: true,
                    enumerable: true,
                    get() {
                      return target[prop];
                    },
                    set(value2) {
                      target[prop] = value2;
                    }
                  });
                  return value;
                }
                cache[prop] = value;
                return value;
              },
              set(proxyTarget2, prop, value, receiver) {
                if (prop in cache) {
                  cache[prop] = value;
                } else {
                  target[prop] = value;
                }
                return true;
              },
              defineProperty(proxyTarget2, prop, desc) {
                return Reflect.defineProperty(cache, prop, desc);
              },
              deleteProperty(proxyTarget2, prop) {
                return Reflect.deleteProperty(cache, prop);
              }
            };
            let proxyTarget = Object.create(target);
            return new Proxy(proxyTarget, handlers);
          };
          const wrapEvent = (wrapperMap) => ({
            addListener(target, listener, ...args) {
              target.addListener(wrapperMap.get(listener), ...args);
            },
            hasListener(target, listener) {
              return target.hasListener(wrapperMap.get(listener));
            },
            removeListener(target, listener) {
              target.removeListener(wrapperMap.get(listener));
            }
          });
          const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
            if (typeof listener !== "function") {
              return listener;
            }
            return function onRequestFinished(req) {
              const wrappedReq = wrapObject(req, {}, {
                getContent: {
                  minArgs: 0,
                  maxArgs: 0
                }
              });
              listener(wrappedReq);
            };
          });
          const onMessageWrappers = new DefaultWeakMap((listener) => {
            if (typeof listener !== "function") {
              return listener;
            }
            return function onMessage(message, sender, sendResponse) {
              let didCallSendResponse = false;
              let wrappedSendResponse;
              let sendResponsePromise = new Promise((resolve) => {
                wrappedSendResponse = function(response) {
                  didCallSendResponse = true;
                  resolve(response);
                };
              });
              let result2;
              try {
                result2 = listener(message, sender, wrappedSendResponse);
              } catch (err) {
                result2 = Promise.reject(err);
              }
              const isResultThenable = result2 !== true && isThenable(result2);
              if (result2 !== true && !isResultThenable && !didCallSendResponse) {
                return false;
              }
              const sendPromisedResult = (promise) => {
                promise.then((msg) => {
                  sendResponse(msg);
                }, (error) => {
                  let message2;
                  if (error && (error instanceof Error || typeof error.message === "string")) {
                    message2 = error.message;
                  } else {
                    message2 = "An unexpected error occurred";
                  }
                  sendResponse({
                    __mozWebExtensionPolyfillReject__: true,
                    message: message2
                  });
                }).catch((err) => {
                  console.error("Failed to send onMessage rejected reply", err);
                });
              };
              if (isResultThenable) {
                sendPromisedResult(result2);
              } else {
                sendPromisedResult(sendResponsePromise);
              }
              return true;
            };
          });
          const wrappedSendMessageCallback = ({
            reject,
            resolve
          }, reply) => {
            if (extensionAPIs.runtime.lastError) {
              if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                resolve();
              } else {
                reject(new Error(extensionAPIs.runtime.lastError.message));
              }
            } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
              reject(new Error(reply.message));
            } else {
              resolve(reply);
            }
          };
          const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
            if (args.length < metadata.minArgs) {
              throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
            }
            if (args.length > metadata.maxArgs) {
              throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
            }
            return new Promise((resolve, reject) => {
              const wrappedCb = wrappedSendMessageCallback.bind(null, {
                resolve,
                reject
              });
              args.push(wrappedCb);
              apiNamespaceObj.sendMessage(...args);
            });
          };
          const staticWrappers = {
            devtools: {
              network: {
                onRequestFinished: wrapEvent(onRequestFinishedWrappers)
              }
            },
            runtime: {
              onMessage: wrapEvent(onMessageWrappers),
              onMessageExternal: wrapEvent(onMessageWrappers),
              sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                minArgs: 1,
                maxArgs: 3
              })
            },
            tabs: {
              sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                minArgs: 2,
                maxArgs: 3
              })
            }
          };
          const settingMetadata = {
            clear: {
              minArgs: 1,
              maxArgs: 1
            },
            get: {
              minArgs: 1,
              maxArgs: 1
            },
            set: {
              minArgs: 1,
              maxArgs: 1
            }
          };
          apiMetadata.privacy = {
            network: {
              "*": settingMetadata
            },
            services: {
              "*": settingMetadata
            },
            websites: {
              "*": settingMetadata
            }
          };
          return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
        };
        module2.exports = wrapAPIs(chrome);
      } else {
        module2.exports = globalThis.browser;
      }
    });
  })(browserPolyfill);
  var browserPolyfillExports = browserPolyfill.exports;
  const originalBrowser = /* @__PURE__ */ getDefaultExportFromCjs(browserPolyfillExports);
  const browser = originalBrowser;
  var has = Object.prototype.hasOwnProperty;
  function dequal(foo, bar) {
    var ctor, len;
    if (foo === bar) return true;
    if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
      if (ctor === Date) return foo.getTime() === bar.getTime();
      if (ctor === RegExp) return foo.toString() === bar.toString();
      if (ctor === Array) {
        if ((len = foo.length) === bar.length) {
          while (len-- && dequal(foo[len], bar[len])) ;
        }
        return len === -1;
      }
      if (!ctor || typeof foo === "object") {
        len = 0;
        for (ctor in foo) {
          if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
          if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
        }
        return Object.keys(bar).length === len;
      }
    }
    return foo !== foo && bar !== bar;
  }
  function print$1(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger$1 = {
    debug: (...args) => print$1(console.debug, ...args),
    log: (...args) => print$1(console.log, ...args),
    warn: (...args) => print$1(console.warn, ...args),
    error: (...args) => print$1(console.error, ...args)
  };
  function toArray(a) {
    return Array.isArray(a) ? a : [a];
  }
  const E_CANCELED = new Error("request for lock canceled");
  var __awaiter$2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result2) {
        result2.done ? resolve(result2.value) : adopt(result2.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  class Semaphore {
    constructor(_value, _cancelError = E_CANCELED) {
      this._value = _value;
      this._cancelError = _cancelError;
      this._queue = [];
      this._weightedWaiters = [];
    }
    acquire(weight = 1, priority = 0) {
      if (weight <= 0)
        throw new Error(`invalid weight ${weight}: must be positive`);
      return new Promise((resolve, reject) => {
        const task = { resolve, reject, weight, priority };
        const i = findIndexFromEnd(this._queue, (other) => priority <= other.priority);
        if (i === -1 && weight <= this._value) {
          this._dispatchItem(task);
        } else {
          this._queue.splice(i + 1, 0, task);
        }
      });
    }
    runExclusive(callback_1) {
      return __awaiter$2(this, arguments, void 0, function* (callback, weight = 1, priority = 0) {
        const [value, release] = yield this.acquire(weight, priority);
        try {
          return yield callback(value);
        } finally {
          release();
        }
      });
    }
    waitForUnlock(weight = 1, priority = 0) {
      if (weight <= 0)
        throw new Error(`invalid weight ${weight}: must be positive`);
      if (this._couldLockImmediately(weight, priority)) {
        return Promise.resolve();
      } else {
        return new Promise((resolve) => {
          if (!this._weightedWaiters[weight - 1])
            this._weightedWaiters[weight - 1] = [];
          insertSorted(this._weightedWaiters[weight - 1], { resolve, priority });
        });
      }
    }
    isLocked() {
      return this._value <= 0;
    }
    getValue() {
      return this._value;
    }
    setValue(value) {
      this._value = value;
      this._dispatchQueue();
    }
    release(weight = 1) {
      if (weight <= 0)
        throw new Error(`invalid weight ${weight}: must be positive`);
      this._value += weight;
      this._dispatchQueue();
    }
    cancel() {
      this._queue.forEach((entry) => entry.reject(this._cancelError));
      this._queue = [];
    }
    _dispatchQueue() {
      this._drainUnlockWaiters();
      while (this._queue.length > 0 && this._queue[0].weight <= this._value) {
        this._dispatchItem(this._queue.shift());
        this._drainUnlockWaiters();
      }
    }
    _dispatchItem(item) {
      const previousValue = this._value;
      this._value -= item.weight;
      item.resolve([previousValue, this._newReleaser(item.weight)]);
    }
    _newReleaser(weight) {
      let called = false;
      return () => {
        if (called)
          return;
        called = true;
        this.release(weight);
      };
    }
    _drainUnlockWaiters() {
      if (this._queue.length === 0) {
        for (let weight = this._value; weight > 0; weight--) {
          const waiters = this._weightedWaiters[weight - 1];
          if (!waiters)
            continue;
          waiters.forEach((waiter) => waiter.resolve());
          this._weightedWaiters[weight - 1] = [];
        }
      } else {
        const queuedPriority = this._queue[0].priority;
        for (let weight = this._value; weight > 0; weight--) {
          const waiters = this._weightedWaiters[weight - 1];
          if (!waiters)
            continue;
          const i = waiters.findIndex((waiter) => waiter.priority <= queuedPriority);
          (i === -1 ? waiters : waiters.splice(0, i)).forEach((waiter) => waiter.resolve());
        }
      }
    }
    _couldLockImmediately(weight, priority) {
      return (this._queue.length === 0 || this._queue[0].priority < priority) && weight <= this._value;
    }
  }
  function insertSorted(a, v) {
    const i = findIndexFromEnd(a, (other) => v.priority <= other.priority);
    a.splice(i + 1, 0, v);
  }
  function findIndexFromEnd(a, predicate) {
    for (let i = a.length - 1; i >= 0; i--) {
      if (predicate(a[i])) {
        return i;
      }
    }
    return -1;
  }
  var __awaiter$1 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result2) {
        result2.done ? resolve(result2.value) : adopt(result2.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  class Mutex {
    constructor(cancelError) {
      this._semaphore = new Semaphore(1, cancelError);
    }
    acquire() {
      return __awaiter$1(this, arguments, void 0, function* (priority = 0) {
        const [, releaser] = yield this._semaphore.acquire(1, priority);
        return releaser;
      });
    }
    runExclusive(callback, priority = 0) {
      return this._semaphore.runExclusive(() => callback(), 1, priority);
    }
    isLocked() {
      return this._semaphore.isLocked();
    }
    waitForUnlock(priority = 0) {
      return this._semaphore.waitForUnlock(1, priority);
    }
    release() {
      if (this._semaphore.isLocked())
        this._semaphore.release();
    }
    cancel() {
      return this._semaphore.cancel();
    }
  }
  const storage = createStorage();
  function createStorage() {
    const drivers = {
      local: createDriver("local"),
      session: createDriver("session"),
      sync: createDriver("sync"),
      managed: createDriver("managed")
    };
    const getDriver = (area) => {
      const driver = drivers[area];
      if (driver == null) {
        const areaNames = Object.keys(drivers).join(", ");
        throw Error(`Invalid area "${area}". Options: ${areaNames}`);
      }
      return driver;
    };
    const resolveKey = (key) => {
      const deliminatorIndex = key.indexOf(":");
      const driverArea = key.substring(0, deliminatorIndex);
      const driverKey = key.substring(deliminatorIndex + 1);
      if (driverKey == null)
        throw Error(
          `Storage key should be in the form of "area:key", but received "${key}"`
        );
      return {
        driverArea,
        driverKey,
        driver: getDriver(driverArea)
      };
    };
    const getMetaKey = (key) => key + "$";
    const getValueOrFallback = (value, fallback) => value ?? fallback ?? null;
    const getMetaValue = (properties) => typeof properties === "object" && !Array.isArray(properties) ? properties : {};
    const getItem = async (driver, driverKey, opts) => {
      const res = await driver.getItem(driverKey);
      return getValueOrFallback(res, (opts == null ? void 0 : opts.fallback) ?? (opts == null ? void 0 : opts.defaultValue));
    };
    const getMeta = async (driver, driverKey) => {
      const metaKey = getMetaKey(driverKey);
      const res = await driver.getItem(metaKey);
      return getMetaValue(res);
    };
    const setItem = async (driver, driverKey, value) => {
      await driver.setItem(driverKey, value ?? null);
    };
    const setMeta = async (driver, driverKey, properties) => {
      const metaKey = getMetaKey(driverKey);
      const existingFields = getMetaValue(await driver.getItem(metaKey));
      const newFields = { ...existingFields };
      Object.entries(properties).forEach(([key, value]) => {
        if (value == null) {
          delete newFields[key];
        } else {
          newFields[key] = value;
        }
      });
      await driver.setItem(metaKey, newFields);
    };
    const removeItem = async (driver, driverKey, opts) => {
      await driver.removeItem(driverKey);
      if (opts == null ? void 0 : opts.removeMeta) {
        const metaKey = getMetaKey(driverKey);
        await driver.removeItem(metaKey);
      }
    };
    const removeMeta = async (driver, driverKey, properties) => {
      const metaKey = getMetaKey(driverKey);
      if (properties == null) {
        await driver.removeItem(metaKey);
      } else {
        const newFields = getMetaValue(await driver.getItem(metaKey));
        toArray(properties).forEach((field) => delete newFields[field]);
        await driver.setItem(metaKey, newFields);
      }
    };
    const watch = (driver, driverKey, cb) => {
      return driver.watch(driverKey, cb);
    };
    const storage2 = {
      getItem: async (key, opts) => {
        const { driver, driverKey } = resolveKey(key);
        return await getItem(driver, driverKey, opts);
      },
      getItems: async (keys) => {
        const areaToKeyMap = /* @__PURE__ */ new Map();
        const keyToOptsMap = /* @__PURE__ */ new Map();
        keys.forEach((key) => {
          let keyStr;
          let opts;
          if (typeof key === "string") {
            keyStr = key;
          } else {
            keyStr = key.key;
            opts = key.options;
          }
          const { driverArea, driverKey } = resolveKey(keyStr);
          const keys2 = areaToKeyMap.get(driverArea) ?? [];
          areaToKeyMap.set(driverArea, keys2.concat(driverKey));
          keyToOptsMap.set(keyStr, opts);
        });
        const results = await Promise.all(
          Array.from(areaToKeyMap.entries()).map(async ([driverArea, keys2]) => {
            const driverResults = await drivers[driverArea].getItems(keys2);
            return driverResults.map((driverResult) => {
              const key = `${driverArea}:${driverResult.key}`;
              const opts = keyToOptsMap.get(key);
              const value = getValueOrFallback(
                driverResult.value,
                (opts == null ? void 0 : opts.fallback) ?? (opts == null ? void 0 : opts.defaultValue)
              );
              return { key, value };
            });
          })
        );
        return results.flat();
      },
      getMeta: async (key) => {
        const { driver, driverKey } = resolveKey(key);
        return await getMeta(driver, driverKey);
      },
      setItem: async (key, value) => {
        const { driver, driverKey } = resolveKey(key);
        await setItem(driver, driverKey, value);
      },
      setItems: async (values) => {
        const areaToKeyValueMap = /* @__PURE__ */ new Map();
        values.forEach(({ key, value }) => {
          const { driverArea, driverKey } = resolveKey(key);
          const values2 = areaToKeyValueMap.get(driverArea) ?? [];
          areaToKeyValueMap.set(
            driverArea,
            values2.concat({ key: driverKey, value })
          );
        });
        await Promise.all(
          Array.from(areaToKeyValueMap.entries()).map(
            async ([driverArea, values2]) => {
              const driver = getDriver(driverArea);
              await driver.setItems(values2);
            }
          )
        );
      },
      setMeta: async (key, properties) => {
        const { driver, driverKey } = resolveKey(key);
        await setMeta(driver, driverKey, properties);
      },
      removeItem: async (key, opts) => {
        const { driver, driverKey } = resolveKey(key);
        await removeItem(driver, driverKey, opts);
      },
      removeItems: async (keys) => {
        const areaToKeysMap = /* @__PURE__ */ new Map();
        keys.forEach((key) => {
          let keyStr;
          let opts;
          if (typeof key === "string") {
            keyStr = key;
          } else {
            keyStr = key.key;
            opts = key.options;
          }
          const { driverArea, driverKey } = resolveKey(keyStr);
          const areaKeys = areaToKeysMap.get(driverArea) ?? [];
          areaKeys.push(driverKey);
          if (opts == null ? void 0 : opts.removeMeta) {
            areaKeys.push(getMetaKey(driverKey));
          }
          areaToKeysMap.set(driverArea, areaKeys);
        });
        await Promise.all(
          Array.from(areaToKeysMap.entries()).map(async ([driverArea, keys2]) => {
            const driver = getDriver(driverArea);
            await driver.removeItems(keys2);
          })
        );
      },
      removeMeta: async (key, properties) => {
        const { driver, driverKey } = resolveKey(key);
        await removeMeta(driver, driverKey, properties);
      },
      snapshot: async (base, opts) => {
        var _a;
        const driver = getDriver(base);
        const data = await driver.snapshot();
        (_a = opts == null ? void 0 : opts.excludeKeys) == null ? void 0 : _a.forEach((key) => {
          delete data[key];
          delete data[getMetaKey(key)];
        });
        return data;
      },
      restoreSnapshot: async (base, data) => {
        const driver = getDriver(base);
        await driver.restoreSnapshot(data);
      },
      watch: (key, cb) => {
        const { driver, driverKey } = resolveKey(key);
        return watch(driver, driverKey, cb);
      },
      unwatch() {
        Object.values(drivers).forEach((driver) => {
          driver.unwatch();
        });
      },
      defineItem: (key, opts) => {
        const { driver, driverKey } = resolveKey(key);
        const { version: targetVersion = 1, migrations = {} } = opts ?? {};
        if (targetVersion < 1) {
          throw Error(
            "Storage item version cannot be less than 1. Initial versions should be set to 1, not 0."
          );
        }
        const migrate = async () => {
          var _a;
          const driverMetaKey = getMetaKey(driverKey);
          const [{ value }, { value: meta }] = await driver.getItems([
            driverKey,
            driverMetaKey
          ]);
          if (value == null) return;
          const currentVersion = (meta == null ? void 0 : meta.v) ?? 1;
          if (currentVersion > targetVersion) {
            throw Error(
              `Version downgrade detected (v${currentVersion} -> v${targetVersion}) for "${key}"`
            );
          }
          logger$1.debug(
            `Running storage migration for ${key}: v${currentVersion} -> v${targetVersion}`
          );
          const migrationsToRun = Array.from(
            { length: targetVersion - currentVersion },
            (_, i) => currentVersion + i + 1
          );
          let migratedValue = value;
          for (const migrateToVersion of migrationsToRun) {
            migratedValue = await ((_a = migrations == null ? void 0 : migrations[migrateToVersion]) == null ? void 0 : _a.call(migrations, migratedValue)) ?? migratedValue;
          }
          await driver.setItems([
            { key: driverKey, value: migratedValue },
            { key: driverMetaKey, value: { ...meta, v: targetVersion } }
          ]);
          logger$1.debug(
            `Storage migration completed for ${key} v${targetVersion}`,
            { migratedValue }
          );
        };
        const migrationsDone = (opts == null ? void 0 : opts.migrations) == null ? Promise.resolve() : migrate().catch((err) => {
          logger$1.error(`Migration failed for ${key}`, err);
        });
        const initMutex = new Mutex();
        const getFallback = () => (opts == null ? void 0 : opts.fallback) ?? (opts == null ? void 0 : opts.defaultValue) ?? null;
        const getOrInitValue = () => initMutex.runExclusive(async () => {
          const value = await driver.getItem(driverKey);
          if (value != null || (opts == null ? void 0 : opts.init) == null) return value;
          const newValue = await opts.init();
          await driver.setItem(driverKey, newValue);
          return newValue;
        });
        migrationsDone.then(getOrInitValue);
        return {
          get defaultValue() {
            return getFallback();
          },
          get fallback() {
            return getFallback();
          },
          getValue: async () => {
            await migrationsDone;
            if (opts == null ? void 0 : opts.init) {
              return await getOrInitValue();
            } else {
              return await getItem(driver, driverKey, opts);
            }
          },
          getMeta: async () => {
            await migrationsDone;
            return await getMeta(driver, driverKey);
          },
          setValue: async (value) => {
            await migrationsDone;
            return await setItem(driver, driverKey, value);
          },
          setMeta: async (properties) => {
            await migrationsDone;
            return await setMeta(driver, driverKey, properties);
          },
          removeValue: async (opts2) => {
            await migrationsDone;
            return await removeItem(driver, driverKey, opts2);
          },
          removeMeta: async (properties) => {
            await migrationsDone;
            return await removeMeta(driver, driverKey, properties);
          },
          watch: (cb) => watch(
            driver,
            driverKey,
            (newValue, oldValue) => cb(newValue ?? getFallback(), oldValue ?? getFallback())
          ),
          migrate
        };
      }
    };
    return storage2;
  }
  function createDriver(storageArea) {
    const getStorageArea = () => {
      if (browser.runtime == null) {
        throw Error(
          [
            "'wxt/storage' must be loaded in a web extension environment",
            "\n - If thrown during a build, see https://github.com/wxt-dev/wxt/issues/371",
            " - If thrown during tests, mock 'wxt/browser' correctly. See https://wxt.dev/guide/go-further/testing.html\n"
          ].join("\n")
        );
      }
      if (browser.storage == null) {
        throw Error(
          "You must add the 'storage' permission to your manifest to use 'wxt/storage'"
        );
      }
      const area = browser.storage[storageArea];
      if (area == null)
        throw Error(`"browser.storage.${storageArea}" is undefined`);
      return area;
    };
    const watchListeners = /* @__PURE__ */ new Set();
    return {
      getItem: async (key) => {
        const res = await getStorageArea().get(key);
        return res[key];
      },
      getItems: async (keys) => {
        const result2 = await getStorageArea().get(keys);
        return keys.map((key) => ({ key, value: result2[key] ?? null }));
      },
      setItem: async (key, value) => {
        if (value == null) {
          await getStorageArea().remove(key);
        } else {
          await getStorageArea().set({ [key]: value });
        }
      },
      setItems: async (values) => {
        const map = values.reduce(
          (map2, { key, value }) => {
            map2[key] = value;
            return map2;
          },
          {}
        );
        await getStorageArea().set(map);
      },
      removeItem: async (key) => {
        await getStorageArea().remove(key);
      },
      removeItems: async (keys) => {
        await getStorageArea().remove(keys);
      },
      snapshot: async () => {
        return await getStorageArea().get();
      },
      restoreSnapshot: async (data) => {
        await getStorageArea().set(data);
      },
      watch(key, cb) {
        const listener = (changes) => {
          const change = changes[key];
          if (change == null) return;
          if (dequal(change.newValue, change.oldValue)) return;
          cb(change.newValue ?? null, change.oldValue ?? null);
        };
        getStorageArea().onChanged.addListener(listener);
        watchListeners.add(listener);
        return () => {
          getStorageArea().onChanged.removeListener(listener);
          watchListeners.delete(listener);
        };
      },
      unwatch() {
        watchListeners.forEach((listener) => {
          getStorageArea().onChanged.removeListener(listener);
        });
        watchListeners.clear();
      }
    };
  }
  const definition = defineBackground(() => {
    browser.runtime.onInstalled.addListener(function() {
      browser.runtime.openOptionsPage();
    });
    browser.contextMenus.create({
      id: "sendToAI",
      title: "JarGone!",
      contexts: ["selection"]
    });
    browser.contextMenus.onClicked.addListener(async (info, tab) => {
      var _a, _b, _c, _d;
      if (info.menuItemId === "sendToAI" && info.selectionText && (tab == null ? void 0 : tab.id)) {
        let errorState = false;
        const settingsStoreKey = "settings";
        const keywordStoreKey = "keywordHistory";
        const savedSettings = await storage.getItem(`local:${settingsStoreKey}`);
        const parsedSettings = savedSettings ? JSON.parse(savedSettings) : {};
        const apiKey = parsedSettings.apiKey || "";
        const confettiAnimation = parsedSettings.confettiAnimation !== void 0 ? parsedSettings.confettiAnimation : true;
        const replaceText = parsedSettings.replaceText !== void 0 ? parsedSettings.replaceText : true;
        const locale = parsedSettings.locale || "english";
        const selectedText = info.selectionText;
        if (replaceText) {
          const promptText = [
            {
              role: "system",
              content: "You are a helpful assistant that reformats text for simplicity and extracts complex keywords with explanations."
            },
            {
              role: "user",
              content: `Please rewrite the following text that is currently too tough to understand. Ensure that the meaning of the rewritten text does not alter the original meaning. Also scrape 3 most obscure/complex keywords/phrases from the text, categorize them grammatically, and provide their meaning in a structured JSON format.

Here is the text:
\`\`\`
${selectedText}
\`\`\`
The following is the expected output JSON structure:
\`\`\`
{
   "rewrittenText": "simplified version of the text in ${locale.toUpperCase()} language",
   "keywords": [
      {
         "keyword": "keyword or phrase",
         "type": "grammatical type",
         "meaning": "explanation in ${locale.toUpperCase()} language"
      }
   ]
}
\`\`\`
Only output JSON. Do NOT output any other format.`
            }
          ];
          let rewrittenText = "";
          let keywordArray = [];
          browser.tabs.sendMessage(tab.id, { type: "CHANGE_CURSOR", state: "waiting" });
          try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
              },
              body: JSON.stringify({
                "model": "gpt-4o-mini",
                "messages": promptText
              })
            });
            const data = await response.json();
            const result2 = (_b = (_a = data.choices[0]) == null ? void 0 : _a.message) == null ? void 0 : _b.content;
            const cleanedResult = result2.replace(/```json|```/g, "").trim();
            const resultJson = JSON.parse(cleanedResult);
            rewrittenText = resultJson.rewrittenText.trim();
            keywordArray = resultJson.keywords;
          } catch (error) {
            console.error("Error: ", error);
            keywordArray = [
              {
                "keyword": "error occurred",
                "type": "error",
                "meaning": `oh no! the empire struck back (x_x;) - Error: ${error}. please report it using the button on the top right.`
              }
            ];
            rewrittenText = `${selectedText} [!!! ERROR - OPEN EXTENSION POPUP !!!]`;
            errorState = true;
          }
          try {
            let keywordHistory = await storage.getItem(`local:${keywordStoreKey}`);
            let keywordHistoryArray = JSON.parse(keywordHistory || "[]");
            if (!keywordHistoryArray) {
              keywordHistoryArray = [];
            }
            await storage.setItem(`local:${keywordStoreKey}`, JSON.stringify([...keywordHistoryArray, ...keywordArray]));
            browser.tabs.sendMessage(tab.id, {
              type: "REPLACE_TEXT",
              newText: rewrittenText,
              enableConfetti: errorState ? false : confettiAnimation
            });
          } catch (error) {
            console.error("Error: ", error);
            alert("Error: " + error);
          }
          browser.tabs.sendMessage(tab.id, { type: "CHANGE_CURSOR", state: "default" });
        } else {
          const promptText = [
            {
              role: "system",
              content: "You are a helpful assistant that reformats text for simplicity by extracting complex keywords with explanations."
            },
            {
              role: "user",
              content: `Provide a JSON output containing all the obscure and difficult words or phrases from the following text, with their simplified meaning and grammatical type. Please limit the simplified meaning to 5 - 7 words only, and ensure that the meaning is easy to understand and in line with the context of the sentence.

Here is the text:
\`${selectedText}\`
The following is the expected output JSON structure:
\`\`\`
{
   "keywords":[
      {
         "keyword":"keyword or phrase",
         "type":"grammatical type",
         "meaning":"simplified meaning using simple words in ${locale.toUpperCase()} language"
}
   ]
}
\`\`\`
Only output JSON. Do NOT output any other format.`
            }
          ];
          let keywordArray = [];
          browser.tabs.sendMessage(tab.id, { type: "CHANGE_CURSOR", state: "waiting" });
          try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
              },
              body: JSON.stringify({
                "model": "gpt-4o-mini",
                "messages": promptText
              })
            });
            console.warn(response);
            const data = await response.json();
            console.warn(data);
            const result2 = (_d = (_c = data.choices[0]) == null ? void 0 : _c.message) == null ? void 0 : _d.content;
            const cleanedResult = result2.replace(/```json|```/g, "").trim();
            const resultJson = JSON.parse(cleanedResult);
            keywordArray = resultJson.keywords;
          } catch (error) {
            console.error("Error: ", error);
            selectedText.replace(/^[.,\s]+|[.,\s]+$/g, "");
            keywordArray = [
              {
                "keyword": "ERROR",
                "type": "error",
                "meaning": `Error: ${error}`
              }
            ];
            errorState = true;
          }
          browser.tabs.sendMessage(tab.id, { type: "CHANGE_CURSOR", state: "default" });
          browser.tabs.sendMessage(tab.id, {
            type: "NOREPLACE_TEXT",
            keywordArrayString: JSON.stringify(keywordArray),
            enableConfetti: errorState ? false : confettiAnimation
          });
        }
        errorState = false;
      }
    });
  });
  background;
  function initPlugins() {
  }
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  let ws;
  function getDevServerWebSocket() {
    if (ws == null) {
      const serverUrl = `${"ws:"}//${"localhost"}:${3e3}`;
      logger.debug("Connecting to dev server @", serverUrl);
      ws = new WebSocket(serverUrl, "vite-hmr");
      ws.addWxtEventListener = ws.addEventListener.bind(ws);
      ws.sendCustom = (event, payload) => ws == null ? void 0 : ws.send(JSON.stringify({ type: "custom", event, payload }));
      ws.addEventListener("open", () => {
        logger.debug("Connected to dev server");
      });
      ws.addEventListener("close", () => {
        logger.debug("Disconnected from dev server");
      });
      ws.addEventListener("error", (event) => {
        logger.error("Failed to connect to dev server", event);
      });
      ws.addEventListener("message", (e) => {
        try {
          const message = JSON.parse(e.data);
          if (message.type === "custom") {
            ws == null ? void 0 : ws.dispatchEvent(
              new CustomEvent(message.event, { detail: message.data })
            );
          }
        } catch (err) {
          logger.error("Failed to handle message", err);
        }
      });
    }
    return ws;
  }
  function keepServiceWorkerAlive() {
    setInterval(async () => {
      await browser.runtime.getPlatformInfo();
    }, 5e3);
  }
  function reloadContentScript(payload) {
    const manifest = browser.runtime.getManifest();
    if (manifest.manifest_version == 2) {
      void reloadContentScriptMv2();
    } else {
      void reloadContentScriptMv3(payload);
    }
  }
  async function reloadContentScriptMv3({
    registration,
    contentScript
  }) {
    if (registration === "runtime") {
      await reloadRuntimeContentScriptMv3(contentScript);
    } else {
      await reloadManifestContentScriptMv3(contentScript);
    }
  }
  async function reloadManifestContentScriptMv3(contentScript) {
    const id = `wxt:${contentScript.js[0]}`;
    logger.log("Reloading content script:", contentScript);
    const registered = await browser.scripting.getRegisteredContentScripts();
    logger.debug("Existing scripts:", registered);
    const existing = registered.find((cs) => cs.id === id);
    if (existing) {
      logger.debug("Updating content script", existing);
      await browser.scripting.updateContentScripts([{ ...contentScript, id }]);
    } else {
      logger.debug("Registering new content script...");
      await browser.scripting.registerContentScripts([{ ...contentScript, id }]);
    }
    await reloadTabsForContentScript(contentScript);
  }
  async function reloadRuntimeContentScriptMv3(contentScript) {
    logger.log("Reloading content script:", contentScript);
    const registered = await browser.scripting.getRegisteredContentScripts();
    logger.debug("Existing scripts:", registered);
    const matches = registered.filter((cs) => {
      var _a, _b;
      const hasJs = (_a = contentScript.js) == null ? void 0 : _a.find((js) => {
        var _a2;
        return (_a2 = cs.js) == null ? void 0 : _a2.includes(js);
      });
      const hasCss = (_b = contentScript.css) == null ? void 0 : _b.find((css) => {
        var _a2;
        return (_a2 = cs.css) == null ? void 0 : _a2.includes(css);
      });
      return hasJs || hasCss;
    });
    if (matches.length === 0) {
      logger.log(
        "Content script is not registered yet, nothing to reload",
        contentScript
      );
      return;
    }
    await browser.scripting.updateContentScripts(matches);
    await reloadTabsForContentScript(contentScript);
  }
  async function reloadTabsForContentScript(contentScript) {
    const allTabs = await browser.tabs.query({});
    const matchPatterns = contentScript.matches.map(
      (match) => new MatchPattern(match)
    );
    const matchingTabs = allTabs.filter((tab) => {
      const url = tab.url;
      if (!url)
        return false;
      return !!matchPatterns.find((pattern) => pattern.includes(url));
    });
    await Promise.all(
      matchingTabs.map(async (tab) => {
        try {
          await browser.tabs.reload(tab.id);
        } catch (err) {
          logger.warn("Failed to reload tab:", err);
        }
      })
    );
  }
  async function reloadContentScriptMv2(_payload) {
    throw Error("TODO: reloadContentScriptMv2");
  }
  {
    try {
      const ws2 = getDevServerWebSocket();
      ws2.addWxtEventListener("wxt:reload-extension", () => {
        browser.runtime.reload();
      });
      ws2.addWxtEventListener("wxt:reload-content-script", (event) => {
        reloadContentScript(event.detail);
      });
      if (true) {
        ws2.addEventListener(
          "open",
          () => ws2.sendCustom("wxt:background-initialized")
        );
        keepServiceWorkerAlive();
      }
    } catch (err) {
      logger.error("Failed to setup web socket connection with dev server", err);
    }
    browser.commands.onCommand.addListener((command) => {
      if (command === "wxt:reload-extension") {
        browser.runtime.reload();
      }
    });
  }
  let result;
  try {
    initPlugins();
    result = definition.main();
    if (result instanceof Promise) {
      console.warn(
        "The background's main() function return a promise, but it must be synchronous"
      );
    }
  } catch (err) {
    logger.error("The background crashed on startup!");
    throw err;
  }
  const result$1 = result;
  return result$1;
}();
background;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjEzX0B0eXBlcytub2RlQDIyLjUuNF9yb2xsdXBANC4yMS4yL25vZGVfbW9kdWxlcy93eHQvZGlzdC9zYW5kYm94L2RlZmluZS1iYWNrZ3JvdW5kLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9Ad2ViZXh0LWNvcmUrbWF0Y2gtcGF0dGVybnNAMS4wLjMvbm9kZV9tb2R1bGVzL0B3ZWJleHQtY29yZS9tYXRjaC1wYXR0ZXJucy9saWIvaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd2ViZXh0ZW5zaW9uLXBvbHlmaWxsQDAuMTIuMC9ub2RlX21vZHVsZXMvd2ViZXh0ZW5zaW9uLXBvbHlmaWxsL2Rpc3QvYnJvd3Nlci1wb2x5ZmlsbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4xOS4xM19AdHlwZXMrbm9kZUAyMi41LjRfcm9sbHVwQDQuMjEuMi9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvYnJvd3Nlci9pbmRleC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vZGVxdWFsQDIuMC4zL25vZGVfbW9kdWxlcy9kZXF1YWwvbGl0ZS9pbmRleC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMTkuMTNfQHR5cGVzK25vZGVAMjIuNS40X3JvbGx1cEA0LjIxLjIvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3NhbmRib3gvdXRpbHMvbG9nZ2VyLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4xOS4xM19AdHlwZXMrbm9kZUAyMi41LjRfcm9sbHVwQDQuMjEuMi9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvY29yZS91dGlscy9hcnJheXMubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2FzeW5jLW11dGV4QDAuNS4wL25vZGVfbW9kdWxlcy9hc3luYy1tdXRleC9pbmRleC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMTkuMTNfQHR5cGVzK25vZGVAMjIuNS40X3JvbGx1cEA0LjIxLjIvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3N0b3JhZ2UubWpzIiwiLi4vLi4vc3JjL2VudHJ5cG9pbnRzL2JhY2tncm91bmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUJhY2tncm91bmQoYXJnKSB7XG4gIGlmIChhcmcgPT0gbnVsbCB8fCB0eXBlb2YgYXJnID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB7IG1haW46IGFyZyB9O1xuICByZXR1cm4gYXJnO1xufVxuIiwiLy8gc3JjL2luZGV4LnRzXG52YXIgX01hdGNoUGF0dGVybiA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IobWF0Y2hQYXR0ZXJuKSB7XG4gICAgaWYgKG1hdGNoUGF0dGVybiA9PT0gXCI8YWxsX3VybHM+XCIpIHtcbiAgICAgIHRoaXMuaXNBbGxVcmxzID0gdHJ1ZTtcbiAgICAgIHRoaXMucHJvdG9jb2xNYXRjaGVzID0gWy4uLl9NYXRjaFBhdHRlcm4uUFJPVE9DT0xTXTtcbiAgICAgIHRoaXMuaG9zdG5hbWVNYXRjaCA9IFwiKlwiO1xuICAgICAgdGhpcy5wYXRobmFtZU1hdGNoID0gXCIqXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGdyb3VwcyA9IC8oLiopOlxcL1xcLyguKj8pKFxcLy4qKS8uZXhlYyhtYXRjaFBhdHRlcm4pO1xuICAgICAgaWYgKGdyb3VwcyA9PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIFwiSW5jb3JyZWN0IGZvcm1hdFwiKTtcbiAgICAgIGNvbnN0IFtfLCBwcm90b2NvbCwgaG9zdG5hbWUsIHBhdGhuYW1lXSA9IGdyb3VwcztcbiAgICAgIHZhbGlkYXRlUHJvdG9jb2wobWF0Y2hQYXR0ZXJuLCBwcm90b2NvbCk7XG4gICAgICB2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpO1xuICAgICAgdmFsaWRhdGVQYXRobmFtZShtYXRjaFBhdHRlcm4sIHBhdGhuYW1lKTtcbiAgICAgIHRoaXMucHJvdG9jb2xNYXRjaGVzID0gcHJvdG9jb2wgPT09IFwiKlwiID8gW1wiaHR0cFwiLCBcImh0dHBzXCJdIDogW3Byb3RvY29sXTtcbiAgICAgIHRoaXMuaG9zdG5hbWVNYXRjaCA9IGhvc3RuYW1lO1xuICAgICAgdGhpcy5wYXRobmFtZU1hdGNoID0gcGF0aG5hbWU7XG4gICAgfVxuICB9XG4gIGluY2x1ZGVzKHVybCkge1xuICAgIGlmICh0aGlzLmlzQWxsVXJscylcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHUgPSB0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiID8gbmV3IFVSTCh1cmwpIDogdXJsIGluc3RhbmNlb2YgTG9jYXRpb24gPyBuZXcgVVJMKHVybC5ocmVmKSA6IHVybDtcbiAgICByZXR1cm4gISF0aGlzLnByb3RvY29sTWF0Y2hlcy5maW5kKChwcm90b2NvbCkgPT4ge1xuICAgICAgaWYgKHByb3RvY29sID09PSBcImh0dHBcIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNIdHRwTWF0Y2godSk7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwiaHR0cHNcIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNIdHRwc01hdGNoKHUpO1xuICAgICAgaWYgKHByb3RvY29sID09PSBcImZpbGVcIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNGaWxlTWF0Y2godSk7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwiZnRwXCIpXG4gICAgICAgIHJldHVybiB0aGlzLmlzRnRwTWF0Y2godSk7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwidXJuXCIpXG4gICAgICAgIHJldHVybiB0aGlzLmlzVXJuTWF0Y2godSk7XG4gICAgfSk7XG4gIH1cbiAgaXNIdHRwTWF0Y2godXJsKSB7XG4gICAgcmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJodHRwOlwiICYmIHRoaXMuaXNIb3N0UGF0aE1hdGNoKHVybCk7XG4gIH1cbiAgaXNIdHRwc01hdGNoKHVybCkge1xuICAgIHJldHVybiB1cmwucHJvdG9jb2wgPT09IFwiaHR0cHM6XCIgJiYgdGhpcy5pc0hvc3RQYXRoTWF0Y2godXJsKTtcbiAgfVxuICBpc0hvc3RQYXRoTWF0Y2godXJsKSB7XG4gICAgaWYgKCF0aGlzLmhvc3RuYW1lTWF0Y2ggfHwgIXRoaXMucGF0aG5hbWVNYXRjaClcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBob3N0bmFtZU1hdGNoUmVnZXhzID0gW1xuICAgICAgdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5ob3N0bmFtZU1hdGNoKSxcbiAgICAgIHRoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMuaG9zdG5hbWVNYXRjaC5yZXBsYWNlKC9eXFwqXFwuLywgXCJcIikpXG4gICAgXTtcbiAgICBjb25zdCBwYXRobmFtZU1hdGNoUmVnZXggPSB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLnBhdGhuYW1lTWF0Y2gpO1xuICAgIHJldHVybiAhIWhvc3RuYW1lTWF0Y2hSZWdleHMuZmluZCgocmVnZXgpID0+IHJlZ2V4LnRlc3QodXJsLmhvc3RuYW1lKSkgJiYgcGF0aG5hbWVNYXRjaFJlZ2V4LnRlc3QodXJsLnBhdGhuYW1lKTtcbiAgfVxuICBpc0ZpbGVNYXRjaCh1cmwpIHtcbiAgICB0aHJvdyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZDogZmlsZTovLyBwYXR0ZXJuIG1hdGNoaW5nLiBPcGVuIGEgUFIgdG8gYWRkIHN1cHBvcnRcIik7XG4gIH1cbiAgaXNGdHBNYXRjaCh1cmwpIHtcbiAgICB0aHJvdyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZDogZnRwOi8vIHBhdHRlcm4gbWF0Y2hpbmcuIE9wZW4gYSBQUiB0byBhZGQgc3VwcG9ydFwiKTtcbiAgfVxuICBpc1Vybk1hdGNoKHVybCkge1xuICAgIHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiB1cm46Ly8gcGF0dGVybiBtYXRjaGluZy4gT3BlbiBhIFBSIHRvIGFkZCBzdXBwb3J0XCIpO1xuICB9XG4gIGNvbnZlcnRQYXR0ZXJuVG9SZWdleChwYXR0ZXJuKSB7XG4gICAgY29uc3QgZXNjYXBlZCA9IHRoaXMuZXNjYXBlRm9yUmVnZXgocGF0dGVybik7XG4gICAgY29uc3Qgc3RhcnNSZXBsYWNlZCA9IGVzY2FwZWQucmVwbGFjZSgvXFxcXFxcKi9nLCBcIi4qXCIpO1xuICAgIHJldHVybiBSZWdFeHAoYF4ke3N0YXJzUmVwbGFjZWR9JGApO1xuICB9XG4gIGVzY2FwZUZvclJlZ2V4KHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xuICB9XG59O1xudmFyIE1hdGNoUGF0dGVybiA9IF9NYXRjaFBhdHRlcm47XG5NYXRjaFBhdHRlcm4uUFJPVE9DT0xTID0gW1wiaHR0cFwiLCBcImh0dHBzXCIsIFwiZmlsZVwiLCBcImZ0cFwiLCBcInVyblwiXTtcbnZhciBJbnZhbGlkTWF0Y2hQYXR0ZXJuID0gY2xhc3MgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1hdGNoUGF0dGVybiwgcmVhc29uKSB7XG4gICAgc3VwZXIoYEludmFsaWQgbWF0Y2ggcGF0dGVybiBcIiR7bWF0Y2hQYXR0ZXJufVwiOiAke3JlYXNvbn1gKTtcbiAgfVxufTtcbmZ1bmN0aW9uIHZhbGlkYXRlUHJvdG9jb2wobWF0Y2hQYXR0ZXJuLCBwcm90b2NvbCkge1xuICBpZiAoIU1hdGNoUGF0dGVybi5QUk9UT0NPTFMuaW5jbHVkZXMocHJvdG9jb2wpICYmIHByb3RvY29sICE9PSBcIipcIilcbiAgICB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihcbiAgICAgIG1hdGNoUGF0dGVybixcbiAgICAgIGAke3Byb3RvY29sfSBub3QgYSB2YWxpZCBwcm90b2NvbCAoJHtNYXRjaFBhdHRlcm4uUFJPVE9DT0xTLmpvaW4oXCIsIFwiKX0pYFxuICAgICk7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpIHtcbiAgaWYgKGhvc3RuYW1lLmluY2x1ZGVzKFwiOlwiKSlcbiAgICB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIGBIb3N0bmFtZSBjYW5ub3QgaW5jbHVkZSBhIHBvcnRgKTtcbiAgaWYgKGhvc3RuYW1lLmluY2x1ZGVzKFwiKlwiKSAmJiBob3N0bmFtZS5sZW5ndGggPiAxICYmICFob3N0bmFtZS5zdGFydHNXaXRoKFwiKi5cIikpXG4gICAgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4oXG4gICAgICBtYXRjaFBhdHRlcm4sXG4gICAgICBgSWYgdXNpbmcgYSB3aWxkY2FyZCAoKiksIGl0IG11c3QgZ28gYXQgdGhlIHN0YXJ0IG9mIHRoZSBob3N0bmFtZWBcbiAgICApO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVQYXRobmFtZShtYXRjaFBhdHRlcm4sIHBhdGhuYW1lKSB7XG4gIHJldHVybjtcbn1cbmV4cG9ydCB7XG4gIEludmFsaWRNYXRjaFBhdHRlcm4sXG4gIE1hdGNoUGF0dGVyblxufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiLCBbXCJtb2R1bGVcIl0sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgZmFjdG9yeShtb2R1bGUpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtb2QgPSB7XG4gICAgICBleHBvcnRzOiB7fVxuICAgIH07XG4gICAgZmFjdG9yeShtb2QpO1xuICAgIGdsb2JhbC5icm93c2VyID0gbW9kLmV4cG9ydHM7XG4gIH1cbn0pKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsVGhpcyA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgLyogd2ViZXh0ZW5zaW9uLXBvbHlmaWxsIC0gdjAuMTIuMCAtIFR1ZSBNYXkgMTQgMjAyNCAxODowMToyOSAqL1xuICAvKiAtKi0gTW9kZTogaW5kZW50LXRhYnMtbW9kZTogbmlsOyBqcy1pbmRlbnQtbGV2ZWw6IDIgLSotICovXG4gIC8qIHZpbTogc2V0IHN0cz0yIHN3PTIgZXQgdHc9ODA6ICovXG4gIC8qIFRoaXMgU291cmNlIENvZGUgRm9ybSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBvZiB0aGUgTW96aWxsYSBQdWJsaWNcbiAgICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICAgKiBmaWxlLCBZb3UgY2FuIG9idGFpbiBvbmUgYXQgaHR0cDovL21vemlsbGEub3JnL01QTC8yLjAvLiAqL1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBpZiAoIShnbG9iYWxUaGlzLmNocm9tZSAmJiBnbG9iYWxUaGlzLmNocm9tZS5ydW50aW1lICYmIGdsb2JhbFRoaXMuY2hyb21lLnJ1bnRpbWUuaWQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBzY3JpcHQgc2hvdWxkIG9ubHkgYmUgbG9hZGVkIGluIGEgYnJvd3NlciBleHRlbnNpb24uXCIpO1xuICB9XG4gIGlmICghKGdsb2JhbFRoaXMuYnJvd3NlciAmJiBnbG9iYWxUaGlzLmJyb3dzZXIucnVudGltZSAmJiBnbG9iYWxUaGlzLmJyb3dzZXIucnVudGltZS5pZCkpIHtcbiAgICBjb25zdCBDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UgPSBcIlRoZSBtZXNzYWdlIHBvcnQgY2xvc2VkIGJlZm9yZSBhIHJlc3BvbnNlIHdhcyByZWNlaXZlZC5cIjtcblxuICAgIC8vIFdyYXBwaW5nIHRoZSBidWxrIG9mIHRoaXMgcG9seWZpbGwgaW4gYSBvbmUtdGltZS11c2UgZnVuY3Rpb24gaXMgYSBtaW5vclxuICAgIC8vIG9wdGltaXphdGlvbiBmb3IgRmlyZWZveC4gU2luY2UgU3BpZGVybW9ua2V5IGRvZXMgbm90IGZ1bGx5IHBhcnNlIHRoZVxuICAgIC8vIGNvbnRlbnRzIG9mIGEgZnVuY3Rpb24gdW50aWwgdGhlIGZpcnN0IHRpbWUgaXQncyBjYWxsZWQsIGFuZCBzaW5jZSBpdCB3aWxsXG4gICAgLy8gbmV2ZXIgYWN0dWFsbHkgbmVlZCB0byBiZSBjYWxsZWQsIHRoaXMgYWxsb3dzIHRoZSBwb2x5ZmlsbCB0byBiZSBpbmNsdWRlZFxuICAgIC8vIGluIEZpcmVmb3ggbmVhcmx5IGZvciBmcmVlLlxuICAgIGNvbnN0IHdyYXBBUElzID0gZXh0ZW5zaW9uQVBJcyA9PiB7XG4gICAgICAvLyBOT1RFOiBhcGlNZXRhZGF0YSBpcyBhc3NvY2lhdGVkIHRvIHRoZSBjb250ZW50IG9mIHRoZSBhcGktbWV0YWRhdGEuanNvbiBmaWxlXG4gICAgICAvLyBhdCBidWlsZCB0aW1lIGJ5IHJlcGxhY2luZyB0aGUgZm9sbG93aW5nIFwiaW5jbHVkZVwiIHdpdGggdGhlIGNvbnRlbnQgb2YgdGhlXG4gICAgICAvLyBKU09OIGZpbGUuXG4gICAgICBjb25zdCBhcGlNZXRhZGF0YSA9IHtcbiAgICAgICAgXCJhbGFybXNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjbGVhckFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImJvb2ttYXJrc1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDaGlsZHJlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFJlY2VudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFN1YlRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJicm93c2VyQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImRpc2FibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlbmFibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGVuUG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEljb25cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYnJvd3NpbmdEYXRhXCI6IHtcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUNhY2hlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQ29va2llc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZURvd25sb2Fkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUZvcm1EYXRhXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlSGlzdG9yeVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUxvY2FsU3RvcmFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBhc3N3b3Jkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBsdWdpbkRhdGFcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbW1hbmRzXCI6IHtcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbnRleHRNZW51c1wiOiB7XG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb29raWVzXCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbENvb2tpZVN0b3Jlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRldnRvb2xzXCI6IHtcbiAgICAgICAgICBcImluc3BlY3RlZFdpbmRvd1wiOiB7XG4gICAgICAgICAgICBcImV2YWxcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDIsXG4gICAgICAgICAgICAgIFwic2luZ2xlQ2FsbGJhY2tBcmdcIjogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicGFuZWxzXCI6IHtcbiAgICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDMsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzLFxuICAgICAgICAgICAgICBcInNpbmdsZUNhbGxiYWNrQXJnXCI6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVsZW1lbnRzXCI6IHtcbiAgICAgICAgICAgICAgXCJjcmVhdGVTaWRlYmFyUGFuZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkb3dubG9hZHNcIjoge1xuICAgICAgICAgIFwiY2FuY2VsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZG93bmxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlcmFzZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZpbGVJY29uXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3BlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInBhdXNlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlRmlsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlc3VtZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNob3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJleHRlbnNpb25cIjoge1xuICAgICAgICAgIFwiaXNBbGxvd2VkRmlsZVNjaGVtZUFjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImlzQWxsb3dlZEluY29nbml0b0FjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImhpc3RvcnlcIjoge1xuICAgICAgICAgIFwiYWRkVXJsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlQWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlUmFuZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZWxldGVVcmxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRWaXNpdHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpMThuXCI6IHtcbiAgICAgICAgICBcImRldGVjdExhbmd1YWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWNjZXB0TGFuZ3VhZ2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaWRlbnRpdHlcIjoge1xuICAgICAgICAgIFwibGF1bmNoV2ViQXV0aEZsb3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpZGxlXCI6IHtcbiAgICAgICAgICBcInF1ZXJ5U3RhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJtYW5hZ2VtZW50XCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFNlbGZcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRFbmFibGVkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidW5pbnN0YWxsU2VsZlwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIm5vdGlmaWNhdGlvbnNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQZXJtaXNzaW9uTGV2ZWxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJwYWdlQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0SWNvblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicGVybWlzc2lvbnNcIjoge1xuICAgICAgICAgIFwiY29udGFpbnNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXF1ZXN0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicnVudGltZVwiOiB7XG4gICAgICAgICAgXCJnZXRCYWNrZ3JvdW5kUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBsYXRmb3JtSW5mb1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wZW5PcHRpb25zUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlcXVlc3RVcGRhdGVDaGVja1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlbmRNZXNzYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VuZE5hdGl2ZU1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRVbmluc3RhbGxVUkxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXNzaW9uc1wiOiB7XG4gICAgICAgICAgXCJnZXREZXZpY2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UmVjZW50bHlDbG9zZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXN0b3JlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic3RvcmFnZVwiOiB7XG4gICAgICAgICAgXCJsb2NhbFwiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm1hbmFnZWRcIjoge1xuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic3luY1wiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInRhYnNcIjoge1xuICAgICAgICAgIFwiY2FwdHVyZVZpc2libGVUYWJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZXRlY3RMYW5ndWFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRpc2NhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkdXBsaWNhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJleGVjdXRlU2NyaXB0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q3VycmVudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0JhY2tcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0ZvcndhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWdobGlnaHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJpbnNlcnRDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicXVlcnlcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZWxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZW5kTWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0b3BTaXRlc1wiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ3ZWJOYXZpZ2F0aW9uXCI6IHtcbiAgICAgICAgICBcImdldEFsbEZyYW1lc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZyYW1lXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2ViUmVxdWVzdFwiOiB7XG4gICAgICAgICAgXCJoYW5kbGVyQmVoYXZpb3JDaGFuZ2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2luZG93c1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDdXJyZW50XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0TGFzdEZvY3VzZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmIChPYmplY3Qua2V5cyhhcGlNZXRhZGF0YSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImFwaS1tZXRhZGF0YS5qc29uIGhhcyBub3QgYmVlbiBpbmNsdWRlZCBpbiBicm93c2VyLXBvbHlmaWxsXCIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEEgV2Vha01hcCBzdWJjbGFzcyB3aGljaCBjcmVhdGVzIGFuZCBzdG9yZXMgYSB2YWx1ZSBmb3IgYW55IGtleSB3aGljaCBkb2VzXG4gICAgICAgKiBub3QgZXhpc3Qgd2hlbiBhY2Nlc3NlZCwgYnV0IGJlaGF2ZXMgZXhhY3RseSBhcyBhbiBvcmRpbmFyeSBXZWFrTWFwXG4gICAgICAgKiBvdGhlcndpc2UuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY3JlYXRlSXRlbVxuICAgICAgICogICAgICAgIEEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSB2YWx1ZSBmb3IgYW55XG4gICAgICAgKiAgICAgICAga2V5IHdoaWNoIGRvZXMgbm90IGV4aXN0LCB0aGUgZmlyc3QgdGltZSBpdCBpcyBhY2Nlc3NlZC4gVGhlXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gcmVjZWl2ZXMsIGFzIGl0cyBvbmx5IGFyZ3VtZW50LCB0aGUga2V5IGJlaW5nIGNyZWF0ZWQuXG4gICAgICAgKi9cbiAgICAgIGNsYXNzIERlZmF1bHRXZWFrTWFwIGV4dGVuZHMgV2Vha01hcCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKGNyZWF0ZUl0ZW0sIGl0ZW1zID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc3VwZXIoaXRlbXMpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlSXRlbSA9IGNyZWF0ZUl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgZ2V0KGtleSkge1xuICAgICAgICAgIGlmICghdGhpcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCB0aGlzLmNyZWF0ZUl0ZW0oa2V5KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBzdXBlci5nZXQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuIG9iamVjdCB3aXRoIGEgYHRoZW5gIG1ldGhvZCwgYW5kIGNhblxuICAgICAgICogdGhlcmVmb3JlIGJlIGFzc3VtZWQgdG8gYmVoYXZlIGFzIGEgUHJvbWlzZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0LlxuICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHRoZW5hYmxlLlxuICAgICAgICovXG4gICAgICBjb25zdCBpc1RoZW5hYmxlID0gdmFsdWUgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSBcImZ1bmN0aW9uXCI7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB3aGljaCwgd2hlbiBjYWxsZWQsIHdpbGwgcmVzb2x2ZSBvciByZWplY3RcbiAgICAgICAqIHRoZSBnaXZlbiBwcm9taXNlIGJhc2VkIG9uIGhvdyBpdCBpcyBjYWxsZWQ6XG4gICAgICAgKlxuICAgICAgICogLSBJZiwgd2hlbiBjYWxsZWQsIGBjaHJvbWUucnVudGltZS5sYXN0RXJyb3JgIGNvbnRhaW5zIGEgbm9uLW51bGwgb2JqZWN0LFxuICAgICAgICogICB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCB3aXRoIHRoYXQgdmFsdWUuXG4gICAgICAgKiAtIElmIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBleGFjdGx5IG9uZSBhcmd1bWVudCwgdGhlIHByb21pc2UgaXNcbiAgICAgICAqICAgcmVzb2x2ZWQgdG8gdGhhdCB2YWx1ZS5cbiAgICAgICAqIC0gT3RoZXJ3aXNlLCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB0byBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGVcbiAgICAgICAqICAgZnVuY3Rpb24ncyBhcmd1bWVudHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHByb21pc2VcbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgcmVzb2x1dGlvbiBhbmQgcmVqZWN0aW9uIGZ1bmN0aW9ucyBvZiBhXG4gICAgICAgKiAgICAgICAgcHJvbWlzZS5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVzb2x2ZVxuICAgICAgICogICAgICAgIFRoZSBwcm9taXNlJ3MgcmVzb2x1dGlvbiBmdW5jdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVqZWN0XG4gICAgICAgKiAgICAgICAgVGhlIHByb21pc2UncyByZWplY3Rpb24gZnVuY3Rpb24uXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgd3JhcHBlZCBtZXRob2Qgd2hpY2ggaGFzIGNyZWF0ZWQgdGhlIGNhbGxiYWNrLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZ1xuICAgICAgICogICAgICAgIFdoZXRoZXIgb3Igbm90IHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggb25seSB0aGUgZmlyc3RcbiAgICAgICAqICAgICAgICBhcmd1bWVudCBvZiB0aGUgY2FsbGJhY2ssIGFsdGVybmF0aXZlbHkgYW4gYXJyYXkgb2YgYWxsIHRoZVxuICAgICAgICogICAgICAgIGNhbGxiYWNrIGFyZ3VtZW50cyBpcyByZXNvbHZlZC4gQnkgZGVmYXVsdCwgaWYgdGhlIGNhbGxiYWNrXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gaXMgaW52b2tlZCB3aXRoIG9ubHkgYSBzaW5nbGUgYXJndW1lbnQsIHRoYXQgd2lsbCBiZVxuICAgICAgICogICAgICAgIHJlc29sdmVkIHRvIHRoZSBwcm9taXNlLCB3aGlsZSBhbGwgYXJndW1lbnRzIHdpbGwgYmUgcmVzb2x2ZWQgYXNcbiAgICAgICAqICAgICAgICBhbiBhcnJheSBpZiBtdWx0aXBsZSBhcmUgZ2l2ZW4uXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge2Z1bmN0aW9ufVxuICAgICAgICogICAgICAgIFRoZSBnZW5lcmF0ZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IG1ha2VDYWxsYmFjayA9IChwcm9taXNlLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gKC4uLmNhbGxiYWNrQXJncykgPT4ge1xuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdChuZXcgRXJyb3IoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZyB8fCBjYWxsYmFja0FyZ3MubGVuZ3RoIDw9IDEgJiYgbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlc29sdmUoY2FsbGJhY2tBcmdzWzBdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrQXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHBsdXJhbGl6ZUFyZ3VtZW50cyA9IG51bUFyZ3MgPT4gbnVtQXJncyA9PSAxID8gXCJhcmd1bWVudFwiIDogXCJhcmd1bWVudHNcIjtcblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgd3JhcHBlciBmdW5jdGlvbiBmb3IgYSBtZXRob2Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgbWV0YWRhdGEuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgICAqICAgICAgICBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHdoaWNoIGlzIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgbWV0aG9kIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IG1ldGFkYXRhLm1pbkFyZ3NcbiAgICAgICAqICAgICAgICBUaGUgbWluaW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG11c3QgYmUgcGFzc2VkIHRvIHRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uLiBJZiBjYWxsZWQgd2l0aCBmZXdlciB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWF4QXJnc1xuICAgICAgICogICAgICAgIFRoZSBtYXhpbXVtIG51bWJlciBvZiBhcmd1bWVudHMgd2hpY2ggbWF5IGJlIHBhc3NlZCB0byB0aGVcbiAgICAgICAqICAgICAgICBmdW5jdGlvbi4gSWYgY2FsbGVkIHdpdGggbW9yZSB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmdcbiAgICAgICAqICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIG9ubHkgdGhlIGZpcnN0XG4gICAgICAgKiAgICAgICAgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrLCBhbHRlcm5hdGl2ZWx5IGFuIGFycmF5IG9mIGFsbCB0aGVcbiAgICAgICAqICAgICAgICBjYWxsYmFjayBhcmd1bWVudHMgaXMgcmVzb2x2ZWQuIEJ5IGRlZmF1bHQsIGlmIHRoZSBjYWxsYmFja1xuICAgICAgICogICAgICAgIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGF0IHdpbGwgYmVcbiAgICAgICAqICAgICAgICByZXNvbHZlZCB0byB0aGUgcHJvbWlzZSwgd2hpbGUgYWxsIGFyZ3VtZW50cyB3aWxsIGJlIHJlc29sdmVkIGFzXG4gICAgICAgKiAgICAgICAgYW4gYXJyYXkgaWYgbXVsdGlwbGUgYXJlIGdpdmVuLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbihvYmplY3QsIC4uLiopfVxuICAgICAgICogICAgICAgVGhlIGdlbmVyYXRlZCB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgICAgICovXG4gICAgICBjb25zdCB3cmFwQXN5bmNGdW5jdGlvbiA9IChuYW1lLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gYXN5bmNGdW5jdGlvbldyYXBwZXIodGFyZ2V0LCAuLi5hcmdzKSB7XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDwgbWV0YWRhdGEubWluQXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBsZWFzdCAke21ldGFkYXRhLm1pbkFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1pbkFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gbWV0YWRhdGEubWF4QXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBtb3N0ICR7bWV0YWRhdGEubWF4QXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWF4QXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1ldGFkYXRhLmZhbGxiYWNrVG9Ob0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgQVBJIG1ldGhvZCBoYXMgY3VycmVudGx5IG5vIGNhbGxiYWNrIG9uIENocm9tZSwgYnV0IGl0IHJldHVybiBhIHByb21pc2Ugb24gRmlyZWZveCxcbiAgICAgICAgICAgICAgLy8gYW5kIHNvIHRoZSBwb2x5ZmlsbCB3aWxsIHRyeSB0byBjYWxsIGl0IHdpdGggYSBjYWxsYmFjayBmaXJzdCwgYW5kIGl0IHdpbGwgZmFsbGJhY2tcbiAgICAgICAgICAgICAgLy8gdG8gbm90IHBhc3NpbmcgdGhlIGNhbGxiYWNrIGlmIHRoZSBmaXJzdCBjYWxsIGZhaWxzLlxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzLCBtYWtlQ2FsbGJhY2soe1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgICAgICAgIH0sIG1ldGFkYXRhKSk7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGNiRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7bmFtZX0gQVBJIG1ldGhvZCBkb2Vzbid0IHNlZW0gdG8gc3VwcG9ydCB0aGUgY2FsbGJhY2sgcGFyYW1ldGVyLCBgICsgXCJmYWxsaW5nIGJhY2sgdG8gY2FsbCBpdCB3aXRob3V0IGEgY2FsbGJhY2s6IFwiLCBjYkVycm9yKTtcbiAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncyk7XG5cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIEFQSSBtZXRob2QgbWV0YWRhdGEsIHNvIHRoYXQgdGhlIG5leHQgQVBJIGNhbGxzIHdpbGwgbm90IHRyeSB0b1xuICAgICAgICAgICAgICAgIC8vIHVzZSB0aGUgdW5zdXBwb3J0ZWQgY2FsbGJhY2sgYW55bW9yZS5cbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLm5vQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5ub0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MsIG1ha2VDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICAgfSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgICogV3JhcHMgYW4gZXhpc3RpbmcgbWV0aG9kIG9mIHRoZSB0YXJnZXQgb2JqZWN0LCBzbyB0aGF0IGNhbGxzIHRvIGl0IGFyZVxuICAgICAgICogaW50ZXJjZXB0ZWQgYnkgdGhlIGdpdmVuIHdyYXBwZXIgZnVuY3Rpb24uIFRoZSB3cmFwcGVyIGZ1bmN0aW9uIHJlY2VpdmVzLFxuICAgICAgICogYXMgaXRzIGZpcnN0IGFyZ3VtZW50LCB0aGUgb3JpZ2luYWwgYHRhcmdldGAgb2JqZWN0LCBmb2xsb3dlZCBieSBlYWNoIG9mXG4gICAgICAgKiB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgICAqICAgICAgICBUaGUgb3JpZ2luYWwgdGFyZ2V0IG9iamVjdCB0aGF0IHRoZSB3cmFwcGVkIG1ldGhvZCBiZWxvbmdzIHRvLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbWV0aG9kXG4gICAgICAgKiAgICAgICAgVGhlIG1ldGhvZCBiZWluZyB3cmFwcGVkLiBUaGlzIGlzIHVzZWQgYXMgdGhlIHRhcmdldCBvZiB0aGUgUHJveHlcbiAgICAgICAqICAgICAgICBvYmplY3Qgd2hpY2ggaXMgY3JlYXRlZCB0byB3cmFwIHRoZSBtZXRob2QuXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgVGhlIHdyYXBwZXIgZnVuY3Rpb24gd2hpY2ggaXMgY2FsbGVkIGluIHBsYWNlIG9mIGEgZGlyZWN0IGludm9jYXRpb25cbiAgICAgICAqICAgICAgICBvZiB0aGUgd3JhcHBlZCBtZXRob2QuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PGZ1bmN0aW9uPn1cbiAgICAgICAqICAgICAgICBBIFByb3h5IG9iamVjdCBmb3IgdGhlIGdpdmVuIG1ldGhvZCwgd2hpY2ggaW52b2tlcyB0aGUgZ2l2ZW4gd3JhcHBlclxuICAgICAgICogICAgICAgIG1ldGhvZCBpbiBpdHMgcGxhY2UuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBNZXRob2QgPSAodGFyZ2V0LCBtZXRob2QsIHdyYXBwZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eShtZXRob2QsIHtcbiAgICAgICAgICBhcHBseSh0YXJnZXRNZXRob2QsIHRoaXNPYmosIGFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB3cmFwcGVyLmNhbGwodGhpc09iaiwgdGFyZ2V0LCAuLi5hcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGxldCBoYXNPd25Qcm9wZXJ0eSA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuICAgICAgLyoqXG4gICAgICAgKiBXcmFwcyBhbiBvYmplY3QgaW4gYSBQcm94eSB3aGljaCBpbnRlcmNlcHRzIGFuZCB3cmFwcyBjZXJ0YWluIG1ldGhvZHNcbiAgICAgICAqIGJhc2VkIG9uIHRoZSBnaXZlbiBgd3JhcHBlcnNgIGFuZCBgbWV0YWRhdGFgIG9iamVjdHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldFxuICAgICAgICogICAgICAgIFRoZSB0YXJnZXQgb2JqZWN0IHRvIHdyYXAuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IFt3cmFwcGVycyA9IHt9XVxuICAgICAgICogICAgICAgIEFuIG9iamVjdCB0cmVlIGNvbnRhaW5pbmcgd3JhcHBlciBmdW5jdGlvbnMgZm9yIHNwZWNpYWwgY2FzZXMuIEFueVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uIHByZXNlbnQgaW4gdGhpcyBvYmplY3QgdHJlZSBpcyBjYWxsZWQgaW4gcGxhY2Ugb2YgdGhlXG4gICAgICAgKiAgICAgICAgbWV0aG9kIGluIHRoZSBzYW1lIGxvY2F0aW9uIGluIHRoZSBgdGFyZ2V0YCBvYmplY3QgdHJlZS4gVGhlc2VcbiAgICAgICAqICAgICAgICB3cmFwcGVyIG1ldGhvZHMgYXJlIGludm9rZWQgYXMgZGVzY3JpYmVkIGluIHtAc2VlIHdyYXBNZXRob2R9LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbbWV0YWRhdGEgPSB7fV1cbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgdHJlZSBjb250YWluaW5nIG1ldGFkYXRhIHVzZWQgdG8gYXV0b21hdGljYWxseSBnZW5lcmF0ZVxuICAgICAgICogICAgICAgIFByb21pc2UtYmFzZWQgd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFzeW5jaHJvbm91cy4gQW55IGZ1bmN0aW9uIGluXG4gICAgICAgKiAgICAgICAgdGhlIGB0YXJnZXRgIG9iamVjdCB0cmVlIHdoaWNoIGhhcyBhIGNvcnJlc3BvbmRpbmcgbWV0YWRhdGEgb2JqZWN0XG4gICAgICAgKiAgICAgICAgaW4gdGhlIHNhbWUgbG9jYXRpb24gaW4gdGhlIGBtZXRhZGF0YWAgdHJlZSBpcyByZXBsYWNlZCB3aXRoIGFuXG4gICAgICAgKiAgICAgICAgYXV0b21hdGljYWxseS1nZW5lcmF0ZWQgd3JhcHBlciBmdW5jdGlvbiwgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgKiAgICAgICAge0BzZWUgd3JhcEFzeW5jRnVuY3Rpb259XG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PG9iamVjdD59XG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBPYmplY3QgPSAodGFyZ2V0LCB3cmFwcGVycyA9IHt9LCBtZXRhZGF0YSA9IHt9KSA9PiB7XG4gICAgICAgIGxldCBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGxldCBoYW5kbGVycyA9IHtcbiAgICAgICAgICBoYXMocHJveHlUYXJnZXQsIHByb3ApIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldCB8fCBwcm9wIGluIGNhY2hlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0KHByb3h5VGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgICAgaWYgKHByb3AgaW4gY2FjaGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEocHJvcCBpbiB0YXJnZXQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcF07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCBvbiB0aGUgdW5kZXJseWluZyBvYmplY3QuIENoZWNrIGlmIHdlIG5lZWQgdG8gZG9cbiAgICAgICAgICAgICAgLy8gYW55IHdyYXBwaW5nLlxuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygd3JhcHBlcnNbcHJvcF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBzcGVjaWFsLWNhc2Ugd3JhcHBlciBmb3IgdGhpcyBtZXRob2QuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwTWV0aG9kKHRhcmdldCwgdGFyZ2V0W3Byb3BdLCB3cmFwcGVyc1twcm9wXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBhc3luYyBtZXRob2QgdGhhdCB3ZSBoYXZlIG1ldGFkYXRhIGZvci4gQ3JlYXRlIGFcbiAgICAgICAgICAgICAgICAvLyBQcm9taXNlIHdyYXBwZXIgZm9yIGl0LlxuICAgICAgICAgICAgICAgIGxldCB3cmFwcGVyID0gd3JhcEFzeW5jRnVuY3Rpb24ocHJvcCwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gd3JhcE1ldGhvZCh0YXJnZXQsIHRhcmdldFtwcm9wXSwgd3JhcHBlcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCB0aGF0IHdlIGRvbid0IGtub3cgb3IgY2FyZSBhYm91dC4gUmV0dXJuIHRoZVxuICAgICAgICAgICAgICAgIC8vIG9yaWdpbmFsIG1ldGhvZCwgYm91bmQgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuYmluZCh0YXJnZXQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAoaGFzT3duUHJvcGVydHkod3JhcHBlcnMsIHByb3ApIHx8IGhhc093blByb3BlcnR5KG1ldGFkYXRhLCBwcm9wKSkpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBvYmplY3QgdGhhdCB3ZSBuZWVkIHRvIGRvIHNvbWUgd3JhcHBpbmcgZm9yIHRoZSBjaGlsZHJlblxuICAgICAgICAgICAgICAvLyBvZi4gQ3JlYXRlIGEgc3ViLW9iamVjdCB3cmFwcGVyIGZvciBpdCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBjaGlsZFxuICAgICAgICAgICAgICAvLyBtZXRhZGF0YS5cbiAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwT2JqZWN0KHZhbHVlLCB3cmFwcGVyc1twcm9wXSwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgXCIqXCIpKSB7XG4gICAgICAgICAgICAgIC8vIFdyYXAgYWxsIHByb3BlcnRpZXMgaW4gKiBuYW1lc3BhY2UuXG4gICAgICAgICAgICAgIHZhbHVlID0gd3JhcE9iamVjdCh2YWx1ZSwgd3JhcHBlcnNbcHJvcF0sIG1ldGFkYXRhW1wiKlwiXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGRvIGFueSB3cmFwcGluZyBmb3IgdGhpcyBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgLy8gc28ganVzdCBmb3J3YXJkIGFsbCBhY2Nlc3MgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWNoZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0KHByb3h5VGFyZ2V0LCBwcm9wLCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wIGluIGNhY2hlKSB7XG4gICAgICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVmaW5lUHJvcGVydHkocHJveHlUYXJnZXQsIHByb3AsIGRlc2MpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGNhY2hlLCBwcm9wLCBkZXNjKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlbGV0ZVByb3BlcnR5KHByb3h5VGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShjYWNoZSwgcHJvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFBlciBjb250cmFjdCBvZiB0aGUgUHJveHkgQVBJLCB0aGUgXCJnZXRcIiBwcm94eSBoYW5kbGVyIG11c3QgcmV0dXJuIHRoZVxuICAgICAgICAvLyBvcmlnaW5hbCB2YWx1ZSBvZiB0aGUgdGFyZ2V0IGlmIHRoYXQgdmFsdWUgaXMgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZFxuICAgICAgICAvLyBub24tY29uZmlndXJhYmxlLiBGb3IgdGhpcyByZWFzb24sIHdlIGNyZWF0ZSBhbiBvYmplY3Qgd2l0aCB0aGVcbiAgICAgICAgLy8gcHJvdG90eXBlIHNldCB0byBgdGFyZ2V0YCBpbnN0ZWFkIG9mIHVzaW5nIGB0YXJnZXRgIGRpcmVjdGx5LlxuICAgICAgICAvLyBPdGhlcndpc2Ugd2UgY2Fubm90IHJldHVybiBhIGN1c3RvbSBvYmplY3QgZm9yIEFQSXMgdGhhdFxuICAgICAgICAvLyBhcmUgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZCBub24tY29uZmlndXJhYmxlLCBzdWNoIGFzIGBjaHJvbWUuZGV2dG9vbHNgLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGUgcHJveHkgaGFuZGxlcnMgdGhlbXNlbHZlcyB3aWxsIHN0aWxsIHVzZSB0aGUgb3JpZ2luYWwgYHRhcmdldGBcbiAgICAgICAgLy8gaW5zdGVhZCBvZiB0aGUgYHByb3h5VGFyZ2V0YCwgc28gdGhhdCB0aGUgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBhcmVcbiAgICAgICAgLy8gZGVyZWZlcmVuY2VkIHZpYSB0aGUgb3JpZ2luYWwgdGFyZ2V0cy5cbiAgICAgICAgbGV0IHByb3h5VGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZSh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHByb3h5VGFyZ2V0LCBoYW5kbGVycyk7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYSBzZXQgb2Ygd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFuIGV2ZW50IG9iamVjdCwgd2hpY2ggaGFuZGxlc1xuICAgICAgICogd3JhcHBpbmcgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRoYXQgdGhvc2UgbWVzc2FnZXMgYXJlIHBhc3NlZC5cbiAgICAgICAqXG4gICAgICAgKiBBIHNpbmdsZSB3cmFwcGVyIGlzIGNyZWF0ZWQgZm9yIGVhY2ggbGlzdGVuZXIgZnVuY3Rpb24sIGFuZCBzdG9yZWQgaW4gYVxuICAgICAgICogbWFwLiBTdWJzZXF1ZW50IGNhbGxzIHRvIGBhZGRMaXN0ZW5lcmAsIGBoYXNMaXN0ZW5lcmAsIG9yIGByZW1vdmVMaXN0ZW5lcmBcbiAgICAgICAqIHJldHJpZXZlIHRoZSBvcmlnaW5hbCB3cmFwcGVyLCBzbyB0aGF0ICBhdHRlbXB0cyB0byByZW1vdmUgYVxuICAgICAgICogcHJldmlvdXNseS1hZGRlZCBsaXN0ZW5lciB3b3JrIGFzIGV4cGVjdGVkLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RGVmYXVsdFdlYWtNYXA8ZnVuY3Rpb24sIGZ1bmN0aW9uPn0gd3JhcHBlck1hcFxuICAgICAgICogICAgICAgIEEgRGVmYXVsdFdlYWtNYXAgb2JqZWN0IHdoaWNoIHdpbGwgY3JlYXRlIHRoZSBhcHByb3ByaWF0ZSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgZm9yIGEgZ2l2ZW4gbGlzdGVuZXIgZnVuY3Rpb24gd2hlbiBvbmUgZG9lcyBub3QgZXhpc3QsIGFuZCByZXRyaWV2ZVxuICAgICAgICogICAgICAgIGFuIGV4aXN0aW5nIG9uZSB3aGVuIGl0IGRvZXMuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgICAqL1xuICAgICAgY29uc3Qgd3JhcEV2ZW50ID0gd3JhcHBlck1hcCA9PiAoe1xuICAgICAgICBhZGRMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyLCAuLi5hcmdzKSB7XG4gICAgICAgICAgdGFyZ2V0LmFkZExpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSwgLi4uYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIGhhc0xpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Lmhhc0xpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZUxpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBvblJlcXVlc3RGaW5pc2hlZFdyYXBwZXJzID0gbmV3IERlZmF1bHRXZWFrTWFwKGxpc3RlbmVyID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyYXBzIGFuIG9uUmVxdWVzdEZpbmlzaGVkIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgd2lsbCByZXR1cm4gYVxuICAgICAgICAgKiBgZ2V0Q29udGVudCgpYCBwcm9wZXJ0eSB3aGljaCByZXR1cm5zIGEgYFByb21pc2VgIHJhdGhlciB0aGFuIHVzaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2sgQVBJLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVxXG4gICAgICAgICAqICAgICAgICBUaGUgSEFSIGVudHJ5IG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5ldHdvcmsgcmVxdWVzdC5cbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvblJlcXVlc3RGaW5pc2hlZChyZXEpIHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkUmVxID0gd3JhcE9iamVjdChyZXEsIHt9IC8qIHdyYXBwZXJzICovLCB7XG4gICAgICAgICAgICBnZXRDb250ZW50OiB7XG4gICAgICAgICAgICAgIG1pbkFyZ3M6IDAsXG4gICAgICAgICAgICAgIG1heEFyZ3M6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsaXN0ZW5lcih3cmFwcGVkUmVxKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgb25NZXNzYWdlV3JhcHBlcnMgPSBuZXcgRGVmYXVsdFdlYWtNYXAobGlzdGVuZXIgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcHMgYSBtZXNzYWdlIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgbWF5IHNlbmQgcmVzcG9uc2VzIGJhc2VkIG9uXG4gICAgICAgICAqIGl0cyByZXR1cm4gdmFsdWUsIHJhdGhlciB0aGFuIGJ5IHJldHVybmluZyBhIHNlbnRpbmVsIHZhbHVlIGFuZCBjYWxsaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2suIElmIHRoZSBsaXN0ZW5lciBmdW5jdGlvbiByZXR1cm5zIGEgUHJvbWlzZSwgdGhlIHJlc3BvbnNlIGlzXG4gICAgICAgICAqIHNlbnQgd2hlbiB0aGUgcHJvbWlzZSBlaXRoZXIgcmVzb2x2ZXMgb3IgcmVqZWN0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHsqfSBtZXNzYWdlXG4gICAgICAgICAqICAgICAgICBUaGUgbWVzc2FnZSBzZW50IGJ5IHRoZSBvdGhlciBlbmQgb2YgdGhlIGNoYW5uZWwuXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZW5kZXJcbiAgICAgICAgICogICAgICAgIERldGFpbHMgYWJvdXQgdGhlIHNlbmRlciBvZiB0aGUgbWVzc2FnZS5cbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbigqKX0gc2VuZFJlc3BvbnNlXG4gICAgICAgICAqICAgICAgICBBIGNhbGxiYWNrIHdoaWNoLCB3aGVuIGNhbGxlZCB3aXRoIGFuIGFyYml0cmFyeSBhcmd1bWVudCwgc2VuZHNcbiAgICAgICAgICogICAgICAgIHRoYXQgdmFsdWUgYXMgYSByZXNwb25zZS5cbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqICAgICAgICBUcnVlIGlmIHRoZSB3cmFwcGVkIGxpc3RlbmVyIHJldHVybmVkIGEgUHJvbWlzZSwgd2hpY2ggd2lsbCBsYXRlclxuICAgICAgICAgKiAgICAgICAgeWllbGQgYSByZXNwb25zZS4gRmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG9uTWVzc2FnZShtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgICAgICAgIGxldCBkaWRDYWxsU2VuZFJlc3BvbnNlID0gZmFsc2U7XG4gICAgICAgICAgbGV0IHdyYXBwZWRTZW5kUmVzcG9uc2U7XG4gICAgICAgICAgbGV0IHNlbmRSZXNwb25zZVByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHdyYXBwZWRTZW5kUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgZGlkQ2FsbFNlbmRSZXNwb25zZSA9IHRydWU7XG4gICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHQgPSBsaXN0ZW5lcihtZXNzYWdlLCBzZW5kZXIsIHdyYXBwZWRTZW5kUmVzcG9uc2UpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVzdWx0ID0gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgaXNSZXN1bHRUaGVuYWJsZSA9IHJlc3VsdCAhPT0gdHJ1ZSAmJiBpc1RoZW5hYmxlKHJlc3VsdCk7XG5cbiAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgZGlkbid0IHJldHVybmVkIHRydWUgb3IgYSBQcm9taXNlLCBvciBjYWxsZWRcbiAgICAgICAgICAvLyB3cmFwcGVkU2VuZFJlc3BvbnNlIHN5bmNocm9ub3VzbHksIHdlIGNhbiBleGl0IGVhcmxpZXJcbiAgICAgICAgICAvLyBiZWNhdXNlIHRoZXJlIHdpbGwgYmUgbm8gcmVzcG9uc2Ugc2VudCBmcm9tIHRoaXMgbGlzdGVuZXIuXG4gICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSAmJiAhaXNSZXN1bHRUaGVuYWJsZSAmJiAhZGlkQ2FsbFNlbmRSZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEEgc21hbGwgaGVscGVyIHRvIHNlbmQgdGhlIG1lc3NhZ2UgaWYgdGhlIHByb21pc2UgcmVzb2x2ZXNcbiAgICAgICAgICAvLyBhbmQgYW4gZXJyb3IgaWYgdGhlIHByb21pc2UgcmVqZWN0cyAoYSB3cmFwcGVkIHNlbmRNZXNzYWdlIGhhc1xuICAgICAgICAgIC8vIHRvIHRyYW5zbGF0ZSB0aGUgbWVzc2FnZSBpbnRvIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhIHJlamVjdGVkXG4gICAgICAgICAgLy8gcHJvbWlzZSkuXG4gICAgICAgICAgY29uc3Qgc2VuZFByb21pc2VkUmVzdWx0ID0gcHJvbWlzZSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4obXNnID0+IHtcbiAgICAgICAgICAgICAgLy8gc2VuZCB0aGUgbWVzc2FnZSB2YWx1ZS5cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKG1zZyk7XG4gICAgICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgIC8vIFNlbmQgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvciBpZiB0aGUgcmVqZWN0ZWQgdmFsdWVcbiAgICAgICAgICAgICAgLy8gaXMgYW4gaW5zdGFuY2Ugb2YgZXJyb3IsIG9yIHRoZSBvYmplY3QgaXRzZWxmIG90aGVyd2lzZS5cbiAgICAgICAgICAgICAgbGV0IG1lc3NhZ2U7XG4gICAgICAgICAgICAgIGlmIChlcnJvciAmJiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciB8fCB0eXBlb2YgZXJyb3IubWVzc2FnZSA9PT0gXCJzdHJpbmdcIikpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgICBfX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X186IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgIC8vIFByaW50IGFuIGVycm9yIG9uIHRoZSBjb25zb2xlIGlmIHVuYWJsZSB0byBzZW5kIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBzZW5kIG9uTWVzc2FnZSByZWplY3RlZCByZXBseVwiLCBlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5lZCBhIFByb21pc2UsIHNlbmQgdGhlIHJlc29sdmVkIHZhbHVlIGFzIGFcbiAgICAgICAgICAvLyByZXN1bHQsIG90aGVyd2lzZSB3YWl0IHRoZSBwcm9taXNlIHJlbGF0ZWQgdG8gdGhlIHdyYXBwZWRTZW5kUmVzcG9uc2VcbiAgICAgICAgICAvLyBjYWxsYmFjayB0byByZXNvbHZlIGFuZCBzZW5kIGl0IGFzIGEgcmVzcG9uc2UuXG4gICAgICAgICAgaWYgKGlzUmVzdWx0VGhlbmFibGUpIHtcbiAgICAgICAgICAgIHNlbmRQcm9taXNlZFJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZW5kUHJvbWlzZWRSZXN1bHQoc2VuZFJlc3BvbnNlUHJvbWlzZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTGV0IENocm9tZSBrbm93IHRoYXQgdGhlIGxpc3RlbmVyIGlzIHJlcGx5aW5nLlxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgICBjb25zdCB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjayA9ICh7XG4gICAgICAgIHJlamVjdCxcbiAgICAgICAgcmVzb2x2ZVxuICAgICAgfSwgcmVwbHkpID0+IHtcbiAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAvLyBEZXRlY3Qgd2hlbiBub25lIG9mIHRoZSBsaXN0ZW5lcnMgcmVwbGllZCB0byB0aGUgc2VuZE1lc3NhZ2UgY2FsbCBhbmQgcmVzb2x2ZVxuICAgICAgICAgIC8vIHRoZSBwcm9taXNlIHRvIHVuZGVmaW5lZCBhcyBpbiBGaXJlZm94LlxuICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS93ZWJleHRlbnNpb24tcG9seWZpbGwvaXNzdWVzLzEzMFxuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgPT09IENIUk9NRV9TRU5EX01FU1NBR0VfQ0FMTEJBQ0tfTk9fUkVTUE9OU0VfTUVTU0FHRSkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZXBseSAmJiByZXBseS5fX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X18pIHtcbiAgICAgICAgICAvLyBDb252ZXJ0IGJhY2sgdGhlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGVycm9yIGludG9cbiAgICAgICAgICAvLyBhbiBFcnJvciBpbnN0YW5jZS5cbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKHJlcGx5Lm1lc3NhZ2UpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHdyYXBwZWRTZW5kTWVzc2FnZSA9IChuYW1lLCBtZXRhZGF0YSwgYXBpTmFtZXNwYWNlT2JqLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IG1ldGFkYXRhLm1pbkFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IGxlYXN0ICR7bWV0YWRhdGEubWluQXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWluQXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IG1ldGFkYXRhLm1heEFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IG1vc3QgJHttZXRhZGF0YS5tYXhBcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5tYXhBcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkQ2IgPSB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjay5iaW5kKG51bGwsIHtcbiAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICByZWplY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBhcmdzLnB1c2god3JhcHBlZENiKTtcbiAgICAgICAgICBhcGlOYW1lc3BhY2VPYmouc2VuZE1lc3NhZ2UoLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHN0YXRpY1dyYXBwZXJzID0ge1xuICAgICAgICBkZXZ0b29sczoge1xuICAgICAgICAgIG5ldHdvcms6IHtcbiAgICAgICAgICAgIG9uUmVxdWVzdEZpbmlzaGVkOiB3cmFwRXZlbnQob25SZXF1ZXN0RmluaXNoZWRXcmFwcGVycylcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJ1bnRpbWU6IHtcbiAgICAgICAgICBvbk1lc3NhZ2U6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgb25NZXNzYWdlRXh0ZXJuYWw6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICB0YWJzOiB7XG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMixcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3Qgc2V0dGluZ01ldGFkYXRhID0ge1xuICAgICAgICBjbGVhcjoge1xuICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgbWF4QXJnczogMVxuICAgICAgICB9LFxuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgIG1heEFyZ3M6IDFcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiB7XG4gICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICBtYXhBcmdzOiAxXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBhcGlNZXRhZGF0YS5wcml2YWN5ID0ge1xuICAgICAgICBuZXR3b3JrOiB7XG4gICAgICAgICAgXCIqXCI6IHNldHRpbmdNZXRhZGF0YVxuICAgICAgICB9LFxuICAgICAgICBzZXJ2aWNlczoge1xuICAgICAgICAgIFwiKlwiOiBzZXR0aW5nTWV0YWRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgd2Vic2l0ZXM6IHtcbiAgICAgICAgICBcIipcIjogc2V0dGluZ01ldGFkYXRhXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gd3JhcE9iamVjdChleHRlbnNpb25BUElzLCBzdGF0aWNXcmFwcGVycywgYXBpTWV0YWRhdGEpO1xuICAgIH07XG5cbiAgICAvLyBUaGUgYnVpbGQgcHJvY2VzcyBhZGRzIGEgVU1EIHdyYXBwZXIgYXJvdW5kIHRoaXMgZmlsZSwgd2hpY2ggbWFrZXMgdGhlXG4gICAgLy8gYG1vZHVsZWAgdmFyaWFibGUgYXZhaWxhYmxlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gd3JhcEFQSXMoY2hyb21lKTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbFRoaXMuYnJvd3NlcjtcbiAgfVxufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1icm93c2VyLXBvbHlmaWxsLmpzLm1hcFxuIiwiaW1wb3J0IG9yaWdpbmFsQnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IG9yaWdpbmFsQnJvd3NlcjtcbiIsInZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5leHBvcnQgZnVuY3Rpb24gZGVxdWFsKGZvbywgYmFyKSB7XG5cdHZhciBjdG9yLCBsZW47XG5cdGlmIChmb28gPT09IGJhcikgcmV0dXJuIHRydWU7XG5cblx0aWYgKGZvbyAmJiBiYXIgJiYgKGN0b3I9Zm9vLmNvbnN0cnVjdG9yKSA9PT0gYmFyLmNvbnN0cnVjdG9yKSB7XG5cdFx0aWYgKGN0b3IgPT09IERhdGUpIHJldHVybiBmb28uZ2V0VGltZSgpID09PSBiYXIuZ2V0VGltZSgpO1xuXHRcdGlmIChjdG9yID09PSBSZWdFeHApIHJldHVybiBmb28udG9TdHJpbmcoKSA9PT0gYmFyLnRvU3RyaW5nKCk7XG5cblx0XHRpZiAoY3RvciA9PT0gQXJyYXkpIHtcblx0XHRcdGlmICgobGVuPWZvby5sZW5ndGgpID09PSBiYXIubGVuZ3RoKSB7XG5cdFx0XHRcdHdoaWxlIChsZW4tLSAmJiBkZXF1YWwoZm9vW2xlbl0sIGJhcltsZW5dKSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbGVuID09PSAtMTtcblx0XHR9XG5cblx0XHRpZiAoIWN0b3IgfHwgdHlwZW9mIGZvbyA9PT0gJ29iamVjdCcpIHtcblx0XHRcdGxlbiA9IDA7XG5cdFx0XHRmb3IgKGN0b3IgaW4gZm9vKSB7XG5cdFx0XHRcdGlmIChoYXMuY2FsbChmb28sIGN0b3IpICYmICsrbGVuICYmICFoYXMuY2FsbChiYXIsIGN0b3IpKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdGlmICghKGN0b3IgaW4gYmFyKSB8fCAhZGVxdWFsKGZvb1tjdG9yXSwgYmFyW2N0b3JdKSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIE9iamVjdC5rZXlzKGJhcikubGVuZ3RoID09PSBsZW47XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGZvbyAhPT0gZm9vICYmIGJhciAhPT0gYmFyO1xufVxuIiwiZnVuY3Rpb24gcHJpbnQobWV0aG9kLCAuLi5hcmdzKSB7XG4gIGlmIChpbXBvcnQubWV0YS5lbnYuTU9ERSA9PT0gXCJwcm9kdWN0aW9uXCIpIHJldHVybjtcbiAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSBcInN0cmluZ1wiKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICBtZXRob2QoYFt3eHRdICR7bWVzc2FnZX1gLCAuLi5hcmdzKTtcbiAgfSBlbHNlIHtcbiAgICBtZXRob2QoXCJbd3h0XVwiLCAuLi5hcmdzKTtcbiAgfVxufVxuZXhwb3J0IGNvbnN0IGxvZ2dlciA9IHtcbiAgZGVidWc6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmRlYnVnLCAuLi5hcmdzKSxcbiAgbG9nOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5sb2csIC4uLmFyZ3MpLFxuICB3YXJuOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS53YXJuLCAuLi5hcmdzKSxcbiAgZXJyb3I6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmVycm9yLCAuLi5hcmdzKVxufTtcbiIsImV4cG9ydCBmdW5jdGlvbiBldmVyeShhcnJheSwgcHJlZGljYXRlKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspXG4gICAgaWYgKCFwcmVkaWNhdGUoYXJyYXlbaV0sIGkpKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNvbWUoYXJyYXksIHByZWRpY2F0ZSkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKVxuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaV0sIGkpKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkoYSkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhKSA/IGEgOiBbYV07XG59XG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyVHJ1dGh5KGFycmF5KSB7XG4gIHJldHVybiBhcnJheS5maWx0ZXIoKGl0ZW0pID0+ICEhaXRlbSk7XG59XG4iLCJjb25zdCBFX1RJTUVPVVQgPSBuZXcgRXJyb3IoJ3RpbWVvdXQgd2hpbGUgd2FpdGluZyBmb3IgbXV0ZXggdG8gYmVjb21lIGF2YWlsYWJsZScpO1xuY29uc3QgRV9BTFJFQURZX0xPQ0tFRCA9IG5ldyBFcnJvcignbXV0ZXggYWxyZWFkeSBsb2NrZWQnKTtcbmNvbnN0IEVfQ0FOQ0VMRUQgPSBuZXcgRXJyb3IoJ3JlcXVlc3QgZm9yIGxvY2sgY2FuY2VsZWQnKTtcblxudmFyIF9fYXdhaXRlciQyID0gKHVuZGVmaW5lZCAmJiB1bmRlZmluZWQuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5jbGFzcyBTZW1hcGhvcmUge1xuICAgIGNvbnN0cnVjdG9yKF92YWx1ZSwgX2NhbmNlbEVycm9yID0gRV9DQU5DRUxFRCkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IF92YWx1ZTtcbiAgICAgICAgdGhpcy5fY2FuY2VsRXJyb3IgPSBfY2FuY2VsRXJyb3I7XG4gICAgICAgIHRoaXMuX3F1ZXVlID0gW107XG4gICAgICAgIHRoaXMuX3dlaWdodGVkV2FpdGVycyA9IFtdO1xuICAgIH1cbiAgICBhY3F1aXJlKHdlaWdodCA9IDEsIHByaW9yaXR5ID0gMCkge1xuICAgICAgICBpZiAod2VpZ2h0IDw9IDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgd2VpZ2h0ICR7d2VpZ2h0fTogbXVzdCBiZSBwb3NpdGl2ZWApO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFzayA9IHsgcmVzb2x2ZSwgcmVqZWN0LCB3ZWlnaHQsIHByaW9yaXR5IH07XG4gICAgICAgICAgICBjb25zdCBpID0gZmluZEluZGV4RnJvbUVuZCh0aGlzLl9xdWV1ZSwgKG90aGVyKSA9PiBwcmlvcml0eSA8PSBvdGhlci5wcmlvcml0eSk7XG4gICAgICAgICAgICBpZiAoaSA9PT0gLTEgJiYgd2VpZ2h0IDw9IHRoaXMuX3ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy8gTmVlZHMgaW1tZWRpYXRlIGRpc3BhdGNoLCBza2lwIHRoZSBxdWV1ZVxuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoSXRlbSh0YXNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3F1ZXVlLnNwbGljZShpICsgMSwgMCwgdGFzayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBydW5FeGNsdXNpdmUoY2FsbGJhY2tfMSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyJDIodGhpcywgYXJndW1lbnRzLCB2b2lkIDAsIGZ1bmN0aW9uKiAoY2FsbGJhY2ssIHdlaWdodCA9IDEsIHByaW9yaXR5ID0gMCkge1xuICAgICAgICAgICAgY29uc3QgW3ZhbHVlLCByZWxlYXNlXSA9IHlpZWxkIHRoaXMuYWNxdWlyZSh3ZWlnaHQsIHByaW9yaXR5KTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkIGNhbGxiYWNrKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIHJlbGVhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHdhaXRGb3JVbmxvY2sod2VpZ2h0ID0gMSwgcHJpb3JpdHkgPSAwKSB7XG4gICAgICAgIGlmICh3ZWlnaHQgPD0gMClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgaW52YWxpZCB3ZWlnaHQgJHt3ZWlnaHR9OiBtdXN0IGJlIHBvc2l0aXZlYCk7XG4gICAgICAgIGlmICh0aGlzLl9jb3VsZExvY2tJbW1lZGlhdGVseSh3ZWlnaHQsIHByaW9yaXR5KSkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl93ZWlnaHRlZFdhaXRlcnNbd2VpZ2h0IC0gMV0pXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3dlaWdodGVkV2FpdGVyc1t3ZWlnaHQgLSAxXSA9IFtdO1xuICAgICAgICAgICAgICAgIGluc2VydFNvcnRlZCh0aGlzLl93ZWlnaHRlZFdhaXRlcnNbd2VpZ2h0IC0gMV0sIHsgcmVzb2x2ZSwgcHJpb3JpdHkgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpc0xvY2tlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlIDw9IDA7XG4gICAgfVxuICAgIGdldFZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuICAgIHNldFZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoUXVldWUoKTtcbiAgICB9XG4gICAgcmVsZWFzZSh3ZWlnaHQgPSAxKSB7XG4gICAgICAgIGlmICh3ZWlnaHQgPD0gMClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgaW52YWxpZCB3ZWlnaHQgJHt3ZWlnaHR9OiBtdXN0IGJlIHBvc2l0aXZlYCk7XG4gICAgICAgIHRoaXMuX3ZhbHVlICs9IHdlaWdodDtcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hRdWV1ZSgpO1xuICAgIH1cbiAgICBjYW5jZWwoKSB7XG4gICAgICAgIHRoaXMuX3F1ZXVlLmZvckVhY2goKGVudHJ5KSA9PiBlbnRyeS5yZWplY3QodGhpcy5fY2FuY2VsRXJyb3IpKTtcbiAgICAgICAgdGhpcy5fcXVldWUgPSBbXTtcbiAgICB9XG4gICAgX2Rpc3BhdGNoUXVldWUoKSB7XG4gICAgICAgIHRoaXMuX2RyYWluVW5sb2NrV2FpdGVycygpO1xuICAgICAgICB3aGlsZSAodGhpcy5fcXVldWUubGVuZ3RoID4gMCAmJiB0aGlzLl9xdWV1ZVswXS53ZWlnaHQgPD0gdGhpcy5fdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoSXRlbSh0aGlzLl9xdWV1ZS5zaGlmdCgpKTtcbiAgICAgICAgICAgIHRoaXMuX2RyYWluVW5sb2NrV2FpdGVycygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9kaXNwYXRjaEl0ZW0oaXRlbSkge1xuICAgICAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gdGhpcy5fdmFsdWU7XG4gICAgICAgIHRoaXMuX3ZhbHVlIC09IGl0ZW0ud2VpZ2h0O1xuICAgICAgICBpdGVtLnJlc29sdmUoW3ByZXZpb3VzVmFsdWUsIHRoaXMuX25ld1JlbGVhc2VyKGl0ZW0ud2VpZ2h0KV0pO1xuICAgIH1cbiAgICBfbmV3UmVsZWFzZXIod2VpZ2h0KSB7XG4gICAgICAgIGxldCBjYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGlmIChjYWxsZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZSh3ZWlnaHQpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBfZHJhaW5VbmxvY2tXYWl0ZXJzKCkge1xuICAgICAgICBpZiAodGhpcy5fcXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB3ZWlnaHQgPSB0aGlzLl92YWx1ZTsgd2VpZ2h0ID4gMDsgd2VpZ2h0LS0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCB3YWl0ZXJzID0gdGhpcy5fd2VpZ2h0ZWRXYWl0ZXJzW3dlaWdodCAtIDFdO1xuICAgICAgICAgICAgICAgIGlmICghd2FpdGVycylcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgd2FpdGVycy5mb3JFYWNoKCh3YWl0ZXIpID0+IHdhaXRlci5yZXNvbHZlKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlaWdodGVkV2FpdGVyc1t3ZWlnaHQgLSAxXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcXVldWVkUHJpb3JpdHkgPSB0aGlzLl9xdWV1ZVswXS5wcmlvcml0eTtcbiAgICAgICAgICAgIGZvciAobGV0IHdlaWdodCA9IHRoaXMuX3ZhbHVlOyB3ZWlnaHQgPiAwOyB3ZWlnaHQtLSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdhaXRlcnMgPSB0aGlzLl93ZWlnaHRlZFdhaXRlcnNbd2VpZ2h0IC0gMV07XG4gICAgICAgICAgICAgICAgaWYgKCF3YWl0ZXJzKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBpID0gd2FpdGVycy5maW5kSW5kZXgoKHdhaXRlcikgPT4gd2FpdGVyLnByaW9yaXR5IDw9IHF1ZXVlZFByaW9yaXR5KTtcbiAgICAgICAgICAgICAgICAoaSA9PT0gLTEgPyB3YWl0ZXJzIDogd2FpdGVycy5zcGxpY2UoMCwgaSkpXG4gICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKCh3YWl0ZXIgPT4gd2FpdGVyLnJlc29sdmUoKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIF9jb3VsZExvY2tJbW1lZGlhdGVseSh3ZWlnaHQsIHByaW9yaXR5KSB7XG4gICAgICAgIHJldHVybiAodGhpcy5fcXVldWUubGVuZ3RoID09PSAwIHx8IHRoaXMuX3F1ZXVlWzBdLnByaW9yaXR5IDwgcHJpb3JpdHkpICYmXG4gICAgICAgICAgICB3ZWlnaHQgPD0gdGhpcy5fdmFsdWU7XG4gICAgfVxufVxuZnVuY3Rpb24gaW5zZXJ0U29ydGVkKGEsIHYpIHtcbiAgICBjb25zdCBpID0gZmluZEluZGV4RnJvbUVuZChhLCAob3RoZXIpID0+IHYucHJpb3JpdHkgPD0gb3RoZXIucHJpb3JpdHkpO1xuICAgIGEuc3BsaWNlKGkgKyAxLCAwLCB2KTtcbn1cbmZ1bmN0aW9uIGZpbmRJbmRleEZyb21FbmQoYSwgcHJlZGljYXRlKSB7XG4gICAgZm9yIChsZXQgaSA9IGEubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZShhW2ldKSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xO1xufVxuXG52YXIgX19hd2FpdGVyJDEgPSAodW5kZWZpbmVkICYmIHVuZGVmaW5lZC5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmNsYXNzIE11dGV4IHtcbiAgICBjb25zdHJ1Y3RvcihjYW5jZWxFcnJvcikge1xuICAgICAgICB0aGlzLl9zZW1hcGhvcmUgPSBuZXcgU2VtYXBob3JlKDEsIGNhbmNlbEVycm9yKTtcbiAgICB9XG4gICAgYWNxdWlyZSgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlciQxKHRoaXMsIGFyZ3VtZW50cywgdm9pZCAwLCBmdW5jdGlvbiogKHByaW9yaXR5ID0gMCkge1xuICAgICAgICAgICAgY29uc3QgWywgcmVsZWFzZXJdID0geWllbGQgdGhpcy5fc2VtYXBob3JlLmFjcXVpcmUoMSwgcHJpb3JpdHkpO1xuICAgICAgICAgICAgcmV0dXJuIHJlbGVhc2VyO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcnVuRXhjbHVzaXZlKGNhbGxiYWNrLCBwcmlvcml0eSA9IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbWFwaG9yZS5ydW5FeGNsdXNpdmUoKCkgPT4gY2FsbGJhY2soKSwgMSwgcHJpb3JpdHkpO1xuICAgIH1cbiAgICBpc0xvY2tlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbWFwaG9yZS5pc0xvY2tlZCgpO1xuICAgIH1cbiAgICB3YWl0Rm9yVW5sb2NrKHByaW9yaXR5ID0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VtYXBob3JlLndhaXRGb3JVbmxvY2soMSwgcHJpb3JpdHkpO1xuICAgIH1cbiAgICByZWxlYXNlKCkge1xuICAgICAgICBpZiAodGhpcy5fc2VtYXBob3JlLmlzTG9ja2VkKCkpXG4gICAgICAgICAgICB0aGlzLl9zZW1hcGhvcmUucmVsZWFzZSgpO1xuICAgIH1cbiAgICBjYW5jZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZW1hcGhvcmUuY2FuY2VsKCk7XG4gICAgfVxufVxuXG52YXIgX19hd2FpdGVyID0gKHVuZGVmaW5lZCAmJiB1bmRlZmluZWQuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5mdW5jdGlvbiB3aXRoVGltZW91dChzeW5jLCB0aW1lb3V0LCB0aW1lb3V0RXJyb3IgPSBFX1RJTUVPVVQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhY3F1aXJlOiAod2VpZ2h0T3JQcmlvcml0eSwgcHJpb3JpdHkpID0+IHtcbiAgICAgICAgICAgIGxldCB3ZWlnaHQ7XG4gICAgICAgICAgICBpZiAoaXNTZW1hcGhvcmUoc3luYykpIHtcbiAgICAgICAgICAgICAgICB3ZWlnaHQgPSB3ZWlnaHRPclByaW9yaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgd2VpZ2h0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHByaW9yaXR5ID0gd2VpZ2h0T3JQcmlvcml0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh3ZWlnaHQgIT09IHVuZGVmaW5lZCAmJiB3ZWlnaHQgPD0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgaW52YWxpZCB3ZWlnaHQgJHt3ZWlnaHR9OiBtdXN0IGJlIHBvc2l0aXZlYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgIGxldCBpc1RpbWVvdXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGUgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaXNUaW1lb3V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHRpbWVvdXRFcnJvcik7XG4gICAgICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGlja2V0ID0geWllbGQgKGlzU2VtYXBob3JlKHN5bmMpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHN5bmMuYWNxdWlyZSh3ZWlnaHQsIHByaW9yaXR5KVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBzeW5jLmFjcXVpcmUocHJpb3JpdHkpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzVGltZW91dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVsZWFzZSA9IEFycmF5LmlzQXJyYXkodGlja2V0KSA/IHRpY2tldFsxXSA6IHRpY2tldDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbGVhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChoYW5kbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aWNrZXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNUaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSxcbiAgICAgICAgcnVuRXhjbHVzaXZlKGNhbGxiYWNrLCB3ZWlnaHQsIHByaW9yaXR5KSB7XG4gICAgICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgIGxldCByZWxlYXNlID0gKCkgPT4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpY2tldCA9IHlpZWxkIHRoaXMuYWNxdWlyZSh3ZWlnaHQsIHByaW9yaXR5KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGlja2V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVsZWFzZSA9IHRpY2tldFsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCBjYWxsYmFjayh0aWNrZXRbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVsZWFzZSA9IHRpY2tldDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICByZWxlYXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbGVhc2Uod2VpZ2h0KSB7XG4gICAgICAgICAgICBzeW5jLnJlbGVhc2Uod2VpZ2h0KTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FuY2VsKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN5bmMuY2FuY2VsKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHdhaXRGb3JVbmxvY2s6ICh3ZWlnaHRPclByaW9yaXR5LCBwcmlvcml0eSkgPT4ge1xuICAgICAgICAgICAgbGV0IHdlaWdodDtcbiAgICAgICAgICAgIGlmIChpc1NlbWFwaG9yZShzeW5jKSkge1xuICAgICAgICAgICAgICAgIHdlaWdodCA9IHdlaWdodE9yUHJpb3JpdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB3ZWlnaHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgcHJpb3JpdHkgPSB3ZWlnaHRPclByaW9yaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHdlaWdodCAhPT0gdW5kZWZpbmVkICYmIHdlaWdodCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIHdlaWdodCAke3dlaWdodH06IG11c3QgYmUgcG9zaXRpdmVgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlID0gc2V0VGltZW91dCgoKSA9PiByZWplY3QodGltZW91dEVycm9yKSwgdGltZW91dCk7XG4gICAgICAgICAgICAgICAgKGlzU2VtYXBob3JlKHN5bmMpXG4gICAgICAgICAgICAgICAgICAgID8gc3luYy53YWl0Rm9yVW5sb2NrKHdlaWdodCwgcHJpb3JpdHkpXG4gICAgICAgICAgICAgICAgICAgIDogc3luYy53YWl0Rm9yVW5sb2NrKHByaW9yaXR5KSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChoYW5kbGUpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgaXNMb2NrZWQ6ICgpID0+IHN5bmMuaXNMb2NrZWQoKSxcbiAgICAgICAgZ2V0VmFsdWU6ICgpID0+IHN5bmMuZ2V0VmFsdWUoKSxcbiAgICAgICAgc2V0VmFsdWU6ICh2YWx1ZSkgPT4gc3luYy5zZXRWYWx1ZSh2YWx1ZSksXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGlzU2VtYXBob3JlKHN5bmMpIHtcbiAgICByZXR1cm4gc3luYy5nZXRWYWx1ZSAhPT0gdW5kZWZpbmVkO1xufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpc25lIEB0eXBlc2NyaXB0LWVzbGludC9leHBsaWNpdC1tb2R1bGUtYm91bmRhcnktdHlwZXNcbmZ1bmN0aW9uIHRyeUFjcXVpcmUoc3luYywgYWxyZWFkeUFjcXVpcmVkRXJyb3IgPSBFX0FMUkVBRFlfTE9DS0VEKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICByZXR1cm4gd2l0aFRpbWVvdXQoc3luYywgMCwgYWxyZWFkeUFjcXVpcmVkRXJyb3IpO1xufVxuXG5leHBvcnQgeyBFX0FMUkVBRFlfTE9DS0VELCBFX0NBTkNFTEVELCBFX1RJTUVPVVQsIE11dGV4LCBTZW1hcGhvcmUsIHRyeUFjcXVpcmUsIHdpdGhUaW1lb3V0IH07XG4iLCJpbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG5pbXBvcnQgeyBkZXF1YWwgfSBmcm9tIFwiZGVxdWFsL2xpdGVcIjtcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gXCIuL3NhbmRib3gvdXRpbHMvbG9nZ2VyLm1qc1wiO1xuaW1wb3J0IHsgdG9BcnJheSB9IGZyb20gXCIuL2NvcmUvdXRpbHMvYXJyYXlzLm1qc1wiO1xuaW1wb3J0IHsgTXV0ZXggfSBmcm9tIFwiYXN5bmMtbXV0ZXhcIjtcbmV4cG9ydCBjb25zdCBzdG9yYWdlID0gY3JlYXRlU3RvcmFnZSgpO1xuZnVuY3Rpb24gY3JlYXRlU3RvcmFnZSgpIHtcbiAgY29uc3QgZHJpdmVycyA9IHtcbiAgICBsb2NhbDogY3JlYXRlRHJpdmVyKFwibG9jYWxcIiksXG4gICAgc2Vzc2lvbjogY3JlYXRlRHJpdmVyKFwic2Vzc2lvblwiKSxcbiAgICBzeW5jOiBjcmVhdGVEcml2ZXIoXCJzeW5jXCIpLFxuICAgIG1hbmFnZWQ6IGNyZWF0ZURyaXZlcihcIm1hbmFnZWRcIilcbiAgfTtcbiAgY29uc3QgZ2V0RHJpdmVyID0gKGFyZWEpID0+IHtcbiAgICBjb25zdCBkcml2ZXIgPSBkcml2ZXJzW2FyZWFdO1xuICAgIGlmIChkcml2ZXIgPT0gbnVsbCkge1xuICAgICAgY29uc3QgYXJlYU5hbWVzID0gT2JqZWN0LmtleXMoZHJpdmVycykuam9pbihcIiwgXCIpO1xuICAgICAgdGhyb3cgRXJyb3IoYEludmFsaWQgYXJlYSBcIiR7YXJlYX1cIi4gT3B0aW9uczogJHthcmVhTmFtZXN9YCk7XG4gICAgfVxuICAgIHJldHVybiBkcml2ZXI7XG4gIH07XG4gIGNvbnN0IHJlc29sdmVLZXkgPSAoa2V5KSA9PiB7XG4gICAgY29uc3QgZGVsaW1pbmF0b3JJbmRleCA9IGtleS5pbmRleE9mKFwiOlwiKTtcbiAgICBjb25zdCBkcml2ZXJBcmVhID0ga2V5LnN1YnN0cmluZygwLCBkZWxpbWluYXRvckluZGV4KTtcbiAgICBjb25zdCBkcml2ZXJLZXkgPSBrZXkuc3Vic3RyaW5nKGRlbGltaW5hdG9ySW5kZXggKyAxKTtcbiAgICBpZiAoZHJpdmVyS2V5ID09IG51bGwpXG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgYFN0b3JhZ2Uga2V5IHNob3VsZCBiZSBpbiB0aGUgZm9ybSBvZiBcImFyZWE6a2V5XCIsIGJ1dCByZWNlaXZlZCBcIiR7a2V5fVwiYFxuICAgICAgKTtcbiAgICByZXR1cm4ge1xuICAgICAgZHJpdmVyQXJlYSxcbiAgICAgIGRyaXZlcktleSxcbiAgICAgIGRyaXZlcjogZ2V0RHJpdmVyKGRyaXZlckFyZWEpXG4gICAgfTtcbiAgfTtcbiAgY29uc3QgZ2V0TWV0YUtleSA9IChrZXkpID0+IGtleSArIFwiJFwiO1xuICBjb25zdCBnZXRWYWx1ZU9yRmFsbGJhY2sgPSAodmFsdWUsIGZhbGxiYWNrKSA9PiB2YWx1ZSA/PyBmYWxsYmFjayA/PyBudWxsO1xuICBjb25zdCBnZXRNZXRhVmFsdWUgPSAocHJvcGVydGllcykgPT4gdHlwZW9mIHByb3BlcnRpZXMgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkocHJvcGVydGllcykgPyBwcm9wZXJ0aWVzIDoge307XG4gIGNvbnN0IGdldEl0ZW0gPSBhc3luYyAoZHJpdmVyLCBkcml2ZXJLZXksIG9wdHMpID0+IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBkcml2ZXIuZ2V0SXRlbShkcml2ZXJLZXkpO1xuICAgIHJldHVybiBnZXRWYWx1ZU9yRmFsbGJhY2socmVzLCBvcHRzPy5mYWxsYmFjayA/PyBvcHRzPy5kZWZhdWx0VmFsdWUpO1xuICB9O1xuICBjb25zdCBnZXRNZXRhID0gYXN5bmMgKGRyaXZlciwgZHJpdmVyS2V5KSA9PiB7XG4gICAgY29uc3QgbWV0YUtleSA9IGdldE1ldGFLZXkoZHJpdmVyS2V5KTtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBkcml2ZXIuZ2V0SXRlbShtZXRhS2V5KTtcbiAgICByZXR1cm4gZ2V0TWV0YVZhbHVlKHJlcyk7XG4gIH07XG4gIGNvbnN0IHNldEl0ZW0gPSBhc3luYyAoZHJpdmVyLCBkcml2ZXJLZXksIHZhbHVlKSA9PiB7XG4gICAgYXdhaXQgZHJpdmVyLnNldEl0ZW0oZHJpdmVyS2V5LCB2YWx1ZSA/PyBudWxsKTtcbiAgfTtcbiAgY29uc3Qgc2V0TWV0YSA9IGFzeW5jIChkcml2ZXIsIGRyaXZlcktleSwgcHJvcGVydGllcykgPT4ge1xuICAgIGNvbnN0IG1ldGFLZXkgPSBnZXRNZXRhS2V5KGRyaXZlcktleSk7XG4gICAgY29uc3QgZXhpc3RpbmdGaWVsZHMgPSBnZXRNZXRhVmFsdWUoYXdhaXQgZHJpdmVyLmdldEl0ZW0obWV0YUtleSkpO1xuICAgIGNvbnN0IG5ld0ZpZWxkcyA9IHsgLi4uZXhpc3RpbmdGaWVsZHMgfTtcbiAgICBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgIGRlbGV0ZSBuZXdGaWVsZHNba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0ZpZWxkc1trZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgYXdhaXQgZHJpdmVyLnNldEl0ZW0obWV0YUtleSwgbmV3RmllbGRzKTtcbiAgfTtcbiAgY29uc3QgcmVtb3ZlSXRlbSA9IGFzeW5jIChkcml2ZXIsIGRyaXZlcktleSwgb3B0cykgPT4ge1xuICAgIGF3YWl0IGRyaXZlci5yZW1vdmVJdGVtKGRyaXZlcktleSk7XG4gICAgaWYgKG9wdHM/LnJlbW92ZU1ldGEpIHtcbiAgICAgIGNvbnN0IG1ldGFLZXkgPSBnZXRNZXRhS2V5KGRyaXZlcktleSk7XG4gICAgICBhd2FpdCBkcml2ZXIucmVtb3ZlSXRlbShtZXRhS2V5KTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHJlbW92ZU1ldGEgPSBhc3luYyAoZHJpdmVyLCBkcml2ZXJLZXksIHByb3BlcnRpZXMpID0+IHtcbiAgICBjb25zdCBtZXRhS2V5ID0gZ2V0TWV0YUtleShkcml2ZXJLZXkpO1xuICAgIGlmIChwcm9wZXJ0aWVzID09IG51bGwpIHtcbiAgICAgIGF3YWl0IGRyaXZlci5yZW1vdmVJdGVtKG1ldGFLZXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBuZXdGaWVsZHMgPSBnZXRNZXRhVmFsdWUoYXdhaXQgZHJpdmVyLmdldEl0ZW0obWV0YUtleSkpO1xuICAgICAgdG9BcnJheShwcm9wZXJ0aWVzKS5mb3JFYWNoKChmaWVsZCkgPT4gZGVsZXRlIG5ld0ZpZWxkc1tmaWVsZF0pO1xuICAgICAgYXdhaXQgZHJpdmVyLnNldEl0ZW0obWV0YUtleSwgbmV3RmllbGRzKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHdhdGNoID0gKGRyaXZlciwgZHJpdmVyS2V5LCBjYikgPT4ge1xuICAgIHJldHVybiBkcml2ZXIud2F0Y2goZHJpdmVyS2V5LCBjYik7XG4gIH07XG4gIGNvbnN0IHN0b3JhZ2UyID0ge1xuICAgIGdldEl0ZW06IGFzeW5jIChrZXksIG9wdHMpID0+IHtcbiAgICAgIGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcbiAgICAgIHJldHVybiBhd2FpdCBnZXRJdGVtKGRyaXZlciwgZHJpdmVyS2V5LCBvcHRzKTtcbiAgICB9LFxuICAgIGdldEl0ZW1zOiBhc3luYyAoa2V5cykgPT4ge1xuICAgICAgY29uc3QgYXJlYVRvS2V5TWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbiAgICAgIGNvbnN0IGtleVRvT3B0c01hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG4gICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBsZXQga2V5U3RyO1xuICAgICAgICBsZXQgb3B0cztcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICBrZXlTdHIgPSBrZXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAga2V5U3RyID0ga2V5LmtleTtcbiAgICAgICAgICBvcHRzID0ga2V5Lm9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyBkcml2ZXJBcmVhLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5U3RyKTtcbiAgICAgICAgY29uc3Qga2V5czIgPSBhcmVhVG9LZXlNYXAuZ2V0KGRyaXZlckFyZWEpID8/IFtdO1xuICAgICAgICBhcmVhVG9LZXlNYXAuc2V0KGRyaXZlckFyZWEsIGtleXMyLmNvbmNhdChkcml2ZXJLZXkpKTtcbiAgICAgICAga2V5VG9PcHRzTWFwLnNldChrZXlTdHIsIG9wdHMpO1xuICAgICAgfSk7XG4gICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIEFycmF5LmZyb20oYXJlYVRvS2V5TWFwLmVudHJpZXMoKSkubWFwKGFzeW5jIChbZHJpdmVyQXJlYSwga2V5czJdKSA9PiB7XG4gICAgICAgICAgY29uc3QgZHJpdmVyUmVzdWx0cyA9IGF3YWl0IGRyaXZlcnNbZHJpdmVyQXJlYV0uZ2V0SXRlbXMoa2V5czIpO1xuICAgICAgICAgIHJldHVybiBkcml2ZXJSZXN1bHRzLm1hcCgoZHJpdmVyUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSBgJHtkcml2ZXJBcmVhfToke2RyaXZlclJlc3VsdC5rZXl9YDtcbiAgICAgICAgICAgIGNvbnN0IG9wdHMgPSBrZXlUb09wdHNNYXAuZ2V0KGtleSk7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGdldFZhbHVlT3JGYWxsYmFjayhcbiAgICAgICAgICAgICAgZHJpdmVyUmVzdWx0LnZhbHVlLFxuICAgICAgICAgICAgICBvcHRzPy5mYWxsYmFjayA/PyBvcHRzPy5kZWZhdWx0VmFsdWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4geyBrZXksIHZhbHVlIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgICAgcmV0dXJuIHJlc3VsdHMuZmxhdCgpO1xuICAgIH0sXG4gICAgZ2V0TWV0YTogYXN5bmMgKGtleSkgPT4ge1xuICAgICAgY29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuICAgICAgcmV0dXJuIGF3YWl0IGdldE1ldGEoZHJpdmVyLCBkcml2ZXJLZXkpO1xuICAgIH0sXG4gICAgc2V0SXRlbTogYXN5bmMgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgIGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcbiAgICAgIGF3YWl0IHNldEl0ZW0oZHJpdmVyLCBkcml2ZXJLZXksIHZhbHVlKTtcbiAgICB9LFxuICAgIHNldEl0ZW1zOiBhc3luYyAodmFsdWVzKSA9PiB7XG4gICAgICBjb25zdCBhcmVhVG9LZXlWYWx1ZU1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG4gICAgICB2YWx1ZXMuZm9yRWFjaCgoeyBrZXksIHZhbHVlIH0pID0+IHtcbiAgICAgICAgY29uc3QgeyBkcml2ZXJBcmVhLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcbiAgICAgICAgY29uc3QgdmFsdWVzMiA9IGFyZWFUb0tleVZhbHVlTWFwLmdldChkcml2ZXJBcmVhKSA/PyBbXTtcbiAgICAgICAgYXJlYVRvS2V5VmFsdWVNYXAuc2V0KFxuICAgICAgICAgIGRyaXZlckFyZWEsXG4gICAgICAgICAgdmFsdWVzMi5jb25jYXQoeyBrZXk6IGRyaXZlcktleSwgdmFsdWUgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIEFycmF5LmZyb20oYXJlYVRvS2V5VmFsdWVNYXAuZW50cmllcygpKS5tYXAoXG4gICAgICAgICAgYXN5bmMgKFtkcml2ZXJBcmVhLCB2YWx1ZXMyXSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZHJpdmVyID0gZ2V0RHJpdmVyKGRyaXZlckFyZWEpO1xuICAgICAgICAgICAgYXdhaXQgZHJpdmVyLnNldEl0ZW1zKHZhbHVlczIpO1xuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9LFxuICAgIHNldE1ldGE6IGFzeW5jIChrZXksIHByb3BlcnRpZXMpID0+IHtcbiAgICAgIGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcbiAgICAgIGF3YWl0IHNldE1ldGEoZHJpdmVyLCBkcml2ZXJLZXksIHByb3BlcnRpZXMpO1xuICAgIH0sXG4gICAgcmVtb3ZlSXRlbTogYXN5bmMgKGtleSwgb3B0cykgPT4ge1xuICAgICAgY29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuICAgICAgYXdhaXQgcmVtb3ZlSXRlbShkcml2ZXIsIGRyaXZlcktleSwgb3B0cyk7XG4gICAgfSxcbiAgICByZW1vdmVJdGVtczogYXN5bmMgKGtleXMpID0+IHtcbiAgICAgIGNvbnN0IGFyZWFUb0tleXNNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgbGV0IGtleVN0cjtcbiAgICAgICAgbGV0IG9wdHM7XG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAga2V5U3RyID0ga2V5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGtleVN0ciA9IGtleS5rZXk7XG4gICAgICAgICAgb3B0cyA9IGtleS5vcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHsgZHJpdmVyQXJlYSwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleVN0cik7XG4gICAgICAgIGNvbnN0IGFyZWFLZXlzID0gYXJlYVRvS2V5c01hcC5nZXQoZHJpdmVyQXJlYSkgPz8gW107XG4gICAgICAgIGFyZWFLZXlzLnB1c2goZHJpdmVyS2V5KTtcbiAgICAgICAgaWYgKG9wdHM/LnJlbW92ZU1ldGEpIHtcbiAgICAgICAgICBhcmVhS2V5cy5wdXNoKGdldE1ldGFLZXkoZHJpdmVyS2V5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYXJlYVRvS2V5c01hcC5zZXQoZHJpdmVyQXJlYSwgYXJlYUtleXMpO1xuICAgICAgfSk7XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgQXJyYXkuZnJvbShhcmVhVG9LZXlzTWFwLmVudHJpZXMoKSkubWFwKGFzeW5jIChbZHJpdmVyQXJlYSwga2V5czJdKSA9PiB7XG4gICAgICAgICAgY29uc3QgZHJpdmVyID0gZ2V0RHJpdmVyKGRyaXZlckFyZWEpO1xuICAgICAgICAgIGF3YWl0IGRyaXZlci5yZW1vdmVJdGVtcyhrZXlzMik7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0sXG4gICAgcmVtb3ZlTWV0YTogYXN5bmMgKGtleSwgcHJvcGVydGllcykgPT4ge1xuICAgICAgY29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuICAgICAgYXdhaXQgcmVtb3ZlTWV0YShkcml2ZXIsIGRyaXZlcktleSwgcHJvcGVydGllcyk7XG4gICAgfSxcbiAgICBzbmFwc2hvdDogYXN5bmMgKGJhc2UsIG9wdHMpID0+IHtcbiAgICAgIGNvbnN0IGRyaXZlciA9IGdldERyaXZlcihiYXNlKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBkcml2ZXIuc25hcHNob3QoKTtcbiAgICAgIG9wdHM/LmV4Y2x1ZGVLZXlzPy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgZGVsZXRlIGRhdGFba2V5XTtcbiAgICAgICAgZGVsZXRlIGRhdGFbZ2V0TWV0YUtleShrZXkpXTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSxcbiAgICByZXN0b3JlU25hcHNob3Q6IGFzeW5jIChiYXNlLCBkYXRhKSA9PiB7XG4gICAgICBjb25zdCBkcml2ZXIgPSBnZXREcml2ZXIoYmFzZSk7XG4gICAgICBhd2FpdCBkcml2ZXIucmVzdG9yZVNuYXBzaG90KGRhdGEpO1xuICAgIH0sXG4gICAgd2F0Y2g6IChrZXksIGNiKSA9PiB7XG4gICAgICBjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG4gICAgICByZXR1cm4gd2F0Y2goZHJpdmVyLCBkcml2ZXJLZXksIGNiKTtcbiAgICB9LFxuICAgIHVud2F0Y2goKSB7XG4gICAgICBPYmplY3QudmFsdWVzKGRyaXZlcnMpLmZvckVhY2goKGRyaXZlcikgPT4ge1xuICAgICAgICBkcml2ZXIudW53YXRjaCgpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBkZWZpbmVJdGVtOiAoa2V5LCBvcHRzKSA9PiB7XG4gICAgICBjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG4gICAgICBjb25zdCB7IHZlcnNpb246IHRhcmdldFZlcnNpb24gPSAxLCBtaWdyYXRpb25zID0ge30gfSA9IG9wdHMgPz8ge307XG4gICAgICBpZiAodGFyZ2V0VmVyc2lvbiA8IDEpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgXCJTdG9yYWdlIGl0ZW0gdmVyc2lvbiBjYW5ub3QgYmUgbGVzcyB0aGFuIDEuIEluaXRpYWwgdmVyc2lvbnMgc2hvdWxkIGJlIHNldCB0byAxLCBub3QgMC5cIlxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY29uc3QgbWlncmF0ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgZHJpdmVyTWV0YUtleSA9IGdldE1ldGFLZXkoZHJpdmVyS2V5KTtcbiAgICAgICAgY29uc3QgW3sgdmFsdWUgfSwgeyB2YWx1ZTogbWV0YSB9XSA9IGF3YWl0IGRyaXZlci5nZXRJdGVtcyhbXG4gICAgICAgICAgZHJpdmVyS2V5LFxuICAgICAgICAgIGRyaXZlck1ldGFLZXlcbiAgICAgICAgXSk7XG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGN1cnJlbnRWZXJzaW9uID0gbWV0YT8udiA/PyAxO1xuICAgICAgICBpZiAoY3VycmVudFZlcnNpb24gPiB0YXJnZXRWZXJzaW9uKSB7XG4gICAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICBgVmVyc2lvbiBkb3duZ3JhZGUgZGV0ZWN0ZWQgKHYke2N1cnJlbnRWZXJzaW9ufSAtPiB2JHt0YXJnZXRWZXJzaW9ufSkgZm9yIFwiJHtrZXl9XCJgXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBsb2dnZXIuZGVidWcoXG4gICAgICAgICAgYFJ1bm5pbmcgc3RvcmFnZSBtaWdyYXRpb24gZm9yICR7a2V5fTogdiR7Y3VycmVudFZlcnNpb259IC0+IHYke3RhcmdldFZlcnNpb259YFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBtaWdyYXRpb25zVG9SdW4gPSBBcnJheS5mcm9tKFxuICAgICAgICAgIHsgbGVuZ3RoOiB0YXJnZXRWZXJzaW9uIC0gY3VycmVudFZlcnNpb24gfSxcbiAgICAgICAgICAoXywgaSkgPT4gY3VycmVudFZlcnNpb24gKyBpICsgMVxuICAgICAgICApO1xuICAgICAgICBsZXQgbWlncmF0ZWRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICBmb3IgKGNvbnN0IG1pZ3JhdGVUb1ZlcnNpb24gb2YgbWlncmF0aW9uc1RvUnVuKSB7XG4gICAgICAgICAgbWlncmF0ZWRWYWx1ZSA9IGF3YWl0IG1pZ3JhdGlvbnM/LlttaWdyYXRlVG9WZXJzaW9uXT8uKG1pZ3JhdGVkVmFsdWUpID8/IG1pZ3JhdGVkVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgZHJpdmVyLnNldEl0ZW1zKFtcbiAgICAgICAgICB7IGtleTogZHJpdmVyS2V5LCB2YWx1ZTogbWlncmF0ZWRWYWx1ZSB9LFxuICAgICAgICAgIHsga2V5OiBkcml2ZXJNZXRhS2V5LCB2YWx1ZTogeyAuLi5tZXRhLCB2OiB0YXJnZXRWZXJzaW9uIH0gfVxuICAgICAgICBdKTtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKFxuICAgICAgICAgIGBTdG9yYWdlIG1pZ3JhdGlvbiBjb21wbGV0ZWQgZm9yICR7a2V5fSB2JHt0YXJnZXRWZXJzaW9ufWAsXG4gICAgICAgICAgeyBtaWdyYXRlZFZhbHVlIH1cbiAgICAgICAgKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBtaWdyYXRpb25zRG9uZSA9IG9wdHM/Lm1pZ3JhdGlvbnMgPT0gbnVsbCA/IFByb21pc2UucmVzb2x2ZSgpIDogbWlncmF0ZSgpLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKGBNaWdyYXRpb24gZmFpbGVkIGZvciAke2tleX1gLCBlcnIpO1xuICAgICAgfSk7XG4gICAgICBjb25zdCBpbml0TXV0ZXggPSBuZXcgTXV0ZXgoKTtcbiAgICAgIGNvbnN0IGdldEZhbGxiYWNrID0gKCkgPT4gb3B0cz8uZmFsbGJhY2sgPz8gb3B0cz8uZGVmYXVsdFZhbHVlID8/IG51bGw7XG4gICAgICBjb25zdCBnZXRPckluaXRWYWx1ZSA9ICgpID0+IGluaXRNdXRleC5ydW5FeGNsdXNpdmUoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGF3YWl0IGRyaXZlci5nZXRJdGVtKGRyaXZlcktleSk7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsIHx8IG9wdHM/LmluaXQgPT0gbnVsbCkgcmV0dXJuIHZhbHVlO1xuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGF3YWl0IG9wdHMuaW5pdCgpO1xuICAgICAgICBhd2FpdCBkcml2ZXIuc2V0SXRlbShkcml2ZXJLZXksIG5ld1ZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ld1ZhbHVlO1xuICAgICAgfSk7XG4gICAgICBtaWdyYXRpb25zRG9uZS50aGVuKGdldE9ySW5pdFZhbHVlKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldCBkZWZhdWx0VmFsdWUoKSB7XG4gICAgICAgICAgcmV0dXJuIGdldEZhbGxiYWNrKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBmYWxsYmFjaygpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0RmFsbGJhY2soKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VmFsdWU6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCBtaWdyYXRpb25zRG9uZTtcbiAgICAgICAgICBpZiAob3B0cz8uaW5pdCkge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGdldE9ySW5pdFZhbHVlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBnZXRJdGVtKGRyaXZlciwgZHJpdmVyS2V5LCBvcHRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGdldE1ldGE6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCBtaWdyYXRpb25zRG9uZTtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgZ2V0TWV0YShkcml2ZXIsIGRyaXZlcktleSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFZhbHVlOiBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICBhd2FpdCBtaWdyYXRpb25zRG9uZTtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgc2V0SXRlbShkcml2ZXIsIGRyaXZlcktleSwgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRNZXRhOiBhc3luYyAocHJvcGVydGllcykgPT4ge1xuICAgICAgICAgIGF3YWl0IG1pZ3JhdGlvbnNEb25lO1xuICAgICAgICAgIHJldHVybiBhd2FpdCBzZXRNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVtb3ZlVmFsdWU6IGFzeW5jIChvcHRzMikgPT4ge1xuICAgICAgICAgIGF3YWl0IG1pZ3JhdGlvbnNEb25lO1xuICAgICAgICAgIHJldHVybiBhd2FpdCByZW1vdmVJdGVtKGRyaXZlciwgZHJpdmVyS2V5LCBvcHRzMik7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZU1ldGE6IGFzeW5jIChwcm9wZXJ0aWVzKSA9PiB7XG4gICAgICAgICAgYXdhaXQgbWlncmF0aW9uc0RvbmU7XG4gICAgICAgICAgcmV0dXJuIGF3YWl0IHJlbW92ZU1ldGEoZHJpdmVyLCBkcml2ZXJLZXksIHByb3BlcnRpZXMpO1xuICAgICAgICB9LFxuICAgICAgICB3YXRjaDogKGNiKSA9PiB3YXRjaChcbiAgICAgICAgICBkcml2ZXIsXG4gICAgICAgICAgZHJpdmVyS2V5LFxuICAgICAgICAgIChuZXdWYWx1ZSwgb2xkVmFsdWUpID0+IGNiKG5ld1ZhbHVlID8/IGdldEZhbGxiYWNrKCksIG9sZFZhbHVlID8/IGdldEZhbGxiYWNrKCkpXG4gICAgICAgICksXG4gICAgICAgIG1pZ3JhdGVcbiAgICAgIH07XG4gICAgfVxuICB9O1xuICByZXR1cm4gc3RvcmFnZTI7XG59XG5mdW5jdGlvbiBjcmVhdGVEcml2ZXIoc3RvcmFnZUFyZWEpIHtcbiAgY29uc3QgZ2V0U3RvcmFnZUFyZWEgPSAoKSA9PiB7XG4gICAgaWYgKGJyb3dzZXIucnVudGltZSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgW1xuICAgICAgICAgIFwiJ3d4dC9zdG9yYWdlJyBtdXN0IGJlIGxvYWRlZCBpbiBhIHdlYiBleHRlbnNpb24gZW52aXJvbm1lbnRcIixcbiAgICAgICAgICBcIlxcbiAtIElmIHRocm93biBkdXJpbmcgYSBidWlsZCwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93eHQtZGV2L3d4dC9pc3N1ZXMvMzcxXCIsXG4gICAgICAgICAgXCIgLSBJZiB0aHJvd24gZHVyaW5nIHRlc3RzLCBtb2NrICd3eHQvYnJvd3NlcicgY29ycmVjdGx5LiBTZWUgaHR0cHM6Ly93eHQuZGV2L2d1aWRlL2dvLWZ1cnRoZXIvdGVzdGluZy5odG1sXFxuXCJcbiAgICAgICAgXS5qb2luKFwiXFxuXCIpXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoYnJvd3Nlci5zdG9yYWdlID09IG51bGwpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICBcIllvdSBtdXN0IGFkZCB0aGUgJ3N0b3JhZ2UnIHBlcm1pc3Npb24gdG8geW91ciBtYW5pZmVzdCB0byB1c2UgJ3d4dC9zdG9yYWdlJ1wiXG4gICAgICApO1xuICAgIH1cbiAgICBjb25zdCBhcmVhID0gYnJvd3Nlci5zdG9yYWdlW3N0b3JhZ2VBcmVhXTtcbiAgICBpZiAoYXJlYSA9PSBudWxsKVxuICAgICAgdGhyb3cgRXJyb3IoYFwiYnJvd3Nlci5zdG9yYWdlLiR7c3RvcmFnZUFyZWF9XCIgaXMgdW5kZWZpbmVkYCk7XG4gICAgcmV0dXJuIGFyZWE7XG4gIH07XG4gIGNvbnN0IHdhdGNoTGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcbiAgcmV0dXJuIHtcbiAgICBnZXRJdGVtOiBhc3luYyAoa2V5KSA9PiB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLmdldChrZXkpO1xuICAgICAgcmV0dXJuIHJlc1trZXldO1xuICAgIH0sXG4gICAgZ2V0SXRlbXM6IGFzeW5jIChrZXlzKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLmdldChrZXlzKTtcbiAgICAgIHJldHVybiBrZXlzLm1hcCgoa2V5KSA9PiAoeyBrZXksIHZhbHVlOiByZXN1bHRba2V5XSA/PyBudWxsIH0pKTtcbiAgICB9LFxuICAgIHNldEl0ZW06IGFzeW5jIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgICBhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLnJlbW92ZShrZXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5zZXQoeyBba2V5XTogdmFsdWUgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXRJdGVtczogYXN5bmMgKHZhbHVlcykgPT4ge1xuICAgICAgY29uc3QgbWFwID0gdmFsdWVzLnJlZHVjZShcbiAgICAgICAgKG1hcDIsIHsga2V5LCB2YWx1ZSB9KSA9PiB7XG4gICAgICAgICAgbWFwMltrZXldID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIG1hcDI7XG4gICAgICAgIH0sXG4gICAgICAgIHt9XG4gICAgICApO1xuICAgICAgYXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5zZXQobWFwKTtcbiAgICB9LFxuICAgIHJlbW92ZUl0ZW06IGFzeW5jIChrZXkpID0+IHtcbiAgICAgIGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkucmVtb3ZlKGtleSk7XG4gICAgfSxcbiAgICByZW1vdmVJdGVtczogYXN5bmMgKGtleXMpID0+IHtcbiAgICAgIGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkucmVtb3ZlKGtleXMpO1xuICAgIH0sXG4gICAgc25hcHNob3Q6IGFzeW5jICgpID0+IHtcbiAgICAgIHJldHVybiBhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLmdldCgpO1xuICAgIH0sXG4gICAgcmVzdG9yZVNuYXBzaG90OiBhc3luYyAoZGF0YSkgPT4ge1xuICAgICAgYXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5zZXQoZGF0YSk7XG4gICAgfSxcbiAgICB3YXRjaChrZXksIGNiKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IChjaGFuZ2VzKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoYW5nZSA9IGNoYW5nZXNba2V5XTtcbiAgICAgICAgaWYgKGNoYW5nZSA9PSBudWxsKSByZXR1cm47XG4gICAgICAgIGlmIChkZXF1YWwoY2hhbmdlLm5ld1ZhbHVlLCBjaGFuZ2Uub2xkVmFsdWUpKSByZXR1cm47XG4gICAgICAgIGNiKGNoYW5nZS5uZXdWYWx1ZSA/PyBudWxsLCBjaGFuZ2Uub2xkVmFsdWUgPz8gbnVsbCk7XG4gICAgICB9O1xuICAgICAgZ2V0U3RvcmFnZUFyZWEoKS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgd2F0Y2hMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGdldFN0b3JhZ2VBcmVhKCkub25DaGFuZ2VkLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgd2F0Y2hMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICAgIH07XG4gICAgfSxcbiAgICB1bndhdGNoKCkge1xuICAgICAgd2F0Y2hMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgICAgZ2V0U3RvcmFnZUFyZWEoKS5vbkNoYW5nZWQucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgfSk7XG4gICAgICB3YXRjaExpc3RlbmVycy5jbGVhcigpO1xuICAgIH1cbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGRlZmluZUJhY2tncm91bmQoKCkgPT4ge1xuICBicm93c2VyLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKCkge1xuICAgIC8vIE9wZW4gdGhlIG9wdGlvbnMgcGFnZVxuICAgIGJyb3dzZXIucnVudGltZS5vcGVuT3B0aW9uc1BhZ2UoKTtcbiAgfSk7XG5cbiAgLy8gQ3JlYXRlIGNvbnRleHQgbWVudSBvbiB0ZXh0IHNlbGVjdGlvblxuICBicm93c2VyLmNvbnRleHRNZW51cy5jcmVhdGUoe1xuICAgIGlkOiAnc2VuZFRvQUknLFxuICAgIHRpdGxlOiAnSmFyR29uZSEnLFxuICAgIGNvbnRleHRzOiBbJ3NlbGVjdGlvbiddLFxuICB9KTtcblxuICBicm93c2VyLmNvbnRleHRNZW51cy5vbkNsaWNrZWQuYWRkTGlzdGVuZXIoYXN5bmMgKGluZm8sIHRhYikgPT4ge1xuICAgIGlmIChpbmZvLm1lbnVJdGVtSWQgPT09ICdzZW5kVG9BSScgJiYgaW5mby5zZWxlY3Rpb25UZXh0ICYmIHRhYj8uaWQpIHtcbiAgICAgIGxldCBlcnJvclN0YXRlOiBib29sZWFuID0gZmFsc2U7XG4gICAgICBjb25zdCBzZXR0aW5nc1N0b3JlS2V5ID0gJ3NldHRpbmdzJztcbiAgICAgIGNvbnN0IGtleXdvcmRTdG9yZUtleSA9ICdrZXl3b3JkSGlzdG9yeSc7XG5cbiAgICAgIC8vIExvYWQgc2V0dGluZ3MgZnJvbSBsb2NhbCBzdG9yYWdlXG4gICAgICBjb25zdCBzYXZlZFNldHRpbmdzOiBzdHJpbmcgfCBudWxsID0gYXdhaXQgc3RvcmFnZS5nZXRJdGVtKGBsb2NhbDoke3NldHRpbmdzU3RvcmVLZXl9YCk7XG4gICAgICBjb25zdCBwYXJzZWRTZXR0aW5ncyA9IHNhdmVkU2V0dGluZ3MgPyBKU09OLnBhcnNlKHNhdmVkU2V0dGluZ3MpIDoge307XG4gICAgICBjb25zdCBhcGlLZXkgPSBwYXJzZWRTZXR0aW5ncy5hcGlLZXkgfHwgJyc7XG4gICAgICBjb25zdCBjb25mZXR0aUFuaW1hdGlvbiA9IHBhcnNlZFNldHRpbmdzLmNvbmZldHRpQW5pbWF0aW9uICE9PSB1bmRlZmluZWQgPyBwYXJzZWRTZXR0aW5ncy5jb25mZXR0aUFuaW1hdGlvbiA6IHRydWU7XG4gICAgICBjb25zdCByZXBsYWNlVGV4dCA9IHBhcnNlZFNldHRpbmdzLnJlcGxhY2VUZXh0ICE9PSB1bmRlZmluZWQgPyBwYXJzZWRTZXR0aW5ncy5yZXBsYWNlVGV4dCA6IHRydWU7XG4gICAgICBjb25zdCBsb2NhbGUgPSBwYXJzZWRTZXR0aW5ncy5sb2NhbGUgfHwgJ2VuZ2xpc2gnO1xuXG4gICAgICBjb25zdCBzZWxlY3RlZFRleHQgPSBpbmZvLnNlbGVjdGlvblRleHQ7XG5cbiAgICAgIGlmIChyZXBsYWNlVGV4dCkge1xuICAgICAgICBjb25zdCBwcm9tcHRUZXh0ID0gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHJvbGU6IFwic3lzdGVtXCIsXG4gICAgICAgICAgICBjb250ZW50OiBcIllvdSBhcmUgYSBoZWxwZnVsIGFzc2lzdGFudCB0aGF0IHJlZm9ybWF0cyB0ZXh0IGZvciBzaW1wbGljaXR5IGFuZCBleHRyYWN0cyBjb21wbGV4IGtleXdvcmRzIHdpdGggZXhwbGFuYXRpb25zLlwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICByb2xlOiBcInVzZXJcIixcbiAgICAgICAgICAgIGNvbnRlbnQ6IGBQbGVhc2UgcmV3cml0ZSB0aGUgZm9sbG93aW5nIHRleHQgdGhhdCBpcyBjdXJyZW50bHkgdG9vIHRvdWdoIHRvIHVuZGVyc3RhbmQuIEVuc3VyZSB0aGF0IHRoZSBtZWFuaW5nIG9mIHRoZSByZXdyaXR0ZW4gdGV4dCBkb2VzIG5vdCBhbHRlciB0aGUgb3JpZ2luYWwgbWVhbmluZy4gQWxzbyBzY3JhcGUgMyBtb3N0IG9ic2N1cmUvY29tcGxleCBrZXl3b3Jkcy9waHJhc2VzIGZyb20gdGhlIHRleHQsIGNhdGVnb3JpemUgdGhlbSBncmFtbWF0aWNhbGx5LCBhbmQgcHJvdmlkZSB0aGVpciBtZWFuaW5nIGluIGEgc3RydWN0dXJlZCBKU09OIGZvcm1hdC5cXG5cXG5IZXJlIGlzIHRoZSB0ZXh0OlxcblxcYFxcYFxcYFxcbiR7c2VsZWN0ZWRUZXh0fVxcblxcYFxcYFxcYFxcblRoZSBmb2xsb3dpbmcgaXMgdGhlIGV4cGVjdGVkIG91dHB1dCBKU09OIHN0cnVjdHVyZTpcXG5cXGBcXGBcXGBcXG57XFxuICAgXCJyZXdyaXR0ZW5UZXh0XCI6IFwic2ltcGxpZmllZCB2ZXJzaW9uIG9mIHRoZSB0ZXh0IGluICR7bG9jYWxlLnRvVXBwZXJDYXNlKCl9IGxhbmd1YWdlXCIsXFxuICAgXCJrZXl3b3Jkc1wiOiBbXFxuICAgICAge1xcbiAgICAgICAgIFwia2V5d29yZFwiOiBcImtleXdvcmQgb3IgcGhyYXNlXCIsXFxuICAgICAgICAgXCJ0eXBlXCI6IFwiZ3JhbW1hdGljYWwgdHlwZVwiLFxcbiAgICAgICAgIFwibWVhbmluZ1wiOiBcImV4cGxhbmF0aW9uIGluICR7bG9jYWxlLnRvVXBwZXJDYXNlKCl9IGxhbmd1YWdlXCJcXG4gICAgICB9XFxuICAgXVxcbn1cXG5cXGBcXGBcXGBcXG5Pbmx5IG91dHB1dCBKU09OLiBEbyBOT1Qgb3V0cHV0IGFueSBvdGhlciBmb3JtYXQuYFxuICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICBsZXQgcmV3cml0dGVuVGV4dDogc3RyaW5nID0gJyc7XG4gICAgICAgIGxldCBrZXl3b3JkQXJyYXk6IEtleXdvcmRbXSA9IFtdXG5cbiAgICAgICAgLy8gQ2hhbmdlIGN1cnNvciB0byB3YWl0aW5nIHN0YXRlXG4gICAgICAgIGJyb3dzZXIudGFicy5zZW5kTWVzc2FnZSh0YWIuaWQsIHsgdHlwZTogJ0NIQU5HRV9DVVJTT1InLCBzdGF0ZTogJ3dhaXRpbmcnIH0pO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gU2VuZCByZXF1ZXN0IHRvIExMTVxuICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEvY2hhdC9jb21wbGV0aW9ucycsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7YXBpS2V5fWAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICBcIm1vZGVsXCI6ICdncHQtNG8tbWluaScsXG4gICAgICAgICAgICAgIFwibWVzc2FnZXNcIjogcHJvbXB0VGV4dCxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBkYXRhLmNob2ljZXNbMF0/Lm1lc3NhZ2U/LmNvbnRlbnQ7XG4gICAgICAgICAgY29uc3QgY2xlYW5lZFJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC9gYGBqc29ufGBgYC9nLCAnJykudHJpbSgpO1xuICAgICAgICAgIGNvbnN0IHJlc3VsdEpzb24gPSBKU09OLnBhcnNlKGNsZWFuZWRSZXN1bHQpO1xuICAgICAgICAgIHJld3JpdHRlblRleHQgPSByZXN1bHRKc29uLnJld3JpdHRlblRleHQudHJpbSgpO1xuXG4gICAgICAgICAga2V5d29yZEFycmF5ID0gcmVzdWx0SnNvbi5rZXl3b3JkcztcblxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiAnLCBlcnJvcik7XG4gICAgICAgICAga2V5d29yZEFycmF5ID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtleXdvcmRcIjogXCJlcnJvciBvY2N1cnJlZFwiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJlcnJvclwiLFxuICAgICAgICAgICAgICBcIm1lYW5pbmdcIjogYG9oIG5vISB0aGUgZW1waXJlIHN0cnVjayBiYWNrICh4X3g7KSAtIEVycm9yOiAke2Vycm9yfS4gcGxlYXNlIHJlcG9ydCBpdCB1c2luZyB0aGUgYnV0dG9uIG9uIHRoZSB0b3AgcmlnaHQuYFxuICAgICAgICAgICAgfVxuICAgICAgICAgIF07XG4gICAgICAgICAgcmV3cml0dGVuVGV4dCA9IGAke3NlbGVjdGVkVGV4dH0gWyEhISBFUlJPUiAtIE9QRU4gRVhURU5TSU9OIFBPUFVQICEhIV1gO1xuICAgICAgICAgIGVycm9yU3RhdGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBTdG9yZSByZXN1bHQgaW4gbG9jYWwgc3RvcmFnZVxuICAgICAgICAgIGxldCBrZXl3b3JkSGlzdG9yeTogc3RyaW5nIHwgbnVsbCA9IGF3YWl0IHN0b3JhZ2UuZ2V0SXRlbShgbG9jYWw6JHtrZXl3b3JkU3RvcmVLZXl9YCk7XG4gICAgICAgICAgbGV0IGtleXdvcmRIaXN0b3J5QXJyYXk6IEtleXdvcmRbXSB8IG51bGwgPSBKU09OLnBhcnNlKGtleXdvcmRIaXN0b3J5IHx8ICdbXScpO1xuICAgICAgICAgIGlmICgha2V5d29yZEhpc3RvcnlBcnJheSkge1xuICAgICAgICAgICAga2V5d29yZEhpc3RvcnlBcnJheSA9IFtdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhd2FpdCBzdG9yYWdlLnNldEl0ZW0oYGxvY2FsOiR7a2V5d29yZFN0b3JlS2V5fWAsIEpTT04uc3RyaW5naWZ5KFsuLi5rZXl3b3JkSGlzdG9yeUFycmF5LCAuLi5rZXl3b3JkQXJyYXldKSk7XG5cbiAgICAgICAgICAvLyBTZW5kIHJlc3VsdCB0byBjb250ZW50IHNjcmlwdFxuICAgICAgICAgIGJyb3dzZXIudGFicy5zZW5kTWVzc2FnZSh0YWIuaWQsIHtcbiAgICAgICAgICAgIHR5cGU6ICdSRVBMQUNFX1RFWFQnLFxuICAgICAgICAgICAgbmV3VGV4dDogcmV3cml0dGVuVGV4dCxcbiAgICAgICAgICAgIGVuYWJsZUNvbmZldHRpOiBlcnJvclN0YXRlID8gZmFsc2UgOiBjb25mZXR0aUFuaW1hdGlvbixcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvcjogJywgZXJyb3IpO1xuICAgICAgICAgIGFsZXJ0KCdFcnJvcjogJyArIGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoYW5nZSBjdXJzb3IgYmFjayB0byBkZWZhdWx0IHN0YXRlXG4gICAgICAgIGJyb3dzZXIudGFicy5zZW5kTWVzc2FnZSh0YWIuaWQsIHsgdHlwZTogJ0NIQU5HRV9DVVJTT1InLCBzdGF0ZTogJ2RlZmF1bHQnIH0pO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGNvbnN0IHByb21wdFRleHQgPSBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgcm9sZTogXCJzeXN0ZW1cIixcbiAgICAgICAgICAgIGNvbnRlbnQ6IFwiWW91IGFyZSBhIGhlbHBmdWwgYXNzaXN0YW50IHRoYXQgcmVmb3JtYXRzIHRleHQgZm9yIHNpbXBsaWNpdHkgYnkgZXh0cmFjdGluZyBjb21wbGV4IGtleXdvcmRzIHdpdGggZXhwbGFuYXRpb25zLlwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICByb2xlOiBcInVzZXJcIixcbiAgICAgICAgICAgIGNvbnRlbnQ6IGBQcm92aWRlIGEgSlNPTiBvdXRwdXQgY29udGFpbmluZyBhbGwgdGhlIG9ic2N1cmUgYW5kIGRpZmZpY3VsdCB3b3JkcyBvciBwaHJhc2VzIGZyb20gdGhlIGZvbGxvd2luZyB0ZXh0LCB3aXRoIHRoZWlyIHNpbXBsaWZpZWQgbWVhbmluZyBhbmQgZ3JhbW1hdGljYWwgdHlwZS4gUGxlYXNlIGxpbWl0IHRoZSBzaW1wbGlmaWVkIG1lYW5pbmcgdG8gNSAtIDcgd29yZHMgb25seSwgYW5kIGVuc3VyZSB0aGF0IHRoZSBtZWFuaW5nIGlzIGVhc3kgdG8gdW5kZXJzdGFuZCBhbmQgaW4gbGluZSB3aXRoIHRoZSBjb250ZXh0IG9mIHRoZSBzZW50ZW5jZS5cXG5cXG5IZXJlIGlzIHRoZSB0ZXh0OlxcblxcYCR7c2VsZWN0ZWRUZXh0fVxcYFxcblRoZSBmb2xsb3dpbmcgaXMgdGhlIGV4cGVjdGVkIG91dHB1dCBKU09OIHN0cnVjdHVyZTpcXG5cXGBcXGBcXGBcXG57XFxuICAgXCJrZXl3b3Jkc1wiOltcXG4gICAgICB7XFxuICAgICAgICAgXCJrZXl3b3JkXCI6XCJrZXl3b3JkIG9yIHBocmFzZVwiLFxcbiAgICAgICAgIFwidHlwZVwiOlwiZ3JhbW1hdGljYWwgdHlwZVwiLFxcbiAgICAgICAgIFwibWVhbmluZ1wiOlwic2ltcGxpZmllZCBtZWFuaW5nIHVzaW5nIHNpbXBsZSB3b3JkcyBpbiAke2xvY2FsZS50b1VwcGVyQ2FzZSgpfSBsYW5ndWFnZVwiXFxufVxcbiAgIF1cXG59XFxuXFxgXFxgXFxgXFxuT25seSBvdXRwdXQgSlNPTi4gRG8gTk9UIG91dHB1dCBhbnkgb3RoZXIgZm9ybWF0LmBcbiAgICAgICAgICB9XG4gICAgICAgIF07XG5cbiAgICAgICAgbGV0IGtleXdvcmRBcnJheTogS2V5d29yZFtdID0gW11cblxuICAgICAgICAvLyBDaGFuZ2UgY3Vyc29yIHRvIHdhaXRpbmcgc3RhdGVcbiAgICAgICAgYnJvd3Nlci50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgeyB0eXBlOiAnQ0hBTkdFX0NVUlNPUicsIHN0YXRlOiAnd2FpdGluZycgfSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBTZW5kIHJlcXVlc3QgdG8gTExNXG4gICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MS9jaGF0L2NvbXBsZXRpb25zJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHthcGlLZXl9YCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIFwibW9kZWxcIjogJ2dwdC00by1taW5pJyxcbiAgICAgICAgICAgICAgXCJtZXNzYWdlc1wiOiBwcm9tcHRUZXh0LFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjb25zb2xlLndhcm4ocmVzcG9uc2UpO1xuXG4gICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICBjb25zb2xlLndhcm4oZGF0YSk7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gZGF0YS5jaG9pY2VzWzBdPy5tZXNzYWdlPy5jb250ZW50O1xuICAgICAgICAgIGNvbnN0IGNsZWFuZWRSZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvYGBganNvbnxgYGAvZywgJycpLnRyaW0oKTtcbiAgICAgICAgICBjb25zdCByZXN1bHRKc29uID0gSlNPTi5wYXJzZShjbGVhbmVkUmVzdWx0KTtcblxuICAgICAgICAgIC8vIFN0b3JlIHJlc3VsdCBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICAgICAga2V5d29yZEFycmF5ID0gcmVzdWx0SnNvbi5rZXl3b3JkcztcblxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiAnLCBlcnJvcik7XG4gICAgICAgICAgY29uc3QgY2xlYW5lZFRleHQgPSBzZWxlY3RlZFRleHQucmVwbGFjZSgvXlsuLFxcc10rfFsuLFxcc10rJC9nLCAnJyk7XG4gICAgICAgICAga2V5d29yZEFycmF5ID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtleXdvcmRcIjogXCJFUlJPUlwiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJlcnJvclwiLFxuICAgICAgICAgICAgICBcIm1lYW5pbmdcIjogYEVycm9yOiAke2Vycm9yfWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdO1xuICAgICAgICAgIGVycm9yU3RhdGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hhbmdlIGN1cnNvciBiYWNrIHRvIGRlZmF1bHQgc3RhdGVcbiAgICAgICAgYnJvd3Nlci50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgeyB0eXBlOiAnQ0hBTkdFX0NVUlNPUicsIHN0YXRlOiAnZGVmYXVsdCcgfSk7XG5cbiAgICAgICAgLy8gU2VuZCByZXN1bHQgdG8gY29udGVudCBzY3JpcHRcbiAgICAgICAgYnJvd3Nlci50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwge1xuICAgICAgICAgIHR5cGU6ICdOT1JFUExBQ0VfVEVYVCcsXG4gICAgICAgICAga2V5d29yZEFycmF5U3RyaW5nOiBKU09OLnN0cmluZ2lmeShrZXl3b3JkQXJyYXkpLFxuICAgICAgICAgIGVuYWJsZUNvbmZldHRpOiBlcnJvclN0YXRlID8gZmFsc2UgOiBjb25mZXR0aUFuaW1hdGlvbixcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJlc2V0IGVycm9yIHN0YXRlXG4gICAgICBlcnJvclN0YXRlID0gZmFsc2U7XG4gICAgfVxuICB9KTtcbn0pXG4iXSwibmFtZXMiOlsiZ2xvYmFsIiwidGhpcyIsIm1vZHVsZSIsInByb3h5VGFyZ2V0IiwidmFsdWUiLCJyZXN1bHQiLCJtZXNzYWdlIiwicHJpbnQiLCJsb2dnZXIiXSwibWFwcGluZ3MiOiI7O0FBQU8sV0FBUyxpQkFBaUIsS0FBSztBQUNwQyxRQUFJLE9BQU8sUUFBUSxPQUFPLFFBQVEsV0FBWSxRQUFPLEVBQUUsTUFBTTtBQUM3RCxXQUFPO0FBQUEsRUFDVDtBQ0ZBLE1BQUksZ0JBQWdCLE1BQU07QUFBQSxJ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QUFNLDhDQUE4QztBQUFBLGNBQ3pFLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxnQkFDUCxnQkFBZ0I7QUFBQSxnQkFDaEIsZUFBZSxVQUFVLE1BQU07QUFBQSxjQUNqQztBQUFBLGNBQ0EsTUFBTSxLQUFLLFVBQVU7QUFBQSxnQkFDbkIsU0FBUztBQUFBLGdCQUNULFlBQVk7QUFBQSxjQUFBLENBQ2I7QUFBQSxZQUFBLENBQ0Y7QUFFRCxvQkFBUSxLQUFLLFFBQVE7QUFFZixrQkFBQSxPQUFPLE1BQU0sU0FBUztBQUM1QixvQkFBUSxLQUFLLElBQUk7QUFDakIsa0JBQU1BLFdBQVMsZ0JBQUssUUFBUSxDQUFDLE1BQWQsbUJBQWlCLFlBQWpCLG1CQUEwQjtBQUN6QyxrQkFBTSxnQkFBZ0JBLFFBQU8sUUFBUSxnQkFBZ0IsRUFBRSxFQUFFO0FBQ25ELGtCQUFBLGFBQWEsS0FBSyxNQUFNLGFBQWE7QUFHM0MsMkJBQWUsV0FBVztBQUFBLG1CQUVuQixPQUFPO0FBQ04sb0JBQUEsTUFBTSxXQUFXLEtBQUs7QUFDVix5QkFBYSxRQUFRLHNCQUFzQixFQUFFO0FBQ2xELDJCQUFBO0FBQUEsY0FDYjtBQUFBLGdCQUNFLFdBQVc7QUFBQSxnQkFDWCxRQUFRO0FBQUEsZ0JBQ1IsV0FBVyxVQUFVLEtBQUs7QUFBQSxjQUM1QjtBQUFBLFlBQUE7QUFFVyx5QkFBQTtBQUFBLFVBQ2Y7QUFHUSxrQkFBQSxLQUFLLFlBQVksSUFBSSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsT0FBTyxVQUFBLENBQVc7QUFHcEUsa0JBQUEsS0FBSyxZQUFZLElBQUksSUFBSTtBQUFBLFlBQy9CLE1BQU07QUFBQSxZQUNOLG9CQUFvQixLQUFLLFVBQVUsWUFBWTtBQUFBLFlBQy9DLGdCQUFnQixhQUFhLFFBQVE7QUFBQSxVQUFBLENBQ3RDO0FBQUEsUUFDSDtBQUdhLHFCQUFBO0FBQUEsTUFDZjtBQUFBLElBQUEsQ0FDRDtBQUFBLEVBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzAsMSwyLDMsNCw1LDYsNyw4XX0=
