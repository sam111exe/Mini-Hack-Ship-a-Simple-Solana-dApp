import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import { UserProfileCubit } from "../user_profile/user_profile_cubit";
import type { UserProfilePublic } from "@/codegen";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/section_header";
import { AvatarSection } from "../user_profile/avatar_section";

export function UserProfileSection() {
  const { profile, loading, submitting, errors, profile_updated } = useStore(UserProfileCubit.state);

  const [profile_form, set_profile_form] = useState<UserProfilePublic>({
    name: "",
    surname: "",
    patronym: "",
    iin: "",
    bio: "",
    avatar_url: "",
  });

  useEffect(() => {
    UserProfileCubit.init();
  }, []);

  useEffect(() => {
    if (profile) {
      set_profile_form({
        name: profile.name || "",
        surname: profile.surname || "",
        patronym: profile.patronym || "",
        iin: profile.iin || "",
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile]);

  const handle_profile_submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation_errors = UserProfileCubit.validate_profile_data(profile_form);
    if (validation_errors.length > 0) {
      validation_errors.forEach((error) => UserProfileCubit.add_error(error));
      return;
    }

    await UserProfileCubit.update_profile(profile_form);
  };

  const completion_percentage = UserProfileCubit.get_profile_completion_percentage();
  const is_kyc_verified = UserProfileCubit.is_kyc_verified();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="bx bx-loader-alt animate-spin text-3xl text-blue-500 mb-2"></i>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Profile Settings"
          subtitle="Manage your personal information"
          icon="bx-user"
          icon_class="text-2xl text-primary"
        />

        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-600">Profile completion:</span>
            <span className="ml-2 font-semibold text-blue-600">{completion_percentage}%</span>
          </div>

          {is_kyc_verified && (
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
              <i className="bx bx-check-circle text-green-500"></i>
              <span className="text-green-700 text-sm font-medium">KYC Verified</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {profile_updated && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <i className="bx bx-check-circle text-green-500 text-lg"></i>
              <span className="text-green-800 font-medium">Profile updated successfully!</span>
              <button
                onClick={() => UserProfileCubit.clear_success_flags()}
                className="ml-auto text-green-500 hover:text-green-700"
              >
                <i className="bx bx-x text-lg"></i>
              </button>
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <i className="bx bx-error-circle text-red-500 text-lg mt-0.5"></i>
              <div className="flex-1">
                <h4 className="text-red-800 font-medium mb-1">Error</h4>
                <ul className="space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-red-700 text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => UserProfileCubit.clear_errors()} className="text-red-500 hover:text-red-700">
                <i className="bx bx-x text-lg"></i>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handle_profile_submit} className="space-y-6">
          <AvatarSection
            avatar_url={profile_form.avatar_url}
            name={`${profile_form.name || ""} ${profile_form.surname || ""}`.trim()}
            on_avatar_change={(url) => set_profile_form({ ...profile_form, avatar_url: url })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={profile_form.name}
                onChange={(e) => set_profile_form({ ...profile_form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={profile_form.surname}
                onChange={(e) => set_profile_form({ ...profile_form, surname: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patronymic (Optional)</label>
              <input
                type="text"
                value={profile_form.patronym}
                onChange={(e) => set_profile_form({ ...profile_form, patronym: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your patronymic"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IIN (Individual Identification Number)
              </label>
              <input
                type="text"
                value={profile_form.iin}
                onChange={(e) => set_profile_form({ ...profile_form, iin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="12-digit IIN"
                maxLength={12}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio (Optional)</label>
            <textarea
              value={profile_form.bio}
              onChange={(e) => set_profile_form({ ...profile_form, bio: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">{profile_form.bio.length}/500 characters</p>
          </div>

          <Button type="submit" disabled={submitting} className="w-full md:w-auto">
            {submitting ? (
              <>
                <i className="bx bx-loader-alt animate-spin mr-2"></i>
                Updating Profile...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
