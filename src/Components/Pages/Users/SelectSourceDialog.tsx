import {Button, Classes, Dialog, FormGroup, Intent} from '@blueprintjs/core';
import {Select2} from '@blueprintjs/select';
import * as React from 'react';
import {PointSourceItem} from '../../../Api/Point-Tracking/Models/Sources';
import {SelectItemRenderer} from '../../SelectItemRenderer';

interface IProps {
	sources: PointSourceItem[];
	onClose: () => void;
	onSubmit: () => void;
	onSelectSource: (selectedSource: PointSourceItem) => void;
}

export const SelectSourceDialog: React.FC<IProps> = (props) => {
	return (
		<Dialog onClose={props.onClose} isOpen={true} title="Give Points">
			<div className={Classes.DIALOG_BODY}>
				<p className={Classes.RUNNING_TEXT}>
					Select a point source to give user.
				</p>

				<form>
					<FormGroup
						label="Source"
					>
						<Select2
							items={props.sources}
							itemRenderer={item => (
								<SelectItemRenderer label={item.name} />
							)}
							onItemSelect={props.onSelectSource}
						/>
					</FormGroup>
				</form>
			</div>

			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button text="Cancel" onClick={props.onClose} />

					<Button
						intent={Intent.PRIMARY}
						text="Submit"
						onClick={props.onSubmit}
					/>
				</div>
			</div>
		</Dialog>
	);
}

SelectSourceDialog.displayName = 'SelectSourceDialog';
