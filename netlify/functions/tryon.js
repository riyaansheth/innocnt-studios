// Virtual try-on proxy for the FASHN AI API (https://docs.fashn.ai).
// The secret key stays server-side. Set it in Netlify later:
//   Site settings -> Environment variables -> FASHN_API_KEY = fa-...
// No other change is needed once the key is in place.
//
// POST /api/tryon   { modelImage, garmentImage, category }  -> { id }
// GET  /api/tryon?id=<id>                                    -> { status, output, error }

const FASHN_BASE = 'https://api.fashn.ai/v1';

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(204, {});

  const apiKey = process.env.FASHN_API_KEY;
  if (!apiKey) {
    return json(503, { error: 'Virtual try-on is not configured yet. Add the FASHN_API_KEY environment variable in Netlify.' });
  }
  const auth = { Authorization: `Bearer ${apiKey}` };

  try {
    // Poll prediction status.
    if (event.httpMethod === 'GET') {
      const id = event.queryStringParameters && event.queryStringParameters.id;
      if (!id) return json(400, { error: 'Missing prediction id.' });
      const res = await fetch(`${FASHN_BASE}/status/${encodeURIComponent(id)}`, { headers: auth });
      return json(res.status, await res.json());
    }

    // Start a prediction.
    if (event.httpMethod === 'POST') {
      let payload = {};
      try { payload = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'Invalid JSON body.' }); }
      const { modelImage, garmentImage, category } = payload;
      if (!modelImage || !garmentImage) return json(400, { error: 'modelImage (your photo) and garmentImage (the product) are both required.' });

      const res = await fetch(`${FASHN_BASE}/run`, {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_name: 'tryon-v1.6',
          inputs: {
            model_image: modelImage,
            garment_image: garmentImage,
            category: category || 'auto',
            mode: 'balanced',
          },
        }),
      });
      return json(res.status, await res.json());
    }

    return json(405, { error: 'Method not allowed.' });
  } catch (err) {
    return json(502, { error: `Try-on service error: ${err.message}` });
  }
};
