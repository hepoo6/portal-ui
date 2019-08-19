// @flow

import invariant from 'invariant'
import ReactFauxDOM from 'react-faux-dom'
import range from 'lodash.range'
import attrs from './utils/attrs'
import { dim } from './utils/spatial'
import uuid from './utils/uuid'
import theme from './theme'

/*----------------------------------------------------------------------------*/

let Lolliplot = ({
  d3,
  data,
  collisions,
  height,
  width,
  domainWidth = 500,
  highlightedPointId = ``,
  yAxisOffset = 45,
  xAxisOffset = 40,
  numXTicks = 12,
  onPointClick = () => { },
  onPointMouseover = () => { },
  onPointMouseout = () => { },
  getMutationTextColor = () => `white`,
  getPointColor,
  animating,
  min,
  max,
  setClicked,
} = {}) => {
  invariant(d3, `You must pass in the d3 library, either v3 || v4`)

  d3.selection.prototype.attrs = attrs
  d3.scaleOrdinal = d3.scaleOrdinal || d3.scale.ordinal
  d3.scaleLinear = d3.scaleLinear || d3.scale.linear

  let root = ReactFauxDOM.createElement(`div`)

  invariant(root, `Must provide an element or selector!`)

  width = width || root.clientWidth
  height = height || root.clientHeight

  let uniqueSelector = uuid()
  let xAxisLength = width - yAxisOffset
  let scale = xAxisLength / domainWidth

  let visibleData = data.filter(d => d.x > min && d.x < max)

  let scaleLinear = d3
    .scaleLinear()
    .domain([min, max])
    .range([yAxisOffset, width])

  let maxY = Math.max(...visibleData.map(d => d.y))

  let highestValue = Math.max(10, maxY)

  let scaleLinearY = d3
    .scaleLinear()
    .domain([-highestValue / numXTicks, highestValue])
    .range([height - xAxisOffset, 15])

  // Main Chart

  let d3Root = d3.select(root).style(`position`, `relative`)

  let svg = d3Root
    .append(`svg`)
    .attrs({
      class: `chart`,
      ...dim(width, height),
    })
    .on(`mousedown`, () => {
      setClicked(d3.event.offsetX)
    })

  // Chart clipPath

  svg
    .append(`clipPath`)
    .attr(`id`, `${uniqueSelector}-chart-clip`)
    .append(`rect`)
    .attrs({
      x: yAxisOffset,
      y: 0,
      ...dim(xAxisLength, height - xAxisOffset),
    })

  // yAxis

  svg
    .append(`g`)
    .append(`line`)
    .attrs({
      class: `yAxis`,
      x1: yAxisOffset,
      y1: 0,
      x2: yAxisOffset,
      y2: height - xAxisOffset,
      stroke: theme.black,
    })

  // yAxis label

  svg
    .append(`text`)
    .text(`# of Cases`)
    .attrs({
      x: 5,
      y: (height - xAxisOffset) / 2,
      'font-size': `11px`,
      transform: `rotate(270, 10, 124)`,
    })

  // xAxis

  svg
    .append(`g`)
    .append(`line`)
    .attrs({
      class: `xAxis`,
      x1: yAxisOffset,
      y1: height - xAxisOffset,
      x2: width,
      y2: height - xAxisOffset,
      stroke: theme.black,
    })

  svg
    .append(`g`)
    .selectAll(`line`)
    .data(data)
    .enter()
    .append(`line`)
    .attrs({
      class: d => `mutation-line-${d.id}`,
      'clip-path': `url(#${uniqueSelector}-chart-clip)`,
      x1: d => scaleLinear(d.x),
      y1: height - xAxisOffset,
      x2: d => scaleLinear(d.x),
      y2: d => scaleLinearY(d.y),
      stroke: `rgba(0, 0, 0, 0.2)`,
    })

  svg
    .append(`g`)
    .selectAll(`circle`)
    .data(data)
    .enter()
    .append(`circle`)
    .attrs({
      class: d => `
        mutation-circle-${d.id} ${d.id === highlightedPointId ? `selected-mutation` : ``}`,
      'clip-path': `url(#${uniqueSelector}-chart-clip)`,
      cx: d => scaleLinear(d.x),
      cy: d => scaleLinearY(d.y),
      r: d => theme.mutationRadius + Math.min((collisions[`${d.x},${d.y}`] || []).length, 5),
      fill: d => (getPointColor ? getPointColor(d) : `steelblue`),
    })
    .on(`mouseover`, d => {
      if (!animating) {
        if (onPointMouseover) {
          onPointMouseover(d, d3.event)
        }
      }
    })
    .on(`mouseout`, d => {
      if (!animating) {
        d3.select(`.tooltip`).style(`left`, `-9999px`)
        if (onPointMouseout) onPointMouseout(d, d3.event)
      }
    })
    .on(`mousedown`, d => onPointClick(d, d3.event))

  let TEXT_VOFFSET = 3.5

  svg
    .append(`g`)
    .selectAll(`text`)
    .data(data.filter(d => collisions[`${d.x},${d.y}`]))
    .enter()
    .append(`text`)
    .attrs({
      x: d => scaleLinear(d.x),
      y: d => scaleLinearY(d.y) + TEXT_VOFFSET,
      fill: d => getMutationTextColor(d),
      fontSize: `10px`,
      'text-anchor': `middle`,
      'pointer-events': `none`,
    })
    .text(d => collisions[`${d.x},${d.y}`].length)

  let selectedNode = data
    .filter(d => d.id === highlightedPointId)
    .map(d => ({ ...d, size: theme.mutationRadius * 3 }))

  svg
    .append(`g`)
    .selectAll(`rect`)
    .data(selectedNode)
    .enter()
    .append(`rect`)
    .attrs({
      class: `selected-mutation-box`,
      'clip-path': `url(#${uniqueSelector}-chart-clip)`,
      x: d => scaleLinear(d.x) - d.size / 2,
      y: d => scaleLinearY(d.y) - d.size / 2,
      width: d => d.size,
      height: d => d.size,
      fill: `none`,
      stroke: `rgb(251, 94, 45)`,
      'stroke-width': 2,
    })
    .on(`mouseover`, d => {
      if (!animating) {
        if (onPointMouseover) {
          onPointMouseover(d, d3.event)
        }
      }
    })
    .on(`mouseout`, d => {
      if (!animating) {
        d3.select(`.tooltip`).style(`left`, `-9999px`)
        if (onPointMouseout) onPointMouseout(d, d3.event)
      }
    })
    .on(`click`, d => onPointClick(d, d3.event))

  svg.append(`g`).attr(`class`, `yTicks`)

  d3Root
    .select(`.yTicks`)
    .append(`g`)
    .selectAll(`text`)
    .data(range(1, highestValue, highestValue / 10))
    .enter()
    .append(`text`)
    .text(i => Math.round(i))
    .attrs({
      class: i => `yTick-text-${i}`,
      x: yAxisOffset - 10,
      y: i => scaleLinearY(i) + 3,
      'font-size': `11px`,
      'text-anchor': `end`,
    })

  d3Root
    .select(`.yTicks`)
    .append(`g`)
    .selectAll(`line`)
    .data(range(1, highestValue, highestValue / 10))
    .enter()
    .append(`line`)
    .attrs({
      class: i => `yTick-line-${i}`,
      x1: yAxisOffset - 7,
      y1: i => scaleLinearY(i),
      x2: yAxisOffset,
      y2: i => scaleLinearY(i),
      stroke: theme.black,
    })

  // Horizontal ticks

  svg.append(`g`).attr(`class`, `xTicks`)

  let length = (max - min) / numXTicks
  let olength = domainWidth / numXTicks

  d3Root
    .select(`.xTicks`)
    .append(`g`)
    .selectAll(`text`)
    .data(range(numXTicks - 1).map(x => x + 1))
    .enter()
    .append(`text`)
    .text(i => Math.round(length * i + min))
    .attrs({
      class: i => `xTick-text-${i}`,
      x: i => olength * i * scale + yAxisOffset,
      y: height - xAxisOffset + 20,
      'font-size': `11px`,
      'text-anchor': `middle`,
      'pointer-events': `none`,
    })

  for (let i = 1; i < numXTicks; i++) {
    let length = domainWidth / numXTicks

    d3Root
      .select(`.xTicks`)
      .append(`line`)
      .attrs({
        class: `xTick-line-${i}`,
        x1: length * i * scale + yAxisOffset,
        y1: height - xAxisOffset,
        x2: length * i * scale + yAxisOffset,
        y2: height - xAxisOffset + 10,
        stroke: theme.black,
        'pointer-events': `none`,
      })
  }

  return root.toReact()
}

/*----------------------------------------------------------------------------*/

export default Lolliplot
