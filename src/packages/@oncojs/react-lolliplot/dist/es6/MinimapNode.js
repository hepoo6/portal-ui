import React from "react";
import invariant from "invariant";
import ReactFauxDOM from "react-faux-dom";
import attrs from "./utils/attrs";
import { dim, halfPixel } from "./utils/spatial";
import uuid from "./utils/uuid";
import theme from "./theme";

/*----------------------------------------------------------------------------*/

var Minimap = function Minimap() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      d3 = _ref.d3,
      data = _ref.data,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? 50 : _ref$height,
      width = _ref.width,
      _ref$domainWidth = _ref.domainWidth,
      domainWidth = _ref$domainWidth === undefined ? 500 : _ref$domainWidth,
      _ref$yAxisOffset = _ref.yAxisOffset,
      yAxisOffset = _ref$yAxisOffset === undefined ? 45 : _ref$yAxisOffset,
      min = _ref.min,
      max = _ref.max,
      dragging = _ref.dragging,
      sliding = _ref.sliding,
      offsetX = _ref.offsetX,
      zoomStart = _ref.zoomStart,
      slideStartMin = _ref.slideStartMin,
      slideStartMax = _ref.slideStartMax,
      slideStart = _ref.slideStart;

  invariant(d3, "You must pass in the d3 library, either v3 || v4");

  d3.selection.prototype.attrs = attrs;
  d3.scaleOrdinal = d3.scaleOrdinal || d3.scale.ordinal;
  d3.scaleLinear = d3.scaleLinear || d3.scale.linear;

  // Similar to a React target element
  var root = ReactFauxDOM.createElement("div");

  invariant(root, "Must provide an element or selector!");

  width = width || root.clientWidth;
  height = height || root.clientHeight;

  var uniqueSelector = uuid();
  var xAxisLength = width - yAxisOffset;
  var scale = xAxisLength / domainWidth;

  // Main Chart

  var d3Root = d3.select(root).style("position", "relative");

  var svg = d3Root.append("svg").attrs(Object.assign({
    class: "chart"
  }, dim(width, height)));

  var defs = svg.append("defs");

  // Chart clipPath

  defs.append("clipPath").attr("id", uniqueSelector + "-chart-clip").append("rect").attrs(Object.assign({
    x: yAxisOffset,
    y: 0
  }, dim(xAxisLength, height)));

  // Chart zoom area

  var chart = d3Root.select(".chart");

  svg.append("g").append("rect").attrs(Object.assign({
    class: "minimap",
    x: yAxisOffset,
    y: 0
  }, dim(xAxisLength, 50), {
    stroke: "rgb(138, 138, 138)",
    fill: "rgba(212, 212, 212, 0.4)",
    cursor: "text"
  }));

  svg.append("g").append("clipPath").attr("id", uniqueSelector + "-minimap-clip").append("rect").attrs(Object.assign({
    x: yAxisOffset,
    y: 0
  }, dim(xAxisLength, 50)));

  svg.append("g").append("rect").attrs({
    class: "minimap-zoom-area",
    x: min * scale + yAxisOffset + halfPixel,
    y: halfPixel,
    height: 50 - 1,
    width: Math.max(1, (max - min) * scale - 1),
    fill: "white",
    "pointer-events": "none"
  });

  svg.append("g").append("line").attrs({
    class: "minimap-protein-mutation-divider",
    x1: yAxisOffset,
    y1: height - 10,
    x2: xAxisLength + yAxisOffset,
    y2: height - 10,
    stroke: theme.black
  });

  svg.append("g").append("text").text("aa 1").attrs({
    x: yAxisOffset,
    y: height + 110,
    "font-size": "11px",
    "text-anchor": "start"
  });

  svg.append("g").append("text").text("aa " + domainWidth).attrs({
    x: width,
    y: height + 110,
    "font-size": "11px",
    "text-anchor": "end"
  });

  if (dragging) {
    var difference = offsetX - zoomStart;

    svg.append("g").append("rect").attrs({
      "clip-path": "url(#" + uniqueSelector + "-clip)",
      x: difference < 0 ? offsetX : zoomStart,
      y: 0,
      width: Math.abs(difference),
      height: 50,
      fill: "rgba(83, 215, 88, 0.51)",
      cursor: "text",
      "pointer-events": "none"
    });
  }

  data.mutations.forEach(function (d) {
    return chart.append("line").attrs({
      class: "mutation-line-" + d.id,
      x1: d.x * scale + yAxisOffset,
      y1: height - 10,
      x2: d.x * scale + yAxisOffset,
      y2: height - d.y * 2 - 10,
      stroke: theme.black,
      "pointer-events": "none"
    });
  });

  chart.append("g").selectAll("rect").data(data.proteins).enter().append("rect").attrs({
    class: function _class(d) {
      return "domain-" + d.id;
    },
    x: function x(d) {
      return d.start * scale + yAxisOffset;
    },
    y: height - 10,
    width: function width(d) {
      return (d.end - d.start) * scale;
    },
    height: 10 - halfPixel,
    fill: function fill(d, i) {
      return d.getProteinColor ? d.getProteinColor() : "hsl(" + i * 100 + ", 80%, 90%)";
    },
    "pointer-events": "none"
  });

  var minimapWidth = Math.max(1, (max - min) * scale - 1);

  svg.append("g").append("rect").attrs(Object.assign({
    class: "minimap-slide-target",
    x: min * scale + yAxisOffset + halfPixel + minimapWidth - 20,
    y: 5
  }, dim(15, 15), {
    fill: "rgb(255, 255, 255)",
    stroke: "rgb(57, 57, 57)",
    cursor: "move"
  }));

  svg.append("text").text("\u27FA").attrs({
    class: "minimap-slide-target-arrow",
    x: min * scale + yAxisOffset + halfPixel + minimapWidth - 19,
    y: 16,
    "font-size": "11px",
    "pointer-events": "none"
  });

  return root.toReact();
};

/*----------------------------------------------------------------------------*/

export default Minimap;