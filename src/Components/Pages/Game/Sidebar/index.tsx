import {Button, Icon} from "@blueprintjs/core"
import './Sidebar.scss'
interface IProps {
	children: React.ReactNode
}
export const Sidebar: React.FC<IProps> = props => (
		<aside className="gm-sidebar">
			<div>
				{props.children}
			</div>

			<Button intent="primary" large>
				Start <Icon icon="caret-right" size={20} />
			</Button>
		</aside>
)

