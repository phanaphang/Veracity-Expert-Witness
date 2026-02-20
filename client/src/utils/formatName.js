/**
 * Format a profile's display name.
 * Admin/staff accounts show "FirstName L." (abbreviated last name).
 * Expert accounts show full "FirstName LastName".
 */
export function formatName(p) {
  if (!p?.first_name) return p?.email || 'Unknown';
  const isAdminOrStaff = p.role === 'admin' || p.role === 'staff';
  if (isAdminOrStaff && p.last_name) {
    return `${p.first_name} ${p.last_name.charAt(0)}.`;
  }
  return `${p.first_name} ${p.last_name || ''}`.trim();
}
