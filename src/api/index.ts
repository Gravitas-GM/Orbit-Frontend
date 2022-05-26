import * as hubApi from "./hub";
import * as pointTrackingApi from "./point-tracking";

export const hubApiClient = hubApi.init();
export const pointTrackingClient = pointTrackingApi.init();
