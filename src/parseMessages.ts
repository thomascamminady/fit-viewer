/**
 * Parses raw FIT file messages into tabular format using Arquero.
 *
 * @param messages - Raw messages object from FIT file decoder
 * @returns Promise resolving to a record of table names to serialized data
 */
export async function parseMessages(
  messages: any
): Promise<Record<string, any>> {
  // ✅ Dynamically import Arquero to avoid ESM/CommonJS conflicts
  const aq = await import('arquero');

  const tables: Record<string, any> = {};

  Object.keys(messages).forEach(key => {
    if (Array.isArray(messages[key])) {
      const table = aq.from(messages[key]); // Convert to Arquero Table
      tables[key] = table.objects(); // Convert to JSON-serializable format
    }
  });

  return tables;
}
