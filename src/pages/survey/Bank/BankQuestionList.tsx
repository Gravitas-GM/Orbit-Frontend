import {Blockquote} from '@blueprintjs/core';
import {ReactElement, useCallback, useEffect, useState} from 'react';
import {BankSurvey, SurveyBankModel} from '../../../api/Survey/Models/SurveyBankModel';
import {BankQuestion, SurveyBankQuestionModel} from '../../../api/Survey/Models/SurveyBankQuestionModel';
import {DeleteDialog} from '../../../components/DeleteDialog';
import {FrameLoadingSpinner} from '../../../components/FrameLoadingSpinner';
import {withRouteParams, WithRouteParamsProps} from '../../../components/Router/withRouteParams';
import {toaster} from '../../../toaster';
import {allSettled} from '../../../utility/promise';
import {SurveyList} from '../SurveyList';

function BankQuestionList({params}: WithRouteParamsProps<RouteParams>): ReactElement {
	// Used to trigger a component refresh e.g. after deleting items.
	const [sequence, setSequence] = useState(0);
	const [survey, setSurvey] = useState<BankSurvey | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<BankQuestion[]>([]);

	useEffect(() => {
		// Ensure survey is `null` when reloading data, to hide any UI changes behind the loading spinner.
		setSurvey(null);

		if (!params.bank)
			throw new Error('Cannot load bank question list without an ID');

		SurveyBankModel.read(params.bank).then(r => setSurvey(r.data));
	}, [params.bank, sequence]);

	const onQuestionDelete = useCallback(setDeleteTarget, []);
	const onDeleteCancel = useCallback(() => setDeleteTarget([]), []);
	const onDeleteConfirm = useCallback(async () => {
		if (deleteTarget.length === 0)
			return;

		const promises = deleteTarget.map(item => SurveyBankQuestionModel.delete(item.id));
		const results = await allSettled(promises);
		const failures = results.filter(item => item.status === 'rejected');

		if (failures.length > 0)
			toaster.warning('Some items could not be deleted. Please try again later.');
		else
			toaster.success(`Question${results.length !== 1 ? 's' : ''} deleted successfully.`);

		setDeleteTarget([]);
		setSequence(s => s + 1);
	}, [deleteTarget]);

	if (survey === null)
		return <FrameLoadingSpinner />;

	const deleteSubject = deleteTarget.length === 1 ? 'a question' : 'multiple questions';

	return (
		<>
			<SurveyList
				survey={survey}
				baseUri="/survey/bank/questions"
				onQuestionDelete={onQuestionDelete}
			/>

			<DeleteDialog
				isOpen={deleteTarget.length > 0}
				onConfirm={onDeleteConfirm}
				onCancel={onDeleteCancel}
				subject="DELETE"
			>
				<>
					<p>
						You are about to delete {deleteSubject} with the following
						prompt{deleteTarget?.length !== 1 ? 's' : ''}:
					</p>

					{deleteTarget?.map(item => (
						<Blockquote>{item.prompt}</Blockquote>
					))}

					<p>
						This action cannot be undone. To confirm, type "DELETE" in the box below then click "Confirm."
					</p>
				</>
			</DeleteDialog>
		</>
	);
}

interface RouteParams {
	bank: string,
}

const Wrapped = withRouteParams(BankQuestionList);
export {Wrapped as BankQuestionList};
