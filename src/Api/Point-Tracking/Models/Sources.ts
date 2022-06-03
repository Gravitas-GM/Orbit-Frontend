import { ObjectId } from "..";
import { pointTrackingClient } from "../..";

export interface PointSourceEndpoints {
	'/sources/account/:account': {
		POST: {
			body: PointSourceItemSetPayload;
			response: void;
		};

		GET: {
			response: PointSourceItem[];
		};

		DELETE: {
			response: void;
		};
	};

	'/sources/:source': {
		DELETE: {
			response: void;
		};
	};
}

export interface PointSourceItem {
	id: ObjectId;
	name: string;
	point_value: number;
}

export type PointSourceItemSetPayload = Omit<PointSourceItem, 'id'>;

export class PointSourceModel {
	public static set(accountId: number, payload: PointSourceItemSetPayload) {
		return pointTrackingClient.post<'/sources/account/:account'>(`/sources/account/${accountId}`, payload);
	}

	public static list(accountId: number) {
		return pointTrackingClient.get<'/sources/account/:account'>(`/sources/account/${accountId}`);
	}

	public static delete(sourceId: ObjectId) {
		return pointTrackingClient.delete<'/sources/:source'>(`/sources/${sourceId.$oid}`);
	}

	public static clear(accountId: number) {
		return pointTrackingClient.delete<'/sources/account/:account'>(`/sources/account/${accountId}`);
	}
}
