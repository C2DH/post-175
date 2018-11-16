export const GET_RASTER_LAYERS = 'GET_RASTER_LAYERS'
export const loadRasterLayers = (params) => ({
  type: GET_RASTER_LAYERS,
  payload: { params, reset: true },
})

export const GET_RASTER_LAYERS_UNLOAD = 'GET_RASTER_LAYERS_UNLOAD'
export const unloadRasterLayers = () => ({
  type: GET_RASTER_LAYERS_UNLOAD,
})
