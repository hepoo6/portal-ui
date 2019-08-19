// @flow

import invariant from 'invariant'
import ReactFauxDOM from 'react-faux-dom'
import attrs from './utils/attrs'
import { dim, halfPixel } from './utils/spatial'
import uuid from './utils/uuid'
import withZoomState from './utils/withZoomState'

/*----------------------------------------------------------------------------*/

let ZoomAreaNode = ({
  d3,
  height,
  width,
  domainWidth = 500,
  yAxisOffset = 45,
  xAxisOffset = 40,
  min,
  max,
  clicked: dragging,
  _update,
  update,
  offsetX,
  _zoomState,
} = {}) => {
  invariant(d3, `You must pass in the d3 library, either v3 || v4`)

  d3.selection.prototype.attrs = attrs
  d3.scaleOrdinal = d3.scaleOrdinal || d3.scale.ordinal
  d3.scaleLinear = d3.scaleLinear || d3.scale.linear

  // Similar to a React target element
  let root = ReactFauxDOM.createElement(`div`)

  invariant(root, `Must provide an element or selector!`)

  width = width || root.clientWidth
  height = height || root.clientHeight

  let uniqueSelector = uuid()
  let xAxisLength = width - yAxisOffset

  let updateTargetChartZoom = ({ zoomX, zoomWidth, offsetX, difference }) => {
    let draggingLeft = difference < 0

    let scale = d3.scaleLinear().domain([0, xAxisLength]).range([min, max])

    let targetMin = Math.max(
      0,
      draggingLeft ? scale(offsetX - yAxisOffset) : scale(zoomX - yAxisOffset)
    )

    let targetMax = Math.min(
      domainWidth,
      draggingLeft ? scale(offsetX + zoomWidth - yAxisOffset) : scale(offsetX - yAxisOffset)
    )

    return [targetMin, targetMax]
  }

  // Main Chart

  let d3Root = d3.select(root).style(`position`, `relative`)

  let svg = d3Root
    .append(`svg`)
    .attrs({
      class: `chart`,
      ...dim(width, height),
    })
    .on(`mouseup`, () => {
      if (dragging) {
        let actualOffset = offsetX || _zoomState
        let difference = actualOffset - _zoomState

        // do not zoom if insignificant dragging distance
        if (Math.abs(difference) < 5) {
          _update({ dragging: false, draggingMinimap: false })
          return
        }

        if (dragging) {
          let [targetMin, targetMax] = updateTargetChartZoom({
            zoomX: difference < 0 ? actualOffset : _zoomState,
            zoomWidth: Math.abs(difference),
            offsetX: actualOffset,
            difference,
          })

          update({
            min: targetMin,
            max: targetMax,
          })
        }

        _update({
          dragging: false,
          offsetX: 0,
        })
      }
    })

  svg.append(`clipPath`).attr(`id`, `${uniqueSelector}-chart-clip`).append(`rect`).attrs({
    x: yAxisOffset,
    y: 0,
    ...dim(xAxisLength, height - xAxisOffset),
  })

  svg
    .append(`rect`)
    .attrs({
      class: `${uniqueSelector}-chart-zoom-area`,
      x: yAxisOffset,
      y: halfPixel,
      width: xAxisLength,
      height: height - xAxisOffset - halfPixel,
      fill: `rgba(0, 0, 0, 0)`,
    })
    .on(`mousemove`, () => {
      if (dragging) {
        const MAGIC_OFFSET_ADJUSTMENT =
          document.getElementById(`lolliplot-container`).getBoundingClientRect().left

        _update({
          offsetX: d3.event.clientX - MAGIC_OFFSET_ADJUSTMENT,
        })
      }
    })

  if (dragging) {
    let actualOffset = offsetX || _zoomState
    let difference = actualOffset - _zoomState

    svg.append(`g`).append(`rect`).attrs({
      class: `zoom-shading`,
      x: difference < 0 ? actualOffset : _zoomState,
      y: 0,
      width: Math.abs(difference),
      height: height - xAxisOffset,
      fill: `rgba(214, 214, 214, 0.51)`,
      cursor: `text`,
      "pointer-events": `none`,
    })
  }

  return root.toReact()
}

/*----------------------------------------------------------------------------*/

export default withZoomState(ZoomAreaNode)
