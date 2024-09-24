!(function (t, e) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof exports
    ? (exports.HarmonyExport = e())
    : (t.HarmonyExport = e());
})(self, () =>
  (() => {
    "use strict";
    var t = {
        113: (t, e, o) => {
          o.r(e);
          const r = "function" == typeof Buffer,
            n =
              ("function" == typeof TextDecoder && new TextDecoder(),
              "function" == typeof TextEncoder ? new TextEncoder() : void 0),
            a = Array.prototype.slice.call(
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
            ),
            s =
              (((t) => {
                let e = {};
                t.forEach((t, o) => (e[t] = o));
              })(a),
              String.fromCharCode.bind(String)),
            i =
              ("function" == typeof Uint8Array.from &&
                Uint8Array.from.bind(Uint8Array),
              (t) =>
                t
                  .replace(/=/g, "")
                  .replace(/[+\/]/g, (t) => ("+" == t ? "-" : "_"))),
            A =
              "function" == typeof btoa
                ? (t) => btoa(t)
                : r
                ? (t) => Buffer.from(t, "binary").toString("base64")
                : (t) => {
                    let e,
                      o,
                      r,
                      n,
                      s = "";
                    const i = t.length % 3;
                    for (let i = 0; i < t.length; ) {
                      if (
                        (o = t.charCodeAt(i++)) > 255 ||
                        (r = t.charCodeAt(i++)) > 255 ||
                        (n = t.charCodeAt(i++)) > 255
                      )
                        throw new TypeError("invalid character found");
                      (e = (o << 16) | (r << 8) | n),
                        (s +=
                          a[(e >> 18) & 63] +
                          a[(e >> 12) & 63] +
                          a[(e >> 6) & 63] +
                          a[63 & e]);
                    }
                    return i ? s.slice(0, i - 3) + "===".substring(i) : s;
                  },
            h = r
              ? (t) => Buffer.from(t).toString("base64")
              : (t) => {
                  let e = [];
                  for (let o = 0, r = t.length; o < r; o += 4096)
                    e.push(s.apply(null, t.subarray(o, o + 4096)));
                  return A(e.join(""));
                },
            l = (t) => {
              if (t.length < 2)
                return (e = t.charCodeAt(0)) < 128
                  ? t
                  : e < 2048
                  ? s(192 | (e >>> 6)) + s(128 | (63 & e))
                  : s(224 | ((e >>> 12) & 15)) +
                    s(128 | ((e >>> 6) & 63)) +
                    s(128 | (63 & e));
              var e =
                65536 +
                1024 * (t.charCodeAt(0) - 55296) +
                (t.charCodeAt(1) - 56320);
              return (
                s(240 | ((e >>> 18) & 7)) +
                s(128 | ((e >>> 12) & 63)) +
                s(128 | ((e >>> 6) & 63)) +
                s(128 | (63 & e))
              );
            },
            f = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,
            u = r
              ? (t) => Buffer.from(t, "utf8").toString("base64")
              : n
              ? (t) => h(n.encode(t))
              : (t) => A(t.replace(f, l)),
            g = (t, e = !1) => (e ? i(u(t)) : u(t));
          var c, d;
          (t = o.hmd(t)),
            (c = void 0),
            (d = function () {
              const t = "https://harmonydata.ac.uk/app/#/",
                e = ({ questions: e, instrument_name: o }) => {
                  if (
                    Array.isArray(e) &&
                    e.length &&
                    e.every(
                      (t) =>
                        "string" == typeof t ||
                        t instanceof String ||
                        (t.question_text &&
                          ("string" == typeof t.question_text ||
                            t.question_text instanceof String))
                    )
                  ) {
                    const r = {
                      instrument_name: o,
                      questions: e.map((t, e) => ({
                        question_no: t.question_no || e,
                        question_text: t.question_text || t,
                      })),
                    };
                    return t + "import/" + g(JSON.stringify(r), !0);
                  }
                  throw new Error(
                    "questions is not properly formatted - it must be an array of question texts, or an array of objects which each must have a question_text property"
                  );
                };
              class o extends HTMLElement {
                constructor() {
                  super(),
                    (this._questions = []),
                    (this._instrument_name = "Imported Instrument"),
                    (this._size = "26px"),
                    this.attachShadow({ mode: "open" }),
                    (this.shadowRoot.innerHTML = `\n              <style>\n                 #harmony-link {\n                    background-image: url("data:image/png;base64,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");\n                    display: block;\n                    max-height: 180px;\n                    max-width: 180px;\n                    font-size: 0;\n                    background-size: cover;\n                    background-repeat: no-repeat;\n                    background-position: center center;\n                    flex-shrink: 0;\n                    } \n                    .format-error {\n                    display: block;\n                    color: red;\n                    font-size: 2rem!important;\n                    flex-shrink: 0;\n                    } \n              </style>\n              <a target="${t}" id="harmony-link"></a>\n          `);
                }
                get size() {
                  return this._size;
                }
                set size(t) {
                  this._size = t;
                }
                get questions() {
                  return this._questions;
                }
                set questions(t) {
                  this._questions = t;
                }
                get instrument_name() {
                  return this._instrument_name;
                }
                set instrument_name(t) {
                  this._instrument_name = t;
                }
                connectedCallback() {
                  let t;
                  try {
                    (t = JSON.parse(this.getAttribute("questions"))),
                      Array.isArray(t) ||
                        (console.log("Could not parse question attibutes"),
                        (t = null));
                  } catch (t) {
                    console.log("Could not parse question attibutes");
                  }
                  const o = this.getAttribute("instrument_name"),
                    r = this.getAttribute("size") || this._size,
                    n = t || this._questions,
                    a = o || this._instrument_name;
                  try {
                    console.log("WCquestions", n), console.log("WClabel", a);
                    const t = e({ questions: n, instrument_name: a });
                    console.log("WCurl", a),
                      (this.shadowRoot.getElementById("harmony-link").href = t),
                      (this.shadowRoot.getElementById(
                        "harmony-link"
                      ).style.width = r),
                      (this.shadowRoot.getElementById(
                        "harmony-link"
                      ).style.height = r);
                  } catch (t) {
                    (this.shadowRoot.getElementById("harmony-link").text = t),
                      (this.shadowRoot.getElementById(
                        "harmony-link"
                      ).classList.add = "format-error");
                  }
                }
              }
              return (
                customElements.define("harmony-export", o),
                (window.HarmonyExportComponent = o),
                (window.createHarmonyUrl = e),
                { createHarmonyUrl: e, HarmonyExportComponent: o }
              );
            }),
            "object" == typeof exports
              ? (t.exports = d())
              : "function" == typeof define && o.amdO
              ? define(d)
              : ((c =
                  "undefined" != typeof globalThis
                    ? globalThis
                    : c || self).HarmonyExport = d());
        },
      },
      e = {};
    function o(r) {
      var n = e[r];
      if (void 0 !== n) return n.exports;
      var a = (e[r] = { id: r, loaded: !1, exports: {} });
      return t[r](a, a.exports, o), (a.loaded = !0), a.exports;
    }
    return (
      (o.amdO = {}),
      (o.hmd = (t) => (
        (t = Object.create(t)).children || (t.children = []),
        Object.defineProperty(t, "exports", {
          enumerable: !0,
          set: () => {
            throw new Error(
              "ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: " +
                t.id
            );
          },
        }),
        t
      )),
      (o.r = (t) => {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(t, "__esModule", { value: !0 });
      }),
      o(113)
    );
  })()
);
