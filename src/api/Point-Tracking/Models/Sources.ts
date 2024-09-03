import { ObjectId } from "..";
import {Id, pointTrackingClient} from '../..';

export interface PointSourceEndpoints {
	'/sources/account/:account': {
		POST: {
			params: Id;
			body: PointSourceItemSetPayload;
			response: PointSourceItem;
		};

		GET: {
			params: Id;
			response: PointSourceItem[];
		};

		DELETE: {
			params: Id;
			response: void;
		};
	};

	'/sources/:source': {
		DELETE: {
			params: Id;
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
	public static set(accountId: Id, payload: PointSourceItemSetPayload) {
		return pointTrackingClient.post<'/sources/account/:account'>(`/sources/account/${accountId}`, payload);
	}

	public static list(accountId: Id) {
		return pointTrackingClient.get<'/sources/account/:account'>(`/sources/account/${accountId}`);
	}

	public static delete(sourceId: ObjectId) {
		return pointTrackingClient.delete<'/sources/:source'>(`/sources/${sourceId.$oid}`);
	}

	public static clear(accountId: Id) {
		return pointTrackingClient.delete<'/sources/account/:account'>(`/sources/account/${accountId}`);
	}
}
