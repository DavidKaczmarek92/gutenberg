/**
 * External dependencies
 */
import { find } from 'lodash';

export default function getClosestAvailableTemplate( slug, templates ) {

	// Fallback in case there are no templates.
	if ( ! templates.length ) {
		return {
			id: 'index',
			content: {
				raw: '',
			},
			slug: 'index',
			is_custom: false,
			type: 'wp_template',
			status: 'publish',
			wp_id: null,
		};
	}

	const template = find( templates, { slug } );
	if ( template ) {
		return template;
	}

	switch ( slug ) {
		case 'single':
		case 'page':
			return getClosestAvailableTemplate( 'singular', templates );
		case 'author':
		case 'category':
		case 'taxonomy':
		case 'date':
		case 'tag':
			return getClosestAvailableTemplate( 'archive', templates );
		case 'front-page':
			return getClosestAvailableTemplate( 'home', templates );
		case 'attachment':
			return getClosestAvailableTemplate( 'single', templates );
		case 'privacy-policy':
			return getClosestAvailableTemplate( 'page', templates );
	}

	return find( templates, { slug: 'index' } );
}
