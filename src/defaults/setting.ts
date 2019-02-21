declare var process: any;
import Axios from "axios";
import { buildRequestHeaders } from '../utils';
import { TrackedServerSetting } from '../types/server-settings';

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

export async function defaultServerSettingsUser() {
  try {
    const resp = await Axios(`${process.env.BOT_HOST}/available/user`, {
      method: "POST",
      headers: buildRequestHeaders()
    });

    if (resp.status === 200) {
      return resp.data
    }
  } catch (error) { return [] }
}