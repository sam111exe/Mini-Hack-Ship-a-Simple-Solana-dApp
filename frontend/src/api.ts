import axios from "axios";
import { API } from "./codegen";

axios.defaults.baseURL = "/api";
export const api = new API(axios);
