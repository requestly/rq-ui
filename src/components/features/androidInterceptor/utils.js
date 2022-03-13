export const convertLogDocIntoRqLog = (doc) => {
  if (!doc || !doc.data()) {
    return;
  }

  const harString = doc.data().har?.data || "{}";
  const harObj = JSON.parse(harString);
  return convertHarJsonToRQLog(harObj, doc.id);
};

const convertHarJsonToRQLog = (har, id) => {
  let entry = {};
  if (har?.log?.entries) {
    entry = har?.log?.entries[0];
  } else {
    return null;
  }

  const request = entry?.request || {};
  const response = entry?.response || {};

  const requestHeaders = {};
  request.headers.forEach((headerObj) => {
    requestHeaders[headerObj.name] = headerObj.value;
  });

  const responseHeaders = {};
  response.headers.forEach((headerObj) => {
    responseHeaders[headerObj.name] = headerObj.value;
  });

  const url = new URL(request?.url);

  const time = new Date(entry.startedDateTime).getTime() / 1000;

  const rqLog = {
    id: id,
    timestamp: time,
    url: request?.url,
    request: {
      method: request?.method,
      path: url.pathname, //Change to path
      host: url.hostname, //Change to host
      port: url.port, //Change to port
      headers: requestHeaders,
      body: request?.body,
    },
    response: {
      statusCode: response?.status,
      headers: responseHeaders,
      contentType: response?.content?.mimeType,
      body: response?.content?.text,
    },
    actions: [],
  };

  return rqLog;
};
