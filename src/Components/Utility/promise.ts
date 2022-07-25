interface PromiseFulfilledResult<T> {
	status: 'fulfilled';
	value: T;
}

interface PromiseRejectedResult {
	status: 'rejected';
	reason: any;
}

type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;
type AllSettledResult<T> = Array<PromiseSettledResult<T extends PromiseLike<infer U> ? U : T>>;

export function allSettled<T>(promises: T[]): Promise<AllSettledResult<T>> {
	// If the browser supports Promise.allSettled(), use that instead of our polyfill. Lines are @ts-ignored because
	// Typescript thinks it knows that Promise.allSettled() can never exist due to the compiler's target settings.
	// @ts-ignore
	if (typeof Promise.allSettled !== 'undefined') {
		// @ts-ignore
		return Promise.allSettled(promises);
	}

	const settled: AllSettledResult<T> = new Array(promises.length);
	let settledCount = 0;

	return new Promise(resolve => {
		if (promises.length === 0)
			resolve([]);

		promises.forEach((item, index) => {
			let promise: Promise<any>;

			if (!(item instanceof Promise))
				promise = Promise.resolve(item);
			else
				promise = item;

			promise
				.then(result => {
					settled[index] = {
						status: 'fulfilled',
						value: result,
					};
				})
				.catch(error => {
					settled[index] = {
						status: 'rejected',
						reason: error,
					};
				})
				.finally(() => {
					if (++settledCount === promises.length)
						resolve(settled);
				});
		});
	});
}
