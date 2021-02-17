/** @typedef {import('@octokit/rest').Octokit} GitHub */
/** @typedef {import('@octokit/types').Endpoints} Endpoints */
/** @typedef { Endpoints["GET /repos/{owner}/{repo}/issues"]["response"] } listIssuesResponse  */
/** @typedef { Endpoints["GET /repos/{owner}/{repo}/milestones"]["response"] } listMilestonesResponse  */

/**
 * @template T
 * @typedef {import('@octokit/types').GetResponseDataTypeFromEndpointMethod<T>} GetResponseDataTypeFromEndpointMethod
 */

/**
 * @typedef {"open"|"closed"|"all"} IssueState
 */

/**
 * Returns a promise resolving to a milestone by a given title, if exists.
 *
 * @param {GitHub} octokit Initialized Octokit REST client.
 * @param {string} owner   Repository owner.
 * @param {string} repo    Repository name.
 * @param {string} title   Milestone title.
 *
 * @return {Promise<listMilestonesResponse["data"]|undefined>} Promise resolving to milestone, if exists.
 */
async function getMilestoneByTitle( octokit, owner, repo, title ) {
	const responses = octokit.paginate.iterator(
		octokit.issues.listMilestones,
		{ owner, repo }
	);

	for await ( const response of responses ) {
		const milestones = response.data;
		for ( const milestone of milestones ) {
			if ( milestone.title === title ) {
				return milestone;
			}
		}
	}
	return undefined;
}

/**
 * Returns a promise resolving to pull requests by a given milestone ID.
 *
 * @param {GitHub}     octokit       Initialized Octokit REST client.
 * @param {string}     owner         Repository owner.
 * @param {string}     repo          Repository name.
 * @param {number}     milestone     Milestone ID.
 * @param {IssueState} [state]       Optional issue state.
 * @param {string}     [closedSince] Optional timestamp.
 *
 * @return {Promise<listIssuesResponse["data"]>} Promise resolving to pull
 *                                                    requests for the given
 *                                                    milestone.
 */
async function getIssuesByMilestone(
	octokit,
	owner,
	repo,
	milestone,
	state,
	closedSince
) {
	const options = octokit.issues.listForRepo.endpoint.merge( {
		owner,
		repo,
		milestone,
		state,
		...( closedSince && {
			since: closedSince,
		} ),
	} );

	const responses = octokit.paginate.iterator( options );

	/**
	 * @type {GetResponseDataTypeFromEndpointMethod<typeof octokit.issues.listForRepo>}
	 */
	const pulls = [];

	for await ( const response of responses ) {
		const issues = response.data;
		pulls.push( ...issues );
	}

	if ( closedSince ) {
		const closedSinceTimestamp = new Date( closedSince );

		return pulls.filter(
			( pull ) =>
				pull.closed_at &&
				closedSinceTimestamp <
					new Date(
						// The ugly `as unknown as string` cast is required because of
						// https://github.com/octokit/plugin-rest-endpoint-methods.js/issues/64
						// Fixed in Octokit v18.1.1, see https://github.com/WordPress/gutenberg/pull/29043
						/** @type {string} */ (
							/** @type {unknown} */ ( pull.closed_at )
						)
					)
		);
	}

	return pulls;
}

module.exports = {
	getMilestoneByTitle,
	getIssuesByMilestone,
};
