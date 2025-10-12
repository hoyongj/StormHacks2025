(function () {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const l of document.querySelectorAll('link[rel="modulepreload"]'))
        r(l);
    new MutationObserver((l) => {
        for (const i of l)
            if (i.type === "childList")
                for (const o of i.addedNodes)
                    o.tagName === "LINK" && o.rel === "modulepreload" && r(o);
    }).observe(document, { childList: !0, subtree: !0 });
    function n(l) {
        const i = {};
        return (
            l.integrity && (i.integrity = l.integrity),
            l.referrerPolicy && (i.referrerPolicy = l.referrerPolicy),
            l.crossOrigin === "use-credentials"
                ? (i.credentials = "include")
                : l.crossOrigin === "anonymous"
                ? (i.credentials = "omit")
                : (i.credentials = "same-origin"),
            i
        );
    }
    function r(l) {
        if (l.ep) return;
        l.ep = !0;
        const i = n(l);
        fetch(l.href, i);
    }
})();
function Nd(e) {
    return e &&
        e.__esModule &&
        Object.prototype.hasOwnProperty.call(e, "default")
        ? e.default
        : e;
}
var Ya = { exports: {} },
    Ul = {},
    Xa = { exports: {} },
    Y = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Tr = Symbol.for("react.element"),
    Ed = Symbol.for("react.portal"),
    Cd = Symbol.for("react.fragment"),
    jd = Symbol.for("react.strict_mode"),
    Pd = Symbol.for("react.profiler"),
    Id = Symbol.for("react.provider"),
    Td = Symbol.for("react.context"),
    Ld = Symbol.for("react.forward_ref"),
    Rd = Symbol.for("react.suspense"),
    Md = Symbol.for("react.memo"),
    zd = Symbol.for("react.lazy"),
    Is = Symbol.iterator;
function Dd(e) {
    return e === null || typeof e != "object"
        ? null
        : ((e = (Is && e[Is]) || e["@@iterator"]),
          typeof e == "function" ? e : null);
}
var Za = {
        isMounted: function () {
            return !1;
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
    },
    Ja = Object.assign,
    qa = {};
function Fn(e, t, n) {
    (this.props = e),
        (this.context = t),
        (this.refs = qa),
        (this.updater = n || Za);
}
Fn.prototype.isReactComponent = {};
Fn.prototype.setState = function (e, t) {
    if (typeof e != "object" && typeof e != "function" && e != null)
        throw Error(
            "setState(...): takes an object of state variables to update or a function which returns an object of state variables."
        );
    this.updater.enqueueSetState(this, e, t, "setState");
};
Fn.prototype.forceUpdate = function (e) {
    this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function ba() {}
ba.prototype = Fn.prototype;
function To(e, t, n) {
    (this.props = e),
        (this.context = t),
        (this.refs = qa),
        (this.updater = n || Za);
}
var Lo = (To.prototype = new ba());
Lo.constructor = To;
Ja(Lo, Fn.prototype);
Lo.isPureReactComponent = !0;
var Ts = Array.isArray,
    eu = Object.prototype.hasOwnProperty,
    Ro = { current: null },
    tu = { key: !0, ref: !0, __self: !0, __source: !0 };
function nu(e, t, n) {
    var r,
        l = {},
        i = null,
        o = null;
    if (t != null)
        for (r in (t.ref !== void 0 && (o = t.ref),
        t.key !== void 0 && (i = "" + t.key),
        t))
            eu.call(t, r) && !tu.hasOwnProperty(r) && (l[r] = t[r]);
    var s = arguments.length - 2;
    if (s === 1) l.children = n;
    else if (1 < s) {
        for (var a = Array(s), f = 0; f < s; f++) a[f] = arguments[f + 2];
        l.children = a;
    }
    if (e && e.defaultProps)
        for (r in ((s = e.defaultProps), s)) l[r] === void 0 && (l[r] = s[r]);
    return {
        $$typeof: Tr,
        type: e,
        key: i,
        ref: o,
        props: l,
        _owner: Ro.current,
    };
}
function $d(e, t) {
    return {
        $$typeof: Tr,
        type: e.type,
        key: t,
        ref: e.ref,
        props: e.props,
        _owner: e._owner,
    };
}
function Mo(e) {
    return typeof e == "object" && e !== null && e.$$typeof === Tr;
}
function Od(e) {
    var t = { "=": "=0", ":": "=2" };
    return (
        "$" +
        e.replace(/[=:]/g, function (n) {
            return t[n];
        })
    );
}
var Ls = /\/+/g;
function li(e, t) {
    return typeof e == "object" && e !== null && e.key != null
        ? Od("" + e.key)
        : t.toString(36);
}
function ll(e, t, n, r, l) {
    var i = typeof e;
    (i === "undefined" || i === "boolean") && (e = null);
    var o = !1;
    if (e === null) o = !0;
    else
        switch (i) {
            case "string":
            case "number":
                o = !0;
                break;
            case "object":
                switch (e.$$typeof) {
                    case Tr:
                    case Ed:
                        o = !0;
                }
        }
    if (o)
        return (
            (o = e),
            (l = l(o)),
            (e = r === "" ? "." + li(o, 0) : r),
            Ts(l)
                ? ((n = ""),
                  e != null && (n = e.replace(Ls, "$&/") + "/"),
                  ll(l, t, n, "", function (f) {
                      return f;
                  }))
                : l != null &&
                  (Mo(l) &&
                      (l = $d(
                          l,
                          n +
                              (!l.key || (o && o.key === l.key)
                                  ? ""
                                  : ("" + l.key).replace(Ls, "$&/") + "/") +
                              e
                      )),
                  t.push(l)),
            1
        );
    if (((o = 0), (r = r === "" ? "." : r + ":"), Ts(e)))
        for (var s = 0; s < e.length; s++) {
            i = e[s];
            var a = r + li(i, s);
            o += ll(i, t, n, a, l);
        }
    else if (((a = Dd(e)), typeof a == "function"))
        for (e = a.call(e), s = 0; !(i = e.next()).done; )
            (i = i.value), (a = r + li(i, s++)), (o += ll(i, t, n, a, l));
    else if (i === "object")
        throw (
            ((t = String(e)),
            Error(
                "Objects are not valid as a React child (found: " +
                    (t === "[object Object]"
                        ? "object with keys {" + Object.keys(e).join(", ") + "}"
                        : t) +
                    "). If you meant to render a collection of children, use an array instead."
            ))
        );
    return o;
}
function Or(e, t, n) {
    if (e == null) return e;
    var r = [],
        l = 0;
    return (
        ll(e, r, "", "", function (i) {
            return t.call(n, i, l++);
        }),
        r
    );
}
function Fd(e) {
    if (e._status === -1) {
        var t = e._result;
        (t = t()),
            t.then(
                function (n) {
                    (e._status === 0 || e._status === -1) &&
                        ((e._status = 1), (e._result = n));
                },
                function (n) {
                    (e._status === 0 || e._status === -1) &&
                        ((e._status = 2), (e._result = n));
                }
            ),
            e._status === -1 && ((e._status = 0), (e._result = t));
    }
    if (e._status === 1) return e._result.default;
    throw e._result;
}
var Re = { current: null },
    il = { transition: null },
    Ad = {
        ReactCurrentDispatcher: Re,
        ReactCurrentBatchConfig: il,
        ReactCurrentOwner: Ro,
    };
function ru() {
    throw Error("act(...) is not supported in production builds of React.");
}
Y.Children = {
    map: Or,
    forEach: function (e, t, n) {
        Or(
            e,
            function () {
                t.apply(this, arguments);
            },
            n
        );
    },
    count: function (e) {
        var t = 0;
        return (
            Or(e, function () {
                t++;
            }),
            t
        );
    },
    toArray: function (e) {
        return (
            Or(e, function (t) {
                return t;
            }) || []
        );
    },
    only: function (e) {
        if (!Mo(e))
            throw Error(
                "React.Children.only expected to receive a single React element child."
            );
        return e;
    },
};
Y.Component = Fn;
Y.Fragment = Cd;
Y.Profiler = Pd;
Y.PureComponent = To;
Y.StrictMode = jd;
Y.Suspense = Rd;
Y.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ad;
Y.act = ru;
Y.cloneElement = function (e, t, n) {
    if (e == null)
        throw Error(
            "React.cloneElement(...): The argument must be a React element, but you passed " +
                e +
                "."
        );
    var r = Ja({}, e.props),
        l = e.key,
        i = e.ref,
        o = e._owner;
    if (t != null) {
        if (
            (t.ref !== void 0 && ((i = t.ref), (o = Ro.current)),
            t.key !== void 0 && (l = "" + t.key),
            e.type && e.type.defaultProps)
        )
            var s = e.type.defaultProps;
        for (a in t)
            eu.call(t, a) &&
                !tu.hasOwnProperty(a) &&
                (r[a] = t[a] === void 0 && s !== void 0 ? s[a] : t[a]);
    }
    var a = arguments.length - 2;
    if (a === 1) r.children = n;
    else if (1 < a) {
        s = Array(a);
        for (var f = 0; f < a; f++) s[f] = arguments[f + 2];
        r.children = s;
    }
    return { $$typeof: Tr, type: e.type, key: l, ref: i, props: r, _owner: o };
};
Y.createContext = function (e) {
    return (
        (e = {
            $$typeof: Td,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
            _defaultValue: null,
            _globalName: null,
        }),
        (e.Provider = { $$typeof: Id, _context: e }),
        (e.Consumer = e)
    );
};
Y.createElement = nu;
Y.createFactory = function (e) {
    var t = nu.bind(null, e);
    return (t.type = e), t;
};
Y.createRef = function () {
    return { current: null };
};
Y.forwardRef = function (e) {
    return { $$typeof: Ld, render: e };
};
Y.isValidElement = Mo;
Y.lazy = function (e) {
    return { $$typeof: zd, _payload: { _status: -1, _result: e }, _init: Fd };
};
Y.memo = function (e, t) {
    return { $$typeof: Md, type: e, compare: t === void 0 ? null : t };
};
Y.startTransition = function (e) {
    var t = il.transition;
    il.transition = {};
    try {
        e();
    } finally {
        il.transition = t;
    }
};
Y.unstable_act = ru;
Y.useCallback = function (e, t) {
    return Re.current.useCallback(e, t);
};
Y.useContext = function (e) {
    return Re.current.useContext(e);
};
Y.useDebugValue = function () {};
Y.useDeferredValue = function (e) {
    return Re.current.useDeferredValue(e);
};
Y.useEffect = function (e, t) {
    return Re.current.useEffect(e, t);
};
Y.useId = function () {
    return Re.current.useId();
};
Y.useImperativeHandle = function (e, t, n) {
    return Re.current.useImperativeHandle(e, t, n);
};
Y.useInsertionEffect = function (e, t) {
    return Re.current.useInsertionEffect(e, t);
};
Y.useLayoutEffect = function (e, t) {
    return Re.current.useLayoutEffect(e, t);
};
Y.useMemo = function (e, t) {
    return Re.current.useMemo(e, t);
};
Y.useReducer = function (e, t, n) {
    return Re.current.useReducer(e, t, n);
};
Y.useRef = function (e) {
    return Re.current.useRef(e);
};
Y.useState = function (e) {
    return Re.current.useState(e);
};
Y.useSyncExternalStore = function (e, t, n) {
    return Re.current.useSyncExternalStore(e, t, n);
};
Y.useTransition = function () {
    return Re.current.useTransition();
};
Y.version = "18.3.1";
Xa.exports = Y;
var k = Xa.exports;
const Ud = Nd(k);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Bd = k,
    Hd = Symbol.for("react.element"),
    Vd = Symbol.for("react.fragment"),
    Wd = Object.prototype.hasOwnProperty,
    Kd =
        Bd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
    Qd = { key: !0, ref: !0, __self: !0, __source: !0 };
function lu(e, t, n) {
    var r,
        l = {},
        i = null,
        o = null;
    n !== void 0 && (i = "" + n),
        t.key !== void 0 && (i = "" + t.key),
        t.ref !== void 0 && (o = t.ref);
    for (r in t) Wd.call(t, r) && !Qd.hasOwnProperty(r) && (l[r] = t[r]);
    if (e && e.defaultProps)
        for (r in ((t = e.defaultProps), t)) l[r] === void 0 && (l[r] = t[r]);
    return {
        $$typeof: Hd,
        type: e,
        key: i,
        ref: o,
        props: l,
        _owner: Kd.current,
    };
}
Ul.Fragment = Vd;
Ul.jsx = lu;
Ul.jsxs = lu;
Ya.exports = Ul;
var u = Ya.exports,
    Di = {},
    iu = { exports: {} },
    Qe = {},
    ou = { exports: {} },
    su = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
    function t(y, L) {
        var T = y.length;
        y.push(L);
        e: for (; 0 < T; ) {
            var B = (T - 1) >>> 1,
                A = y[B];
            if (0 < l(A, L)) (y[B] = L), (y[T] = A), (T = B);
            else break e;
        }
    }
    function n(y) {
        return y.length === 0 ? null : y[0];
    }
    function r(y) {
        if (y.length === 0) return null;
        var L = y[0],
            T = y.pop();
        if (T !== L) {
            y[0] = T;
            e: for (var B = 0, A = y.length, q = A >>> 1; B < q; ) {
                var Z = 2 * (B + 1) - 1,
                    ie = y[Z],
                    pe = Z + 1,
                    at = y[pe];
                if (0 > l(ie, T))
                    pe < A && 0 > l(at, ie)
                        ? ((y[B] = at), (y[pe] = T), (B = pe))
                        : ((y[B] = ie), (y[Z] = T), (B = Z));
                else if (pe < A && 0 > l(at, T))
                    (y[B] = at), (y[pe] = T), (B = pe);
                else break e;
            }
        }
        return L;
    }
    function l(y, L) {
        var T = y.sortIndex - L.sortIndex;
        return T !== 0 ? T : y.id - L.id;
    }
    if (
        typeof performance == "object" &&
        typeof performance.now == "function"
    ) {
        var i = performance;
        e.unstable_now = function () {
            return i.now();
        };
    } else {
        var o = Date,
            s = o.now();
        e.unstable_now = function () {
            return o.now() - s;
        };
    }
    var a = [],
        f = [],
        h = 1,
        m = null,
        v = 3,
        _ = !1,
        S = !1,
        N = !1,
        K = typeof setTimeout == "function" ? setTimeout : null,
        p = typeof clearTimeout == "function" ? clearTimeout : null,
        d = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" &&
        navigator.scheduling !== void 0 &&
        navigator.scheduling.isInputPending !== void 0 &&
        navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function c(y) {
        for (var L = n(f); L !== null; ) {
            if (L.callback === null) r(f);
            else if (L.startTime <= y)
                r(f), (L.sortIndex = L.expirationTime), t(a, L);
            else break;
            L = n(f);
        }
    }
    function g(y) {
        if (((N = !1), c(y), !S))
            if (n(a) !== null) (S = !0), ne(x);
            else {
                var L = n(f);
                L !== null && Ye(g, L.startTime - y);
            }
    }
    function x(y, L) {
        (S = !1), N && ((N = !1), p(R), (R = -1)), (_ = !0);
        var T = v;
        try {
            for (
                c(L), m = n(a);
                m !== null && (!(m.expirationTime > L) || (y && !F()));

            ) {
                var B = m.callback;
                if (typeof B == "function") {
                    (m.callback = null), (v = m.priorityLevel);
                    var A = B(m.expirationTime <= L);
                    (L = e.unstable_now()),
                        typeof A == "function"
                            ? (m.callback = A)
                            : m === n(a) && r(a),
                        c(L);
                } else r(a);
                m = n(a);
            }
            if (m !== null) var q = !0;
            else {
                var Z = n(f);
                Z !== null && Ye(g, Z.startTime - L), (q = !1);
            }
            return q;
        } finally {
            (m = null), (v = T), (_ = !1);
        }
    }
    var E = !1,
        w = null,
        R = -1,
        O = 5,
        C = -1;
    function F() {
        return !(e.unstable_now() - C < O);
    }
    function G() {
        if (w !== null) {
            var y = e.unstable_now();
            C = y;
            var L = !0;
            try {
                L = w(!0, y);
            } finally {
                L ? ee() : ((E = !1), (w = null));
            }
        } else E = !1;
    }
    var ee;
    if (typeof d == "function")
        ee = function () {
            d(G);
        };
    else if (typeof MessageChannel < "u") {
        var Ee = new MessageChannel(),
            X = Ee.port2;
        (Ee.port1.onmessage = G),
            (ee = function () {
                X.postMessage(null);
            });
    } else
        ee = function () {
            K(G, 0);
        };
    function ne(y) {
        (w = y), E || ((E = !0), ee());
    }
    function Ye(y, L) {
        R = K(function () {
            y(e.unstable_now());
        }, L);
    }
    (e.unstable_IdlePriority = 5),
        (e.unstable_ImmediatePriority = 1),
        (e.unstable_LowPriority = 4),
        (e.unstable_NormalPriority = 3),
        (e.unstable_Profiling = null),
        (e.unstable_UserBlockingPriority = 2),
        (e.unstable_cancelCallback = function (y) {
            y.callback = null;
        }),
        (e.unstable_continueExecution = function () {
            S || _ || ((S = !0), ne(x));
        }),
        (e.unstable_forceFrameRate = function (y) {
            0 > y || 125 < y
                ? console.error(
                      "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
                  )
                : (O = 0 < y ? Math.floor(1e3 / y) : 5);
        }),
        (e.unstable_getCurrentPriorityLevel = function () {
            return v;
        }),
        (e.unstable_getFirstCallbackNode = function () {
            return n(a);
        }),
        (e.unstable_next = function (y) {
            switch (v) {
                case 1:
                case 2:
                case 3:
                    var L = 3;
                    break;
                default:
                    L = v;
            }
            var T = v;
            v = L;
            try {
                return y();
            } finally {
                v = T;
            }
        }),
        (e.unstable_pauseExecution = function () {}),
        (e.unstable_requestPaint = function () {}),
        (e.unstable_runWithPriority = function (y, L) {
            switch (y) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                default:
                    y = 3;
            }
            var T = v;
            v = y;
            try {
                return L();
            } finally {
                v = T;
            }
        }),
        (e.unstable_scheduleCallback = function (y, L, T) {
            var B = e.unstable_now();
            switch (
                (typeof T == "object" && T !== null
                    ? ((T = T.delay),
                      (T = typeof T == "number" && 0 < T ? B + T : B))
                    : (T = B),
                y)
            ) {
                case 1:
                    var A = -1;
                    break;
                case 2:
                    A = 250;
                    break;
                case 5:
                    A = 1073741823;
                    break;
                case 4:
                    A = 1e4;
                    break;
                default:
                    A = 5e3;
            }
            return (
                (A = T + A),
                (y = {
                    id: h++,
                    callback: L,
                    priorityLevel: y,
                    startTime: T,
                    expirationTime: A,
                    sortIndex: -1,
                }),
                T > B
                    ? ((y.sortIndex = T),
                      t(f, y),
                      n(a) === null &&
                          y === n(f) &&
                          (N ? (p(R), (R = -1)) : (N = !0), Ye(g, T - B)))
                    : ((y.sortIndex = A), t(a, y), S || _ || ((S = !0), ne(x))),
                y
            );
        }),
        (e.unstable_shouldYield = F),
        (e.unstable_wrapCallback = function (y) {
            var L = v;
            return function () {
                var T = v;
                v = L;
                try {
                    return y.apply(this, arguments);
                } finally {
                    v = T;
                }
            };
        });
})(su);
ou.exports = su;
var Gd = ou.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Yd = k,
    Ke = Gd;
function j(e) {
    for (
        var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e,
            n = 1;
        n < arguments.length;
        n++
    )
        t += "&args[]=" + encodeURIComponent(arguments[n]);
    return (
        "Minified React error #" +
        e +
        "; visit " +
        t +
        " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
}
var au = new Set(),
    pr = {};
function an(e, t) {
    Ln(e, t), Ln(e + "Capture", t);
}
function Ln(e, t) {
    for (pr[e] = t, e = 0; e < t.length; e++) au.add(t[e]);
}
var St = !(
        typeof window > "u" ||
        typeof window.document > "u" ||
        typeof window.document.createElement > "u"
    ),
    $i = Object.prototype.hasOwnProperty,
    Xd =
        /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
    Rs = {},
    Ms = {};
function Zd(e) {
    return $i.call(Ms, e)
        ? !0
        : $i.call(Rs, e)
        ? !1
        : Xd.test(e)
        ? (Ms[e] = !0)
        : ((Rs[e] = !0), !1);
}
function Jd(e, t, n, r) {
    if (n !== null && n.type === 0) return !1;
    switch (typeof t) {
        case "function":
        case "symbol":
            return !0;
        case "boolean":
            return r
                ? !1
                : n !== null
                ? !n.acceptsBooleans
                : ((e = e.toLowerCase().slice(0, 5)),
                  e !== "data-" && e !== "aria-");
        default:
            return !1;
    }
}
function qd(e, t, n, r) {
    if (t === null || typeof t > "u" || Jd(e, t, n, r)) return !0;
    if (r) return !1;
    if (n !== null)
        switch (n.type) {
            case 3:
                return !t;
            case 4:
                return t === !1;
            case 5:
                return isNaN(t);
            case 6:
                return isNaN(t) || 1 > t;
        }
    return !1;
}
function Me(e, t, n, r, l, i, o) {
    (this.acceptsBooleans = t === 2 || t === 3 || t === 4),
        (this.attributeName = r),
        (this.attributeNamespace = l),
        (this.mustUseProperty = n),
        (this.propertyName = e),
        (this.type = t),
        (this.sanitizeURL = i),
        (this.removeEmptyString = o);
}
var Ne = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
    .split(" ")
    .forEach(function (e) {
        Ne[e] = new Me(e, 0, !1, e, null, !1, !1);
    });
[
    ["acceptCharset", "accept-charset"],
    ["className", "class"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
].forEach(function (e) {
    var t = e[0];
    Ne[t] = new Me(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
    Ne[e] = new Me(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
    "autoReverse",
    "externalResourcesRequired",
    "focusable",
    "preserveAlpha",
].forEach(function (e) {
    Ne[e] = new Me(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
    .split(" ")
    .forEach(function (e) {
        Ne[e] = new Me(e, 3, !1, e.toLowerCase(), null, !1, !1);
    });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
    Ne[e] = new Me(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
    Ne[e] = new Me(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
    Ne[e] = new Me(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
    Ne[e] = new Me(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var zo = /[\-:]([a-z])/g;
function Do(e) {
    return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
    .split(" ")
    .forEach(function (e) {
        var t = e.replace(zo, Do);
        Ne[t] = new Me(t, 1, !1, e, null, !1, !1);
    });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
    .split(" ")
    .forEach(function (e) {
        var t = e.replace(zo, Do);
        Ne[t] = new Me(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
    });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
    var t = e.replace(zo, Do);
    Ne[t] = new Me(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
    Ne[e] = new Me(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
Ne.xlinkHref = new Me(
    "xlinkHref",
    1,
    !1,
    "xlink:href",
    "http://www.w3.org/1999/xlink",
    !0,
    !1
);
["src", "href", "action", "formAction"].forEach(function (e) {
    Ne[e] = new Me(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function $o(e, t, n, r) {
    var l = Ne.hasOwnProperty(t) ? Ne[t] : null;
    (l !== null
        ? l.type !== 0
        : r ||
          !(2 < t.length) ||
          (t[0] !== "o" && t[0] !== "O") ||
          (t[1] !== "n" && t[1] !== "N")) &&
        (qd(t, n, l, r) && (n = null),
        r || l === null
            ? Zd(t) &&
              (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
            : l.mustUseProperty
            ? (e[l.propertyName] = n === null ? (l.type === 3 ? !1 : "") : n)
            : ((t = l.attributeName),
              (r = l.attributeNamespace),
              n === null
                  ? e.removeAttribute(t)
                  : ((l = l.type),
                    (n = l === 3 || (l === 4 && n === !0) ? "" : "" + n),
                    r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var Et = Yd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
    Fr = Symbol.for("react.element"),
    fn = Symbol.for("react.portal"),
    pn = Symbol.for("react.fragment"),
    Oo = Symbol.for("react.strict_mode"),
    Oi = Symbol.for("react.profiler"),
    uu = Symbol.for("react.provider"),
    cu = Symbol.for("react.context"),
    Fo = Symbol.for("react.forward_ref"),
    Fi = Symbol.for("react.suspense"),
    Ai = Symbol.for("react.suspense_list"),
    Ao = Symbol.for("react.memo"),
    Pt = Symbol.for("react.lazy"),
    du = Symbol.for("react.offscreen"),
    zs = Symbol.iterator;
function Kn(e) {
    return e === null || typeof e != "object"
        ? null
        : ((e = (zs && e[zs]) || e["@@iterator"]),
          typeof e == "function" ? e : null);
}
var ce = Object.assign,
    ii;
function er(e) {
    if (ii === void 0)
        try {
            throw Error();
        } catch (n) {
            var t = n.stack.trim().match(/\n( *(at )?)/);
            ii = (t && t[1]) || "";
        }
    return (
        `
` +
        ii +
        e
    );
}
var oi = !1;
function si(e, t) {
    if (!e || oi) return "";
    oi = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
        if (t)
            if (
                ((t = function () {
                    throw Error();
                }),
                Object.defineProperty(t.prototype, "props", {
                    set: function () {
                        throw Error();
                    },
                }),
                typeof Reflect == "object" && Reflect.construct)
            ) {
                try {
                    Reflect.construct(t, []);
                } catch (f) {
                    var r = f;
                }
                Reflect.construct(e, [], t);
            } else {
                try {
                    t.call();
                } catch (f) {
                    r = f;
                }
                e.call(t.prototype);
            }
        else {
            try {
                throw Error();
            } catch (f) {
                r = f;
            }
            e();
        }
    } catch (f) {
        if (f && r && typeof f.stack == "string") {
            for (
                var l = f.stack.split(`
`),
                    i = r.stack.split(`
`),
                    o = l.length - 1,
                    s = i.length - 1;
                1 <= o && 0 <= s && l[o] !== i[s];

            )
                s--;
            for (; 1 <= o && 0 <= s; o--, s--)
                if (l[o] !== i[s]) {
                    if (o !== 1 || s !== 1)
                        do
                            if ((o--, s--, 0 > s || l[o] !== i[s])) {
                                var a =
                                    `
` + l[o].replace(" at new ", " at ");
                                return (
                                    e.displayName &&
                                        a.includes("<anonymous>") &&
                                        (a = a.replace(
                                            "<anonymous>",
                                            e.displayName
                                        )),
                                    a
                                );
                            }
                        while (1 <= o && 0 <= s);
                    break;
                }
        }
    } finally {
        (oi = !1), (Error.prepareStackTrace = n);
    }
    return (e = e ? e.displayName || e.name : "") ? er(e) : "";
}
function bd(e) {
    switch (e.tag) {
        case 5:
            return er(e.type);
        case 16:
            return er("Lazy");
        case 13:
            return er("Suspense");
        case 19:
            return er("SuspenseList");
        case 0:
        case 2:
        case 15:
            return (e = si(e.type, !1)), e;
        case 11:
            return (e = si(e.type.render, !1)), e;
        case 1:
            return (e = si(e.type, !0)), e;
        default:
            return "";
    }
}
function Ui(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
        case pn:
            return "Fragment";
        case fn:
            return "Portal";
        case Oi:
            return "Profiler";
        case Oo:
            return "StrictMode";
        case Fi:
            return "Suspense";
        case Ai:
            return "SuspenseList";
    }
    if (typeof e == "object")
        switch (e.$$typeof) {
            case cu:
                return (e.displayName || "Context") + ".Consumer";
            case uu:
                return (e._context.displayName || "Context") + ".Provider";
            case Fo:
                var t = e.render;
                return (
                    (e = e.displayName),
                    e ||
                        ((e = t.displayName || t.name || ""),
                        (e =
                            e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
                    e
                );
            case Ao:
                return (
                    (t = e.displayName || null),
                    t !== null ? t : Ui(e.type) || "Memo"
                );
            case Pt:
                (t = e._payload), (e = e._init);
                try {
                    return Ui(e(t));
                } catch {}
        }
    return null;
}
function ef(e) {
    var t = e.type;
    switch (e.tag) {
        case 24:
            return "Cache";
        case 9:
            return (t.displayName || "Context") + ".Consumer";
        case 10:
            return (t._context.displayName || "Context") + ".Provider";
        case 18:
            return "DehydratedFragment";
        case 11:
            return (
                (e = t.render),
                (e = e.displayName || e.name || ""),
                t.displayName ||
                    (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
            );
        case 7:
            return "Fragment";
        case 5:
            return t;
        case 4:
            return "Portal";
        case 3:
            return "Root";
        case 6:
            return "Text";
        case 16:
            return Ui(t);
        case 8:
            return t === Oo ? "StrictMode" : "Mode";
        case 22:
            return "Offscreen";
        case 12:
            return "Profiler";
        case 21:
            return "Scope";
        case 13:
            return "Suspense";
        case 19:
            return "SuspenseList";
        case 25:
            return "TracingMarker";
        case 1:
        case 0:
        case 17:
        case 2:
        case 14:
        case 15:
            if (typeof t == "function") return t.displayName || t.name || null;
            if (typeof t == "string") return t;
    }
    return null;
}
function Vt(e) {
    switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
            return e;
        case "object":
            return e;
        default:
            return "";
    }
}
function fu(e) {
    var t = e.type;
    return (
        (e = e.nodeName) &&
        e.toLowerCase() === "input" &&
        (t === "checkbox" || t === "radio")
    );
}
function tf(e) {
    var t = fu(e) ? "checked" : "value",
        n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
        r = "" + e[t];
    if (
        !e.hasOwnProperty(t) &&
        typeof n < "u" &&
        typeof n.get == "function" &&
        typeof n.set == "function"
    ) {
        var l = n.get,
            i = n.set;
        return (
            Object.defineProperty(e, t, {
                configurable: !0,
                get: function () {
                    return l.call(this);
                },
                set: function (o) {
                    (r = "" + o), i.call(this, o);
                },
            }),
            Object.defineProperty(e, t, { enumerable: n.enumerable }),
            {
                getValue: function () {
                    return r;
                },
                setValue: function (o) {
                    r = "" + o;
                },
                stopTracking: function () {
                    (e._valueTracker = null), delete e[t];
                },
            }
        );
    }
}
function Ar(e) {
    e._valueTracker || (e._valueTracker = tf(e));
}
function pu(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(),
        r = "";
    return (
        e && (r = fu(e) ? (e.checked ? "true" : "false") : e.value),
        (e = r),
        e !== n ? (t.setValue(e), !0) : !1
    );
}
function vl(e) {
    if (
        ((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u")
    )
        return null;
    try {
        return e.activeElement || e.body;
    } catch {
        return e.body;
    }
}
function Bi(e, t) {
    var n = t.checked;
    return ce({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: n ?? e._wrapperState.initialChecked,
    });
}
function Ds(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue,
        r = t.checked != null ? t.checked : t.defaultChecked;
    (n = Vt(t.value != null ? t.value : n)),
        (e._wrapperState = {
            initialChecked: r,
            initialValue: n,
            controlled:
                t.type === "checkbox" || t.type === "radio"
                    ? t.checked != null
                    : t.value != null,
        });
}
function mu(e, t) {
    (t = t.checked), t != null && $o(e, "checked", t, !1);
}
function Hi(e, t) {
    mu(e, t);
    var n = Vt(t.value),
        r = t.type;
    if (n != null)
        r === "number"
            ? ((n === 0 && e.value === "") || e.value != n) &&
              (e.value = "" + n)
            : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
        e.removeAttribute("value");
        return;
    }
    t.hasOwnProperty("value")
        ? Vi(e, t.type, n)
        : t.hasOwnProperty("defaultValue") && Vi(e, t.type, Vt(t.defaultValue)),
        t.checked == null &&
            t.defaultChecked != null &&
            (e.defaultChecked = !!t.defaultChecked);
}
function $s(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var r = t.type;
        if (
            !(
                (r !== "submit" && r !== "reset") ||
                (t.value !== void 0 && t.value !== null)
            )
        )
            return;
        (t = "" + e._wrapperState.initialValue),
            n || t === e.value || (e.value = t),
            (e.defaultValue = t);
    }
    (n = e.name),
        n !== "" && (e.name = ""),
        (e.defaultChecked = !!e._wrapperState.initialChecked),
        n !== "" && (e.name = n);
}
function Vi(e, t, n) {
    (t !== "number" || vl(e.ownerDocument) !== e) &&
        (n == null
            ? (e.defaultValue = "" + e._wrapperState.initialValue)
            : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var tr = Array.isArray;
function En(e, t, n, r) {
    if (((e = e.options), t)) {
        t = {};
        for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
        for (n = 0; n < e.length; n++)
            (l = t.hasOwnProperty("$" + e[n].value)),
                e[n].selected !== l && (e[n].selected = l),
                l && r && (e[n].defaultSelected = !0);
    } else {
        for (n = "" + Vt(n), t = null, l = 0; l < e.length; l++) {
            if (e[l].value === n) {
                (e[l].selected = !0), r && (e[l].defaultSelected = !0);
                return;
            }
            t !== null || e[l].disabled || (t = e[l]);
        }
        t !== null && (t.selected = !0);
    }
}
function Wi(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(j(91));
    return ce({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: "" + e._wrapperState.initialValue,
    });
}
function Os(e, t) {
    var n = t.value;
    if (n == null) {
        if (((n = t.children), (t = t.defaultValue), n != null)) {
            if (t != null) throw Error(j(92));
            if (tr(n)) {
                if (1 < n.length) throw Error(j(93));
                n = n[0];
            }
            t = n;
        }
        t == null && (t = ""), (n = t);
    }
    e._wrapperState = { initialValue: Vt(n) };
}
function hu(e, t) {
    var n = Vt(t.value),
        r = Vt(t.defaultValue);
    n != null &&
        ((n = "" + n),
        n !== e.value && (e.value = n),
        t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
        r != null && (e.defaultValue = "" + r);
}
function Fs(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue &&
        t !== "" &&
        t !== null &&
        (e.value = t);
}
function vu(e) {
    switch (e) {
        case "svg":
            return "http://www.w3.org/2000/svg";
        case "math":
            return "http://www.w3.org/1998/Math/MathML";
        default:
            return "http://www.w3.org/1999/xhtml";
    }
}
function Ki(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml"
        ? vu(t)
        : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
        ? "http://www.w3.org/1999/xhtml"
        : e;
}
var Ur,
    gu = (function (e) {
        return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
            ? function (t, n, r, l) {
                  MSApp.execUnsafeLocalFunction(function () {
                      return e(t, n, r, l);
                  });
              }
            : e;
    })(function (e, t) {
        if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
            e.innerHTML = t;
        else {
            for (
                Ur = Ur || document.createElement("div"),
                    Ur.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
                    t = Ur.firstChild;
                e.firstChild;

            )
                e.removeChild(e.firstChild);
            for (; t.firstChild; ) e.appendChild(t.firstChild);
        }
    });
function mr(e, t) {
    if (t) {
        var n = e.firstChild;
        if (n && n === e.lastChild && n.nodeType === 3) {
            n.nodeValue = t;
            return;
        }
    }
    e.textContent = t;
}
var lr = {
        animationIterationCount: !0,
        aspectRatio: !0,
        borderImageOutset: !0,
        borderImageSlice: !0,
        borderImageWidth: !0,
        boxFlex: !0,
        boxFlexGroup: !0,
        boxOrdinalGroup: !0,
        columnCount: !0,
        columns: !0,
        flex: !0,
        flexGrow: !0,
        flexPositive: !0,
        flexShrink: !0,
        flexNegative: !0,
        flexOrder: !0,
        gridArea: !0,
        gridRow: !0,
        gridRowEnd: !0,
        gridRowSpan: !0,
        gridRowStart: !0,
        gridColumn: !0,
        gridColumnEnd: !0,
        gridColumnSpan: !0,
        gridColumnStart: !0,
        fontWeight: !0,
        lineClamp: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        tabSize: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
        fillOpacity: !0,
        floodOpacity: !0,
        stopOpacity: !0,
        strokeDasharray: !0,
        strokeDashoffset: !0,
        strokeMiterlimit: !0,
        strokeOpacity: !0,
        strokeWidth: !0,
    },
    nf = ["Webkit", "ms", "Moz", "O"];
Object.keys(lr).forEach(function (e) {
    nf.forEach(function (t) {
        (t = t + e.charAt(0).toUpperCase() + e.substring(1)), (lr[t] = lr[e]);
    });
});
function yu(e, t, n) {
    return t == null || typeof t == "boolean" || t === ""
        ? ""
        : n ||
          typeof t != "number" ||
          t === 0 ||
          (lr.hasOwnProperty(e) && lr[e])
        ? ("" + t).trim()
        : t + "px";
}
function _u(e, t) {
    e = e.style;
    for (var n in t)
        if (t.hasOwnProperty(n)) {
            var r = n.indexOf("--") === 0,
                l = yu(n, t[n], r);
            n === "float" && (n = "cssFloat"),
                r ? e.setProperty(n, l) : (e[n] = l);
        }
}
var rf = ce(
    { menuitem: !0 },
    {
        area: !0,
        base: !0,
        br: !0,
        col: !0,
        embed: !0,
        hr: !0,
        img: !0,
        input: !0,
        keygen: !0,
        link: !0,
        meta: !0,
        param: !0,
        source: !0,
        track: !0,
        wbr: !0,
    }
);
function Qi(e, t) {
    if (t) {
        if (rf[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
            throw Error(j(137, e));
        if (t.dangerouslySetInnerHTML != null) {
            if (t.children != null) throw Error(j(60));
            if (
                typeof t.dangerouslySetInnerHTML != "object" ||
                !("__html" in t.dangerouslySetInnerHTML)
            )
                throw Error(j(61));
        }
        if (t.style != null && typeof t.style != "object") throw Error(j(62));
    }
}
function Gi(e, t) {
    if (e.indexOf("-") === -1) return typeof t.is == "string";
    switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
            return !1;
        default:
            return !0;
    }
}
var Yi = null;
function Uo(e) {
    return (
        (e = e.target || e.srcElement || window),
        e.correspondingUseElement && (e = e.correspondingUseElement),
        e.nodeType === 3 ? e.parentNode : e
    );
}
var Xi = null,
    Cn = null,
    jn = null;
function As(e) {
    if ((e = Mr(e))) {
        if (typeof Xi != "function") throw Error(j(280));
        var t = e.stateNode;
        t && ((t = Kl(t)), Xi(e.stateNode, e.type, t));
    }
}
function wu(e) {
    Cn ? (jn ? jn.push(e) : (jn = [e])) : (Cn = e);
}
function Su() {
    if (Cn) {
        var e = Cn,
            t = jn;
        if (((jn = Cn = null), As(e), t))
            for (e = 0; e < t.length; e++) As(t[e]);
    }
}
function xu(e, t) {
    return e(t);
}
function ku() {}
var ai = !1;
function Nu(e, t, n) {
    if (ai) return e(t, n);
    ai = !0;
    try {
        return xu(e, t, n);
    } finally {
        (ai = !1), (Cn !== null || jn !== null) && (ku(), Su());
    }
}
function hr(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = Kl(n);
    if (r === null) return null;
    n = r[t];
    e: switch (t) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
            (r = !r.disabled) ||
                ((e = e.type),
                (r = !(
                    e === "button" ||
                    e === "input" ||
                    e === "select" ||
                    e === "textarea"
                ))),
                (e = !r);
            break e;
        default:
            e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function") throw Error(j(231, t, typeof n));
    return n;
}
var Zi = !1;
if (St)
    try {
        var Qn = {};
        Object.defineProperty(Qn, "passive", {
            get: function () {
                Zi = !0;
            },
        }),
            window.addEventListener("test", Qn, Qn),
            window.removeEventListener("test", Qn, Qn);
    } catch {
        Zi = !1;
    }
function lf(e, t, n, r, l, i, o, s, a) {
    var f = Array.prototype.slice.call(arguments, 3);
    try {
        t.apply(n, f);
    } catch (h) {
        this.onError(h);
    }
}
var ir = !1,
    gl = null,
    yl = !1,
    Ji = null,
    of = {
        onError: function (e) {
            (ir = !0), (gl = e);
        },
    };
function sf(e, t, n, r, l, i, o, s, a) {
    (ir = !1), (gl = null), lf.apply(of, arguments);
}
function af(e, t, n, r, l, i, o, s, a) {
    if ((sf.apply(this, arguments), ir)) {
        if (ir) {
            var f = gl;
            (ir = !1), (gl = null);
        } else throw Error(j(198));
        yl || ((yl = !0), (Ji = f));
    }
}
function un(e) {
    var t = e,
        n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
        e = t;
        do (t = e), t.flags & 4098 && (n = t.return), (e = t.return);
        while (e);
    }
    return t.tag === 3 ? n : null;
}
function Eu(e) {
    if (e.tag === 13) {
        var t = e.memoizedState;
        if (
            (t === null &&
                ((e = e.alternate), e !== null && (t = e.memoizedState)),
            t !== null)
        )
            return t.dehydrated;
    }
    return null;
}
function Us(e) {
    if (un(e) !== e) throw Error(j(188));
}
function uf(e) {
    var t = e.alternate;
    if (!t) {
        if (((t = un(e)), t === null)) throw Error(j(188));
        return t !== e ? null : e;
    }
    for (var n = e, r = t; ; ) {
        var l = n.return;
        if (l === null) break;
        var i = l.alternate;
        if (i === null) {
            if (((r = l.return), r !== null)) {
                n = r;
                continue;
            }
            break;
        }
        if (l.child === i.child) {
            for (i = l.child; i; ) {
                if (i === n) return Us(l), e;
                if (i === r) return Us(l), t;
                i = i.sibling;
            }
            throw Error(j(188));
        }
        if (n.return !== r.return) (n = l), (r = i);
        else {
            for (var o = !1, s = l.child; s; ) {
                if (s === n) {
                    (o = !0), (n = l), (r = i);
                    break;
                }
                if (s === r) {
                    (o = !0), (r = l), (n = i);
                    break;
                }
                s = s.sibling;
            }
            if (!o) {
                for (s = i.child; s; ) {
                    if (s === n) {
                        (o = !0), (n = i), (r = l);
                        break;
                    }
                    if (s === r) {
                        (o = !0), (r = i), (n = l);
                        break;
                    }
                    s = s.sibling;
                }
                if (!o) throw Error(j(189));
            }
        }
        if (n.alternate !== r) throw Error(j(190));
    }
    if (n.tag !== 3) throw Error(j(188));
    return n.stateNode.current === n ? e : t;
}
function Cu(e) {
    return (e = uf(e)), e !== null ? ju(e) : null;
}
function ju(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
        var t = ju(e);
        if (t !== null) return t;
        e = e.sibling;
    }
    return null;
}
var Pu = Ke.unstable_scheduleCallback,
    Bs = Ke.unstable_cancelCallback,
    cf = Ke.unstable_shouldYield,
    df = Ke.unstable_requestPaint,
    fe = Ke.unstable_now,
    ff = Ke.unstable_getCurrentPriorityLevel,
    Bo = Ke.unstable_ImmediatePriority,
    Iu = Ke.unstable_UserBlockingPriority,
    _l = Ke.unstable_NormalPriority,
    pf = Ke.unstable_LowPriority,
    Tu = Ke.unstable_IdlePriority,
    Bl = null,
    pt = null;
function mf(e) {
    if (pt && typeof pt.onCommitFiberRoot == "function")
        try {
            pt.onCommitFiberRoot(
                Bl,
                e,
                void 0,
                (e.current.flags & 128) === 128
            );
        } catch {}
}
var it = Math.clz32 ? Math.clz32 : gf,
    hf = Math.log,
    vf = Math.LN2;
function gf(e) {
    return (e >>>= 0), e === 0 ? 32 : (31 - ((hf(e) / vf) | 0)) | 0;
}
var Br = 64,
    Hr = 4194304;
function nr(e) {
    switch (e & -e) {
        case 1:
            return 1;
        case 2:
            return 2;
        case 4:
            return 4;
        case 8:
            return 8;
        case 16:
            return 16;
        case 32:
            return 32;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return e & 4194240;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
            return e & 130023424;
        case 134217728:
            return 134217728;
        case 268435456:
            return 268435456;
        case 536870912:
            return 536870912;
        case 1073741824:
            return 1073741824;
        default:
            return e;
    }
}
function wl(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0,
        l = e.suspendedLanes,
        i = e.pingedLanes,
        o = n & 268435455;
    if (o !== 0) {
        var s = o & ~l;
        s !== 0 ? (r = nr(s)) : ((i &= o), i !== 0 && (r = nr(i)));
    } else (o = n & ~l), o !== 0 ? (r = nr(o)) : i !== 0 && (r = nr(i));
    if (r === 0) return 0;
    if (
        t !== 0 &&
        t !== r &&
        !(t & l) &&
        ((l = r & -r),
        (i = t & -t),
        l >= i || (l === 16 && (i & 4194240) !== 0))
    )
        return t;
    if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
        for (e = e.entanglements, t &= r; 0 < t; )
            (n = 31 - it(t)), (l = 1 << n), (r |= e[n]), (t &= ~l);
    return r;
}
function yf(e, t) {
    switch (e) {
        case 1:
        case 2:
        case 4:
            return t + 250;
        case 8:
        case 16:
        case 32:
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return t + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
            return -1;
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
            return -1;
        default:
            return -1;
    }
}
function _f(e, t) {
    for (
        var n = e.suspendedLanes,
            r = e.pingedLanes,
            l = e.expirationTimes,
            i = e.pendingLanes;
        0 < i;

    ) {
        var o = 31 - it(i),
            s = 1 << o,
            a = l[o];
        a === -1
            ? (!(s & n) || s & r) && (l[o] = yf(s, t))
            : a <= t && (e.expiredLanes |= s),
            (i &= ~s);
    }
}
function qi(e) {
    return (
        (e = e.pendingLanes & -1073741825),
        e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
    );
}
function Lu() {
    var e = Br;
    return (Br <<= 1), !(Br & 4194240) && (Br = 64), e;
}
function ui(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
}
function Lr(e, t, n) {
    (e.pendingLanes |= t),
        t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
        (e = e.eventTimes),
        (t = 31 - it(t)),
        (e[t] = n);
}
function wf(e, t) {
    var n = e.pendingLanes & ~t;
    (e.pendingLanes = t),
        (e.suspendedLanes = 0),
        (e.pingedLanes = 0),
        (e.expiredLanes &= t),
        (e.mutableReadLanes &= t),
        (e.entangledLanes &= t),
        (t = e.entanglements);
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
        var l = 31 - it(n),
            i = 1 << l;
        (t[l] = 0), (r[l] = -1), (e[l] = -1), (n &= ~i);
    }
}
function Ho(e, t) {
    var n = (e.entangledLanes |= t);
    for (e = e.entanglements; n; ) {
        var r = 31 - it(n),
            l = 1 << r;
        (l & t) | (e[r] & t) && (e[r] |= t), (n &= ~l);
    }
}
var b = 0;
function Ru(e) {
    return (
        (e &= -e), 1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1
    );
}
var Mu,
    Vo,
    zu,
    Du,
    $u,
    bi = !1,
    Vr = [],
    Dt = null,
    $t = null,
    Ot = null,
    vr = new Map(),
    gr = new Map(),
    Tt = [],
    Sf =
        "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
            " "
        );
function Hs(e, t) {
    switch (e) {
        case "focusin":
        case "focusout":
            Dt = null;
            break;
        case "dragenter":
        case "dragleave":
            $t = null;
            break;
        case "mouseover":
        case "mouseout":
            Ot = null;
            break;
        case "pointerover":
        case "pointerout":
            vr.delete(t.pointerId);
            break;
        case "gotpointercapture":
        case "lostpointercapture":
            gr.delete(t.pointerId);
    }
}
function Gn(e, t, n, r, l, i) {
    return e === null || e.nativeEvent !== i
        ? ((e = {
              blockedOn: t,
              domEventName: n,
              eventSystemFlags: r,
              nativeEvent: i,
              targetContainers: [l],
          }),
          t !== null && ((t = Mr(t)), t !== null && Vo(t)),
          e)
        : ((e.eventSystemFlags |= r),
          (t = e.targetContainers),
          l !== null && t.indexOf(l) === -1 && t.push(l),
          e);
}
function xf(e, t, n, r, l) {
    switch (t) {
        case "focusin":
            return (Dt = Gn(Dt, e, t, n, r, l)), !0;
        case "dragenter":
            return ($t = Gn($t, e, t, n, r, l)), !0;
        case "mouseover":
            return (Ot = Gn(Ot, e, t, n, r, l)), !0;
        case "pointerover":
            var i = l.pointerId;
            return vr.set(i, Gn(vr.get(i) || null, e, t, n, r, l)), !0;
        case "gotpointercapture":
            return (
                (i = l.pointerId),
                gr.set(i, Gn(gr.get(i) || null, e, t, n, r, l)),
                !0
            );
    }
    return !1;
}
function Ou(e) {
    var t = Jt(e.target);
    if (t !== null) {
        var n = un(t);
        if (n !== null) {
            if (((t = n.tag), t === 13)) {
                if (((t = Eu(n)), t !== null)) {
                    (e.blockedOn = t),
                        $u(e.priority, function () {
                            zu(n);
                        });
                    return;
                }
            } else if (
                t === 3 &&
                n.stateNode.current.memoizedState.isDehydrated
            ) {
                e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
                return;
            }
        }
    }
    e.blockedOn = null;
}
function ol(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
        var n = eo(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
        if (n === null) {
            n = e.nativeEvent;
            var r = new n.constructor(n.type, n);
            (Yi = r), n.target.dispatchEvent(r), (Yi = null);
        } else return (t = Mr(n)), t !== null && Vo(t), (e.blockedOn = n), !1;
        t.shift();
    }
    return !0;
}
function Vs(e, t, n) {
    ol(e) && n.delete(t);
}
function kf() {
    (bi = !1),
        Dt !== null && ol(Dt) && (Dt = null),
        $t !== null && ol($t) && ($t = null),
        Ot !== null && ol(Ot) && (Ot = null),
        vr.forEach(Vs),
        gr.forEach(Vs);
}
function Yn(e, t) {
    e.blockedOn === t &&
        ((e.blockedOn = null),
        bi ||
            ((bi = !0),
            Ke.unstable_scheduleCallback(Ke.unstable_NormalPriority, kf)));
}
function yr(e) {
    function t(l) {
        return Yn(l, e);
    }
    if (0 < Vr.length) {
        Yn(Vr[0], e);
        for (var n = 1; n < Vr.length; n++) {
            var r = Vr[n];
            r.blockedOn === e && (r.blockedOn = null);
        }
    }
    for (
        Dt !== null && Yn(Dt, e),
            $t !== null && Yn($t, e),
            Ot !== null && Yn(Ot, e),
            vr.forEach(t),
            gr.forEach(t),
            n = 0;
        n < Tt.length;
        n++
    )
        (r = Tt[n]), r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < Tt.length && ((n = Tt[0]), n.blockedOn === null); )
        Ou(n), n.blockedOn === null && Tt.shift();
}
var Pn = Et.ReactCurrentBatchConfig,
    Sl = !0;
function Nf(e, t, n, r) {
    var l = b,
        i = Pn.transition;
    Pn.transition = null;
    try {
        (b = 1), Wo(e, t, n, r);
    } finally {
        (b = l), (Pn.transition = i);
    }
}
function Ef(e, t, n, r) {
    var l = b,
        i = Pn.transition;
    Pn.transition = null;
    try {
        (b = 4), Wo(e, t, n, r);
    } finally {
        (b = l), (Pn.transition = i);
    }
}
function Wo(e, t, n, r) {
    if (Sl) {
        var l = eo(e, t, n, r);
        if (l === null) _i(e, t, r, xl, n), Hs(e, r);
        else if (xf(l, e, t, n, r)) r.stopPropagation();
        else if ((Hs(e, r), t & 4 && -1 < Sf.indexOf(e))) {
            for (; l !== null; ) {
                var i = Mr(l);
                if (
                    (i !== null && Mu(i),
                    (i = eo(e, t, n, r)),
                    i === null && _i(e, t, r, xl, n),
                    i === l)
                )
                    break;
                l = i;
            }
            l !== null && r.stopPropagation();
        } else _i(e, t, r, null, n);
    }
}
var xl = null;
function eo(e, t, n, r) {
    if (((xl = null), (e = Uo(r)), (e = Jt(e)), e !== null))
        if (((t = un(e)), t === null)) e = null;
        else if (((n = t.tag), n === 13)) {
            if (((e = Eu(t)), e !== null)) return e;
            e = null;
        } else if (n === 3) {
            if (t.stateNode.current.memoizedState.isDehydrated)
                return t.tag === 3 ? t.stateNode.containerInfo : null;
            e = null;
        } else t !== e && (e = null);
    return (xl = e), null;
}
function Fu(e) {
    switch (e) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
            return 1;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
            return 4;
        case "message":
            switch (ff()) {
                case Bo:
                    return 1;
                case Iu:
                    return 4;
                case _l:
                case pf:
                    return 16;
                case Tu:
                    return 536870912;
                default:
                    return 16;
            }
        default:
            return 16;
    }
}
var Mt = null,
    Ko = null,
    sl = null;
function Au() {
    if (sl) return sl;
    var e,
        t = Ko,
        n = t.length,
        r,
        l = "value" in Mt ? Mt.value : Mt.textContent,
        i = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++);
    var o = n - e;
    for (r = 1; r <= o && t[n - r] === l[i - r]; r++);
    return (sl = l.slice(e, 1 < r ? 1 - r : void 0));
}
function al(e) {
    var t = e.keyCode;
    return (
        "charCode" in e
            ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
            : (e = t),
        e === 10 && (e = 13),
        32 <= e || e === 13 ? e : 0
    );
}
function Wr() {
    return !0;
}
function Ws() {
    return !1;
}
function Ge(e) {
    function t(n, r, l, i, o) {
        (this._reactName = n),
            (this._targetInst = l),
            (this.type = r),
            (this.nativeEvent = i),
            (this.target = o),
            (this.currentTarget = null);
        for (var s in e)
            e.hasOwnProperty(s) && ((n = e[s]), (this[s] = n ? n(i) : i[s]));
        return (
            (this.isDefaultPrevented = (
                i.defaultPrevented != null
                    ? i.defaultPrevented
                    : i.returnValue === !1
            )
                ? Wr
                : Ws),
            (this.isPropagationStopped = Ws),
            this
        );
    }
    return (
        ce(t.prototype, {
            preventDefault: function () {
                this.defaultPrevented = !0;
                var n = this.nativeEvent;
                n &&
                    (n.preventDefault
                        ? n.preventDefault()
                        : typeof n.returnValue != "unknown" &&
                          (n.returnValue = !1),
                    (this.isDefaultPrevented = Wr));
            },
            stopPropagation: function () {
                var n = this.nativeEvent;
                n &&
                    (n.stopPropagation
                        ? n.stopPropagation()
                        : typeof n.cancelBubble != "unknown" &&
                          (n.cancelBubble = !0),
                    (this.isPropagationStopped = Wr));
            },
            persist: function () {},
            isPersistent: Wr,
        }),
        t
    );
}
var An = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function (e) {
            return e.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0,
    },
    Qo = Ge(An),
    Rr = ce({}, An, { view: 0, detail: 0 }),
    Cf = Ge(Rr),
    ci,
    di,
    Xn,
    Hl = ce({}, Rr, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: Go,
        button: 0,
        buttons: 0,
        relatedTarget: function (e) {
            return e.relatedTarget === void 0
                ? e.fromElement === e.srcElement
                    ? e.toElement
                    : e.fromElement
                : e.relatedTarget;
        },
        movementX: function (e) {
            return "movementX" in e
                ? e.movementX
                : (e !== Xn &&
                      (Xn && e.type === "mousemove"
                          ? ((ci = e.screenX - Xn.screenX),
                            (di = e.screenY - Xn.screenY))
                          : (di = ci = 0),
                      (Xn = e)),
                  ci);
        },
        movementY: function (e) {
            return "movementY" in e ? e.movementY : di;
        },
    }),
    Ks = Ge(Hl),
    jf = ce({}, Hl, { dataTransfer: 0 }),
    Pf = Ge(jf),
    If = ce({}, Rr, { relatedTarget: 0 }),
    fi = Ge(If),
    Tf = ce({}, An, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Lf = Ge(Tf),
    Rf = ce({}, An, {
        clipboardData: function (e) {
            return "clipboardData" in e
                ? e.clipboardData
                : window.clipboardData;
        },
    }),
    Mf = Ge(Rf),
    zf = ce({}, An, { data: 0 }),
    Qs = Ge(zf),
    Df = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified",
    },
    $f = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta",
    },
    Of = {
        Alt: "altKey",
        Control: "ctrlKey",
        Meta: "metaKey",
        Shift: "shiftKey",
    };
function Ff(e) {
    var t = this.nativeEvent;
    return t.getModifierState
        ? t.getModifierState(e)
        : (e = Of[e])
        ? !!t[e]
        : !1;
}
function Go() {
    return Ff;
}
var Af = ce({}, Rr, {
        key: function (e) {
            if (e.key) {
                var t = Df[e.key] || e.key;
                if (t !== "Unidentified") return t;
            }
            return e.type === "keypress"
                ? ((e = al(e)), e === 13 ? "Enter" : String.fromCharCode(e))
                : e.type === "keydown" || e.type === "keyup"
                ? $f[e.keyCode] || "Unidentified"
                : "";
        },
        code: 0,
        location: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        repeat: 0,
        locale: 0,
        getModifierState: Go,
        charCode: function (e) {
            return e.type === "keypress" ? al(e) : 0;
        },
        keyCode: function (e) {
            return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
        },
        which: function (e) {
            return e.type === "keypress"
                ? al(e)
                : e.type === "keydown" || e.type === "keyup"
                ? e.keyCode
                : 0;
        },
    }),
    Uf = Ge(Af),
    Bf = ce({}, Hl, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0,
    }),
    Gs = Ge(Bf),
    Hf = ce({}, Rr, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: Go,
    }),
    Vf = Ge(Hf),
    Wf = ce({}, An, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Kf = Ge(Wf),
    Qf = ce({}, Hl, {
        deltaX: function (e) {
            return "deltaX" in e
                ? e.deltaX
                : "wheelDeltaX" in e
                ? -e.wheelDeltaX
                : 0;
        },
        deltaY: function (e) {
            return "deltaY" in e
                ? e.deltaY
                : "wheelDeltaY" in e
                ? -e.wheelDeltaY
                : "wheelDelta" in e
                ? -e.wheelDelta
                : 0;
        },
        deltaZ: 0,
        deltaMode: 0,
    }),
    Gf = Ge(Qf),
    Yf = [9, 13, 27, 32],
    Yo = St && "CompositionEvent" in window,
    or = null;
St && "documentMode" in document && (or = document.documentMode);
var Xf = St && "TextEvent" in window && !or,
    Uu = St && (!Yo || (or && 8 < or && 11 >= or)),
    Ys = " ",
    Xs = !1;
function Bu(e, t) {
    switch (e) {
        case "keyup":
            return Yf.indexOf(t.keyCode) !== -1;
        case "keydown":
            return t.keyCode !== 229;
        case "keypress":
        case "mousedown":
        case "focusout":
            return !0;
        default:
            return !1;
    }
}
function Hu(e) {
    return (e = e.detail), typeof e == "object" && "data" in e ? e.data : null;
}
var mn = !1;
function Zf(e, t) {
    switch (e) {
        case "compositionend":
            return Hu(t);
        case "keypress":
            return t.which !== 32 ? null : ((Xs = !0), Ys);
        case "textInput":
            return (e = t.data), e === Ys && Xs ? null : e;
        default:
            return null;
    }
}
function Jf(e, t) {
    if (mn)
        return e === "compositionend" || (!Yo && Bu(e, t))
            ? ((e = Au()), (sl = Ko = Mt = null), (mn = !1), e)
            : null;
    switch (e) {
        case "paste":
            return null;
        case "keypress":
            if (
                !(t.ctrlKey || t.altKey || t.metaKey) ||
                (t.ctrlKey && t.altKey)
            ) {
                if (t.char && 1 < t.char.length) return t.char;
                if (t.which) return String.fromCharCode(t.which);
            }
            return null;
        case "compositionend":
            return Uu && t.locale !== "ko" ? null : t.data;
        default:
            return null;
    }
}
var qf = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
};
function Zs(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!qf[e.type] : t === "textarea";
}
function Vu(e, t, n, r) {
    wu(r),
        (t = kl(t, "onChange")),
        0 < t.length &&
            ((n = new Qo("onChange", "change", null, n, r)),
            e.push({ event: n, listeners: t }));
}
var sr = null,
    _r = null;
function bf(e) {
    ec(e, 0);
}
function Vl(e) {
    var t = gn(e);
    if (pu(t)) return e;
}
function ep(e, t) {
    if (e === "change") return t;
}
var Wu = !1;
if (St) {
    var pi;
    if (St) {
        var mi = "oninput" in document;
        if (!mi) {
            var Js = document.createElement("div");
            Js.setAttribute("oninput", "return;"),
                (mi = typeof Js.oninput == "function");
        }
        pi = mi;
    } else pi = !1;
    Wu = pi && (!document.documentMode || 9 < document.documentMode);
}
function qs() {
    sr && (sr.detachEvent("onpropertychange", Ku), (_r = sr = null));
}
function Ku(e) {
    if (e.propertyName === "value" && Vl(_r)) {
        var t = [];
        Vu(t, _r, e, Uo(e)), Nu(bf, t);
    }
}
function tp(e, t, n) {
    e === "focusin"
        ? (qs(), (sr = t), (_r = n), sr.attachEvent("onpropertychange", Ku))
        : e === "focusout" && qs();
}
function np(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return Vl(_r);
}
function rp(e, t) {
    if (e === "click") return Vl(t);
}
function lp(e, t) {
    if (e === "input" || e === "change") return Vl(t);
}
function ip(e, t) {
    return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var st = typeof Object.is == "function" ? Object.is : ip;
function wr(e, t) {
    if (st(e, t)) return !0;
    if (
        typeof e != "object" ||
        e === null ||
        typeof t != "object" ||
        t === null
    )
        return !1;
    var n = Object.keys(e),
        r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
        var l = n[r];
        if (!$i.call(t, l) || !st(e[l], t[l])) return !1;
    }
    return !0;
}
function bs(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
}
function ea(e, t) {
    var n = bs(e);
    e = 0;
    for (var r; n; ) {
        if (n.nodeType === 3) {
            if (((r = e + n.textContent.length), e <= t && r >= t))
                return { node: n, offset: t - e };
            e = r;
        }
        e: {
            for (; n; ) {
                if (n.nextSibling) {
                    n = n.nextSibling;
                    break e;
                }
                n = n.parentNode;
            }
            n = void 0;
        }
        n = bs(n);
    }
}
function Qu(e, t) {
    return e && t
        ? e === t
            ? !0
            : e && e.nodeType === 3
            ? !1
            : t && t.nodeType === 3
            ? Qu(e, t.parentNode)
            : "contains" in e
            ? e.contains(t)
            : e.compareDocumentPosition
            ? !!(e.compareDocumentPosition(t) & 16)
            : !1
        : !1;
}
function Gu() {
    for (var e = window, t = vl(); t instanceof e.HTMLIFrameElement; ) {
        try {
            var n = typeof t.contentWindow.location.href == "string";
        } catch {
            n = !1;
        }
        if (n) e = t.contentWindow;
        else break;
        t = vl(e.document);
    }
    return t;
}
function Xo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return (
        t &&
        ((t === "input" &&
            (e.type === "text" ||
                e.type === "search" ||
                e.type === "tel" ||
                e.type === "url" ||
                e.type === "password")) ||
            t === "textarea" ||
            e.contentEditable === "true")
    );
}
function op(e) {
    var t = Gu(),
        n = e.focusedElem,
        r = e.selectionRange;
    if (
        t !== n &&
        n &&
        n.ownerDocument &&
        Qu(n.ownerDocument.documentElement, n)
    ) {
        if (r !== null && Xo(n)) {
            if (
                ((t = r.start),
                (e = r.end),
                e === void 0 && (e = t),
                "selectionStart" in n)
            )
                (n.selectionStart = t),
                    (n.selectionEnd = Math.min(e, n.value.length));
            else if (
                ((e =
                    ((t = n.ownerDocument || document) && t.defaultView) ||
                    window),
                e.getSelection)
            ) {
                e = e.getSelection();
                var l = n.textContent.length,
                    i = Math.min(r.start, l);
                (r = r.end === void 0 ? i : Math.min(r.end, l)),
                    !e.extend && i > r && ((l = r), (r = i), (i = l)),
                    (l = ea(n, i));
                var o = ea(n, r);
                l &&
                    o &&
                    (e.rangeCount !== 1 ||
                        e.anchorNode !== l.node ||
                        e.anchorOffset !== l.offset ||
                        e.focusNode !== o.node ||
                        e.focusOffset !== o.offset) &&
                    ((t = t.createRange()),
                    t.setStart(l.node, l.offset),
                    e.removeAllRanges(),
                    i > r
                        ? (e.addRange(t), e.extend(o.node, o.offset))
                        : (t.setEnd(o.node, o.offset), e.addRange(t)));
            }
        }
        for (t = [], e = n; (e = e.parentNode); )
            e.nodeType === 1 &&
                t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
        for (
            typeof n.focus == "function" && n.focus(), n = 0;
            n < t.length;
            n++
        )
            (e = t[n]),
                (e.element.scrollLeft = e.left),
                (e.element.scrollTop = e.top);
    }
}
var sp = St && "documentMode" in document && 11 >= document.documentMode,
    hn = null,
    to = null,
    ar = null,
    no = !1;
function ta(e, t, n) {
    var r =
        n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    no ||
        hn == null ||
        hn !== vl(r) ||
        ((r = hn),
        "selectionStart" in r && Xo(r)
            ? (r = { start: r.selectionStart, end: r.selectionEnd })
            : ((r = (
                  (r.ownerDocument && r.ownerDocument.defaultView) ||
                  window
              ).getSelection()),
              (r = {
                  anchorNode: r.anchorNode,
                  anchorOffset: r.anchorOffset,
                  focusNode: r.focusNode,
                  focusOffset: r.focusOffset,
              })),
        (ar && wr(ar, r)) ||
            ((ar = r),
            (r = kl(to, "onSelect")),
            0 < r.length &&
                ((t = new Qo("onSelect", "select", null, t, n)),
                e.push({ event: t, listeners: r }),
                (t.target = hn))));
}
function Kr(e, t) {
    var n = {};
    return (
        (n[e.toLowerCase()] = t.toLowerCase()),
        (n["Webkit" + e] = "webkit" + t),
        (n["Moz" + e] = "moz" + t),
        n
    );
}
var vn = {
        animationend: Kr("Animation", "AnimationEnd"),
        animationiteration: Kr("Animation", "AnimationIteration"),
        animationstart: Kr("Animation", "AnimationStart"),
        transitionend: Kr("Transition", "TransitionEnd"),
    },
    hi = {},
    Yu = {};
St &&
    ((Yu = document.createElement("div").style),
    "AnimationEvent" in window ||
        (delete vn.animationend.animation,
        delete vn.animationiteration.animation,
        delete vn.animationstart.animation),
    "TransitionEvent" in window || delete vn.transitionend.transition);
function Wl(e) {
    if (hi[e]) return hi[e];
    if (!vn[e]) return e;
    var t = vn[e],
        n;
    for (n in t) if (t.hasOwnProperty(n) && n in Yu) return (hi[e] = t[n]);
    return e;
}
var Xu = Wl("animationend"),
    Zu = Wl("animationiteration"),
    Ju = Wl("animationstart"),
    qu = Wl("transitionend"),
    bu = new Map(),
    na =
        "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
            " "
        );
function Kt(e, t) {
    bu.set(e, t), an(t, [e]);
}
for (var vi = 0; vi < na.length; vi++) {
    var gi = na[vi],
        ap = gi.toLowerCase(),
        up = gi[0].toUpperCase() + gi.slice(1);
    Kt(ap, "on" + up);
}
Kt(Xu, "onAnimationEnd");
Kt(Zu, "onAnimationIteration");
Kt(Ju, "onAnimationStart");
Kt("dblclick", "onDoubleClick");
Kt("focusin", "onFocus");
Kt("focusout", "onBlur");
Kt(qu, "onTransitionEnd");
Ln("onMouseEnter", ["mouseout", "mouseover"]);
Ln("onMouseLeave", ["mouseout", "mouseover"]);
Ln("onPointerEnter", ["pointerout", "pointerover"]);
Ln("onPointerLeave", ["pointerout", "pointerover"]);
an(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(
        " "
    )
);
an(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " "
    )
);
an("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
an(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
);
an(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
);
an(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
);
var rr =
        "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
            " "
        ),
    cp = new Set(
        "cancel close invalid load scroll toggle".split(" ").concat(rr)
    );
function ra(e, t, n) {
    var r = e.type || "unknown-event";
    (e.currentTarget = n), af(r, t, void 0, e), (e.currentTarget = null);
}
function ec(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
        var r = e[n],
            l = r.event;
        r = r.listeners;
        e: {
            var i = void 0;
            if (t)
                for (var o = r.length - 1; 0 <= o; o--) {
                    var s = r[o],
                        a = s.instance,
                        f = s.currentTarget;
                    if (((s = s.listener), a !== i && l.isPropagationStopped()))
                        break e;
                    ra(l, s, f), (i = a);
                }
            else
                for (o = 0; o < r.length; o++) {
                    if (
                        ((s = r[o]),
                        (a = s.instance),
                        (f = s.currentTarget),
                        (s = s.listener),
                        a !== i && l.isPropagationStopped())
                    )
                        break e;
                    ra(l, s, f), (i = a);
                }
        }
    }
    if (yl) throw ((e = Ji), (yl = !1), (Ji = null), e);
}
function re(e, t) {
    var n = t[so];
    n === void 0 && (n = t[so] = new Set());
    var r = e + "__bubble";
    n.has(r) || (tc(t, e, 2, !1), n.add(r));
}
function yi(e, t, n) {
    var r = 0;
    t && (r |= 4), tc(n, e, r, t);
}
var Qr = "_reactListening" + Math.random().toString(36).slice(2);
function Sr(e) {
    if (!e[Qr]) {
        (e[Qr] = !0),
            au.forEach(function (n) {
                n !== "selectionchange" &&
                    (cp.has(n) || yi(n, !1, e), yi(n, !0, e));
            });
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[Qr] || ((t[Qr] = !0), yi("selectionchange", !1, t));
    }
}
function tc(e, t, n, r) {
    switch (Fu(t)) {
        case 1:
            var l = Nf;
            break;
        case 4:
            l = Ef;
            break;
        default:
            l = Wo;
    }
    (n = l.bind(null, t, n, e)),
        (l = void 0),
        !Zi ||
            (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
            (l = !0),
        r
            ? l !== void 0
                ? e.addEventListener(t, n, { capture: !0, passive: l })
                : e.addEventListener(t, n, !0)
            : l !== void 0
            ? e.addEventListener(t, n, { passive: l })
            : e.addEventListener(t, n, !1);
}
function _i(e, t, n, r, l) {
    var i = r;
    if (!(t & 1) && !(t & 2) && r !== null)
        e: for (;;) {
            if (r === null) return;
            var o = r.tag;
            if (o === 3 || o === 4) {
                var s = r.stateNode.containerInfo;
                if (s === l || (s.nodeType === 8 && s.parentNode === l)) break;
                if (o === 4)
                    for (o = r.return; o !== null; ) {
                        var a = o.tag;
                        if (
                            (a === 3 || a === 4) &&
                            ((a = o.stateNode.containerInfo),
                            a === l || (a.nodeType === 8 && a.parentNode === l))
                        )
                            return;
                        o = o.return;
                    }
                for (; s !== null; ) {
                    if (((o = Jt(s)), o === null)) return;
                    if (((a = o.tag), a === 5 || a === 6)) {
                        r = i = o;
                        continue e;
                    }
                    s = s.parentNode;
                }
            }
            r = r.return;
        }
    Nu(function () {
        var f = i,
            h = Uo(n),
            m = [];
        e: {
            var v = bu.get(e);
            if (v !== void 0) {
                var _ = Qo,
                    S = e;
                switch (e) {
                    case "keypress":
                        if (al(n) === 0) break e;
                    case "keydown":
                    case "keyup":
                        _ = Uf;
                        break;
                    case "focusin":
                        (S = "focus"), (_ = fi);
                        break;
                    case "focusout":
                        (S = "blur"), (_ = fi);
                        break;
                    case "beforeblur":
                    case "afterblur":
                        _ = fi;
                        break;
                    case "click":
                        if (n.button === 2) break e;
                    case "auxclick":
                    case "dblclick":
                    case "mousedown":
                    case "mousemove":
                    case "mouseup":
                    case "mouseout":
                    case "mouseover":
                    case "contextmenu":
                        _ = Ks;
                        break;
                    case "drag":
                    case "dragend":
                    case "dragenter":
                    case "dragexit":
                    case "dragleave":
                    case "dragover":
                    case "dragstart":
                    case "drop":
                        _ = Pf;
                        break;
                    case "touchcancel":
                    case "touchend":
                    case "touchmove":
                    case "touchstart":
                        _ = Vf;
                        break;
                    case Xu:
                    case Zu:
                    case Ju:
                        _ = Lf;
                        break;
                    case qu:
                        _ = Kf;
                        break;
                    case "scroll":
                        _ = Cf;
                        break;
                    case "wheel":
                        _ = Gf;
                        break;
                    case "copy":
                    case "cut":
                    case "paste":
                        _ = Mf;
                        break;
                    case "gotpointercapture":
                    case "lostpointercapture":
                    case "pointercancel":
                    case "pointerdown":
                    case "pointermove":
                    case "pointerout":
                    case "pointerover":
                    case "pointerup":
                        _ = Gs;
                }
                var N = (t & 4) !== 0,
                    K = !N && e === "scroll",
                    p = N ? (v !== null ? v + "Capture" : null) : v;
                N = [];
                for (var d = f, c; d !== null; ) {
                    c = d;
                    var g = c.stateNode;
                    if (
                        (c.tag === 5 &&
                            g !== null &&
                            ((c = g),
                            p !== null &&
                                ((g = hr(d, p)),
                                g != null && N.push(xr(d, g, c)))),
                        K)
                    )
                        break;
                    d = d.return;
                }
                0 < N.length &&
                    ((v = new _(v, S, null, n, h)),
                    m.push({ event: v, listeners: N }));
            }
        }
        if (!(t & 7)) {
            e: {
                if (
                    ((v = e === "mouseover" || e === "pointerover"),
                    (_ = e === "mouseout" || e === "pointerout"),
                    v &&
                        n !== Yi &&
                        (S = n.relatedTarget || n.fromElement) &&
                        (Jt(S) || S[xt]))
                )
                    break e;
                if (
                    (_ || v) &&
                    ((v =
                        h.window === h
                            ? h
                            : (v = h.ownerDocument)
                            ? v.defaultView || v.parentWindow
                            : window),
                    _
                        ? ((S = n.relatedTarget || n.toElement),
                          (_ = f),
                          (S = S ? Jt(S) : null),
                          S !== null &&
                              ((K = un(S)),
                              S !== K || (S.tag !== 5 && S.tag !== 6)) &&
                              (S = null))
                        : ((_ = null), (S = f)),
                    _ !== S)
                ) {
                    if (
                        ((N = Ks),
                        (g = "onMouseLeave"),
                        (p = "onMouseEnter"),
                        (d = "mouse"),
                        (e === "pointerout" || e === "pointerover") &&
                            ((N = Gs),
                            (g = "onPointerLeave"),
                            (p = "onPointerEnter"),
                            (d = "pointer")),
                        (K = _ == null ? v : gn(_)),
                        (c = S == null ? v : gn(S)),
                        (v = new N(g, d + "leave", _, n, h)),
                        (v.target = K),
                        (v.relatedTarget = c),
                        (g = null),
                        Jt(h) === f &&
                            ((N = new N(p, d + "enter", S, n, h)),
                            (N.target = c),
                            (N.relatedTarget = K),
                            (g = N)),
                        (K = g),
                        _ && S)
                    )
                        t: {
                            for (N = _, p = S, d = 0, c = N; c; c = cn(c)) d++;
                            for (c = 0, g = p; g; g = cn(g)) c++;
                            for (; 0 < d - c; ) (N = cn(N)), d--;
                            for (; 0 < c - d; ) (p = cn(p)), c--;
                            for (; d--; ) {
                                if (
                                    N === p ||
                                    (p !== null && N === p.alternate)
                                )
                                    break t;
                                (N = cn(N)), (p = cn(p));
                            }
                            N = null;
                        }
                    else N = null;
                    _ !== null && la(m, v, _, N, !1),
                        S !== null && K !== null && la(m, K, S, N, !0);
                }
            }
            e: {
                if (
                    ((v = f ? gn(f) : window),
                    (_ = v.nodeName && v.nodeName.toLowerCase()),
                    _ === "select" || (_ === "input" && v.type === "file"))
                )
                    var x = ep;
                else if (Zs(v))
                    if (Wu) x = lp;
                    else {
                        x = np;
                        var E = tp;
                    }
                else
                    (_ = v.nodeName) &&
                        _.toLowerCase() === "input" &&
                        (v.type === "checkbox" || v.type === "radio") &&
                        (x = rp);
                if (x && (x = x(e, f))) {
                    Vu(m, x, n, h);
                    break e;
                }
                E && E(e, v, f),
                    e === "focusout" &&
                        (E = v._wrapperState) &&
                        E.controlled &&
                        v.type === "number" &&
                        Vi(v, "number", v.value);
            }
            switch (((E = f ? gn(f) : window), e)) {
                case "focusin":
                    (Zs(E) || E.contentEditable === "true") &&
                        ((hn = E), (to = f), (ar = null));
                    break;
                case "focusout":
                    ar = to = hn = null;
                    break;
                case "mousedown":
                    no = !0;
                    break;
                case "contextmenu":
                case "mouseup":
                case "dragend":
                    (no = !1), ta(m, n, h);
                    break;
                case "selectionchange":
                    if (sp) break;
                case "keydown":
                case "keyup":
                    ta(m, n, h);
            }
            var w;
            if (Yo)
                e: {
                    switch (e) {
                        case "compositionstart":
                            var R = "onCompositionStart";
                            break e;
                        case "compositionend":
                            R = "onCompositionEnd";
                            break e;
                        case "compositionupdate":
                            R = "onCompositionUpdate";
                            break e;
                    }
                    R = void 0;
                }
            else
                mn
                    ? Bu(e, n) && (R = "onCompositionEnd")
                    : e === "keydown" &&
                      n.keyCode === 229 &&
                      (R = "onCompositionStart");
            R &&
                (Uu &&
                    n.locale !== "ko" &&
                    (mn || R !== "onCompositionStart"
                        ? R === "onCompositionEnd" && mn && (w = Au())
                        : ((Mt = h),
                          (Ko = "value" in Mt ? Mt.value : Mt.textContent),
                          (mn = !0))),
                (E = kl(f, R)),
                0 < E.length &&
                    ((R = new Qs(R, e, null, n, h)),
                    m.push({ event: R, listeners: E }),
                    w
                        ? (R.data = w)
                        : ((w = Hu(n)), w !== null && (R.data = w)))),
                (w = Xf ? Zf(e, n) : Jf(e, n)) &&
                    ((f = kl(f, "onBeforeInput")),
                    0 < f.length &&
                        ((h = new Qs(
                            "onBeforeInput",
                            "beforeinput",
                            null,
                            n,
                            h
                        )),
                        m.push({ event: h, listeners: f }),
                        (h.data = w)));
        }
        ec(m, t);
    });
}
function xr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
}
function kl(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
        var l = e,
            i = l.stateNode;
        l.tag === 5 &&
            i !== null &&
            ((l = i),
            (i = hr(e, n)),
            i != null && r.unshift(xr(e, i, l)),
            (i = hr(e, t)),
            i != null && r.push(xr(e, i, l))),
            (e = e.return);
    }
    return r;
}
function cn(e) {
    if (e === null) return null;
    do e = e.return;
    while (e && e.tag !== 5);
    return e || null;
}
function la(e, t, n, r, l) {
    for (var i = t._reactName, o = []; n !== null && n !== r; ) {
        var s = n,
            a = s.alternate,
            f = s.stateNode;
        if (a !== null && a === r) break;
        s.tag === 5 &&
            f !== null &&
            ((s = f),
            l
                ? ((a = hr(n, i)), a != null && o.unshift(xr(n, a, s)))
                : l || ((a = hr(n, i)), a != null && o.push(xr(n, a, s)))),
            (n = n.return);
    }
    o.length !== 0 && e.push({ event: t, listeners: o });
}
var dp = /\r\n?/g,
    fp = /\u0000|\uFFFD/g;
function ia(e) {
    return (typeof e == "string" ? e : "" + e)
        .replace(
            dp,
            `
`
        )
        .replace(fp, "");
}
function Gr(e, t, n) {
    if (((t = ia(t)), ia(e) !== t && n)) throw Error(j(425));
}
function Nl() {}
var ro = null,
    lo = null;
function io(e, t) {
    return (
        e === "textarea" ||
        e === "noscript" ||
        typeof t.children == "string" ||
        typeof t.children == "number" ||
        (typeof t.dangerouslySetInnerHTML == "object" &&
            t.dangerouslySetInnerHTML !== null &&
            t.dangerouslySetInnerHTML.__html != null)
    );
}
var oo = typeof setTimeout == "function" ? setTimeout : void 0,
    pp = typeof clearTimeout == "function" ? clearTimeout : void 0,
    oa = typeof Promise == "function" ? Promise : void 0,
    mp =
        typeof queueMicrotask == "function"
            ? queueMicrotask
            : typeof oa < "u"
            ? function (e) {
                  return oa.resolve(null).then(e).catch(hp);
              }
            : oo;
function hp(e) {
    setTimeout(function () {
        throw e;
    });
}
function wi(e, t) {
    var n = t,
        r = 0;
    do {
        var l = n.nextSibling;
        if ((e.removeChild(n), l && l.nodeType === 8))
            if (((n = l.data), n === "/$")) {
                if (r === 0) {
                    e.removeChild(l), yr(t);
                    return;
                }
                r--;
            } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
        n = l;
    } while (n);
    yr(t);
}
function Ft(e) {
    for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === 1 || t === 3) break;
        if (t === 8) {
            if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
            if (t === "/$") return null;
        }
    }
    return e;
}
function sa(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
        if (e.nodeType === 8) {
            var n = e.data;
            if (n === "$" || n === "$!" || n === "$?") {
                if (t === 0) return e;
                t--;
            } else n === "/$" && t++;
        }
        e = e.previousSibling;
    }
    return null;
}
var Un = Math.random().toString(36).slice(2),
    ft = "__reactFiber$" + Un,
    kr = "__reactProps$" + Un,
    xt = "__reactContainer$" + Un,
    so = "__reactEvents$" + Un,
    vp = "__reactListeners$" + Un,
    gp = "__reactHandles$" + Un;
function Jt(e) {
    var t = e[ft];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
        if ((t = n[xt] || n[ft])) {
            if (
                ((n = t.alternate),
                t.child !== null || (n !== null && n.child !== null))
            )
                for (e = sa(e); e !== null; ) {
                    if ((n = e[ft])) return n;
                    e = sa(e);
                }
            return t;
        }
        (e = n), (n = e.parentNode);
    }
    return null;
}
function Mr(e) {
    return (
        (e = e[ft] || e[xt]),
        !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3)
            ? null
            : e
    );
}
function gn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(j(33));
}
function Kl(e) {
    return e[kr] || null;
}
var ao = [],
    yn = -1;
function Qt(e) {
    return { current: e };
}
function le(e) {
    0 > yn || ((e.current = ao[yn]), (ao[yn] = null), yn--);
}
function te(e, t) {
    yn++, (ao[yn] = e.current), (e.current = t);
}
var Wt = {},
    Ie = Qt(Wt),
    Fe = Qt(!1),
    nn = Wt;
function Rn(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Wt;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
        return r.__reactInternalMemoizedMaskedChildContext;
    var l = {},
        i;
    for (i in n) l[i] = t[i];
    return (
        r &&
            ((e = e.stateNode),
            (e.__reactInternalMemoizedUnmaskedChildContext = t),
            (e.__reactInternalMemoizedMaskedChildContext = l)),
        l
    );
}
function Ae(e) {
    return (e = e.childContextTypes), e != null;
}
function El() {
    le(Fe), le(Ie);
}
function aa(e, t, n) {
    if (Ie.current !== Wt) throw Error(j(168));
    te(Ie, t), te(Fe, n);
}
function nc(e, t, n) {
    var r = e.stateNode;
    if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
        return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(j(108, ef(e) || "Unknown", l));
    return ce({}, n, r);
}
function Cl(e) {
    return (
        (e =
            ((e = e.stateNode) &&
                e.__reactInternalMemoizedMergedChildContext) ||
            Wt),
        (nn = Ie.current),
        te(Ie, e),
        te(Fe, Fe.current),
        !0
    );
}
function ua(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(j(169));
    n
        ? ((e = nc(e, t, nn)),
          (r.__reactInternalMemoizedMergedChildContext = e),
          le(Fe),
          le(Ie),
          te(Ie, e))
        : le(Fe),
        te(Fe, n);
}
var gt = null,
    Ql = !1,
    Si = !1;
function rc(e) {
    gt === null ? (gt = [e]) : gt.push(e);
}
function yp(e) {
    (Ql = !0), rc(e);
}
function Gt() {
    if (!Si && gt !== null) {
        Si = !0;
        var e = 0,
            t = b;
        try {
            var n = gt;
            for (b = 1; e < n.length; e++) {
                var r = n[e];
                do r = r(!0);
                while (r !== null);
            }
            (gt = null), (Ql = !1);
        } catch (l) {
            throw (gt !== null && (gt = gt.slice(e + 1)), Pu(Bo, Gt), l);
        } finally {
            (b = t), (Si = !1);
        }
    }
    return null;
}
var _n = [],
    wn = 0,
    jl = null,
    Pl = 0,
    Xe = [],
    Ze = 0,
    rn = null,
    yt = 1,
    _t = "";
function Xt(e, t) {
    (_n[wn++] = Pl), (_n[wn++] = jl), (jl = e), (Pl = t);
}
function lc(e, t, n) {
    (Xe[Ze++] = yt), (Xe[Ze++] = _t), (Xe[Ze++] = rn), (rn = e);
    var r = yt;
    e = _t;
    var l = 32 - it(r) - 1;
    (r &= ~(1 << l)), (n += 1);
    var i = 32 - it(t) + l;
    if (30 < i) {
        var o = l - (l % 5);
        (i = (r & ((1 << o) - 1)).toString(32)),
            (r >>= o),
            (l -= o),
            (yt = (1 << (32 - it(t) + l)) | (n << l) | r),
            (_t = i + e);
    } else (yt = (1 << i) | (n << l) | r), (_t = e);
}
function Zo(e) {
    e.return !== null && (Xt(e, 1), lc(e, 1, 0));
}
function Jo(e) {
    for (; e === jl; )
        (jl = _n[--wn]), (_n[wn] = null), (Pl = _n[--wn]), (_n[wn] = null);
    for (; e === rn; )
        (rn = Xe[--Ze]),
            (Xe[Ze] = null),
            (_t = Xe[--Ze]),
            (Xe[Ze] = null),
            (yt = Xe[--Ze]),
            (Xe[Ze] = null);
}
var We = null,
    Ve = null,
    se = !1,
    lt = null;
function ic(e, t) {
    var n = Je(5, null, null, 0);
    (n.elementType = "DELETED"),
        (n.stateNode = t),
        (n.return = e),
        (t = e.deletions),
        t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n);
}
function ca(e, t) {
    switch (e.tag) {
        case 5:
            var n = e.type;
            return (
                (t =
                    t.nodeType !== 1 ||
                    n.toLowerCase() !== t.nodeName.toLowerCase()
                        ? null
                        : t),
                t !== null
                    ? ((e.stateNode = t), (We = e), (Ve = Ft(t.firstChild)), !0)
                    : !1
            );
        case 6:
            return (
                (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
                t !== null ? ((e.stateNode = t), (We = e), (Ve = null), !0) : !1
            );
        case 13:
            return (
                (t = t.nodeType !== 8 ? null : t),
                t !== null
                    ? ((n = rn !== null ? { id: yt, overflow: _t } : null),
                      (e.memoizedState = {
                          dehydrated: t,
                          treeContext: n,
                          retryLane: 1073741824,
                      }),
                      (n = Je(18, null, null, 0)),
                      (n.stateNode = t),
                      (n.return = e),
                      (e.child = n),
                      (We = e),
                      (Ve = null),
                      !0)
                    : !1
            );
        default:
            return !1;
    }
}
function uo(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function co(e) {
    if (se) {
        var t = Ve;
        if (t) {
            var n = t;
            if (!ca(e, t)) {
                if (uo(e)) throw Error(j(418));
                t = Ft(n.nextSibling);
                var r = We;
                t && ca(e, t)
                    ? ic(r, n)
                    : ((e.flags = (e.flags & -4097) | 2), (se = !1), (We = e));
            }
        } else {
            if (uo(e)) throw Error(j(418));
            (e.flags = (e.flags & -4097) | 2), (se = !1), (We = e);
        }
    }
}
function da(e) {
    for (
        e = e.return;
        e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;

    )
        e = e.return;
    We = e;
}
function Yr(e) {
    if (e !== We) return !1;
    if (!se) return da(e), (se = !0), !1;
    var t;
    if (
        ((t = e.tag !== 3) &&
            !(t = e.tag !== 5) &&
            ((t = e.type),
            (t = t !== "head" && t !== "body" && !io(e.type, e.memoizedProps))),
        t && (t = Ve))
    ) {
        if (uo(e)) throw (oc(), Error(j(418)));
        for (; t; ) ic(e, t), (t = Ft(t.nextSibling));
    }
    if ((da(e), e.tag === 13)) {
        if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
            throw Error(j(317));
        e: {
            for (e = e.nextSibling, t = 0; e; ) {
                if (e.nodeType === 8) {
                    var n = e.data;
                    if (n === "/$") {
                        if (t === 0) {
                            Ve = Ft(e.nextSibling);
                            break e;
                        }
                        t--;
                    } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
                }
                e = e.nextSibling;
            }
            Ve = null;
        }
    } else Ve = We ? Ft(e.stateNode.nextSibling) : null;
    return !0;
}
function oc() {
    for (var e = Ve; e; ) e = Ft(e.nextSibling);
}
function Mn() {
    (Ve = We = null), (se = !1);
}
function qo(e) {
    lt === null ? (lt = [e]) : lt.push(e);
}
var _p = Et.ReactCurrentBatchConfig;
function Zn(e, t, n) {
    if (
        ((e = n.ref),
        e !== null && typeof e != "function" && typeof e != "object")
    ) {
        if (n._owner) {
            if (((n = n._owner), n)) {
                if (n.tag !== 1) throw Error(j(309));
                var r = n.stateNode;
            }
            if (!r) throw Error(j(147, e));
            var l = r,
                i = "" + e;
            return t !== null &&
                t.ref !== null &&
                typeof t.ref == "function" &&
                t.ref._stringRef === i
                ? t.ref
                : ((t = function (o) {
                      var s = l.refs;
                      o === null ? delete s[i] : (s[i] = o);
                  }),
                  (t._stringRef = i),
                  t);
        }
        if (typeof e != "string") throw Error(j(284));
        if (!n._owner) throw Error(j(290, e));
    }
    return e;
}
function Xr(e, t) {
    throw (
        ((e = Object.prototype.toString.call(t)),
        Error(
            j(
                31,
                e === "[object Object]"
                    ? "object with keys {" + Object.keys(t).join(", ") + "}"
                    : e
            )
        ))
    );
}
function fa(e) {
    var t = e._init;
    return t(e._payload);
}
function sc(e) {
    function t(p, d) {
        if (e) {
            var c = p.deletions;
            c === null ? ((p.deletions = [d]), (p.flags |= 16)) : c.push(d);
        }
    }
    function n(p, d) {
        if (!e) return null;
        for (; d !== null; ) t(p, d), (d = d.sibling);
        return null;
    }
    function r(p, d) {
        for (p = new Map(); d !== null; )
            d.key !== null ? p.set(d.key, d) : p.set(d.index, d),
                (d = d.sibling);
        return p;
    }
    function l(p, d) {
        return (p = Ht(p, d)), (p.index = 0), (p.sibling = null), p;
    }
    function i(p, d, c) {
        return (
            (p.index = c),
            e
                ? ((c = p.alternate),
                  c !== null
                      ? ((c = c.index), c < d ? ((p.flags |= 2), d) : c)
                      : ((p.flags |= 2), d))
                : ((p.flags |= 1048576), d)
        );
    }
    function o(p) {
        return e && p.alternate === null && (p.flags |= 2), p;
    }
    function s(p, d, c, g) {
        return d === null || d.tag !== 6
            ? ((d = Pi(c, p.mode, g)), (d.return = p), d)
            : ((d = l(d, c)), (d.return = p), d);
    }
    function a(p, d, c, g) {
        var x = c.type;
        return x === pn
            ? h(p, d, c.props.children, g, c.key)
            : d !== null &&
              (d.elementType === x ||
                  (typeof x == "object" &&
                      x !== null &&
                      x.$$typeof === Pt &&
                      fa(x) === d.type))
            ? ((g = l(d, c.props)), (g.ref = Zn(p, d, c)), (g.return = p), g)
            : ((g = hl(c.type, c.key, c.props, null, p.mode, g)),
              (g.ref = Zn(p, d, c)),
              (g.return = p),
              g);
    }
    function f(p, d, c, g) {
        return d === null ||
            d.tag !== 4 ||
            d.stateNode.containerInfo !== c.containerInfo ||
            d.stateNode.implementation !== c.implementation
            ? ((d = Ii(c, p.mode, g)), (d.return = p), d)
            : ((d = l(d, c.children || [])), (d.return = p), d);
    }
    function h(p, d, c, g, x) {
        return d === null || d.tag !== 7
            ? ((d = tn(c, p.mode, g, x)), (d.return = p), d)
            : ((d = l(d, c)), (d.return = p), d);
    }
    function m(p, d, c) {
        if ((typeof d == "string" && d !== "") || typeof d == "number")
            return (d = Pi("" + d, p.mode, c)), (d.return = p), d;
        if (typeof d == "object" && d !== null) {
            switch (d.$$typeof) {
                case Fr:
                    return (
                        (c = hl(d.type, d.key, d.props, null, p.mode, c)),
                        (c.ref = Zn(p, null, d)),
                        (c.return = p),
                        c
                    );
                case fn:
                    return (d = Ii(d, p.mode, c)), (d.return = p), d;
                case Pt:
                    var g = d._init;
                    return m(p, g(d._payload), c);
            }
            if (tr(d) || Kn(d))
                return (d = tn(d, p.mode, c, null)), (d.return = p), d;
            Xr(p, d);
        }
        return null;
    }
    function v(p, d, c, g) {
        var x = d !== null ? d.key : null;
        if ((typeof c == "string" && c !== "") || typeof c == "number")
            return x !== null ? null : s(p, d, "" + c, g);
        if (typeof c == "object" && c !== null) {
            switch (c.$$typeof) {
                case Fr:
                    return c.key === x ? a(p, d, c, g) : null;
                case fn:
                    return c.key === x ? f(p, d, c, g) : null;
                case Pt:
                    return (x = c._init), v(p, d, x(c._payload), g);
            }
            if (tr(c) || Kn(c)) return x !== null ? null : h(p, d, c, g, null);
            Xr(p, c);
        }
        return null;
    }
    function _(p, d, c, g, x) {
        if ((typeof g == "string" && g !== "") || typeof g == "number")
            return (p = p.get(c) || null), s(d, p, "" + g, x);
        if (typeof g == "object" && g !== null) {
            switch (g.$$typeof) {
                case Fr:
                    return (
                        (p = p.get(g.key === null ? c : g.key) || null),
                        a(d, p, g, x)
                    );
                case fn:
                    return (
                        (p = p.get(g.key === null ? c : g.key) || null),
                        f(d, p, g, x)
                    );
                case Pt:
                    var E = g._init;
                    return _(p, d, c, E(g._payload), x);
            }
            if (tr(g) || Kn(g))
                return (p = p.get(c) || null), h(d, p, g, x, null);
            Xr(d, g);
        }
        return null;
    }
    function S(p, d, c, g) {
        for (
            var x = null, E = null, w = d, R = (d = 0), O = null;
            w !== null && R < c.length;
            R++
        ) {
            w.index > R ? ((O = w), (w = null)) : (O = w.sibling);
            var C = v(p, w, c[R], g);
            if (C === null) {
                w === null && (w = O);
                break;
            }
            e && w && C.alternate === null && t(p, w),
                (d = i(C, d, R)),
                E === null ? (x = C) : (E.sibling = C),
                (E = C),
                (w = O);
        }
        if (R === c.length) return n(p, w), se && Xt(p, R), x;
        if (w === null) {
            for (; R < c.length; R++)
                (w = m(p, c[R], g)),
                    w !== null &&
                        ((d = i(w, d, R)),
                        E === null ? (x = w) : (E.sibling = w),
                        (E = w));
            return se && Xt(p, R), x;
        }
        for (w = r(p, w); R < c.length; R++)
            (O = _(w, p, R, c[R], g)),
                O !== null &&
                    (e &&
                        O.alternate !== null &&
                        w.delete(O.key === null ? R : O.key),
                    (d = i(O, d, R)),
                    E === null ? (x = O) : (E.sibling = O),
                    (E = O));
        return (
            e &&
                w.forEach(function (F) {
                    return t(p, F);
                }),
            se && Xt(p, R),
            x
        );
    }
    function N(p, d, c, g) {
        var x = Kn(c);
        if (typeof x != "function") throw Error(j(150));
        if (((c = x.call(c)), c == null)) throw Error(j(151));
        for (
            var E = (x = null), w = d, R = (d = 0), O = null, C = c.next();
            w !== null && !C.done;
            R++, C = c.next()
        ) {
            w.index > R ? ((O = w), (w = null)) : (O = w.sibling);
            var F = v(p, w, C.value, g);
            if (F === null) {
                w === null && (w = O);
                break;
            }
            e && w && F.alternate === null && t(p, w),
                (d = i(F, d, R)),
                E === null ? (x = F) : (E.sibling = F),
                (E = F),
                (w = O);
        }
        if (C.done) return n(p, w), se && Xt(p, R), x;
        if (w === null) {
            for (; !C.done; R++, C = c.next())
                (C = m(p, C.value, g)),
                    C !== null &&
                        ((d = i(C, d, R)),
                        E === null ? (x = C) : (E.sibling = C),
                        (E = C));
            return se && Xt(p, R), x;
        }
        for (w = r(p, w); !C.done; R++, C = c.next())
            (C = _(w, p, R, C.value, g)),
                C !== null &&
                    (e &&
                        C.alternate !== null &&
                        w.delete(C.key === null ? R : C.key),
                    (d = i(C, d, R)),
                    E === null ? (x = C) : (E.sibling = C),
                    (E = C));
        return (
            e &&
                w.forEach(function (G) {
                    return t(p, G);
                }),
            se && Xt(p, R),
            x
        );
    }
    function K(p, d, c, g) {
        if (
            (typeof c == "object" &&
                c !== null &&
                c.type === pn &&
                c.key === null &&
                (c = c.props.children),
            typeof c == "object" && c !== null)
        ) {
            switch (c.$$typeof) {
                case Fr:
                    e: {
                        for (var x = c.key, E = d; E !== null; ) {
                            if (E.key === x) {
                                if (((x = c.type), x === pn)) {
                                    if (E.tag === 7) {
                                        n(p, E.sibling),
                                            (d = l(E, c.props.children)),
                                            (d.return = p),
                                            (p = d);
                                        break e;
                                    }
                                } else if (
                                    E.elementType === x ||
                                    (typeof x == "object" &&
                                        x !== null &&
                                        x.$$typeof === Pt &&
                                        fa(x) === E.type)
                                ) {
                                    n(p, E.sibling),
                                        (d = l(E, c.props)),
                                        (d.ref = Zn(p, E, c)),
                                        (d.return = p),
                                        (p = d);
                                    break e;
                                }
                                n(p, E);
                                break;
                            } else t(p, E);
                            E = E.sibling;
                        }
                        c.type === pn
                            ? ((d = tn(c.props.children, p.mode, g, c.key)),
                              (d.return = p),
                              (p = d))
                            : ((g = hl(
                                  c.type,
                                  c.key,
                                  c.props,
                                  null,
                                  p.mode,
                                  g
                              )),
                              (g.ref = Zn(p, d, c)),
                              (g.return = p),
                              (p = g));
                    }
                    return o(p);
                case fn:
                    e: {
                        for (E = c.key; d !== null; ) {
                            if (d.key === E)
                                if (
                                    d.tag === 4 &&
                                    d.stateNode.containerInfo ===
                                        c.containerInfo &&
                                    d.stateNode.implementation ===
                                        c.implementation
                                ) {
                                    n(p, d.sibling),
                                        (d = l(d, c.children || [])),
                                        (d.return = p),
                                        (p = d);
                                    break e;
                                } else {
                                    n(p, d);
                                    break;
                                }
                            else t(p, d);
                            d = d.sibling;
                        }
                        (d = Ii(c, p.mode, g)), (d.return = p), (p = d);
                    }
                    return o(p);
                case Pt:
                    return (E = c._init), K(p, d, E(c._payload), g);
            }
            if (tr(c)) return S(p, d, c, g);
            if (Kn(c)) return N(p, d, c, g);
            Xr(p, c);
        }
        return (typeof c == "string" && c !== "") || typeof c == "number"
            ? ((c = "" + c),
              d !== null && d.tag === 6
                  ? (n(p, d.sibling), (d = l(d, c)), (d.return = p), (p = d))
                  : (n(p, d), (d = Pi(c, p.mode, g)), (d.return = p), (p = d)),
              o(p))
            : n(p, d);
    }
    return K;
}
var zn = sc(!0),
    ac = sc(!1),
    Il = Qt(null),
    Tl = null,
    Sn = null,
    bo = null;
function es() {
    bo = Sn = Tl = null;
}
function ts(e) {
    var t = Il.current;
    le(Il), (e._currentValue = t);
}
function fo(e, t, n) {
    for (; e !== null; ) {
        var r = e.alternate;
        if (
            ((e.childLanes & t) !== t
                ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
                : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
            e === n)
        )
            break;
        e = e.return;
    }
}
function In(e, t) {
    (Tl = e),
        (bo = Sn = null),
        (e = e.dependencies),
        e !== null &&
            e.firstContext !== null &&
            (e.lanes & t && (Oe = !0), (e.firstContext = null));
}
function be(e) {
    var t = e._currentValue;
    if (bo !== e)
        if (((e = { context: e, memoizedValue: t, next: null }), Sn === null)) {
            if (Tl === null) throw Error(j(308));
            (Sn = e), (Tl.dependencies = { lanes: 0, firstContext: e });
        } else Sn = Sn.next = e;
    return t;
}
var qt = null;
function ns(e) {
    qt === null ? (qt = [e]) : qt.push(e);
}
function uc(e, t, n, r) {
    var l = t.interleaved;
    return (
        l === null ? ((n.next = n), ns(t)) : ((n.next = l.next), (l.next = n)),
        (t.interleaved = n),
        kt(e, r)
    );
}
function kt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
        (e.childLanes |= t),
            (n = e.alternate),
            n !== null && (n.childLanes |= t),
            (n = e),
            (e = e.return);
    return n.tag === 3 ? n.stateNode : null;
}
var It = !1;
function rs(e) {
    e.updateQueue = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, interleaved: null, lanes: 0 },
        effects: null,
    };
}
function cc(e, t) {
    (e = e.updateQueue),
        t.updateQueue === e &&
            (t.updateQueue = {
                baseState: e.baseState,
                firstBaseUpdate: e.firstBaseUpdate,
                lastBaseUpdate: e.lastBaseUpdate,
                shared: e.shared,
                effects: e.effects,
            });
}
function wt(e, t) {
    return {
        eventTime: e,
        lane: t,
        tag: 0,
        payload: null,
        callback: null,
        next: null,
    };
}
function At(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (((r = r.shared), J & 2)) {
        var l = r.pending;
        return (
            l === null ? (t.next = t) : ((t.next = l.next), (l.next = t)),
            (r.pending = t),
            kt(e, n)
        );
    }
    return (
        (l = r.interleaved),
        l === null ? ((t.next = t), ns(r)) : ((t.next = l.next), (l.next = t)),
        (r.interleaved = t),
        kt(e, n)
    );
}
function ul(e, t, n) {
    if (
        ((t = t.updateQueue),
        t !== null && ((t = t.shared), (n & 4194240) !== 0))
    ) {
        var r = t.lanes;
        (r &= e.pendingLanes), (n |= r), (t.lanes = n), Ho(e, n);
    }
}
function pa(e, t) {
    var n = e.updateQueue,
        r = e.alternate;
    if (r !== null && ((r = r.updateQueue), n === r)) {
        var l = null,
            i = null;
        if (((n = n.firstBaseUpdate), n !== null)) {
            do {
                var o = {
                    eventTime: n.eventTime,
                    lane: n.lane,
                    tag: n.tag,
                    payload: n.payload,
                    callback: n.callback,
                    next: null,
                };
                i === null ? (l = i = o) : (i = i.next = o), (n = n.next);
            } while (n !== null);
            i === null ? (l = i = t) : (i = i.next = t);
        } else l = i = t;
        (n = {
            baseState: r.baseState,
            firstBaseUpdate: l,
            lastBaseUpdate: i,
            shared: r.shared,
            effects: r.effects,
        }),
            (e.updateQueue = n);
        return;
    }
    (e = n.lastBaseUpdate),
        e === null ? (n.firstBaseUpdate = t) : (e.next = t),
        (n.lastBaseUpdate = t);
}
function Ll(e, t, n, r) {
    var l = e.updateQueue;
    It = !1;
    var i = l.firstBaseUpdate,
        o = l.lastBaseUpdate,
        s = l.shared.pending;
    if (s !== null) {
        l.shared.pending = null;
        var a = s,
            f = a.next;
        (a.next = null), o === null ? (i = f) : (o.next = f), (o = a);
        var h = e.alternate;
        h !== null &&
            ((h = h.updateQueue),
            (s = h.lastBaseUpdate),
            s !== o &&
                (s === null ? (h.firstBaseUpdate = f) : (s.next = f),
                (h.lastBaseUpdate = a)));
    }
    if (i !== null) {
        var m = l.baseState;
        (o = 0), (h = f = a = null), (s = i);
        do {
            var v = s.lane,
                _ = s.eventTime;
            if ((r & v) === v) {
                h !== null &&
                    (h = h.next =
                        {
                            eventTime: _,
                            lane: 0,
                            tag: s.tag,
                            payload: s.payload,
                            callback: s.callback,
                            next: null,
                        });
                e: {
                    var S = e,
                        N = s;
                    switch (((v = t), (_ = n), N.tag)) {
                        case 1:
                            if (((S = N.payload), typeof S == "function")) {
                                m = S.call(_, m, v);
                                break e;
                            }
                            m = S;
                            break e;
                        case 3:
                            S.flags = (S.flags & -65537) | 128;
                        case 0:
                            if (
                                ((S = N.payload),
                                (v =
                                    typeof S == "function"
                                        ? S.call(_, m, v)
                                        : S),
                                v == null)
                            )
                                break e;
                            m = ce({}, m, v);
                            break e;
                        case 2:
                            It = !0;
                    }
                }
                s.callback !== null &&
                    s.lane !== 0 &&
                    ((e.flags |= 64),
                    (v = l.effects),
                    v === null ? (l.effects = [s]) : v.push(s));
            } else
                (_ = {
                    eventTime: _,
                    lane: v,
                    tag: s.tag,
                    payload: s.payload,
                    callback: s.callback,
                    next: null,
                }),
                    h === null ? ((f = h = _), (a = m)) : (h = h.next = _),
                    (o |= v);
            if (((s = s.next), s === null)) {
                if (((s = l.shared.pending), s === null)) break;
                (v = s),
                    (s = v.next),
                    (v.next = null),
                    (l.lastBaseUpdate = v),
                    (l.shared.pending = null);
            }
        } while (!0);
        if (
            (h === null && (a = m),
            (l.baseState = a),
            (l.firstBaseUpdate = f),
            (l.lastBaseUpdate = h),
            (t = l.shared.interleaved),
            t !== null)
        ) {
            l = t;
            do (o |= l.lane), (l = l.next);
            while (l !== t);
        } else i === null && (l.shared.lanes = 0);
        (on |= o), (e.lanes = o), (e.memoizedState = m);
    }
}
function ma(e, t, n) {
    if (((e = t.effects), (t.effects = null), e !== null))
        for (t = 0; t < e.length; t++) {
            var r = e[t],
                l = r.callback;
            if (l !== null) {
                if (((r.callback = null), (r = n), typeof l != "function"))
                    throw Error(j(191, l));
                l.call(r);
            }
        }
}
var zr = {},
    mt = Qt(zr),
    Nr = Qt(zr),
    Er = Qt(zr);
function bt(e) {
    if (e === zr) throw Error(j(174));
    return e;
}
function ls(e, t) {
    switch ((te(Er, t), te(Nr, e), te(mt, zr), (e = t.nodeType), e)) {
        case 9:
        case 11:
            t = (t = t.documentElement) ? t.namespaceURI : Ki(null, "");
            break;
        default:
            (e = e === 8 ? t.parentNode : t),
                (t = e.namespaceURI || null),
                (e = e.tagName),
                (t = Ki(t, e));
    }
    le(mt), te(mt, t);
}
function Dn() {
    le(mt), le(Nr), le(Er);
}
function dc(e) {
    bt(Er.current);
    var t = bt(mt.current),
        n = Ki(t, e.type);
    t !== n && (te(Nr, e), te(mt, n));
}
function is(e) {
    Nr.current === e && (le(mt), le(Nr));
}
var ae = Qt(0);
function Rl(e) {
    for (var t = e; t !== null; ) {
        if (t.tag === 13) {
            var n = t.memoizedState;
            if (
                n !== null &&
                ((n = n.dehydrated),
                n === null || n.data === "$?" || n.data === "$!")
            )
                return t;
        } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
            if (t.flags & 128) return t;
        } else if (t.child !== null) {
            (t.child.return = t), (t = t.child);
            continue;
        }
        if (t === e) break;
        for (; t.sibling === null; ) {
            if (t.return === null || t.return === e) return null;
            t = t.return;
        }
        (t.sibling.return = t.return), (t = t.sibling);
    }
    return null;
}
var xi = [];
function os() {
    for (var e = 0; e < xi.length; e++)
        xi[e]._workInProgressVersionPrimary = null;
    xi.length = 0;
}
var cl = Et.ReactCurrentDispatcher,
    ki = Et.ReactCurrentBatchConfig,
    ln = 0,
    ue = null,
    ge = null,
    we = null,
    Ml = !1,
    ur = !1,
    Cr = 0,
    wp = 0;
function Ce() {
    throw Error(j(321));
}
function ss(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
        if (!st(e[n], t[n])) return !1;
    return !0;
}
function as(e, t, n, r, l, i) {
    if (
        ((ln = i),
        (ue = t),
        (t.memoizedState = null),
        (t.updateQueue = null),
        (t.lanes = 0),
        (cl.current = e === null || e.memoizedState === null ? Np : Ep),
        (e = n(r, l)),
        ur)
    ) {
        i = 0;
        do {
            if (((ur = !1), (Cr = 0), 25 <= i)) throw Error(j(301));
            (i += 1),
                (we = ge = null),
                (t.updateQueue = null),
                (cl.current = Cp),
                (e = n(r, l));
        } while (ur);
    }
    if (
        ((cl.current = zl),
        (t = ge !== null && ge.next !== null),
        (ln = 0),
        (we = ge = ue = null),
        (Ml = !1),
        t)
    )
        throw Error(j(300));
    return e;
}
function us() {
    var e = Cr !== 0;
    return (Cr = 0), e;
}
function dt() {
    var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null,
    };
    return we === null ? (ue.memoizedState = we = e) : (we = we.next = e), we;
}
function et() {
    if (ge === null) {
        var e = ue.alternate;
        e = e !== null ? e.memoizedState : null;
    } else e = ge.next;
    var t = we === null ? ue.memoizedState : we.next;
    if (t !== null) (we = t), (ge = e);
    else {
        if (e === null) throw Error(j(310));
        (ge = e),
            (e = {
                memoizedState: ge.memoizedState,
                baseState: ge.baseState,
                baseQueue: ge.baseQueue,
                queue: ge.queue,
                next: null,
            }),
            we === null ? (ue.memoizedState = we = e) : (we = we.next = e);
    }
    return we;
}
function jr(e, t) {
    return typeof t == "function" ? t(e) : t;
}
function Ni(e) {
    var t = et(),
        n = t.queue;
    if (n === null) throw Error(j(311));
    n.lastRenderedReducer = e;
    var r = ge,
        l = r.baseQueue,
        i = n.pending;
    if (i !== null) {
        if (l !== null) {
            var o = l.next;
            (l.next = i.next), (i.next = o);
        }
        (r.baseQueue = l = i), (n.pending = null);
    }
    if (l !== null) {
        (i = l.next), (r = r.baseState);
        var s = (o = null),
            a = null,
            f = i;
        do {
            var h = f.lane;
            if ((ln & h) === h)
                a !== null &&
                    (a = a.next =
                        {
                            lane: 0,
                            action: f.action,
                            hasEagerState: f.hasEagerState,
                            eagerState: f.eagerState,
                            next: null,
                        }),
                    (r = f.hasEagerState ? f.eagerState : e(r, f.action));
            else {
                var m = {
                    lane: h,
                    action: f.action,
                    hasEagerState: f.hasEagerState,
                    eagerState: f.eagerState,
                    next: null,
                };
                a === null ? ((s = a = m), (o = r)) : (a = a.next = m),
                    (ue.lanes |= h),
                    (on |= h);
            }
            f = f.next;
        } while (f !== null && f !== i);
        a === null ? (o = r) : (a.next = s),
            st(r, t.memoizedState) || (Oe = !0),
            (t.memoizedState = r),
            (t.baseState = o),
            (t.baseQueue = a),
            (n.lastRenderedState = r);
    }
    if (((e = n.interleaved), e !== null)) {
        l = e;
        do (i = l.lane), (ue.lanes |= i), (on |= i), (l = l.next);
        while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
}
function Ei(e) {
    var t = et(),
        n = t.queue;
    if (n === null) throw Error(j(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch,
        l = n.pending,
        i = t.memoizedState;
    if (l !== null) {
        n.pending = null;
        var o = (l = l.next);
        do (i = e(i, o.action)), (o = o.next);
        while (o !== l);
        st(i, t.memoizedState) || (Oe = !0),
            (t.memoizedState = i),
            t.baseQueue === null && (t.baseState = i),
            (n.lastRenderedState = i);
    }
    return [i, r];
}
function fc() {}
function pc(e, t) {
    var n = ue,
        r = et(),
        l = t(),
        i = !st(r.memoizedState, l);
    if (
        (i && ((r.memoizedState = l), (Oe = !0)),
        (r = r.queue),
        cs(vc.bind(null, n, r, e), [e]),
        r.getSnapshot !== t || i || (we !== null && we.memoizedState.tag & 1))
    ) {
        if (
            ((n.flags |= 2048),
            Pr(9, hc.bind(null, n, r, l, t), void 0, null),
            Se === null)
        )
            throw Error(j(349));
        ln & 30 || mc(n, t, l);
    }
    return l;
}
function mc(e, t, n) {
    (e.flags |= 16384),
        (e = { getSnapshot: t, value: n }),
        (t = ue.updateQueue),
        t === null
            ? ((t = { lastEffect: null, stores: null }),
              (ue.updateQueue = t),
              (t.stores = [e]))
            : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e));
}
function hc(e, t, n, r) {
    (t.value = n), (t.getSnapshot = r), gc(t) && yc(e);
}
function vc(e, t, n) {
    return n(function () {
        gc(t) && yc(e);
    });
}
function gc(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
        var n = t();
        return !st(e, n);
    } catch {
        return !0;
    }
}
function yc(e) {
    var t = kt(e, 1);
    t !== null && ot(t, e, 1, -1);
}
function ha(e) {
    var t = dt();
    return (
        typeof e == "function" && (e = e()),
        (t.memoizedState = t.baseState = e),
        (e = {
            pending: null,
            interleaved: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: jr,
            lastRenderedState: e,
        }),
        (t.queue = e),
        (e = e.dispatch = kp.bind(null, ue, e)),
        [t.memoizedState, e]
    );
}
function Pr(e, t, n, r) {
    return (
        (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
        (t = ue.updateQueue),
        t === null
            ? ((t = { lastEffect: null, stores: null }),
              (ue.updateQueue = t),
              (t.lastEffect = e.next = e))
            : ((n = t.lastEffect),
              n === null
                  ? (t.lastEffect = e.next = e)
                  : ((r = n.next),
                    (n.next = e),
                    (e.next = r),
                    (t.lastEffect = e))),
        e
    );
}
function _c() {
    return et().memoizedState;
}
function dl(e, t, n, r) {
    var l = dt();
    (ue.flags |= e),
        (l.memoizedState = Pr(1 | t, n, void 0, r === void 0 ? null : r));
}
function Gl(e, t, n, r) {
    var l = et();
    r = r === void 0 ? null : r;
    var i = void 0;
    if (ge !== null) {
        var o = ge.memoizedState;
        if (((i = o.destroy), r !== null && ss(r, o.deps))) {
            l.memoizedState = Pr(t, n, i, r);
            return;
        }
    }
    (ue.flags |= e), (l.memoizedState = Pr(1 | t, n, i, r));
}
function va(e, t) {
    return dl(8390656, 8, e, t);
}
function cs(e, t) {
    return Gl(2048, 8, e, t);
}
function wc(e, t) {
    return Gl(4, 2, e, t);
}
function Sc(e, t) {
    return Gl(4, 4, e, t);
}
function xc(e, t) {
    if (typeof t == "function")
        return (
            (e = e()),
            t(e),
            function () {
                t(null);
            }
        );
    if (t != null)
        return (
            (e = e()),
            (t.current = e),
            function () {
                t.current = null;
            }
        );
}
function kc(e, t, n) {
    return (
        (n = n != null ? n.concat([e]) : null), Gl(4, 4, xc.bind(null, t, e), n)
    );
}
function ds() {}
function Nc(e, t) {
    var n = et();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && ss(t, r[1])
        ? r[0]
        : ((n.memoizedState = [e, t]), e);
}
function Ec(e, t) {
    var n = et();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && ss(t, r[1])
        ? r[0]
        : ((e = e()), (n.memoizedState = [e, t]), e);
}
function Cc(e, t, n) {
    return ln & 21
        ? (st(n, t) ||
              ((n = Lu()), (ue.lanes |= n), (on |= n), (e.baseState = !0)),
          t)
        : (e.baseState && ((e.baseState = !1), (Oe = !0)),
          (e.memoizedState = n));
}
function Sp(e, t) {
    var n = b;
    (b = n !== 0 && 4 > n ? n : 4), e(!0);
    var r = ki.transition;
    ki.transition = {};
    try {
        e(!1), t();
    } finally {
        (b = n), (ki.transition = r);
    }
}
function jc() {
    return et().memoizedState;
}
function xp(e, t, n) {
    var r = Bt(e);
    if (
        ((n = {
            lane: r,
            action: n,
            hasEagerState: !1,
            eagerState: null,
            next: null,
        }),
        Pc(e))
    )
        Ic(t, n);
    else if (((n = uc(e, t, n, r)), n !== null)) {
        var l = Le();
        ot(n, e, r, l), Tc(n, t, r);
    }
}
function kp(e, t, n) {
    var r = Bt(e),
        l = {
            lane: r,
            action: n,
            hasEagerState: !1,
            eagerState: null,
            next: null,
        };
    if (Pc(e)) Ic(t, l);
    else {
        var i = e.alternate;
        if (
            e.lanes === 0 &&
            (i === null || i.lanes === 0) &&
            ((i = t.lastRenderedReducer), i !== null)
        )
            try {
                var o = t.lastRenderedState,
                    s = i(o, n);
                if (((l.hasEagerState = !0), (l.eagerState = s), st(s, o))) {
                    var a = t.interleaved;
                    a === null
                        ? ((l.next = l), ns(t))
                        : ((l.next = a.next), (a.next = l)),
                        (t.interleaved = l);
                    return;
                }
            } catch {
            } finally {
            }
        (n = uc(e, t, l, r)),
            n !== null && ((l = Le()), ot(n, e, r, l), Tc(n, t, r));
    }
}
function Pc(e) {
    var t = e.alternate;
    return e === ue || (t !== null && t === ue);
}
function Ic(e, t) {
    ur = Ml = !0;
    var n = e.pending;
    n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
        (e.pending = t);
}
function Tc(e, t, n) {
    if (n & 4194240) {
        var r = t.lanes;
        (r &= e.pendingLanes), (n |= r), (t.lanes = n), Ho(e, n);
    }
}
var zl = {
        readContext: be,
        useCallback: Ce,
        useContext: Ce,
        useEffect: Ce,
        useImperativeHandle: Ce,
        useInsertionEffect: Ce,
        useLayoutEffect: Ce,
        useMemo: Ce,
        useReducer: Ce,
        useRef: Ce,
        useState: Ce,
        useDebugValue: Ce,
        useDeferredValue: Ce,
        useTransition: Ce,
        useMutableSource: Ce,
        useSyncExternalStore: Ce,
        useId: Ce,
        unstable_isNewReconciler: !1,
    },
    Np = {
        readContext: be,
        useCallback: function (e, t) {
            return (dt().memoizedState = [e, t === void 0 ? null : t]), e;
        },
        useContext: be,
        useEffect: va,
        useImperativeHandle: function (e, t, n) {
            return (
                (n = n != null ? n.concat([e]) : null),
                dl(4194308, 4, xc.bind(null, t, e), n)
            );
        },
        useLayoutEffect: function (e, t) {
            return dl(4194308, 4, e, t);
        },
        useInsertionEffect: function (e, t) {
            return dl(4, 2, e, t);
        },
        useMemo: function (e, t) {
            var n = dt();
            return (
                (t = t === void 0 ? null : t),
                (e = e()),
                (n.memoizedState = [e, t]),
                e
            );
        },
        useReducer: function (e, t, n) {
            var r = dt();
            return (
                (t = n !== void 0 ? n(t) : t),
                (r.memoizedState = r.baseState = t),
                (e = {
                    pending: null,
                    interleaved: null,
                    lanes: 0,
                    dispatch: null,
                    lastRenderedReducer: e,
                    lastRenderedState: t,
                }),
                (r.queue = e),
                (e = e.dispatch = xp.bind(null, ue, e)),
                [r.memoizedState, e]
            );
        },
        useRef: function (e) {
            var t = dt();
            return (e = { current: e }), (t.memoizedState = e);
        },
        useState: ha,
        useDebugValue: ds,
        useDeferredValue: function (e) {
            return (dt().memoizedState = e);
        },
        useTransition: function () {
            var e = ha(!1),
                t = e[0];
            return (e = Sp.bind(null, e[1])), (dt().memoizedState = e), [t, e];
        },
        useMutableSource: function () {},
        useSyncExternalStore: function (e, t, n) {
            var r = ue,
                l = dt();
            if (se) {
                if (n === void 0) throw Error(j(407));
                n = n();
            } else {
                if (((n = t()), Se === null)) throw Error(j(349));
                ln & 30 || mc(r, t, n);
            }
            l.memoizedState = n;
            var i = { value: n, getSnapshot: t };
            return (
                (l.queue = i),
                va(vc.bind(null, r, i, e), [e]),
                (r.flags |= 2048),
                Pr(9, hc.bind(null, r, i, n, t), void 0, null),
                n
            );
        },
        useId: function () {
            var e = dt(),
                t = Se.identifierPrefix;
            if (se) {
                var n = _t,
                    r = yt;
                (n = (r & ~(1 << (32 - it(r) - 1))).toString(32) + n),
                    (t = ":" + t + "R" + n),
                    (n = Cr++),
                    0 < n && (t += "H" + n.toString(32)),
                    (t += ":");
            } else (n = wp++), (t = ":" + t + "r" + n.toString(32) + ":");
            return (e.memoizedState = t);
        },
        unstable_isNewReconciler: !1,
    },
    Ep = {
        readContext: be,
        useCallback: Nc,
        useContext: be,
        useEffect: cs,
        useImperativeHandle: kc,
        useInsertionEffect: wc,
        useLayoutEffect: Sc,
        useMemo: Ec,
        useReducer: Ni,
        useRef: _c,
        useState: function () {
            return Ni(jr);
        },
        useDebugValue: ds,
        useDeferredValue: function (e) {
            var t = et();
            return Cc(t, ge.memoizedState, e);
        },
        useTransition: function () {
            var e = Ni(jr)[0],
                t = et().memoizedState;
            return [e, t];
        },
        useMutableSource: fc,
        useSyncExternalStore: pc,
        useId: jc,
        unstable_isNewReconciler: !1,
    },
    Cp = {
        readContext: be,
        useCallback: Nc,
        useContext: be,
        useEffect: cs,
        useImperativeHandle: kc,
        useInsertionEffect: wc,
        useLayoutEffect: Sc,
        useMemo: Ec,
        useReducer: Ei,
        useRef: _c,
        useState: function () {
            return Ei(jr);
        },
        useDebugValue: ds,
        useDeferredValue: function (e) {
            var t = et();
            return ge === null
                ? (t.memoizedState = e)
                : Cc(t, ge.memoizedState, e);
        },
        useTransition: function () {
            var e = Ei(jr)[0],
                t = et().memoizedState;
            return [e, t];
        },
        useMutableSource: fc,
        useSyncExternalStore: pc,
        useId: jc,
        unstable_isNewReconciler: !1,
    };
function nt(e, t) {
    if (e && e.defaultProps) {
        (t = ce({}, t)), (e = e.defaultProps);
        for (var n in e) t[n] === void 0 && (t[n] = e[n]);
        return t;
    }
    return t;
}
function po(e, t, n, r) {
    (t = e.memoizedState),
        (n = n(r, t)),
        (n = n == null ? t : ce({}, t, n)),
        (e.memoizedState = n),
        e.lanes === 0 && (e.updateQueue.baseState = n);
}
var Yl = {
    isMounted: function (e) {
        return (e = e._reactInternals) ? un(e) === e : !1;
    },
    enqueueSetState: function (e, t, n) {
        e = e._reactInternals;
        var r = Le(),
            l = Bt(e),
            i = wt(r, l);
        (i.payload = t),
            n != null && (i.callback = n),
            (t = At(e, i, l)),
            t !== null && (ot(t, e, l, r), ul(t, e, l));
    },
    enqueueReplaceState: function (e, t, n) {
        e = e._reactInternals;
        var r = Le(),
            l = Bt(e),
            i = wt(r, l);
        (i.tag = 1),
            (i.payload = t),
            n != null && (i.callback = n),
            (t = At(e, i, l)),
            t !== null && (ot(t, e, l, r), ul(t, e, l));
    },
    enqueueForceUpdate: function (e, t) {
        e = e._reactInternals;
        var n = Le(),
            r = Bt(e),
            l = wt(n, r);
        (l.tag = 2),
            t != null && (l.callback = t),
            (t = At(e, l, r)),
            t !== null && (ot(t, e, r, n), ul(t, e, r));
    },
};
function ga(e, t, n, r, l, i, o) {
    return (
        (e = e.stateNode),
        typeof e.shouldComponentUpdate == "function"
            ? e.shouldComponentUpdate(r, i, o)
            : t.prototype && t.prototype.isPureReactComponent
            ? !wr(n, r) || !wr(l, i)
            : !0
    );
}
function Lc(e, t, n) {
    var r = !1,
        l = Wt,
        i = t.contextType;
    return (
        typeof i == "object" && i !== null
            ? (i = be(i))
            : ((l = Ae(t) ? nn : Ie.current),
              (r = t.contextTypes),
              (i = (r = r != null) ? Rn(e, l) : Wt)),
        (t = new t(n, i)),
        (e.memoizedState =
            t.state !== null && t.state !== void 0 ? t.state : null),
        (t.updater = Yl),
        (e.stateNode = t),
        (t._reactInternals = e),
        r &&
            ((e = e.stateNode),
            (e.__reactInternalMemoizedUnmaskedChildContext = l),
            (e.__reactInternalMemoizedMaskedChildContext = i)),
        t
    );
}
function ya(e, t, n, r) {
    (e = t.state),
        typeof t.componentWillReceiveProps == "function" &&
            t.componentWillReceiveProps(n, r),
        typeof t.UNSAFE_componentWillReceiveProps == "function" &&
            t.UNSAFE_componentWillReceiveProps(n, r),
        t.state !== e && Yl.enqueueReplaceState(t, t.state, null);
}
function mo(e, t, n, r) {
    var l = e.stateNode;
    (l.props = n), (l.state = e.memoizedState), (l.refs = {}), rs(e);
    var i = t.contextType;
    typeof i == "object" && i !== null
        ? (l.context = be(i))
        : ((i = Ae(t) ? nn : Ie.current), (l.context = Rn(e, i))),
        (l.state = e.memoizedState),
        (i = t.getDerivedStateFromProps),
        typeof i == "function" && (po(e, t, i, n), (l.state = e.memoizedState)),
        typeof t.getDerivedStateFromProps == "function" ||
            typeof l.getSnapshotBeforeUpdate == "function" ||
            (typeof l.UNSAFE_componentWillMount != "function" &&
                typeof l.componentWillMount != "function") ||
            ((t = l.state),
            typeof l.componentWillMount == "function" && l.componentWillMount(),
            typeof l.UNSAFE_componentWillMount == "function" &&
                l.UNSAFE_componentWillMount(),
            t !== l.state && Yl.enqueueReplaceState(l, l.state, null),
            Ll(e, n, l, r),
            (l.state = e.memoizedState)),
        typeof l.componentDidMount == "function" && (e.flags |= 4194308);
}
function $n(e, t) {
    try {
        var n = "",
            r = t;
        do (n += bd(r)), (r = r.return);
        while (r);
        var l = n;
    } catch (i) {
        l =
            `
Error generating stack: ` +
            i.message +
            `
` +
            i.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
}
function Ci(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function ho(e, t) {
    try {
        console.error(t.value);
    } catch (n) {
        setTimeout(function () {
            throw n;
        });
    }
}
var jp = typeof WeakMap == "function" ? WeakMap : Map;
function Rc(e, t, n) {
    (n = wt(-1, n)), (n.tag = 3), (n.payload = { element: null });
    var r = t.value;
    return (
        (n.callback = function () {
            $l || (($l = !0), (Eo = r)), ho(e, t);
        }),
        n
    );
}
function Mc(e, t, n) {
    (n = wt(-1, n)), (n.tag = 3);
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
        var l = t.value;
        (n.payload = function () {
            return r(l);
        }),
            (n.callback = function () {
                ho(e, t);
            });
    }
    var i = e.stateNode;
    return (
        i !== null &&
            typeof i.componentDidCatch == "function" &&
            (n.callback = function () {
                ho(e, t),
                    typeof r != "function" &&
                        (Ut === null ? (Ut = new Set([this])) : Ut.add(this));
                var o = t.stack;
                this.componentDidCatch(t.value, {
                    componentStack: o !== null ? o : "",
                });
            }),
        n
    );
}
function _a(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
        r = e.pingCache = new jp();
        var l = new Set();
        r.set(t, l);
    } else (l = r.get(t)), l === void 0 && ((l = new Set()), r.set(t, l));
    l.has(n) || (l.add(n), (e = Bp.bind(null, e, t, n)), t.then(e, e));
}
function wa(e) {
    do {
        var t;
        if (
            ((t = e.tag === 13) &&
                ((t = e.memoizedState),
                (t = t !== null ? t.dehydrated !== null : !0)),
            t)
        )
            return e;
        e = e.return;
    } while (e !== null);
    return null;
}
function Sa(e, t, n, r, l) {
    return e.mode & 1
        ? ((e.flags |= 65536), (e.lanes = l), e)
        : (e === t
              ? (e.flags |= 65536)
              : ((e.flags |= 128),
                (n.flags |= 131072),
                (n.flags &= -52805),
                n.tag === 1 &&
                    (n.alternate === null
                        ? (n.tag = 17)
                        : ((t = wt(-1, 1)), (t.tag = 2), At(n, t, 1))),
                (n.lanes |= 1)),
          e);
}
var Pp = Et.ReactCurrentOwner,
    Oe = !1;
function Te(e, t, n, r) {
    t.child = e === null ? ac(t, null, n, r) : zn(t, e.child, n, r);
}
function xa(e, t, n, r, l) {
    n = n.render;
    var i = t.ref;
    return (
        In(t, l),
        (r = as(e, t, n, r, i, l)),
        (n = us()),
        e !== null && !Oe
            ? ((t.updateQueue = e.updateQueue),
              (t.flags &= -2053),
              (e.lanes &= ~l),
              Nt(e, t, l))
            : (se && n && Zo(t), (t.flags |= 1), Te(e, t, r, l), t.child)
    );
}
function ka(e, t, n, r, l) {
    if (e === null) {
        var i = n.type;
        return typeof i == "function" &&
            !_s(i) &&
            i.defaultProps === void 0 &&
            n.compare === null &&
            n.defaultProps === void 0
            ? ((t.tag = 15), (t.type = i), zc(e, t, i, r, l))
            : ((e = hl(n.type, null, r, t, t.mode, l)),
              (e.ref = t.ref),
              (e.return = t),
              (t.child = e));
    }
    if (((i = e.child), !(e.lanes & l))) {
        var o = i.memoizedProps;
        if (
            ((n = n.compare),
            (n = n !== null ? n : wr),
            n(o, r) && e.ref === t.ref)
        )
            return Nt(e, t, l);
    }
    return (
        (t.flags |= 1),
        (e = Ht(i, r)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e)
    );
}
function zc(e, t, n, r, l) {
    if (e !== null) {
        var i = e.memoizedProps;
        if (wr(i, r) && e.ref === t.ref)
            if (((Oe = !1), (t.pendingProps = r = i), (e.lanes & l) !== 0))
                e.flags & 131072 && (Oe = !0);
            else return (t.lanes = e.lanes), Nt(e, t, l);
    }
    return vo(e, t, n, r, l);
}
function Dc(e, t, n) {
    var r = t.pendingProps,
        l = r.children,
        i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden")
        if (!(t.mode & 1))
            (t.memoizedState = {
                baseLanes: 0,
                cachePool: null,
                transitions: null,
            }),
                te(kn, He),
                (He |= n);
        else {
            if (!(n & 1073741824))
                return (
                    (e = i !== null ? i.baseLanes | n : n),
                    (t.lanes = t.childLanes = 1073741824),
                    (t.memoizedState = {
                        baseLanes: e,
                        cachePool: null,
                        transitions: null,
                    }),
                    (t.updateQueue = null),
                    te(kn, He),
                    (He |= e),
                    null
                );
            (t.memoizedState = {
                baseLanes: 0,
                cachePool: null,
                transitions: null,
            }),
                (r = i !== null ? i.baseLanes : n),
                te(kn, He),
                (He |= r);
        }
    else
        i !== null
            ? ((r = i.baseLanes | n), (t.memoizedState = null))
            : (r = n),
            te(kn, He),
            (He |= r);
    return Te(e, t, l, n), t.child;
}
function $c(e, t) {
    var n = t.ref;
    ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
        ((t.flags |= 512), (t.flags |= 2097152));
}
function vo(e, t, n, r, l) {
    var i = Ae(n) ? nn : Ie.current;
    return (
        (i = Rn(t, i)),
        In(t, l),
        (n = as(e, t, n, r, i, l)),
        (r = us()),
        e !== null && !Oe
            ? ((t.updateQueue = e.updateQueue),
              (t.flags &= -2053),
              (e.lanes &= ~l),
              Nt(e, t, l))
            : (se && r && Zo(t), (t.flags |= 1), Te(e, t, n, l), t.child)
    );
}
function Na(e, t, n, r, l) {
    if (Ae(n)) {
        var i = !0;
        Cl(t);
    } else i = !1;
    if ((In(t, l), t.stateNode === null))
        fl(e, t), Lc(t, n, r), mo(t, n, r, l), (r = !0);
    else if (e === null) {
        var o = t.stateNode,
            s = t.memoizedProps;
        o.props = s;
        var a = o.context,
            f = n.contextType;
        typeof f == "object" && f !== null
            ? (f = be(f))
            : ((f = Ae(n) ? nn : Ie.current), (f = Rn(t, f)));
        var h = n.getDerivedStateFromProps,
            m =
                typeof h == "function" ||
                typeof o.getSnapshotBeforeUpdate == "function";
        m ||
            (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
                typeof o.componentWillReceiveProps != "function") ||
            ((s !== r || a !== f) && ya(t, o, r, f)),
            (It = !1);
        var v = t.memoizedState;
        (o.state = v),
            Ll(t, r, o, l),
            (a = t.memoizedState),
            s !== r || v !== a || Fe.current || It
                ? (typeof h == "function" &&
                      (po(t, n, h, r), (a = t.memoizedState)),
                  (s = It || ga(t, n, s, r, v, a, f))
                      ? (m ||
                            (typeof o.UNSAFE_componentWillMount != "function" &&
                                typeof o.componentWillMount != "function") ||
                            (typeof o.componentWillMount == "function" &&
                                o.componentWillMount(),
                            typeof o.UNSAFE_componentWillMount == "function" &&
                                o.UNSAFE_componentWillMount()),
                        typeof o.componentDidMount == "function" &&
                            (t.flags |= 4194308))
                      : (typeof o.componentDidMount == "function" &&
                            (t.flags |= 4194308),
                        (t.memoizedProps = r),
                        (t.memoizedState = a)),
                  (o.props = r),
                  (o.state = a),
                  (o.context = f),
                  (r = s))
                : (typeof o.componentDidMount == "function" &&
                      (t.flags |= 4194308),
                  (r = !1));
    } else {
        (o = t.stateNode),
            cc(e, t),
            (s = t.memoizedProps),
            (f = t.type === t.elementType ? s : nt(t.type, s)),
            (o.props = f),
            (m = t.pendingProps),
            (v = o.context),
            (a = n.contextType),
            typeof a == "object" && a !== null
                ? (a = be(a))
                : ((a = Ae(n) ? nn : Ie.current), (a = Rn(t, a)));
        var _ = n.getDerivedStateFromProps;
        (h =
            typeof _ == "function" ||
            typeof o.getSnapshotBeforeUpdate == "function") ||
            (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
                typeof o.componentWillReceiveProps != "function") ||
            ((s !== m || v !== a) && ya(t, o, r, a)),
            (It = !1),
            (v = t.memoizedState),
            (o.state = v),
            Ll(t, r, o, l);
        var S = t.memoizedState;
        s !== m || v !== S || Fe.current || It
            ? (typeof _ == "function" &&
                  (po(t, n, _, r), (S = t.memoizedState)),
              (f = It || ga(t, n, f, r, v, S, a) || !1)
                  ? (h ||
                        (typeof o.UNSAFE_componentWillUpdate != "function" &&
                            typeof o.componentWillUpdate != "function") ||
                        (typeof o.componentWillUpdate == "function" &&
                            o.componentWillUpdate(r, S, a),
                        typeof o.UNSAFE_componentWillUpdate == "function" &&
                            o.UNSAFE_componentWillUpdate(r, S, a)),
                    typeof o.componentDidUpdate == "function" && (t.flags |= 4),
                    typeof o.getSnapshotBeforeUpdate == "function" &&
                        (t.flags |= 1024))
                  : (typeof o.componentDidUpdate != "function" ||
                        (s === e.memoizedProps && v === e.memoizedState) ||
                        (t.flags |= 4),
                    typeof o.getSnapshotBeforeUpdate != "function" ||
                        (s === e.memoizedProps && v === e.memoizedState) ||
                        (t.flags |= 1024),
                    (t.memoizedProps = r),
                    (t.memoizedState = S)),
              (o.props = r),
              (o.state = S),
              (o.context = a),
              (r = f))
            : (typeof o.componentDidUpdate != "function" ||
                  (s === e.memoizedProps && v === e.memoizedState) ||
                  (t.flags |= 4),
              typeof o.getSnapshotBeforeUpdate != "function" ||
                  (s === e.memoizedProps && v === e.memoizedState) ||
                  (t.flags |= 1024),
              (r = !1));
    }
    return go(e, t, n, r, i, l);
}
function go(e, t, n, r, l, i) {
    $c(e, t);
    var o = (t.flags & 128) !== 0;
    if (!r && !o) return l && ua(t, n, !1), Nt(e, t, i);
    (r = t.stateNode), (Pp.current = t);
    var s =
        o && typeof n.getDerivedStateFromError != "function"
            ? null
            : r.render();
    return (
        (t.flags |= 1),
        e !== null && o
            ? ((t.child = zn(t, e.child, null, i)),
              (t.child = zn(t, null, s, i)))
            : Te(e, t, s, i),
        (t.memoizedState = r.state),
        l && ua(t, n, !0),
        t.child
    );
}
function Oc(e) {
    var t = e.stateNode;
    t.pendingContext
        ? aa(e, t.pendingContext, t.pendingContext !== t.context)
        : t.context && aa(e, t.context, !1),
        ls(e, t.containerInfo);
}
function Ea(e, t, n, r, l) {
    return Mn(), qo(l), (t.flags |= 256), Te(e, t, n, r), t.child;
}
var yo = { dehydrated: null, treeContext: null, retryLane: 0 };
function _o(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
}
function Fc(e, t, n) {
    var r = t.pendingProps,
        l = ae.current,
        i = !1,
        o = (t.flags & 128) !== 0,
        s;
    if (
        ((s = o) ||
            (s = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0),
        s
            ? ((i = !0), (t.flags &= -129))
            : (e === null || e.memoizedState !== null) && (l |= 1),
        te(ae, l & 1),
        e === null)
    )
        return (
            co(t),
            (e = t.memoizedState),
            e !== null && ((e = e.dehydrated), e !== null)
                ? (t.mode & 1
                      ? e.data === "$!"
                          ? (t.lanes = 8)
                          : (t.lanes = 1073741824)
                      : (t.lanes = 1),
                  null)
                : ((o = r.children),
                  (e = r.fallback),
                  i
                      ? ((r = t.mode),
                        (i = t.child),
                        (o = { mode: "hidden", children: o }),
                        !(r & 1) && i !== null
                            ? ((i.childLanes = 0), (i.pendingProps = o))
                            : (i = Jl(o, r, 0, null)),
                        (e = tn(e, r, n, null)),
                        (i.return = t),
                        (e.return = t),
                        (i.sibling = e),
                        (t.child = i),
                        (t.child.memoizedState = _o(n)),
                        (t.memoizedState = yo),
                        e)
                      : fs(t, o))
        );
    if (((l = e.memoizedState), l !== null && ((s = l.dehydrated), s !== null)))
        return Ip(e, t, o, r, s, l, n);
    if (i) {
        (i = r.fallback), (o = t.mode), (l = e.child), (s = l.sibling);
        var a = { mode: "hidden", children: r.children };
        return (
            !(o & 1) && t.child !== l
                ? ((r = t.child),
                  (r.childLanes = 0),
                  (r.pendingProps = a),
                  (t.deletions = null))
                : ((r = Ht(l, a)),
                  (r.subtreeFlags = l.subtreeFlags & 14680064)),
            s !== null
                ? (i = Ht(s, i))
                : ((i = tn(i, o, n, null)), (i.flags |= 2)),
            (i.return = t),
            (r.return = t),
            (r.sibling = i),
            (t.child = r),
            (r = i),
            (i = t.child),
            (o = e.child.memoizedState),
            (o =
                o === null
                    ? _o(n)
                    : {
                          baseLanes: o.baseLanes | n,
                          cachePool: null,
                          transitions: o.transitions,
                      }),
            (i.memoizedState = o),
            (i.childLanes = e.childLanes & ~n),
            (t.memoizedState = yo),
            r
        );
    }
    return (
        (i = e.child),
        (e = i.sibling),
        (r = Ht(i, { mode: "visible", children: r.children })),
        !(t.mode & 1) && (r.lanes = n),
        (r.return = t),
        (r.sibling = null),
        e !== null &&
            ((n = t.deletions),
            n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
        (t.child = r),
        (t.memoizedState = null),
        r
    );
}
function fs(e, t) {
    return (
        (t = Jl({ mode: "visible", children: t }, e.mode, 0, null)),
        (t.return = e),
        (e.child = t)
    );
}
function Zr(e, t, n, r) {
    return (
        r !== null && qo(r),
        zn(t, e.child, null, n),
        (e = fs(t, t.pendingProps.children)),
        (e.flags |= 2),
        (t.memoizedState = null),
        e
    );
}
function Ip(e, t, n, r, l, i, o) {
    if (n)
        return t.flags & 256
            ? ((t.flags &= -257), (r = Ci(Error(j(422)))), Zr(e, t, o, r))
            : t.memoizedState !== null
            ? ((t.child = e.child), (t.flags |= 128), null)
            : ((i = r.fallback),
              (l = t.mode),
              (r = Jl({ mode: "visible", children: r.children }, l, 0, null)),
              (i = tn(i, l, o, null)),
              (i.flags |= 2),
              (r.return = t),
              (i.return = t),
              (r.sibling = i),
              (t.child = r),
              t.mode & 1 && zn(t, e.child, null, o),
              (t.child.memoizedState = _o(o)),
              (t.memoizedState = yo),
              i);
    if (!(t.mode & 1)) return Zr(e, t, o, null);
    if (l.data === "$!") {
        if (((r = l.nextSibling && l.nextSibling.dataset), r)) var s = r.dgst;
        return (
            (r = s), (i = Error(j(419))), (r = Ci(i, r, void 0)), Zr(e, t, o, r)
        );
    }
    if (((s = (o & e.childLanes) !== 0), Oe || s)) {
        if (((r = Se), r !== null)) {
            switch (o & -o) {
                case 4:
                    l = 2;
                    break;
                case 16:
                    l = 8;
                    break;
                case 64:
                case 128:
                case 256:
                case 512:
                case 1024:
                case 2048:
                case 4096:
                case 8192:
                case 16384:
                case 32768:
                case 65536:
                case 131072:
                case 262144:
                case 524288:
                case 1048576:
                case 2097152:
                case 4194304:
                case 8388608:
                case 16777216:
                case 33554432:
                case 67108864:
                    l = 32;
                    break;
                case 536870912:
                    l = 268435456;
                    break;
                default:
                    l = 0;
            }
            (l = l & (r.suspendedLanes | o) ? 0 : l),
                l !== 0 &&
                    l !== i.retryLane &&
                    ((i.retryLane = l), kt(e, l), ot(r, e, l, -1));
        }
        return ys(), (r = Ci(Error(j(421)))), Zr(e, t, o, r);
    }
    return l.data === "$?"
        ? ((t.flags |= 128),
          (t.child = e.child),
          (t = Hp.bind(null, e)),
          (l._reactRetry = t),
          null)
        : ((e = i.treeContext),
          (Ve = Ft(l.nextSibling)),
          (We = t),
          (se = !0),
          (lt = null),
          e !== null &&
              ((Xe[Ze++] = yt),
              (Xe[Ze++] = _t),
              (Xe[Ze++] = rn),
              (yt = e.id),
              (_t = e.overflow),
              (rn = t)),
          (t = fs(t, r.children)),
          (t.flags |= 4096),
          t);
}
function Ca(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), fo(e.return, t, n);
}
function ji(e, t, n, r, l) {
    var i = e.memoizedState;
    i === null
        ? (e.memoizedState = {
              isBackwards: t,
              rendering: null,
              renderingStartTime: 0,
              last: r,
              tail: n,
              tailMode: l,
          })
        : ((i.isBackwards = t),
          (i.rendering = null),
          (i.renderingStartTime = 0),
          (i.last = r),
          (i.tail = n),
          (i.tailMode = l));
}
function Ac(e, t, n) {
    var r = t.pendingProps,
        l = r.revealOrder,
        i = r.tail;
    if ((Te(e, t, r.children, n), (r = ae.current), r & 2))
        (r = (r & 1) | 2), (t.flags |= 128);
    else {
        if (e !== null && e.flags & 128)
            e: for (e = t.child; e !== null; ) {
                if (e.tag === 13) e.memoizedState !== null && Ca(e, n, t);
                else if (e.tag === 19) Ca(e, n, t);
                else if (e.child !== null) {
                    (e.child.return = e), (e = e.child);
                    continue;
                }
                if (e === t) break e;
                for (; e.sibling === null; ) {
                    if (e.return === null || e.return === t) break e;
                    e = e.return;
                }
                (e.sibling.return = e.return), (e = e.sibling);
            }
        r &= 1;
    }
    if ((te(ae, r), !(t.mode & 1))) t.memoizedState = null;
    else
        switch (l) {
            case "forwards":
                for (n = t.child, l = null; n !== null; )
                    (e = n.alternate),
                        e !== null && Rl(e) === null && (l = n),
                        (n = n.sibling);
                (n = l),
                    n === null
                        ? ((l = t.child), (t.child = null))
                        : ((l = n.sibling), (n.sibling = null)),
                    ji(t, !1, l, n, i);
                break;
            case "backwards":
                for (n = null, l = t.child, t.child = null; l !== null; ) {
                    if (((e = l.alternate), e !== null && Rl(e) === null)) {
                        t.child = l;
                        break;
                    }
                    (e = l.sibling), (l.sibling = n), (n = l), (l = e);
                }
                ji(t, !0, n, null, i);
                break;
            case "together":
                ji(t, !1, null, null, void 0);
                break;
            default:
                t.memoizedState = null;
        }
    return t.child;
}
function fl(e, t) {
    !(t.mode & 1) &&
        e !== null &&
        ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function Nt(e, t, n) {
    if (
        (e !== null && (t.dependencies = e.dependencies),
        (on |= t.lanes),
        !(n & t.childLanes))
    )
        return null;
    if (e !== null && t.child !== e.child) throw Error(j(153));
    if (t.child !== null) {
        for (
            e = t.child, n = Ht(e, e.pendingProps), t.child = n, n.return = t;
            e.sibling !== null;

        )
            (e = e.sibling),
                (n = n.sibling = Ht(e, e.pendingProps)),
                (n.return = t);
        n.sibling = null;
    }
    return t.child;
}
function Tp(e, t, n) {
    switch (t.tag) {
        case 3:
            Oc(t), Mn();
            break;
        case 5:
            dc(t);
            break;
        case 1:
            Ae(t.type) && Cl(t);
            break;
        case 4:
            ls(t, t.stateNode.containerInfo);
            break;
        case 10:
            var r = t.type._context,
                l = t.memoizedProps.value;
            te(Il, r._currentValue), (r._currentValue = l);
            break;
        case 13:
            if (((r = t.memoizedState), r !== null))
                return r.dehydrated !== null
                    ? (te(ae, ae.current & 1), (t.flags |= 128), null)
                    : n & t.child.childLanes
                    ? Fc(e, t, n)
                    : (te(ae, ae.current & 1),
                      (e = Nt(e, t, n)),
                      e !== null ? e.sibling : null);
            te(ae, ae.current & 1);
            break;
        case 19:
            if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
                if (r) return Ac(e, t, n);
                t.flags |= 128;
            }
            if (
                ((l = t.memoizedState),
                l !== null &&
                    ((l.rendering = null),
                    (l.tail = null),
                    (l.lastEffect = null)),
                te(ae, ae.current),
                r)
            )
                break;
            return null;
        case 22:
        case 23:
            return (t.lanes = 0), Dc(e, t, n);
    }
    return Nt(e, t, n);
}
var Uc, wo, Bc, Hc;
Uc = function (e, t) {
    for (var n = t.child; n !== null; ) {
        if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
        else if (n.tag !== 4 && n.child !== null) {
            (n.child.return = n), (n = n.child);
            continue;
        }
        if (n === t) break;
        for (; n.sibling === null; ) {
            if (n.return === null || n.return === t) return;
            n = n.return;
        }
        (n.sibling.return = n.return), (n = n.sibling);
    }
};
wo = function () {};
Bc = function (e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
        (e = t.stateNode), bt(mt.current);
        var i = null;
        switch (n) {
            case "input":
                (l = Bi(e, l)), (r = Bi(e, r)), (i = []);
                break;
            case "select":
                (l = ce({}, l, { value: void 0 })),
                    (r = ce({}, r, { value: void 0 })),
                    (i = []);
                break;
            case "textarea":
                (l = Wi(e, l)), (r = Wi(e, r)), (i = []);
                break;
            default:
                typeof l.onClick != "function" &&
                    typeof r.onClick == "function" &&
                    (e.onclick = Nl);
        }
        Qi(n, r);
        var o;
        n = null;
        for (f in l)
            if (!r.hasOwnProperty(f) && l.hasOwnProperty(f) && l[f] != null)
                if (f === "style") {
                    var s = l[f];
                    for (o in s)
                        s.hasOwnProperty(o) && (n || (n = {}), (n[o] = ""));
                } else
                    f !== "dangerouslySetInnerHTML" &&
                        f !== "children" &&
                        f !== "suppressContentEditableWarning" &&
                        f !== "suppressHydrationWarning" &&
                        f !== "autoFocus" &&
                        (pr.hasOwnProperty(f)
                            ? i || (i = [])
                            : (i = i || []).push(f, null));
        for (f in r) {
            var a = r[f];
            if (
                ((s = l != null ? l[f] : void 0),
                r.hasOwnProperty(f) && a !== s && (a != null || s != null))
            )
                if (f === "style")
                    if (s) {
                        for (o in s)
                            !s.hasOwnProperty(o) ||
                                (a && a.hasOwnProperty(o)) ||
                                (n || (n = {}), (n[o] = ""));
                        for (o in a)
                            a.hasOwnProperty(o) &&
                                s[o] !== a[o] &&
                                (n || (n = {}), (n[o] = a[o]));
                    } else n || (i || (i = []), i.push(f, n)), (n = a);
                else
                    f === "dangerouslySetInnerHTML"
                        ? ((a = a ? a.__html : void 0),
                          (s = s ? s.__html : void 0),
                          a != null && s !== a && (i = i || []).push(f, a))
                        : f === "children"
                        ? (typeof a != "string" && typeof a != "number") ||
                          (i = i || []).push(f, "" + a)
                        : f !== "suppressContentEditableWarning" &&
                          f !== "suppressHydrationWarning" &&
                          (pr.hasOwnProperty(f)
                              ? (a != null &&
                                    f === "onScroll" &&
                                    re("scroll", e),
                                i || s === a || (i = []))
                              : (i = i || []).push(f, a));
        }
        n && (i = i || []).push("style", n);
        var f = i;
        (t.updateQueue = f) && (t.flags |= 4);
    }
};
Hc = function (e, t, n, r) {
    n !== r && (t.flags |= 4);
};
function Jn(e, t) {
    if (!se)
        switch (e.tailMode) {
            case "hidden":
                t = e.tail;
                for (var n = null; t !== null; )
                    t.alternate !== null && (n = t), (t = t.sibling);
                n === null ? (e.tail = null) : (n.sibling = null);
                break;
            case "collapsed":
                n = e.tail;
                for (var r = null; n !== null; )
                    n.alternate !== null && (r = n), (n = n.sibling);
                r === null
                    ? t || e.tail === null
                        ? (e.tail = null)
                        : (e.tail.sibling = null)
                    : (r.sibling = null);
        }
}
function je(e) {
    var t = e.alternate !== null && e.alternate.child === e.child,
        n = 0,
        r = 0;
    if (t)
        for (var l = e.child; l !== null; )
            (n |= l.lanes | l.childLanes),
                (r |= l.subtreeFlags & 14680064),
                (r |= l.flags & 14680064),
                (l.return = e),
                (l = l.sibling);
    else
        for (l = e.child; l !== null; )
            (n |= l.lanes | l.childLanes),
                (r |= l.subtreeFlags),
                (r |= l.flags),
                (l.return = e),
                (l = l.sibling);
    return (e.subtreeFlags |= r), (e.childLanes = n), t;
}
function Lp(e, t, n) {
    var r = t.pendingProps;
    switch ((Jo(t), t.tag)) {
        case 2:
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
            return je(t), null;
        case 1:
            return Ae(t.type) && El(), je(t), null;
        case 3:
            return (
                (r = t.stateNode),
                Dn(),
                le(Fe),
                le(Ie),
                os(),
                r.pendingContext &&
                    ((r.context = r.pendingContext), (r.pendingContext = null)),
                (e === null || e.child === null) &&
                    (Yr(t)
                        ? (t.flags |= 4)
                        : e === null ||
                          (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
                          ((t.flags |= 1024),
                          lt !== null && (Po(lt), (lt = null)))),
                wo(e, t),
                je(t),
                null
            );
        case 5:
            is(t);
            var l = bt(Er.current);
            if (((n = t.type), e !== null && t.stateNode != null))
                Bc(e, t, n, r, l),
                    e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152));
            else {
                if (!r) {
                    if (t.stateNode === null) throw Error(j(166));
                    return je(t), null;
                }
                if (((e = bt(mt.current)), Yr(t))) {
                    (r = t.stateNode), (n = t.type);
                    var i = t.memoizedProps;
                    switch (
                        ((r[ft] = t), (r[kr] = i), (e = (t.mode & 1) !== 0), n)
                    ) {
                        case "dialog":
                            re("cancel", r), re("close", r);
                            break;
                        case "iframe":
                        case "object":
                        case "embed":
                            re("load", r);
                            break;
                        case "video":
                        case "audio":
                            for (l = 0; l < rr.length; l++) re(rr[l], r);
                            break;
                        case "source":
                            re("error", r);
                            break;
                        case "img":
                        case "image":
                        case "link":
                            re("error", r), re("load", r);
                            break;
                        case "details":
                            re("toggle", r);
                            break;
                        case "input":
                            Ds(r, i), re("invalid", r);
                            break;
                        case "select":
                            (r._wrapperState = { wasMultiple: !!i.multiple }),
                                re("invalid", r);
                            break;
                        case "textarea":
                            Os(r, i), re("invalid", r);
                    }
                    Qi(n, i), (l = null);
                    for (var o in i)
                        if (i.hasOwnProperty(o)) {
                            var s = i[o];
                            o === "children"
                                ? typeof s == "string"
                                    ? r.textContent !== s &&
                                      (i.suppressHydrationWarning !== !0 &&
                                          Gr(r.textContent, s, e),
                                      (l = ["children", s]))
                                    : typeof s == "number" &&
                                      r.textContent !== "" + s &&
                                      (i.suppressHydrationWarning !== !0 &&
                                          Gr(r.textContent, s, e),
                                      (l = ["children", "" + s]))
                                : pr.hasOwnProperty(o) &&
                                  s != null &&
                                  o === "onScroll" &&
                                  re("scroll", r);
                        }
                    switch (n) {
                        case "input":
                            Ar(r), $s(r, i, !0);
                            break;
                        case "textarea":
                            Ar(r), Fs(r);
                            break;
                        case "select":
                        case "option":
                            break;
                        default:
                            typeof i.onClick == "function" && (r.onclick = Nl);
                    }
                    (r = l), (t.updateQueue = r), r !== null && (t.flags |= 4);
                } else {
                    (o = l.nodeType === 9 ? l : l.ownerDocument),
                        e === "http://www.w3.org/1999/xhtml" && (e = vu(n)),
                        e === "http://www.w3.org/1999/xhtml"
                            ? n === "script"
                                ? ((e = o.createElement("div")),
                                  (e.innerHTML = "<script></script>"),
                                  (e = e.removeChild(e.firstChild)))
                                : typeof r.is == "string"
                                ? (e = o.createElement(n, { is: r.is }))
                                : ((e = o.createElement(n)),
                                  n === "select" &&
                                      ((o = e),
                                      r.multiple
                                          ? (o.multiple = !0)
                                          : r.size && (o.size = r.size)))
                            : (e = o.createElementNS(e, n)),
                        (e[ft] = t),
                        (e[kr] = r),
                        Uc(e, t, !1, !1),
                        (t.stateNode = e);
                    e: {
                        switch (((o = Gi(n, r)), n)) {
                            case "dialog":
                                re("cancel", e), re("close", e), (l = r);
                                break;
                            case "iframe":
                            case "object":
                            case "embed":
                                re("load", e), (l = r);
                                break;
                            case "video":
                            case "audio":
                                for (l = 0; l < rr.length; l++) re(rr[l], e);
                                l = r;
                                break;
                            case "source":
                                re("error", e), (l = r);
                                break;
                            case "img":
                            case "image":
                            case "link":
                                re("error", e), re("load", e), (l = r);
                                break;
                            case "details":
                                re("toggle", e), (l = r);
                                break;
                            case "input":
                                Ds(e, r), (l = Bi(e, r)), re("invalid", e);
                                break;
                            case "option":
                                l = r;
                                break;
                            case "select":
                                (e._wrapperState = {
                                    wasMultiple: !!r.multiple,
                                }),
                                    (l = ce({}, r, { value: void 0 })),
                                    re("invalid", e);
                                break;
                            case "textarea":
                                Os(e, r), (l = Wi(e, r)), re("invalid", e);
                                break;
                            default:
                                l = r;
                        }
                        Qi(n, l), (s = l);
                        for (i in s)
                            if (s.hasOwnProperty(i)) {
                                var a = s[i];
                                i === "style"
                                    ? _u(e, a)
                                    : i === "dangerouslySetInnerHTML"
                                    ? ((a = a ? a.__html : void 0),
                                      a != null && gu(e, a))
                                    : i === "children"
                                    ? typeof a == "string"
                                        ? (n !== "textarea" || a !== "") &&
                                          mr(e, a)
                                        : typeof a == "number" && mr(e, "" + a)
                                    : i !== "suppressContentEditableWarning" &&
                                      i !== "suppressHydrationWarning" &&
                                      i !== "autoFocus" &&
                                      (pr.hasOwnProperty(i)
                                          ? a != null &&
                                            i === "onScroll" &&
                                            re("scroll", e)
                                          : a != null && $o(e, i, a, o));
                            }
                        switch (n) {
                            case "input":
                                Ar(e), $s(e, r, !1);
                                break;
                            case "textarea":
                                Ar(e), Fs(e);
                                break;
                            case "option":
                                r.value != null &&
                                    e.setAttribute("value", "" + Vt(r.value));
                                break;
                            case "select":
                                (e.multiple = !!r.multiple),
                                    (i = r.value),
                                    i != null
                                        ? En(e, !!r.multiple, i, !1)
                                        : r.defaultValue != null &&
                                          En(
                                              e,
                                              !!r.multiple,
                                              r.defaultValue,
                                              !0
                                          );
                                break;
                            default:
                                typeof l.onClick == "function" &&
                                    (e.onclick = Nl);
                        }
                        switch (n) {
                            case "button":
                            case "input":
                            case "select":
                            case "textarea":
                                r = !!r.autoFocus;
                                break e;
                            case "img":
                                r = !0;
                                break e;
                            default:
                                r = !1;
                        }
                    }
                    r && (t.flags |= 4);
                }
                t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
            }
            return je(t), null;
        case 6:
            if (e && t.stateNode != null) Hc(e, t, e.memoizedProps, r);
            else {
                if (typeof r != "string" && t.stateNode === null)
                    throw Error(j(166));
                if (((n = bt(Er.current)), bt(mt.current), Yr(t))) {
                    if (
                        ((r = t.stateNode),
                        (n = t.memoizedProps),
                        (r[ft] = t),
                        (i = r.nodeValue !== n) && ((e = We), e !== null))
                    )
                        switch (e.tag) {
                            case 3:
                                Gr(r.nodeValue, n, (e.mode & 1) !== 0);
                                break;
                            case 5:
                                e.memoizedProps.suppressHydrationWarning !==
                                    !0 &&
                                    Gr(r.nodeValue, n, (e.mode & 1) !== 0);
                        }
                    i && (t.flags |= 4);
                } else
                    (r = (
                        n.nodeType === 9 ? n : n.ownerDocument
                    ).createTextNode(r)),
                        (r[ft] = t),
                        (t.stateNode = r);
            }
            return je(t), null;
        case 13:
            if (
                (le(ae),
                (r = t.memoizedState),
                e === null ||
                    (e.memoizedState !== null &&
                        e.memoizedState.dehydrated !== null))
            ) {
                if (se && Ve !== null && t.mode & 1 && !(t.flags & 128))
                    oc(), Mn(), (t.flags |= 98560), (i = !1);
                else if (((i = Yr(t)), r !== null && r.dehydrated !== null)) {
                    if (e === null) {
                        if (!i) throw Error(j(318));
                        if (
                            ((i = t.memoizedState),
                            (i = i !== null ? i.dehydrated : null),
                            !i)
                        )
                            throw Error(j(317));
                        i[ft] = t;
                    } else
                        Mn(),
                            !(t.flags & 128) && (t.memoizedState = null),
                            (t.flags |= 4);
                    je(t), (i = !1);
                } else lt !== null && (Po(lt), (lt = null)), (i = !0);
                if (!i) return t.flags & 65536 ? t : null;
            }
            return t.flags & 128
                ? ((t.lanes = n), t)
                : ((r = r !== null),
                  r !== (e !== null && e.memoizedState !== null) &&
                      r &&
                      ((t.child.flags |= 8192),
                      t.mode & 1 &&
                          (e === null || ae.current & 1
                              ? ye === 0 && (ye = 3)
                              : ys())),
                  t.updateQueue !== null && (t.flags |= 4),
                  je(t),
                  null);
        case 4:
            return (
                Dn(),
                wo(e, t),
                e === null && Sr(t.stateNode.containerInfo),
                je(t),
                null
            );
        case 10:
            return ts(t.type._context), je(t), null;
        case 17:
            return Ae(t.type) && El(), je(t), null;
        case 19:
            if ((le(ae), (i = t.memoizedState), i === null)) return je(t), null;
            if (((r = (t.flags & 128) !== 0), (o = i.rendering), o === null))
                if (r) Jn(i, !1);
                else {
                    if (ye !== 0 || (e !== null && e.flags & 128))
                        for (e = t.child; e !== null; ) {
                            if (((o = Rl(e)), o !== null)) {
                                for (
                                    t.flags |= 128,
                                        Jn(i, !1),
                                        r = o.updateQueue,
                                        r !== null &&
                                            ((t.updateQueue = r),
                                            (t.flags |= 4)),
                                        t.subtreeFlags = 0,
                                        r = n,
                                        n = t.child;
                                    n !== null;

                                )
                                    (i = n),
                                        (e = r),
                                        (i.flags &= 14680066),
                                        (o = i.alternate),
                                        o === null
                                            ? ((i.childLanes = 0),
                                              (i.lanes = e),
                                              (i.child = null),
                                              (i.subtreeFlags = 0),
                                              (i.memoizedProps = null),
                                              (i.memoizedState = null),
                                              (i.updateQueue = null),
                                              (i.dependencies = null),
                                              (i.stateNode = null))
                                            : ((i.childLanes = o.childLanes),
                                              (i.lanes = o.lanes),
                                              (i.child = o.child),
                                              (i.subtreeFlags = 0),
                                              (i.deletions = null),
                                              (i.memoizedProps =
                                                  o.memoizedProps),
                                              (i.memoizedState =
                                                  o.memoizedState),
                                              (i.updateQueue = o.updateQueue),
                                              (i.type = o.type),
                                              (e = o.dependencies),
                                              (i.dependencies =
                                                  e === null
                                                      ? null
                                                      : {
                                                            lanes: e.lanes,
                                                            firstContext:
                                                                e.firstContext,
                                                        })),
                                        (n = n.sibling);
                                return te(ae, (ae.current & 1) | 2), t.child;
                            }
                            e = e.sibling;
                        }
                    i.tail !== null &&
                        fe() > On &&
                        ((t.flags |= 128),
                        (r = !0),
                        Jn(i, !1),
                        (t.lanes = 4194304));
                }
            else {
                if (!r)
                    if (((e = Rl(o)), e !== null)) {
                        if (
                            ((t.flags |= 128),
                            (r = !0),
                            (n = e.updateQueue),
                            n !== null && ((t.updateQueue = n), (t.flags |= 4)),
                            Jn(i, !0),
                            i.tail === null &&
                                i.tailMode === "hidden" &&
                                !o.alternate &&
                                !se)
                        )
                            return je(t), null;
                    } else
                        2 * fe() - i.renderingStartTime > On &&
                            n !== 1073741824 &&
                            ((t.flags |= 128),
                            (r = !0),
                            Jn(i, !1),
                            (t.lanes = 4194304));
                i.isBackwards
                    ? ((o.sibling = t.child), (t.child = o))
                    : ((n = i.last),
                      n !== null ? (n.sibling = o) : (t.child = o),
                      (i.last = o));
            }
            return i.tail !== null
                ? ((t = i.tail),
                  (i.rendering = t),
                  (i.tail = t.sibling),
                  (i.renderingStartTime = fe()),
                  (t.sibling = null),
                  (n = ae.current),
                  te(ae, r ? (n & 1) | 2 : n & 1),
                  t)
                : (je(t), null);
        case 22:
        case 23:
            return (
                gs(),
                (r = t.memoizedState !== null),
                e !== null &&
                    (e.memoizedState !== null) !== r &&
                    (t.flags |= 8192),
                r && t.mode & 1
                    ? He & 1073741824 &&
                      (je(t), t.subtreeFlags & 6 && (t.flags |= 8192))
                    : je(t),
                null
            );
        case 24:
            return null;
        case 25:
            return null;
    }
    throw Error(j(156, t.tag));
}
function Rp(e, t) {
    switch ((Jo(t), t.tag)) {
        case 1:
            return (
                Ae(t.type) && El(),
                (e = t.flags),
                e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
            );
        case 3:
            return (
                Dn(),
                le(Fe),
                le(Ie),
                os(),
                (e = t.flags),
                e & 65536 && !(e & 128)
                    ? ((t.flags = (e & -65537) | 128), t)
                    : null
            );
        case 5:
            return is(t), null;
        case 13:
            if (
                (le(ae),
                (e = t.memoizedState),
                e !== null && e.dehydrated !== null)
            ) {
                if (t.alternate === null) throw Error(j(340));
                Mn();
            }
            return (
                (e = t.flags),
                e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
            );
        case 19:
            return le(ae), null;
        case 4:
            return Dn(), null;
        case 10:
            return ts(t.type._context), null;
        case 22:
        case 23:
            return gs(), null;
        case 24:
            return null;
        default:
            return null;
    }
}
var Jr = !1,
    Pe = !1,
    Mp = typeof WeakSet == "function" ? WeakSet : Set,
    D = null;
function xn(e, t) {
    var n = e.ref;
    if (n !== null)
        if (typeof n == "function")
            try {
                n(null);
            } catch (r) {
                de(e, t, r);
            }
        else n.current = null;
}
function So(e, t, n) {
    try {
        n();
    } catch (r) {
        de(e, t, r);
    }
}
var ja = !1;
function zp(e, t) {
    if (((ro = Sl), (e = Gu()), Xo(e))) {
        if ("selectionStart" in e)
            var n = { start: e.selectionStart, end: e.selectionEnd };
        else
            e: {
                n = ((n = e.ownerDocument) && n.defaultView) || window;
                var r = n.getSelection && n.getSelection();
                if (r && r.rangeCount !== 0) {
                    n = r.anchorNode;
                    var l = r.anchorOffset,
                        i = r.focusNode;
                    r = r.focusOffset;
                    try {
                        n.nodeType, i.nodeType;
                    } catch {
                        n = null;
                        break e;
                    }
                    var o = 0,
                        s = -1,
                        a = -1,
                        f = 0,
                        h = 0,
                        m = e,
                        v = null;
                    t: for (;;) {
                        for (
                            var _;
                            m !== n ||
                                (l !== 0 && m.nodeType !== 3) ||
                                (s = o + l),
                                m !== i ||
                                    (r !== 0 && m.nodeType !== 3) ||
                                    (a = o + r),
                                m.nodeType === 3 && (o += m.nodeValue.length),
                                (_ = m.firstChild) !== null;

                        )
                            (v = m), (m = _);
                        for (;;) {
                            if (m === e) break t;
                            if (
                                (v === n && ++f === l && (s = o),
                                v === i && ++h === r && (a = o),
                                (_ = m.nextSibling) !== null)
                            )
                                break;
                            (m = v), (v = m.parentNode);
                        }
                        m = _;
                    }
                    n = s === -1 || a === -1 ? null : { start: s, end: a };
                } else n = null;
            }
        n = n || { start: 0, end: 0 };
    } else n = null;
    for (
        lo = { focusedElem: e, selectionRange: n }, Sl = !1, D = t;
        D !== null;

    )
        if (
            ((t = D),
            (e = t.child),
            (t.subtreeFlags & 1028) !== 0 && e !== null)
        )
            (e.return = t), (D = e);
        else
            for (; D !== null; ) {
                t = D;
                try {
                    var S = t.alternate;
                    if (t.flags & 1024)
                        switch (t.tag) {
                            case 0:
                            case 11:
                            case 15:
                                break;
                            case 1:
                                if (S !== null) {
                                    var N = S.memoizedProps,
                                        K = S.memoizedState,
                                        p = t.stateNode,
                                        d = p.getSnapshotBeforeUpdate(
                                            t.elementType === t.type
                                                ? N
                                                : nt(t.type, N),
                                            K
                                        );
                                    p.__reactInternalSnapshotBeforeUpdate = d;
                                }
                                break;
                            case 3:
                                var c = t.stateNode.containerInfo;
                                c.nodeType === 1
                                    ? (c.textContent = "")
                                    : c.nodeType === 9 &&
                                      c.documentElement &&
                                      c.removeChild(c.documentElement);
                                break;
                            case 5:
                            case 6:
                            case 4:
                            case 17:
                                break;
                            default:
                                throw Error(j(163));
                        }
                } catch (g) {
                    de(t, t.return, g);
                }
                if (((e = t.sibling), e !== null)) {
                    (e.return = t.return), (D = e);
                    break;
                }
                D = t.return;
            }
    return (S = ja), (ja = !1), S;
}
function cr(e, t, n) {
    var r = t.updateQueue;
    if (((r = r !== null ? r.lastEffect : null), r !== null)) {
        var l = (r = r.next);
        do {
            if ((l.tag & e) === e) {
                var i = l.destroy;
                (l.destroy = void 0), i !== void 0 && So(t, n, i);
            }
            l = l.next;
        } while (l !== r);
    }
}
function Xl(e, t) {
    if (
        ((t = t.updateQueue),
        (t = t !== null ? t.lastEffect : null),
        t !== null)
    ) {
        var n = (t = t.next);
        do {
            if ((n.tag & e) === e) {
                var r = n.create;
                n.destroy = r();
            }
            n = n.next;
        } while (n !== t);
    }
}
function xo(e) {
    var t = e.ref;
    if (t !== null) {
        var n = e.stateNode;
        switch (e.tag) {
            case 5:
                e = n;
                break;
            default:
                e = n;
        }
        typeof t == "function" ? t(e) : (t.current = e);
    }
}
function Vc(e) {
    var t = e.alternate;
    t !== null && ((e.alternate = null), Vc(t)),
        (e.child = null),
        (e.deletions = null),
        (e.sibling = null),
        e.tag === 5 &&
            ((t = e.stateNode),
            t !== null &&
                (delete t[ft],
                delete t[kr],
                delete t[so],
                delete t[vp],
                delete t[gp])),
        (e.stateNode = null),
        (e.return = null),
        (e.dependencies = null),
        (e.memoizedProps = null),
        (e.memoizedState = null),
        (e.pendingProps = null),
        (e.stateNode = null),
        (e.updateQueue = null);
}
function Wc(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Pa(e) {
    e: for (;;) {
        for (; e.sibling === null; ) {
            if (e.return === null || Wc(e.return)) return null;
            e = e.return;
        }
        for (
            e.sibling.return = e.return, e = e.sibling;
            e.tag !== 5 && e.tag !== 6 && e.tag !== 18;

        ) {
            if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
            (e.child.return = e), (e = e.child);
        }
        if (!(e.flags & 2)) return e.stateNode;
    }
}
function ko(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6)
        (e = e.stateNode),
            t
                ? n.nodeType === 8
                    ? n.parentNode.insertBefore(e, t)
                    : n.insertBefore(e, t)
                : (n.nodeType === 8
                      ? ((t = n.parentNode), t.insertBefore(e, n))
                      : ((t = n), t.appendChild(e)),
                  (n = n._reactRootContainer),
                  n != null || t.onclick !== null || (t.onclick = Nl));
    else if (r !== 4 && ((e = e.child), e !== null))
        for (ko(e, t, n), e = e.sibling; e !== null; )
            ko(e, t, n), (e = e.sibling);
}
function No(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6)
        (e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && ((e = e.child), e !== null))
        for (No(e, t, n), e = e.sibling; e !== null; )
            No(e, t, n), (e = e.sibling);
}
var xe = null,
    rt = !1;
function jt(e, t, n) {
    for (n = n.child; n !== null; ) Kc(e, t, n), (n = n.sibling);
}
function Kc(e, t, n) {
    if (pt && typeof pt.onCommitFiberUnmount == "function")
        try {
            pt.onCommitFiberUnmount(Bl, n);
        } catch {}
    switch (n.tag) {
        case 5:
            Pe || xn(n, t);
        case 6:
            var r = xe,
                l = rt;
            (xe = null),
                jt(e, t, n),
                (xe = r),
                (rt = l),
                xe !== null &&
                    (rt
                        ? ((e = xe),
                          (n = n.stateNode),
                          e.nodeType === 8
                              ? e.parentNode.removeChild(n)
                              : e.removeChild(n))
                        : xe.removeChild(n.stateNode));
            break;
        case 18:
            xe !== null &&
                (rt
                    ? ((e = xe),
                      (n = n.stateNode),
                      e.nodeType === 8
                          ? wi(e.parentNode, n)
                          : e.nodeType === 1 && wi(e, n),
                      yr(e))
                    : wi(xe, n.stateNode));
            break;
        case 4:
            (r = xe),
                (l = rt),
                (xe = n.stateNode.containerInfo),
                (rt = !0),
                jt(e, t, n),
                (xe = r),
                (rt = l);
            break;
        case 0:
        case 11:
        case 14:
        case 15:
            if (
                !Pe &&
                ((r = n.updateQueue),
                r !== null && ((r = r.lastEffect), r !== null))
            ) {
                l = r = r.next;
                do {
                    var i = l,
                        o = i.destroy;
                    (i = i.tag),
                        o !== void 0 && (i & 2 || i & 4) && So(n, t, o),
                        (l = l.next);
                } while (l !== r);
            }
            jt(e, t, n);
            break;
        case 1:
            if (
                !Pe &&
                (xn(n, t),
                (r = n.stateNode),
                typeof r.componentWillUnmount == "function")
            )
                try {
                    (r.props = n.memoizedProps),
                        (r.state = n.memoizedState),
                        r.componentWillUnmount();
                } catch (s) {
                    de(n, t, s);
                }
            jt(e, t, n);
            break;
        case 21:
            jt(e, t, n);
            break;
        case 22:
            n.mode & 1
                ? ((Pe = (r = Pe) || n.memoizedState !== null),
                  jt(e, t, n),
                  (Pe = r))
                : jt(e, t, n);
            break;
        default:
            jt(e, t, n);
    }
}
function Ia(e) {
    var t = e.updateQueue;
    if (t !== null) {
        e.updateQueue = null;
        var n = e.stateNode;
        n === null && (n = e.stateNode = new Mp()),
            t.forEach(function (r) {
                var l = Vp.bind(null, e, r);
                n.has(r) || (n.add(r), r.then(l, l));
            });
    }
}
function tt(e, t) {
    var n = t.deletions;
    if (n !== null)
        for (var r = 0; r < n.length; r++) {
            var l = n[r];
            try {
                var i = e,
                    o = t,
                    s = o;
                e: for (; s !== null; ) {
                    switch (s.tag) {
                        case 5:
                            (xe = s.stateNode), (rt = !1);
                            break e;
                        case 3:
                            (xe = s.stateNode.containerInfo), (rt = !0);
                            break e;
                        case 4:
                            (xe = s.stateNode.containerInfo), (rt = !0);
                            break e;
                    }
                    s = s.return;
                }
                if (xe === null) throw Error(j(160));
                Kc(i, o, l), (xe = null), (rt = !1);
                var a = l.alternate;
                a !== null && (a.return = null), (l.return = null);
            } catch (f) {
                de(l, t, f);
            }
        }
    if (t.subtreeFlags & 12854)
        for (t = t.child; t !== null; ) Qc(t, e), (t = t.sibling);
}
function Qc(e, t) {
    var n = e.alternate,
        r = e.flags;
    switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
            if ((tt(t, e), ct(e), r & 4)) {
                try {
                    cr(3, e, e.return), Xl(3, e);
                } catch (N) {
                    de(e, e.return, N);
                }
                try {
                    cr(5, e, e.return);
                } catch (N) {
                    de(e, e.return, N);
                }
            }
            break;
        case 1:
            tt(t, e), ct(e), r & 512 && n !== null && xn(n, n.return);
            break;
        case 5:
            if (
                (tt(t, e),
                ct(e),
                r & 512 && n !== null && xn(n, n.return),
                e.flags & 32)
            ) {
                var l = e.stateNode;
                try {
                    mr(l, "");
                } catch (N) {
                    de(e, e.return, N);
                }
            }
            if (r & 4 && ((l = e.stateNode), l != null)) {
                var i = e.memoizedProps,
                    o = n !== null ? n.memoizedProps : i,
                    s = e.type,
                    a = e.updateQueue;
                if (((e.updateQueue = null), a !== null))
                    try {
                        s === "input" &&
                            i.type === "radio" &&
                            i.name != null &&
                            mu(l, i),
                            Gi(s, o);
                        var f = Gi(s, i);
                        for (o = 0; o < a.length; o += 2) {
                            var h = a[o],
                                m = a[o + 1];
                            h === "style"
                                ? _u(l, m)
                                : h === "dangerouslySetInnerHTML"
                                ? gu(l, m)
                                : h === "children"
                                ? mr(l, m)
                                : $o(l, h, m, f);
                        }
                        switch (s) {
                            case "input":
                                Hi(l, i);
                                break;
                            case "textarea":
                                hu(l, i);
                                break;
                            case "select":
                                var v = l._wrapperState.wasMultiple;
                                l._wrapperState.wasMultiple = !!i.multiple;
                                var _ = i.value;
                                _ != null
                                    ? En(l, !!i.multiple, _, !1)
                                    : v !== !!i.multiple &&
                                      (i.defaultValue != null
                                          ? En(
                                                l,
                                                !!i.multiple,
                                                i.defaultValue,
                                                !0
                                            )
                                          : En(
                                                l,
                                                !!i.multiple,
                                                i.multiple ? [] : "",
                                                !1
                                            ));
                        }
                        l[kr] = i;
                    } catch (N) {
                        de(e, e.return, N);
                    }
            }
            break;
        case 6:
            if ((tt(t, e), ct(e), r & 4)) {
                if (e.stateNode === null) throw Error(j(162));
                (l = e.stateNode), (i = e.memoizedProps);
                try {
                    l.nodeValue = i;
                } catch (N) {
                    de(e, e.return, N);
                }
            }
            break;
        case 3:
            if (
                (tt(t, e),
                ct(e),
                r & 4 && n !== null && n.memoizedState.isDehydrated)
            )
                try {
                    yr(t.containerInfo);
                } catch (N) {
                    de(e, e.return, N);
                }
            break;
        case 4:
            tt(t, e), ct(e);
            break;
        case 13:
            tt(t, e),
                ct(e),
                (l = e.child),
                l.flags & 8192 &&
                    ((i = l.memoizedState !== null),
                    (l.stateNode.isHidden = i),
                    !i ||
                        (l.alternate !== null &&
                            l.alternate.memoizedState !== null) ||
                        (hs = fe())),
                r & 4 && Ia(e);
            break;
        case 22:
            if (
                ((h = n !== null && n.memoizedState !== null),
                e.mode & 1
                    ? ((Pe = (f = Pe) || h), tt(t, e), (Pe = f))
                    : tt(t, e),
                ct(e),
                r & 8192)
            ) {
                if (
                    ((f = e.memoizedState !== null),
                    (e.stateNode.isHidden = f) && !h && e.mode & 1)
                )
                    for (D = e, h = e.child; h !== null; ) {
                        for (m = D = h; D !== null; ) {
                            switch (((v = D), (_ = v.child), v.tag)) {
                                case 0:
                                case 11:
                                case 14:
                                case 15:
                                    cr(4, v, v.return);
                                    break;
                                case 1:
                                    xn(v, v.return);
                                    var S = v.stateNode;
                                    if (
                                        typeof S.componentWillUnmount ==
                                        "function"
                                    ) {
                                        (r = v), (n = v.return);
                                        try {
                                            (t = r),
                                                (S.props = t.memoizedProps),
                                                (S.state = t.memoizedState),
                                                S.componentWillUnmount();
                                        } catch (N) {
                                            de(r, n, N);
                                        }
                                    }
                                    break;
                                case 5:
                                    xn(v, v.return);
                                    break;
                                case 22:
                                    if (v.memoizedState !== null) {
                                        La(m);
                                        continue;
                                    }
                            }
                            _ !== null ? ((_.return = v), (D = _)) : La(m);
                        }
                        h = h.sibling;
                    }
                e: for (h = null, m = e; ; ) {
                    if (m.tag === 5) {
                        if (h === null) {
                            h = m;
                            try {
                                (l = m.stateNode),
                                    f
                                        ? ((i = l.style),
                                          typeof i.setProperty == "function"
                                              ? i.setProperty(
                                                    "display",
                                                    "none",
                                                    "important"
                                                )
                                              : (i.display = "none"))
                                        : ((s = m.stateNode),
                                          (a = m.memoizedProps.style),
                                          (o =
                                              a != null &&
                                              a.hasOwnProperty("display")
                                                  ? a.display
                                                  : null),
                                          (s.style.display = yu("display", o)));
                            } catch (N) {
                                de(e, e.return, N);
                            }
                        }
                    } else if (m.tag === 6) {
                        if (h === null)
                            try {
                                m.stateNode.nodeValue = f
                                    ? ""
                                    : m.memoizedProps;
                            } catch (N) {
                                de(e, e.return, N);
                            }
                    } else if (
                        ((m.tag !== 22 && m.tag !== 23) ||
                            m.memoizedState === null ||
                            m === e) &&
                        m.child !== null
                    ) {
                        (m.child.return = m), (m = m.child);
                        continue;
                    }
                    if (m === e) break e;
                    for (; m.sibling === null; ) {
                        if (m.return === null || m.return === e) break e;
                        h === m && (h = null), (m = m.return);
                    }
                    h === m && (h = null),
                        (m.sibling.return = m.return),
                        (m = m.sibling);
                }
            }
            break;
        case 19:
            tt(t, e), ct(e), r & 4 && Ia(e);
            break;
        case 21:
            break;
        default:
            tt(t, e), ct(e);
    }
}
function ct(e) {
    var t = e.flags;
    if (t & 2) {
        try {
            e: {
                for (var n = e.return; n !== null; ) {
                    if (Wc(n)) {
                        var r = n;
                        break e;
                    }
                    n = n.return;
                }
                throw Error(j(160));
            }
            switch (r.tag) {
                case 5:
                    var l = r.stateNode;
                    r.flags & 32 && (mr(l, ""), (r.flags &= -33));
                    var i = Pa(e);
                    No(e, i, l);
                    break;
                case 3:
                case 4:
                    var o = r.stateNode.containerInfo,
                        s = Pa(e);
                    ko(e, s, o);
                    break;
                default:
                    throw Error(j(161));
            }
        } catch (a) {
            de(e, e.return, a);
        }
        e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
}
function Dp(e, t, n) {
    (D = e), Gc(e);
}
function Gc(e, t, n) {
    for (var r = (e.mode & 1) !== 0; D !== null; ) {
        var l = D,
            i = l.child;
        if (l.tag === 22 && r) {
            var o = l.memoizedState !== null || Jr;
            if (!o) {
                var s = l.alternate,
                    a = (s !== null && s.memoizedState !== null) || Pe;
                s = Jr;
                var f = Pe;
                if (((Jr = o), (Pe = a) && !f))
                    for (D = l; D !== null; )
                        (o = D),
                            (a = o.child),
                            o.tag === 22 && o.memoizedState !== null
                                ? Ra(l)
                                : a !== null
                                ? ((a.return = o), (D = a))
                                : Ra(l);
                for (; i !== null; ) (D = i), Gc(i), (i = i.sibling);
                (D = l), (Jr = s), (Pe = f);
            }
            Ta(e);
        } else
            l.subtreeFlags & 8772 && i !== null
                ? ((i.return = l), (D = i))
                : Ta(e);
    }
}
function Ta(e) {
    for (; D !== null; ) {
        var t = D;
        if (t.flags & 8772) {
            var n = t.alternate;
            try {
                if (t.flags & 8772)
                    switch (t.tag) {
                        case 0:
                        case 11:
                        case 15:
                            Pe || Xl(5, t);
                            break;
                        case 1:
                            var r = t.stateNode;
                            if (t.flags & 4 && !Pe)
                                if (n === null) r.componentDidMount();
                                else {
                                    var l =
                                        t.elementType === t.type
                                            ? n.memoizedProps
                                            : nt(t.type, n.memoizedProps);
                                    r.componentDidUpdate(
                                        l,
                                        n.memoizedState,
                                        r.__reactInternalSnapshotBeforeUpdate
                                    );
                                }
                            var i = t.updateQueue;
                            i !== null && ma(t, i, r);
                            break;
                        case 3:
                            var o = t.updateQueue;
                            if (o !== null) {
                                if (((n = null), t.child !== null))
                                    switch (t.child.tag) {
                                        case 5:
                                            n = t.child.stateNode;
                                            break;
                                        case 1:
                                            n = t.child.stateNode;
                                    }
                                ma(t, o, n);
                            }
                            break;
                        case 5:
                            var s = t.stateNode;
                            if (n === null && t.flags & 4) {
                                n = s;
                                var a = t.memoizedProps;
                                switch (t.type) {
                                    case "button":
                                    case "input":
                                    case "select":
                                    case "textarea":
                                        a.autoFocus && n.focus();
                                        break;
                                    case "img":
                                        a.src && (n.src = a.src);
                                }
                            }
                            break;
                        case 6:
                            break;
                        case 4:
                            break;
                        case 12:
                            break;
                        case 13:
                            if (t.memoizedState === null) {
                                var f = t.alternate;
                                if (f !== null) {
                                    var h = f.memoizedState;
                                    if (h !== null) {
                                        var m = h.dehydrated;
                                        m !== null && yr(m);
                                    }
                                }
                            }
                            break;
                        case 19:
                        case 17:
                        case 21:
                        case 22:
                        case 23:
                        case 25:
                            break;
                        default:
                            throw Error(j(163));
                    }
                Pe || (t.flags & 512 && xo(t));
            } catch (v) {
                de(t, t.return, v);
            }
        }
        if (t === e) {
            D = null;
            break;
        }
        if (((n = t.sibling), n !== null)) {
            (n.return = t.return), (D = n);
            break;
        }
        D = t.return;
    }
}
function La(e) {
    for (; D !== null; ) {
        var t = D;
        if (t === e) {
            D = null;
            break;
        }
        var n = t.sibling;
        if (n !== null) {
            (n.return = t.return), (D = n);
            break;
        }
        D = t.return;
    }
}
function Ra(e) {
    for (; D !== null; ) {
        var t = D;
        try {
            switch (t.tag) {
                case 0:
                case 11:
                case 15:
                    var n = t.return;
                    try {
                        Xl(4, t);
                    } catch (a) {
                        de(t, n, a);
                    }
                    break;
                case 1:
                    var r = t.stateNode;
                    if (typeof r.componentDidMount == "function") {
                        var l = t.return;
                        try {
                            r.componentDidMount();
                        } catch (a) {
                            de(t, l, a);
                        }
                    }
                    var i = t.return;
                    try {
                        xo(t);
                    } catch (a) {
                        de(t, i, a);
                    }
                    break;
                case 5:
                    var o = t.return;
                    try {
                        xo(t);
                    } catch (a) {
                        de(t, o, a);
                    }
            }
        } catch (a) {
            de(t, t.return, a);
        }
        if (t === e) {
            D = null;
            break;
        }
        var s = t.sibling;
        if (s !== null) {
            (s.return = t.return), (D = s);
            break;
        }
        D = t.return;
    }
}
var $p = Math.ceil,
    Dl = Et.ReactCurrentDispatcher,
    ps = Et.ReactCurrentOwner,
    qe = Et.ReactCurrentBatchConfig,
    J = 0,
    Se = null,
    he = null,
    ke = 0,
    He = 0,
    kn = Qt(0),
    ye = 0,
    Ir = null,
    on = 0,
    Zl = 0,
    ms = 0,
    dr = null,
    $e = null,
    hs = 0,
    On = 1 / 0,
    vt = null,
    $l = !1,
    Eo = null,
    Ut = null,
    qr = !1,
    zt = null,
    Ol = 0,
    fr = 0,
    Co = null,
    pl = -1,
    ml = 0;
function Le() {
    return J & 6 ? fe() : pl !== -1 ? pl : (pl = fe());
}
function Bt(e) {
    return e.mode & 1
        ? J & 2 && ke !== 0
            ? ke & -ke
            : _p.transition !== null
            ? (ml === 0 && (ml = Lu()), ml)
            : ((e = b),
              e !== 0 ||
                  ((e = window.event), (e = e === void 0 ? 16 : Fu(e.type))),
              e)
        : 1;
}
function ot(e, t, n, r) {
    if (50 < fr) throw ((fr = 0), (Co = null), Error(j(185)));
    Lr(e, n, r),
        (!(J & 2) || e !== Se) &&
            (e === Se && (!(J & 2) && (Zl |= n), ye === 4 && Lt(e, ke)),
            Ue(e, r),
            n === 1 &&
                J === 0 &&
                !(t.mode & 1) &&
                ((On = fe() + 500), Ql && Gt()));
}
function Ue(e, t) {
    var n = e.callbackNode;
    _f(e, t);
    var r = wl(e, e === Se ? ke : 0);
    if (r === 0)
        n !== null && Bs(n), (e.callbackNode = null), (e.callbackPriority = 0);
    else if (((t = r & -r), e.callbackPriority !== t)) {
        if ((n != null && Bs(n), t === 1))
            e.tag === 0 ? yp(Ma.bind(null, e)) : rc(Ma.bind(null, e)),
                mp(function () {
                    !(J & 6) && Gt();
                }),
                (n = null);
        else {
            switch (Ru(r)) {
                case 1:
                    n = Bo;
                    break;
                case 4:
                    n = Iu;
                    break;
                case 16:
                    n = _l;
                    break;
                case 536870912:
                    n = Tu;
                    break;
                default:
                    n = _l;
            }
            n = td(n, Yc.bind(null, e));
        }
        (e.callbackPriority = t), (e.callbackNode = n);
    }
}
function Yc(e, t) {
    if (((pl = -1), (ml = 0), J & 6)) throw Error(j(327));
    var n = e.callbackNode;
    if (Tn() && e.callbackNode !== n) return null;
    var r = wl(e, e === Se ? ke : 0);
    if (r === 0) return null;
    if (r & 30 || r & e.expiredLanes || t) t = Fl(e, r);
    else {
        t = r;
        var l = J;
        J |= 2;
        var i = Zc();
        (Se !== e || ke !== t) && ((vt = null), (On = fe() + 500), en(e, t));
        do
            try {
                Ap();
                break;
            } catch (s) {
                Xc(e, s);
            }
        while (!0);
        es(),
            (Dl.current = i),
            (J = l),
            he !== null ? (t = 0) : ((Se = null), (ke = 0), (t = ye));
    }
    if (t !== 0) {
        if (
            (t === 2 && ((l = qi(e)), l !== 0 && ((r = l), (t = jo(e, l)))),
            t === 1)
        )
            throw ((n = Ir), en(e, 0), Lt(e, r), Ue(e, fe()), n);
        if (t === 6) Lt(e, r);
        else {
            if (
                ((l = e.current.alternate),
                !(r & 30) &&
                    !Op(l) &&
                    ((t = Fl(e, r)),
                    t === 2 &&
                        ((i = qi(e)), i !== 0 && ((r = i), (t = jo(e, i)))),
                    t === 1))
            )
                throw ((n = Ir), en(e, 0), Lt(e, r), Ue(e, fe()), n);
            switch (((e.finishedWork = l), (e.finishedLanes = r), t)) {
                case 0:
                case 1:
                    throw Error(j(345));
                case 2:
                    Zt(e, $e, vt);
                    break;
                case 3:
                    if (
                        (Lt(e, r),
                        (r & 130023424) === r &&
                            ((t = hs + 500 - fe()), 10 < t))
                    ) {
                        if (wl(e, 0) !== 0) break;
                        if (((l = e.suspendedLanes), (l & r) !== r)) {
                            Le(), (e.pingedLanes |= e.suspendedLanes & l);
                            break;
                        }
                        e.timeoutHandle = oo(Zt.bind(null, e, $e, vt), t);
                        break;
                    }
                    Zt(e, $e, vt);
                    break;
                case 4:
                    if ((Lt(e, r), (r & 4194240) === r)) break;
                    for (t = e.eventTimes, l = -1; 0 < r; ) {
                        var o = 31 - it(r);
                        (i = 1 << o), (o = t[o]), o > l && (l = o), (r &= ~i);
                    }
                    if (
                        ((r = l),
                        (r = fe() - r),
                        (r =
                            (120 > r
                                ? 120
                                : 480 > r
                                ? 480
                                : 1080 > r
                                ? 1080
                                : 1920 > r
                                ? 1920
                                : 3e3 > r
                                ? 3e3
                                : 4320 > r
                                ? 4320
                                : 1960 * $p(r / 1960)) - r),
                        10 < r)
                    ) {
                        e.timeoutHandle = oo(Zt.bind(null, e, $e, vt), r);
                        break;
                    }
                    Zt(e, $e, vt);
                    break;
                case 5:
                    Zt(e, $e, vt);
                    break;
                default:
                    throw Error(j(329));
            }
        }
    }
    return Ue(e, fe()), e.callbackNode === n ? Yc.bind(null, e) : null;
}
function jo(e, t) {
    var n = dr;
    return (
        e.current.memoizedState.isDehydrated && (en(e, t).flags |= 256),
        (e = Fl(e, t)),
        e !== 2 && ((t = $e), ($e = n), t !== null && Po(t)),
        e
    );
}
function Po(e) {
    $e === null ? ($e = e) : $e.push.apply($e, e);
}
function Op(e) {
    for (var t = e; ; ) {
        if (t.flags & 16384) {
            var n = t.updateQueue;
            if (n !== null && ((n = n.stores), n !== null))
                for (var r = 0; r < n.length; r++) {
                    var l = n[r],
                        i = l.getSnapshot;
                    l = l.value;
                    try {
                        if (!st(i(), l)) return !1;
                    } catch {
                        return !1;
                    }
                }
        }
        if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
            (n.return = t), (t = n);
        else {
            if (t === e) break;
            for (; t.sibling === null; ) {
                if (t.return === null || t.return === e) return !0;
                t = t.return;
            }
            (t.sibling.return = t.return), (t = t.sibling);
        }
    }
    return !0;
}
function Lt(e, t) {
    for (
        t &= ~ms,
            t &= ~Zl,
            e.suspendedLanes |= t,
            e.pingedLanes &= ~t,
            e = e.expirationTimes;
        0 < t;

    ) {
        var n = 31 - it(t),
            r = 1 << n;
        (e[n] = -1), (t &= ~r);
    }
}
function Ma(e) {
    if (J & 6) throw Error(j(327));
    Tn();
    var t = wl(e, 0);
    if (!(t & 1)) return Ue(e, fe()), null;
    var n = Fl(e, t);
    if (e.tag !== 0 && n === 2) {
        var r = qi(e);
        r !== 0 && ((t = r), (n = jo(e, r)));
    }
    if (n === 1) throw ((n = Ir), en(e, 0), Lt(e, t), Ue(e, fe()), n);
    if (n === 6) throw Error(j(345));
    return (
        (e.finishedWork = e.current.alternate),
        (e.finishedLanes = t),
        Zt(e, $e, vt),
        Ue(e, fe()),
        null
    );
}
function vs(e, t) {
    var n = J;
    J |= 1;
    try {
        return e(t);
    } finally {
        (J = n), J === 0 && ((On = fe() + 500), Ql && Gt());
    }
}
function sn(e) {
    zt !== null && zt.tag === 0 && !(J & 6) && Tn();
    var t = J;
    J |= 1;
    var n = qe.transition,
        r = b;
    try {
        if (((qe.transition = null), (b = 1), e)) return e();
    } finally {
        (b = r), (qe.transition = n), (J = t), !(J & 6) && Gt();
    }
}
function gs() {
    (He = kn.current), le(kn);
}
function en(e, t) {
    (e.finishedWork = null), (e.finishedLanes = 0);
    var n = e.timeoutHandle;
    if ((n !== -1 && ((e.timeoutHandle = -1), pp(n)), he !== null))
        for (n = he.return; n !== null; ) {
            var r = n;
            switch ((Jo(r), r.tag)) {
                case 1:
                    (r = r.type.childContextTypes), r != null && El();
                    break;
                case 3:
                    Dn(), le(Fe), le(Ie), os();
                    break;
                case 5:
                    is(r);
                    break;
                case 4:
                    Dn();
                    break;
                case 13:
                    le(ae);
                    break;
                case 19:
                    le(ae);
                    break;
                case 10:
                    ts(r.type._context);
                    break;
                case 22:
                case 23:
                    gs();
            }
            n = n.return;
        }
    if (
        ((Se = e),
        (he = e = Ht(e.current, null)),
        (ke = He = t),
        (ye = 0),
        (Ir = null),
        (ms = Zl = on = 0),
        ($e = dr = null),
        qt !== null)
    ) {
        for (t = 0; t < qt.length; t++)
            if (((n = qt[t]), (r = n.interleaved), r !== null)) {
                n.interleaved = null;
                var l = r.next,
                    i = n.pending;
                if (i !== null) {
                    var o = i.next;
                    (i.next = l), (r.next = o);
                }
                n.pending = r;
            }
        qt = null;
    }
    return e;
}
function Xc(e, t) {
    do {
        var n = he;
        try {
            if ((es(), (cl.current = zl), Ml)) {
                for (var r = ue.memoizedState; r !== null; ) {
                    var l = r.queue;
                    l !== null && (l.pending = null), (r = r.next);
                }
                Ml = !1;
            }
            if (
                ((ln = 0),
                (we = ge = ue = null),
                (ur = !1),
                (Cr = 0),
                (ps.current = null),
                n === null || n.return === null)
            ) {
                (ye = 1), (Ir = t), (he = null);
                break;
            }
            e: {
                var i = e,
                    o = n.return,
                    s = n,
                    a = t;
                if (
                    ((t = ke),
                    (s.flags |= 32768),
                    a !== null &&
                        typeof a == "object" &&
                        typeof a.then == "function")
                ) {
                    var f = a,
                        h = s,
                        m = h.tag;
                    if (!(h.mode & 1) && (m === 0 || m === 11 || m === 15)) {
                        var v = h.alternate;
                        v
                            ? ((h.updateQueue = v.updateQueue),
                              (h.memoizedState = v.memoizedState),
                              (h.lanes = v.lanes))
                            : ((h.updateQueue = null),
                              (h.memoizedState = null));
                    }
                    var _ = wa(o);
                    if (_ !== null) {
                        (_.flags &= -257),
                            Sa(_, o, s, i, t),
                            _.mode & 1 && _a(i, f, t),
                            (t = _),
                            (a = f);
                        var S = t.updateQueue;
                        if (S === null) {
                            var N = new Set();
                            N.add(a), (t.updateQueue = N);
                        } else S.add(a);
                        break e;
                    } else {
                        if (!(t & 1)) {
                            _a(i, f, t), ys();
                            break e;
                        }
                        a = Error(j(426));
                    }
                } else if (se && s.mode & 1) {
                    var K = wa(o);
                    if (K !== null) {
                        !(K.flags & 65536) && (K.flags |= 256),
                            Sa(K, o, s, i, t),
                            qo($n(a, s));
                        break e;
                    }
                }
                (i = a = $n(a, s)),
                    ye !== 4 && (ye = 2),
                    dr === null ? (dr = [i]) : dr.push(i),
                    (i = o);
                do {
                    switch (i.tag) {
                        case 3:
                            (i.flags |= 65536), (t &= -t), (i.lanes |= t);
                            var p = Rc(i, a, t);
                            pa(i, p);
                            break e;
                        case 1:
                            s = a;
                            var d = i.type,
                                c = i.stateNode;
                            if (
                                !(i.flags & 128) &&
                                (typeof d.getDerivedStateFromError ==
                                    "function" ||
                                    (c !== null &&
                                        typeof c.componentDidCatch ==
                                            "function" &&
                                        (Ut === null || !Ut.has(c))))
                            ) {
                                (i.flags |= 65536), (t &= -t), (i.lanes |= t);
                                var g = Mc(i, s, t);
                                pa(i, g);
                                break e;
                            }
                    }
                    i = i.return;
                } while (i !== null);
            }
            qc(n);
        } catch (x) {
            (t = x), he === n && n !== null && (he = n = n.return);
            continue;
        }
        break;
    } while (!0);
}
function Zc() {
    var e = Dl.current;
    return (Dl.current = zl), e === null ? zl : e;
}
function ys() {
    (ye === 0 || ye === 3 || ye === 2) && (ye = 4),
        Se === null || (!(on & 268435455) && !(Zl & 268435455)) || Lt(Se, ke);
}
function Fl(e, t) {
    var n = J;
    J |= 2;
    var r = Zc();
    (Se !== e || ke !== t) && ((vt = null), en(e, t));
    do
        try {
            Fp();
            break;
        } catch (l) {
            Xc(e, l);
        }
    while (!0);
    if ((es(), (J = n), (Dl.current = r), he !== null)) throw Error(j(261));
    return (Se = null), (ke = 0), ye;
}
function Fp() {
    for (; he !== null; ) Jc(he);
}
function Ap() {
    for (; he !== null && !cf(); ) Jc(he);
}
function Jc(e) {
    var t = ed(e.alternate, e, He);
    (e.memoizedProps = e.pendingProps),
        t === null ? qc(e) : (he = t),
        (ps.current = null);
}
function qc(e) {
    var t = e;
    do {
        var n = t.alternate;
        if (((e = t.return), t.flags & 32768)) {
            if (((n = Rp(n, t)), n !== null)) {
                (n.flags &= 32767), (he = n);
                return;
            }
            if (e !== null)
                (e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null);
            else {
                (ye = 6), (he = null);
                return;
            }
        } else if (((n = Lp(n, t, He)), n !== null)) {
            he = n;
            return;
        }
        if (((t = t.sibling), t !== null)) {
            he = t;
            return;
        }
        he = t = e;
    } while (t !== null);
    ye === 0 && (ye = 5);
}
function Zt(e, t, n) {
    var r = b,
        l = qe.transition;
    try {
        (qe.transition = null), (b = 1), Up(e, t, n, r);
    } finally {
        (qe.transition = l), (b = r);
    }
    return null;
}
function Up(e, t, n, r) {
    do Tn();
    while (zt !== null);
    if (J & 6) throw Error(j(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
        throw Error(j(177));
    (e.callbackNode = null), (e.callbackPriority = 0);
    var i = n.lanes | n.childLanes;
    if (
        (wf(e, i),
        e === Se && ((he = Se = null), (ke = 0)),
        (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
            qr ||
            ((qr = !0),
            td(_l, function () {
                return Tn(), null;
            })),
        (i = (n.flags & 15990) !== 0),
        n.subtreeFlags & 15990 || i)
    ) {
        (i = qe.transition), (qe.transition = null);
        var o = b;
        b = 1;
        var s = J;
        (J |= 4),
            (ps.current = null),
            zp(e, n),
            Qc(n, e),
            op(lo),
            (Sl = !!ro),
            (lo = ro = null),
            (e.current = n),
            Dp(n),
            df(),
            (J = s),
            (b = o),
            (qe.transition = i);
    } else e.current = n;
    if (
        (qr && ((qr = !1), (zt = e), (Ol = l)),
        (i = e.pendingLanes),
        i === 0 && (Ut = null),
        mf(n.stateNode),
        Ue(e, fe()),
        t !== null)
    )
        for (r = e.onRecoverableError, n = 0; n < t.length; n++)
            (l = t[n]),
                r(l.value, { componentStack: l.stack, digest: l.digest });
    if ($l) throw (($l = !1), (e = Eo), (Eo = null), e);
    return (
        Ol & 1 && e.tag !== 0 && Tn(),
        (i = e.pendingLanes),
        i & 1 ? (e === Co ? fr++ : ((fr = 0), (Co = e))) : (fr = 0),
        Gt(),
        null
    );
}
function Tn() {
    if (zt !== null) {
        var e = Ru(Ol),
            t = qe.transition,
            n = b;
        try {
            if (((qe.transition = null), (b = 16 > e ? 16 : e), zt === null))
                var r = !1;
            else {
                if (((e = zt), (zt = null), (Ol = 0), J & 6))
                    throw Error(j(331));
                var l = J;
                for (J |= 4, D = e.current; D !== null; ) {
                    var i = D,
                        o = i.child;
                    if (D.flags & 16) {
                        var s = i.deletions;
                        if (s !== null) {
                            for (var a = 0; a < s.length; a++) {
                                var f = s[a];
                                for (D = f; D !== null; ) {
                                    var h = D;
                                    switch (h.tag) {
                                        case 0:
                                        case 11:
                                        case 15:
                                            cr(8, h, i);
                                    }
                                    var m = h.child;
                                    if (m !== null) (m.return = h), (D = m);
                                    else
                                        for (; D !== null; ) {
                                            h = D;
                                            var v = h.sibling,
                                                _ = h.return;
                                            if ((Vc(h), h === f)) {
                                                D = null;
                                                break;
                                            }
                                            if (v !== null) {
                                                (v.return = _), (D = v);
                                                break;
                                            }
                                            D = _;
                                        }
                                }
                            }
                            var S = i.alternate;
                            if (S !== null) {
                                var N = S.child;
                                if (N !== null) {
                                    S.child = null;
                                    do {
                                        var K = N.sibling;
                                        (N.sibling = null), (N = K);
                                    } while (N !== null);
                                }
                            }
                            D = i;
                        }
                    }
                    if (i.subtreeFlags & 2064 && o !== null)
                        (o.return = i), (D = o);
                    else
                        e: for (; D !== null; ) {
                            if (((i = D), i.flags & 2048))
                                switch (i.tag) {
                                    case 0:
                                    case 11:
                                    case 15:
                                        cr(9, i, i.return);
                                }
                            var p = i.sibling;
                            if (p !== null) {
                                (p.return = i.return), (D = p);
                                break e;
                            }
                            D = i.return;
                        }
                }
                var d = e.current;
                for (D = d; D !== null; ) {
                    o = D;
                    var c = o.child;
                    if (o.subtreeFlags & 2064 && c !== null)
                        (c.return = o), (D = c);
                    else
                        e: for (o = d; D !== null; ) {
                            if (((s = D), s.flags & 2048))
                                try {
                                    switch (s.tag) {
                                        case 0:
                                        case 11:
                                        case 15:
                                            Xl(9, s);
                                    }
                                } catch (x) {
                                    de(s, s.return, x);
                                }
                            if (s === o) {
                                D = null;
                                break e;
                            }
                            var g = s.sibling;
                            if (g !== null) {
                                (g.return = s.return), (D = g);
                                break e;
                            }
                            D = s.return;
                        }
                }
                if (
                    ((J = l),
                    Gt(),
                    pt && typeof pt.onPostCommitFiberRoot == "function")
                )
                    try {
                        pt.onPostCommitFiberRoot(Bl, e);
                    } catch {}
                r = !0;
            }
            return r;
        } finally {
            (b = n), (qe.transition = t);
        }
    }
    return !1;
}
function za(e, t, n) {
    (t = $n(n, t)),
        (t = Rc(e, t, 1)),
        (e = At(e, t, 1)),
        (t = Le()),
        e !== null && (Lr(e, 1, t), Ue(e, t));
}
function de(e, t, n) {
    if (e.tag === 3) za(e, e, n);
    else
        for (; t !== null; ) {
            if (t.tag === 3) {
                za(t, e, n);
                break;
            } else if (t.tag === 1) {
                var r = t.stateNode;
                if (
                    typeof t.type.getDerivedStateFromError == "function" ||
                    (typeof r.componentDidCatch == "function" &&
                        (Ut === null || !Ut.has(r)))
                ) {
                    (e = $n(n, e)),
                        (e = Mc(t, e, 1)),
                        (t = At(t, e, 1)),
                        (e = Le()),
                        t !== null && (Lr(t, 1, e), Ue(t, e));
                    break;
                }
            }
            t = t.return;
        }
}
function Bp(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t),
        (t = Le()),
        (e.pingedLanes |= e.suspendedLanes & n),
        Se === e &&
            (ke & n) === n &&
            (ye === 4 ||
            (ye === 3 && (ke & 130023424) === ke && 500 > fe() - hs)
                ? en(e, 0)
                : (ms |= n)),
        Ue(e, t);
}
function bc(e, t) {
    t === 0 &&
        (e.mode & 1
            ? ((t = Hr), (Hr <<= 1), !(Hr & 130023424) && (Hr = 4194304))
            : (t = 1));
    var n = Le();
    (e = kt(e, t)), e !== null && (Lr(e, t, n), Ue(e, n));
}
function Hp(e) {
    var t = e.memoizedState,
        n = 0;
    t !== null && (n = t.retryLane), bc(e, n);
}
function Vp(e, t) {
    var n = 0;
    switch (e.tag) {
        case 13:
            var r = e.stateNode,
                l = e.memoizedState;
            l !== null && (n = l.retryLane);
            break;
        case 19:
            r = e.stateNode;
            break;
        default:
            throw Error(j(314));
    }
    r !== null && r.delete(t), bc(e, n);
}
var ed;
ed = function (e, t, n) {
    if (e !== null)
        if (e.memoizedProps !== t.pendingProps || Fe.current) Oe = !0;
        else {
            if (!(e.lanes & n) && !(t.flags & 128))
                return (Oe = !1), Tp(e, t, n);
            Oe = !!(e.flags & 131072);
        }
    else (Oe = !1), se && t.flags & 1048576 && lc(t, Pl, t.index);
    switch (((t.lanes = 0), t.tag)) {
        case 2:
            var r = t.type;
            fl(e, t), (e = t.pendingProps);
            var l = Rn(t, Ie.current);
            In(t, n), (l = as(null, t, r, e, l, n));
            var i = us();
            return (
                (t.flags |= 1),
                typeof l == "object" &&
                l !== null &&
                typeof l.render == "function" &&
                l.$$typeof === void 0
                    ? ((t.tag = 1),
                      (t.memoizedState = null),
                      (t.updateQueue = null),
                      Ae(r) ? ((i = !0), Cl(t)) : (i = !1),
                      (t.memoizedState =
                          l.state !== null && l.state !== void 0
                              ? l.state
                              : null),
                      rs(t),
                      (l.updater = Yl),
                      (t.stateNode = l),
                      (l._reactInternals = t),
                      mo(t, r, e, n),
                      (t = go(null, t, r, !0, i, n)))
                    : ((t.tag = 0),
                      se && i && Zo(t),
                      Te(null, t, l, n),
                      (t = t.child)),
                t
            );
        case 16:
            r = t.elementType;
            e: {
                switch (
                    (fl(e, t),
                    (e = t.pendingProps),
                    (l = r._init),
                    (r = l(r._payload)),
                    (t.type = r),
                    (l = t.tag = Kp(r)),
                    (e = nt(r, e)),
                    l)
                ) {
                    case 0:
                        t = vo(null, t, r, e, n);
                        break e;
                    case 1:
                        t = Na(null, t, r, e, n);
                        break e;
                    case 11:
                        t = xa(null, t, r, e, n);
                        break e;
                    case 14:
                        t = ka(null, t, r, nt(r.type, e), n);
                        break e;
                }
                throw Error(j(306, r, ""));
            }
            return t;
        case 0:
            return (
                (r = t.type),
                (l = t.pendingProps),
                (l = t.elementType === r ? l : nt(r, l)),
                vo(e, t, r, l, n)
            );
        case 1:
            return (
                (r = t.type),
                (l = t.pendingProps),
                (l = t.elementType === r ? l : nt(r, l)),
                Na(e, t, r, l, n)
            );
        case 3:
            e: {
                if ((Oc(t), e === null)) throw Error(j(387));
                (r = t.pendingProps),
                    (i = t.memoizedState),
                    (l = i.element),
                    cc(e, t),
                    Ll(t, r, null, n);
                var o = t.memoizedState;
                if (((r = o.element), i.isDehydrated))
                    if (
                        ((i = {
                            element: r,
                            isDehydrated: !1,
                            cache: o.cache,
                            pendingSuspenseBoundaries:
                                o.pendingSuspenseBoundaries,
                            transitions: o.transitions,
                        }),
                        (t.updateQueue.baseState = i),
                        (t.memoizedState = i),
                        t.flags & 256)
                    ) {
                        (l = $n(Error(j(423)), t)), (t = Ea(e, t, r, n, l));
                        break e;
                    } else if (r !== l) {
                        (l = $n(Error(j(424)), t)), (t = Ea(e, t, r, n, l));
                        break e;
                    } else
                        for (
                            Ve = Ft(t.stateNode.containerInfo.firstChild),
                                We = t,
                                se = !0,
                                lt = null,
                                n = ac(t, null, r, n),
                                t.child = n;
                            n;

                        )
                            (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
                else {
                    if ((Mn(), r === l)) {
                        t = Nt(e, t, n);
                        break e;
                    }
                    Te(e, t, r, n);
                }
                t = t.child;
            }
            return t;
        case 5:
            return (
                dc(t),
                e === null && co(t),
                (r = t.type),
                (l = t.pendingProps),
                (i = e !== null ? e.memoizedProps : null),
                (o = l.children),
                io(r, l)
                    ? (o = null)
                    : i !== null && io(r, i) && (t.flags |= 32),
                $c(e, t),
                Te(e, t, o, n),
                t.child
            );
        case 6:
            return e === null && co(t), null;
        case 13:
            return Fc(e, t, n);
        case 4:
            return (
                ls(t, t.stateNode.containerInfo),
                (r = t.pendingProps),
                e === null ? (t.child = zn(t, null, r, n)) : Te(e, t, r, n),
                t.child
            );
        case 11:
            return (
                (r = t.type),
                (l = t.pendingProps),
                (l = t.elementType === r ? l : nt(r, l)),
                xa(e, t, r, l, n)
            );
        case 7:
            return Te(e, t, t.pendingProps, n), t.child;
        case 8:
            return Te(e, t, t.pendingProps.children, n), t.child;
        case 12:
            return Te(e, t, t.pendingProps.children, n), t.child;
        case 10:
            e: {
                if (
                    ((r = t.type._context),
                    (l = t.pendingProps),
                    (i = t.memoizedProps),
                    (o = l.value),
                    te(Il, r._currentValue),
                    (r._currentValue = o),
                    i !== null)
                )
                    if (st(i.value, o)) {
                        if (i.children === l.children && !Fe.current) {
                            t = Nt(e, t, n);
                            break e;
                        }
                    } else
                        for (
                            i = t.child, i !== null && (i.return = t);
                            i !== null;

                        ) {
                            var s = i.dependencies;
                            if (s !== null) {
                                o = i.child;
                                for (var a = s.firstContext; a !== null; ) {
                                    if (a.context === r) {
                                        if (i.tag === 1) {
                                            (a = wt(-1, n & -n)), (a.tag = 2);
                                            var f = i.updateQueue;
                                            if (f !== null) {
                                                f = f.shared;
                                                var h = f.pending;
                                                h === null
                                                    ? (a.next = a)
                                                    : ((a.next = h.next),
                                                      (h.next = a)),
                                                    (f.pending = a);
                                            }
                                        }
                                        (i.lanes |= n),
                                            (a = i.alternate),
                                            a !== null && (a.lanes |= n),
                                            fo(i.return, n, t),
                                            (s.lanes |= n);
                                        break;
                                    }
                                    a = a.next;
                                }
                            } else if (i.tag === 10)
                                o = i.type === t.type ? null : i.child;
                            else if (i.tag === 18) {
                                if (((o = i.return), o === null))
                                    throw Error(j(341));
                                (o.lanes |= n),
                                    (s = o.alternate),
                                    s !== null && (s.lanes |= n),
                                    fo(o, n, t),
                                    (o = i.sibling);
                            } else o = i.child;
                            if (o !== null) o.return = i;
                            else
                                for (o = i; o !== null; ) {
                                    if (o === t) {
                                        o = null;
                                        break;
                                    }
                                    if (((i = o.sibling), i !== null)) {
                                        (i.return = o.return), (o = i);
                                        break;
                                    }
                                    o = o.return;
                                }
                            i = o;
                        }
                Te(e, t, l.children, n), (t = t.child);
            }
            return t;
        case 9:
            return (
                (l = t.type),
                (r = t.pendingProps.children),
                In(t, n),
                (l = be(l)),
                (r = r(l)),
                (t.flags |= 1),
                Te(e, t, r, n),
                t.child
            );
        case 14:
            return (
                (r = t.type),
                (l = nt(r, t.pendingProps)),
                (l = nt(r.type, l)),
                ka(e, t, r, l, n)
            );
        case 15:
            return zc(e, t, t.type, t.pendingProps, n);
        case 17:
            return (
                (r = t.type),
                (l = t.pendingProps),
                (l = t.elementType === r ? l : nt(r, l)),
                fl(e, t),
                (t.tag = 1),
                Ae(r) ? ((e = !0), Cl(t)) : (e = !1),
                In(t, n),
                Lc(t, r, l),
                mo(t, r, l, n),
                go(null, t, r, !0, e, n)
            );
        case 19:
            return Ac(e, t, n);
        case 22:
            return Dc(e, t, n);
    }
    throw Error(j(156, t.tag));
};
function td(e, t) {
    return Pu(e, t);
}
function Wp(e, t, n, r) {
    (this.tag = e),
        (this.key = n),
        (this.sibling =
            this.child =
            this.return =
            this.stateNode =
            this.type =
            this.elementType =
                null),
        (this.index = 0),
        (this.ref = null),
        (this.pendingProps = t),
        (this.dependencies =
            this.memoizedState =
            this.updateQueue =
            this.memoizedProps =
                null),
        (this.mode = r),
        (this.subtreeFlags = this.flags = 0),
        (this.deletions = null),
        (this.childLanes = this.lanes = 0),
        (this.alternate = null);
}
function Je(e, t, n, r) {
    return new Wp(e, t, n, r);
}
function _s(e) {
    return (e = e.prototype), !(!e || !e.isReactComponent);
}
function Kp(e) {
    if (typeof e == "function") return _s(e) ? 1 : 0;
    if (e != null) {
        if (((e = e.$$typeof), e === Fo)) return 11;
        if (e === Ao) return 14;
    }
    return 2;
}
function Ht(e, t) {
    var n = e.alternate;
    return (
        n === null
            ? ((n = Je(e.tag, t, e.key, e.mode)),
              (n.elementType = e.elementType),
              (n.type = e.type),
              (n.stateNode = e.stateNode),
              (n.alternate = e),
              (e.alternate = n))
            : ((n.pendingProps = t),
              (n.type = e.type),
              (n.flags = 0),
              (n.subtreeFlags = 0),
              (n.deletions = null)),
        (n.flags = e.flags & 14680064),
        (n.childLanes = e.childLanes),
        (n.lanes = e.lanes),
        (n.child = e.child),
        (n.memoizedProps = e.memoizedProps),
        (n.memoizedState = e.memoizedState),
        (n.updateQueue = e.updateQueue),
        (t = e.dependencies),
        (n.dependencies =
            t === null
                ? null
                : { lanes: t.lanes, firstContext: t.firstContext }),
        (n.sibling = e.sibling),
        (n.index = e.index),
        (n.ref = e.ref),
        n
    );
}
function hl(e, t, n, r, l, i) {
    var o = 2;
    if (((r = e), typeof e == "function")) _s(e) && (o = 1);
    else if (typeof e == "string") o = 5;
    else
        e: switch (e) {
            case pn:
                return tn(n.children, l, i, t);
            case Oo:
                (o = 8), (l |= 8);
                break;
            case Oi:
                return (
                    (e = Je(12, n, t, l | 2)),
                    (e.elementType = Oi),
                    (e.lanes = i),
                    e
                );
            case Fi:
                return (
                    (e = Je(13, n, t, l)),
                    (e.elementType = Fi),
                    (e.lanes = i),
                    e
                );
            case Ai:
                return (
                    (e = Je(19, n, t, l)),
                    (e.elementType = Ai),
                    (e.lanes = i),
                    e
                );
            case du:
                return Jl(n, l, i, t);
            default:
                if (typeof e == "object" && e !== null)
                    switch (e.$$typeof) {
                        case uu:
                            o = 10;
                            break e;
                        case cu:
                            o = 9;
                            break e;
                        case Fo:
                            o = 11;
                            break e;
                        case Ao:
                            o = 14;
                            break e;
                        case Pt:
                            (o = 16), (r = null);
                            break e;
                    }
                throw Error(j(130, e == null ? e : typeof e, ""));
        }
    return (
        (t = Je(o, n, t, l)),
        (t.elementType = e),
        (t.type = r),
        (t.lanes = i),
        t
    );
}
function tn(e, t, n, r) {
    return (e = Je(7, e, r, t)), (e.lanes = n), e;
}
function Jl(e, t, n, r) {
    return (
        (e = Je(22, e, r, t)),
        (e.elementType = du),
        (e.lanes = n),
        (e.stateNode = { isHidden: !1 }),
        e
    );
}
function Pi(e, t, n) {
    return (e = Je(6, e, null, t)), (e.lanes = n), e;
}
function Ii(e, t, n) {
    return (
        (t = Je(4, e.children !== null ? e.children : [], e.key, t)),
        (t.lanes = n),
        (t.stateNode = {
            containerInfo: e.containerInfo,
            pendingChildren: null,
            implementation: e.implementation,
        }),
        t
    );
}
function Qp(e, t, n, r, l) {
    (this.tag = t),
        (this.containerInfo = e),
        (this.finishedWork =
            this.pingCache =
            this.current =
            this.pendingChildren =
                null),
        (this.timeoutHandle = -1),
        (this.callbackNode = this.pendingContext = this.context = null),
        (this.callbackPriority = 0),
        (this.eventTimes = ui(0)),
        (this.expirationTimes = ui(-1)),
        (this.entangledLanes =
            this.finishedLanes =
            this.mutableReadLanes =
            this.expiredLanes =
            this.pingedLanes =
            this.suspendedLanes =
            this.pendingLanes =
                0),
        (this.entanglements = ui(0)),
        (this.identifierPrefix = r),
        (this.onRecoverableError = l),
        (this.mutableSourceEagerHydrationData = null);
}
function ws(e, t, n, r, l, i, o, s, a) {
    return (
        (e = new Qp(e, t, n, s, a)),
        t === 1 ? ((t = 1), i === !0 && (t |= 8)) : (t = 0),
        (i = Je(3, null, null, t)),
        (e.current = i),
        (i.stateNode = e),
        (i.memoizedState = {
            element: r,
            isDehydrated: n,
            cache: null,
            transitions: null,
            pendingSuspenseBoundaries: null,
        }),
        rs(i),
        e
    );
}
function Gp(e, t, n) {
    var r =
        3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
        $$typeof: fn,
        key: r == null ? null : "" + r,
        children: e,
        containerInfo: t,
        implementation: n,
    };
}
function nd(e) {
    if (!e) return Wt;
    e = e._reactInternals;
    e: {
        if (un(e) !== e || e.tag !== 1) throw Error(j(170));
        var t = e;
        do {
            switch (t.tag) {
                case 3:
                    t = t.stateNode.context;
                    break e;
                case 1:
                    if (Ae(t.type)) {
                        t =
                            t.stateNode
                                .__reactInternalMemoizedMergedChildContext;
                        break e;
                    }
            }
            t = t.return;
        } while (t !== null);
        throw Error(j(171));
    }
    if (e.tag === 1) {
        var n = e.type;
        if (Ae(n)) return nc(e, n, t);
    }
    return t;
}
function rd(e, t, n, r, l, i, o, s, a) {
    return (
        (e = ws(n, r, !0, e, l, i, o, s, a)),
        (e.context = nd(null)),
        (n = e.current),
        (r = Le()),
        (l = Bt(n)),
        (i = wt(r, l)),
        (i.callback = t ?? null),
        At(n, i, l),
        (e.current.lanes = l),
        Lr(e, l, r),
        Ue(e, r),
        e
    );
}
function ql(e, t, n, r) {
    var l = t.current,
        i = Le(),
        o = Bt(l);
    return (
        (n = nd(n)),
        t.context === null ? (t.context = n) : (t.pendingContext = n),
        (t = wt(i, o)),
        (t.payload = { element: e }),
        (r = r === void 0 ? null : r),
        r !== null && (t.callback = r),
        (e = At(l, t, o)),
        e !== null && (ot(e, l, o, i), ul(e, l, o)),
        o
    );
}
function Al(e) {
    if (((e = e.current), !e.child)) return null;
    switch (e.child.tag) {
        case 5:
            return e.child.stateNode;
        default:
            return e.child.stateNode;
    }
}
function Da(e, t) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
        var n = e.retryLane;
        e.retryLane = n !== 0 && n < t ? n : t;
    }
}
function Ss(e, t) {
    Da(e, t), (e = e.alternate) && Da(e, t);
}
function Yp() {
    return null;
}
var ld =
    typeof reportError == "function"
        ? reportError
        : function (e) {
              console.error(e);
          };
function xs(e) {
    this._internalRoot = e;
}
bl.prototype.render = xs.prototype.render = function (e) {
    var t = this._internalRoot;
    if (t === null) throw Error(j(409));
    ql(e, t, null, null);
};
bl.prototype.unmount = xs.prototype.unmount = function () {
    var e = this._internalRoot;
    if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        sn(function () {
            ql(null, e, null, null);
        }),
            (t[xt] = null);
    }
};
function bl(e) {
    this._internalRoot = e;
}
bl.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
        var t = Du();
        e = { blockedOn: null, target: e, priority: t };
        for (var n = 0; n < Tt.length && t !== 0 && t < Tt[n].priority; n++);
        Tt.splice(n, 0, e), n === 0 && Ou(e);
    }
};
function ks(e) {
    return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function ei(e) {
    return !(
        !e ||
        (e.nodeType !== 1 &&
            e.nodeType !== 9 &&
            e.nodeType !== 11 &&
            (e.nodeType !== 8 ||
                e.nodeValue !== " react-mount-point-unstable "))
    );
}
function $a() {}
function Xp(e, t, n, r, l) {
    if (l) {
        if (typeof r == "function") {
            var i = r;
            r = function () {
                var f = Al(o);
                i.call(f);
            };
        }
        var o = rd(t, r, e, 0, null, !1, !1, "", $a);
        return (
            (e._reactRootContainer = o),
            (e[xt] = o.current),
            Sr(e.nodeType === 8 ? e.parentNode : e),
            sn(),
            o
        );
    }
    for (; (l = e.lastChild); ) e.removeChild(l);
    if (typeof r == "function") {
        var s = r;
        r = function () {
            var f = Al(a);
            s.call(f);
        };
    }
    var a = ws(e, 0, !1, null, null, !1, !1, "", $a);
    return (
        (e._reactRootContainer = a),
        (e[xt] = a.current),
        Sr(e.nodeType === 8 ? e.parentNode : e),
        sn(function () {
            ql(t, a, n, r);
        }),
        a
    );
}
function ti(e, t, n, r, l) {
    var i = n._reactRootContainer;
    if (i) {
        var o = i;
        if (typeof l == "function") {
            var s = l;
            l = function () {
                var a = Al(o);
                s.call(a);
            };
        }
        ql(t, o, e, l);
    } else o = Xp(n, t, e, l, r);
    return Al(o);
}
Mu = function (e) {
    switch (e.tag) {
        case 3:
            var t = e.stateNode;
            if (t.current.memoizedState.isDehydrated) {
                var n = nr(t.pendingLanes);
                n !== 0 &&
                    (Ho(t, n | 1),
                    Ue(t, fe()),
                    !(J & 6) && ((On = fe() + 500), Gt()));
            }
            break;
        case 13:
            sn(function () {
                var r = kt(e, 1);
                if (r !== null) {
                    var l = Le();
                    ot(r, e, 1, l);
                }
            }),
                Ss(e, 1);
    }
};
Vo = function (e) {
    if (e.tag === 13) {
        var t = kt(e, 134217728);
        if (t !== null) {
            var n = Le();
            ot(t, e, 134217728, n);
        }
        Ss(e, 134217728);
    }
};
zu = function (e) {
    if (e.tag === 13) {
        var t = Bt(e),
            n = kt(e, t);
        if (n !== null) {
            var r = Le();
            ot(n, e, t, r);
        }
        Ss(e, t);
    }
};
Du = function () {
    return b;
};
$u = function (e, t) {
    var n = b;
    try {
        return (b = e), t();
    } finally {
        b = n;
    }
};
Xi = function (e, t, n) {
    switch (t) {
        case "input":
            if ((Hi(e, n), (t = n.name), n.type === "radio" && t != null)) {
                for (n = e; n.parentNode; ) n = n.parentNode;
                for (
                    n = n.querySelectorAll(
                        "input[name=" +
                            JSON.stringify("" + t) +
                            '][type="radio"]'
                    ),
                        t = 0;
                    t < n.length;
                    t++
                ) {
                    var r = n[t];
                    if (r !== e && r.form === e.form) {
                        var l = Kl(r);
                        if (!l) throw Error(j(90));
                        pu(r), Hi(r, l);
                    }
                }
            }
            break;
        case "textarea":
            hu(e, n);
            break;
        case "select":
            (t = n.value), t != null && En(e, !!n.multiple, t, !1);
    }
};
xu = vs;
ku = sn;
var Zp = { usingClientEntryPoint: !1, Events: [Mr, gn, Kl, wu, Su, vs] },
    qn = {
        findFiberByHostInstance: Jt,
        bundleType: 0,
        version: "18.3.1",
        rendererPackageName: "react-dom",
    },
    Jp = {
        bundleType: qn.bundleType,
        version: qn.version,
        rendererPackageName: qn.rendererPackageName,
        rendererConfig: qn.rendererConfig,
        overrideHookState: null,
        overrideHookStateDeletePath: null,
        overrideHookStateRenamePath: null,
        overrideProps: null,
        overridePropsDeletePath: null,
        overridePropsRenamePath: null,
        setErrorHandler: null,
        setSuspenseHandler: null,
        scheduleUpdate: null,
        currentDispatcherRef: Et.ReactCurrentDispatcher,
        findHostInstanceByFiber: function (e) {
            return (e = Cu(e)), e === null ? null : e.stateNode;
        },
        findFiberByHostInstance: qn.findFiberByHostInstance || Yp,
        findHostInstancesForRefresh: null,
        scheduleRefresh: null,
        scheduleRoot: null,
        setRefreshHandler: null,
        getCurrentFiber: null,
        reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
    };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var br = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!br.isDisabled && br.supportsFiber)
        try {
            (Bl = br.inject(Jp)), (pt = br);
        } catch {}
}
Qe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Zp;
Qe.createPortal = function (e, t) {
    var n =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!ks(t)) throw Error(j(200));
    return Gp(e, t, null, n);
};
Qe.createRoot = function (e, t) {
    if (!ks(e)) throw Error(j(299));
    var n = !1,
        r = "",
        l = ld;
    return (
        t != null &&
            (t.unstable_strictMode === !0 && (n = !0),
            t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
            t.onRecoverableError !== void 0 && (l = t.onRecoverableError)),
        (t = ws(e, 1, !1, null, null, n, !1, r, l)),
        (e[xt] = t.current),
        Sr(e.nodeType === 8 ? e.parentNode : e),
        new xs(t)
    );
};
Qe.findDOMNode = function (e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
        throw typeof e.render == "function"
            ? Error(j(188))
            : ((e = Object.keys(e).join(",")), Error(j(268, e)));
    return (e = Cu(t)), (e = e === null ? null : e.stateNode), e;
};
Qe.flushSync = function (e) {
    return sn(e);
};
Qe.hydrate = function (e, t, n) {
    if (!ei(t)) throw Error(j(200));
    return ti(null, e, t, !0, n);
};
Qe.hydrateRoot = function (e, t, n) {
    if (!ks(e)) throw Error(j(405));
    var r = (n != null && n.hydratedSources) || null,
        l = !1,
        i = "",
        o = ld;
    if (
        (n != null &&
            (n.unstable_strictMode === !0 && (l = !0),
            n.identifierPrefix !== void 0 && (i = n.identifierPrefix),
            n.onRecoverableError !== void 0 && (o = n.onRecoverableError)),
        (t = rd(t, null, e, 1, n ?? null, l, !1, i, o)),
        (e[xt] = t.current),
        Sr(e),
        r)
    )
        for (e = 0; e < r.length; e++)
            (n = r[e]),
                (l = n._getVersion),
                (l = l(n._source)),
                t.mutableSourceEagerHydrationData == null
                    ? (t.mutableSourceEagerHydrationData = [n, l])
                    : t.mutableSourceEagerHydrationData.push(n, l);
    return new bl(t);
};
Qe.render = function (e, t, n) {
    if (!ei(t)) throw Error(j(200));
    return ti(null, e, t, !1, n);
};
Qe.unmountComponentAtNode = function (e) {
    if (!ei(e)) throw Error(j(40));
    return e._reactRootContainer
        ? (sn(function () {
              ti(null, null, e, !1, function () {
                  (e._reactRootContainer = null), (e[xt] = null);
              });
          }),
          !0)
        : !1;
};
Qe.unstable_batchedUpdates = vs;
Qe.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
    if (!ei(n)) throw Error(j(200));
    if (e == null || e._reactInternals === void 0) throw Error(j(38));
    return ti(e, t, n, !1, r);
};
Qe.version = "18.3.1-next-f1338f8080-20240426";
function id() {
    if (
        !(
            typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
            typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
        )
    )
        try {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(id);
        } catch (e) {
            console.error(e);
        }
}
id(), (iu.exports = Qe);
var qp = iu.exports,
    Oa = qp;
(Di.createRoot = Oa.createRoot), (Di.hydrateRoot = Oa.hydrateRoot);
function bp(e, t, n, r) {
    function l(i) {
        return i instanceof n
            ? i
            : new n(function (o) {
                  o(i);
              });
    }
    return new (n || (n = Promise))(function (i, o) {
        function s(h) {
            try {
                f(r.next(h));
            } catch (m) {
                o(m);
            }
        }
        function a(h) {
            try {
                f(r.throw(h));
            } catch (m) {
                o(m);
            }
        }
        function f(h) {
            h.done ? i(h.value) : l(h.value).then(s, a);
        }
        f((r = r.apply(e, [])).next());
    });
}
function em(e) {
    return e &&
        e.__esModule &&
        Object.prototype.hasOwnProperty.call(e, "default")
        ? e.default
        : e;
}
var Ti, Fa;
function tm() {
    return (
        Fa ||
            ((Fa = 1),
            (Ti = function e(t, n) {
                if (t === n) return !0;
                if (t && n && typeof t == "object" && typeof n == "object") {
                    if (t.constructor !== n.constructor) return !1;
                    var r, l, i;
                    if (Array.isArray(t)) {
                        if (((r = t.length), r != n.length)) return !1;
                        for (l = r; l-- !== 0; ) if (!e(t[l], n[l])) return !1;
                        return !0;
                    }
                    if (t.constructor === RegExp)
                        return t.source === n.source && t.flags === n.flags;
                    if (t.valueOf !== Object.prototype.valueOf)
                        return t.valueOf() === n.valueOf();
                    if (t.toString !== Object.prototype.toString)
                        return t.toString() === n.toString();
                    if (
                        ((i = Object.keys(t)),
                        (r = i.length),
                        r !== Object.keys(n).length)
                    )
                        return !1;
                    for (l = r; l-- !== 0; )
                        if (!Object.prototype.hasOwnProperty.call(n, i[l]))
                            return !1;
                    for (l = r; l-- !== 0; ) {
                        var o = i[l];
                        if (!e(t[o], n[o])) return !1;
                    }
                    return !0;
                }
                return t !== t && n !== n;
            })),
        Ti
    );
}
var nm = tm(),
    rm = em(nm);
const Aa = "__googleMapsScriptId";
var Nn;
(function (e) {
    (e[(e.INITIALIZED = 0)] = "INITIALIZED"),
        (e[(e.LOADING = 1)] = "LOADING"),
        (e[(e.SUCCESS = 2)] = "SUCCESS"),
        (e[(e.FAILURE = 3)] = "FAILURE");
})(Nn || (Nn = {}));
class Rt {
    constructor({
        apiKey: t,
        authReferrerPolicy: n,
        channel: r,
        client: l,
        id: i = Aa,
        language: o,
        libraries: s = [],
        mapIds: a,
        nonce: f,
        region: h,
        retries: m = 3,
        url: v = "https://maps.googleapis.com/maps/api/js",
        version: _,
    }) {
        if (
            ((this.callbacks = []),
            (this.done = !1),
            (this.loading = !1),
            (this.errors = []),
            (this.apiKey = t),
            (this.authReferrerPolicy = n),
            (this.channel = r),
            (this.client = l),
            (this.id = i || Aa),
            (this.language = o),
            (this.libraries = s),
            (this.mapIds = a),
            (this.nonce = f),
            (this.region = h),
            (this.retries = m),
            (this.url = v),
            (this.version = _),
            Rt.instance)
        ) {
            if (!rm(this.options, Rt.instance.options))
                throw new Error(
                    `Loader must not be called again with different options. ${JSON.stringify(
                        this.options
                    )} !== ${JSON.stringify(Rt.instance.options)}`
                );
            return Rt.instance;
        }
        Rt.instance = this;
    }
    get options() {
        return {
            version: this.version,
            apiKey: this.apiKey,
            channel: this.channel,
            client: this.client,
            id: this.id,
            libraries: this.libraries,
            language: this.language,
            region: this.region,
            mapIds: this.mapIds,
            nonce: this.nonce,
            url: this.url,
            authReferrerPolicy: this.authReferrerPolicy,
        };
    }
    get status() {
        return this.errors.length
            ? Nn.FAILURE
            : this.done
            ? Nn.SUCCESS
            : this.loading
            ? Nn.LOADING
            : Nn.INITIALIZED;
    }
    get failed() {
        return (
            this.done && !this.loading && this.errors.length >= this.retries + 1
        );
    }
    createUrl() {
        let t = this.url;
        return (
            (t += "?callback=__googleMapsCallback&loading=async"),
            this.apiKey && (t += `&key=${this.apiKey}`),
            this.channel && (t += `&channel=${this.channel}`),
            this.client && (t += `&client=${this.client}`),
            this.libraries.length > 0 &&
                (t += `&libraries=${this.libraries.join(",")}`),
            this.language && (t += `&language=${this.language}`),
            this.region && (t += `&region=${this.region}`),
            this.version && (t += `&v=${this.version}`),
            this.mapIds && (t += `&map_ids=${this.mapIds.join(",")}`),
            this.authReferrerPolicy &&
                (t += `&auth_referrer_policy=${this.authReferrerPolicy}`),
            t
        );
    }
    deleteScript() {
        const t = document.getElementById(this.id);
        t && t.remove();
    }
    load() {
        return this.loadPromise();
    }
    loadPromise() {
        return new Promise((t, n) => {
            this.loadCallback((r) => {
                r ? n(r.error) : t(window.google);
            });
        });
    }
    importLibrary(t) {
        return this.execute(), google.maps.importLibrary(t);
    }
    loadCallback(t) {
        this.callbacks.push(t), this.execute();
    }
    setScript() {
        var t, n;
        if (document.getElementById(this.id)) {
            this.callback();
            return;
        }
        const r = {
            key: this.apiKey,
            channel: this.channel,
            client: this.client,
            libraries: this.libraries.length && this.libraries,
            v: this.version,
            mapIds: this.mapIds,
            language: this.language,
            region: this.region,
            authReferrerPolicy: this.authReferrerPolicy,
        };
        Object.keys(r).forEach((i) => !r[i] && delete r[i]),
            (!(
                (n =
                    (t = window == null ? void 0 : window.google) === null ||
                    t === void 0
                        ? void 0
                        : t.maps) === null || n === void 0
            ) &&
                n.importLibrary) ||
                ((i) => {
                    let o,
                        s,
                        a,
                        f = "The Google Maps JavaScript API",
                        h = "google",
                        m = "importLibrary",
                        v = "__ib__",
                        _ = document,
                        S = window;
                    S = S[h] || (S[h] = {});
                    const N = S.maps || (S.maps = {}),
                        K = new Set(),
                        p = new URLSearchParams(),
                        d = () =>
                            o ||
                            (o = new Promise((c, g) =>
                                bp(this, void 0, void 0, function* () {
                                    var x;
                                    yield (s = _.createElement("script")),
                                        (s.id = this.id),
                                        p.set("libraries", [...K] + "");
                                    for (a in i)
                                        p.set(
                                            a.replace(
                                                /[A-Z]/g,
                                                (E) => "_" + E[0].toLowerCase()
                                            ),
                                            i[a]
                                        );
                                    p.set("callback", h + ".maps." + v),
                                        (s.src = this.url + "?" + p),
                                        (N[v] = c),
                                        (s.onerror = () =>
                                            (o = g(
                                                Error(f + " could not load.")
                                            ))),
                                        (s.nonce =
                                            this.nonce ||
                                            ((x =
                                                _.querySelector(
                                                    "script[nonce]"
                                                )) === null || x === void 0
                                                ? void 0
                                                : x.nonce) ||
                                            ""),
                                        _.head.append(s);
                                })
                            ));
                    N[m]
                        ? console.warn(f + " only loads once. Ignoring:", i)
                        : (N[m] = (c, ...g) =>
                              K.add(c) && d().then(() => N[m](c, ...g)));
                })(r);
        const l = this.libraries.map((i) => this.importLibrary(i));
        l.length || l.push(this.importLibrary("core")),
            Promise.all(l).then(
                () => this.callback(),
                (i) => {
                    const o = new ErrorEvent("error", { error: i });
                    this.loadErrorCallback(o);
                }
            );
    }
    reset() {
        this.deleteScript(),
            (this.done = !1),
            (this.loading = !1),
            (this.errors = []),
            (this.onerrorEvent = null);
    }
    resetIfRetryingFailed() {
        this.failed && this.reset();
    }
    loadErrorCallback(t) {
        if ((this.errors.push(t), this.errors.length <= this.retries)) {
            const n = this.errors.length * Math.pow(2, this.errors.length);
            console.error(
                `Failed to load Google Maps script, retrying in ${n} ms.`
            ),
                setTimeout(() => {
                    this.deleteScript(), this.setScript();
                }, n);
        } else (this.onerrorEvent = t), this.callback();
    }
    callback() {
        (this.done = !0),
            (this.loading = !1),
            this.callbacks.forEach((t) => {
                t(this.onerrorEvent);
            }),
            (this.callbacks = []);
    }
    execute() {
        if ((this.resetIfRetryingFailed(), !this.loading))
            if (this.done) this.callback();
            else {
                if (
                    window.google &&
                    window.google.maps &&
                    window.google.maps.version
                ) {
                    console.warn(
                        "Google Maps already loaded outside @googlemaps/js-api-loader. This may result in undesirable behavior as options and script parameters may not match."
                    ),
                        this.callback();
                    return;
                }
                (this.loading = !0), this.setScript();
            }
    }
}
const Li = { lat: 49.2796, lng: -122.9199 },
    Ua = "_",
    lm = "DEMO_MAP_ID";
function im({ plan: e }) {
    const t = k.useRef(null),
        n = k.useRef(null),
        r = k.useRef([]),
        l = k.useRef(new Map()),
        i = k.useRef(null),
        o = k.useRef(null),
        s = k.useRef(null),
        [a, f] = k.useState(null),
        [h, m] = k.useState(Ua),
        [v, _] = k.useState(!Ua);
    k.useEffect(() => {
        {
            _(!1);
            return;
        }
    }, []);
    const S = k.useMemo(
        () =>
            h
                ? new Rt({
                      apiKey: h,
                      version: "weekly",
                      libraries: ["places", "marker"],
                  })
                : null,
        [h]
    );
    if (
        (k.useEffect(() => {
            if (!t.current || !S) return;
            let d = !1;
            return (
                S.load()
                    .then((c) => {
                        if (d || !t.current) return;
                        f(null);
                        const g = {
                            center: Li,
                            zoom: 12,
                            streetViewControl: !1,
                            fullscreenControl: !1,
                            mapTypeControl: !1,
                        };
                        (g.mapId = lm),
                            (n.current = new c.maps.Map(t.current, g)),
                            (i.current = new c.maps.InfoWindow());
                    })
                    .catch((c) =>
                        f(
                            c instanceof Error
                                ? c.message
                                : "Failed to load Maps SDK"
                        )
                    ),
                () => {
                    d = !0;
                }
            );
        }, [S]),
        k.useEffect(() => {
            if (((s.current = (e == null ? void 0 : e.id) ?? null), !e)) {
                N(), K();
                return;
            }
            if (!S || !n.current) return;
            let d = !0;
            return (
                S.load().then((c) => {
                    if (!d) return;
                    const g = n.current;
                    if (!g) return;
                    const x = new c.maps.Geocoder(),
                        E = e.stops.slice(0, 6);
                    f(null),
                        Promise.all(E.map((w) => om(w, x, l.current)))
                            .then((w) => {
                                if (!d) return;
                                N();
                                const R = new c.maps.LatLngBounds();
                                if (
                                    (w.forEach((O, C) => {
                                        if (!O) return;
                                        R.extend(O.position);
                                        const F = um(
                                            g,
                                            O.position,
                                            O.label,
                                            C + 1
                                        );
                                        F.addListener("click", () => {
                                            if (!i.current) return;
                                            const G = Ba(O.label),
                                                ee = O.description
                                                    ? `<p>${Ba(
                                                          O.description
                                                      )}</p>`
                                                    : "";
                                            i.current.setContent(
                                                `<div class="map__info-window"><strong>${G}</strong>${ee}</div>`
                                            ),
                                                i.current.open({
                                                    map: g,
                                                    anchor: F,
                                                });
                                        }),
                                            r.current.push(F);
                                    }),
                                    !r.current.length)
                                )
                                    g.setCenter(Li), g.setZoom(11);
                                else if (r.current.length === 1) {
                                    const O = cm(r.current[0]) ?? Li;
                                    g.setCenter(O), g.setZoom(13);
                                } else g.fitBounds(R, 48);
                                p(e.id, c);
                            })
                            .catch(() => {
                                d &&
                                    f(
                                        "Unable to plot stops on the map right now."
                                    );
                            });
                }),
                () => {
                    d = !1;
                }
            );
        }, [e, S]),
        !h)
    ) {
        const d =
            a ||
            (v
                ? "Loading map configuration…"
                : "Add `VITE_GOOGLE_MAPS_API_KEY` to your environment (or configure the backend) to enable the live map view.");
        return u.jsx("div", {
            className: "map",
            children: u.jsx("div", { className: "map__message", children: d }),
        });
    }
    return u.jsxs("div", {
        className: "map",
        children: [
            u.jsx("div", { ref: t, className: "map__canvas" }),
            e
                ? null
                : u.jsx("div", {
                      className: "map__message",
                      children: "Select a plan to preview the route.",
                  }),
            a
                ? u.jsx("div", {
                      className: "map__message map__message--error",
                      children: a,
                  })
                : null,
        ],
    });
    function N() {
        var d;
        r.current.forEach((c) => {
            c.map = null;
        }),
            (r.current = []),
            (d = i.current) == null || d.close();
    }
    function K() {
        var d;
        (d = o.current) == null || d.setMap(null), (o.current = null);
    }
    async function p(d, c) {
        K();
        try {
            const g = await fetch(`/api/plan/${d}/route`);
            if (!g.ok) return;
            const x = await g.json();
            if (!x.polyline || s.current !== d) return;
            const E = sm(x.polyline);
            if (!E.length || !n.current) return;
            (o.current = new c.maps.Polyline({
                path: E,
                strokeColor: "#1a3cff",
                strokeOpacity: 0.85,
                strokeWeight: 4,
            })),
                o.current.setMap(n.current);
        } catch {
            f("Unable to draw the route right now.");
        }
    }
}
async function om(e, t, n) {
    const {
            label: r,
            description: l,
            placeId: i,
            latitude: o,
            longitude: s,
        } = e,
        a = i ?? r;
    if (typeof o == "number" && typeof s == "number") {
        const h = { lat: o, lng: s };
        return n.set(a, h), { label: r, description: l, position: h };
    }
    const f = n.get(a);
    return f
        ? { label: r, description: l, position: f }
        : new Promise((h) => {
              const m = i ? { placeId: i } : { address: r };
              t.geocode(m, (v, _) => {
                  if (_ === "OK" && v && v[0]) {
                      const S = v[0].geometry.location.toJSON();
                      n.set(a, S), h({ label: r, description: l, position: S });
                  } else h(null);
              });
          });
}
function sm(e) {
    let t = 0;
    const n = e.length,
        r = [];
    let l = 0,
        i = 0;
    for (; t < n; ) {
        let o = 0,
            s = 0,
            a;
        do (a = e.charCodeAt(t++) - 63), (o |= (a & 31) << s), (s += 5);
        while (a >= 32);
        const f = o & 1 ? ~(o >> 1) : o >> 1;
        (l += f), (o = 0), (s = 0);
        do (a = e.charCodeAt(t++) - 63), (o |= (a & 31) << s), (s += 5);
        while (a >= 32);
        const h = o & 1 ? ~(o >> 1) : o >> 1;
        (i += h), r.push({ lat: l / 1e5, lng: i / 1e5 });
    }
    return r;
}
function Ba(e) {
    return e.replace(/[&<>'"]/g, (t) => {
        switch (t) {
            case "&":
                return "&amp;";
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "'":
                return "&#39;";
            case '"':
                return "&quot;";
            default:
                return t;
        }
    });
}
function am(e) {
    const t = document.createElement("div");
    return (t.className = "map__marker"), (t.textContent = `${e}`), t;
}
function um(e, t, n, r) {
    return new google.maps.marker.AdvancedMarkerElement({
        position: t,
        map: e,
        title: n,
        content: am(r),
        gmpClickable: !0,
    });
}
function cm(e) {
    const t = e.position;
    return t ? (t instanceof google.maps.LatLng, t) : null;
}
function dm({
    plan: e,
    plans: t,
    folders: n,
    selectedFolderId: r,
    onSelectFolder: l,
    selectedPlanId: i,
    onSelectPlan: o,
    onUpdatePlanTitle: s,
    onUpdatePlanSummary: a,
    onDeletePlan: f,
    routeSegments: h,
}) {
    var d;
    const m = (c) => {
            e && s(e.id, c);
        },
        v = (c) => {
            e && a(e.id, c);
        },
        _ = k.useMemo(() => {
            const c = new Map();
            return (
                n.forEach((g) => {
                    g.id !== "all" &&
                        g.planIds.forEach((x) => {
                            c.has(x) || c.set(x, []), c.get(x).push(g);
                        });
                }),
                c
            );
        }, [n]),
        S = k.useMemo(
            () =>
                n.find((c) => c.id === r) ??
                n[0] ?? { id: "all", name: "All Plans", planIds: [] },
            [n, r]
        ),
        N = k.useMemo(
            () =>
                r === "all" || S.id === "all"
                    ? t
                    : t.filter((c) => S.planIds.includes(c.id)),
            [t, S, r]
        ),
        K = S.name,
        p = async () => {
            if (e)
                try {
                    const c = (O) =>
                            O.replace(/[&<>"]+/g, (C) => {
                                switch (C) {
                                    case "&":
                                        return "&amp;";
                                    case "<":
                                        return "&lt;";
                                    case ">":
                                        return "&gt;";
                                    case '"':
                                        return "&quot;";
                                    default:
                                        return C;
                                }
                            }),
                        g = e.title || "Trip Plan",
                        x = e.summary || "No summary provided.",
                        E = e.stops
                            .map((O, C) => {
                                const F = e.stops[C + 1],
                                    G = h.find((ne) => ne.fromIndex === C),
                                    ee =
                                        G != null && G.durationText
                                            ? G.distanceText
                                                ? `${G.durationText} • ${G.distanceText}`
                                                : G.durationText
                                            : F
                                            ? Va(
                                                  O.latitude,
                                                  O.longitude,
                                                  F.latitude,
                                                  F.longitude
                                              )
                                            : null,
                                    Ee =
                                        (G == null ? void 0 : G.lineName) ||
                                        (G == null ? void 0 : G.agency) ||
                                        (G != null && G.mode
                                            ? Ha(G.mode)
                                            : void 0),
                                    X = [];
                                return (
                                    X.push(
                                        `<h3>${c(
                                            `${C + 1}. ${
                                                O.label || "Untitled stop"
                                            }`
                                        )}</h3>`
                                    ),
                                    O.description &&
                                        X.push(`<p>${c(O.description)}</p>`),
                                    ee &&
                                        X.push(
                                            `<p><strong>Travel:</strong> ${c(
                                                Ee || "Transit"
                                            )} • ${c(ee)}</p>`
                                        ),
                                    G != null &&
                                        G.instructions &&
                                        X.push(
                                            `<p class="note">${c(
                                                G.instructions
                                            )}</p>`
                                        ),
                                    typeof O.latitude == "number" &&
                                        Number.isFinite(O.latitude) &&
                                        typeof O.longitude == "number" &&
                                        Number.isFinite(O.longitude) &&
                                        X.push(
                                            `<p class="coords">Coordinates: ${O.latitude.toFixed(
                                                4
                                            )}, ${O.longitude.toFixed(4)}</p>`
                                        ),
                                    `<section class="stop">${X.join(
                                        ""
                                    )}</section>`
                                );
                            })
                            .join(""),
                        w = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${c(g)}</title>
    <style>
      body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 32px; color: #1f2237; }
      h1 { font-size: 24px; margin-bottom: 8px; }
      h2 { font-size: 18px; margin-top: 24px; }
      p { line-height: 1.5; margin: 6px 0; }
      .summary { margin-bottom: 18px; }
      .stop { border-bottom: 1px solid #d5d8f0; padding: 12px 0; }
      .stop:last-child { border-bottom: none; }
      .stop h3 { margin: 0 0 6px; font-size: 16px; }
      .note { font-style: italic; color: #3f4370; }
      .coords { color: #3f4370; }
    </style>
  </head>
  <body>
    <h1>${c(g)}</h1>
    <section class="summary">
      <h2>Overview</h2>
      <p>${c(x)}</p>
      <p><small>Updated ${new Date(
          e.createdAt
      ).toLocaleDateString()}</small></p>
    </section>
    <section>
      <h2>Stops</h2>
      ${E || "<p>No stops yet.</p>"}
    </section>
  </body>
</html>`,
                        R = window.open("", "_blank", "width=900,height=700");
                    if (!R) {
                        console.error(
                            "Unable to open a print window for PDF export."
                        );
                        return;
                    }
                    R.document.write(w),
                        R.document.close(),
                        R.focus(),
                        R.print();
                } catch (c) {
                    console.error("Failed to generate PDF", c);
                }
        };
    return u.jsxs("div", {
        className: "info",
        children: [
            u.jsx("header", {
                className: "info__header",
                children: u.jsxs("div", {
                    className: "info__header-text",
                    children: [
                        u.jsx("p", {
                            className: "info__eyebrow",
                            children: "Trip Summary",
                        }),
                        e
                            ? u.jsx("input", {
                                  className: "info__title-input",
                                  type: "text",
                                  value: e.title,
                                  onChange: (c) => m(c.target.value),
                                  placeholder: "Name this plan",
                              })
                            : u.jsx("h2", { children: "Select a plan" }),
                    ],
                }),
            }),
            u.jsxs("section", {
                className: "info__section info__section--summary",
                children: [
                    u.jsx("h3", { children: "Overview" }),
                    e
                        ? u.jsxs(u.Fragment, {
                              children: [
                                  u.jsx("textarea", {
                                      className: "info__summary-input",
                                      value: e.summary,
                                      onChange: (c) => v(c.target.value),
                                      placeholder:
                                          "Summarize this itinerary so teammates know what to expect.",
                                      rows: 3,
                                  }),
                                  u.jsxs("p", {
                                      className: "info__meta",
                                      children: [
                                          "Updated ",
                                          new Date(
                                              e.createdAt
                                          ).toLocaleDateString(),
                                      ],
                                  }),
                                  u.jsxs("div", {
                                      className: "info__summary-actions",
                                      children: [
                                          u.jsx("button", {
                                              type: "button",
                                              className: "info__pdf-button",
                                              onClick: p,
                                              children: "Download PDF",
                                          }),
                                          u.jsx("button", {
                                              type: "button",
                                              className: "info__delete-plan",
                                              onClick: () => f(e.id),
                                              children: "Delete Plan",
                                          }),
                                      ],
                                  }),
                              ],
                          })
                        : u.jsx("p", {
                              children:
                                  "Choose a plan to see its highlights and waypoints.",
                          }),
                ],
            }),
            u.jsxs("section", {
                className: "info__section info__section--stops",
                children: [
                    u.jsx("h3", { children: "Today's Stops" }),
                    u.jsx("ol", {
                        className: "info__stops",
                        children:
                            (d = e == null ? void 0 : e.stops) != null &&
                            d.length
                                ? e.stops.map((c, g) => {
                                      const x = e.stops[g + 1],
                                          E = h.find((C) => C.fromIndex === g),
                                          w =
                                              E != null && E.durationText
                                                  ? E.distanceText
                                                      ? `${E.durationText} • ${E.distanceText}`
                                                      : E.durationText
                                                  : x
                                                  ? Va(
                                                        c.latitude,
                                                        c.longitude,
                                                        x.latitude,
                                                        x.longitude
                                                    )
                                                  : null,
                                          R =
                                              (E == null
                                                  ? void 0
                                                  : E.lineName) ||
                                              (E == null ? void 0 : E.agency) ||
                                              (E != null && E.mode
                                                  ? Ha(E.mode)
                                                  : void 0),
                                          O = (
                                              (E == null ? void 0 : E.mode) ||
                                              "TRANSIT"
                                          ).slice(0, 1);
                                      return u.jsxs(
                                          "li",
                                          {
                                              className: "info__stop-card",
                                              children: [
                                                  u.jsxs("div", {
                                                      className:
                                                          "info__stop-marker",
                                                      children: [
                                                          u.jsx("span", {
                                                              className:
                                                                  "info__stop-node",
                                                          }),
                                                          x
                                                              ? u.jsx("span", {
                                                                    className:
                                                                        "info__stop-line",
                                                                })
                                                              : null,
                                                      ],
                                                  }),
                                                  u.jsxs("div", {
                                                      className:
                                                          "info__stop-content",
                                                      children: [
                                                          u.jsx("span", {
                                                              className:
                                                                  "info__stop-title",
                                                              children:
                                                                  c.label ||
                                                                  "Untitled stop",
                                                          }),
                                                          c.description
                                                              ? u.jsx("span", {
                                                                    className:
                                                                        "info__stop-desc",
                                                                    children:
                                                                        c.description,
                                                                })
                                                              : null,
                                                          w
                                                              ? u.jsxs("div", {
                                                                    className:
                                                                        "info__stop-connector",
                                                                    "aria-hidden":
                                                                        !0,
                                                                    children: [
                                                                        u.jsx(
                                                                            "span",
                                                                            {
                                                                                className:
                                                                                    "info__connector-icon",
                                                                                children:
                                                                                    O,
                                                                            }
                                                                        ),
                                                                        u.jsxs(
                                                                            "div",
                                                                            {
                                                                                children:
                                                                                    [
                                                                                        u.jsx(
                                                                                            "span",
                                                                                            {
                                                                                                className:
                                                                                                    "info__connector-mode",
                                                                                                children:
                                                                                                    R ||
                                                                                                    "Transit",
                                                                                            }
                                                                                        ),
                                                                                        u.jsx(
                                                                                            "span",
                                                                                            {
                                                                                                className:
                                                                                                    "info__connector-metrics",
                                                                                                children:
                                                                                                    w,
                                                                                            }
                                                                                        ),
                                                                                        E !=
                                                                                            null &&
                                                                                        E.instructions
                                                                                            ? u.jsx(
                                                                                                  "span",
                                                                                                  {
                                                                                                      className:
                                                                                                          "info__connector-note",
                                                                                                      children:
                                                                                                          E.instructions,
                                                                                                  }
                                                                                              )
                                                                                            : null,
                                                                                    ],
                                                                            }
                                                                        ),
                                                                    ],
                                                                })
                                                              : null,
                                                      ],
                                                  }),
                                              ],
                                          },
                                          c.label + g
                                      );
                                  })
                                : u.jsx("li", {
                                      className: "info__empty",
                                      children:
                                          "Add a stop to build out your itinerary.",
                                  }),
                    }),
                ],
            }),
            u.jsxs("section", {
                className: "info__section info__section--history",
                children: [
                    u.jsxs("div", {
                        className: "info__history-header",
                        children: [
                            u.jsxs("div", {
                                children: [
                                    u.jsx("h3", { children: "Plan Library" }),
                                    u.jsx("span", {
                                        className: "info__history-hint",
                                        children:
                                            "Browse plans by folder or quick access.",
                                    }),
                                ],
                            }),
                            u.jsxs("label", {
                                className: "info__folder-filter",
                                children: [
                                    u.jsx("span", { children: "Folder" }),
                                    u.jsxs("select", {
                                        className: "info__folder-select",
                                        value: r,
                                        onChange: (c) => l(c.target.value),
                                        children: [
                                            u.jsx("option", {
                                                value: "all",
                                                children: "All plans",
                                            }),
                                            n
                                                .filter((c) => c.id !== "all")
                                                .map((c) =>
                                                    u.jsx(
                                                        "option",
                                                        {
                                                            value: c.id,
                                                            children: c.name,
                                                        },
                                                        c.id
                                                    )
                                                ),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                    u.jsx("ul", {
                        className: "info__plans info__plans--scroll",
                        children: N.length
                            ? N.map((c) => {
                                  const g = _.get(c.id) ?? [];
                                  return u.jsxs(
                                      "li",
                                      {
                                          className: "info__plan-row",
                                          children: [
                                              u.jsxs("button", {
                                                  type: "button",
                                                  className:
                                                      c.id === i
                                                          ? "info__plan info__plan--active"
                                                          : "info__plan",
                                                  onClick: () => o(c.id),
                                                  children: [
                                                      u.jsx("span", {
                                                          className:
                                                              "info__plan-title",
                                                          children:
                                                              c.title ||
                                                              "Untitled Plan",
                                                      }),
                                                      u.jsx("span", {
                                                          className:
                                                              "info__plan-meta",
                                                          children: new Date(
                                                              c.createdAt
                                                          ).toLocaleDateString(),
                                                      }),
                                                      u.jsx("div", {
                                                          className:
                                                              "info__plan-tags",
                                                          children: g.length
                                                              ? g.map((x) =>
                                                                    u.jsx(
                                                                        "span",
                                                                        {
                                                                            className:
                                                                                "info__plan-tag",
                                                                            children:
                                                                                x.name,
                                                                        },
                                                                        x.id
                                                                    )
                                                                )
                                                              : u.jsx("span", {
                                                                    className:
                                                                        "info__plan-tag info__plan-tag--empty",
                                                                    children:
                                                                        "Unassigned",
                                                                }),
                                                      }),
                                                  ],
                                              }),
                                              u.jsx("button", {
                                                  type: "button",
                                                  className:
                                                      "info__plan-remove",
                                                  onClick: (x) => {
                                                      x.stopPropagation(),
                                                          f(c.id);
                                                  },
                                                  "aria-label": `Remove ${
                                                      c.title || "untitled plan"
                                                  }`,
                                                  children: "✕",
                                              }),
                                          ],
                                      },
                                      c.id
                                  );
                              })
                            : u.jsx("li", {
                                  className: "info__empty",
                                  children:
                                      r === "all"
                                          ? "No saved plans yet."
                                          : `"${K}" has no plans yet.`,
                              }),
                    }),
                ],
            }),
        ],
    });
}
function Ha(e) {
    switch (e.toUpperCase()) {
        case "WALKING":
            return "Walk";
        case "DRIVING":
            return "Drive";
        case "BICYCLING":
            return "Bike";
        case "TRANSIT":
            return "Transit";
        default:
            return e.charAt(0) + e.slice(1).toLowerCase();
    }
}
function Va(e, t, n, r) {
    if (e === void 0 || t === void 0 || n === void 0 || r === void 0)
        return null;
    const l = 6371,
        i = el(n - e),
        o = el(r - t),
        s =
            Math.sin(i / 2) * Math.sin(i / 2) +
            Math.cos(el(e)) *
                Math.cos(el(n)) *
                Math.sin(o / 2) *
                Math.sin(o / 2),
        a = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)),
        f = l * a;
    if (!Number.isFinite(f)) return null;
    const m = Math.max(5, Math.round((f / 30) * 60));
    if (m >= 60) {
        const v = Math.floor(m / 60),
            _ = m % 60;
        return `${v}h${_ ? ` ${_}m` : ""}`;
    }
    return `${m} min`;
}
function el(e) {
    return (e * Math.PI) / 180;
}
const Wa = {
    eat: "Popular with diners nearby.",
    see: "Great detour if you have a spare hour.",
    stay: "Consider booking early—demand is high in peak season.",
};
function fm({
    selectedStop: e,
    info: t,
    stops: n,
    isLoading: r,
    error: l,
    onAddSuggestion: i,
    isAddingSuggestion: o = !1,
}) {
    const s = t
        ? [
              {
                  title: "Nearby Restaurants",
                  items: t.nearbyRestaurants,
                  intent: "eat",
              },
              {
                  title: "Nearby Attractions",
                  items: t.nearbyAttractions,
                  intent: "see",
              },
              { title: "Stay Options", items: t.nearbyHotels, intent: "stay" },
          ]
        : [];
    return u.jsxs("section", {
        className: "advisor",
        children: [
            u.jsx("header", {
                className: "advisor__header",
                children: u.jsxs("div", {
                    children: [
                        u.jsx("p", {
                            className: "advisor__eyebrow",
                            children: "Trip Advisor",
                        }),
                        u.jsx("h3", {
                            children: e
                                ? e.label
                                : "Select a stop to see details",
                        }),
                    ],
                }),
            }),
            l
                ? u.jsx("div", { className: "advisor__error", children: l })
                : null,
            r
                ? u.jsx("div", {
                      className: "advisor__loading",
                      children: "Gathering local insights…",
                  })
                : t
                ? u.jsxs("div", {
                      className: "advisor__content",
                      children: [
                          u.jsx("p", {
                              className: "advisor__summary",
                              children: t.summary,
                          }),
                          u.jsx("div", {
                              className: "advisor__grid",
                              children: s.map((a) =>
                                  u.jsxs(
                                      "div",
                                      {
                                          className: "advisor__section",
                                          children: [
                                              u.jsx("h4", {
                                                  children: a.title,
                                              }),
                                              u.jsx("ul", {
                                                  children: a.items.length
                                                      ? a.items.map((f) =>
                                                            u.jsx(
                                                                pm,
                                                                {
                                                                    suggestion:
                                                                        f,
                                                                    intent: a.intent,
                                                                    onAdd: i,
                                                                    disabled: o,
                                                                },
                                                                `${a.title}-${f.name}`
                                                            )
                                                        )
                                                      : u.jsx("li", {
                                                            className:
                                                                "advisor__empty-item",
                                                            children:
                                                                "Nothing nearby detected yet.",
                                                        }),
                                              }),
                                          ],
                                      },
                                      a.title
                                  )
                              ),
                          }),
                      ],
                  })
                : u.jsxs("div", {
                      className: "advisor__placeholder",
                      children: [
                          u.jsx("p", {
                              children:
                                  "Select one of the stops in your itinerary to see tailored suggestions.",
                          }),
                          n.length
                              ? u.jsx("ol", {
                                    children: n.map((a, f) =>
                                        u.jsx(
                                            "li",
                                            { children: a.label },
                                            a.label + f
                                        )
                                    ),
                                })
                              : null,
                      ],
                  }),
        ],
    });
}
function pm({ suggestion: e, intent: t, onAdd: n, disabled: r }) {
    const l = e.rating ? `${e.rating.toFixed(1)}★` : "No rating yet",
        i = e.totalRatings
            ? `(${e.totalRatings.toLocaleString()} reviews)`
            : "",
        o =
            typeof e.priceLevel == "number"
                ? "$".repeat(Math.max(0, Math.min(4, e.priceLevel + 1)))
                : void 0,
        s =
            e.openNow === !0
                ? "Open now"
                : e.openNow === !1
                ? "Currently closed"
                : void 0,
        a = !!n;
    return u.jsxs("li", {
        className: ["advisor__item", a ? "advisor__item--interactive" : ""]
            .filter(Boolean)
            .join(" "),
        tabIndex: a ? -1 : 0,
        "aria-label": `${e.name}. ${Wa[t]}`,
        children: [
            u.jsx("span", {
                className: "advisor__item-name",
                children: e.name,
            }),
            u.jsxs("div", {
                className: "advisor__tooltip",
                role: "note",
                children: [
                    u.jsx("strong", { children: e.name }),
                    u.jsxs("span", {
                        className: "advisor__tooltip-rating",
                        children: [l, " ", i],
                    }),
                    o
                        ? u.jsxs("span", {
                              className: "advisor__tooltip-price",
                              children: ["Price level: ", o],
                          })
                        : null,
                    e.address
                        ? u.jsx("span", {
                              className: "advisor__tooltip-address",
                              children: e.address,
                          })
                        : null,
                    s
                        ? u.jsx("span", {
                              className: "advisor__tooltip-status",
                              children: s,
                          })
                        : null,
                    u.jsx("span", { children: Wa[t] }),
                ],
            }),
            a
                ? u.jsx("div", {
                      className: "advisor__item-actions",
                      children: u.jsx("button", {
                          type: "button",
                          className: "advisor__add-button",
                          onClick: () => {
                              n == null || n(e);
                          },
                          disabled: r,
                          children: r ? "Adding…" : "Add to plan",
                      }),
                  })
                : null,
        ],
    });
}
const Ka = "/api",
    mm = (e) => {
        const t = e.trim();
        if (!t) return null;
        const n = t.toLowerCase(),
            r = ["what is", "calculate", "compute", "solve", "evaluate"];
        let l = n;
        for (const o of r)
            if (l.startsWith(o)) {
                l = l.slice(o.length);
                break;
            }
        if (
            ((l = l.replace(/^[^0-9\-+(]*?/i, "").trim()),
            (l = l.replace(/[?!.]+$/g, "").trim()),
            !l)
        )
            return null;
        const i = l
            .replace(/\sx\s/gi, " * ")
            .replace(/[xX]/g, "*")
            .replace(/\^/g, "**");
        if (/[^0-9+\-*/().\s*]/.test(i)) return null;
        try {
            const o = Function(`"use strict"; return (${i});`)();
            if (typeof o == "number" && Number.isFinite(o)) {
                const s = Number.isInteger(o)
                    ? `${o}`
                    : o.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
                return `${l.replace(/\*\*/g, "^")} = ${s}`;
            }
        } catch {
            return null;
        }
        return null;
    },
    hm = [
        "Add a stop for Brackendale Eagle Provincial Park after the current one.",
        "Rename stop 2 to Granville Island Market.",
        "Move stop 4 to position 2.",
    ],
    Qa = {
        id: "assistant-welcome",
        role: "assistant",
        content:
            "Hi! I focus on British Columbia routes. Ask for BC stop ideas or tell me to add, remove, rename, or move stops and I will update your itinerary.",
    },
    tl = [
        {
            area: "Sea-to-Sky Corridor",
            keywords: [
                "whistler",
                "squamish",
                "sea-to-sky",
                "garibaldi",
                "porteau",
            ],
            suggestions: [
                "Cruise the Sea-to-Sky: start in Vancouver, pause for views at Porteau Cove, then ride the Squamish Sea to Sky Gondola before landing in Whistler Village for alpine dining.",
                "Detour to Brandywine Falls Provincial Park between Squamish and Whistler for a quick hike and waterfall photo stop.",
                "Add a wildlife swing through Brackendale Eagle Provincial Park during winter for stellar bald eagle sightings.",
            ],
        },
        {
            area: "Vancouver Island",
            keywords: [
                "victoria",
                "tofino",
                "nanaimo",
                "cowichan",
                "island",
                "pacific rim",
            ],
            suggestions: [
                "Sail to Victoria, stroll the Inner Harbour, and cap it with sunset views from Dallas Road or Ogden Point.",
                "Roll north toward Cowichan Valley for a farm-to-table lunch, then finish in Nanaimo with a harbour walk and classic Nanaimo bar.",
                "Head to Pacific Rim National Park Reserve near Tofino for the Rainforest Trail and a Long Beach sunset bonfire.",
            ],
        },
        {
            area: "Vancouver City",
            keywords: [
                "vancouver",
                "gastown",
                "granville",
                "kitsilano",
                "stanley",
            ],
            suggestions: [
                "Pair Stanley Park’s Seawall cycle with a stop at the Lost Lagoon nature house and finish at Prospect Point for views over Lions Gate Bridge.",
                "Design a False Creek loop: Granville Island Market brunch, Olympic Village beer tasting, and sunset at Kitsilano Beach.",
                "Explore Gastown’s historic core, then head up to Queen Elizabeth Park for skyline views and the Bloedel Conservatory.",
            ],
        },
        {
            area: "Okanagan Valley",
            keywords: ["okanagan", "kelowna", "penticton", "naramata", "wine"],
            suggestions: [
                "Spend a wine-focused day: bike the Naramata Bench, taste at three boutique wineries, then cool off with a Penticton lakeshore paddle.",
                "Climb Knox Mountain Park in Kelowna for morning views, grab lunch at a lakeside patio, and finish with Myra Canyon trestle bridges.",
                "Pair peach season in Summerland with a visit to Dirty Laundry Vineyard and a Kettle Valley Rail Trail stroll.",
            ],
        },
        {
            area: "Kootenay Rockies",
            keywords: ["nelson", "kootenay", "fernie", "revelstoke", "yoho"],
            suggestions: [
                "Link Yoho and Glacier National Parks: Emerald Lake canoeing, Takakkaw Falls viewing, then Rogers Pass discovery centre.",
                "Base in Nelson: hit the Hot Springs at Ainsworth, walk Baker Street boutiques, and close with a craft beer crawl.",
                "Ride the Fernie Alpine Resort chairlift for alpine trails and lakeside relaxation at Island Lake Lodge.",
            ],
        },
        {
            area: "British Columbia",
            keywords: [],
            suggestions: [
                "Combine a Vancouver foodie morning with a Sea-to-Sky afternoon—think Granville Island brunch, Porteau Cove pit stop, and Whistler Village dinner.",
                "Catch a ferry to Victoria for parliament architecture, then road-trip the Malahat SkyWalk and Mill Bay cider farms.",
                "Trace an interior loop: Kelowna vineyards, Kamloops desert trails, and back to Vancouver via the Fraser Canyon viewpoints.",
            ],
        },
    ];
function bn(e) {
    const t = e + 1,
        n = (() => {
            const r = t % 100;
            if (r >= 11 && r <= 13) return "th";
            switch (t % 10) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                default:
                    return "th";
            }
        })();
    return `${t}${n}`;
}
function Io(e) {
    return e.replace(/[.,!?]/g, "").trim();
}
function Ri(e) {
    return e
        .split(" ")
        .filter(Boolean)
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        .join(" ");
}
function dn(e, t) {
    const n = Io(e).toLowerCase();
    if (!n) return null;
    const r = n.match(/^stop\s*(\d+)$/);
    if (r) {
        const s = Number.parseInt(r[1], 10) - 1;
        return Number.isInteger(s) && s >= 0 && s < t.length ? s : null;
    }
    const l = n.match(/^(\d+)$/);
    if (l) {
        const s = Number.parseInt(l[1], 10) - 1;
        return Number.isInteger(s) && s >= 0 && s < t.length ? s : null;
    }
    const i = t.findIndex((s) => {
        var a;
        return ((a = s.label) == null ? void 0 : a.toLowerCase()) === n;
    });
    if (i !== -1) return i;
    const o = t.findIndex((s) => {
        var f;
        const a = (f = s.label) == null ? void 0 : f.toLowerCase();
        return a ? a.includes(n) : !1;
    });
    return o !== -1 ? o : null;
}
function vm(e, t) {
    const n = e.toLowerCase();
    for (const r of tl) if (r.keywords.some((l) => n.includes(l))) return r;
    if (t != null && t.label) {
        const r = t.label.toLowerCase();
        for (const l of tl) if (l.keywords.some((i) => r.includes(i))) return l;
    }
    return tl[tl.length - 1];
}
function gm(e, t, n) {
    const r = vm(e, t),
        l = r.suggestions.slice(0, 2),
        i = n
            ? `Keeping ${n} focused on British Columbia, here are a couple of ${r.area.toLowerCase()} ideas:`
            : `Here are a couple of British Columbia ideas around the ${r.area.toLowerCase()}:`,
        o = l.map((a) => `• ${a}`),
        s =
            t != null && t.label
                ? `Ask me to add, tweak, or move stops around ${t.label} and I will handle the updates.`
                : "Ask me to add, tweak, or move any stops and I will update the plan for you.";
    return [i, ...o, s].join(`
`);
}
function ym({
    planTitle: e,
    stops: t,
    selectedStop: n,
    selectedStopIndex: r,
    motivation: l,
    onAddStop: i,
    onUpdateStop: o,
    onRemoveStop: s,
    onMoveStop: a,
}) {
    const [f, h] = k.useState([Qa]),
        [m, v] = k.useState(""),
        [_, S] = k.useState(!1),
        [N, K] = k.useState(null),
        p = k.useRef(null),
        d = k.useRef(null),
        c = k.useRef(null),
        g = k.useRef([Qa]);
    k.useEffect(() => {
        g.current = f;
    }, [f]),
        k.useEffect(() => {
            var L;
            const y = d.current;
            if (!y) {
                (L = p.current) == null ||
                    L.scrollIntoView({ behavior: "smooth" });
                return;
            }
            try {
                y.scrollTo({ top: y.scrollHeight, behavior: "smooth" });
            } catch {
                y.scrollTop = y.scrollHeight;
            }
        }, [f]);
    const x = async (y) => {
            try {
                const L = await fetch(`${Ka}/maps/search`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query: y }),
                });
                if (!L.ok) return null;
                const T = await L.json();
                return !T ||
                    typeof T.latitude != "number" ||
                    typeof T.longitude != "number"
                    ? null
                    : {
                          label: T.label,
                          address: T.address ?? void 0,
                          placeId: T.place_id ?? void 0,
                          latitude: T.latitude,
                          longitude: T.longitude,
                      };
            } catch {
                return null;
            }
        },
        F = [
            async (y) => {
                if (!i || !/\badd\b/i.test(y) || !/\bstop\b/i.test(y))
                    return null;
                const L = y.match(
                    /add(?:\s+(?:a|another))?\s+stop(?:\s+(?:called|named|at|in))?\s+(.+)/i
                );
                if (!L) return null;
                let T = L[1].trim();
                if (!T)
                    return "Let me know what the stop should be called, and I will add it to the plan.";
                let B;
                const A = T.match(/(.+?)\s+after\s+(?:stop\s+)?(.+)/i);
                if (A) {
                    T = A[1].trim();
                    const M = A[2].trim(),
                        U = dn(M, t);
                    if (U === null)
                        return `I could not find the stop "${M}" to insert after.`;
                    B = U + 1;
                } else {
                    const M = T.match(/(.+?)\s+before\s+(?:stop\s+)?(.+)/i);
                    if (M) {
                        T = M[1].trim();
                        const U = M[2].trim(),
                            H = dn(U, t);
                        if (H === null)
                            return `I could not find the stop "${U}" to insert before.`;
                        B = H;
                    } else {
                        const U = T.match(
                            /(.+?)\s+at\s+(?:position|slot|spot)\s+(\d+)/i
                        );
                        if (U) {
                            T = U[1].trim();
                            const H = Number.parseInt(U[2], 10);
                            if (!Number.isInteger(H) || H < 1)
                                return "Give me a positive position number and I can place the stop there.";
                            B = H - 1;
                        }
                    }
                }
                const q = Io(T);
                if (!q)
                    return "I need a name for that stop before I can add it.";
                const Z = await x(q);
                if (!Z)
                    return "I can only add stops that I can place within British Columbia. Try a more specific BC location.";
                const ie = {
                        label: Ri(Z.label || q),
                        description: Z.address ?? "",
                        placeId: Z.placeId ?? void 0,
                        latitude: Z.latitude,
                        longitude: Z.longitude,
                    },
                    pe = B ?? (r !== null ? r + 1 : t.length);
                if ((i(ie, { index: pe, select: !0 }), pe >= t.length)) {
                    const M = Z.address ? ` (${Z.address})` : "";
                    return `Added ${ie.label}${M} to the end of your route.`;
                }
                const at = bn(Math.min(pe, t.length)),
                    W = Z.address ? ` (${Z.address})` : "";
                return `Inserted ${ie.label}${W} at the ${at} stop.`;
            },
            async (y) => {
                if (!s) return null;
                const L = y.match(/(?:remove|delete)\s+stop\s+(.+)/i);
                if (!L) return null;
                if (!t.length) return "There are no stops to remove right now.";
                const T = L[1].trim(),
                    B = dn(T, t);
                if (B === null)
                    return `I could not find a stop matching "${T}".`;
                const A = t[B];
                return (
                    s(B),
                    `Removed ${A.label ?? `the ${bn(B)} stop`} from the plan.`
                );
            },
            async (y) => {
                if (!a) return null;
                const L = y.match(
                    /(?:move|reorder)\s+stop\s+(.+?)\s+to\s+(?:position\s+)?(\d+)/i
                );
                if (!L) return null;
                if (!t.length)
                    return "There are no stops to rearrange right now.";
                const T = L[1].trim(),
                    B = Number.parseInt(L[2], 10);
                if (!Number.isInteger(B) || B < 1)
                    return "Give me a positive position number to move that stop to.";
                const A = dn(T, t);
                if (A === null)
                    return `I could not find a stop matching "${T}" to move.`;
                const q = Math.min(B - 1, t.length - 1);
                return A === q
                    ? "That stop is already sitting in that position."
                    : (a(A, q),
                      `Moved ${t[A].label ?? "that stop"} to the ${bn(
                          q
                      )} spot.`);
            },
            async (y) => {
                if (!o) return null;
                const L = y.match(
                    /(?:rename|retitle|call|name)\s+stop\s+(.+?)\s+(?:to|as)\s+(.+)/i
                );
                if (!L) return null;
                const T = L[1].trim(),
                    B = L[2].trim();
                if (!B)
                    return "Tell me the new name you want and I will rename the stop.";
                const A = dn(T, t);
                if (A === null)
                    return `I could not find a stop matching "${T}" to rename.`;
                const q = Ri(Io(B)) || Ri(B);
                return o(A, { label: q }), `Renamed the ${bn(A)} stop to ${q}.`;
            },
            async (y) => {
                if (!o) return null;
                const L = y.match(
                    /(?:set|update|change)\s+stop\s+(.+?)\s+(?:description|details)\s+(?:to|as)\s+(.+)/i
                );
                if (!L) return null;
                const T = L[1].trim(),
                    B = L[2].trim();
                if (!B)
                    return "Share the description you want me to use and I will update the stop.";
                const A = dn(T, t);
                return A === null
                    ? `I could not find a stop matching "${T}" to update.`
                    : (o(A, { description: B }),
                      `Updated the description for ${
                          t[A].label ?? `the ${bn(A)} stop`
                      }.`);
            },
        ],
        G = async (y) => {
            try {
                const L = g.current.slice(-6).map((Z) => ({
                        role: Z.role === "assistant" ? "assistant" : "user",
                        content: Z.content,
                    })),
                    T = [];
                e && T.push(`Plan: ${e}`),
                    l && l.length && T.push(`Motivations: ${l.join(", ")}`),
                    t &&
                        t.length &&
                        (T.push(`Stops (${t.length}):`),
                        t.forEach((Z, ie) => {
                            const pe = Z.description
                                ? ` - ${Z.description}`
                                : "";
                            T.push(`${ie + 1}. ${Z.label || "Untitled"}${pe}`);
                        }));
                const B = {
                        role: "system",
                        content: T.join(`
`),
                    },
                    A = await fetch(`${Ka}/assistant/chat`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            message: y,
                            context: [...L, B],
                        }),
                    });
                if (A.status === 204) return null;
                const q = await A.json().catch(() => ({}));
                if (q && typeof q.reply == "string" && q.reply.trim().length)
                    return q.reply.trim();
            } catch {}
            return null;
        },
        ee = async (y) => {
            for (const B of F) {
                const A = await B(y);
                if (A) return A;
            }
            const L = mm(y);
            if (L)
                return `${L}

Need help lining up British Columbia stops? Just let me know.`;
            const T = await G(y);
            return T || gm(y, n, e);
        },
        Ee = async (y) => {
            const L = y.trim();
            if (!L || _) {
                v(y);
                return;
            }
            const T = { id: `user-${Date.now()}`, role: "user", content: L },
                B = [...g.current, T];
            (g.current = B), h(B), v(""), K(null), S(!0);
            try {
                const A = await ee(L);
                await new Promise((ie) => setTimeout(ie, 200));
                const q = {
                        id: `assistant-${Date.now()}`,
                        role: "assistant",
                        content: A,
                    },
                    Z = [...g.current, q];
                (g.current = Z), h(Z);
            } catch (A) {
                const q =
                    A instanceof Error
                        ? A.message
                        : "Something went sideways. Try asking again.";
                K(q);
            } finally {
                S(!1),
                    setTimeout(() => {
                        var A, q, Z, ie;
                        try {
                            (A = c.current) == null || A.focus();
                            const pe =
                                ((Z =
                                    (q = c.current) == null
                                        ? void 0
                                        : q.value) == null
                                    ? void 0
                                    : Z.length) ?? 0;
                            (ie = c.current) == null ||
                                ie.setSelectionRange(pe, pe);
                        } catch {}
                    }, 0);
            }
        },
        X = (y) => {
            y.preventDefault(), Ee(m);
        },
        ne = (y) => {
            y.key === "Enter" && !y.shiftKey && (y.preventDefault(), Ee(m));
        },
        Ye = (y) => {
            _ || Ee(y);
        };
    return u.jsxs("aside", {
        className: "assistant",
        children: [
            u.jsxs("div", {
                className: "assistant__header",
                children: [
                    u.jsx("p", {
                        className: "assistant__eyebrow",
                        children: "AI Assist",
                    }),
                    u.jsx("h3", { children: "Travel Coach" }),
                ],
            }),
            u.jsxs("div", {
                className: "assistant__suggestions",
                children: [
                    u.jsx("span", {
                        className: "assistant__hint",
                        children: "Try a quick prompt:",
                    }),
                    u.jsx("div", {
                        className: "assistant__chips",
                        children: hm.map((y) =>
                            u.jsx(
                                "button",
                                {
                                    type: "button",
                                    className: "assistant__chip",
                                    onClick: () => Ye(y),
                                    disabled: _,
                                    children: y,
                                },
                                y
                            )
                        ),
                    }),
                ],
            }),
            u.jsxs("div", {
                className: "assistant__messages",
                ref: d,
                children: [
                    f.map((y) =>
                        u.jsxs(
                            "div",
                            {
                                className: `assistant__message assistant__message--${y.role}`,
                                children: [
                                    u.jsx("span", {
                                        className: "assistant__message-role",
                                        children:
                                            y.role === "user"
                                                ? "You"
                                                : "Assistant",
                                    }),
                                    u.jsx("span", {
                                        className: "assistant__message-content",
                                        children: y.content,
                                    }),
                                ],
                            },
                            y.id
                        )
                    ),
                    u.jsx("div", { ref: p }),
                ],
            }),
            N
                ? u.jsx("div", { className: "assistant__error", children: N })
                : null,
            u.jsxs("form", {
                className: "assistant__form",
                onSubmit: X,
                children: [
                    u.jsx("textarea", {
                        className: "assistant__textarea",
                        placeholder:
                            "Ask for BC route ideas or tell me how to modify the stops.",
                        value: m,
                        ref: c,
                        onChange: (y) => v(y.target.value),
                        onKeyDown: ne,
                        disabled: _,
                    }),
                    u.jsxs("div", {
                        className: "assistant__footer",
                        children: [
                            u.jsx("span", {
                                className: "assistant__hint",
                                children:
                                    "Press Enter to send, Shift + Enter for a new line.",
                            }),
                            u.jsx("button", {
                                type: "submit",
                                className: "assistant__submit",
                                disabled: _ || !m.trim(),
                                children: _ ? "Thinking…" : "Send",
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
}
const Mi = (e, t, n) => (Number.isNaN(e) ? t : Math.min(Math.max(e, t), n)),
    _m = (e, t, n) => ({
        timeToSpendDays: Mi(Math.floor(e), 0, 365),
        timeToSpendHours: Mi(Math.floor(t), 0, 23),
        timeToSpendMinutes: Mi(Math.floor(n), 0, 59),
    }),
    wm = (e) => {
        const t = [];
        return (
            typeof e.timeToSpendDays == "number" &&
                e.timeToSpendDays > 0 &&
                t.push(`${e.timeToSpendDays}d`),
            typeof e.timeToSpendHours == "number" &&
                e.timeToSpendHours > 0 &&
                t.push(`${e.timeToSpendHours}h`),
            typeof e.timeToSpendMinutes == "number" &&
                e.timeToSpendMinutes > 0 &&
                t.push(`${e.timeToSpendMinutes}m`),
            t.length ? t.join(" ") : null
        );
    };
function Sm({
    plan: e,
    draftStops: t = null,
    isLoading: n = !1,
    onSelectStop: r,
    selectedStopIndex: l = null,
    onAddStop: i,
    onUpdateStop: o,
    onRemoveStop: s,
    onSave: a,
    hasPendingChanges: f = !1,
}) {
    const h = (e == null ? void 0 : e.stops) ?? [],
        m = t ?? h,
        v = Math.max(h.length, m.length),
        _ = !!o,
        [S, N] = k.useState({}),
        K = k.useRef(m.length),
        p = k.useRef(null),
        d = k.useRef(null),
        c = k.useRef({}),
        [g, x] = k.useState(0),
        E = k.useRef(0),
        w = k.useRef(null),
        R = "_";
    k.useEffect(() => {
        N({}), (K.current = m.length);
    }, [e == null ? void 0 : e.id]),
        k.useEffect(() => {
            if (m.length > K.current) {
                const W = m.length - 1;
                N((M) => ({ ...M, [W]: !0 }));
            }
            K.current = m.length;
        }, [m.length, m]);
    const O = k.useMemo(
            () =>
                Array.from({ length: v }).map((W, M) => {
                    const U = h[M] ?? null,
                        H = m[M] ?? null,
                        oe = U ?? H;
                    return oe ? wm(oe) : null;
                }),
            [v, h, m]
        ),
        C = k.useMemo(() => {
            if (!h.length) return new Set();
            const W = new Set();
            m.forEach((U) => {
                U &&
                    typeof U.__originalIndex == "number" &&
                    W.add(U.__originalIndex);
            });
            const M = new Set();
            return (
                h.forEach((U, H) => {
                    const oe =
                        typeof U.__originalIndex == "number"
                            ? U.__originalIndex
                            : H;
                    W.has(oe) || M.add(oe);
                }),
                M
            );
        }, [h, m]),
        F = k.useMemo(() => c.current, [g]),
        G = !!(_ && a && f),
        ee = !!(_ && f),
        Ee = !_,
        X = (W) => {
            N((M) => {
                const U = !M[W];
                if (!U && c.current[W]) {
                    const H = { ...c.current };
                    delete H[W], (c.current = H), x((oe) => oe + 1);
                }
                return { ...M, [W]: U };
            });
        },
        ne = (W, M) => {
            o == null || o(W, { label: M }), pe(W, M);
        },
        Ye = (W, M) => {
            o == null || o(W, { description: M.length ? M : "" });
        },
        y = (W, M) => {
            const U = M.trim();
            o == null || o(W, { placeId: U || void 0 });
        },
        L = (W, M, U) => {
            if (!_) return;
            const H = Number(U);
            if (Number.isNaN(H) || H < 0) return;
            const oe = m[W];
            if (!oe) return;
            const ve = _m(
                M === "timeToSpendDays" ? H : oe.timeToSpendDays ?? 0,
                M === "timeToSpendHours" ? H : oe.timeToSpendHours ?? 0,
                M === "timeToSpendMinutes" ? H : oe.timeToSpendMinutes ?? 0
            );
            o == null || o(W, ve);
        },
        T = (W) => {
            _ &&
                (o == null ||
                    o(W, {
                        timeToSpendDays: void 0,
                        timeToSpendHours: void 0,
                        timeToSpendMinutes: void 0,
                    }));
        },
        B = () => {
            G && (a == null || a());
        },
        A = () => {
            !_ || !i || i();
        },
        q = (W) => {
            if (
                !(!_ || !s) &&
                (s(W),
                N((M) => {
                    const U = {};
                    return (
                        Object.entries(M).forEach(([H, oe]) => {
                            const ve = Number(H);
                            if (ve === W) return;
                            const ze = ve > W ? ve - 1 : ve;
                            oe && (U[ze] = !0);
                        }),
                        U
                    );
                }),
                c.current[W])
            ) {
                const M = { ...c.current };
                delete M[W], (c.current = M), x((U) => U + 1);
            }
        },
        Z = (W, M) => {
            r == null || r(W, M);
        };
    k.useEffect(() => {
        if (p.current || typeof window > "u") return;
        const W =
            w.current ??
            (w.current = new Rt({
                apiKey: R,
                version: "weekly",
                libraries: ["places", "marker"],
            }));
        let M = !1;
        return (
            W.load()
                .then((U) => {
                    M ||
                        ((p.current = new U.maps.places.AutocompleteService()),
                        (d.current = new U.maps.places.PlacesService(
                            document.createElement("div")
                        )));
                })
                .catch(() => {
                    (p.current = null), (d.current = null);
                }),
            () => {
                M = !0;
            }
        );
    }, [R]);
    const ie = (W, M) => {
            if (!M || !M.length) {
                if (c.current[W]) {
                    const U = { ...c.current };
                    delete U[W], (c.current = U), x((H) => H + 1);
                }
                return;
            }
            (c.current = { ...c.current, [W]: M }), x((U) => U + 1);
        },
        pe = (W, M) => {
            if (!p.current || !M.trim()) {
                ie(W, null);
                return;
            }
            const U = ++E.current;
            p.current.getPlacePredictions(
                {
                    input: M,
                    componentRestrictions: { country: "CA" },
                    bounds: new google.maps.LatLngBounds(
                        { lat: 48.18, lng: -139.06 },
                        { lat: 60, lng: -114.05 }
                    ),
                },
                (H) => {
                    U === E.current &&
                        (!H || !H.length ? ie(W, null) : ie(W, H));
                }
            );
        },
        at = (W, M) => {
            ie(W, null);
            const U = (H) => {
                o == null ||
                    o(W, {
                        label: H.label ?? M.structured_formatting.main_text,
                        description:
                            H.description ??
                            M.structured_formatting.secondary_text ??
                            M.description,
                        placeId: H.placeId ?? M.place_id,
                        latitude: H.latitude,
                        longitude: H.longitude,
                    });
            };
            if (!d.current) {
                U({});
                return;
            }
            d.current.getDetails(
                {
                    placeId: M.place_id,
                    fields: [
                        "name",
                        "formatted_address",
                        "geometry",
                        "place_id",
                    ],
                },
                (H, oe) => {
                    var ve, ze, De, Yt;
                    if (
                        oe !== google.maps.places.PlacesServiceStatus.OK ||
                        !H
                    ) {
                        U({});
                        return;
                    }
                    U({
                        label: H.name ?? void 0,
                        description: H.formatted_address ?? void 0,
                        placeId: H.place_id ?? void 0,
                        latitude:
                            (ze =
                                (ve = H.geometry) == null
                                    ? void 0
                                    : ve.location) == null
                                ? void 0
                                : ze.lat(),
                        longitude:
                            (Yt =
                                (De = H.geometry) == null
                                    ? void 0
                                    : De.location) == null
                                ? void 0
                                : Yt.lng(),
                    });
                }
            );
        };
    return u.jsxs("section", {
        className: "to-go",
        children: [
            u.jsxs("header", {
                className: "to-go__header",
                children: [
                    u.jsxs("div", {
                        className: "to-go__header-row",
                        children: [
                            u.jsxs("div", {
                                children: [
                                    u.jsx("p", {
                                        className: "to-go__eyebrow",
                                        children: "To Go",
                                    }),
                                    u.jsx("h3", {
                                        children: e
                                            ? "Upcoming stops"
                                            : "Pick a plan to see your route",
                                    }),
                                ],
                            }),
                            u.jsxs("div", {
                                className: "to-go__header-actions",
                                children: [
                                    ee
                                        ? u.jsx("span", {
                                              className:
                                                  "to-go__draft-indicator",
                                              children: "Unsaved changes",
                                          })
                                        : null,
                                    u.jsx("button", {
                                        type: "button",
                                        className: "to-go__button",
                                        onClick: B,
                                        disabled: !G,
                                        children: "Save",
                                    }),
                                ],
                            }),
                        ],
                    }),
                    u.jsx("button", {
                        type: "button",
                        className:
                            "to-go__button to-go__button--secondary full-width",
                        onClick: A,
                        disabled: !_,
                        children: "Add Stop",
                    }),
                ],
            }),
            u.jsx("ol", {
                className: "to-go__list",
                children: n
                    ? u.jsx("li", {
                          className: "to-go__empty",
                          children: "Loading your stops…",
                      })
                    : v
                    ? Array.from({ length: v }).map((W, M) => {
                          var $r;
                          const U = h[M] ?? null,
                              H = m[M] ?? null;
                          if (!U && !H) return null;
                          const oe =
                                  U && typeof U.__originalIndex == "number"
                                      ? U.__originalIndex
                                      : U
                                      ? M
                                      : null,
                              ve = typeof oe == "number" ? C.has(oe) : !1,
                              ze = U ?? H,
                              De = ve ? U : H ?? U,
                              Yt = l === M,
                              Ct = S[M] ?? !1,
                              ni = O[M],
                              Dr = !U && !!H,
                              ut = Ee || ve;
                          return u.jsxs(
                              "li",
                              {
                                  className: [
                                      "to-go__item",
                                      Yt ? "to-go__item--selected" : "",
                                      Ct ? "to-go__item--open" : "",
                                      Dr ? "to-go__item--draft-new" : "",
                                      ve ? "to-go__item--draft-removed" : "",
                                  ]
                                      .filter(Boolean)
                                      .join(" "),
                                  children: [
                                      u.jsxs("div", {
                                          className: "to-go__item-header",
                                          children: [
                                              u.jsxs("button", {
                                                  type: "button",
                                                  className:
                                                      "to-go__item-select",
                                                  disabled: ve,
                                                  onClick: () => Z(De, M),
                                                  "aria-pressed": Yt,
                                                  children: [
                                                      u.jsx("span", {
                                                          className:
                                                              "to-go__step",
                                                          children: M + 1,
                                                      }),
                                                      u.jsxs("div", {
                                                          className:
                                                              "to-go__item-text",
                                                          children: [
                                                              u.jsx("span", {
                                                                  className:
                                                                      "to-go__title",
                                                                  children:
                                                                      ze.label ||
                                                                      "Untitled stop",
                                                              }),
                                                              ni
                                                                  ? u.jsx(
                                                                        "span",
                                                                        {
                                                                            className:
                                                                                "to-go__time-pill",
                                                                            children:
                                                                                ni,
                                                                        }
                                                                    )
                                                                  : null,
                                                              Dr
                                                                  ? u.jsx(
                                                                        "span",
                                                                        {
                                                                            className:
                                                                                "to-go__chip to-go__chip--new",
                                                                            children:
                                                                                "New",
                                                                        }
                                                                    )
                                                                  : null,
                                                              ve
                                                                  ? u.jsx(
                                                                        "span",
                                                                        {
                                                                            className:
                                                                                "to-go__chip to-go__chip--removed",
                                                                            children:
                                                                                "Removed",
                                                                        }
                                                                    )
                                                                  : null,
                                                          ],
                                                      }),
                                                  ],
                                              }),
                                              u.jsxs("div", {
                                                  className:
                                                      "to-go__item-actions",
                                                  children: [
                                                      u.jsx("button", {
                                                          type: "button",
                                                          className:
                                                              "to-go__action to-go__action--toggle",
                                                          onClick: () => X(M),
                                                          disabled: ve,
                                                          "aria-expanded": Ct,
                                                          children: Ct
                                                              ? "Hide"
                                                              : "Details",
                                                      }),
                                                      u.jsx("button", {
                                                          type: "button",
                                                          className:
                                                              "to-go__action to-go__action--danger",
                                                          onClick: () => q(M),
                                                          disabled: !_ || !s,
                                                          children: "-",
                                                      }),
                                                  ],
                                              }),
                                          ],
                                      }),
                                      u.jsxs("div", {
                                          className: Ct
                                              ? "to-go__item-details to-go__item-details--open"
                                              : "to-go__item-details",
                                          children: [
                                              u.jsxs("label", {
                                                  className: "to-go__field",
                                                  children: [
                                                      u.jsx("span", {
                                                          children: "Stop name",
                                                      }),
                                                      u.jsx("input", {
                                                          type: "text",
                                                          value: De.label,
                                                          onChange: (me) =>
                                                              ne(
                                                                  M,
                                                                  me.target
                                                                      .value
                                                              ),
                                                          placeholder:
                                                              "Enter stop name",
                                                          disabled: ut,
                                                      }),
                                                  ],
                                              }),
                                              Ct &&
                                              ((($r = F[M]) == null
                                                  ? void 0
                                                  : $r.length) ??
                                                  0)
                                                  ? u.jsx("ul", {
                                                        className:
                                                            "to-go__suggestions",
                                                        role: "listbox",
                                                        children: F[M].map(
                                                            (me) =>
                                                                u.jsx(
                                                                    "li",
                                                                    {
                                                                        children:
                                                                            u.jsxs(
                                                                                "button",
                                                                                {
                                                                                    type: "button",
                                                                                    className:
                                                                                        "to-go__suggestion",
                                                                                    onClick:
                                                                                        () =>
                                                                                            at(
                                                                                                M,
                                                                                                me
                                                                                            ),
                                                                                    disabled:
                                                                                        ut,
                                                                                    children:
                                                                                        [
                                                                                            u.jsx(
                                                                                                "span",
                                                                                                {
                                                                                                    className:
                                                                                                        "to-go__suggestion-primary",
                                                                                                    children:
                                                                                                        me
                                                                                                            .structured_formatting
                                                                                                            .main_text,
                                                                                                }
                                                                                            ),
                                                                                            me
                                                                                                .structured_formatting
                                                                                                .secondary_text
                                                                                                ? u.jsx(
                                                                                                      "span",
                                                                                                      {
                                                                                                          className:
                                                                                                              "to-go__suggestion-secondary",
                                                                                                          children:
                                                                                                              me
                                                                                                                  .structured_formatting
                                                                                                                  .secondary_text,
                                                                                                      }
                                                                                                  )
                                                                                                : null,
                                                                                        ],
                                                                                }
                                                                            ),
                                                                    },
                                                                    me.place_id
                                                                )
                                                        ),
                                                    })
                                                  : null,
                                              u.jsxs("label", {
                                                  className: "to-go__field",
                                                  children: [
                                                      u.jsx("span", {
                                                          children: "Notes",
                                                      }),
                                                      u.jsx("textarea", {
                                                          value:
                                                              De.description ??
                                                              "",
                                                          onChange: (me) =>
                                                              Ye(
                                                                  M,
                                                                  me.target
                                                                      .value
                                                              ),
                                                          placeholder:
                                                              "Add optional notes",
                                                          rows: 2,
                                                          disabled: ut,
                                                      }),
                                                  ],
                                              }),
                                              u.jsxs("label", {
                                                  className: "to-go__field",
                                                  children: [
                                                      u.jsx("span", {
                                                          children:
                                                              "Place ID (optional)",
                                                      }),
                                                      u.jsx("input", {
                                                          type: "text",
                                                          value:
                                                              De.placeId ?? "",
                                                          onChange: (me) =>
                                                              y(
                                                                  M,
                                                                  me.target
                                                                      .value
                                                              ),
                                                          placeholder:
                                                              "ChIJ...",
                                                          disabled: ut,
                                                      }),
                                                  ],
                                              }),
                                              u.jsxs("div", {
                                                  className:
                                                      "to-go__field-grid",
                                                  children: [
                                                      u.jsxs("label", {
                                                          className:
                                                              "to-go__field to-go__field--compact",
                                                          children: [
                                                              u.jsx("span", {
                                                                  children:
                                                                      "Days",
                                                              }),
                                                              u.jsx("input", {
                                                                  type: "number",
                                                                  min: "0",
                                                                  value:
                                                                      De.timeToSpendDays ??
                                                                      "",
                                                                  onChange: (
                                                                      me
                                                                  ) =>
                                                                      L(
                                                                          M,
                                                                          "timeToSpendDays",
                                                                          me
                                                                              .target
                                                                              .value
                                                                      ),
                                                                  placeholder:
                                                                      "0",
                                                                  disabled: ut,
                                                              }),
                                                          ],
                                                      }),
                                                      u.jsxs("label", {
                                                          className:
                                                              "to-go__field to-go__field--compact",
                                                          children: [
                                                              u.jsx("span", {
                                                                  children:
                                                                      "Hours",
                                                              }),
                                                              u.jsx("input", {
                                                                  type: "number",
                                                                  min: "0",
                                                                  max: "23",
                                                                  value:
                                                                      De.timeToSpendHours ??
                                                                      "",
                                                                  onChange: (
                                                                      me
                                                                  ) =>
                                                                      L(
                                                                          M,
                                                                          "timeToSpendHours",
                                                                          me
                                                                              .target
                                                                              .value
                                                                      ),
                                                                  placeholder:
                                                                      "0",
                                                                  disabled: ut,
                                                              }),
                                                          ],
                                                      }),
                                                      u.jsxs("label", {
                                                          className:
                                                              "to-go__field to-go__field--compact",
                                                          children: [
                                                              u.jsx("span", {
                                                                  children:
                                                                      "Minutes",
                                                              }),
                                                              u.jsx("input", {
                                                                  type: "number",
                                                                  min: "0",
                                                                  max: "59",
                                                                  value:
                                                                      De.timeToSpendMinutes ??
                                                                      "",
                                                                  onChange: (
                                                                      me
                                                                  ) =>
                                                                      L(
                                                                          M,
                                                                          "timeToSpendMinutes",
                                                                          me
                                                                              .target
                                                                              .value
                                                                      ),
                                                                  placeholder:
                                                                      "0",
                                                                  disabled: ut,
                                                              }),
                                                          ],
                                                      }),
                                                      u.jsx("button", {
                                                          type: "button",
                                                          className:
                                                              "to-go__action to-go__action--ghost",
                                                          onClick: () => T(M),
                                                          disabled: ut,
                                                          children:
                                                              "Clear time",
                                                      }),
                                                  ],
                                              }),
                                              u.jsx("div", {
                                                  className:
                                                      "to-go__field-grid to-go__field-grid--address",
                                                  children: u.jsxs("label", {
                                                      className: "to-go__field",
                                                      children: [
                                                          u.jsx("span", {
                                                              children:
                                                                  "Address",
                                                          }),
                                                          u.jsx("input", {
                                                              type: "text",
                                                              value:
                                                                  De.description ??
                                                                  "",
                                                              onChange: (me) =>
                                                                  Ye(
                                                                      M,
                                                                      me.target
                                                                          .value
                                                                  ),
                                                              placeholder:
                                                                  "123 Example St, Vancouver, BC",
                                                              disabled: ut,
                                                          }),
                                                      ],
                                                  }),
                                              }),
                                          ],
                                      }),
                                  ],
                              },
                              `${(e == null ? void 0 : e.id) ?? "plan"}-${M}`
                          );
                      })
                    : u.jsxs("li", {
                          className: "to-go__empty",
                          children: [
                              u.jsx("p", {
                                  children:
                                      "No stops yet. Start building your itinerary.",
                              }),
                              u.jsx("button", {
                                  type: "button",
                                  className:
                                      "to-go__button to-go__button--secondary",
                                  onClick: A,
                                  disabled: !_,
                                  children: "Add the first stop",
                              }),
                          ],
                      }),
            }),
        ],
    });
}
const xm = ({
        plans: e,
        folders: t,
        onCreateFolder: n,
        onAssignPlan: r,
        onRemovePlan: l,
        onUpdatePlanTitle: i,
        onUpdatePlanDate: o,
        onDeletePlan: s,
    }) => {
        var E;
        const [a, f] = k.useState(
                ((E = t[0]) == null ? void 0 : E.id) ?? "all"
            ),
            [h, m] = k.useState(""),
            [v, _] = k.useState(!1),
            [S, N] = k.useState(""),
            K = k.useRef(null);
        k.useEffect(() => {
            if (!t.length) {
                f("all");
                return;
            }
            t.some((w) => w.id === a) || f(t[0].id);
        }, [t, a]);
        const p = t.find((w) => w.id === a) ?? t[0],
            d = k.useMemo(() => {
                const w = h.trim().toLowerCase(),
                    R =
                        a === "all"
                            ? e
                            : e.filter((O) =>
                                  p == null ? void 0 : p.planIds.includes(O.id)
                              );
                return w
                    ? R.filter(
                          (O) =>
                              O.title.toLowerCase().includes(w) ||
                              O.summary.toLowerCase().includes(w)
                      )
                    : R;
            }, [e, a, p, h]),
            c = k.useMemo(() => t.filter((w) => w.id !== "all"), [t]);
        k.useEffect(() => {
            v && K.current && K.current.focus();
        }, [v]);
        const g = () => {
                _(!0), N("");
            },
            x = () => {
                const w = n(S);
                w && (f(w), _(!1), N(""));
            };
        return u.jsxs("div", {
            className: "manager",
            children: [
                u.jsxs("aside", {
                    className: "manager__sidebar",
                    children: [
                        u.jsxs("div", {
                            className: "manager__sidebar-header",
                            children: [
                                u.jsx("h2", { children: "Folders" }),
                                v
                                    ? null
                                    : u.jsx("button", {
                                          type: "button",
                                          className: "manager__add-folder",
                                          onClick: g,
                                          children: "+ New Folder",
                                      }),
                            ],
                        }),
                        v
                            ? u.jsxs("div", {
                                  className: "manager__folder-form",
                                  children: [
                                      u.jsx("input", {
                                          ref: K,
                                          type: "text",
                                          value: S,
                                          onChange: (w) => N(w.target.value),
                                          placeholder: "Folder name",
                                          className: "manager__folder-input",
                                          onKeyDown: (w) => {
                                              w.key === "Enter" &&
                                                  S.trim() &&
                                                  (w.preventDefault(), x()),
                                                  w.key === "Escape" &&
                                                      (_(!1), N(""));
                                          },
                                      }),
                                      u.jsxs("div", {
                                          className: "manager__folder-actions",
                                          children: [
                                              u.jsx("button", {
                                                  type: "button",
                                                  className:
                                                      "manager__folder-cancel",
                                                  onClick: () => {
                                                      _(!1), N("");
                                                  },
                                                  children: "Cancel",
                                              }),
                                              u.jsx("button", {
                                                  type: "button",
                                                  className:
                                                      "manager__folder-save",
                                                  onClick: x,
                                                  disabled: !S.trim(),
                                                  children: "Save",
                                              }),
                                          ],
                                      }),
                                  ],
                              })
                            : null,
                        u.jsx("ul", {
                            className: "manager__folder-list",
                            children: t.map((w) => {
                                const R =
                                        w.id === "all"
                                            ? e.length
                                            : w.planIds.length,
                                    O = w.id === a;
                                return u.jsx(
                                    "li",
                                    {
                                        children: u.jsxs("button", {
                                            type: "button",
                                            className: O
                                                ? "manager__folder manager__folder--active"
                                                : "manager__folder",
                                            onClick: () => f(w.id),
                                            children: [
                                                u.jsx("span", {
                                                    children: w.name,
                                                }),
                                                u.jsx("span", {
                                                    className:
                                                        "manager__folder-count",
                                                    children: R,
                                                }),
                                            ],
                                        }),
                                    },
                                    w.id
                                );
                            }),
                        }),
                    ],
                }),
                u.jsxs("main", {
                    className: "manager__main",
                    children: [
                        u.jsxs("div", {
                            className: "manager__toolbar",
                            children: [
                                u.jsxs("div", {
                                    children: [
                                        u.jsx("h2", {
                                            children:
                                                (p == null ? void 0 : p.name) ??
                                                "Plans",
                                        }),
                                        u.jsx("p", {
                                            className: "manager__hint",
                                            children:
                                                a === "all"
                                                    ? "Browse every itinerary you have saved."
                                                    : "Manage which plans live in this folder.",
                                        }),
                                    ],
                                }),
                                u.jsx("input", {
                                    type: "search",
                                    className: "manager__search",
                                    value: h,
                                    onChange: (w) => m(w.target.value),
                                    placeholder: "Search plans...",
                                }),
                            ],
                        }),
                        u.jsx("div", {
                            className: "manager__plan-grid",
                            children: d.length
                                ? d.map((w) => {
                                      const R = c.filter((F) =>
                                              F.planIds.includes(w.id)
                                          ),
                                          O =
                                              a !== "all" &&
                                              R.some((F) => F.id === a),
                                          C = c.filter(
                                              (F) => !F.planIds.includes(w.id)
                                          );
                                      return u.jsxs(
                                          "article",
                                          {
                                              className: "manager__plan-card",
                                              children: [
                                                  u.jsxs("header", {
                                                      className:
                                                          "manager__plan-header",
                                                      children: [
                                                          u.jsxs("div", {
                                                              className:
                                                                  "manager__plan-title-row",
                                                              children: [
                                                                  u.jsx(
                                                                      "input",
                                                                      {
                                                                          type: "text",
                                                                          className:
                                                                              "manager__plan-title-input",
                                                                          value: w.title,
                                                                          onChange:
                                                                              (
                                                                                  F
                                                                              ) =>
                                                                                  i &&
                                                                                  i(
                                                                                      w.id,
                                                                                      F
                                                                                          .target
                                                                                          .value
                                                                                  ),
                                                                          placeholder:
                                                                              "Untitled Plan",
                                                                      }
                                                                  ),
                                                                  u.jsx(
                                                                      "button",
                                                                      {
                                                                          type: "button",
                                                                          className:
                                                                              "manager__plan-delete",
                                                                          title: "Delete plan",
                                                                          onClick:
                                                                              () =>
                                                                                  s &&
                                                                                  s(
                                                                                      w.id
                                                                                  ),
                                                                          children:
                                                                              "-",
                                                                      }
                                                                  ),
                                                              ],
                                                          }),
                                                          u.jsx("div", {
                                                              className:
                                                                  "manager__plan-date",
                                                              children: u.jsx(
                                                                  "input",
                                                                  {
                                                                      type: "date",
                                                                      value: new Date(
                                                                          w.createdAt
                                                                      )
                                                                          .toISOString()
                                                                          .slice(
                                                                              0,
                                                                              10
                                                                          ),
                                                                      onChange:
                                                                          (F) =>
                                                                              o &&
                                                                              o(
                                                                                  w.id,
                                                                                  F
                                                                                      .target
                                                                                      .value
                                                                              ),
                                                                      className:
                                                                          "manager__plan-date-input",
                                                                  }
                                                              ),
                                                          }),
                                                      ],
                                                  }),
                                                  u.jsx("p", {
                                                      className:
                                                          "manager__plan-summary",
                                                      children:
                                                          w.summary ||
                                                          "Add a short summary to describe this route.",
                                                  }),
                                                  u.jsx("div", {
                                                      className:
                                                          "manager__plan-meta",
                                                      children: u.jsxs("span", {
                                                          children: [
                                                              w.stops.length,
                                                              " stops",
                                                          ],
                                                      }),
                                                  }),
                                                  R.length
                                                      ? u.jsx("div", {
                                                            className:
                                                                "manager__plan-tags",
                                                            children: R.map(
                                                                (F) =>
                                                                    u.jsx(
                                                                        "span",
                                                                        {
                                                                            className:
                                                                                "manager__plan-tag",
                                                                            children:
                                                                                F.name,
                                                                        },
                                                                        F.id
                                                                    )
                                                            ),
                                                        })
                                                      : u.jsx("div", {
                                                            className:
                                                                "manager__plan-tags manager__plan-tags--empty",
                                                            children:
                                                                "Unassigned",
                                                        }),
                                                  u.jsxs("div", {
                                                      className:
                                                          "manager__plan-actions",
                                                      children: [
                                                          u.jsxs("select", {
                                                              className:
                                                                  "manager__plan-select",
                                                              defaultValue: "",
                                                              onChange: (F) => {
                                                                  const G =
                                                                      F.target
                                                                          .value;
                                                                  G &&
                                                                      (r(
                                                                          G,
                                                                          w.id
                                                                      ),
                                                                      (F.target.value =
                                                                          ""));
                                                              },
                                                              children: [
                                                                  u.jsx(
                                                                      "option",
                                                                      {
                                                                          value: "",
                                                                          disabled:
                                                                              !0,
                                                                          children:
                                                                              "Add to folder…",
                                                                      }
                                                                  ),
                                                                  C.length
                                                                      ? C.map(
                                                                            (
                                                                                F
                                                                            ) =>
                                                                                u.jsx(
                                                                                    "option",
                                                                                    {
                                                                                        value: F.id,
                                                                                        children:
                                                                                            F.name,
                                                                                    },
                                                                                    F.id
                                                                                )
                                                                        )
                                                                      : u.jsx(
                                                                            "option",
                                                                            {
                                                                                value: "",
                                                                                disabled:
                                                                                    !0,
                                                                                children:
                                                                                    "No available folders",
                                                                            }
                                                                        ),
                                                              ],
                                                          }),
                                                          u.jsx("button", {
                                                              type: "button",
                                                              className:
                                                                  "manager__plan-remove",
                                                              disabled: !O,
                                                              onClick: () =>
                                                                  O &&
                                                                  l(a, w.id),
                                                              children:
                                                                  "Remove from folder",
                                                          }),
                                                      ],
                                                  }),
                                              ],
                                          },
                                          w.id
                                      );
                                  })
                                : u.jsx("div", {
                                      className: "manager__empty",
                                      children: h
                                          ? "No plans match your search in this folder."
                                          : "No plans in this folder yet.",
                                  }),
                        }),
                    ],
                }),
            ],
        });
    },
    km = ({ profile: e, onUpdateProfile: t }) => {
        var a;
        const [n, r] = k.useState(e),
            [l, i] = k.useState(!1),
            o = (f, h) => {
                r((m) => ({ ...m, [f]: h })), i(!1);
            },
            s = () => {
                t(n), i(!0);
            };
        return u.jsxs("div", {
            className: "admin",
            children: [
                u.jsxs("aside", {
                    className: "admin__sidebar",
                    children: [
                        u.jsx("div", {
                            className: "admin__avatar",
                            children:
                                ((a = n.name) == null
                                    ? void 0
                                    : a.slice(0, 1)) || "U",
                        }),
                        u.jsxs("div", {
                            className: "admin__sidebar-info",
                            children: [
                                u.jsx("h2", {
                                    children: n.name || "Your name",
                                }),
                                u.jsx("p", {
                                    children: n.email || "Add contact email",
                                }),
                            ],
                        }),
                    ],
                }),
                u.jsxs("main", {
                    className: "admin__content",
                    children: [
                        u.jsxs("header", {
                            className: "admin__header",
                            children: [
                                u.jsxs("div", {
                                    children: [
                                        u.jsx("h1", {
                                            children: "Account Settings",
                                        }),
                                        u.jsx("p", {
                                            className: "admin__subtitle",
                                            children:
                                                "Update your information so teammates know who owns these plans.",
                                        }),
                                    ],
                                }),
                                u.jsx("button", {
                                    type: "button",
                                    className: "admin__save",
                                    onClick: s,
                                    children: "Save changes",
                                }),
                            ],
                        }),
                        u.jsxs("section", {
                            className: "admin__section",
                            children: [
                                u.jsx("h3", { children: "Basic Info" }),
                                u.jsxs("div", {
                                    className: "admin__form-grid",
                                    children: [
                                        u.jsxs("label", {
                                            className: "admin__field",
                                            children: [
                                                u.jsx("span", {
                                                    children: "Full name",
                                                }),
                                                u.jsx("input", {
                                                    type: "text",
                                                    value: n.name,
                                                    onChange: (f) =>
                                                        o(
                                                            "name",
                                                            f.target.value
                                                        ),
                                                    placeholder: "Your name",
                                                }),
                                            ],
                                        }),
                                        u.jsxs("label", {
                                            className: "admin__field",
                                            children: [
                                                u.jsx("span", {
                                                    children: "Email",
                                                }),
                                                u.jsx("input", {
                                                    type: "email",
                                                    value: n.email,
                                                    onChange: (f) =>
                                                        o(
                                                            "email",
                                                            f.target.value
                                                        ),
                                                    placeholder:
                                                        "you@example.com",
                                                }),
                                            ],
                                        }),
                                        u.jsxs("label", {
                                            className:
                                                "admin__field admin__field--full",
                                            children: [
                                                u.jsx("span", {
                                                    children: "Home base",
                                                }),
                                                u.jsx("input", {
                                                    type: "text",
                                                    value: n.homeCity,
                                                    onChange: (f) =>
                                                        o(
                                                            "homeCity",
                                                            f.target.value
                                                        ),
                                                    placeholder:
                                                        "City, Country",
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        u.jsxs("section", {
                            className: "admin__section",
                            children: [
                                u.jsx("h3", { children: "Bio" }),
                                u.jsx("label", {
                                    className:
                                        "admin__field admin__field--full",
                                    children: u.jsx("textarea", {
                                        rows: 4,
                                        value: n.bio ?? "",
                                        onChange: (f) =>
                                            o("bio", f.target.value),
                                        placeholder:
                                            "Tell collaborators about your travel style, favourite routes, or planning preferences.",
                                    }),
                                }),
                            ],
                        }),
                        l
                            ? u.jsx("p", {
                                  className: "admin__success",
                                  children: "Profile saved ✓",
                              })
                            : null,
                    ],
                }),
            ],
        });
    },
    nl = "/api";
function Nm() {
    const [e, t] = k.useState([]),
        [n, r] = k.useState(""),
        [l, i] = k.useState(null),
        [o, s] = k.useState(!0),
        [a, f] = k.useState(null),
        [h, m] = k.useState(null),
        [v, _] = k.useState(!1),
        [S, N] = k.useState(null),
        [K, p] = k.useState([]),
        [d, c] = k.useState("planner"),
        [g, x] = k.useState([{ id: "all", name: "All Plans", planIds: [] }]),
        [E, w] = k.useState("all"),
        [R, O] = k.useState({
            name: "Jamie Hoang",
            email: "jamie.hoang@example.com",
            homeCity: "Vancouver, BC",
            bio: "Train-hopping foodie who loves scenic detours.",
        });
    k.useEffect(() => {
        g.some((P) => P.id === E) || w("all");
    }, [g, E]);
    const [C, F] = k.useState(null),
        [G, ee] = k.useState(!1),
        Ee = k.useRef(0),
        X = k.useMemo(() => e.find((P) => P.id === n) ?? null, [e, n]),
        ne = C ?? X,
        Ye = k.useMemo(() => (ne == null ? void 0 : ne.stops) ?? [], [ne]),
        y = k.useMemo(
            () =>
                !ne || !S || S.planId !== ne.id ? null : Ye[S.index] ?? null,
            [ne, Ye, S]
        ),
        L = k.useMemo(
            () => (!ne || !S ? null : S.planId === ne.id ? S.index : null),
            [ne, S]
        );
    k.useEffect(() => {
        if (!X) {
            C !== null && F(null), ee(!1);
            return;
        }
        if (C && C.id === X.id) {
            const P =
                C.title !== X.title ||
                C.summary !== X.summary ||
                C.createdAt !== X.createdAt;
            if (G) {
                P &&
                    F({
                        ...C,
                        title: X.title,
                        summary: X.summary,
                        createdAt: X.createdAt,
                    });
                return;
            }
            (P || C.stops.length !== X.stops.length) && F(rl(X));
            return;
        }
        F(rl(X)), ee(!1);
    }, [X, C, G]);
    const [T, B] = k.useState(!1);
    k.useEffect(() => {
        d !== "planner" && B(!1);
    }, [d]),
        k.useEffect(() => {
            async function P() {
                try {
                    const $ = await fetch(`${nl}/plans`);
                    if (!$.ok) throw new Error("Unable to load travel plans");
                    const I = (await $.json()).options.map(Ga);
                    t(I),
                        r((V) => {
                            var Q;
                            return (
                                V ||
                                (((Q = I[0]) == null ? void 0 : Q.id) ?? "")
                            );
                        }),
                        N(null),
                        f(null),
                        m(null),
                        p([]),
                        i(null);
                } catch ($) {
                    i(
                        $ instanceof Error
                            ? $.message
                            : "Unexpected error loading plans."
                    );
                } finally {
                    s(!1);
                }
            }
            P();
        }, []),
        k.useEffect(() => {
            x((P) => {
                const $ = e.map((Q) => Q.id),
                    z = new Set($),
                    I = new Map();
                P.forEach((Q) => {
                    I.set(Q.id, {
                        ...Q,
                        planIds:
                            Q.id === "all"
                                ? $
                                : Q.planIds.filter((_e) => z.has(_e)),
                    });
                }),
                    I.has("all")
                        ? I.set("all", {
                              id: "all",
                              name: "All Plans",
                              planIds: $,
                          })
                        : I.set("all", {
                              id: "all",
                              name: "All Plans",
                              planIds: $,
                          });
                const V = Array.from(I.values());
                return (
                    V.sort((Q, _e) =>
                        Q.id === "all"
                            ? -1
                            : _e.id === "all"
                            ? 1
                            : Q.name.localeCompare(_e.name)
                    ),
                    V
                );
            });
        }, [e]),
        k.useEffect(() => {
            if (d !== "planner" || !X || X.stops.length < 2) {
                p([]);
                return;
            }
            let P = !1;
            const $ = X.id;
            async function z() {
                try {
                    const I = await fetch(`${nl}/plan/${$}/route`);
                    if (!I.ok) throw new Error("Failed to load route details");
                    const Q = ((await I.json()).segments ?? []).map(Pm);
                    P || p(Q);
                } catch {
                    P || p([]);
                }
            }
            return (
                z(),
                () => {
                    P = !0;
                }
            );
        }, [X, n, d]);
    const [A, q] = k.useState(""),
        [Z, ie] = k.useState(!1),
        [pe, at] = k.useState(""),
        [W, M] = k.useState(""),
        [U, H] = k.useState(""),
        [oe, ve] = k.useState(""),
        [ze, De] = k.useState([]),
        [Yt, Ct] = k.useState(!1),
        [ni, Dr] = k.useState([]),
        [ut, $r] = k.useState([]),
        [me, od] = k.useState(null),
        [Im, sd] = k.useState(null);
    k.useRef(0), k.useRef(0);
    const Bn = k.useRef(),
        Hn = k.useRef(),
        Vn = k.useRef(),
        Wn = k.useRef(),
        ad = [
            "Food",
            "Museums",
            "Music",
            "Architecture",
            "Nature",
            "Shopping",
            "Nightlife",
            "Scenery",
            "Relaxation",
        ],
        // Start date, end date, and motivations are optional now.
        ri = true;
    k.useEffect(
        () => () => {
            Bn.current && window.clearTimeout(Bn.current),
                Hn.current && window.clearTimeout(Hn.current),
                Vn.current && window.clearTimeout(Vn.current),
                Wn.current && window.clearTimeout(Wn.current);
        },
        []
    );
    const Ns = () => {
            q(""),
                ie(!1),
                at(""),
                M(""),
                H(""),
                ve(""),
                De([]),
                Ct(!1),
                Dr([]),
                $r([]),
                od(null),
                sd(null),
                Bn.current &&
                    (window.clearTimeout(Bn.current), (Bn.current = void 0)),
                Hn.current &&
                    (window.clearTimeout(Hn.current), (Hn.current = void 0)),
                Vn.current &&
                    (window.clearTimeout(Vn.current), (Vn.current = void 0)),
                Wn.current &&
                    (window.clearTimeout(Wn.current), (Wn.current = void 0));
        },
        Es = () =>
            typeof crypto < "u" && typeof crypto.randomUUID == "function"
                ? "local-" + crypto.randomUUID()
                : "local-" + Math.random().toString(36).slice(2, 10),
        ud = (P, $) => {
            t((z) => z.map((I) => (I.id === P ? { ...I, title: $ || "" } : I)));
        },
        cd = (P, $) => {
            t((z) =>
                z.map((I) => (I.id === P ? { ...I, summary: $ || "" } : I))
            );
        },
        dd = async () => {
            if ((Ct(!0), !ri)) return;
            const P = A.trim(),
                $ = Es(),
                z = [];
            U && oe && z.push(`Dates: ${U} → ${oe}.`),
                ze.length && z.push(`Focus: ${ze.join(", ")}.`);
            const I = {
                id: $,
                title: P || "Untitled Plan",
                summary: z.join(" ") || "Blank plan",
                stops: [],
                createdAt: new Date().toISOString(),
            };
            t((V) => [I, ...V]),
                r(I.id),
                N(null),
                f(null),
                m(null),
                i(null),
                F(rl(I)),
                ee(!1),
                B(!1),
                Ns();
        },
        fd = () => {
            F((P) => {
                if (!P) return P;
                ee(!0);
                const z = {
                    label: `New Stop ${P.stops.length + 1}`,
                    description: "",
                };
                return { ...P, stops: [...P.stops, z] };
            }),
                p([]);
        },
        pd = (P) => {
            const $ = (C == null ? void 0 : C.id) ?? null;
            if (!$) return;
            const z = S && S.planId === $ ? S.index + 1 : void 0;
            F((I) => {
                if (!I) return I;
                ee(!0);
                const V = {
                        label: P.name,
                        description: P.address ?? "",
                        placeId: P.placeId,
                        latitude: P.latitude,
                        longitude: P.longitude,
                    },
                    Q = z ?? I.stops.length,
                    _e = [...I.stops.slice(0, Q), V, ...I.stops.slice(Q)];
                return { ...I, stops: _e };
            }),
                p([]);
        },
        md = (P, $) => {
            const z = $ == null ? void 0 : $.index;
            if (
                (F((I) => {
                    if (!I) return I;
                    ee(!0);
                    const V =
                            typeof z == "number"
                                ? Math.max(0, Math.min(z, I.stops.length))
                                : I.stops.length,
                        Q = [...I.stops.slice(0, V), P, ...I.stops.slice(V)];
                    return { ...I, stops: Q };
                }),
                p([]),
                $ != null && $.select)
            ) {
                const I = (C == null ? void 0 : C.id) ?? "",
                    V =
                        ($ == null ? void 0 : $.index) ??
                        (C == null ? void 0 : C.stops.length) ??
                        0;
                N({ planId: I, index: V });
            }
        },
        Cs = (P, $) => {
            F((z) => {
                if (!z) return z;
                ee(!0);
                const I = z.stops.map((V, Q) => (Q === P ? { ...V, ...$ } : V));
                return { ...z, stops: I };
            }),
                p([]);
        },
        hd = (P, $) => {
            let z = null,
                I = P,
                V = $;
            if (
                (F((Q) => {
                    if (!Q) return Q;
                    const _e = Q.stops.length - 1;
                    if (
                        _e < 0 ||
                        ((I = Math.max(0, Math.min(I, _e))),
                        (V = Math.max(0, Math.min(V, _e))),
                        I === V)
                    )
                        return Q;
                    z = Q.id;
                    const ht = [...Q.stops],
                        [Be] = ht.splice(I, 1);
                    return ht.splice(V, 0, Be), ee(!0), { ...Q, stops: ht };
                }),
                z !== null)
            ) {
                const Q = z,
                    _e = I,
                    ht = V;
                N((Be) => {
                    if (!Be || Be.planId !== Q) return Be;
                    if (Be.index === _e) return { planId: Q, index: ht };
                    if (_e < ht) {
                        if (Be.index > _e && Be.index <= ht)
                            return { planId: Q, index: Be.index - 1 };
                    } else if (_e > ht && Be.index >= ht && Be.index < _e)
                        return { planId: Q, index: Be.index + 1 };
                    return Be;
                }),
                    p([]);
            }
        },
        js = (P) => {
            if (!C) return;
            const $ = C.id;
            F((z) => {
                if (!z) return z;
                ee(!0);
                const I = z.stops.filter((V, Q) => Q !== P);
                return { ...z, stops: I };
            }),
                N((z) =>
                    !z || z.planId !== $
                        ? z
                        : z.index === P
                        ? null
                        : z.index > P
                        ? { planId: $, index: z.index - 1 }
                        : z
                );
        },
        vd = async () => {
            if (C)
                try {
                    const P = await fetch(`${nl}/plan/${C.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(Em(C)),
                    });
                    if (!P.ok) throw new Error("Failed to save plan");
                    const $ = await P.json(),
                        z = Ga($);
                    t((I) => {
                        const V = I.findIndex((_e) => _e.id === z.id);
                        if (V === -1) return [z, ...I];
                        const Q = [...I];
                        return (Q[V] = z), Q;
                    }),
                        p([]),
                        f(null),
                        m(null),
                        F(rl(z)),
                        ee(!1),
                        i(null);
                } catch (P) {
                    console.error("Failed to save plan updates", P),
                        i("Unable to save plan changes. Please try again.");
                }
        },
        gd = (P) => {
            const $ = P.trim();
            if (!$) return null;
            const z = `folder-${Es()}`;
            let I = !1;
            return (
                x((V) =>
                    V.some((Q) => Q.name.toLowerCase() === $.toLowerCase())
                        ? V
                        : ((I = !0), [...V, { id: z, name: $, planIds: [] }])
                ),
                I ? (w(z), z) : null
            );
        },
        yd = (P, $) => {
            P !== "all" &&
                x((z) =>
                    z.map((I) =>
                        I.id === P
                            ? {
                                  ...I,
                                  planIds: I.planIds.includes($)
                                      ? I.planIds
                                      : [...I.planIds, $],
                              }
                            : I
                    )
                );
        },
        _d = (P, $) => {
            P !== "all" &&
                x((z) =>
                    z.map((I) =>
                        I.id === P
                            ? {
                                  ...I,
                                  planIds: I.planIds.filter((V) => V !== $),
                              }
                            : I
                    )
                );
        },
        wd = (P) => {
            O(($) => ({ ...$, ...P }));
        },
        Sd = (P, $) => {
            t((z) => z.map((I) => (I.id === P ? { ...I, title: $ } : I))),
                C && C.id === P && (F((z) => z && { ...z, title: $ }), ee(!0));
        },
        xd = (P, $) => {
            const z = new Date($).toISOString();
            t((I) => I.map((V) => (V.id === P ? { ...V, createdAt: z } : V))),
                C &&
                    C.id === P &&
                    (F((I) => I && { ...I, createdAt: z }), ee(!0));
        },
        Ps = (P) => {
            t(($) => {
                var I;
                const z = $.filter((V) => V.id !== P);
                if (n === P) {
                    const V = ((I = z[0]) == null ? void 0 : I.id) ?? "";
                    r(V), N(null), f(null), m(null);
                }
                return z;
            }),
                x(($) =>
                    $.map((z) =>
                        z.id === "all"
                            ? z
                            : {
                                  ...z,
                                  planIds: z.planIds.filter((I) => I !== P),
                              }
                    )
                );
        },
        kd = (P, $) => {
            if (!ne) return;
            k.startTransition(() => {
                N({ planId: ne.id, index: $ });
            });
            const z = ++Ee.current;
            _(!0), m(null);
            const I = {
                name: P.label,
                description: P.description,
                latitude: P.latitude,
                longitude: P.longitude,
                place_id: P.placeId,
            };
            (async () => {
                try {
                    const V = await fetch(`${nl}/tripadvisor`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(I),
                    });
                    if (!V.ok)
                        throw new Error("Unable to fetch place details.");
                    const Q = await V.json();
                    Ee.current === z && (f(jm(Q.info)), m(null));
                } catch (V) {
                    Ee.current === z &&
                        (m(
                            V instanceof Error
                                ? V.message
                                : "Unexpected error loading place details."
                        ),
                        f(null));
                } finally {
                    Ee.current === z && _(!1);
                }
            })();
        };
    return (
        k.useEffect(() => {
            (Ee.current += 1), f(null), m(null), _(!1), N(null), p([]);
        }, [n]),
        u.jsxs("div", {
            className: "app",
            children: [
                u.jsxs("header", {
                    className: "app__header",
                    children: [
                        u.jsx("button", {
                            type: "button",
                            className: "app__logo",
                            onClick: () => c("planner"),
                            children: "Pathfinder",
                        }),
                        u.jsxs("div", {
                            className: "app__header-actions",
                            children: [
                                d !== "planner"
                                    ? u.jsx("button", {
                                          type: "button",
                                          className: "app__nav-button",
                                          onClick: () => c("planner"),
                                          children: "Back to Planner",
                                      })
                                    : u.jsx("button", {
                                          type: "button",
                                          className: "app__nav-button",
                                          onClick: () => c("manager"),
                                          children: "Manage Plans",
                                      }),
                                d === "planner"
                                    ? u.jsx("button", {
                                          type: "button",
                                          className: "info__create",
                                          onClick: () => B(!0),
                                          disabled: o,
                                          children: "Create New Plan",
                                      })
                                    : null,
                                u.jsx("button", {
                                    type: "button",
                                    className:
                                        d === "admin"
                                            ? "app__profile-button app__profile-button--active"
                                            : "app__profile-button",
                                    onClick: () => c("admin"),
                                    "aria-label": "Open profile settings",
                                    children: u.jsx("span", {
                                        className: "app__profile-icon",
                                        "aria-hidden": !0,
                                        children: u.jsxs("svg", {
                                            viewBox: "0 0 24 24",
                                            focusable: "false",
                                            children: [
                                                u.jsx("circle", {
                                                    cx: "12",
                                                    cy: "8",
                                                    r: "4",
                                                }),
                                                u.jsx("path", {
                                                    d: "M4 19c0-3.3137 3.134-6 7-6h2c3.866 0 7 2.6863 7 6v1H4v-1z",
                                                }),
                                            ],
                                        }),
                                    }),
                                }),
                            ],
                        }),
                    ],
                }),
                d === "planner" &&
                    T &&
                    u.jsx("div", {
                        className: "modal-overlay",
                        children: u.jsxs("div", {
                            className: "modal",
                            role: "dialog",
                            "aria-modal": "true",
                            "aria-labelledby": "create-plan-title",
                            children: [
                                u.jsx("div", {
                                    className: "modal__title",
                                    children: Z
                                        ? u.jsx("input", {
                                              type: "text",
                                              value: A,
                                              onChange: (P) =>
                                                  q(P.target.value),
                                              onBlur: () => ie(!1),
                                              onKeyDown: (P) => {
                                                  P.key === "Enter" && ie(!1);
                                              },
                                              autoFocus: !0,
                                              className: "modal__title-input",
                                              placeholder: "Enter plan name...",
                                          })
                                        : u.jsx("span", {
                                              id: "create-plan-title",
                                              className: "modal__title-text",
                                              onClick: () => ie(!0),
                                              children: A || "Untitled Plan",
                                          }),
                                }),
                                u.jsxs("div", {
                                    className: "modal__fields",
                                    children: [
                                        u.jsxs("div", {
                                            className: "modal__row",
                                            children: [
                                                u.jsx("label", {
                                                    children: "Start Date:",
                                                }),
                                                u.jsx("input", {
                                                    type: "date",
                                                    value: U,
                                                    onChange: (P) =>
                                                        H(P.target.value),
                                                }),
                                            ],
                                        }),
                                        u.jsxs("div", {
                                            className: "modal__row",
                                            children: [
                                                u.jsx("label", {
                                                    children: "End Date:",
                                                }),
                                                u.jsx("input", {
                                                    type: "date",
                                                    value: oe,
                                                    onChange: (P) =>
                                                        ve(P.target.value),
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                                u.jsxs("div", {
                                    className: "modal__motivation",
                                    children: [
                                        u.jsx("p", {
                                            children: "Trip Motivation:",
                                        }),
                                        u.jsx("div", {
                                            className: "modal__motivation-list",
                                            children: ad.map((P) =>
                                                u.jsx(
                                                    "button",
                                                    {
                                                        onClick: () =>
                                                            De(
                                                                ze.includes(P)
                                                                    ? ze.filter(
                                                                          ($) =>
                                                                              $ !==
                                                                              P
                                                                      )
                                                                    : [...ze, P]
                                                            ),
                                                        className: `modal__motivation-btn ${
                                                            ze.includes(P)
                                                                ? "selected"
                                                                : ""
                                                        }`,
                                                        children: P,
                                                    },
                                                    P
                                                )
                                            ),
                                        }),
                                    ],
                                }),
                                u.jsxs("div", {
                                    className: "modal__actions",
                                    children: [
                                        u.jsx("button", {
                                            className: "btn btn--secondary",
                                            onClick: () => {
                                                B(!1), Ns();
                                            },
                                            children: "Cancel",
                                        }),
                                        u.jsx("button", {
                                            className: "btn btn--primary",
                                            onClick: dd,
                                            disabled: !ri,
                                            children: "Save Plan",
                                        }),
                                    ],
                                }),
                                /* Dates and motivations are optional now. */
                            ],
                        }),
                    }),
                d === "planner"
                    ? u.jsxs("div", {
                          className: "app__layout",
                          children: [
                              u.jsx("aside", {
                                  className: "app__summary",
                                  children: u.jsx(dm, {
                                      plan: X,
                                      plans: e,
                                      folders: g,
                                      selectedFolderId: E,
                                      onSelectFolder: w,
                                      selectedPlanId: n,
                                      onSelectPlan: r,
                                      onUpdatePlanTitle: ud,
                                      onUpdatePlanSummary: cd,
                                      onDeletePlan: Ps,
                                      routeSegments: K,
                                  }),
                              }),
                              u.jsxs("section", {
                                  className: "app__content",
                                  children: [
                                      u.jsxs("div", {
                                          className: "app__primary",
                                          children: [
                                              u.jsx("div", {
                                                  className: "app__map",
                                                  children: u.jsx(im, {
                                                      plan: X,
                                                  }),
                                              }),
                                              u.jsx("div", {
                                                  className: "app__to-go",
                                                  children: u.jsx(Sm, {
                                                      plan: X,
                                                      draftStops:
                                                          (C == null
                                                              ? void 0
                                                              : C.stops) ??
                                                          null,
                                                      isLoading: o,
                                                      onSelectStop: kd,
                                                      selectedStopIndex: L,
                                                      onAddStop: C
                                                          ? fd
                                                          : void 0,
                                                      onUpdateStop: C
                                                          ? Cs
                                                          : void 0,
                                                      onRemoveStop: C
                                                          ? js
                                                          : void 0,
                                                      onSave: C ? vd : void 0,
                                                      hasPendingChanges: G,
                                                  }),
                                              }),
                                          ],
                                      }),
                                      u.jsx(fm, {
                                          selectedStop: y,
                                          info: a,
                                          isLoading: v,
                                          error: h,
                                          stops:
                                              (C == null ? void 0 : C.stops) ??
                                              (X == null ? void 0 : X.stops) ??
                                              [],
                                          onAddSuggestion: C ? pd : void 0,
                                      }),
                                  ],
                              }),
                              u.jsx("aside", {
                                  className: "app__assistant",
                                  children: u.jsx(ym, {
                                      planTitle:
                                          (ne == null ? void 0 : ne.title) ??
                                          null,
                                      selectedStop: y,
                                      selectedStopIndex: L,
                                      stops:
                                          (C == null ? void 0 : C.stops) ?? Ye,
                                      onAddStop: C ? md : void 0,
                                      onUpdateStop: C ? Cs : void 0,
                                      onRemoveStop: C ? js : void 0,
                                      onMoveStop: C ? hd : void 0,
                                  }),
                              }),
                          ],
                      })
                    : d === "manager"
                    ? u.jsx(xm, {
                          plans: e,
                          folders: g,
                          onCreateFolder: gd,
                          onAssignPlan: yd,
                          onRemovePlan: _d,
                          onUpdatePlanTitle: Sd,
                          onUpdatePlanDate: xd,
                          onDeletePlan: Ps,
                      })
                    : u.jsx(km, { profile: R, onUpdateProfile: wd }),
            ],
        })
    );
}
function Em(e) {
    return {
        id: e.id,
        title: e.title,
        summary: e.summary,
        createdAt: e.createdAt,
        stops: e.stops.map(Cm),
    };
}
function Cm(e) {
    return {
        label: e.label,
        description: e.description ?? "",
        place_id: e.placeId ?? null,
        latitude: typeof e.latitude == "number" ? e.latitude : null,
        longitude: typeof e.longitude == "number" ? e.longitude : null,
    };
}
function rl(e) {
    return {
        ...e,
        stops: e.stops.map((t, n) => ({
            ...t,
            __originalIndex:
                typeof t.__originalIndex == "number" ? t.__originalIndex : n,
        })),
    };
}
function Ga(e) {
    return {
        id: e.id,
        title: e.title,
        summary: e.summary,
        createdAt: e.createdAt,
        stops: e.stops.map((t, n) => ({
            label: t.label,
            description: t.description ?? void 0,
            placeId: t.placeId ?? t.place_id ?? void 0,
            latitude: typeof t.latitude == "number" ? t.latitude : void 0,
            longitude: typeof t.longitude == "number" ? t.longitude : void 0,
            timeToSpendDays:
                typeof t.timeToSpendDays == "number"
                    ? t.timeToSpendDays
                    : void 0,
            timeToSpendHours:
                typeof t.timeToSpendHours == "number"
                    ? t.timeToSpendHours
                    : void 0,
            timeToSpendMinutes:
                typeof t.timeToSpendMinutes == "number"
                    ? t.timeToSpendMinutes
                    : void 0,
            __originalIndex: n,
        })),
    };
}
function jm(e) {
    var t, n;
    return {
        id: e.id,
        name: e.name,
        city: e.city,
        country: e.country,
        address: e.address,
        summary: e.summary,
        nearbyRestaurants: e.nearby_restaurants.map(zi),
        nearbyHotels: e.nearby_hotels.map(zi),
        nearbyAttractions: e.nearby_attractions.map(zi),
        latitude: (t = e.coordinates) == null ? void 0 : t.latitude,
        longitude: (n = e.coordinates) == null ? void 0 : n.longitude,
    };
}
function zi(e) {
    return {
        name: e.name,
        rating: e.rating,
        totalRatings: e.total_ratings,
        address: e.address,
        priceLevel: e.price_level,
        openNow: e.open_now,
        types: e.types ?? [],
        placeId: e.place_id,
        latitude: e.latitude,
        longitude: e.longitude,
    };
}
function Pm(e) {
    return {
        fromIndex: e.from_index,
        toIndex: e.to_index,
        mode: e.mode,
        durationText: e.duration_text,
        distanceText: e.distance_text,
        instructions: e.instructions,
        agency: e.agency,
        lineName: e.line_name,
    };
}
Di.createRoot(document.getElementById("root")).render(
    u.jsx(Ud.StrictMode, { children: u.jsx(Nm, {}) })
);
