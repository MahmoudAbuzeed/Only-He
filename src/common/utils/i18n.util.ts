import { SupportedLanguage } from "../middleware/language.middleware";

/**
 * Pick localized value from object with _en / _ar keys. Fallback: _en then _ar.
 */
export function getLocalizedText(
  obj: Record<string, any> | null | undefined,
  key: string,
  lang: SupportedLanguage
): string | undefined {
  if (!obj) return undefined;
  const enKey = `${key}_en`;
  const arKey = `${key}_ar`;
  const val = lang === "ar" ? obj[arKey] ?? obj[enKey] : obj[enKey] ?? obj[arKey];
  return val != null ? String(val) : undefined;
}

const I18N_KEYS: Record<string, string[]> = {
  category: ["name", "description", "meta_title", "meta_description"],
  product: ["name", "description", "short_description", "meta_title", "meta_description"],
  package: ["name", "description"],
  banner: ["title", "description", "buttonText"],
  offer: ["name", "description"],
  orderItem: ["item_name"],
};

/**
 * Map entity with _en/_ar columns to a single-language response (name, description, etc.).
 * Strips _en and _ar keys from the result.
 */
export function toLocalizedEntity<T extends Record<string, any>>(
  entity: T,
  lang: SupportedLanguage,
  type: keyof typeof I18N_KEYS
): Record<string, any> {
  if (!entity) return entity;
  const keys = I18N_KEYS[type];
  if (!keys) return entity;

  const out = { ...entity };

  for (const key of keys) {
    const value = getLocalizedText(out, key, lang);
    if (value !== undefined) {
      (out as any)[key] = value;
    }
    delete (out as any)[`${key}_en`];
    delete (out as any)[`${key}_ar`];
  }

  return out;
}

/**
 * Localize item_details.description from description_en / description_ar when present.
 */
export function toLocalizedOrderItemDetails(
  itemDetails: { description?: string; description_en?: string; description_ar?: string; [k: string]: any } | null | undefined,
  lang: SupportedLanguage
): Record<string, any> | null | undefined {
  if (!itemDetails) return itemDetails;
  const desc = getLocalizedText(itemDetails as any, "description", lang);
  const out = { ...itemDetails };
  if (desc !== undefined) out.description = desc;
  delete out.description_en;
  delete out.description_ar;
  return out;
}

/**
 * Localize order items (item_name + item_details) for response.
 */
export function localizeOrderItems(items: any[] | null | undefined, lang: SupportedLanguage): any[] {
  if (!items || !items.length) return items || [];
  return items.map((item) => {
    const out = toLocalizedEntity(item, lang, "orderItem");
    (out as any).item_details = toLocalizedOrderItemDetails((item as any).item_details, lang);
    return out;
  });
}
