declare var process: any;
import Axios from "axios";
import { buildRequestHeaders } from '../utils';

// export const defaultNotifications: Array<TrackedNotification> = [
//   {
//     _title: 'ChastiKey - KH stats lookup',
//     _description: `Send a notification when someone Look's up your CK stats on this server.`,
//     _discordEnabled: true,
//     authorID: '',
//     serverID: '',
//     owner: '',
//     name: 'notify-ck-stats-keyholder',
//     state: false,
//     where: 'Discord'
//   }
// ]

export async function defaultNotifications(serverID: string) {
  try {
    const resp = await Axios(`${process.env.BOT_HOST}/available/notifications`, {
      method: "POST",
      data: {
        serverID: serverID
      },
      headers: buildRequestHeaders()
    });

    if (resp.status === 200) {
      return resp.data
    }
  } catch (error) { return [] }
}