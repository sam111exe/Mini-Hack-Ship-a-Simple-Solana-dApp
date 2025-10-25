import _ from "lodash";
import { UserRepoCubit } from "./repo";
import { AuthCubit } from "./sections/auth/auth_cubit";
import { UserExploreCubit } from "./sections/explore/user_explore_cubit";
import { UserProfileCubit } from "./sections/user_profile/user_profile_cubit";

AuthCubit.on_auth(async () => {
  await UserRepoCubit.init();
  await UserExploreCubit.init();
  await UserProfileCubit.init();
  //await AuthCubit.init();
});
AuthCubit.init();

UserRepoCubit.state.subscribe((state, old_state) => {
  if (_.eq(state.data.real_assets_list, old_state?.data.real_assets_list) === false) {
    
  }
});
