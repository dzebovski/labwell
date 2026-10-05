/**
 * Редакторські елементи (todoNote, посилання на джерело виробника) — лише для `next dev`.
 * У production і в тестах їх не показуємо відвідувачам.
 */
export function showEditorialContent(nodeEnv: string | undefined = process.env.NODE_ENV): boolean {
  return nodeEnv === "development";
}
