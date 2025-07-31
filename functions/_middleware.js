export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // IMPORTANT: Replace this with the actual target website you want to proxy
  const targetUrl = new URL('https://search.789168.xyz');

  // Construct the new URL for the target service by preserving the path and search params
  targetUrl.pathname = url.pathname;
  targetUrl.search = url.search;

  // Create a new Headers object from the original request's headers.
  const requestHeaders = new Headers(request.headers);

  // Forward the request to the target service.
  // We pass the method, headers, and body from the original request.
  // 'redirect: manual' ensures that the proxy doesn't follow redirects automatically,
  // instead passing the redirect response back to the client's browser.
  const response = await fetch(targetUrl.toString(), {
    method: request.method,
    headers: requestHeaders,
    body: request.body,
    redirect: 'manual'
  });

  // Create a new response with mutable headers from the target's response.
  const responseHeaders = new Headers(response.headers);

  // It's good practice to remove certain hop-by-hop headers.
  // Cloudflare Pages handles content encoding automatically.
  responseHeaders.delete('content-encoding');

  // Return the response from the target service to the client.
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders
  });
}
