import {ObjectId} from '..';
import {Id, pointTrackingClient} from '../..';
import {parseApiTimestamp} from '../../../Components/Utility/date';

export interface PointsEndpoints {
	'/points/users/:user': {
		PUT: {
			params: Id;
			body: PointItemCreatePayloadNormalized;
			response: PointItem;
		};

		GET: {
			params: Id;
			response: UserPoints;
		};

		DELETE: {
			params: Id;
			response: void;
		};
	};

	'/points/users/:user/:claim': {
		DELETE: {
			params: Id;
			response: void;
		};
	};

	'/points/users/:user/total': {
		GET: {
			params: Id;
			response: UserPointsSummary;
		};
	};

	'/points/account/:account': {
		GET: {
			params: Id;
			response: UserPoints[];
		};
	};

	'/points/account/:account/total': {
		GET: {
			params: Id;
			response: UserPointsSummary[];
		}
	};
}

interface BaseUserPoints {
	user_id: number;
	user_name: string;
}

export interface UserPoints extends BaseUserPoints {
	points: PointItem[];
}

export interface UserPointsSummary extends BaseUserPoints {
	points: number;
}

export interface PointItem {
	id: ObjectId;
	timestamp: Date;
	point_value: number;
	source: string;
	description?: string;
}

export type PointItemCreatePayload = Omit<PointItem, 'id'>;
type PointItemCreatePayloadNormalized = Omit<PointItemCreatePayload, 'timestamp'> & {
	timestamp: string;
};

export class PointsModel {
	public static create(userId: Id, payload: PointItemCreatePayload) {
		return pointTrackingClient.put<'/points/users/:user'>(`/points/users/${userId}`, {
			...payload,
			timestamp: payload.timestamp.toISOString(),
		});
	}

	public static getFull(userId: Id) {
		return pointTrackingClient.get<'/points/users/:user'>(`/points/users/${userId}`).then(response => {
			response.data.points = response.data.points.map(this.denormalizePointItem);

			return response;
		});
	}

	public static getSummary(userId: Id) {
		return pointTrackingClient.get<'/points/users/:user/total'>(`/points/users/${userId}/total`);
	}

	public static getAll(accountId: Id) {
		return pointTrackingClient.get<'/points/account/:account'>(`/points/account/${accountId}`).then(response => {
			response.data = response.data.map(userPoints => {
				userPoints.points = userPoints.points.map(this.denormalizePointItem);

				return userPoints;
			});

			return response;
		});
	}

	public static getAllSummary(accountId: Id) {
		return pointTrackingClient.get<'/points/account/:account/total'>(`/points/account/${accountId}/total`);
	}

	public static deleteAll(userId: Id) {
		return pointTrackingClient.delete<'/points/users/:user'>(`/points/users/${userId}`);
	}

	public static delete(userId: Id, claimId: ObjectId) {
		return pointTrackingClient.delete<'/points/users/:user/:claim'>(`/points/users/${userId}/${claimId.$oid}`);
	}

	private static denormalizePointItem(pointItem: PointItem) {
		pointItem.timestamp = parseApiTimestamp(pointItem.timestamp);

		return pointItem;
	}
}
