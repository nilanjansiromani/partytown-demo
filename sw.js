(() => {
  var b = (e, ...t) =>
      e
        .reduce((r, n, i) => r + n + (t[i] || ""), "")
        .replace(/(?:\n(?:\s*))+/g, " ")
        .trim(),
    N = ((e) => (
      (e[(e.SILENT = 0)] = "SILENT"),
      (e[(e.ERROR = 1)] = "ERROR"),
      (e[(e.WARN = 2)] = "WARN"),
      (e[(e.LOG = 3)] = "LOG"),
      (e[(e.DEBUG = 4)] = "DEBUG"),
      e
    ))(N || {}),
    me = {
      debug: "#7f8c8d",
      log: "#3498db",
      warn: "#f39c12",
      error: "#c0392b",
      groupCollapsed: "#ae4292",
    },
    P = 2,
    z = "worker",
    J = (e) => P !== 0 && P <= e,
    be = (e) => {
      P = e;
    },
    we = () => ({ level: P, name: N[P] }),
    ye = (e) => {
      z = e;
    },
    ve = () => z,
    X = 4,
    x = function (e, t, r) {
      let n = e.includes("group") ? X : N[e.toUpperCase()];
      if (!J(n)) return;
      if (!r) {
        console[e](...t);
        return;
      }
      let i = [
        `%c${z}`,
        `background: ${me[e]}; color: white; padding: 2px 0.5em; border-radius: 0.5em;`,
      ];
      console[e](...i, ...t);
    },
    Ee = (...e) => x("debug", e, !0),
    Ce = (...e) => x("log", e, !0),
    Le = (...e) => x("warn", e, !0),
    Ae = (...e) => x("error", e, !0);
  function ke(e) {
    let t = [];
    return {
      debug: (...d) => t.push(["debug", d]),
      log: (...d) => t.push(["log", d]),
      warn: (...d) => t.push(["warn", d]),
      error: (...d) => t.push(["error", d]),
      end: () => {
        x("groupCollapsed", [e], !0);
        for (let [d, p] of t) x(d, p, !1);
        J(X) && console.groupEnd();
      },
    };
  }
  var h = {
    debug: Ee,
    log: Ce,
    warn: Le,
    error: Ae,
    LogGroup: ke,
    LogLevels: N,
    setLogLevel: be,
    getLogLevel: we,
    setLogPrefix: ye,
    getLogPrefix: ve,
  };
  function Ie(e) {
    let t = !0,
      r = e.length;
    for (let s = 0; s < r; s++)
      if (e.charCodeAt(s) > 127) {
        t = !1;
        break;
      }
    let n = 0,
      i = new Uint8Array(e.length * (t ? 1 : 4));
    for (let s = 0; s !== r; s++) {
      let o = e.charCodeAt(s);
      if (o < 128) {
        i[n++] = o;
        continue;
      }
      if (o < 2048) i[n++] = (o >> 6) | 192;
      else {
        if (o > 55295 && o < 56320) {
          if (++s >= r)
            throw new Error("UTF-8 encode: incomplete surrogate pair");
          let d = e.charCodeAt(s);
          if (d < 56320 || d > 57343)
            throw new Error(
              "UTF-8 encode: second surrogate character 0x" +
                d.toString(16) +
                " at index " +
                s +
                " out of range"
            );
          (o = 65536 + ((o & 1023) << 10) + (d & 1023)),
            (i[n++] = (o >> 18) | 240),
            (i[n++] = ((o >> 12) & 63) | 128);
        } else i[n++] = (o >> 12) | 224;
        i[n++] = ((o >> 6) & 63) | 128;
      }
      i[n++] = (o & 63) | 128;
    }
    return t ? i : i.subarray(0, n);
  }
  function xe(e, t, r) {
    let n = t,
      i = "";
    for (r += t; n < r; ) {
      let s = e[n++];
      if (s > 127)
        if (s > 191 && s < 224) {
          if (n >= r)
            throw new Error("UTF-8 decode: incomplete 2-byte sequence");
          s = ((s & 31) << 6) | (e[n++] & 63);
        } else if (s > 223 && s < 240) {
          if (n + 1 >= r)
            throw new Error("UTF-8 decode: incomplete 3-byte sequence");
          s = ((s & 15) << 12) | ((e[n++] & 63) << 6) | (e[n++] & 63);
        } else if (s > 239 && s < 248) {
          if (n + 2 >= r)
            throw new Error("UTF-8 decode: incomplete 4-byte sequence");
          s =
            ((s & 7) << 18) |
            ((e[n++] & 63) << 12) |
            ((e[n++] & 63) << 6) |
            (e[n++] & 63);
        } else
          throw new Error(
            "UTF-8 decode: unknown multibyte start 0x" +
              s.toString(16) +
              " at index " +
              (n - 1)
          );
      if (s <= 65535) i += String.fromCharCode(s);
      else if (s <= 1114111)
        (s -= 65536),
          (i += String.fromCharCode((s >> 10) | 55296)),
          (i += String.fromCharCode((s & 1023) | 56320));
      else
        throw new Error(
          "UTF-8 decode: code point 0x" +
            s.toString(16) +
            " exceeds UTF-16 reach"
        );
    }
    return i;
  }
  function Ue(e) {
    let r,
      n,
      i = new Uint8Array(128),
      s = 0;
    return o(e), i.subarray(0, s);
    function o(c) {
      switch (typeof c) {
        case "undefined":
          d();
          break;
        case "boolean":
          p(c);
          break;
        case "number":
          m(c);
          break;
        case "string":
          w(c);
          break;
        case "object":
          c === null
            ? d()
            : c instanceof Date
            ? a(c)
            : Array.isArray(c)
            ? v(c)
            : c instanceof Uint8Array || c instanceof Uint8ClampedArray
            ? E(c)
            : c instanceof Int8Array ||
              c instanceof Int16Array ||
              c instanceof Uint16Array ||
              c instanceof Int32Array ||
              c instanceof Uint32Array ||
              c instanceof Float32Array ||
              c instanceof Float64Array
            ? v(c)
            : D(c);
          break;
        default:
      }
    }
    function d() {
      g(192);
    }
    function p(c) {
      g(c ? 195 : 194);
    }
    function m(c) {
      if (isFinite(c) && Math.floor(c) === c)
        if (c >= 0 && c <= 127) g(c);
        else if (c < 0 && c >= -32) g(c);
        else if (c > 0 && c <= 255) f([204, c]);
        else if (c >= -128 && c <= 127) f([208, c]);
        else if (c > 0 && c <= 65535) f([205, c >>> 8, c]);
        else if (c >= -32768 && c <= 32767) f([209, c >>> 8, c]);
        else if (c > 0 && c <= 4294967295)
          f([206, c >>> 24, c >>> 16, c >>> 8, c]);
        else if (c >= -2147483648 && c <= 2147483647)
          f([210, c >>> 24, c >>> 16, c >>> 8, c]);
        else if (c > 0 && c <= 18446744073709552e3) {
          let l = c / 4294967296,
            u = c % 4294967296;
          f([
            211,
            l >>> 24,
            l >>> 16,
            l >>> 8,
            l,
            u >>> 24,
            u >>> 16,
            u >>> 8,
            u,
          ]);
        } else
          c >= -9223372036854776e3 && c <= 9223372036854776e3
            ? (g(211), A(c))
            : c < 0
            ? f([211, 128, 0, 0, 0, 0, 0, 0, 0])
            : f([207, 255, 255, 255, 255, 255, 255, 255, 255]);
      else
        n || ((r = new ArrayBuffer(8)), (n = new DataView(r))),
          n.setFloat64(0, c),
          g(203),
          f(new Uint8Array(r));
    }
    function w(c) {
      let l = Ie(c),
        u = l.length;
      u <= 31
        ? g(160 + u)
        : u <= 255
        ? f([217, u])
        : u <= 65535
        ? f([218, u >>> 8, u])
        : f([219, u >>> 24, u >>> 16, u >>> 8, u]),
        f(l);
    }
    function v(c) {
      let l = c.length;
      l <= 15
        ? g(144 + l)
        : l <= 65535
        ? f([220, l >>> 8, l])
        : f([221, l >>> 24, l >>> 16, l >>> 8, l]);
      for (let u = 0; u < l; u++) o(c[u]);
    }
    function E(c) {
      let l = c.length;
      l <= 15
        ? f([196, l])
        : l <= 65535
        ? f([197, l >>> 8, l])
        : f([198, l >>> 24, l >>> 16, l >>> 8, l]),
        f(c);
    }
    function D(c) {
      let l = Object.keys(c).length;
      l <= 15
        ? g(128 + l)
        : l <= 65535
        ? f([222, l >>> 8, l])
        : f([223, l >>> 24, l >>> 16, l >>> 8, l]);
      for (let u in c) o(u), o(c[u]);
    }
    function a(c) {
      let l = c.getTime() / 1e3;
      if (c.getMilliseconds() === 0 && l >= 0 && l < 4294967296)
        f([214, 255, l >>> 24, l >>> 16, l >>> 8, l]);
      else if (l >= 0 && l < 17179869184) {
        let u = c.getMilliseconds() * 1e6;
        f([
          215,
          255,
          u >>> 22,
          u >>> 14,
          u >>> 6,
          ((u << 2) >>> 0) | (l / 4294967296),
          l >>> 24,
          l >>> 16,
          l >>> 8,
          l,
        ]);
      } else {
        let u = c.getMilliseconds() * 1e6;
        f([199, 12, 255, u >>> 24, u >>> 16, u >>> 8, u]), A(l);
      }
    }
    function g(c) {
      if (i.length < s + 1) {
        let l = i.length * 2;
        for (; l < s + 1; ) l *= 2;
        let u = new Uint8Array(l);
        u.set(i), (i = u);
      }
      (i[s] = c), s++;
    }
    function f(c) {
      if (i.length < s + c.length) {
        let l = i.length * 2;
        for (; l < s + c.length; ) l *= 2;
        let u = new Uint8Array(l);
        u.set(i), (i = u);
      }
      i.set(c, s), (s += c.length);
    }
    function A(c) {
      let l, u;
      c >= 0
        ? ((l = c / 4294967296), (u = c % 4294967296))
        : (c++,
          (l = Math.abs(c) / 4294967296),
          (u = Math.abs(c) % 4294967296),
          (l = ~l),
          (u = ~u)),
        f([l >>> 24, l >>> 16, l >>> 8, l, u >>> 24, u >>> 16, u >>> 8, u]);
    }
  }
  function Re(e) {
    let r = 0;
    if (
      (e instanceof ArrayBuffer && (e = new Uint8Array(e)),
      typeof e != "object" || typeof e.length > "u")
    )
      throw new Error(
        "Invalid argument type: Expected a byte array (Array or Uint8Array) to deserialize."
      );
    if (!e.length)
      throw new Error(
        "Invalid argument: The byte array to deserialize is empty."
      );
    e instanceof Uint8Array || (e = new Uint8Array(e));
    let n = i();
    return r < e.length, n;
    function i() {
      let a = e[r++];
      if (a >= 0 && a <= 127) return a;
      if (a >= 128 && a <= 143) return m(a - 128);
      if (a >= 144 && a <= 159) return w(a - 144);
      if (a >= 160 && a <= 191) return v(a - 160);
      if (a === 192) return null;
      if (a === 193) throw new Error("Invalid byte code 0xc1 found.");
      if (a === 194) return !1;
      if (a === 195) return !0;
      if (a === 196) return p(-1, 1);
      if (a === 197) return p(-1, 2);
      if (a === 198) return p(-1, 4);
      if (a === 199) return E(-1, 1);
      if (a === 200) return E(-1, 2);
      if (a === 201) return E(-1, 4);
      if (a === 202) return d(4);
      if (a === 203) return d(8);
      if (a === 204) return o(1);
      if (a === 205) return o(2);
      if (a === 206) return o(4);
      if (a === 207) return o(8);
      if (a === 208) return s(1);
      if (a === 209) return s(2);
      if (a === 210) return s(4);
      if (a === 211) return s(8);
      if (a === 212) return E(1);
      if (a === 213) return E(2);
      if (a === 214) return E(4);
      if (a === 215) return E(8);
      if (a === 216) return E(16);
      if (a === 217) return v(-1, 1);
      if (a === 218) return v(-1, 2);
      if (a === 219) return v(-1, 4);
      if (a === 220) return w(-1, 2);
      if (a === 221) return w(-1, 4);
      if (a === 222) return m(-1, 2);
      if (a === 223) return m(-1, 4);
      if (a >= 224 && a <= 255) return a - 256;
      throw (
        (console.debug("Byte Array:", e),
        new Error(b`
      Invalid byte value "${a.toString()}" at index "${(r - 1).toString()} 
      in the binary data (length ${e.length.toString()}): 
      Expecting a range of 0 to 255. This is not a byte array.
    `))
      );
    }
    function s(a) {
      let g = 0,
        f = !0;
      for (; a-- > 0; )
        if (f) {
          let A = e[r++];
          (g += A & 127), A & 128 && (g -= 128), (f = !1);
        } else (g *= 256), (g += e[r++]);
      return g;
    }
    function o(a) {
      let g = 0;
      for (; a-- > 0; ) (g *= 256), (g += e[r++]);
      return g;
    }
    function d(a) {
      let g = new DataView(e.buffer, r + e.byteOffset, a);
      if (((r += a), a === 4)) return g.getFloat32(0, !1);
      if (a === 8) return g.getFloat64(0, !1);
    }
    function p(a, g) {
      a < 0 && (a = o(g));
      let f = e.subarray(r, r + a);
      return (r += a), f;
    }
    function m(a, g) {
      a < 0 && (a = o(g));
      let f = {};
      for (; a-- > 0; ) {
        let A = i();
        f[A] = i();
      }
      return f;
    }
    function w(a, g) {
      a < 0 && (a = o(g));
      let f = [];
      for (; a-- > 0; ) f.push(i());
      return f;
    }
    function v(a, g) {
      a < 0 && (a = o(g));
      let f = r;
      return (r += a), xe(e, f, a);
    }
    function E(a, g) {
      a < 0 && (a = o(g));
      let f = o(1),
        A = p(a);
      switch (f) {
        case 255:
          return D(A);
        default:
      }
      return { type: f, data: A };
    }
    function D(a) {
      if (a.length === 4) {
        let g =
          ((a[0] << 24) >>> 0) +
          ((a[1] << 16) >>> 0) +
          ((a[2] << 8) >>> 0) +
          a[3];
        return new Date(g * 1e3);
      }
      if (a.length === 8) {
        let g =
            ((a[0] << 22) >>> 0) +
            ((a[1] << 14) >>> 0) +
            ((a[2] << 6) >>> 0) +
            (a[3] >>> 2),
          f =
            (a[3] & 3) * 4294967296 +
            ((a[4] << 24) >>> 0) +
            ((a[5] << 16) >>> 0) +
            ((a[6] << 8) >>> 0) +
            a[7];
        return new Date(f * 1e3 + g / 1e6);
      }
      if (a.length === 12) {
        let g =
          ((a[0] << 24) >>> 0) +
          ((a[1] << 16) >>> 0) +
          ((a[2] << 8) >>> 0) +
          a[3];
        r -= 8;
        let f = s(8);
        return new Date(f * 1e3 + g / 1e6);
      }
      throw new Error("Invalid data length for a date value.");
    }
  }
  function De(e, t) {
    let r = e.length - 2;
    if (
      (r &&
        (r & (r - 1)) === 0 &&
        e[0] === "0" &&
        e[1] === "x" &&
        (e = e.substr(2, e.length)),
      e.length <= 16)
    )
      throw new Error(`Expected n to be at least length 16, got ${e.length}.`);
    t = t * 2;
    let i = t * 8,
      s = i + 8;
    return `0x${e.slice(i, s + 8)}`;
  }
  var V = { posToHex: De, encode: Ue, decode: Re },
    Pe = [
      "RESERVED",
      "image",
      "video",
      "audio",
      "stylesheet",
      "font",
      "application",
      "archive",
      "document",
      "html",
      "UNALLOC10",
      "UNALLOC11",
      "UNALLOC12",
      "UNALLOC13",
      "UNALLOC14",
      "shopify",
      "UNALLOC16",
      "UNALLOC17",
      "UNALLOC18",
      "UNALLOC19",
      "lite",
      "UNALLOC21",
      "UNALLOC22",
      "UNALLOC23",
      "UNALLOC24",
      "UNALLOC25",
      "UNALLOC26",
      "UNALLOC27",
      "UNALLOC28",
      "prefetch",
      "disable",
      "pause",
    ];
  function S(e) {
    let t = (e >>> 0)
        .toString(2)
        .padStart(32, "0")
        .split("")
        .map((n) => parseInt(n, 10)),
      r = {};
    return (
      t.forEach((n, i) => {
        let s = Pe[i];
        s.indexOf("UNALLOC") > -1 || s === "RESERVED" || (r[s] = !!n);
      }),
      r
    );
  }
  var U = ((e) => (
      (e[(e.INITIALIZE = 0)] = "INITIALIZE"),
      (e[(e.SET_ENCODED = 1)] = "SET_ENCODED"),
      (e[(e.SET_LOG_LEVEL = 2)] = "SET_LOG_LEVEL"),
      (e[(e.DISABLE = 3)] = "DISABLE"),
      e
    ))(U || {}),
    ee = "edgemesh/assets",
    te = "edgemesh";
  var y = (e) => {
    let {
      origin: t,
      pathname: r,
      searchParams: n,
      href: i,
    } = new URL(e, location.origin);
    if (t === location.origin) {
      let s = n.toString();
      return `${r}${s && "?"}${s}`;
    }
    return i;
  };
  var Ne = 900;
  function re(e) {
    let t = e.request;
    if (
      t.headers.has("Range") ||
      !self.edgemesh.enabled ||
      (t.cache === "only-if-cached" && t.mode !== "same-origin")
    )
      return;
    let r = new URL(t.url);
    if (r.pathname.startsWith("/em-cgi/")) return;
    let n = r.searchParams.get("em-bypass");
    if (
      (n && (n === "client" || n === "all")) ||
      r.pathname.startsWith("/wp-admin") ||
      r.searchParams.has("preview")
    )
      return;
    if (!r.protocol.startsWith("http")) {
      h.debug(b`
      Edgemesh Router only supports http and https protocols.
      The protocol '${r.protocol}' has been ignored for
      '${y(r.href)}'.`);
      return;
    }
    let i = `${r.origin}${r.pathname}`;
    if (self.edgemesh.database.isSkippedUrl(i)) {
      h.debug(b`
      The URL '${y(r.href)}' was previously determined to be not
      cache eligible. Skipping this resource.
    `);
      return;
    }
    for (let s of self.edgemesh.plugins)
      if (s.match(t)) return e.respondWith(s.handler(e));
    if (t.method === "GET") {
      if (
        self.edgemesh.config.html &&
        (t.mode === "navigate" || t.headers.get("purpose") === "em-prefetch")
      )
        return e.respondWith(self.edgemesh.strategy.handleRequest(e, !0, Ne));
      if (self.edgemesh.resourceRegex.exec(r.href))
        return e.respondWith(self.edgemesh.strategy.handleRequest(e));
    }
  }
  var Se = (e, t) => t.some((r) => e instanceof r),
    se,
    ne;
  function Te() {
    return (
      se ||
      (se = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
    );
  }
  function Oe() {
    return (
      ne ||
      (ne = [
        IDBCursor.prototype.advance,
        IDBCursor.prototype.continue,
        IDBCursor.prototype.continuePrimaryKey,
      ])
    );
  }
  var ie = new WeakMap(),
    G = new WeakMap(),
    oe = new WeakMap(),
    W = new WeakMap(),
    _ = new WeakMap();
  function $e(e) {
    let t = new Promise((r, n) => {
      let i = () => {
          e.removeEventListener("success", s),
            e.removeEventListener("error", o);
        },
        s = () => {
          r(L(e.result)), i();
        },
        o = () => {
          n(e.error), i();
        };
      e.addEventListener("success", s), e.addEventListener("error", o);
    });
    return (
      t
        .then((r) => {
          r instanceof IDBCursor && ie.set(r, e);
        })
        .catch(() => {}),
      _.set(t, e),
      t
    );
  }
  function Be(e) {
    if (G.has(e)) return;
    let t = new Promise((r, n) => {
      let i = () => {
          e.removeEventListener("complete", s),
            e.removeEventListener("error", o),
            e.removeEventListener("abort", o);
        },
        s = () => {
          r(), i();
        },
        o = () => {
          n(e.error || new DOMException("AbortError", "AbortError")), i();
        };
      e.addEventListener("complete", s),
        e.addEventListener("error", o),
        e.addEventListener("abort", o);
    });
    G.set(e, t);
  }
  var H = {
    get(e, t, r) {
      if (e instanceof IDBTransaction) {
        if (t === "done") return G.get(e);
        if (t === "objectStoreNames") return e.objectStoreNames || oe.get(e);
        if (t === "store")
          return r.objectStoreNames[1]
            ? void 0
            : r.objectStore(r.objectStoreNames[0]);
      }
      return L(e[t]);
    },
    set(e, t, r) {
      return (e[t] = r), !0;
    },
    has(e, t) {
      return e instanceof IDBTransaction && (t === "done" || t === "store")
        ? !0
        : t in e;
    },
  };
  function ae(e) {
    H = e(H);
  }
  function Me(e) {
    return e === IDBDatabase.prototype.transaction &&
      !("objectStoreNames" in IDBTransaction.prototype)
      ? function (t, ...r) {
          let n = e.call(T(this), t, ...r);
          return oe.set(n, t.sort ? t.sort() : [t]), L(n);
        }
      : Oe().includes(e)
      ? function (...t) {
          return e.apply(T(this), t), L(ie.get(this));
        }
      : function (...t) {
          return L(e.apply(T(this), t));
        };
  }
  function je(e) {
    return typeof e == "function"
      ? Me(e)
      : (e instanceof IDBTransaction && Be(e),
        Se(e, Te()) ? new Proxy(e, H) : e);
  }
  function L(e) {
    if (e instanceof IDBRequest) return $e(e);
    if (W.has(e)) return W.get(e);
    let t = je(e);
    return t !== e && (W.set(e, t), _.set(t, e)), t;
  }
  var T = (e) => _.get(e);
  function le(
    e,
    t,
    { blocked: r, upgrade: n, blocking: i, terminated: s } = {}
  ) {
    let o = indexedDB.open(e, t),
      d = L(o);
    return (
      n &&
        o.addEventListener("upgradeneeded", (p) => {
          n(L(o.result), p.oldVersion, p.newVersion, L(o.transaction), p);
        }),
      r &&
        o.addEventListener("blocked", (p) => r(p.oldVersion, p.newVersion, p)),
      d
        .then((p) => {
          s && p.addEventListener("close", () => s()),
            i &&
              p.addEventListener("versionchange", (m) =>
                i(m.oldVersion, m.newVersion, m)
              );
        })
        .catch(() => {}),
      d
    );
  }
  function O(e, { blocked: t } = {}) {
    let r = indexedDB.deleteDatabase(e);
    return (
      t && r.addEventListener("blocked", (n) => t(n.oldVersion, n)),
      L(r).then(() => {})
    );
  }
  var Fe = ["get", "getKey", "getAll", "getAllKeys", "count"],
    ze = ["put", "add", "delete", "clear"],
    q = new Map();
  function ce(e, t) {
    if (!(e instanceof IDBDatabase && !(t in e) && typeof t == "string"))
      return;
    if (q.get(t)) return q.get(t);
    let r = t.replace(/FromIndex$/, ""),
      n = t !== r,
      i = ze.includes(r);
    if (
      !(r in (n ? IDBIndex : IDBObjectStore).prototype) ||
      !(i || Fe.includes(r))
    )
      return;
    let s = async function (o, ...d) {
      let p = this.transaction(o, i ? "readwrite" : "readonly"),
        m = p.store;
      return (
        n && (m = m.index(d.shift())),
        (await Promise.all([m[r](...d), i && p.done]))[0]
      );
    };
    return q.set(t, s), s;
  }
  ae((e) => ({
    ...e,
    get: (t, r, n) => ce(t, r) || e.get(t, r, n),
    has: (t, r) => !!ce(t, r) || e.has(t, r),
  }));
  var $ = class {
    name = te;
    version = 1;
    db;
    cache = new Set();
    constructor() {
      (this.db = le(this.name, this.version, {
        upgrade(t) {
          t.createObjectStore("skip"), t.createObjectStore("migrations");
        },
      })),
        (this.cache = new Set()),
        this.seed().catch((t) => {
          h.error("Error seeding skip store.", t);
        });
    }
    async migrate() {
      let t = await this.db;
      switch (await t.get("migrations", "version")) {
        case void 0:
          h.log("\u{1F5C2} Running database migration."),
            await O("edgemesh/queue"),
            await O("edgemesh/skip"),
            await O("edgemesh/config"),
            await t.put("migrations", this.version, "version"),
            h.log(
              "\u2705 Database migration complete. Current version:",
              this.version
            );
      }
    }
    async seed() {
      let r = await (await this.db).getAllKeys("skip");
      for (let n of r) this.cache.add(n);
    }
    async addSkippedUrl(t) {
      this.cache.add(t),
        await (await this.db).put("skip", new Date().toUTCString(), t);
    }
    isSkippedUrl(t) {
      return this.cache.has(t);
    }
  };
  var Ve = 50 * 1024,
    Q = new Set();
  function he(e) {
    Q.add(e), h.log("Registered quota error handler.");
  }
  async function K() {
    h.log(`About to run ${Q.size} callbacks to clean up caches.`);
    for (let e of Q) await e(), h.log("Quota error callback is complete.");
    h.log("Finished running callbacks.");
  }
  async function ue(e) {
    try {
      return navigator.storage && navigator.storage.estimate
        ? navigator.storage.estimate()
        : { quota: Ve, usage: e.currentUsage };
    } catch (t) {
      throw (h.error("Error getting quota: ", t.message), t);
    }
  }
  var Z = "1024",
    R = class {
      cacheName = ee;
      currentUsage = 0;
      ready = !1;
      constructor(t) {
        t && (this.cacheName = t),
          this.getUsage(!0).then(() => {
            this.ready = !0;
          });
      }
      async open() {
        h.log(`Opening cache '${this.cacheName}'.`);
        try {
          let t = await caches.open(this.cacheName);
          return h.log(`Cache '${this.cacheName}' open.`), t;
        } catch (t) {
          h.error(`Error opening cache '${this.cacheName}'.`, t);
        }
      }
      async put(t, r) {
        if (!this.ready) return;
        if (!r) {
          h.error(b`
        Cannot cache non-existent response for
        '${y(t.url)}'.`);
          return;
        }
        if (!r.ok) {
          h.warn(b`
        The response for '${y(t.url)}' returned a status code 
        of '${r.status.toString()}' and will not be cached.
      `);
          return;
        }
        if (r.status === 0) {
          h.warn(b`
        The request for '${y(t.url)}' returned an opaque
        response and will not be cached.`);
          let { origin: p, pathname: m } = new URL(t.url),
            w = `${p}${m}`;
          self.edgemesh.database.addSkippedUrl(w);
          return;
        }
        let { quota: n, usage: i } = await ue(this),
          s = n - i,
          o = parseInt(r.headers.get("content-length") || Z, 10);
        s + o >= n && (await K());
        let d = await caches.open(this.cacheName);
        try {
          await d.put(t, r);
        } catch (p) {
          p.name === "QuotaExceededError" && (await K(), await d.put(t, r));
        }
      }
      async match(t, r) {
        return this.ready
          ? (await caches.open(this.cacheName)).match(t, r)
          : void 0;
      }
      async matchAll(t, r) {
        return this.ready
          ? (await caches.open(this.cacheName)).matchAll(t, r)
          : void 0;
      }
      async delete(t, r) {
        if (!this.ready) return !1;
        let n = await caches.open(this.cacheName),
          i = await n.match(t);
        if (i) {
          let o = parseInt(i.headers.get("content-length") || Z, 10);
          this.currentUsage -= o;
        }
        let s = await n.delete(t, r);
        return s && h.debug(`Cached response for '${y(t.url)}' deleted.`), s;
      }
      async clear() {
        if (!this.ready) return;
        let t = await caches.open(this.cacheName),
          r = await t.keys();
        h.debug(`Clearing ${r.length} cached responses.`);
        for (let n of r) await t.delete(n, { ignoreVary: !0 });
        (this.currentUsage = 0), h.debug(`Cache '${this.cacheName}' cleared.`);
      }
      async clearOldest(t = 40) {
        if (!this.ready) return;
        let r = await caches.open(this.cacheName),
          n = await r.keys(),
          i = await r.matchAll(),
          s = Math.round(i.length * (t / 100));
        h.debug(`Clearing ${s} cached responses.`);
        for (let o = 0; o < s; o++) await r.delete(n[o], { ignoreVary: !0 });
        (this.ready = !1),
          await this.getUsage(!0),
          (this.ready = !0),
          h.debug(`${t}% of cache '${this.cacheName}' cleared.`);
      }
      async getUsage(t = !1) {
        if (!t && !this.ready) return;
        let i = (await (await caches.open(this.cacheName)).matchAll()).reduce(
          (s, o) => s + parseInt(o.headers.get("content-length") || Z, 10),
          0
        );
        return (this.currentUsage = i), i;
      }
    };
  var We = [
      "bmp",
      "bpg",
      "eps",
      "gif",
      "ico",
      "jpeg",
      "jpg",
      "pict",
      "png",
      "svg",
      "svgz",
      "tif",
      "tiff",
      "webp",
    ],
    Ge = [
      "amv",
      "avi",
      "drc",
      "f4bogv",
      "f4p",
      "f4v",
      "flv",
      "gifv",
      "m2v",
      "m4v",
      "mkv",
      "mov",
      "mp2",
      "mp4",
      "mpe",
      "mpeg",
      "mpg",
      "mpv",
      "qt",
      "webm",
      "wmv",
      "3g2",
      "3gp",
    ],
    He = ["css"],
    _e = ["ttf", "otf", "woff", "woff2", "eot"],
    qe = ["js", "swf", "wat", "wasm"],
    Qe = ["doc", "docx", "otf", "pdf", "ppt", "pptx", "ps", "xls", "xlsx"],
    Ke = [
      "apk",
      "bz2",
      "dmg",
      "gz",
      "iso",
      "jar",
      "lz",
      "lzma",
      "rar",
      "tar",
      "tbz2",
      "tgz",
      "tlz",
      "txz",
      "xz",
      "z",
      "zip",
      "zipx",
      "7z",
    ],
    Ze = [
      "aac",
      "aiff",
      "f4a",
      "flac",
      "m4a",
      "m4p",
      "mid",
      "midi",
      "mogg",
      "mp3",
      "ogg",
      "oga",
      "opus",
      "ra",
      "rm",
      "wav",
    ],
    k = {
      IMAGE: We,
      VIDEO: Ge,
      STYLESHEET: He,
      FONT: _e,
      APPLICATION: qe,
      DOCUMENT: Qe,
      ARCHIVE: Ke,
      AUDIO: Ze,
    };
  async function fe() {
    let e = h.LogGroup("Authenticating service worker."),
      t = { v: self.edgemesh.version, t: self.edgemesh.topic };
    e.debug("\u{1F4DD} Data", t),
      e.debug("\u{1F5DC} Encoding authentication message.");
    let r, n;
    self.edgemesh.encoded
      ? ((r = "application/octet-stream"),
        (n = V.encode(t)),
        e.debug(`\u2705 Body binary encoded to ${n.byteLength} bytes.`))
      : ((r = "application/json"),
        (n = JSON.stringify(t)),
        e.debug("\u2705 Body json encoded.")),
      e.log("\u{1F680} Starting fetch.");
    let i;
    try {
      (i = await fetch(`${self.edgemesh.host}/node/check`, {
        method: "POST",
        headers: { Accept: r, "Content-Type": r },
        body: n,
      })),
        e.log(`\u2705 Fetch returned a '${i.status}' response.`),
        e.debug("\u{1F538} Response:", i);
    } catch {
      return (
        e.error(
          "\u274C Network error while authenticating. Disabling service."
        ),
        e.end(),
        self.edgemesh.disable()
      );
    }
    if (!i.ok)
      return (
        e.error(b`
        ❌ Authentication resulted in status '${i.status.toString()}'.
        Disabling service.
      `),
        e.end(),
        self.edgemesh.disable()
      );
    e.debug("\u{1F5DC} Decoding message response.");
    let s;
    try {
      if (self.edgemesh.encoded) {
        let d = await i.arrayBuffer();
        (s = V.decode(new Uint8Array(d))),
          e.debug("\u2705 Binary response decoded.");
      } else (s = await i.json()), e.debug("\u2705 JSON response decoded.");
      e.log("\u{1F4DD} Data:", s);
    } catch (d) {
      return (
        e.error(
          "\u274C Error decoding authentication response. Disabling service.",
          d
        ),
        e.end(),
        self.edgemesh.disable()
      );
    }
    e.log("\u{1F5DC} Decoding config.");
    let o = S(s.config);
    if ((e.debug("\u2699\uFE0F Config:", o), o.disable))
      return (
        e.log("\u26A0\uFE0F Edgemesh is disabled. Disabling service."),
        e.end(),
        self.edgemesh.disable()
      );
    if (o.pause)
      return (
        e.log("\u26A0\uFE0F Edgemesh is pause. Disabling service."),
        e.end(),
        self.edgemesh.disable()
      );
    if (o.lite)
      return (
        e.log("\u26A0\uFE0F Edgemesh is in lite mode. Disabling service."),
        e.end(),
        self.edgemesh.disable()
      );
    e.log("\u{1F44D} Authentication complete."), e.end();
  }
  var I = "edgemesh/shopify",
    B = new R(I),
    Ye = 60 * 60 * 7;
  function Y() {
    return new Request("/cart");
  }
  async function Je(e) {
    let t = e.request,
      r = new URL(t.url);
    if (
      t.method === "GET" &&
      (r.pathname.includes("/cart.js") || r.pathname.includes("/cart.json"))
    ) {
      let n = h.LogGroup(`Router handling request for '${y(t.url)}'.`),
        i = Y(),
        s = await B.match(i, { ignoreSearch: !0, ignoreVary: !0 });
      if (s) {
        n.log(b`
        🔎 Found a cached response in the '${I}' cache.
      `),
          n.debug("\u{1F4E4} Cache:", s),
          n.log("\u{1F52C} Checking cached response time to live.");
        let w = new Date(),
          v = new Date(s.headers.get("date"));
        if ((w.getTime() - v.getTime()) / 1e3 < Ye)
          return n.log("\u2705 Using cached response."), n.end(), s;
        n.log("\u{1F4A2} Cached response is expired. Using network response.");
      } else
        n.log(b`
        🚫 No response found in the '${I}' cache.
        Will respond with a network request.
      `);
      let o;
      try {
        o = await fetch(t);
      } catch (w) {
        throw (
          (n.error("\u274C Unable to get a response from the network.", w),
          n.end(),
          w)
        );
      }
      let [d, p] = o.body.tee();
      if (o.ok) {
        n.log("\u{1F50E} Received", o.status, "response from network."),
          n.debug("\u{1F4E5} Network:", o);
        let w = new Response(p, o);
        w.headers.set("x-edgemesh-client", "cached"),
          w.headers.append(
            "server-timing",
            'emc-cache;desc="[EM] Client Cached"'
          ),
          e.waitUntil(B.put(i, w));
      } else
        n.warn(b`
        ❌ Network request resulted in an error with status code
        '${o.status.toString()}'. Deleting any cached resources.
      `);
      let m = new Response(d, o);
      return (
        m.headers.set("x-edgemesh-client", "origin"),
        m.headers.append(
          "server-timing",
          'emc-origin;desc="[EM] Client Origin"'
        ),
        n.log("\u2705 Using network response."),
        n.end(),
        m
      );
    }
    if (t.method !== "GET" && r.pathname.includes("/cart/")) {
      let n = h.LogGroup(`Router handling request for '${y(t.url)}'.`);
      n.log(b`
      🛒 Cart action detected. Deleting cached
      response in the '${I}' cache.
    `),
        e.waitUntil(B.delete(Y()));
      let i;
      try {
        i = await fetch(t);
      } catch (o) {
        throw (
          (n.error("\u274C Unable to get a response from the network.", o),
          n.end(),
          o)
        );
      }
      if (
        (n.log("\u{1F50E} Received", i.status, "response from network."),
        n.debug("\u{1F4E5} Network:", i),
        n.log("\u2705 Using network response."),
        n.end(),
        !i.ok)
      )
        return i;
      let s = new Response(i.body, i);
      return (
        s.headers.set("x-edgemesh-client", "origin"),
        s.headers.append(
          "server-timing",
          'emc-origin;desc="[EM] Client Origin"'
        ),
        s
      );
    }
  }
  var M = class {
    install(t) {
      h.log(b`
      ⚡️ Install event detected. Deleting cached
      response in the '${I}' cache.
    `),
        t.waitUntil(B.delete(Y()));
    }
    match(t) {
      if (!self.edgemesh.config.shopify) return !1;
      let r = new URL(t.url);
      return t.method === "GET" &&
        (r.pathname.includes("/cart.js") || r.pathname.includes("/cart.json"))
        ? !0
        : t.method !== "GET" && r.pathname.includes("/cart/");
    }
    async handler(t) {
      return Je(t);
    }
  };
  function de(e) {
    let t = {},
      r = e
        .toLowerCase()
        .split(",")
        .map((n) =>
          n
            .trim()
            .split("=")
            .map((i) => i.trim())
        );
    for (let [n, i] of r)
      switch (n) {
        case "max-age": {
          let s = parseInt(i, 10);
          if (isNaN(s)) continue;
          t.maxAge = s;
          break;
        }
        case "s-maxage": {
          let s = parseInt(i, 10);
          if (isNaN(s)) continue;
          t.sMaxAge = s;
          break;
        }
        case "stale-while-revalidate": {
          let s = parseInt(i, 10);
          if (isNaN(s)) continue;
          t.staleWhileRevalidate = s;
          break;
        }
        case "stale-if-error": {
          let s = parseInt(i, 10);
          if (isNaN(s)) continue;
          t.staleIfError = s;
          break;
        }
        case "public":
          t.public = !0;
          break;
        case "private":
          t.private = !0;
          break;
        case "no-store":
          t.noStore = !0;
          break;
        case "no-cache":
          t.noCache = !0;
          break;
        case "must-revalidate":
          t.mustRevalidate = !0;
          break;
        case "proxy-revalidate":
          t.proxyRevalidate = !0;
          break;
        case "immutable":
          t.immutable = !0;
          break;
        case "no-transform":
          t.noTransform = !0;
          break;
      }
    return t;
  }
  var Xe = [204, 205, 304],
    et = (e, t, r) =>
      new Request(e.url, {
        mode: t,
        credentials: r,
        body: e.body,
        method: e.method,
        referrer: e.referrer,
        referrerPolicy: e.referrerPolicy,
        signal: e.signal,
        cache: e.cache,
        redirect: e.redirect,
        integrity: e.integrity,
        keepalive: e.keepalive,
        headers: e.headers,
      }),
    ge = (e) => new Promise((t, r) => e.then(r, t)),
    tt = (e) => ge(Promise.all(e.map(ge))),
    j = class {
      hostname;
      constructor() {
        let { hostname: t } = new URL(self.registration.scope);
        this.hostname = t;
      }
      async handleRequest(t, r = !1, n) {
        let i = t.request,
          s = h.LogGroup(`Router handling request for '${y(i.url)}'.`),
          o = this.getFromCache(i, s, r, n),
          d = this.getFromOrigin(i, s, r);
        try {
          let p = await tt([o, d]);
          return s.end(), p;
        } catch (p) {
          s.error(p);
          let m = new Response(
            "This request resulted in a network or worker error.",
            {
              status: 444,
              statusText: "Network or Worker Error",
              headers: { "X-Errors": p.map((w) => w.message).join(", ") },
            }
          );
          return s.end(), m;
        }
      }
      async getFromCache(t, r, n, i) {
        let s = await self.edgemesh.cache.match(t, { ignoreVary: n });
        if (s) {
          if (
            (r.log(b`
        🔎 Found a cached response in the '${self.edgemesh.cache.cacheName}' cache.
      `),
            r.debug("\u{1F4E4} Cache:", s),
            i)
          ) {
            r.log("\u{1F52C} Checking cached response time to live.");
            let o = new Date(),
              d = new Date(s.headers.get("date"));
            if ((o.getTime() - d.getTime()) / 1e3 > i)
              throw (
                (r.log(
                  "\u{1F4A2} Cached response is expired. Using network response."
                ),
                new Error())
              );
          }
          return r.log("\u2705 Using cached response."), s;
        } else
          throw (
            (r.log(b`
        🚫 No response found in the '${self.edgemesh.cache.cacheName}' cache.
        Will respond with a network request.
      `),
            new Error())
          );
      }
      async getFromOrigin(t, r, n) {
        let i = new URL(t.url),
          s = i.hostname !== this.hostname,
          o;
        if (s)
          try {
            o = await fetch(et(t, "cors", "omit"));
          } catch {
            h.warn(b`
          The asset "${y(i.toString())}" is hosted on an origin
          that does NOT allow Cross Origin Access. Edgemesh has serviced the
          request, but cannot access the details of the asset safely. As a
          result, this asset will incur a performance hit because it is not a
          candidate for caching by any caching engine. If possible you should
          either: set the Access-Control-Allow-Origin header to "*" on the
          hosting origin "${i.hostname}" or host the asset from your own
          origin "${this.hostname}". The asset has also been added to the local
          skip list so you should not see this error again.
        `);
            let w = `${i.origin}${i.pathname}`;
            self.edgemesh.database.addSkippedUrl(w);
            try {
              return fetch(t);
            } catch (v) {
              throw (
                (r.error(
                  "\u274C Unable to get a response from the network.",
                  v
                ),
                v)
              );
            }
          }
        else
          try {
            o = await fetch(t);
          } catch (m) {
            throw (
              (r.error("\u274C Unable to get a response from the network.", m),
              m)
            );
          }
        let d = o.headers.get("x-edgemesh-server");
        if (n && d && d.startsWith("miss")) return o;
        if (o.status === 0) {
          h.warn(b`
        The request for '${y(t.url)}' returned an opaque
        response and will not be cached.`);
          let { origin: m, pathname: w } = new URL(t.url),
            v = `${m}${w}`;
          return self.edgemesh.database.addSkippedUrl(v), o;
        }
        let p = Xe.includes(o.status) ? null : o.body;
        if (((o = new Response(p, o)), o.ok && o.body)) {
          r.log("\u{1F50E} Received", o.status, "response from network."),
            r.debug("\u{1F4E5} Network:", o),
            o.headers.set("x-edgemesh-client", "origin"),
            o.headers.set("timing-allow-origin", "*");
          let m = o.headers.get("cache-control");
          if (!m)
            return (
              h.warn(b`
          Edgemesh has detected an asset '${y(t.url)}' with no
          cache-control header. Edgemesh takes the cache-control header into
          account when revalidating assets. We have assumed you do not want this
          asset cached. If that is the case, you should set your header to
          'no-cache'. Setting the cache-control header will hide this warning.`),
              o
            );
          let { noStore: w, maxAge: v } = de(m);
          if (w)
            return (
              h.debug(b`
          Edgemesh has detected an asset '${y(t.url)}' with
          cache control directive "no-store". This asset will not be cached.
        `),
              o
            );
          if (v === 0)
            return (
              h.warn(b`
          Edgemesh has detected an asset "${y(t.url)}" with
          the cache-control header "${m}". Since max-age is set to
          0, we have assumed that you do not want this asset cached. If that
          is the case, you should set your header to "no-store" instead.
          Otherwise, set max age to something more sensible like 3600 (1 hour).
          Making either of these corrections will hide this warning.`),
              o
            );
          let E = o.clone();
          E.headers.delete("set-cookie"),
            E.headers.set("x-edgemesh-client", "cached"),
            E.headers.append(
              "server-timing",
              'emc-cache;desc="[EM] Client Cached"'
            ),
            self.edgemesh.cache.put(t, E).catch((D) => {
              h.error(
                b`
          Error attempting to cache response for '${y(t.url)}'.
        `,
                D
              );
            });
        } else
          o.ok ||
            (r.warn(b`
        ❌ Network request resulted in an error with status code
        '${o.status.toString()}'. Deleting any cached resources.
      `),
            self.edgemesh.cache.delete(t, { ignoreVary: n }).catch((m) => {
              h.error(
                b`
          Error attempting to delete cached 
          response for '${y(t.url)}'.
        `,
                m
              );
            }));
        return (
          r.log("\u2705 Using network response."),
          o.headers.append(
            "server-timing",
            'emc-origin;desc="[EM] Client Origin"'
          ),
          o
        );
      }
    };
  var pe = "5.4.0";
  var F = class {
    version = pe;
    enabled;
    topic;
    host;
    configBitmask = 0;
    config;
    encoded;
    messageEvents = new Map();
    resourceRegex;
    database = new $();
    cache = new R();
    strategy = new j();
    plugins = [new M()];
    constructor() {
      self.addEventListener("message", (t) => {
        let { event: r, data: n } = t.data,
          i = this.messageEvents.get(r);
        i && i(n);
      }),
        self.addEventListener("fetch", re),
        he(this.cache.clearOldest);
    }
    migrate() {
      self.addEventListener("install", (t) => {
        this.database.migrate();
        for (let r of this.plugins) r.install(t);
      });
    }
    skipWaiting() {
      self.addEventListener("install", () => self.skipWaiting());
    }
    clientsClaim() {
      self.addEventListener("activate", () => self.clients.claim());
    }
    onMessage(t, r) {
      this.messageEvents.set(t, r);
    }
    setConfig(t) {
      if (t !== this.configBitmask) {
        (this.configBitmask = t), (this.config = S(t));
        let r = [];
        this.config.image && r.push(...k.IMAGE),
          this.config.video && r.push(...k.VIDEO),
          this.config.stylesheet && r.push(...k.STYLESHEET),
          this.config.font && r.push(...k.FONT),
          this.config.application && r.push(...k.APPLICATION),
          this.config.document && r.push(...k.DOCUMENT),
          this.config.archive && r.push(...k.ARCHIVE),
          this.config.audio && r.push(...k.AUDIO),
          this.config.shopify ||
            caches.has(I).then((n) => {
              n && caches.delete(I);
            }),
          (this.resourceRegex = new RegExp(
            `[.](?:${r.join("|")})(?:\\?.*)?$`,
            "i"
          ));
      }
      this.enabled = !0;
    }
    setEncoded(t) {
      this.encoded = t;
    }
    setLogLevel(t) {
      h.setLogLevel(t);
    }
    setTopic(t) {
      this.topic = t;
    }
    setHost(t) {
      this.host = t;
    }
    async authenticate() {
      return fe();
    }
    disable() {
      (this.enabled = !1), h.log("\u{1F6D1} Service worker disabled.");
    }
    async destroy() {
      (this.enabled = !1),
        await self.registration.unregister(),
        h.log("\u{1F4A5} Service worker destroyed.");
    }
  };
  h.setLogPrefix("worker");
  h.setLogLevel(h.LogLevels.SILENT);
  var C = new F();
  self.edgemesh = C;
  C.migrate();
  C.skipWaiting();
  C.clientsClaim();
  C.onMessage(U.INITIALIZE, (e) => {
    let t = h.LogGroup("INITIALIZE received by service worker.");
    C.setLogLevel(e.level),
      t.log("\u{1F4DD} Log level set to", e.level),
      C.setConfig(e.config),
      t.log("\u2699\uFE0F Config set to", e.config),
      C.setHost(e.host),
      t.log("\u{1F9FF} Host set to", e.host),
      C.setTopic(e.topic),
      t.log("\u{1F3F7} Topic set to", e.topic),
      C.setEncoded(e.encoded),
      t.log("\u{1F5DC} Encoded set to", e.encoded),
      t.end();
  });
  C.onMessage(U.SET_ENCODED, (e) => {
    let t = h.LogGroup("SET_ENCODED received by service worker.");
    C.setEncoded(e), t.log("\u{1F5DC} Encoded set to", e);
  });
  C.onMessage(U.SET_LOG_LEVEL, (e) => {
    let t = h.LogGroup("SET_LOG_LEVEL received by service worker.");
    C.setLogLevel(e),
      t.log("\u{1F4DD} Log level set to", h.LogLevels[e]),
      t.end();
  });
  C.onMessage(U.DISABLE, () => {
    let e = h.LogGroup("DISABLE received by service worker.");
    C.disable(), e.log("\u{1F6D1} Service worker disabled"), e.end();
  });
})();
