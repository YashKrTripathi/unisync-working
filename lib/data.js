// Event Categories
export const CATEGORIES = [
  {
    id: "competition",
    label: "Competition",
    icon: "🏆",
    description: "Hackathons, case studies, and competitive challenges",
  },
  {
    id: "workshop",
    label: "Workshop",
    icon: "🛠️",
    description: "Hands-on skill building and practical learning sessions",
  },
  {
    id: "seminar",
    label: "Seminar",
    icon: "🎤",
    description: "Professional talks, expert panels, and guest lectures",
  },
];

// Get category by ID
export const getCategoryById = (id) => {
  return CATEGORIES.find((cat) => cat.id === id);
};

// Get category label by ID
export const getCategoryLabel = (id) => {
  const category = getCategoryById(id);
  return category ? category.label : id;
};

// Get category icon by ID
export const getCategoryIcon = (id) => {
  const category = getCategoryById(id);
  return category ? category.icon : "📅";
};
