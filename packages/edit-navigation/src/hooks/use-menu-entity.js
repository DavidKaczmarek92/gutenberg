/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
/**
 * Internal dependencies
 */
import { MENU_KIND, MENU_POST_TYPE } from '../utils/constants';

import { untitledMenu } from './index';

export default function useMenuEntity( menuId ) {
	const { editEntityRecord, saveEditedEntityRecord } = useDispatch( 'core' );

	const menuEntityData = [ MENU_KIND, MENU_POST_TYPE, menuId ];
	const editedMenu = useSelect(
		( select ) =>
			menuId &&
			select( 'core' ).getEditedEntityRecord( ...menuEntityData ),
		[ menuId ]
	);

	const editedMenuName = menuId && editedMenu.name;

	const saveMenuName = () =>
		editedMenuName && saveEditedEntityRecord( ...menuEntityData );

	const editMenuName = ( name = untitledMenu ) =>
		editEntityRecord( ...menuEntityData, { name } );

	return {
		saveMenuName,
		editMenuName,
	};
}