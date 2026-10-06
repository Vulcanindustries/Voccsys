import { useEffect } from "react";

const SITE = "https://voccsys.com";

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Per-page SEO for the SPA: title, meta description, canonical, OG/Twitter.
 * Runs during react-snap's pre-render pass, so it lands in each route's static HTML.
 */
export default function useSeo({ title, description, path }) {
  useEffect(() => {
    if (title) {
      document.title = title;
      upsertMeta("property", "og:title", title);
      upsertMeta("name", "twitter:title", title);
    }
    if (description) {
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:description", description);
      upsertMeta("name", "twitter:description", description);
    }
    if (path != null) {
      const url = `${SITE}${path}`;
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", url);
      upsertMeta("property", "og:url", url);
    }
  }, [title, description, path]);
}
