import {IconName, NonIdealState} from '@blueprintjs/core'

import React from 'react'

interface IProps {
	title: string
	description: string
	action: JSX.Element
	icon: IconName
}

export const NoData: React.FC<IProps> = ({title, description, action, icon}) =>
	<NonIdealState  title={title} description={description} icon={icon} action={action}/>
