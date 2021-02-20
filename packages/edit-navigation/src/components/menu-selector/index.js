/**
 * WordPress dependencies
 */
import { MenuGroup, MenuItemsChoice, Button, Dropdown } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import AddMenu from '../add-menu';

export default function MenuSelector( { onSelectMenu, menus } ) {
	return (
		<div className="edit-navigation-menu-selector-wrapper">
			<div className="edit-navigation-menu-selector-header">
				{ __( 'Chose a menu to edit: ' ) }
			</div>
			<div className="edit-navigation-menu-selector">
				<div className="editor-styles-wrapper">
					<MenuGroup>
						<MenuItemsChoice
							onSelect={ onSelectMenu }
							choices={ menus.map( ( menu ) => ( {
								value: menu.id,
								label: menu.name,
							} ) ) }
						/>
					</MenuGroup>

					<Dropdown
						position="bottom left"
						renderToggle={ ( { isOpen, onToggle } ) => (
							<Button
								aria-expanded={ isOpen }
								onClick={ onToggle }
								className="components-button is-primary
					 edit-navigation__menu-selector__select-menu-button"
							>
								{ __( 'Create new menu' ) }
							</Button>
						) }
						renderContent={ () => (
							<AddMenu
								className="edit-navigation-header__add-menu"
								menus={ menus }
								onCreate={ onSelectMenu }
							/>
						) }
					/>
				</div>
			</div>
		</div>
	);
}
