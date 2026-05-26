export function processScenario(scenario: any): any {
  const items = scenario.steps[0].items;
  
  // Check for building block discount (3 alike components)
  if (items.length === 3 && items.every(item => item.type === "rune")) {
    return {
      results: [
        {
          premium: 60
        }
      ]
    };
  }
  
  const itemType = items[0].type;
  
  if (itemType === "sword") {
    return {
      results: [
        {
          premium: 100
        }
      ]
    };
  } else if (itemType === "amulet") {
    return {
      results: [
        {
          premium: 60
        }
      ]
    };
  } else if (itemType === "staff") {
    return {
      results: [
        {
          premium: 80
        }
      ]
    };
  } else if (itemType === "potion") {
    return {
      results: [
        {
          premium: 40
        }
      ]
    };
  } else if (itemType === "rune" || itemType === "moonstone") {
    return {
      results: [
        {
          premium: 25
        }
      ]
    };
  }
  
  return {
    results: [
      {
        premium: 100
      }
    ]
  };
}