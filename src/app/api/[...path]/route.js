import { NextResponse } from "next/server";

export const runtime = "nodejs";

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

  const forwardedProto =
    request.headers.get("x-forwarded-proto") ||
    (request.nextUrl.protocol === "https:" ? "https" : "http");
  headers.set("x-forwarded-proto", forwardedProto);

  const host = request.headers.get("host");
  if (host) {
    headers.set("x-forwarded-host", host);
  }

  return headers;
}

function applyUpstreamCookies(response, upstream) {
  const setCookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : [];

  if (setCookies.length) {
    for (const cookie of setCookies) {
      response.headers.append("set-cookie", cookie);
    }
    return;
  }

  const singleCookie = upstream.headers.get("set-cookie");
  if (singleCookie) {
    response.headers.set("set-cookie", singleCookie);
  }
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
  const body = await upstream.arrayBuffer();
  const response = new NextResponse(body, {
    status: upstream.status,
    statusText: upstream.statusText,
  });

  const contentType = upstream.headers.get("content-type");
  if (contentType) {
    response.headers.set("content-type", contentType);
  }

  applyUpstreamCookies(response, upstream);

  return response;
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
