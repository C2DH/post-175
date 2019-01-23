// API CALLS
import request from "superagent";
import keyBy from 'lodash/keyBy'
import { csvParse } from "d3-dsv";
const API_URL = "/api";

// Extract only body from response, when other stuff like response
// headers and so on are useless
const extractBody = ({ body }) => body;

const buildMillerParams = params => {
  let newParams = params;

  if (newParams.filters && typeof newParams.filters !== "string") {
    newParams = { ...newParams, filters: JSON.stringify(newParams.filters) };
  }

  if (newParams.exclude && typeof newParams.exclude !== "string") {
    newParams = { ...newParams, exclude: JSON.stringify(newParams.exclude) };
  }
  // console.log(params, newParams);
  return newParams;
};

export const searchSuggestion = term =>
  request
    .get(`${API_URL}/document/suggest/`)
    .query({ q: term })
    .then(({ body }) => body.results);

export const getTimeSeries = () =>
  request.get(`${API_URL}/document/itu-stats/`).then(({ body }) => {
    const path = body.src
      .split("/")
      .slice(3)
      .join("/");
    return request
      .get(`/${path}`)
      .set("Accept", "text/plain")
      .set("Content-Type", "text/plain")
      .then(response => {
        const data = csvParse(response.text);
        return {
          rows: data.map(a => a),
          columns: data.columns
        };
      });
  });

export const getStory = idOrSlug =>
  request.get(`${API_URL}/story/${idOrSlug}/`)
    .query({
      parser: 'yaml',
    })
    .then(extractBody);

export const getChapters = () =>
  request.get(`${API_URL}/story/`)
    .query({
      limit: 1,
      filters: JSON.stringify({
        'tags__slug': 'theme',
      })
    })
    .then(({ body }) => {
      if (body.results.length === 0) {
        return []
      }
      const id = body.results[0].id
      return request.get(`${API_URL}/story/${id}`)
        .then(({ body }) => {
          const chaptersById = keyBy(body.stories, 'id')
          return body.data.chapters.map(id => chaptersById[id]).filter(Boolean)
        })
    })

export const getDocuments = (params = {}) =>
  request
    .get(`${API_URL}/document/`)
    .query(buildMillerParams(params))
    .then(extractBody);

export const getDocument = id =>
  request.get(`${API_URL}/document/${id}`).then(extractBody);

export const getHomeDocuments = (params = {}) =>
  getDocuments({
    ...params,
    filters: {
      ...params.filters,
      data__type: "home"
    }
  });

export const getCollectionDocuments = (params = {}) =>
  getDocuments({
    ...params,
    facets: ["data__year", 'data__type'],
    filters: {
      ...params.filters
    }
  });

export const getEvents = (params = {}) =>
  getDocuments({
    ...params,
    filters: {
      ...params.filters,
      data__type: "event"
    }
  });

export const getPeriods = (params = {}) =>
  getDocuments({
    ...params,
    filters: {
      ...params.filters,
      data__type: "period",
      type: "entity"
    }
  });

export const getPlaces = (params = {}) =>
  getDocuments({
    ...params,
    filters: {
      ...params.filters,
      data__type: "place"
    }
  });

export const getRasterLayers = (params = {}) =>
  getDocuments({
    ...params,
    filters: {
      ...params.filters,
      data__raster_layer__isnull: false
    }
  });
