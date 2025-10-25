import * as nanostores from "nanostores";
import { api } from "./api";
import type { UserFrontendBundle } from "./codegen";

type State = {
  data: UserFrontendBundle;
  loading: boolean;
  inited: boolean;
};
const state = nanostores.map<State>({
  data: {
    profile: {
      uuid: "",
      user_uuid: "",
      name: undefined,
      surname: undefined,
      patronym: undefined,
      iin: undefined,
      bio: undefined,
      avatar_url: undefined,
    },
    real_assets_list: [],
    crypto_assets_list: [],
    fav_item_list: [],
  },
  loading: false,
  inited: false,
});

export class UserRepoCubit {
  static state = state;

  static async init() {
    await this.fetch();
    state.setKey("inited", true);
  }

  static async fetch() {
    state.setKey("loading", true);
    try {
      const data = await api.user_get_frontend_bundle();
      state.setKey("data", data);
    } catch (e) {
      /* handle error */
    }
    state.setKey("loading", false);
  }
}
