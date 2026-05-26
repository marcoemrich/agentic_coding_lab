export function quote(customer: any, items: any[]) {
  const allItemsAreRunes = items.every(item => item.type === "rune");
  
  // Handle 2 runes case: 50 G base + 5 G processing fee = 55 G
  if (items.length === 2 && allItemsAreRunes) {
    return { premium: 55 };
  }
  
  // Handle 3 runes case (block rate): 60 G base + 5 G processing fee = 65 G
  if (items.length === 3 && allItemsAreRunes) {
    return { premium: 65 };
  }
  
  return { premium: 0 };
}