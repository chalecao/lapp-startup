(function () {
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function (e) {
  return typeof e === "undefined" ? "undefined" : _typeof2(e);
} : function (e) {
  return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof2(e);
},
    isType = function isType(e) {
  return function (t) {
    return (void 0 === t ? "undefined" : _typeof(t)) === e;
  };
},
    isVType = function isVType(e) {
  return function (t) {
    return t.type === e;
  };
},
    isUndefined = function isUndefined(e) {
  return isType("undefined")(e) && void 0 == e;
},
    isString = isType("string"),
    isBool = isType("boolean"),
    isNumber = isType("number"),
    isFunction = function isFunction(e) {
  return e.toString().match("function");
},
    isClass = function isClass(e) {
  return e.toString().match("class ");
},
    isNull = function isNull(e) {
  return null === e;
},
    isNative = isVType("native"),
    isThunk = isVType("thunk"),
    isText = isVType("text"),
    isArray = Array.isArray,
    isSameThunk = function isSameThunk(e, t) {
  return e.fn === t.fn;
},
    isSVG = function isSVG(e) {
  return ["svg", "path", "animate"].indexOf(e) >= 0;
},
    isEventProp = function isEventProp(e) {
  return (/^on/.test(e)
  );
},
    extractEventName = function extractEventName(e) {
  return e.slice(2).toLowerCase();
};function _toConsumableArray(e) {
  if (Array.isArray(e)) {
    for (var t = 0, n = Array(e.length); t < e.length; t++) {
      n[t] = e[t];
    }return n;
  }return Array.from(e);
}function createNode(e) {
  for (var t = arguments, n = arguments.length, r = Array(n > 2 ? n - 2 : 0), i = 2; i < n; i++) {
    r[i - 2] = t[i];
  }var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};if (e) return r = Array.prototype.reduce.call(r, reduceChildren, []), isFunction(e) ? createThunk(e, o, r, e) : { type: "native", tagName: e, attributes: o, children: r };
}function createThunk(e, t, n, r) {
  return { type: "thunk", fn: e, props: t, children: n, options: r };
}function createText(e) {
  return { type: e ? "text" : "empty", nodeValue: e };
}function reduceChildren(e, t) {
  return isString(t) || isNumber(t) ? e.push(createText(t)) : isNull(t) || isUndefined(t) ? e.push(createText()) : isArray(t) ? e = [].concat(_toConsumableArray(e), _toConsumableArray(t.reduce(reduceChildren, []))) : e.push(t), e;
}function operBooleanProp(e, t, n, r) {
  n ? (e[r](t, n), e[t] = !0) : (e[r](t), e[t] = !1);
}function operAttribute(e, t, n, r) {
  isEventProp(t) || ("className" === t ? e[r]("class", n) : isBool(n) ? operBooleanProp(e, t, n, r) : void 0 != n && n.length ? e[r](t, n) : e.removeAttribute(t));
}function updateAttribute(e, t, n, r) {
  n ? r && n === r || operAttribute(e, t, n, "setAttribute") : operAttribute(e, t, isBool(n) ? n : r, "removeAttribute");
}function updateAttributes(e, t) {
  var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
      r = Object.assign({}, n, t);Object.keys(r).forEach(function (r) {
    !isEventProp(r) && updateAttribute(e, r, t[r], n[r]);
  });
}function addEventListeners(e, t) {
  t && Object.keys(t).forEach(function (n) {
    isEventProp(n) && e.addEventListener(extractEventName(n), t[n]);
  });
}function createTextNode(e) {
  var t = isString(e) || isNumber(e) ? e : "";return document.createTextNode(t);
}function createThunk$1(e, t) {
  var n = e.props,
      r = e.children,
      i = e.options.onCreate,
      o = { children: r, props: n },
      u = void 0,
      a = void 0;if (isClass(e.fn)) u = (a = new e.fn()).render(o), a.$update = a.$update.bind(this, function () {
    t && t("updateAll");
  });else try {
    u = e.fn(o);
  } catch (n) {
    u = (a = new e.fn()).render(o), a.$update = a.$update.bind(this, function () {
      t && t("updateAll");
    });
  }if (!u) return "";var d = createElement(u);return addEventListeners(d, u.attributes), i && i(o), e.state = { vnode: u, $ins: a, model: o }, d;
}function createSVGElement(e) {
  return document.createElementNS("http://www.w3.org/2000/svg", e);
}function createHTMLElement(e, t) {
  var n = isSVG(e.tagName) ? createSVGElement(e.tagName) : document.createElement(e.tagName);return e.attributes && updateAttributes(n, e.attributes), e.attributes && addEventListeners(n, e.attributes), e.children.map(function (e) {
    return createElement(e, t);
  }).forEach(n.appendChild.bind(n)), n;
}function createEmptyHTMLElement() {
  return document.createElement("noscript");
}function createElement(e, t) {
  if (!isNull(e) && !isUndefined(e)) switch (e.type) {case "text":
      return createTextNode(e.nodeValue);case "thunk":
      return createThunk$1(e, t);case "empty":
      return createEmptyHTMLElement();case "native":
      return createHTMLElement(e, t);}
}function updateElement(e, t, n) {
  var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0;if (e) return t === n && "thunk" != t.type ? e : !isUndefined(t) && isUndefined(n) ? removeNode(e, t, n, r) : isUndefined(t) && !isUndefined(n) ? (e.appendChild(createElement(n)), e) : !isNull(t) && isNull(n) || isNull(t) && !isNull(n) ? replaceNode(e, t, n, r) : t.type !== n.type ? replaceNode(e, t, n, r) : isNative(n) ? t.tagName !== n.tagName ? replaceNode(e, t, n, r) : (updateAttributes(e.childNodes[r], n.attributes, t.attributes), diffChildren(e, t, n, r)) : isText(n) ? (t.nodeValue !== n.nodeValue && (e.childNodes[r].nodeValue = n.nodeValue), e) : isThunk(n) ? isSameThunk(t, n) ? updateThunk(e, t, n, r) : replaceThunk(e, t, n, r) : void 0;
}function updateTarget(e, t, n) {
  var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0;return !isUndefined(t) && isUndefined(n) ? removeNode(e, t, n, r) : isUndefined(t) && !isUndefined(n) ? (e.appendChild(createElement(n)), e) : !isNull(t) && isNull(n) || isNull(t) && !isNull(n) || t.type !== n.type ? replaceNode(e, t, n, r) : isNative(n) ? t.tagName !== n.tagName ? replaceNode(e, t, n, r) : (updateAttributes(e.childNodes[r], n.attributes, t.attributes), diffChildren(e, t, n, r)) : isText(n) ? (t.nodeValue !== n.nodeValue && (e.childNodes[r].nodeValue = n.nodeValue), e) : isThunk(n) ? isSameThunk(t, n) ? updateThunk(e, t, n, r) : replaceThunk(e, t, n, r) : void 0;
}function removeNode(e, t, n, r) {
  removeThunk(t), e.removeChild(e.childNodes[r]);
}function replaceNode(e, t, n, r) {
  var i = createElement(n);return removeThunk(t), e.replaceChild(i, e.childNodes[r]), i;
}function removeThunk(e) {
  for (; isThunk(e);) {
    var t = e.options.onRemove,
        n = e.state.model;t && t(n), e = e.state.vnode;
  }e.children && e.children.forEach(removeThunk);
}function diffChildren(e, t, n, r) {
  var i = t.children || [],
      o = n.children || [],
      u = void 0,
      a = Array.prototype.slice.call(e.childNodes);for (u = 0; u < i.length || u < o.length; u++) {
    updateElement(a[r], i[u], o[u], u);
  }return e;
}function updateThunk(e, t, n, r) {
  var i = n.props,
      o = { children: n.children, props: i },
      u = void 0;if (isClass(n.fn)) u = t.state.$ins.render(o);else try {
    u = n.fn(o);
  } catch (e) {
    u = t.state.$ins.render(o);
  }return updateElement(e, t.state.vnode, u, r), n.state = { vnode: u, $ins: t.state.$ins, model: o }, e;
}function replaceThunk() {
  return updateThunk.apply(null, arguments);
}function initNode(e, t) {
  var n = this,
      r = t || { node: null, oldNode: null, ins: null },
      i = r.node,
      o = r.oldNode,
      u = r.ins,
      a = function a(t) {
    return "updateAll" == t && function () {
      var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : o,
          n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e;try {
        t = u && u.render();
      } catch (e) {}updateTarget(n, o, t), o = t;
    }();
  };return t || (e.innerHTML = ""), function (t) {
    var r = t;if (r.children && !r.children.length) {
      var d = r,
          l = d.props,
          c = { children: d.children, props: l };r = r.fn(c);
    }return "render" in t && (r = t.render(), u = t, t.$update = t.$update.bind(n, function () {
      a("updateAll");
    })), i ? function () {
      var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : o;return updateElement(arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e, o, t), { node: i, oldNode: o = t, ins: u };
    }(r) : function (t) {
      var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e;return i = createElement(t, a), n.appendChild(i), { node: i, oldNode: o = t, ins: u };
    }(r);
  };
}var _createClass = function () {
  function e(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
    }
  }return function (t, n, r) {
    return n && e(t.prototype, n), r && e(t, r), t;
  };
}();function _classCallCheck(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}var component$1 = function () {
  function e() {
    _classCallCheck(this, e);
  }return _createClass(e, [{ key: "$update", value: function value(e) {
      e && e();
    } }, { key: "render", value: function value() {} }]), e;
}(),
    l = createNode,
    app = function app(e) {
  for (var t, n = arguments, r = arguments.length, i = Array(r > 1 ? r - 1 : 0), o = 1; o < r; o++) {
    i[o - 1] = n[o];
  }return t = initNode(e)(createNode(i[0], null)), void i.map(function (n) {
    n.$update = function () {
      t = initNode(e, t)(createNode(i[0], null));
    };
  });
};

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var state = {
    count: 0
};

