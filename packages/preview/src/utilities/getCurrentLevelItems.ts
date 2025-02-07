/**
 * Filters a list of items to get the items at the current level of a hierarchy.
 *
 * @param items An array of CollectionEntry objects.
 * @param parentId The ID of the parent item.
 * @returns An array of CollectionEntry objects that are at the current level.
 */
export function getCurrentLevelItems<T extends { id: string }>(
  items: T[],
  parentId?: string,
): T[] {
  if (parentId) {
    return items.filter(
      (item) =>
        item.id.startsWith(`${parentId}/`) &&
        item.id.split("/").length === parentId.split("/").length + 1,
    );
  }

  return items.filter((item) => !item.id.includes("/"));
}
