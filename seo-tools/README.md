# seo-tools

Standalone Node scripts that call SEO data APIs for the content run book.
Used to cross-check keyword data across providers (Ahrefs + Semrush via MCP;
DataForSEO + Keyword Insights via these scripts) and to generate research-backed
content briefs.

## Setup (one time)

Put your API credentials in `seo-tools/secrets.local.json` (gitignored — never
committed). The file already exists with empty placeholders:

```json
{
  "KEYWORD_INSIGHTS_API_KEY": "kwi_sk_...",   // KI Dashboard → API Keys
  "DATAFORSEO_LOGIN": "you@example.com",        // DataForSEO dashboard → API Access (login)
  "DATAFORSEO_PASSWORD": "your-api-password"     // DataForSEO dashboard → API Access (API password, not your account password)
}
```

(You can also set these as environment variables instead — the scripts check
`process.env` first, then the file.)

## Verify (free — no credits spent)

```
node seo-tools/dataforseo.mjs auth
node seo-tools/keyword-insights.mjs auth
```

## Use

```
# DataForSEO keyword volume + difficulty (Canada = location_code 2124)
node seo-tools/dataforseo.mjs keywords "local seo,local seo services" 2124 en

# Keyword Insights content brief (~500 credits; needs a folder_id from the KI app URL)
node seo-tools/keyword-insights.mjs brief "local seo services" "Canada" "<folder_id>"
node seo-tools/keyword-insights.mjs get-brief "<order_id>"
```

> Note: Keyword Insights is known to silently flip location "Canada" → "United
> States". Always check the location on the returned brief before trusting it.
