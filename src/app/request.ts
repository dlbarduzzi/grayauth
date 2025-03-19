const appJsonRegex = /^application\/([a-z-.]+\+)?json(;\s*[a-zA-Z0-9-]+=([^;]+))*$/

export async function getJsonPayload(req: Request) {
  const headers = req.headers
  const appJsonValue = headers.get("Content-Type") || headers.get("content-type")
  if (appJsonValue == null) {
    return { error: "Missing 'Content-Type:application/json' HTTP header" }
  }
  if (!appJsonRegex.test(appJsonValue)) {
    return { error: "Missing 'Content-Type:application/json' HTTP header" }
  }
  try {
    return { body: await req.json() }
  } catch (e) {
    if (!(e instanceof SyntaxError)) {
      console.error(e)
    }
    return { error: "Malformed JSON in request body" }
  }
}
