import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import { UserProfileCubit } from "../user_profile/user_profile_cubit";
import type { UserKycRequestPublic } from "@/codegen";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/section_header";
import { ImageUploader } from "@/components/custom/image_uploader";

export function KycVerificationSection() {
  const { profile, loading, kyc_submitting, kyc_errors, kyc_submitted } = useStore(UserProfileCubit.state);

  const [kyc_form, set_kyc_form] = useState<UserKycRequestPublic>({
    name: "",
    surname: "",
    patronym: "",
    iin: "",
    document_front_url: "",
    document_back_url: "",
    selfie_url: "",
  });

  useEffect(() => {
    UserProfileCubit.init();
  }, []);

  useEffect(() => {
    if (profile) {
      set_kyc_form({
        name: profile.name || "",
        surname: profile.surname || "",
        patronym: profile.patronym || "",
        iin: profile.iin || "",
        document_front_url: "",
        document_back_url: "",
        selfie_url: "",
      });
    }
  }, [profile]);

  const handle_kyc_submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation_errors = UserProfileCubit.validate_kyc_data(kyc_form);
    if (validation_errors.length > 0) {
      validation_errors.forEach((error) => UserProfileCubit.add_kyc_error(error));
      return;
    }

    await UserProfileCubit.submit_kyc_request(kyc_form);
  };

  const is_kyc_verified = UserProfileCubit.is_kyc_verified();
  const has_required_kyc_info = UserProfileCubit.has_required_kyc_info();
  const is_kyc_submitted = UserProfileCubit.is_kyc_submitted();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="bx bx-loader-alt animate-spin text-3xl text-blue-500 mb-2"></i>
          <p className="text-gray-600">Loading verification status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="KYC Verification"
          subtitle="Verify your identity to access all platform features"
          icon="bx-shield-check"
          icon_class="text-2xl text-primary"
        />

        {is_kyc_verified && (
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
            <i className="bx bx-check-circle text-green-500"></i>
            <span className="text-green-700 text-sm font-medium">Verified</span>
          </div>
        )}

        {!is_kyc_verified && is_kyc_submitted && (
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
            <i className="bx bx-time-five text-blue-500"></i>
            <span className="text-blue-700 text-sm font-medium">Under Review</span>
          </div>
        )}

        {!is_kyc_verified && !is_kyc_submitted && (
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full">
            <i className="bx bx-error-circle text-orange-500"></i>
            <span className="text-orange-700 text-sm font-medium">Not Verified</span>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto">
        {is_kyc_verified ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <i className="bx bx-check-circle text-green-500 text-4xl mb-4"></i>
            <h3 className="text-lg font-semibold text-green-800 mb-2">KYC Verification Complete</h3>
            <p className="text-green-700">
              Your identity has been successfully verified. You can now access all platform features.
            </p>
          </div>
        ) : is_kyc_submitted ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <i className="bx bx-time-five text-blue-500 text-4xl mb-4"></i>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">KYC Request Submitted</h3>
            <p className="text-blue-700 mb-4">
              Your KYC verification request has been submitted successfully. Please wait while our team reviews
              your documents.
            </p>
            <p className="text-blue-600 text-sm">
              This process typically takes 1-3 business days. You will be notified once the verification is
              complete.
            </p>
          </div>
        ) : (
          <>
            {!has_required_kyc_info && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <i className="bx bx-info-circle text-orange-500 text-lg mt-0.5"></i>
                  <div>
                    <h4 className="text-orange-800 font-medium mb-1">Profile Information Required</h4>
                    <p className="text-orange-700 text-sm">
                      Please complete your basic profile information (name, surname, IIN) before submitting KYC
                      verification.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {kyc_submitted && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <i className="bx bx-check-circle text-blue-500 text-lg"></i>
                  <span className="text-blue-800 font-medium">KYC request submitted successfully!</span>
                  <button
                    onClick={() => UserProfileCubit.clear_success_flags()}
                    className="ml-auto text-blue-500 hover:text-blue-700"
                  >
                    <i className="bx bx-x text-lg"></i>
                  </button>
                </div>
              </div>
            )}

            {kyc_errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <i className="bx bx-error-circle text-red-500 text-lg mt-0.5"></i>
                  <div className="flex-1">
                    <h4 className="text-red-800 font-medium mb-1">Error</h4>
                    <ul className="space-y-1">
                      {kyc_errors.map((error, index) => (
                        <li key={index} className="text-red-700 text-sm">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => UserProfileCubit.clear_kyc_errors()}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="bx bx-x text-lg"></i>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handle_kyc_submit} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-800 mb-2">KYC Verification Requirements</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Clear photo of the front side of your ID document</li>
                  <li>• Clear photo of the back side of your ID document (if applicable)</li>
                  <li>• Selfie holding your ID document next to your face</li>
                  <li>• All information must match your profile data</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={kyc_form.name}
                    onChange={(e) => set_kyc_form({ ...kyc_form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={kyc_form.surname}
                    onChange={(e) => set_kyc_form({ ...kyc_form, surname: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your last name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patronymic</label>
                  <input
                    type="text"
                    value={kyc_form.patronym}
                    onChange={(e) => set_kyc_form({ ...kyc_form, patronym: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your patronymic"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IIN (Individual Identification Number) *
                  </label>
                  <input
                    type="text"
                    value={kyc_form.iin}
                    onChange={(e) => set_kyc_form({ ...kyc_form, iin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="12-digit IIN"
                    maxLength={12}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Front Side *</label>
                <ImageUploader
                  value={kyc_form.document_front_url}
                  onChange={(url) => set_kyc_form({ ...kyc_form, document_front_url: url })}
                />
                {!kyc_form.document_front_url && (
                  <p className="text-sm text-red-600 mt-1">Required: Upload front side of your ID document</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Back Side (Optional)
                </label>
                <ImageUploader
                  value={kyc_form.document_back_url}
                  onChange={(url) => set_kyc_form({ ...kyc_form, document_back_url: url })}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload back side if your document has important information on the back
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selfie with Document *</label>
                <ImageUploader
                  value={kyc_form.selfie_url}
                  onChange={(url) => set_kyc_form({ ...kyc_form, selfie_url: url })}
                />
                {!kyc_form.selfie_url && (
                  <p className="text-sm text-red-600 mt-1">
                    Required: Upload a selfie holding your ID document next to your face
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Make sure your face and the document are clearly visible
                </p>
              </div>

              <Button
                type="submit"
                disabled={kyc_submitting || !has_required_kyc_info}
                className="w-full md:w-auto"
              >
                {kyc_submitting ? (
                  <>
                    <i className="bx bx-loader-alt animate-spin mr-2"></i>
                    Submitting KYC...
                  </>
                ) : (
                  "Submit KYC Verification"
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}