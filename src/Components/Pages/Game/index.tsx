import {Sidebar} from "./Sidebar"

function Game() {
  return (
	<section style={{height: '100%', display: 'grid', gridTemplateColumns: '5fr minmax(300px, 1fr)'}}>
		<div className="gm-page-wrapper">Board</div>
		<Sidebar>
			<div><h2>Card Example</h2> Card Content</div>
		</Sidebar>
	</section>
  )
}
export {Game}