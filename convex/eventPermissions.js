export function isAssignedEventAdmin(event, userId) {
  return Boolean(event?.eventAdmins?.some((admin) => admin.userId === userId));
}

export function canManageEvent(event, user) {
  if (!event || !user) return false;
  if (event.organizerId === user._id) return true;
  if (isAssignedEventAdmin(event, user._id)) return true;
  return ["organiser", "superadmin", "owner"].includes(user.role);
}

export function serializeEventAdmin(user) {
  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    assignedAt: Date.now(),
  };
}

export function normalizeList(items = []) {
  return items.map((item) => item.trim()).filter(Boolean);
}
