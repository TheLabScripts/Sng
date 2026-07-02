import * as cheerio from "cheerio/slim";
import type { RawListing, SelectorConfig } from "../types.ts";

export function parseHtmlWithSelectors(html: string, selectors?: SelectorConfig, baseUrl = "") {
  if (!selectors?.item || !selectors.title || !selectors.price || !selectors.url) {
    throw new Error("HTML source configJson must define selectors.item, selectors.title, selectors.price, and selectors.url.");
  }
  const $ = cheerio.load(html);
  const listings: RawListing[] = [];
  $(selectors.item).each((_, element) => {
    const item = $(element);
    const text = (selector?: string) => selector ? item.find(selector).first().text().trim() : "";
    const attr = (selector: string | undefined, attribute: string) => selector ? item.find(selector).first().attr(attribute) || "" : "";
    const urlValue = attr(selectors.url, selectors.urlAttribute || "href");
    const imageValue = attr(selectors.image, selectors.imageAttribute || "src");
    let url = urlValue;
    let image = imageValue;
    try { if (urlValue) url = new URL(urlValue, baseUrl || "https://snagd.app").toString(); } catch { /* Keep source value. */ }
    try { if (imageValue) image = new URL(imageValue, baseUrl || "https://snagd.app").toString(); } catch { /* Keep source value. */ }
    listings.push({
      externalId: selectors.externalIdAttribute ? item.attr(selectors.externalIdAttribute) || null : null,
      title: text(selectors.title),
      description: text(selectors.description),
      price: text(selectors.price),
      sourceUrl: url,
      imageUrls: image ? [image] : [],
      locationText: text(selectors.location),
      sellerName: text(selectors.seller),
      postedAt: text(selectors.postedAt),
    });
  });
  return listings.filter((listing) => listing.title || listing.sourceUrl);
}