var actions = {
    addCount: function addCount() {
        state.count++;
        MyButtonView.$update();
    }
};

var MyButtonView = function MyButtonView(_ref) {
    var props = _ref.props,
        children = _ref.children;
    return l(
        "button",
        _extends({ onClick: actions.addCount }, props),
        children,
        state.count
    );
};

var state$1 = {
    aa: -1,
    bb: -1,
    checked: true,
    data: [{ name: "11", href: "22" }, { name: "33", href: "44" }]
};

var actions$1 = {
    log: function log(e) {
        console.log(e.target.value);
        state$1.inputVal = e.target.value;
        actions.addCount();
    },
    handleClick: function handleClick() {
        state$1.data.push({ name: "77", href: "88" });
        BoxView.$update();
    },
    handleCheck: function handleCheck(e) {
        state$1.checked = !state$1.checked;
        console.log(state$1.checked);
        BoxView.$update();
    },
    compute: function compute(data) {
        var dd = [];
        state$1.data.forEach(function (item, index) {
            dd.push(l(
                "div",
                { "class": "title" },
                item.name
            ));
        });
        return dd;
    }
};

var BoxView = function BoxView(_ref) {
    var props = _ref.props,
        children = _ref.children;
    return l(
        "ul",
        { style: "list-style: none;" },
        "\xA5",
        l(
            "li",
            { className: "item", onClick: function onClick() {
                    return alert('hi!');
                } },
            "item 1"
        ),
        l(
            "li",
            { className: "item" },
            l("input", { type: "checkbox", checked: state$1.checked, onChange: actions$1.handleCheck }),
            l("input", { type: "text", style: "border:1px solid #f40000;", onInput: actions$1.log }),
            l(
                "p",
                null,
                state$1.inputVal
            )
        ),
        l(
            "li",
            { onClick: actions$1.handleClick, forceUpdate: true },
            "text"
        ),
        l(
            MyButtonView,
            { className: "button" },
            "hello, button"
        ),
        actions$1.compute(state$1.data)
    );
};

//main
console.time("render virtual DOM with FP");
app(document.querySelector("#app"), BoxView, MyButtonView);
console.timeEnd("render virtual DOM with FP");

}());
