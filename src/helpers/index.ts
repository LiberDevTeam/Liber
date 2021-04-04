import { User } from "~/state/ducks/users/usersSlice";

export const username = (user: User) => user.username ? user.username : shortenUid(user.id);
export const shortenUid = (id: string) => id.substr(0, 8);