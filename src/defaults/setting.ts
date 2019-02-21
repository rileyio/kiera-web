declare var process: any;
import Axios from "axios";
import { buildRequestHeaders } from '../utils';

export async function defaultServerSettings() {
  try {
    const resp = await Axios(`${process.env.BOT_HOST}/available/settings`, {
      method: "POST",
      headers: buildRequestHeaders()
    });

    if (resp.status === 200) {
      return resp.data
    }
  } catch (error) { return [] }
}