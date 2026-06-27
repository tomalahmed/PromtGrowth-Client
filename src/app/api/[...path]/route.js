const API_URL = (process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");

const FORWARD_REQUEST_HEADERS = [
  "accept",
  "authorization",
  "content-type",
  "cookie",
];

function buildTargetUrl(pathSegments, search) {
  const path = pathSegments.join("/");
  return `${API_URL}/api/${path}${search}`;
}

function buildUpstreamHeaders(request) {
  const headers = new Headers();

  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }

  return headers;
}

function buildProxyResponse(upstream) {
  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  const setCookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : [];

  for (const cookie of setCookies) {
    headers.append("set-cookie", cookie);
  }

  if (!setCookies.length) {
    const singleCookie = upstream.headers.get("set-cookie");
    if (singleCookie) {
      headers.set("set-cookie", singleCookie);
    }
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

async function proxyRequest(request, context) {
  const { path = [] } = await context.params;
  const targetUrl = buildTargetUrl(path, request.nextUrl.search);

  const init = {
    method: request.method,
    headers: buildUpstreamHeaders(request),
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(targetUrl, init);
  return buildProxyResponse(upstream);
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
