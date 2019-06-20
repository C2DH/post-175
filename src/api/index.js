// API CALLS
import request from "superagent";
import keyBy from "lodash/keyBy";
import get from "lodash/get";
import { csvParse } from "d3-dsv";
import queryString from "query-string";
import md5 from "md5";

const API_URL = "/api";

// Extract only body from response, when other stuff like response
// headers and so on are useless
const extractBody = ({ body }) => body;

const buildMillerMd5 = params => {
  return { md5: md5(queryString.stringify(params, { sort: false })) };
};

const buildMillerParams = params => {
  let newParams = params;

  if (newParams.filters && typeof newParams.filters !== "string") {
    newParams = { ...newParams, filters: JSON.stringify(newParams.filters) };
  }

  if (newParams.exclude && typeof newParams.exclude !== "string") {
    newParams = { ...newParams, exclude: JSON.stringify(newParams.exclude) };
  }
  // console.log(params, newParams);
  return { ...newParams, ...buildMillerMd5(newParams) };
};

export const searchSuggestion = term =>
  request
    .get(`${API_URL}/document/suggest/`)
    .query({ q: term, ...buildMillerMd5({ q: term }) })
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
  request
    .get(`${API_URL}/story/${idOrSlug}/`)
    .query({
      parser: "yaml",
      ...buildMillerMd5({ parser: "yaml" })
    })
    .then(extractBody);

export const getChapters = () =>
  request
    .get(`${API_URL}/story/`)
    .query({
      limit: 1,
      filters: JSON.stringify({
        tags__slug: "theme"
      }),
      ...buildMillerMd5({
        limit: 1,
        filters: JSON.stringify({
          tags__slug: "theme"
        })
      })
    })
    .then(({ body }) => {
      if (body.results.length === 0) {
        return [];
      }
      const theme = body.results[0];
      return request
        .get(`${API_URL}/story/`)
        .query({
          limit: 10,
          filters: JSON.stringify({
            status: "public",
            mentioned_to__id: theme.id
          }),
          ...buildMillerMd5({
            limit: 10,
            filters: JSON.stringify({
              status: "public",
              mentioned_to__id: theme.id
            })
          })
        })
        .then(({ body }) => {
          const chaptersById = keyBy(body.results, "id");
          return get(theme, "data.chapters", [])
            .map(id => chaptersById[id])
            .filter(Boolean);
        });
    });

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
    facets: ["data__year", "data__type"],
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
