/* @ds-bundle: {"namespace":"Halo","components":[{"name":"BentoCard","sourcePath":"components/general/BentoCard/BentoCard.jsx"},{"name":"Brand","sourcePath":"components/general/Brand/Brand.jsx"},{"name":"Button","sourcePath":"components/general/Button/Button.jsx"},{"name":"Card","sourcePath":"components/general/Card/Card.jsx"},{"name":"CaseCard","sourcePath":"components/general/CaseCard/CaseCard.jsx"},{"name":"Chip","sourcePath":"components/general/Chip/Chip.jsx"},{"name":"FeatureCard","sourcePath":"components/general/FeatureCard/FeatureCard.jsx"},{"name":"Footer","sourcePath":"components/general/Footer/Footer.jsx"},{"name":"HaloRoot","sourcePath":"components/general/HaloRoot/HaloRoot.jsx"},{"name":"HeroInput","sourcePath":"components/general/HeroInput/HeroInput.jsx"},{"name":"LogoCell","sourcePath":"components/general/LogoCell/LogoCell.jsx"},{"name":"Nav","sourcePath":"components/general/Nav/Nav.jsx"},{"name":"NavLink","sourcePath":"components/general/NavLink/NavLink.jsx"}],"sourceHashes":{"components/general/BentoCard/BentoCard.jsx":"9e2103de0a6e","components/general/BentoCard/BentoCard.d.ts":"db7a70ca8965","components/general/BentoCard/BentoCard.prompt.md":"7de3e96f4ff0","components/general/Brand/Brand.jsx":"0c71ce72b9c6","components/general/Brand/Brand.d.ts":"58defecba583","components/general/Brand/Brand.prompt.md":"6e53e628755b","components/general/Button/Button.jsx":"6b7d9462eb38","components/general/Button/Button.d.ts":"2b06343d3ab7","components/general/Button/Button.prompt.md":"c402f411b8ec","components/general/Card/Card.jsx":"c8e6c94abff8","components/general/Card/Card.d.ts":"c4be5653fec6","components/general/Card/Card.prompt.md":"0b78da4eba49","components/general/CaseCard/CaseCard.jsx":"2f9b558e1147","components/general/CaseCard/CaseCard.d.ts":"ebe17c3972e6","components/general/CaseCard/CaseCard.prompt.md":"5a7085270587","components/general/Chip/Chip.jsx":"84099d286bd8","components/general/Chip/Chip.d.ts":"80364662225c","components/general/Chip/Chip.prompt.md":"a4495bedb153","components/general/FeatureCard/FeatureCard.jsx":"8a654bfada74","components/general/FeatureCard/FeatureCard.d.ts":"60a6d5621c52","components/general/FeatureCard/FeatureCard.prompt.md":"b0b3129726e1","components/general/Footer/Footer.jsx":"cda243cf294a","components/general/Footer/Footer.d.ts":"a930472e74c1","components/general/Footer/Footer.prompt.md":"3700ea2bba47","components/general/HaloRoot/HaloRoot.jsx":"4a362a1f6824","components/general/HaloRoot/HaloRoot.d.ts":"58f910cfcb13","components/general/HaloRoot/HaloRoot.prompt.md":"50c70fbdd840","components/general/HeroInput/HeroInput.jsx":"d2fff5f163fe","components/general/HeroInput/HeroInput.d.ts":"557293cf8fbc","components/general/HeroInput/HeroInput.prompt.md":"f84aadaf2759","components/general/LogoCell/LogoCell.jsx":"21e9115891d4","components/general/LogoCell/LogoCell.d.ts":"c96de6c4c9f4","components/general/LogoCell/LogoCell.prompt.md":"2703d48e8034","components/general/Nav/Nav.jsx":"8c7dbab40592","components/general/Nav/Nav.d.ts":"a609a3769cdd","components/general/Nav/Nav.prompt.md":"739593bb7c4d","components/general/NavLink/NavLink.jsx":"009844fe5dbf","components/general/NavLink/NavLink.d.ts":"010ae8d81ae7","components/general/NavLink/NavLink.prompt.md":"a6a42df9d112"},"inlinedExternals":[],"builtBy":"cc-design-sync"} */
"use strict";
var Halo = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <define:import.meta.env>
  var init_define_import_meta_env = __esm({
    "<define:import.meta.env>"() {
    }
  });

  // shim:react-shim
  var require_react_shim = __commonJS({
    "shim:react-shim"(exports, module) {
      init_define_import_meta_env();
      var R = window.React;
      function np(p, k) {
        var o = {};
        for (var x in p) if (x !== "children") o[x] = p[x];
        if (k !== void 0) o.key = k;
        return o;
      }
      function jsx2(t, p, k) {
        var c = p && p.children;
        return c === void 0 ? R.createElement(t, np(p, k)) : R.createElement(t, np(p, k), c);
      }
      function jsxs2(t, p, k) {
        return R.createElement.apply(R, [t, np(p, k)].concat(p.children));
      }
      module.exports = R;
      module.exports.jsx = jsx2;
      module.exports.jsxs = jsxs2;
      module.exports.jsxDEV = function(t, p, k, s) {
        return (s ? jsxs2 : jsx2)(t, p, k);
      };
      module.exports.Fragment = R.Fragment;
    }
  });

  // dist/index.js
  var index_exports = {};
  __export(index_exports, {
    BentoCard: () => BentoCard,
    Brand: () => Brand,
    Button: () => Button,
    Card: () => Card,
    CaseCard: () => CaseCard,
    Chip: () => Chip,
    FeatureCard: () => FeatureCard,
    Footer: () => Footer,
    HaloRoot: () => HaloRoot,
    HeroInput: () => HeroInput,
    LogoCell: () => LogoCell,
    Nav: () => Nav,
    NavLink: () => NavLink
  });
  init_define_import_meta_env();
  var React = __toESM(require_react_shim(), 1);
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  var sizeClass = {
    sm: "halo-btn--sm",
    md: "",
    lg: "halo-btn--lg"
  };
  var Button = React.forwardRef(
    ({
      variant = "primary",
      size = "md",
      leadingIcon,
      trailingIcon,
      href,
      className = "",
      children,
      type,
      ...rest
    }, ref) => {
      const cls = `halo-btn halo-btn--${variant} ${sizeClass[size]} ${className}`.trim();
      const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        leadingIcon,
        children,
        trailingIcon
      ] });
      if (href) {
        const {
          onClick,
          onFocus,
          onBlur,
          onMouseEnter,
          onMouseLeave,
          ...anchorRest
        } = rest;
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "a",
          {
            href,
            className: cls,
            onClick,
            onFocus,
            onBlur,
            onMouseEnter,
            onMouseLeave,
            children: content
          }
        );
      }
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          ref,
          type: type ?? "button",
          className: cls,
          ...rest,
          children: content
        }
      );
    }
  );
  Button.displayName = "Button";
  var Brand = React.forwardRef(
    ({
      name = "Halo",
      href = "#",
      size = "md",
      markOnly = false,
      className = "",
      ...rest
    }, ref) => {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "a",
        {
          ref,
          href,
          className: `halo-brand ${className}`.trim(),
          ...rest,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "span",
              {
                className: `halo-brand__mark ${size === "sm" ? "halo-brand__mark--sm" : ""}`.trim(),
                "aria-hidden": "true"
              }
            ),
            !markOnly && name
          ]
        }
      );
    }
  );
  Brand.displayName = "Brand";
  var NavLink = ({
    label,
    hasDropdown = false,
    className = "",
    href = "#",
    ...rest
  }) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "a",
      {
        href,
        className: `halo-nav__link ${className}`.trim(),
        ...rest,
        children: [
          label,
          hasDropdown && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "halo-nav__chev", children: "\u25BE" })
        ]
      }
    );
  };
  var Nav = React.forwardRef(
    ({ brand, links, actions, className = "", ...rest }, ref) => {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "halo-nav-wrap", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "nav",
        {
          ref,
          className: `halo-nav ${className}`.trim(),
          ...rest,
          children: [
            brand,
            links && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "halo-nav__links", children: links }),
            actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "halo-nav__right", children: actions })
          ]
        }
      ) });
    }
  );
  Nav.displayName = "Nav";
  var Chip = ({
    children,
    className = "",
    ...rest
  }) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `halo-chip ${className}`.trim(), ...rest, children });
  };
  var HeroInput = React.forwardRef(
    ({
      placeholder = "Ask Halo\u2026",
      controls,
      onSend,
      hideSend = false,
      className = "",
      ...rest
    }, ref) => {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "div",
        {
          ref,
          className: `halo-hero-input ${className}`.trim(),
          ...rest,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "halo-hero-input__placeholder", children: placeholder }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "halo-hero-input__controls", children: [
              controls,
              !hideSend && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  className: "halo-hero-input__send",
                  "aria-label": "Send",
                  onClick: onSend,
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "svg",
                    {
                      width: "14",
                      height: "14",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      "aria-hidden": "true",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "12", y1: "19", x2: "12", y2: "5" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "5 12 12 5 19 12" })
                      ]
                    }
                  )
                }
              )
            ] })
          ]
        }
      );
    }
  );
  HeroInput.displayName = "HeroInput";
  var Card = React.forwardRef(
    ({ padded = false, flat = false, className = "", children, ...rest }, ref) => {
      const cls = [
        "halo-card",
        padded ? "halo-card--pad" : "",
        flat ? "halo-card--flat" : "",
        className
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref, className: cls, ...rest, children });
    }
  );
  Card.displayName = "Card";
  var FeatureCard = ({
    title,
    description,
    linkLabel = "Learn more",
    linkHref = "#",
    visual,
    className = "",
    ...rest
  }) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `halo-feature ${className}`.trim(), ...rest, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "halo-feature__body", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "halo-feature__title", children: title }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "halo-feature__desc", children: description })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", { href: linkHref, className: "halo-feature__link", children: [
          linkLabel,
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "halo-feature__link-arrow", children: "\u2192" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "halo-feature__visual", children: visual })
    ] });
  };
  var BentoCard = ({
    title,
    description,
    visual,
    className = "",
    children,
    ...rest
  }) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `halo-bento ${className}`.trim(), ...rest, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "halo-bento__title", children: title }),
      description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "halo-bento__desc", children: description }),
      children,
      visual && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "halo-bento__visual", children: visual })
    ] });
  };
  var LogoCell = React.forwardRef(
    ({ label, variant = "sans", className = "", ...rest }, ref) => {
      const modClass = variant === "sans" ? "" : `halo-logo-cell--${variant}`;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "div",
        {
          ref,
          className: `halo-logo-cell ${modClass} ${className}`.trim(),
          ...rest,
          children: label
        }
      );
    }
  );
  LogoCell.displayName = "LogoCell";
  var CaseCard = ({
    name,
    linkLabel = "Read story \u2192",
    linkHref = "#",
    thumbBackground,
    thumbContent,
    className = "",
    ...rest
  }) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: `halo-case ${className}`.trim(), ...rest, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "div",
        {
          className: "halo-case__thumb",
          style: thumbBackground ? { background: thumbBackground } : void 0,
          children: thumbContent
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "halo-case__meta", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "halo-case__name", children: name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "halo-case__link", href: linkHref, children: linkLabel })
      ] })
    ] });
  };
  var Footer = ({
    brand,
    columns,
    bottomLeft,
    bottomRight,
    className = "",
    ...rest
  }) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { className: `halo-footer ${className}`.trim(), ...rest, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "halo-footer__grid", children: [
        brand && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "halo-footer__col", children: brand }),
        columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "halo-footer__col", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", { children: col.heading }),
          col.links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: link.href, children: link.label }, link.label))
        ] }, col.heading))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "halo-footer__bottom", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bottomLeft }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bottomRight })
      ] })
    ] });
  };
  var HaloRoot = React.forwardRef(
    ({ className = "", children, ...rest }, ref) => {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref, className: `halo-root ${className}`.trim(), ...rest, children });
    }
  );
  HaloRoot.displayName = "HaloRoot";
  return __toCommonJS(index_exports);
})();
window.Halo=Halo.__dsMainNs?Object.assign({},Halo,Halo.__dsMainNs,{__dsMainNs:undefined}):Halo;
