import { SectionHeader } from "@/components/section_header";

export const AdminUsersSection = () => {
  return (
    <div className="p-6">
      <SectionHeader
        title="Users Management"
        subtitle="Manage all users in the system"
        icon="bx-group"
        icon_class="text-blue-600"
      />
      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-500">Content coming soon...</p>
      </div>
    </div>
  );
};